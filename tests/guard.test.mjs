import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { jsonRequest, stubFetch, silenceConsoleError, RESEND_OK, RESEND_422, RESEND_500 } from './helpers.mjs';
import { resetRateLimits, resetAlertThrottle, looksLikeSpam, originAllowed } from '../lib/formHandler.js';

import { POST as contact } from '../app/api/contact/route.js';
import { POST as programContact } from '../app/api/program-contact/route.js';
import { POST as govcon } from '../app/api/govcon-quote/route.js';
import { POST as harvest } from '../app/api/harvestfest-lead/route.js';
import { POST as subscribe } from '../app/api/subscribe/route.js';
import { POST as chat } from '../app/api/chat/route.js';

const ENV_KEYS = ['RESEND_API_KEY', 'ALERT_WEBHOOK_URL', 'ANTHROPIC_API_KEY'];
let saved, net, log;
beforeEach(() => {
  saved = Object.fromEntries(ENV_KEYS.map((k) => [k, process.env[k]]));
  process.env.RESEND_API_KEY = 're_test_fake_key';
  delete process.env.ALERT_WEBHOOK_URL;
  resetRateLimits();
  resetAlertThrottle();
  log = silenceConsoleError();
});
afterEach(() => {
  net?.restore();
  log.restore();
  for (const k of ENV_KEYS) { if (saved[k] === undefined) delete process.env[k]; else process.env[k] = saved[k]; }
});

const CONTACT = { fname: 'Pat', lname: 'Lee', email: 'pat@example.com', message: 'Hello' };
const PROGRAM = { name: 'Pat', school: 'Test HS', email: 'pat@example.com', message: 'Hello' };
const GOV = { name: 'Pat', email: 'pat@example.gov', description: 'Need photos' };
const HARVEST = { name: 'Pat', email: 'pat@example.com', interest: 'Portraits' };
const SUB = { email: 'pat@example.com', team: 'wrestling' };
const post = (url, body, headers) => jsonRequest(url, body, undefined, headers);

const routes = [
  ['contact', contact, '/api/contact', CONTACT],
  ['program-contact', programContact, '/api/program-contact', PROGRAM],
  ['govcon-quote', govcon, '/api/govcon-quote', GOV],
  ['harvestfest-lead', harvest, '/api/harvestfest-lead', HARVEST],
  ['subscribe', subscribe, '/api/subscribe', SUB],
];

