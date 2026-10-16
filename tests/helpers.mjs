// Test helpers: stub global fetch so the REAL Resend SDK 3.5.0 runs against
// scripted API responses. No network, no real emails, no real credentials.
export function jsonRequest(url, body, raw) {
  return new Request(`http://localhost${url}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: raw !== undefined ? raw : JSON.stringify(body),
  });
}

// responder(url, init) => { status, body } | throws. Returns { calls, restore }.
export function stubFetch(responder) {
  const original = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, init = {}) => {
    const call = { url: String(url), method: init.method, body: init.body ? JSON.parse(init.body) : undefined };
    calls.push(call);
    const { status = 200, body = {} } = await responder(call);
    return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
  };
  return { calls, restore: () => { globalThis.fetch = original; } };
}

export const RESEND_OK = () => ({ status: 200, body: { id: 'test-id' } });
export const RESEND_422 = () => ({ status: 422, body: { name: 'validation_error', message: 'Invalid `reply_to` field.', statusCode: 422 } });
export const RESEND_500 = () => ({ status: 500, body: 'not json' });

export function silenceConsoleError() {
  const original = console.error;
  const lines = [];
  console.error = (...a) => lines.push(a.map(String).join(' '));
  return { lines, restore: () => { console.error = original; } };
}
