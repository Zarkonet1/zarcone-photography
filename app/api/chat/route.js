import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { Resend } from 'resend';
import { SYSTEM_PROMPT } from '@/lib/chatKnowledge';

const MODEL = 'claude-haiku-4-5-20251001';
const MAX_TURNS = 12; // trailing messages kept, to bound cost/context
const MAX_MESSAGE_LEN = 2000;

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

// Defense-in-depth: the system prompt tells the model to never use markdown,
// but strip common artifacts anyway since the widget renders plain text only.
function stripMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // **bold**
    .replace(/\*(.*?)\*/g, '$1')     // *italic*
    .replace(/^#{1,6}\s+/gm, '')     // # headers
    .replace(/^\s*[-*]\s+/gm, '')    // - bullet / * bullet
    .replace(/^\s*\d+\.\s+/gm, '');  // 1. numbered list
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

export async function POST(request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: 'Chat is temporarily unavailable. Please call (908) 777-0631 or use the contact form.' },
      { status: 503 }
    );
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
      tools: [LEAD_TOOL],
    });

    const toolUse = response.content.find(block => block.type === 'tool_use' && block.name === 'submit_lead_inquiry');
    if (toolUse) {
      // Fire-and-forget side effect — don't make the visitor wait on email delivery,
      // but do await it so serverless doesn't kill the function mid-send.
      await sendLeadEmail(toolUse.input || {});
    }

    let reply = stripMarkdown(
      response.content
        .filter(block => block.type === 'text')
        .map(block => block.text)
        .join('\n')
    ).trim();

    if (!reply && toolUse) {
      reply = "Thanks — I've sent that to Tom and he'll follow up within 24 hours.";
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
