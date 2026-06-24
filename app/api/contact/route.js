import { NextResponse } from 'next/server';

export async function POST(request) {
  const body = await request.json();
  const { fname, lname, email, phone, type, date, message } = body;

  // ── Option A: Resend (recommended — free tier, easy setup)
  // 1. npm install resend
  // 2. Get API key at resend.com
  // 3. Set RESEND_API_KEY in Replit Secrets
  //
  // import { Resend } from 'resend';
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({
  //   from: 'noreply@zarconephotography.com',
  //   to: 'tom@zarconephotography.com',
  //   subject: `New inquiry from ${fname} ${lname} — ${type}`,
  //   html: `<p><strong>From:</strong> ${fname} ${lname} (${email})</p>
  //          <p><strong>Phone:</strong> ${phone || 'not provided'}</p>
  //          <p><strong>Type:</strong> ${type}</p>
  //          <p><strong>Date:</strong> ${date || 'TBD'}</p>
  //          <p><strong>Message:</strong><br/>${message}</p>`,
  // });

  // ── Option B: Nodemailer via Gmail/SMTP
  // Set SMTP_USER and SMTP_PASS in Replit Secrets
  //
  // import nodemailer from 'nodemailer';
  // const transporter = nodemailer.createTransport({
  //   service: 'gmail',
  //   auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  // });
  // await transporter.sendMail({
  //   from: process.env.SMTP_USER,
  //   to: 'tom@zarconephotography.com',
  //   subject: `New inquiry — ${fname} ${lname}`,
  //   text: `From: ${fname} ${lname}\nEmail: ${email}\nPhone: ${phone}\nType: ${type}\nDate: ${date}\n\n${message}`,
  // });

  // Logging for now — replace with one of the options above
  console.log('Contact form submission:', { fname, lname, email, phone, type, date, message });

  return NextResponse.json({ success: true });
}
