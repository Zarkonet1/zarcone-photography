import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request) {
  const body = await request.json();
  const { fname, lname, email, phone, type, date, message } = body;

  if (!fname || !email || !message) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'Zarcone Photography <noreply@zarconephotography.com>',
      to: 'tom.zarcone@mac.com',
      replyTo: email,
      subject: `Contact Form — ${fname} ${lname || ''}`.trim(),
      html: `
        <h2>Contact Form Submission</h2>
        <p><strong>Name:</strong> ${fname} ${lname || ''}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || '—'}</p>
        <p><strong>Session Type:</strong> ${type || '—'}</p>
        <p><strong>Preferred Date:</strong> ${date || '—'}</p>
        <hr />
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br />')}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Resend error:', err);
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 });
  }
}
