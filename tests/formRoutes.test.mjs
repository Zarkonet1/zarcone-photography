import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { jsonRequest, stubFetch, silenceConsoleError, RESEND_OK, RESEND_422, RESEND_500, RESEND_200_NO_ID, replyToOf } from './helpers.mjs';

import { POST as contact } from '../app/api/contact/route.js';
import { POST as programContact } from '../app/api/program-contact/route.js';
import { POST as govcon } from '../app/api/govcon-quote/route.js';
import { POST as harvest } from '../app/api/harvestfest-lead/route.js';

const ENV_KEYS = ['RESEND_API_KEY', 'HARVESTFEST_ZAPIER_WEBHOOK_URL'];
let saved, net, log;
beforeEach(() => {
  saved = Object.fromEntries(ENV_KEYS.map((k) => [k, process.env[k]]));
  process.env.RESEND_API_KEY = 're_test_fake_key';
  delete process.env.HARVESTFEST_ZAPIER_WEBHOOK_URL;
  log = silenceConsoleError();
});
afterEach(() => {
  net?.restore();
  log.restore();
  for (const k of ENV_KEYS) { if (saved[k] === undefined) delete process.env[k]; else process.env[k] = saved[k]; }
});

const CONTACT = { fname: 'Pat', lname: 'Lee', email: 'pat@example.com', phone: '908-555-0100', message: 'Hello', source: 'BRHS Panther Football landing page' };
const PROGRAM = { name: 'Pat Lee', school: 'Test HS', email: 'pat@example.com', message: 'Hello' };
const GOV = { name: 'Pat', organization: 'Agency', email: 'pat@example.gov', phone: '', description: 'Need photos' };
const HARVEST = { name: 'Pat', email: 'pat@example.com', phone: '', interest: 'Portraits', category: 'portraits' };

const routes = [
  ['contact', contact, '/api/contact', CONTACT],
  ['program-contact', programContact, '/api/program-contact', PROGRAM],
  ['govcon-quote', govcon, '/api/govcon-quote', GOV],
  ['harvestfest-lead', harvest, '/api/harvestfest-lead', HARVEST],
];

