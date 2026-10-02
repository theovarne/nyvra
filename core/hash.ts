import { createHash } from 'node:crypto';

export const HASH_PATTERN = /^0x[0-9a-f]{64}$/;
export const isHash = (value: unknown): value is string => typeof value === 'string' && HASH_PATTERN.test(value);
export const isRecord = (value: unknown): value is Record<string, unknown> => value !== null && typeof value === 'object' && !Array.isArray(value) && [Object.prototype, null].includes(Object.getPrototypeOf(value));
export const hasKeys = (value: Record<string, unknown>, keys: readonly string[]): boolean => Object.keys(value).length === keys.length && keys.every(key => Object.hasOwn(value, key));
export const integer = (value: unknown, min = 0, max = Number.MAX_SAFE_INTEGER): value is number => typeof value === 'number' && Number.isSafeInteger(value) && value >= min && value <= max;

/** Repository-specific canonical JSON, NOT a claim of RFC 8785 compatibility. */
export function canonical(value: unknown): string {
  if (value === null || typeof value === 'boolean' || typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'number' && Number.isSafeInteger(value)) return JSON.stringify(value);
  if (Array.isArray(value)) return '[' + Array.from(value, canonical).join(',') + ']';
  if (isRecord(value)) return '{' + Object.keys(value).sort().map(key => JSON.stringify(key) + ':' + canonical(value[key])).join(',') + '}';
  throw new TypeError('Canonical values must be JSON strings, safe integers, booleans, null, arrays or plain objects.');
}

export function hash(domain: string, value: unknown): string {
  return '0x' + createHash('sha256').update(domain + '\n' + canonical(value), 'utf8').digest('hex');
}

export function freeze<T>(value: T): Readonly<T> {
  if (value !== null && typeof value === 'object') {
    for (const item of Object.values(value)) freeze(item);
    Object.freeze(value);
  }
  return value;
}
