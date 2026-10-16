import { NextResponse } from 'next/server';
import {
  LIMITS, cleanStr, cleanEmailInput, cleanLine, esc, escMultiline, isValidEmail,
  readJsonObject, sendEmail, failureStatus, failureBody, guardRequest, looksLikeSpam,
} from '../../../lib/formHandler';

// Hardened 2026-10-16: validates/escapes input, and only reports success when
// Resend actually accepted the send (SDK 3.5.0 resolves { data, error } rather
// than throwing — see lib/formHandler.js).
export async function POST(request) {
  const blocked = guardRequest(request, 'contact', { max: 6 });
  if (blocked) return NextResponse.json({ error: blocked.error }, { status: blocked.status });

  const body = await readJsonObject(request);
  if (!body) {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const fname = cleanStr(body.fname, LIMITS.name);
  const lname = cleanStr(body.lname, LIMITS.name);
  const email = cleanEmailInput(body.email);
  const phone = cleanStr(body.phone, LIMITS.phone);
  const type = cleanStr(body.type, LIMITS.short);
  const date = cleanStr(body.date, LIMITS.short);
  const message = cleanStr(body.message, LIMITS.message);
  const athleteName = cleanStr(body.athleteName, LIMITS.name);
  const sport = cleanStr(body.sport, LIMITS.short);
  const source = cleanStr(body.source, LIMITS.short);

  if (!fname || !email || !message) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
  }

  const result = await sendEmail(
    {
      from: 'Zarcone Photography <noreply@zarconephotography.com>',
      to: 'tom.zarcone@mac.com',
      reply_to: email,
      subject: cleanLine(`${looksLikeSpam(message) ? '[Possible spam] ' : ''}Contact Form — ${fname} ${lname}`),
      html: `
        <h2>Contact Form Submission</h2>
        ${source ? `<p><strong>Source:</strong> ${esc(source)}</p>` : ''}
        <p><strong>Name:</strong> ${esc(fname)} ${esc(lname)}</p>
        <p><strong>Email:</strong> ${esc(email)}</p>
        <p><strong>Phone:</strong> ${esc(phone) || '—'}</p>
        ${athleteName ? `<p><strong>Athlete Name:</strong> ${esc(athleteName)}</p>` : ''}
        ${sport ? `<p><strong>Sport:</strong> ${esc(sport)}</p>` : ''}
        <p><strong>Interested In / Session Type:</strong> ${esc(type) || '—'}</p>
        <p><strong>Preferred Date:</strong> ${esc(date) || '—'}</p>
        <hr />
        <p><strong>Message:</strong></p>
        <p>${escMultiline(message)}</p>
      `,
    },
    'contact'
  );

  if (!result.ok) {
    return NextResponse.json(failureBody(result, 'Failed to send message.'), { status: failureStatus(result) });
  }
  return NextResponse.json({ success: true });
}
