// Lets plain Node load the Next.js route files unchanged: Next's bundler
// resolves extensionless `next/server`, Node's ESM resolver does not.
import { register } from 'node:module';
register('./resolve-hooks.mjs', import.meta.url);
