import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { jsonRequest, stubFetch, silenceConsoleError, RESEND_500 } from './helpers.mjs';
import { POST as subscribe } from '../app/api/subscribe/route.js';
import { Resend } from 'resend';

let saved, net, log;
beforeEach(() => { saved = process.env.RESEND_API_KEY; process.env.RESEND_API_KEY = 're_test_fake_key'; log = silenceConsoleError(); });
afterEach(() => { net?.restore(); log.restore(); if (saved === undefined) delete process.env.RESEND_API_KEY; else process.env.RESEND_API_KEY = saved; });

const OK = () => ({ status: 200, body: { id: 'contact-id', object: 'contact' } });

// Documents WHY the old call was wrong: the installed SDK (3.5.0) builds the
// path from audienceId and strips `properties`.
test('SDK 3.5.0 contacts.create() posts to /audiences/undefined and drops properties (the old bug)', async () => {
  net = stubFetch(OK);
  const resend = new Resend('re_test_fake_key');
  await resend.contacts.create({ email: 'a@b.co', unsubscribed: false, properties: { team: 'Football' } });
  assert.match(net.calls[0].url, /\/audiences\/undefined\/contacts$/);
  assert.equal(net.calls[0].body.properties, undefined);
});

test('subscribe: posts email + team/source properties to /contacts and succeeds', async () => {
  net = stubFetch(OK);
  const res = await subscribe(jsonRequest('/api/subscribe', { email: 'pat@example.com', team: 'Football', source: 'Gallery Alert' }));
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { success: true });
  assert.match(net.calls[0].url, /api\.resend\.com\/contacts$/);
  assert.ok(!net.calls[0].url.includes('undefined'));
  assert.deepEqual(net.calls[0].body, {
    email: 'pat@example.com', unsubscribed: false, properties: { team: 'Football', source: 'Gallery Alert' },
  });
});

test('subscribe: Resend error is NOT reported as success (regression)', async () => {
  net = stubFetch(() => ({ status: 422, body: { name: 'validation_error', message: 'bad', statusCode: 422 } }));
  const res = await subscribe(jsonRequest('/api/subscribe', { email: 'pat@example.com', team: 'Football' }));
  assert.equal(res.status, 502);
  assert.equal((await res.json()).success, undefined);
});

test('subscribe: network failure is NOT success', async () => {
  net = stubFetch(() => { throw new Error('down'); });
  const res = await subscribe(jsonRequest('/api/subscribe', { email: 'pat@example.com' }));
  assert.equal(res.status, 502);
});

test('subscribe: missing RESEND_API_KEY -> 503, no request made, no secrets in body', async () => {
  delete process.env.RESEND_API_KEY;
  net = stubFetch(OK);
  const res = await subscribe(jsonRequest('/api/subscribe', { email: 'pat@example.com' }));
  assert.equal(res.status, 503);
  assert.equal(net.calls.length, 0);
  assert.ok(!/RESEND|api[_ ]?key/i.test(JSON.stringify(await res.json())));
});

test('subscribe: oversized email -> 400 (not truncated into a valid-looking address)', async () => {
  net = stubFetch(OK);
  const res = await subscribe(jsonRequest('/api/subscribe', { email: `${'a'.repeat(250)}@b.co` }));
  assert.equal(res.status, 400);
  assert.equal(net.calls.length, 0);
});

test('subscribe: non-JSON gateway error (HTML 502) is NOT success', async () => {
  net = stubFetch(RESEND_500);
  const res = await subscribe(jsonRequest('/api/subscribe', { email: 'pat@example.com' }));
  assert.equal(res.status, 502);
});

test('subscribe: 200 without an id is NOT success', async () => {
  net = stubFetch(() => ({ status: 200, body: {} }));
  const res = await subscribe(jsonRequest('/api/subscribe', { email: 'pat@example.com' }));
  assert.equal(res.status, 502);
});

test('subscribe: malformed JSON / invalid / non-string email -> 400', async () => {
  net = stubFetch(OK);
  assert.equal((await subscribe(jsonRequest('/api/subscribe', null, '{bad'))).status, 400);
  assert.equal((await subscribe(jsonRequest('/api/subscribe', { email: 'nope' }))).status, 400);
  assert.equal((await subscribe(jsonRequest('/api/subscribe', { email: ['a@b.co'] }))).status, 400);
  assert.equal((await subscribe(jsonRequest('/api/subscribe', {}))).status, 400);
  assert.equal(net.calls.length, 0);
});

test('subscribe: non-string team/source fall back to defaults', async () => {
  net = stubFetch(OK);
  const res = await subscribe(jsonRequest('/api/subscribe', { email: 'pat@example.com', team: { x: 1 }, source: 5 }));
  assert.equal(res.status, 200);
  assert.deepEqual(net.calls[0].body.properties, { team: 'Unknown', source: 'Gallery Alert' });
});

test("subscribe: apostrophe email (o'neil@example.com) is accepted", async () => {
  net = stubFetch(OK);
  const res = await subscribe(jsonRequest('/api/subscribe', { email: "o'neil@example.com", team: 'Football' }));
  assert.equal(res.status, 200);
  assert.equal(net.calls[0].body.email, "o'neil@example.com");
});