for (const [name, handler, url, valid] of routes) {
  test(`${name}: success only when Resend accepts`, async () => {
    net = stubFetch(RESEND_OK);
    const res = await handler(jsonRequest(url, valid));
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), { success: true });
    assert.equal(net.calls.length, 1);
    assert.match(net.calls[0].url, /\/emails$/);
  });

  test(`${name}: Resend 4xx error is NOT reported as success (regression)`, async () => {
    net = stubFetch(RESEND_422);
    const res = await handler(jsonRequest(url, valid));
    assert.equal(res.status, 502);
    const body = await res.json();
    assert.ok(body.error);
    assert.equal(body.success, undefined);
  });

  test(`${name}: Resend 5xx with non-JSON body is NOT success`, async () => {
    net = stubFetch(RESEND_500);
    const res = await handler(jsonRequest(url, valid));
    assert.equal(res.status, 502);
  });

  test(`${name}: network failure is NOT success`, async () => {
    net = stubFetch(() => { throw new Error('network down'); });
    const res = await handler(jsonRequest(url, valid));
    assert.equal(res.status, 502);
  });

  test(`${name}: missing RESEND_API_KEY -> 503 (configuration), nothing sent, no secrets in body`, async () => {
    delete process.env.RESEND_API_KEY;
    net = stubFetch(RESEND_OK);
    const res = await handler(jsonRequest(url, valid));
    assert.equal(res.status, 503);
    assert.equal(net.calls.length, 0);
    const text = JSON.stringify(await res.json());
    assert.ok(!/RESEND|re_test|api[_ ]?key/i.test(text), 'response must not mention the key or env var');
    assert.match(text, /temporarily unavailable/);
  });

  test(`${name}: Resend 200 without an id is NOT treated as success`, async () => {
    net = stubFetch(RESEND_200_NO_ID);
    const res = await handler(jsonRequest(url, valid));
    assert.equal(res.status, 502);
  });

  test(`${name}: malformed JSON -> 400, nothing sent`, async () => {
    net = stubFetch(RESEND_OK);
    const res = await handler(jsonRequest(url, null, '{not json'));
    assert.equal(res.status, 400);
    assert.equal(net.calls.length, 0);
  });

  test(`${name}: non-object JSON body -> 400`, async () => {
    net = stubFetch(RESEND_OK);
    for (const raw of ['[]', '"x"', 'null', '42']) {
      const res = await handler(jsonRequest(url, null, raw));
      assert.equal(res.status, 400, raw);
    }
    assert.equal(net.calls.length, 0);
  });

  test(`${name}: non-string fields do not crash`, async () => {
    net = stubFetch(RESEND_OK);
    const bad = Object.fromEntries(Object.keys(valid).map((k) => [k, { x: 1 }]));
    const res = await handler(jsonRequest(url, bad));
    assert.equal(res.status, 400);
    assert.equal(net.calls.length, 0);
  });

  test(`${name}: missing required fields -> 400`, async () => {
    net = stubFetch(RESEND_OK);
    const res = await handler(jsonRequest(url, {}));
    assert.equal(res.status, 400);
    assert.equal(net.calls.length, 0);
  });

  test(`${name}: user HTML is escaped in the notification`, async () => {
    net = stubFetch(RESEND_OK);
    const evil = '<script>alert(1)</script><img src=x onerror=alert(2)>';
    const payload = { ...valid };
    for (const k of ['name', 'fname', 'message', 'description', 'source', 'school', 'interest', 'organization', 'context']) {
      if (k in payload) payload[k] = evil;
    }
    payload.context = evil;
    const res = await handler(jsonRequest(url, payload));
    assert.equal(res.status, 200);
    const html = net.calls[0].body.html;
    assert.ok(!html.includes('<script>'), 'raw <script> must not appear');
    assert.ok(!html.includes('<img src=x'), 'raw <img> must not appear');
    assert.ok(html.includes('&lt;script&gt;'));
  });

  test(`${name}: CR/LF cannot be injected into the subject`, async () => {
    net = stubFetch(RESEND_OK);
    const payload = { ...valid };
    for (const k of ['name', 'fname', 'school']) if (k in payload) payload[k] = 'Evil\r\nBcc: x@evil.com';
    const res = await handler(jsonRequest(url, payload));
    assert.equal(res.status, 200);
    assert.ok(!/[\r\n]/.test(net.calls[0].body.subject));
  });
}

test('contact: invalid email -> 400 (never sent to Resend as replyTo)', async () => {
  net = stubFetch(RESEND_OK);
  const res = await contact(jsonRequest('/api/contact', { ...CONTACT, email: 'not-an-email' }));
  assert.equal(res.status, 400);
  assert.equal(net.calls.length, 0);
});

test('program-contact: invalid email -> 400', async () => {
  net = stubFetch(RESEND_OK);
  const res = await programContact(jsonRequest('/api/program-contact', { ...PROGRAM, email: 'nope' }));
  assert.equal(res.status, 400);
});

test('harvestfest: phone-only entry is accepted and delivered', async () => {
  net = stubFetch(RESEND_OK);
  const res = await harvest(jsonRequest('/api/harvestfest-lead', { name: 'Pat', phone: '(908) 777-0631' }));
  assert.equal(res.status, 200);
  const sent = net.calls[0].body;
  assert.equal(replyToOf(sent), undefined);
  assert.ok(sent.html.includes('(908) 777-0631'));
});

