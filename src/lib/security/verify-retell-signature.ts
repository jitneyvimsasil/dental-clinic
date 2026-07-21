import "server-only";
import { createHmac, timingSafeEqual } from "crypto";

// RetellAI signs every webhook/custom-function call with X-Retell-Signature,
// format "v={timestamp_ms},d={hex_digest}", where the digest is
// HMAC-SHA256(rawBody + timestamp) keyed by the account's API key. There is
// no separate webhook secret — the API key itself is the HMAC secret, and
// only API keys with the "webhook" capability can verify. The Node SDK
// doesn't ship a verify helper, so this is a manual implementation matching
// https://docs.retellai.com/features/secure-webhook exactly.
//
// Critical: `rawBody` must be the exact request body string, read via
// request.text() — never a re-serialized JSON.stringify(parsedBody), which
// can differ in whitespace/key order and silently break verification.
const MAX_CLOCK_SKEW_MS = 5 * 60 * 1000;

export function verifyRetellSignature(
  rawBody: string,
  signatureHeader: string | null,
  apiKey: string | undefined
): boolean {
  if (!apiKey || !signatureHeader) return false;

  const match = /^v=(\d+),d=(.+)$/.exec(signatureHeader);
  if (!match) return false;

  const [, timestamp, digest] = match;

  if (Math.abs(Date.now() - Number(timestamp)) > MAX_CLOCK_SKEW_MS) return false;

  const expected = createHmac("sha256", apiKey).update(rawBody + timestamp).digest("hex");

  const expectedBuf = Buffer.from(expected, "hex");
  const digestBuf = Buffer.from(digest, "hex");
  if (expectedBuf.length !== digestBuf.length) return false;

  return timingSafeEqual(expectedBuf, digestBuf);
}
