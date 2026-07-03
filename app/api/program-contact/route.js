import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  const { name, title, school, sport, email, phone, message } = await request.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  try {
    await resend.emails.send({
      from: 'Zarcone Photography <noreply@zarconephotography.com>',
      to: 'tom.zarcone@mac.com',
      replyTo: email,
      subject: `Program Inquiry — ${school || name}`,
      html: `
        <h2>Program Inquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Title / Role:</strong> ${title || '—'}</p>
        <p><strong>School / Program:</strong> ${school || '—'}</p>
        <p><strong>Sport(s):</strong> ${sport || '—'}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || '—'}</p>
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
