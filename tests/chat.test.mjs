import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { jsonRequest, stubFetch, silenceConsoleError, RESEND_OK, RESEND_422 } from './helpers.mjs';
import { POST as chat } from '../app/api/chat/route.js';

let saved, net, log;
beforeEach(() => {
  saved = { r: process.env.RESEND_API_KEY, a: process.env.ANTHROPIC_API_KEY };
  process.env.RESEND_API_KEY = 're_test_fake_key';
  process.env.ANTHROPIC_API_KEY = 'sk-ant-test-fake';
  log = silenceConsoleError();
});
afterEach(() => {
  net?.restore(); log.restore();
  for (const [k, v] of [['RESEND_API_KEY', saved.r], ['ANTHROPIC_API_KEY', saved.a]]) {
    if (v === undefined) delete process.env[k]; else process.env[k] = v;
  }
});

function anthropicReply(content) {
  return { status: 200, body: { id: 'msg_1', type: 'message', role: 'assistant', model: 'test', content, stop_reason: 'end_turn', usage: { input_tokens: 1, output_tokens: 1 } } };
}
const ESCALATE = [
  { type: 'text', text: "I've sent that to Tom." },
  { type: 'tool_use', id: 't1', name: 'escalate_to_human', input: { reason: 'urgent <b>x</b>', summary: 'needs help', contact_info: '908-555-0100' } },
];
const LEAD = [
  { type: 'text', text: "Thanks — I've sent that to Tom." },
  { type: 'tool_use', id: 't2', name: 'submit_lead_inquiry', input: { name: 'Pat', email: 'pat@example.com' } },
];
const body = { messages: [{ role: 'user', content: 'hello' }] };

function route(content, resend) {
  return (c) => (c.url.includes('anthropic') ? anthropicReply(content) : resend(c));
}

test('chat escalation: email accepted -> normal reply', async () => {
  net = stubFetch(route(ESCALATE, RESEND_OK));
  const res = await chat(jsonRequest('/api/chat', body));
  assert.equal(res.status, 200);
  assert.match((await res.json()).reply, /sent that to Tom/);
});

test('chat escalation: Resend error -> reply does NOT claim Tom was notified (regression)', async () => {
  net = stubFetch(route(ESCALATE, RESEND_422));
  const res = await chat(jsonRequest('/api/chat', body));
  const { reply } = await res.json();
  assert.doesNotMatch(reply, /sent that to Tom/);
  assert.match(reply, /908\) 777-0631/);
});

test('chat lead: Resend error -> failure notice with phone fallback', async () => {
  net = stubFetch(route(LEAD, RESEND_422));
  const { reply } = await (await chat(jsonRequest('/api/chat', body))).json();
  assert.match(reply, /wasn't able to pass that along/);
});

test('chat lead: missing RESEND_API_KEY -> failure notice, nothing sent to Resend', async () => {
  delete process.env.RESEND_API_KEY;
  net = stubFetch(route(LEAD, RESEND_OK));
  const { reply } = await (await chat(jsonRequest('/api/chat', body))).json();
  assert.match(reply, /wasn't able to pass that along/);
  assert.ok(!net.calls.some((c) => c.url.includes('resend.com')));
});

test('chat lead: lead without name/contact is skipped silently (unchanged behavior)', async () => {
  net = stubFetch(route([{ type: 'text', text: 'ok' }, { type: 'tool_use', id: 't3', name: 'submit_lead_inquiry', input: { name: 'Pat' } }], RESEND_OK));
  const { reply } = await (await chat(jsonRequest('/api/chat', body))).json();
  assert.equal(reply, 'ok');
  assert.ok(!net.calls.some((c) => c.url.includes('resend.com')));
});

test('chat escalation: visitor/model text is HTML-escaped in the email', async () => {
  net = stubFetch(route(ESCALATE, RESEND_OK));
  await chat(jsonRequest('/api/chat', { messages: [{ role: 'user', content: '<script>x</script>' }] }));
  const html = net.calls.find((c) => c.url.includes('resend.com')).body.html;
  assert.ok(!html.includes('<script>'));
  assert.ok(html.includes('&lt;b&gt;x&lt;/b&gt;'));
});

test('chat: malformed JSON -> 400; missing ANTHROPIC_API_KEY -> 503', async () => {
  net = stubFetch(() => anthropicReply([{ type: 'text', text: 'hi' }]));
  assert.equal((await chat(jsonRequest('/api/chat', null, '{bad'))).status, 400);
  delete process.env.ANTHROPIC_API_KEY;
  assert.equal((await chat(jsonRequest('/api/chat', body))).status, 503);
});
