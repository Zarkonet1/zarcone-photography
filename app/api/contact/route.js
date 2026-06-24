import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  const body = await request.json();
  const { fname, lname, email, phone, type, date, message } = body;

  if (!fname || !lname || !email || !message) {
    return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
  }

  try {
    await resend.emails.send({
      from: 'Zarcone Photography <noreply@zarconephotography.com>',
      to: 'tom@zarconephotography.com',
      replyTo: email,
      subject: `New inquiry from ${fname} ${lname} — ${type || 'General'}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h2 style="margin-top: 0; color: #111;">New Contact Form Submission</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #555; width: 120px;"><strong>Name</strong></td>
              <td style="padding: 8px 0;">${fname} ${lname}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #555;"><strong>Email</strong></td>
              <td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #555;"><strong>Phone</strong></td>
              <td style="padding: 8px 0;">${phone || 'not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #555;"><strong>Type</strong></td>
              <td style="padding: 8px 0;">${type || 'not specified'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #555;"><strong>Date</strong></td>
              <td style="padding: 8px 0;">${date || 'not specified'}</td>
            </tr>
          </table>
          <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />
          <p style="color: #555; margin-bottom: 4px;"><strong>Message</strong></p>
          <p style="white-space: pre-wrap; margin: 0;">${message}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="color: #999; font-size: 12px; margin: 0;">
            Reply directly to this email to respond to ${fname}.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Contact form email failed:', err);
    return NextResponse.json({ success: false, error: 'Failed to send email' }, { status: 500 });
  }
}
