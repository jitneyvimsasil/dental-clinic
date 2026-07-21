import "server-only";
import { timingSafeEqual } from "crypto";

// Constant-time secret comparison, generalized from
// vim-automations-website's app/api/revalidate/route.ts. Used to
// authenticate RetellAI's webhook calls — a technically-public URL that
// should only ever be invoked by RetellAI itself.
export function verifySharedSecret(provided: string | null, expected: string | undefined): boolean {
  if (!expected || !provided) return false;

  const providedBuf = Buffer.from(provided);
  const expectedBuf = Buffer.from(expected);

  if (providedBuf.length !== expectedBuf.length) return false;

  return timingSafeEqual(providedBuf, expectedBuf);
}
