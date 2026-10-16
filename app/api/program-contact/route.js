import { NextResponse } from 'next/server';
import {
  LIMITS, cleanStr, cleanEmailInput, cleanLine, esc, escMultiline, isValidEmail,
  readJsonObject, sendEmail, failureStatus, failureBody,
} from '../../../lib/formHandler';

// Blog / program inquiry handler (ProgramInquiryForm). Hardened 2026-10-16:
// validates/escapes input and only reports success when Resend accepted it.
export async function POST(request) {
  const body = await readJsonObject(request);
  if (!body) {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const name = cleanStr(body.name, LIMITS.name);
  const title = cleanStr(body.title, LIMITS.short);
  const school = cleanStr(body.school, LIMITS.short);
  const sport = cleanStr(body.sport, LIMITS.short);
  const email = cleanEmailInput(body.email);
  const phone = cleanStr(body.phone, LIMITS.phone);
  const message = cleanStr(body.message, LIMITS.message);

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
  }

  const result = await sendEmail(
    {
      from: 'Zarcone Photography <noreply@zarconephotography.com>',
      to: 'tom.zarcone@mac.com',
      replyTo: email,
      subject: cleanLine(`Program Inquiry — ${school || name}`),
      html: `
        <h2>Program Inquiry</h2>
        <p><strong>Name:</strong> ${esc(name)}</p>
        <p><strong>Title / Role:</strong> ${esc(title) || '—'}</p>
        <p><strong>School / Program:</strong> ${esc(school) || '—'}</p>
        <p><strong>Sport(s):</strong> ${esc(sport) || '—'}</p>
        <p><strong>Email:</strong> ${esc(email)}</p>
        <p><strong>Phone:</strong> ${esc(phone) || '—'}</p>
        <hr />
        <p><strong>Message:</strong></p>
        <p>${escMultiline(message)}</p>
      `,
    },
    'program-contact'
  );

  if (!result.ok) {
    return NextResponse.json(failureBody(result, 'Failed to send message.'), { status: failureStatus(result) });
  }
  return NextResponse.json({ success: true });
}
