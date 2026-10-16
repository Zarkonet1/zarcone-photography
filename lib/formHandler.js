// Shared helpers for the public form / lead-capture API routes
// (/api/contact, /api/program-contact, /api/govcon-quote, /api/harvestfest-lead,
// /api/subscribe). Added 2026-10-16 after an audit found every route reported
// success even when Resend rejected the request.
//
// WHY THIS EXISTS: Resend SDK 3.5.0 never throws on an API failure — every call
// resolves to `{ data, error }` (see node_modules/resend/dist/index.js,
// fetchRequest). A bare `await resend.emails.send(...)` inside try/catch
// therefore "succeeds" on a 4xx/5xx, bad `replyTo`, unverified domain, rate
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
    /^[^\s@<>"',;]+@[^\s@<>"',;]+\.[^\s@<>"',;]+$/.test(value)
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
// - A valid email is used for replyTo.
// - A malformed email is NEVER passed to Resend as replyTo (Resend rejects it,
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
    // oversized value can't bloat the notification), never used as replyTo.
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
    return { ok: false, reason: 'config' };
  }
  try {
    const resend = new Resend(key);
    const { data, error } = await resend.emails.send(payload);
    if (error || !data?.id) {
      // Log the provider's error name/message only — never the submission.
      console.error(`[${tag}] Resend did not confirm the send:`, error?.name, error?.message);
      return { ok: false, reason: 'provider' };
    }
    return { ok: true, id: data.id };
  } catch (err) {
    console.error(`[${tag}] Resend call threw:`, err?.message);
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
      return { ok: false, reason: 'provider' };
    }
    return { ok: true, id: data.id };
  } catch (err) {
    console.error(`[${tag}] Resend contact call threw:`, err?.message);
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
