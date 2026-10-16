import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { sendEmail, readJsonObject } from '../../../lib/formHandler';
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
      organization: { type: 'string', description: 'School, team, booster club, league, company or other organization the request is for, if any. For any team, school or group request, ask for this before submitting.' },
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

// Escape visitor-supplied text before it goes into an HTML email.
function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Attribution context from the widget (2026-10-01). Only known keys, short strings.
function cleanContext(raw) {
  if (!raw || typeof raw !== 'object') return {};
  const keys = ['referrer', 'landingPage', 'chatPage', 'utmSource', 'utmMedium', 'utmCampaign'];
  const out = {};
  for (const k of keys) {
    if (typeof raw[k] === 'string' && raw[k].trim()) out[k] = raw[k].trim().slice(0, 300);
  }
  return out;
}

function describeSource(ctx) {
  if (ctx.utmSource) return `Campaign: ${ctx.utmSource}${ctx.utmMedium ? ' / ' + ctx.utmMedium : ''}`;
  if (!ctx.referrer) return 'Direct (typed URL, bookmark, or app that hides the referrer)';
  try {
    const host = new URL(ctx.referrer).hostname.replace(/^www\./, '');
    if (host.includes('zarconephotography.com')) return 'Internal (came from another page on this site)';
    if (/chatgpt\.com|openai\.com|perplexity\.ai|claude\.ai|gemini\.google|copilot\.microsoft/.test(host)) return `AI assistant (${host})`;
    if (/google\.|bing\.com|duckduckgo\.com|yahoo\./.test(host)) return `Search engine (${host})`;
    if (/facebook\.com|instagram\.com|t\.co|x\.com|linkedin\.com|tiktok\.com/.test(host)) return `Social (${host})`;
    return `Referral (${host})`;
  } catch {
    return 'Unknown';
  }
}

