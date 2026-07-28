/**
 * utils/logger.js
 *
 * Structured console logger with timestamps, levels, and context tags.
 *
 * Usage:
 *   import { logger } from '../utils/logger.js';
 *   logger.info('[newsProvider]', 'fetching INFY', { articles: 20 });
 *   // → [2026-07-27T14:10:00.000Z] INFO  [newsProvider] fetching INFY {"articles":20}
 *
 * Levels: info, warn, error, debug
 * Each method signature: (tag, message, data?)
 */

/**
 * Core log writer.
 *
 * @param {'INFO'|'WARN'|'ERROR'|'DEBUG'} level  - Log level (padded to 5 chars)
 * @param {string}                        tag     - Context tag, e.g. '[newsProvider]'
 * @param {string}                        message - Human-readable message
 * @param {*}                             [data]  - Optional extra data (JSON-stringified inline)
 */
function write(level, tag, message, data) {
  const ts     = new Date().toISOString();
  // Pad level to 5 characters for consistent column alignment
  const lvl    = level.padEnd(5, ' ');
  const suffix = data !== undefined ? ' ' + JSON.stringify(data) : '';
  const line   = `[${ts}] ${lvl} ${tag} ${message}${suffix}`;

  // Route to the appropriate console method so log-aggregators pick up the level
  switch (level) {
    case 'ERROR': console.error(line); break;
    case 'WARN':  console.warn(line);  break;
    case 'DEBUG': console.debug(line); break;
    default:      console.log(line);   break;
  }
}

// ── Public API ─────────────────────────────────────────────────────────────

const info  = (tag, message, data) => write('INFO',  tag, message, data);
const warn  = (tag, message, data) => write('WARN',  tag, message, data);
const error = (tag, message, data) => write('ERROR', tag, message, data);
const debug = (tag, message, data) => write('DEBUG', tag, message, data);

export const logger = { info, warn, error, debug };
export default logger;
