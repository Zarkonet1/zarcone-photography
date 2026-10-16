// Shared helpers for the public form / lead-capture API routes
// (/api/contact, /api/program-contact, /api/govcon-quote, /api/harvestfest-lead,
// /api/subscribe). Added 2026-10-16 after an audit found every route reported
// success even when Resend rejected the request.
//
// WHY THIS EXISTS: Resend SDK 3.5.0 never throws on an API failure — every call
// resolves to `{ data, error }` (see node_modules/resend/dist/index.js,
// fetchRequest). A bare `await resend.emails.send(...)` inside try/catch
// therefore "succeeds" on a 4xx/5xx, bad `reply_to`, unverified domain, rate
// limit, etc. These helpers inspect the returned contract so a route only
// reports success when the provider actually accepted the request.
//
// No new dependencies. Nothing here logs request bodies or personal data.

import { Resend } from 'resend';

export const LIMITS = {
  name: 120,
  email: 254,
  phone: 40,
  short: 200,
  message: 5000,
};

// Escape user-supplied text before it is interpolated into notification HTML.
export function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Escape, then turn newlines into <br /> for multi-line fields.
export function escMultiline(value) {
  return esc(value).replace(/\r?\n/g, '<br />');
}

// Coerce an untrusted field to a trimmed, length-capped string. Non-strings
// (objects, arrays, numbers, null) become '' instead of crashing a handler.
export function cleanStr(value, max = LIMITS.short) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, max);
}

// Single-line variant for subject lines — strips CR/LF (header injection).
export function cleanLine(value, max = LIMITS.short) {
  return cleanStr(value, max).replace(/[\r\n]+/g, ' ');
}

// Read an email field WITHOUT truncating it. Truncating to the 254-char limit
// before validating could turn an oversized address into a different, valid-
// looking one; instead the full trimmed value goes to isValidEmail(), which
// rejects anything longer than LIMITS.email. Non-strings become ''.
export function cleanEmailInput(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export function isValidEmail(value) {
  return (
    typeof value === 'string' &&
    value.length <= LIMITS.email &&
    // Apostrophes are legal in the local part (o'neil@example.com) and
    // browsers' type="email" inputs accept them, so they are NOT excluded.
    /^[^\s@<>",;]+@[^\s@<>",;]+\.[^\s@<>",;]+$/.test(value)
  );
}

// A phone is "usable" if it carries at least 7 digits. Loose on purpose —
// people type (908) 777-0631, 908.777.0631, +1 908 777 0631, etc.
export function isUsablePhone(value) {
  return typeof value === 'string' && (value.match(/\d/g) || []).length >= 7;
}

// Parse the request body as a JSON object. Returns null for malformed JSON or
// for anything that is not a plain object (array, string, number, null).
export async function readJsonObject(request) {
  try {
    const body = await request.json();
    if (body && typeof body === 'object' && !Array.isArray(body)) return body;
    return null;
  } catch {
    return null;
  }
}

// Decide how to treat an email/phone pair for routes that accept either.
// - A valid email is used for reply_to.
// - A malformed email is NEVER passed to Resend as reply_to (Resend rejects it,
//   which used to silently drop the whole lead). If a usable phone exists the
//   submission is still accepted and the raw email is shown, escaped and
//   labelled, in the notification so no valid lead is thrown away.
export function resolveContactMethods(rawEmail, rawPhone) {
  const emailInput = cleanEmailInput(rawEmail);
  const phoneInput = cleanStr(rawPhone, LIMITS.phone);
  const email = emailInput && isValidEmail(emailInput) ? emailInput : null;
  const phone = phoneInput && isUsablePhone(phoneInput) ? phoneInput : null;
  return {
    email,
    phone,
    // Entered but malformed/oversized — surfaced to Tom (display-capped so an
    // oversized value can't bloat the notification), never used as reply_to.
    invalidEmailInput:
      emailInput && !email
        ? emailInput.length > LIMITS.email ? `${emailInput.slice(0, LIMITS.email)}…` : emailInput
        : null,
    // Phone text entered but with too few digits to call.
    invalidPhoneInput: phoneInput && !phone ? phoneInput : null,
    hasContactMethod: Boolean(email || phone),
  };
}

// Send a transactional email and report whether Resend actually accepted it.
//   { ok: true, id }
//   { ok: false, reason: 'config' }   — RESEND_API_KEY missing
//   { ok: false, reason: 'provider' } — Resend returned `error`, no data, or threw
// The Resend client is created inside this function (not at module scope): a
// module-scope client previously broke preview-branch builds on this project.
export async function sendEmail(payload, tag) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error(`[${tag}] RESEND_API_KEY is not configured; email not sent.`);
    await alertFailure(tag, 'config');
    return { ok: false, reason: 'config' };
  }
  try {
    const resend = new Resend(key);
    const { data, error } = await resend.emails.send(payload);
    if (error || !data?.id) {
      // Log the provider's error name/message only — never the submission.
      console.error(`[${tag}] Resend did not confirm the send:`, error?.name, error?.message);
      await alertFailure(tag, 'provider');
      return { ok: false, reason: 'provider' };
    }
    return { ok: true, id: data.id };
  } catch (err) {
    console.error(`[${tag}] Resend call threw:`, err?.message);
    await alertFailure(tag, 'provider');
    return { ok: false, reason: 'provider' };
  }
}

