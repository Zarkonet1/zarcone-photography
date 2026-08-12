import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { Resend } from 'resend';
import { SYSTEM_PROMPT } from '@/lib/chatKnowledge';

const MODEL = 'claude-haiku-4-5-20251001';
const MAX_TURNS = 12; // trailing messages kept, to bound cost/context
const MAX_MESSAGE_LEN = 2000;

// --- Rate limiting (in-memory, per-serverless-instance) ---
// Not distributed: resets on cold start and isn't shared across concurrent
// Vercel instances, so it's a soft ceiling, not a hard guarantee. Good enough
// to stop a single script/bad actor hammering the endpoint in one session,
// which is the realistic risk at this site's traffic level. If real abuse
// shows up (cost spikes, coordinated hits from many IPs), upgrade to
// Upstash Redis + @upstash/ratelimit for a durable, shared limit instead of
// tightening these numbers.
const BURST_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const BURST_MAX = 10;                  // messages per IP per window
const DAY_WINDOW_MS = 24 * 60 * 60 * 1000;
const DAY_MAX = 40;                    // messages per IP per day

const rateBuckets = new Map(); // ip -> { windowStart, windowCount, dayStart, dayCount }

function getClientIp(request) {
  const fwd = request.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return request.ip || 'unknown';
}

function checkRateLimit(ip) {
  const now = Date.now();
  let bucket = rateBuckets.get(ip);
  if (!bucket) {
    bucket = { windowStart: now, windowCount: 0, dayStart: now, dayCount: 0 };
    rateBuckets.set(ip, bucket);
  }
  if (now - bucket.windowStart > BURST_WINDOW_MS) {
    bucket.windowStart = now;
    bucket.windowCount = 0;
  }
  if (now - bucket.dayStart > DAY_WINDOW_MS) {
    bucket.dayStart = now;
    bucket.dayCount = 0;
  }
  bucket.windowCount += 1;
  bucket.dayCount += 1;

  // Bound the map's size on a long-lived warm instance — sweep stale entries
  // occasionally rather than on every request.
  if (rateBuckets.size > 500) {
    for (const [key, b] of rateBuckets) {
      if (now - b.dayStart > DAY_WINDOW_MS) rateBuckets.delete(key);
    }
  }

  if (bucket.windowCount > BURST_MAX) {
    return { limited: true, message: "You're sending messages a bit fast — give it a minute and try again, or call (908) 777-0631." };
  }
  if (bucket.dayCount > DAY_MAX) {
    return { limited: true, message: "You've hit today's message limit for this chat — please call (908) 777-0631 or use the contact form. It resets tomorrow." };
  }
  return { limited: false };
}

const LEAD_TOOL = {
  name: 'submit_lead_inquiry',
  description:
    "Submit a visitor's booking inquiry to Tom by email. Only call this once you have at least the visitor's name and one way to reach them (email or phone). Leave any field you don't have as an empty string — do not stall the conversation trying to collect every field first.",
  input_schema: {
    type: 'object',
    properties: {
      name: { type: 'string', description: "Visitor's name" },
      email: { type: 'string', description: "Visitor's email address, if given" },
      phone: { type: 'string', description: "Visitor's phone number, if given" },
      event_date: { type: 'string', description: 'Desired session/event date, if mentioned' },
      location: { type: 'string', description: 'Location or general area, if mentioned' },
      session_type: { type: 'string', description: 'Type of photography requested (e.g. senior portrait, football season, wedding-adjacent event, design/poster)' },
      headcount: { type: 'string', description: 'Number of people involved, if mentioned' },
      special_requests: { type: 'string', description: 'Any other relevant details the visitor shared' },
    },
    required: ['name'],
  },
};

const ESCALATE_TOOL = {
  name: 'escalate_to_human',
  description:
    "Alert Tom immediately by email that this conversation needs his direct attention — the visitor asked for a real person, asked something outside what you're able to answer, or seems frustrated/unhappy. This fires a real-time alert, separate from and in addition to submit_lead_inquiry — call both if both apply. Call this at most once per conversation unless the situation changes materially.",
  input_schema: {
    type: 'object',
    properties: {
      reason: {
        type: 'string',
        description: 'Short category for why this needs Tom: e.g. "asked for a human", "question outside knowledge base", "frustrated/unhappy visitor", "complaint".',
      },
      summary: {
        type: 'string',
        description: "One or two sentences summarizing what the visitor wants or is asking, in your own words.",
      },
      contact_info: {
        type: 'string',
        description: "Any name, email, or phone the visitor has shared so far, if any. Leave empty string if none given yet.",
      },
    },
    required: ['reason', 'summary'],
  },
};