test('harvestfest: malformed email + valid phone is NOT discarded and not used as replyTo', async () => {
  net = stubFetch(RESEND_OK);
  const res = await harvest(jsonRequest('/api/harvestfest-lead', { name: 'Pat', email: 'pat@@gmail', phone: '908-777-0631' }));
  assert.equal(res.status, 200);
  const sent = net.calls[0].body;
  assert.equal(replyToOf(sent), undefined);
  assert.ok(sent.html.includes('pat@@gmail'));
  assert.ok(sent.html.includes('not a valid email format'));
  assert.ok(sent.html.includes('908-777-0631'));
});

test('harvestfest: malformed email and no usable phone -> 400', async () => {
  net = stubFetch(RESEND_OK);
  const res = await harvest(jsonRequest('/api/harvestfest-lead', { name: 'Pat', email: 'pat@@gmail', phone: '12' }));
  assert.equal(res.status, 400);
  assert.equal(net.calls.length, 0);
});

test('harvestfest: Zapier non-2xx never fails the visitor but is logged', async () => {
  process.env.HARVESTFEST_ZAPIER_WEBHOOK_URL = 'https://hooks.example.test/zap';
  net = stubFetch((c) => (c.url.includes('hooks.example.test') ? { status: 500, body: {} } : RESEND_OK()));
  const res = await harvest(jsonRequest('/api/harvestfest-lead', HARVEST));
  assert.equal(res.status, 200);
  assert.ok(log.lines.some((l) => l.includes('Zapier webhook returned HTTP 500')));
});

test('harvestfest: Zapier is not called when the email failed', async () => {
  process.env.HARVESTFEST_ZAPIER_WEBHOOK_URL = 'https://hooks.example.test/zap';
  net = stubFetch((c) => (c.url.includes('hooks.example.test') ? { status: 200, body: {} } : RESEND_422()));
  const res = await harvest(jsonRequest('/api/harvestfest-lead', HARVEST));
  assert.equal(res.status, 502);
  assert.ok(!net.calls.some((c) => c.url.includes('hooks.example.test')));
});

test('govcon: phone-only quote request is accepted', async () => {
  net = stubFetch(RESEND_OK);
  const res = await govcon(jsonRequest('/api/govcon-quote', { name: 'Pat', description: 'x', phone: '908-777-0631' }));
  assert.equal(res.status, 200);
});

test('logs never contain submission contents', async () => {
  net = stubFetch(RESEND_422);
  await contact(jsonRequest('/api/contact', { ...CONTACT, message: 'SECRET-MESSAGE-BODY' }));
  assert.ok(log.lines.length > 0);
  assert.ok(!log.lines.join('\n').includes('SECRET-MESSAGE-BODY'));
  assert.ok(!log.lines.join('\n').includes('pat@example.com'));
});

// ---- Oversized email: must be rejected BEFORE any truncation ----------------
// 'a'*250 + '@b.co' is 255 chars. Truncating to 254 first would yield
// 'aaa…@b.c', which looks like a valid address. It must be rejected instead.
const OVERSIZED_EMAIL = `${'a'.repeat(250)}@b.co`;

