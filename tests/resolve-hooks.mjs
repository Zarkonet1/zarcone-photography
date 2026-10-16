// Next's bundler resolves extensionless specifiers (`next/server`,
// `../../../lib/formHandler`); Node's ESM resolver does not. This test-only
// hook adds the `.js` fallback so the real route files load unchanged.
// Also maps the app's `@/` alias (jsconfig paths) to the repo root.
export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('@/')) {
    specifier = new URL(`../${specifier.slice(2)}`, import.meta.url).href;
  }
  try {
    return await nextResolve(specifier, context);
  } catch (err) {
    if (err?.code === 'ERR_MODULE_NOT_FOUND' && !/\.\w+$/.test(specifier)) {
      return nextResolve(`${specifier}.js`, context);
    }
    throw err;
  }
}