// Defense-in-depth: the system prompt tells the model to never use markdown,
// but strip common artifacts anyway since the widget renders plain text only.
// Known internal route paths — if the model slips and echoes one of these raw
// into a reply (e.g. "/about#contact"), strip it out rather than show a dead,
// unclickable path to a visitor.
const KNOWN_PATHS = /\/(about|pricing|faq|sports|portraits|events|design|portrait-parties|blog|news)(#[a-z0-9-]+)?/gi;

function stripMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // **bold**
    .replace(/\*(.*?)\*/g, '$1')     // *italic*
    .replace(/^#{1,6}\s+/gm, '')     // # headers
    .replace(/^\s*[-*]\s+/gm, '')    // - bullet / * bullet
    .replace(/^\s*\d+\.\s+/gm, '')   // 1. numbered list
    .replace(KNOWN_PATHS, '')        // stray raw route paths
    .replace(/\n{2,}/g, ' ')         // collapse blank-line paragraph breaks into one paragraph
    .replace(/\n/g, ' ')             // collapse any remaining single line breaks too
    .replace(/[ \t]{2,}/g, ' ');     // tidy up any double spaces that leaves behind
}

async function sendLeadEmail(fields) {
  const hasContactMethod = (fields.email && fields.email.trim()) || (fields.phone && fields.phone.trim());
  if (!fields.name || !fields.name.trim() || !hasContactMethod) {
    // Not enough to act on — skip silently rather than emailing a dead lead.
    return;
  }
  if (!process.env.RESEND_API_KEY) return;

  const rows = [
    ['Name', fields.name],
    ['Email', fields.email],
    ['Phone', fields.phone],
    ['Event Date', fields.event_date],
    ['Location', fields.location],
    ['Session Type', fields.session_type],
    ['Headcount', fields.headcount],
    ['Special Requests', fields.special_requests],
  ].filter(([, v]) => v && String(v).trim());

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'Zarcone Photography <noreply@zarconephotography.com>',
      to: 'tom.zarcone@mac.com',
      replyTo: fields.email && fields.email.trim() ? fields.email : undefined,
      subject: `AI Chat Lead — ${fields.name}`,
      html: `
        <h2>New Lead from AI Chat Widget</h2>
        ${rows.map(([label, value]) => `<p><strong>${label}:</strong> ${value}</p>`).join('\n')}
      `,
    });
  } catch (err) {
    console.error('Lead email error:', err);
  }
}

async function sendEscalationEmail(fields, recentMessages) {
  if (!process.env.RESEND_API_KEY) return;

  const transcript = (recentMessages || [])
    .slice(-8)
    .map(m => `${m.role === 'user' ? 'Visitor' : 'Bot'}: ${m.content}`)
    .join('\n');

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'Zarcone Photography <noreply@zarconephotography.com>',
      to: 'tom.zarcone@mac.com',
      subject: `Chat needs you now — ${fields.reason || 'escalation'}`,
      html: `
        <h2>Live Chat Escalation</h2>
        <p><strong>Reason:</strong> ${fields.reason || 'Not specified'}</p>
        <p><strong>Summary:</strong> ${fields.summary || 'Not specified'}</p>
        ${fields.contact_info && fields.contact_info.trim() ? `<p><strong>Contact info given:</strong> ${fields.contact_info}</p>` : '<p><strong>Contact info given:</strong> none yet</p>'}
        <p><strong>Recent conversation:</strong></p>
        <pre style="white-space: pre-wrap; font-family: inherit;">${transcript}</pre>
      `,
    });
  } catch (err) {
    console.error('Escalation email error:', err);
  }
}

export async function POST(request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: 'Chat is temporarily unavailable. Please call (908) 777-0631 or use the contact form.' },
      { status: 503 }
    );
  }

  const clientIp = getClientIp(request);
  const rate = checkRateLimit(clientIp);
  if (rate.limited) {
    return NextResponse.json({ error: rate.message }, { status: 429 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const { messages } = body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: 'Missing messages.' }, { status: 400 });
  }

  // Sanitize: only role/content strings, trimmed length, trailing window.
  const cleaned = messages
    .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .map(m => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_LEN) }))
    .slice(-MAX_TURNS);

  if (cleaned.length === 0 || cleaned[cleaned.length - 1].role !== 'user') {
    return NextResponse.json({ error: 'Invalid message sequence.' }, { status: 400 });
  }

  try {
    const nowET = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(new Date());
    const systemPrompt = `${SYSTEM_PROMPT}\n\nRIGHT NOW: it is ${nowET} (Eastern Time, business's local time zone). Use this to answer hours/open-now questions against the published hours above.`;

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 500,
      system: systemPrompt,
      messages: cleaned,
      tools: [LEAD_TOOL, ESCALATE_TOOL],
    });

    const toolUse = response.content.find(block => block.type === 'tool_use' && block.name === 'submit_lead_inquiry');
    if (toolUse) {
      // Fire-and-forget side effect — don't make the visitor wait on email delivery,
      // but do await it so serverless doesn't kill the function mid-send.
      await sendLeadEmail(toolUse.input || {});
    }

    const escalation = response.content.find(block => block.type === 'tool_use' && block.name === 'escalate_to_human');
    if (escalation) {
      await sendEscalationEmail(escalation.input || {}, cleaned);
    }

    let reply = stripMarkdown(
      response.content
        .filter(block => block.type === 'text')
        .map(block => block.text)
        .join('\n')
    ).trim();

    if (!reply && toolUse && escalation) {
      reply = "Thanks — I've sent that to Tom and flagged this for him to jump in directly. He'll follow up as soon as he can.";
    } else if (!reply && toolUse) {
      reply = "Thanks — I've sent that to Tom and he'll follow up within 24 hours.";
    } else if (!reply && escalation) {
      reply = "I've let Tom know he's needed here directly — he'll follow up as soon as he can.";
    }

    return NextResponse.json({ reply: reply || "Sorry, I didn't catch that — could you rephrase?" });
  } catch (err) {
    console.error('Chat API error:', err);
    return NextResponse.json(
      { error: "Something went wrong. Please call (908) 777-0631 or use the contact form." },
      { status: 500 }
    );
  }
}
