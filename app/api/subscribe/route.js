import { NextResponse } from 'next/server';
import {
  LIMITS, cleanStr, cleanEmailInput, isValidEmail, readJsonObject, addAudienceContact, failureStatus, failureBody, guardRequest, looksLikeSpam,
} from '../../../lib/formHandler';

// Gallery-ready alert capture (BRHS Panther Wrestling / Football / Volleyball
// hub pages). Adds the contact to Resend's Audience — NOT a transactional
// send. Sending the actual "new gallery is live" email is a manual/future
// step: go into the Resend dashboard, filter contacts by the "team" property,
// and send a broadcast whenever a gallery is published.
// See project memory: project_gallery_ready_alerts_feature.
//
// Requires only RESEND_API_KEY in Vercel (already used by /api/contact).
//
// Hardened 2026-10-16: Resend SDK 3.5.0's contacts.create() requires an
// audienceId and drops `properties`, and the old code ignored the returned
// { error } — so signups silently failed while the visitor saw success. We now
// POST /contacts (current API, no audienceId) through the SDK's public post()
// and only report success when Resend returns data. See lib/formHandler.js.
export async function POST(request) {
  const blocked = guardRequest(request, 'subscribe', { max: 30 });
  if (blocked) return NextResponse.json({ error: blocked.error }, { status: blocked.status });

  const body = await readJsonObject(request);
  if (!body) {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const email = cleanEmailInput(body.email);
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Valid email required.' }, { status: 400 });
  }

  const result = await addAudienceContact(
    {
      email,
      team: cleanStr(body.team, 60) || 'Unknown',
      source: cleanStr(body.source, LIMITS.short) || 'Gallery Alert',
    },
    'subscribe'
  );

  if (!result.ok) {
    return NextResponse.json(failureBody(result, 'Failed to subscribe.'), { status: failureStatus(result) });
  }
  return NextResponse.json({ success: true });
}
