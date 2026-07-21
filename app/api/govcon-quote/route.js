import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Quote-request handler for the Government Contracting page's "Request a
// Quote" form. Mirrors app/api/contact/route.js's pattern deliberately:
// the Resend client is instantiated inside the request handler (not at
// module scope) — a module-scope client previously broke preview-branch
// builds on this project (see memory: program-contact Resend bug). Reuses
// the existing RESEND_API_KEY — no new env var required.
export async function POST(request) {
  const body = await request.json();
  const { name, organization, email, phone, description } = body;

  if (!name || !description || (!email && !phone)) {
    return NextResponse.json(
      { error: 'Missing required fields — name, description, and at least one contact method are required.' },
      { status: 400 }
    );
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'Zarcone Photography <noreply@zarconephotography.com>',
      to: 'tom.zarcone@mac.com',
      replyTo: email || undefined,
      subject: `Government Contracting Quote Request — ${name}${organization ? ` (${organization})` : ''}`,
      html: `
        <h2>Government Contracting — Quote Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Agency / Organization:</strong> ${organization || '—'}</p>
        <p><strong>Email:</strong> ${email || '—'}</p>
        <p><strong>Phone:</strong> ${phone || '—'}</p>
        <hr />
        <p><strong>Description:</strong></p>
        <p>${description.replace(/\n/g, '<br />')}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Resend error (govcon-quote):', err);
    return NextResponse.json({ error: 'Failed to send request.' }, { status: 500 });
  }
}
