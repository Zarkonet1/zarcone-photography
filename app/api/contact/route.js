import { NextResponse } from 'next/server';

export async function POST(request) {
  const body = await request.json();
  const { fname, lname, email, phone, type, date, message } = body;

  console.log('Contact form submission:', { fname, lname, email, phone, type, date, message });

  return NextResponse.json({ success: true });
}