// ── Origin check ──────────────────────────────────────────────────────────
for (const [name, handler, url, body] of routes) {
  test(`${name}: foreign Origin -> 403, nothing sent`, async () => {
    net = stubFetch(RESEND_OK);
    const res = await handler(post(url, body, { Origin: 'https://evil.example' }));
    assert.equal(res.status, 403);
    assert.equal(net.calls.length, 0);
  });
  test(`${name}: no Origin and no Referer (curl-style) -> 403`, async () => {
    net = stubFetch(RESEND_OK);
    const req = new Request(`http://localhost${url}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const res = await handler(req);
    assert.equal(res.status, 403);
    assert.equal(net.calls.length, 0);
  });
}

test('origin: first-party apex, www, Vercel preview and localhost allowed; lookalikes rejected', () => {
  const ok = (h) => originAllowed(new Request('http://x', { headers: h }));
  assert.ok(ok({ Origin: 'https://zarconephotography.com' }));
  assert.ok(ok({ Origin: 'https://www.zarconephotography.com' }));
  assert.ok(ok({ Origin: 'https://zarcone-photography-git-fix-abc-tom.vercel.app' }));
  assert.ok(ok({ Origin: 'http://localhost:3000' }));
  assert.ok(ok({ Referer: 'https://www.zarconephotography.com/brhs-panther-football' }));
  assert.ok(!ok({ Origin: 'https://zarconephotography.com.evil.io' }));
  assert.ok(!ok({ Origin: 'https://evilzarconephotography.com' }));
  assert.ok(!ok({ Origin: 'https://other.vercel.app' }));
  assert.ok(!ok({ Referer: 'not a url' }));
  assert.ok(!ok({}));
});

// ── Rate limit ────────────────────────────────────────────────────────────
test('contact: 7th submission from one IP in 10 min -> 429; other IPs unaffected', async () => {
  net = stubFetch(RESEND_OK);
  const ip = { 'x-forwarded-for': '203.0.113.9' };
  for (let i = 0; i < 6; i++) assert.equal((await contact(post('/api/contact', CONTACT, ip))).status, 200);
  const blocked = await contact(post('/api/contact', CONTACT, ip));
  assert.equal(blocked.status, 429);
  assert.match((await blocked.json()).error, /908\) 777-0631/);
  assert.equal(net.calls.length, 6, 'blocked request must not reach Resend');
  assert.equal((await contact(post('/api/contact', CONTACT, { 'x-forwarded-for': '203.0.113.10' }))).status, 200);
});

test('harvestfest: venue-sized burst (30 entries from one IP) is NOT throttled', async () => {
  net = stubFetch(RESEND_OK);
  const ip = { 'x-forwarded-for': '198.51.100.7' };
  for (let i = 0; i < 30; i++) assert.equal((await harvest(post('/api/harvestfest-lead', HARVEST, ip))).status, 200);
});

test('rate limits are per route (contact flood does not block subscribe)', async () => {
  net = stubFetch(RESEND_OK);
  const ip = { 'x-forwarded-for': '203.0.113.50' };
  for (let i = 0; i < 7; i++) await contact(post('/api/contact', CONTACT, ip));
  assert.equal((await subscribe(post('/api/subscribe', SUB, ip))).status, 200);
});

// ── Size cap ──────────────────────────────────────────────────────────────
test('oversized body (content-length) -> 413, nothing sent', async () => {
  net = stubFetch(RESEND_OK);
  const res = await contact(post('/api/contact', CONTACT, { 'content-length': '50000' }));
  assert.equal(res.status, 413);
  assert.equal(net.calls.length, 0);
});

// ── Spam flag (deliver, never drop) ───────────────────────────────────────
test('looksLikeSpam: 3+ links flags; normal text and one link do not', () => {
  assert.ok(looksLikeSpam('buy http://a.com http://b.com www.c.com'));
  assert.ok(!looksLikeSpam('See https://mygallery.com for my work'));
  assert.ok(!looksLikeSpam('Hello', undefined, 42));
});

test('contact: link-stuffed message is still delivered but subject is flagged', async () => {
  net = stubFetch(RESEND_OK);
  const spammy = { ...CONTACT, message: 'http://a.com http://b.com http://c.com' };
  assert.equal((await contact(post('/api/contact', spammy))).status, 200);
  assert.match(net.calls[0].body.subject, /^\[Possible spam\] /);
  net.restore();
  net = stubFetch(RESEND_OK);
  await contact(post('/api/contact', CONTACT));
  assert.doesNotMatch(net.calls[0].body.subject, /Possible spam/);
});

// ── Chat origin ───────────────────────────────────────────────────────────
test('chat: foreign Origin -> 403 before any model call', async () => {
  process.env.ANTHROPIC_API_KEY = 'sk-test-fake';
  net = stubFetch(() => { throw new Error('should not be called'); });
  const res = await chat(post('/api/chat', { messages: [{ role: 'user', content: 'hi' }] }, { Origin: 'https://evil.example' }));
  assert.equal(res.status, 403);
  assert.equal(net.calls.length, 0);
});

// ── Failure alerting ──────────────────────────────────────────────────────
const alertCalls = (net) => net.calls.filter((c) => c.url === 'https://hooks.example/alert');
const withHook = (responder) => (call) => (call.url === 'https://hooks.example/alert' ? { status: 200, body: {} } : responder(call));

test('alert: Resend failure posts a metadata-only notice to ALERT_WEBHOOK_URL; visitor still gets 502', async () => {
  process.env.ALERT_WEBHOOK_URL = 'https://hooks.example/alert';
  net = stubFetch(withHook(RESEND_422));
  const res = await contact(post('/api/contact', { ...CONTACT, email: 'secret.person@example.com', message: 'PRIVATE BODY TEXT' }));
  assert.equal(res.status, 502);
  const a = alertCalls(net);
  assert.equal(a.length, 1);
  assert.match(a[0].body.text, /\/api\/contact FAILURE/);
  assert.match(a[0].body.text, /502/);
  assert.doesNotMatch(JSON.stringify(a[0].body), /secret\.person|PRIVATE BODY/, 'no submission data in alerts');
});

test('alert: missing RESEND_API_KEY alerts with the 503 wording', async () => {
  process.env.ALERT_WEBHOOK_URL = 'https://hooks.example/alert';
  delete process.env.RESEND_API_KEY;
  net = stubFetch(withHook(RESEND_OK));
  assert.equal((await contact(post('/api/contact', CONTACT))).status, 503);
  assert.match(alertCalls(net)[0].body.text, /RESEND_API_KEY is missing/);
});

test('alert: repeated failures are throttled to one notice per route+reason', async () => {
  process.env.ALERT_WEBHOOK_URL = 'https://hooks.example/alert';
  net = stubFetch(withHook(RESEND_500));
  for (let i = 0; i < 3; i++) assert.equal((await contact(post('/api/contact', CONTACT))).status, 502);
  assert.equal(alertCalls(net).length, 1);
  assert.equal((await programContact(post('/api/program-contact', PROGRAM))).status, 502);
  assert.equal(alertCalls(net).length, 2, 'a different route alerts separately');
});

test('alert: webhook down never breaks the response', async () => {
  process.env.ALERT_WEBHOOK_URL = 'https://hooks.example/alert';
  net = stubFetch((call) => { if (call.url === 'https://hooks.example/alert') throw new Error('hook down'); return RESEND_422(); });
  assert.equal((await contact(post('/api/contact', CONTACT))).status, 502);
});

test('alert: no webhook configured -> no extra network call, still logged', async () => {
  net = stubFetch(RESEND_422);
  await contact(post('/api/contact', CONTACT));
  assert.equal(net.calls.length, 1);
  assert.ok(log.lines.some((l) => /Resend did not confirm/.test(l)));
});

test('alert: a successful send never alerts', async () => {
  process.env.ALERT_WEBHOOK_URL = 'https://hooks.example/alert';
  net = stubFetch(withHook(RESEND_OK));
  await contact(post('/api/contact', CONTACT));
  assert.equal(alertCalls(net).length, 0);
});
