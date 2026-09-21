// Hostinger Node.js production entry file
// Loads compiled CommonJS backend bundle from dist/server.cjs
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

require('./dist/server.cjs');