// Tool inputs come from the model and are not guaranteed to be strings. These
// coerce safely so .trim() can never throw on an object/number/array.
// Identity fields (name/email/phone) accept strings only: a stray number such
// as email: 42 must not count as a contact method.
function strictStr(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function str(value) {
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  return '';
}

function transcriptHtml(messages) {
  return (messages || [])
    .map(m => `<p style="margin:0 0 8px"><strong>${m.role === 'user' ? 'Visitor' : 'Bot'}:</strong> ${esc(m.content)}</p>`)
    .join('\n');
}

async function sendLeadEmail(fields, ctx = {}, transcript = []) {
  fields = fields && typeof fields === 'object' ? fields : {};
  const name = strictStr(fields.name);
  const email = strictStr(fields.email);
  const phone = strictStr(fields.phone);
  const hasContactMethod = Boolean(email || phone);
  if (!name || !hasContactMethod) {
    // Not enough to act on — skip silently rather than emailing a dead lead.
    return 'skipped';
  }

  const rows = [
    ['Name', name],
    ['Email', email],
    ['Phone', phone],
    ['Event Date', str(fields.event_date)],
    ['Organization', str(fields.organization)],
    ['Location', str(fields.location)],
    ['Session Type', str(fields.session_type)],
    ['Headcount', str(fields.headcount)],
    ['Special Requests', str(fields.special_requests)],
  ].filter(([, v]) => v);

  // sendEmail() inspects Resend's { data, error } contract (SDK 3.5.0 does not
  // throw on API failure) and treats a missing RESEND_API_KEY as a failure.
  const result = await sendEmail({
      from: 'Zarcone Photography <noreply@zarconephotography.com>',
      to: 'tom@zarconephotography.com',
      // Resend SDK 3.5.0 forwards the payload verbatim; its field is snake_case
      // `reply_to` (camelCase `replyTo` is silently ignored).
      reply_to: email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : undefined,
      subject: `AI Chat Lead — ${name}`.replace(/[\r\n]+/g, ' '),
      html: `
        <h2>New Lead from AI Chat Widget</h2>
        ${rows.map(([label, value]) => `<p><strong>${label}:</strong> ${esc(value)}</p>`).join('\n')}
        <h3>How they found the site</h3>
        <p><strong>Source:</strong> ${esc(describeSource(ctx))}</p>
        <p><strong>Referring URL:</strong> ${esc(ctx.referrer || 'none')}</p>
        <p><strong>First page viewed:</strong> ${esc(ctx.landingPage || 'unknown')}</p>
        <p><strong>Page where they chatted:</strong> ${esc(ctx.chatPage || 'unknown')}</p>
        <h3>Conversation</h3>
        ${transcriptHtml(transcript)}
      `,
  }, 'chat-lead');
  return result.ok ? 'sent' : 'failed';
}

async function sendEscalationEmail(fields, recentMessages, ctx = {}) {
  fields = fields && typeof fields === 'object' ? fields : {};
  const reason = str(fields.reason);
  const summary = str(fields.summary);
  const contactInfo = str(fields.contact_info);
  const transcript = (recentMessages || [])
    .slice(-8)
    .map(m => `${m.role === 'user' ? 'Visitor' : 'Bot'}: ${esc(m.content)}`)
    .join('\n');

  const result = await sendEmail({
      from: 'Zarcone Photography <noreply@zarconephotography.com>',
      to: 'tom@zarconephotography.com',
      subject: `Chat needs you now — ${reason || 'escalation'}`.replace(/[\r\n]+/g, ' '),
      html: `
        <h2>Live Chat Escalation</h2>
        <p><strong>Reason:</strong> ${esc(reason || 'Not specified')}</p>
        <p><strong>Summary:</strong> ${esc(summary || 'Not specified')}</p>
        ${contactInfo ? `<p><strong>Contact info given:</strong> ${esc(contactInfo)}</p>` : '<p><strong>Contact info given:</strong> none yet</p>'}
        <p><strong>Source:</strong> ${esc(describeSource(ctx))} · first page ${esc(ctx.landingPage || 'unknown')} · chatting on ${esc(ctx.chatPage || 'unknown')}</p>
        <p><strong>Recent conversation:</strong></p>
        <pre style="white-space: pre-wrap; font-family: inherit;">${transcript}</pre>
      `,
  }, 'chat-escalation');
  return result.ok ? 'sent' : 'failed';
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

  // readJsonObject returns null for malformed JSON AND for valid-but-non-object
  // bodies (null, [], "x", 42) — the latter used to throw a TypeError below.
  const body = await readJsonObject(request);
  if (!body) {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const { messages } = body;
  const ctx = cleanContext(body.context);
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

    const botText = response.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join(' ')
      .trim();
    const fullTranscript = botText ? [...cleaned, { role: 'assistant', content: botText }] : cleaned;

    let leadStatus = null;
    let escalationStatus = null;
    const toolUse = response.content.find(block => block.type === 'tool_use' && block.name === 'submit_lead_inquiry');
    if (toolUse) {
      // Fire-and-forget side effect — don't make the visitor wait on email delivery,
      // but do await it so serverless doesn't kill the function mid-send.
      leadStatus = await sendLeadEmail(toolUse.input || {}, ctx, fullTranscript);
    }

    const escalation = response.content.find(block => block.type === 'tool_use' && block.name === 'escalate_to_human');
    if (escalation) {
      escalationStatus = await sendEscalationEmail(escalation.input || {}, fullTranscript, ctx);
    }

    let reply = stripMarkdown(
      response.content
        .filter(block => block.type === 'text')
        .map(block => block.text)
        .join('\n')
    ).trim();

    // The model's own wording may claim "I've sent that to Tom". If the email
    // did not actually go out, say so instead of letting that claim stand.
    if (leadStatus === 'failed' || escalationStatus === 'failed') {
      return NextResponse.json({
        reply: "I wasn't able to pass that along to Tom just now, so please don't count on it reaching him. Please call (908) 777-0631 or use the contact form on the site and he'll get right back to you.",
      });
    }

    // A lead is "skipped" when it had no name or no email/phone, so nothing was
    // emailed. The model's own wording may still say "I've sent that to Tom",
    // so discard it and say what actually happened. If an escalation DID go
    // out, Tom has been notified, so confirm only that.
    if (leadStatus === 'skipped') {
      return NextResponse.json({
        reply: escalationStatus === 'sent'
          ? "I've let Tom know he's needed here directly. I don't have a name and a phone number or email for you yet, so please share those, or call (908) 777-0631, so he can follow up."
          : "I haven't sent anything to Tom yet because I don't have your name and a phone number or email. Please share those here, or call (908) 777-0631 or use the contact form on the site, and he'll follow up.",
      });
    }

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
