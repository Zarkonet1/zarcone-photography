import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Gallery-ready alert capture (BRHS Panther Wrestling / Football hub pages).
// Adds the contact to Resend's Audience — NOT a transactional send. Sending
// the actual "new gallery is live" email is a manual/future step: go into
// the Resend dashboard, filter contacts by the "team" property, and send a
// broadcast whenever a gallery is published.
// See project memory: project_gallery_ready_alerts_feature.
//
// Resend's Contacts API (confirmed against live docs, 2026-07-11) no longer
// takes an audienceId — it's one Audience per account. Wrestling vs. football
// is tagged via a custom `team` property instead, filterable from the
// Properties/Segments tabs in the Resend dashboard.
//
// Requires only RESEND_API_KEY in Vercel (already used by /api/contact).

export async function POST(request) {
  const body = await request.json();
  const { email, team, source } = body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Valid email required.' }, { status: 400 });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.contacts.create({
      email,
      unsubscribed: false,
      properties: {
        team: team || 'Unknown',
        source: source || 'Gallery Alert',
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Resend subscribe error:', err, { source, team });
    return NextResponse.json({ error: 'Failed to subscribe.' }, { status: 500 });
  }
}