test('oversized email sanity: 255 chars, and its 254-char truncation would look valid', () => {
  assert.equal(OVERSIZED_EMAIL.length, 255);
  assert.match(OVERSIZED_EMAIL.slice(0, 254), /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
});

test('contact: oversized email -> 400, nothing sent (not truncated into a different address)', async () => {
  net = stubFetch(RESEND_OK);
  const res = await contact(jsonRequest('/api/contact', { ...CONTACT, email: OVERSIZED_EMAIL }));
  assert.equal(res.status, 400);
  assert.equal(net.calls.length, 0);
});

test('program-contact: oversized email -> 400, nothing sent', async () => {
  net = stubFetch(RESEND_OK);
  const res = await programContact(jsonRequest('/api/program-contact', { ...PROGRAM, email: OVERSIZED_EMAIL }));
  assert.equal(res.status, 400);
  assert.equal(net.calls.length, 0);
});

test('govcon: oversized email, no phone -> 400', async () => {
  net = stubFetch(RESEND_OK);
  const res = await govcon(jsonRequest('/api/govcon-quote', { name: 'Pat', description: 'x', email: OVERSIZED_EMAIL }));
  assert.equal(res.status, 400);
  assert.equal(net.calls.length, 0);
});

test('govcon: oversized email + usable phone -> delivered, never used as replyTo', async () => {
  net = stubFetch(RESEND_OK);
  const res = await govcon(jsonRequest('/api/govcon-quote', { name: 'Pat', description: 'x', email: OVERSIZED_EMAIL, phone: '908-777-0631' }));
  assert.equal(res.status, 200);
  assert.equal(replyToOf(net.calls[0].body), undefined);
  assert.ok(net.calls[0].body.html.includes('908-777-0631'));
});

test('harvestfest: oversized email, no phone -> 400', async () => {
  net = stubFetch(RESEND_OK);
  const res = await harvest(jsonRequest('/api/harvestfest-lead', { name: 'Pat', email: OVERSIZED_EMAIL }));
  assert.equal(res.status, 400);
  assert.equal(net.calls.length, 0);
});

test('harvestfest: oversized email + usable phone -> delivered, no replyTo, display capped', async () => {
  net = stubFetch(RESEND_OK);
  const huge = `${'a'.repeat(5000)}@b.co`;
  const res = await harvest(jsonRequest('/api/harvestfest-lead', { name: 'Pat', email: huge, phone: '908-777-0631' }));
  assert.equal(res.status, 200);
  const sent = net.calls[0].body;
  assert.equal(replyToOf(sent), undefined);
  assert.ok(sent.html.length < 3000, 'notification must not echo a 5000-char value');
  assert.ok(sent.html.includes('not a valid email format'));
});

test('email exactly at the 254-char limit is accepted', async () => {
  net = stubFetch(RESEND_OK);
  const atLimit = `${'a'.repeat(249)}@b.co`; // 254 chars
  assert.equal(atLimit.length, 254);
  const res = await contact(jsonRequest('/api/contact', { ...CONTACT, email: atLimit }));
  assert.equal(res.status, 200);
  assert.equal(replyToOf(net.calls[0].body), atLimit);
});

// ---- Reply-To: Resend SDK 3.5.0 only honors snake_case `reply_to` ----------
test('Reply-To uses the SDK field name (reply_to), never camelCase replyTo (regression)', async () => {
  const cases = [
    [contact, '/api/contact', { ...CONTACT, email: 'visitor@example.com' }],
    [programContact, '/api/program-contact', { ...PROGRAM, email: 'visitor@example.com' }],
    [govcon, '/api/govcon-quote', { ...GOV, email: 'visitor@example.com' }],
    [harvest, '/api/harvestfest-lead', { ...HARVEST, email: 'visitor@example.com' }],
  ];
  for (const [handler, url, payload] of cases) {
    net = stubFetch(RESEND_OK);
    const res = await handler(jsonRequest(url, payload));
    assert.equal(res.status, 200, url);
    const sent = net.calls[0].body;
    assert.equal(sent.reply_to, 'visitor@example.com', `${url}: Reply-To must be the visitor's address`);
    assert.equal(sent.replyTo, undefined, `${url}: camelCase replyTo is ignored by the API and must not be sent`);
    net.restore();
  }
});

test('Reply-To is the visitor, while routing (to/from) is unchanged', async () => {
  net = stubFetch(RESEND_OK);
  await contact(jsonRequest('/api/contact', { ...CONTACT, email: 'visitor@example.com' }));
  const sent = net.calls[0].body;
  assert.equal(sent.to, 'tom.zarcone@mac.com');
  assert.equal(sent.from, 'Zarcone Photography <noreply@zarconephotography.com>');
  assert.equal(sent.reply_to, 'visitor@example.com');
});

test('Reply-To is omitted entirely when there is no valid email (phone-only HarvestFest/GovCon)', async () => {
  net = stubFetch(RESEND_OK);
  await harvest(jsonRequest('/api/harvestfest-lead', { name: 'Pat', phone: '908-777-0631' }));
  await govcon(jsonRequest('/api/govcon-quote', { name: 'Pat', description: 'x', phone: '908-777-0631' }));
  for (const c of net.calls) {
    assert.ok(!('reply_to' in c.body) && !('replyTo' in c.body));
  }
});

// ---- Apostrophe emails (o'neil@example.com) are valid -----------------------
import { isValidEmail } from '../lib/formHandler.js';

test('isValidEmail: apostrophes allowed; injection-ish characters still rejected', () => {
  for (const ok of ["o'neil@example.com", "d'angelo.smith@example.co.uk", 'pat+tag@example.com', 'a.b@c.co']) {
    assert.equal(isValidEmail(ok), true, ok);
  }
  for (const bad of ['x@y', 'a b@c.co', 'a@@b.co', '"a"@b.co', 'a,b@c.co', 'a;b@c.co', '<a>@b.co', '', null, 42]) {
    assert.equal(isValidEmail(bad), false, String(bad));
  }
});

test('apostrophe email is accepted end-to-end and used as reply_to (contact, program-contact, govcon, harvest)', async () => {
  const addr = "o'neil@example.com";
  const cases = [
    [contact, '/api/contact', { ...CONTACT, email: addr }],
    [programContact, '/api/program-contact', { ...PROGRAM, email: addr }],
    [govcon, '/api/govcon-quote', { ...GOV, email: addr }],
    [harvest, '/api/harvestfest-lead', { ...HARVEST, email: addr }],
  ];
  for (const [handler, url, payload] of cases) {
    net = stubFetch(RESEND_OK);
    const res = await handler(jsonRequest(url, payload));
    assert.equal(res.status, 200, url);
    const sent = net.calls[0].body;
    assert.equal(sent.reply_to, addr, url);
    assert.ok(sent.html.includes('o&#39;neil@example.com'), `${url}: displayed escaped`);
    net.restore();
  }
});

// ---- HarvestFest: short phone is shown, not silently dropped ----------------
test('harvestfest: short phone + valid email -> delivered, phone shown and labelled', async () => {
  net = stubFetch(RESEND_OK);
  const res = await harvest(jsonRequest('/api/harvestfest-lead', { name: 'Pat', email: 'pat@example.com', phone: '555-12' }));
  assert.equal(res.status, 200);
  const html = net.calls[0].body.html;
  assert.ok(html.includes('555-12'));
  assert.ok(html.includes('fewer than 7 digits'));
});

test('harvestfest: short phone alone (no email) is rejected clearly', async () => {
  net = stubFetch(RESEND_OK);
  const res = await harvest(jsonRequest('/api/harvestfest-lead', { name: 'Pat', phone: '555-12' }));
  assert.equal(res.status, 400);
  assert.match((await res.json()).error, /contact method/);
  assert.equal(net.calls.length, 0);
});

test('harvestfest: valid phone-only behavior is unchanged (no label)', async () => {
  net = stubFetch(RESEND_OK);
  const res = await harvest(jsonRequest('/api/harvestfest-lead', { name: 'Pat', phone: '(908) 777-0631' }));
  assert.equal(res.status, 200);
  const html = net.calls[0].body.html;
  assert.ok(html.includes('(908) 777-0631'));
  assert.ok(!html.includes('fewer than 7 digits'));
});

test('harvestfest: short phone text is HTML-escaped', async () => {
  net = stubFetch(RESEND_OK);
  await harvest(jsonRequest('/api/harvestfest-lead', { name: 'Pat', email: 'pat@example.com', phone: '<b>1</b>' }));
  const html = net.calls[0].body.html;
  assert.ok(!html.includes('<b>1</b>'));
  assert.ok(html.includes('&lt;b&gt;1&lt;/b&gt;'));
});