// Add a contact to the account's Resend Audience, tagged with custom
// properties. Resend SDK 3.5.0's `contacts.create()` cannot do this: it POSTs
// to `/audiences/${payload.audienceId}/contacts` (so `/audiences/undefined/...`
// when no audienceId is given) and drops any `properties` field from the body.
// The current Contacts API takes `POST /contacts` with `properties`, so we use
// the SDK's public `post()` against that path while keeping SDK 3.5.0.
// NOTE: the request shape is verified against the installed SDK in
// tests/formHandler.test.mjs; acceptance by the live Resend API still needs a
// manual check (see the handoff notes).
export async function addAudienceContact({ email, team, source }, tag) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error(`[${tag}] RESEND_API_KEY is not configured; contact not added.`);
    await alertFailure(tag, 'config');
    return { ok: false, reason: 'config' };
  }
  try {
    const resend = new Resend(key);
    const { data, error } = await resend.post('/contacts', {
      email,
      unsubscribed: false,
      properties: { team, source },
    });
    if (error || !data?.id) {
      console.error(`[${tag}] Resend did not confirm the contact:`, error?.name, error?.message);
      await alertFailure(tag, 'provider');
      return { ok: false, reason: 'provider' };
    }
    return { ok: true, id: data.id };
  } catch (err) {
    console.error(`[${tag}] Resend contact call threw:`, err?.message);
    await alertFailure(tag, 'provider');
    return { ok: false, reason: 'provider' };
  }
}

// Map a failed sendEmail/addAudienceContact result to an HTTP status:
// 503 when the server is not configured (RESEND_API_KEY missing — mirrors
// /api/chat's 503 for a missing ANTHROPIC_API_KEY), 502 when Resend failed.
export function failureStatus(result) {
  return result.reason === 'config' ? 503 : 502;
}

// Client-safe error body. Never names env vars or credentials.
export function failureBody(result, providerMessage) {
  if (result.reason === 'config') {
    return {
      error: 'This form is temporarily unavailable. Please call (908) 777-0631 or email info@zarconephotography.com.',
    };
  }
  return { error: providerMessage };
}


// ───────────────────────── Spam protection ─────────────────────────
// Server-side only (no UI changes), layered, and built so a real lead is never
// silently discarded:
//   1. Origin check  — browsers always send Origin/Referer on a form POST; a
//      missing or foreign one is rejected (403). Stops cross-site and naive
//      scripted posting. A determined bot can forge headers, so this is the
//      cheap layer, not the whole defense.
//   2. Rate limit    — per client IP, per route. Windows are deliberately
//      generous because venues, schools and carriers share IPs (HarvestFest,
//      BRHS). In-memory per serverless instance, so it is best-effort: it
//      slows a flood, it does not guarantee a hard cap. (Same trade-off as the
//      chat route; durable limiting needs Upstash/Redis.)
//   3. Size cap      — oversized bodies are rejected (413).
//   4. Content flag  — link-stuffed messages are DELIVERED but flagged
//      "[Possible spam]" in the subject, so Tom can filter without losing leads.
// A CAPTCHA (e.g. Cloudflare Turnstile) is the stronger fix and needs a key
// from Tom's Cloudflare account — see CLAUDE.md.

