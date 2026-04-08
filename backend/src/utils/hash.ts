import crypto from 'crypto';

/**
 * Deterministic stringify:
 * - sorts object keys recursively
 * - makes JSON hashing stable across platforms
 */
export function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return String(value);
  if (typeof value !== 'object') return JSON.stringify(value);

  if (Array.isArray(value)) {
    return `[${value.map((v) => stableStringify(v)).join(',')}]`;
  }

  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(obj[k])}`).join(',')}}`;
}

/** Returns sha256 hex with 0x prefix (suitable for Solidity bytes32 when it's 32 bytes). */
export function sha256ToBytes32Hex(input: string): string {
  const hashHex = crypto.createHash('sha256').update(input).digest('hex');
  // sha256 is always 32 bytes -> 64 hex chars -> bytes32
  return `0x${hashHex}`;
}

