import { NextResponse } from 'next/server';
import {
  LIMITS, cleanStr, cleanLine, esc, escMultiline, resolveContactMethods,
  readJsonObject, sendEmail, failureStatus, failureBody,
} from '../../../lib/formHandler';

// Quote-request handler for the Government Contracting page's "Request a
// Quote" form. Mirrors app/api/contact/route.js's pattern deliberately: the
// Resend client is created inside the request path (see lib/formHandler.js),
// never at module scope. Reuses the existing RESEND_API_KEY.
//
// Hardened 2026-10-16: input validated/escaped; success only after Resend
// accepts the send; a malformed email never becomes replyTo, but a lead with
// a usable phone is still delivered.
export async function POST(request) {
  const body = await readJsonObject(request);
  if (!body) {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const name = cleanStr(body.name, LIMITS.name);
  const organization = cleanStr(body.organization, LIMITS.short);
  const description = cleanStr(body.description, LIMITS.message);
  const contact = resolveContactMethods(body.email, body.phone);

  if (!name || !description || !contact.hasContactMethod) {
    return NextResponse.json(
      { error: 'Missing required fields — name, description, and at least one valid contact method are required.' },
      { status: 400 }
    );
  }

  const emailLine = contact.email
    ? esc(contact.email)
    : contact.invalidEmailInput
      ? `${esc(contact.invalidEmailInput)} <em>(not a valid email format — as entered)</em>`
      : '—';

  const result = await sendEmail(
    {
      from: 'Zarcone Photography <noreply@zarconephotography.com>',
      to: 'tom.zarcone@mac.com',
      replyTo: contact.email || undefined,
      subject: cleanLine(`Government Contracting Quote Request — ${name}${organization ? ` (${organization})` : ''}`),
      html: `
        <h2>Government Contracting — Quote Request</h2>
        <p><strong>Name:</strong> ${esc(name)}</p>
        <p><strong>Agency / Organization:</strong> ${esc(organization) || '—'}</p>
        <p><strong>Email:</strong> ${emailLine}</p>
        <p><strong>Phone:</strong> ${esc(contact.phone || contact.invalidPhoneInput) || '—'}</p>
        <hr />
        <p><strong>Description:</strong></p>
        <p>${escMultiline(description)}</p>
      `,
    },
    'govcon-quote'
  );

  if (!result.ok) {
    return NextResponse.json(failureBody(result, 'Failed to send request.'), { status: failureStatus(result) });
  }
  return NextResponse.json({ success: true });
}
