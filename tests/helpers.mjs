// Test helpers: stub global fetch so the REAL Resend SDK 3.5.0 runs against
// scripted API responses. No network, no real emails, no real credentials.
export function jsonRequest(url, body, raw, extraHeaders = {}) {
  return new Request(`http://localhost${url}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
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
    const { status = 200, body = {}, raw, contentType = 'application/json' } = await responder(call);
    // `raw` sends a body verbatim (e.g. an HTML gateway-error page) so
    // non-JSON provider failures are mocked realistically instead of as a
    // JSON-encoded string.
    return new Response(raw !== undefined ? raw : JSON.stringify(body), { status, headers: { 'Content-Type': contentType } });
  };
  return { calls, restore: () => { globalThis.fetch = original; } };
}

export const RESEND_OK = () => ({ status: 200, body: { id: 'test-id' } });
export const RESEND_422 = () => ({ status: 422, body: { name: 'validation_error', message: 'Invalid `reply_to` field.', statusCode: 422 } });
// Real Resend/gateway 5xx failures are not guaranteed to be JSON.
export const RESEND_500 = () => ({ status: 502, raw: '<html><body><h1>502 Bad Gateway</h1></body></html>', contentType: 'text/html' });
// A 200 whose body lacks the `id` Resend always returns on success.
export const RESEND_200_NO_ID = () => ({ status: 200, body: {} });

export function silenceConsoleError() {
  const original = console.error;
  const lines = [];
  console.error = (...a) => lines.push(a.map(String).join(' '));
  return { lines, restore: () => { console.error = original; } };
}

// The Reply-To value actually sent to Resend. SDK 3.5.0 forwards the payload
// verbatim and its API field is snake_case `reply_to`; a camelCase `replyTo`
// key is silently ignored by Resend, so only `reply_to` counts.
export const replyToOf = (sentBody) => sentBody.reply_to;