const ALLOWED_ORIGIN =
  /^(https:\/\/((www\.)?zarconephotography\.com|zarcone-photography[a-z0-9-]*\.vercel\.app)|http:\/\/localhost(:\d+)?)$/;

const MAX_BODY_BYTES = 20_000;

export function originAllowed(request) {
  const origin = request.headers.get('origin');
  if (origin) return ALLOWED_ORIGIN.test(origin);
  const referer = request.headers.get('referer');
  if (referer) {
    try { return ALLOWED_ORIGIN.test(new URL(referer).origin); } catch { return false; }
  }
  return false;
}

const RATE_WINDOW_MS = 10 * 60 * 1000;
const rateBuckets = new Map(); // `${tag}|${ip}` -> number[] of timestamps

export function resetRateLimits() { rateBuckets.clear(); }

function clientIp(request) {
  const fwd = request.headers.get('x-forwarded-for');
  return (fwd ? fwd.split(',')[0].trim() : request.headers.get('x-real-ip')) || 'unknown';
}

function rateLimited(request, tag, max) {
  const now = Date.now();
  const key = `${tag}|${clientIp(request)}`;
  const hits = (rateBuckets.get(key) || []).filter((t) => now - t < RATE_WINDOW_MS);
  hits.push(now);
  rateBuckets.set(key, hits);
  if (rateBuckets.size > 2000) {
    for (const [k, v] of rateBuckets) {
      if (!v.some((t) => now - t < RATE_WINDOW_MS)) rateBuckets.delete(k);
    }
  }
  return hits.length > max;
}

// Returns null to proceed, or a { status, error } rejection for the route to
// return. Call it first thing in each public POST handler.
//   max = submissions allowed per IP per 10 minutes for this route.
export function guardRequest(request, tag, { max = 6, originOnly = false } = {}) {
  if (!originAllowed(request)) {
    console.error(`[${tag}] rejected: missing or foreign Origin/Referer.`);
    return { status: 403, error: 'Request not allowed.' };
  }
  const len = Number(request.headers.get('content-length'));
  if (Number.isFinite(len) && len > MAX_BODY_BYTES) {
    return { status: 413, error: 'Request too large.' };
  }
  if (!originOnly && rateLimited(request, tag, max)) {
    console.error(`[${tag}] rate limit hit.`);
    return {
      status: 429,
      error: 'Too many submissions from your connection. Please wait a few minutes or call (908) 777-0631.',
    };
  }
  return null;
}

// True when free text looks link-stuffed (3+ URLs/domains-with-scheme).
export function looksLikeSpam(...texts) {
  const joined = texts.filter((t) => typeof t === 'string').join(' ');
  return (joined.match(/https?:\/\/|www\./gi) || []).length >= 3;
}

// ───────────────────────── Failure alerting ─────────────────────────
// Resend is the only mail path, so an alert cannot ride on it. If
// ALERT_WEBHOOK_URL is set (a Zapier/Make catch hook, Slack incoming webhook,
// etc.) every send failure POSTs a short notice there. The notice contains the
// route, reason and timestamp ONLY — never submission data. Without the env var
// failures are still logged. Throttled to one alert per route+reason per 15
// minutes per instance so an outage does not flood the channel.
const ALERT_THROTTLE_MS = 15 * 60 * 1000;
const lastAlert = new Map();

export function resetAlertThrottle() { lastAlert.clear(); }

export async function alertFailure(tag, reason) {
  const url = process.env.ALERT_WEBHOOK_URL;
  if (!url) return;
  const key = `${tag}|${reason}`;
  const now = Date.now();
  if (now - (lastAlert.get(key) || 0) < ALERT_THROTTLE_MS) return;
  lastAlert.set(key, now);
  const what = reason === 'config'
    ? 'RESEND_API_KEY is missing - form is returning 503'
    : 'Resend rejected or failed the send - form is returning 502';
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `[zarconephotography.com] /api/${tag} FAILURE: ${what} (${new Date(now).toISOString()}). A visitor saw an error; check Resend and Vercel logs.`,
      }),
      signal: AbortSignal.timeout(3000),
    });
  } catch (err) {
    console.error(`[${tag}] failure alert could not be delivered:`, err?.message);
  }
}
