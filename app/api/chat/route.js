import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT } from '@/lib/chatKnowledge';

const MODEL = 'claude-haiku-4-5-20251001';
const MAX_TURNS = 12; // trailing messages kept, to bound cost/context
const MAX_MESSAGE_LEN = 2000;

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
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages: cleaned,
    });

    const reply = response.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('\n')
      .trim();

    return NextResponse.json({ reply: reply || "Sorry, I didn't catch that — could you rephrase?" });
  } catch (err) {
    console.error('Chat API error:', err);
    return NextResponse.json(
      { error: "Something went wrong. Please call (908) 777-0631 or use the contact form." },
      { status: 500 }
    );
  }
}
