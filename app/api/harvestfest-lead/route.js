import { NextResponse } from 'next/server';
import {
  LIMITS, cleanStr, cleanLine, esc, escMultiline, resolveContactMethods,
  readJsonObject, sendEmail, failureStatus, failureBody,
} from '../../../lib/formHandler';

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
// Hardened 2026-10-16: input validated/escaped; the visitor sees success only
// after Resend accepts the notification email. A phone-only entry is valid. A
// malformed email is never used as reply_to (Resend rejects it) but, when a
// usable phone is present, the entry is still delivered with the email shown
// as entered so no valid giveaway lead is dropped. Zapier forwarding remains
// best-effort and never fails the visitor, but non-2xx/timeouts are logged.
export async function POST(request) {
  const body = await readJsonObject(request);
  if (!body) {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const name = cleanStr(body.name, LIMITS.name);
  const interest = cleanStr(body.interest, LIMITS.short);
  const context = cleanStr(body.context, LIMITS.message);
  const category = cleanStr(body.category, LIMITS.short);
  const contact = resolveContactMethods(body.email, body.phone);

  if (!name || !contact.hasContactMethod) {
    return NextResponse.json(
      { error: 'Name and at least one valid contact method (email or phone) are required.' },
      { status: 400 }
    );
  }

  const submission = {
    name,
    email: contact.email,
    phone: contact.phone,
    interest: interest || 'Not specified',
    context: context || null,
    category: category || null,
    source: 'HarvestFest 2026 — /harvestfest',
    submittedAt: new Date().toISOString(),
  };

  const emailLine = contact.email
    ? esc(contact.email)
    : contact.invalidEmailInput
      ? `${esc(contact.invalidEmailInput)} <em>(not a valid email format — as entered; use the phone number)</em>`
      : '&mdash;';

  // A phone with fewer than 7 digits can't be called, but it is still shown
  // (escaped, labelled) rather than silently dropped.
  const phoneLine = contact.phone
    ? esc(contact.phone)
    : contact.invalidPhoneInput
      ? `${esc(contact.invalidPhoneInput)} <em>(fewer than 7 digits — as entered)</em>`
      : '&mdash;';

  const result = await sendEmail(
    {
      from: 'Zarcone Photography <noreply@zarconephotography.com>',
      to: 'tom.zarcone@mac.com',
      reply_to: contact.email || undefined,
      subject: cleanLine(`HarvestFest Giveaway Entry — ${name} (${interest || 'Not specified'})`),
      html: `
        <h2>HarvestFest 2026 — Giveaway Entry</h2>
        <p><strong>Name:</strong> ${esc(name)}</p>
        <p><strong>Email:</strong> ${emailLine}</p>
        <p><strong>Phone:</strong> ${phoneLine}</p>
        <p><strong>Interested In:</strong> ${esc(interest) || '&mdash;'}</p>
        ${context ? `<p><strong>Additional context:</strong> ${escMultiline(context)}</p>` : ''}
        ${category ? `<p><strong>Category they were viewing:</strong> ${esc(category)}</p>` : ''}
        <hr />
        <p style="color:#888;font-size:12px;">Source: HarvestFest 2026 QR landing page (/harvestfest)</p>
      `,
    },
    'harvestfest-lead'
  );

  if (!result.ok) {
    return NextResponse.json(failureBody(result, 'Failed to send entry.'), { status: failureStatus(result) });
  }

  const zapierUrl = process.env.HARVESTFEST_ZAPIER_WEBHOOK_URL;
  if (zapierUrl) {
    try {
      const zapRes = await fetch(zapierUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission),
        signal: AbortSignal.timeout(5000),
      });
      if (!zapRes.ok) {
        console.error(`[harvestfest-lead] Zapier webhook returned HTTP ${zapRes.status}; HoneyBook project not auto-created.`);
      }
    } catch (err) {
      // Never let a Zapier hiccup fail the visitor's submission — the
      // email above already succeeded and is the record of truth either way.
      console.error('[harvestfest-lead] Zapier forward error:', err?.message);
    }
  }

  return NextResponse.json({ success: true });
}
