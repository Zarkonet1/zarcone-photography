import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Lead-capture handler for the /harvestfest QR landing page's "Enter to
// Win" form — this IS the lead form (see project notes, 2026-09-18): there
// is no separate generic "Connect With Us" path, the giveaway entry is the
// single, qualified capture mechanism for this channel.
//
// Mirrors app/api/contact/route.js and app/api/govcon-quote/route.js
// deliberately: the Resend client is instantiated inside the request
// handler, not at module scope (a module-scope client previously broke
// preview-branch builds — see project memory: program-contact Resend bug).
// Reuses the existing RESEND_API_KEY — no new env var required to launch.
//
// HoneyBook integration: HoneyBook has no public API for third-party lead/
// project creation (confirmed 2026-09-18 via HoneyBook's own community
// forum — repeatedly requested, not offered). The supported bridge is
// Zapier: "Webhooks by Zapier" can catch a POST from this route and drive
// a "Create Project in HoneyBook" action on Tom's account. This route
// leaves that door open without depending on it or blocking launch on it:
// if HARVESTFEST_ZAPIER_WEBHOOK_URL is set in Vercel, every entry is also
// forwarded there so a Zapier automation can create the HoneyBook project
// automatically. If it's unset, that step is skipped entirely and the
// email below is the only delivery — Tom adds entries to HoneyBook
// manually from the email until/unless that Zap is built.
export async function POST(request) {
  const body = await request.json();
  const { name, email, phone, interest, context, category } = body;

  if (!name || (!email && !phone)) {
    return NextResponse.json(
      { error: 'Name and at least one contact method (email or phone) are required.' },
      { status: 400 }
    );
  }

  const submission = {
    name,
    email: email || null,
    phone: phone || null,
    interest: interest || 'Not specified',
    context: context || null,
    category: category || null,
    source: 'HarvestFest 2026 — /harvestfest',
    submittedAt: new Date().toISOString(),
  };

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'Zarcone Photography <noreply@zarconephotography.com>',
      to: 'tom.zarcone@mac.com',
      replyTo: email || undefined,
      subject: `HarvestFest Giveaway Entry — ${name} (${interest || 'Not specified'})`,
      html: `
        <h2>HarvestFest 2026 — Giveaway Entry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email || '&mdash;'}</p>
        <p><strong>Phone:</strong> ${phone || '&mdash;'}</p>
        <p><strong>Interested In:</strong> ${interest || '&mdash;'}</p>
        ${context ? `<p><strong>Additional context:</strong> ${context.replace(/\n/g, '<br />')}</p>` : ''}
        ${category ? `<p><strong>Category they were viewing:</strong> ${category}</p>` : ''}
        <hr />
        <p style="color:#888;font-size:12px;">Source: HarvestFest 2026 QR landing page (/harvestfest)</p>
      `,
    });
  } catch (err) {
    console.error('Resend error (harvestfest-lead):', err);
    return NextResponse.json({ error: 'Failed to send entry.' }, { status: 500 });
  }

  const zapierUrl = process.env.HARVESTFEST_ZAPIER_WEBHOOK_URL;
  if (zapierUrl) {
    try {
      await fetch(zapierUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission),
      });
    } catch (err) {
      // Never let a Zapier hiccup fail the visitor's submission — the
      // email above already succeeded and is the record of truth either way.
      console.error('Zapier forward error (harvestfest-lead):', err);
    }
  }

  return NextResponse.json({ success: true });
}
