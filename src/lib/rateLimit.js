/**
 * In-memory rate limiter for Next.js API routes.
 *
 * Usage in any route handler:
 *   import { rateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rateLimit";
 *
 *   export async function POST(req) {
 *     const limit = rateLimit(req, RATE_LIMIT_CONFIGS.auth);
 *     if (!limit.success) return limit.response;
 *     // ... rest of handler
 *   }
 */

// ─── In-memory store (resets on cold start / serverless restart) ───────────────
const store = new Map(); // key → { count, resetAt }

/**
 * Clean up expired entries to avoid memory leaks.
 * Called lazily on each request (cheap — only iterates stale keys).
 */
function pruneExpired() {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt <= now) store.delete(key);
  }
}

/**
 * Extract the best available IP from the request.
 * Handles Vercel, Cloudflare, and plain Node.
 */
function getIP(req) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    req.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

/**
 * Core rate-limit function.
 *
 * @param {Request} req          - The incoming Next.js Request object
 * @param {object}  config
 * @param {number}  config.limit    - Max requests per window
 * @param {number}  config.window   - Window duration in milliseconds
 * @param {string}  [config.prefix] - Optional key prefix to namespace endpoints
 * @returns {{ success: boolean, response?: Response, remaining: number, resetAt: number }}
 */
export function rateLimit(req, config) {
  const { limit, window: windowMs, prefix = "rl" } = config;

  pruneExpired();

  const ip = getIP(req);
  const key = `${prefix}:${ip}`;
  const now = Date.now();

  let entry = store.get(key);

  // First request or window has expired → create fresh entry
  if (!entry || entry.resetAt <= now) {
    entry = { count: 1, resetAt: now + windowMs };
    store.set(key, entry);
    return { success: true, remaining: limit - 1, resetAt: entry.resetAt };
  }

  entry.count += 1;

  if (entry.count > limit) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return {
      success: false,
      remaining: 0,
      resetAt: entry.resetAt,
      response: new Response(
        JSON.stringify({
          error: "Too many requests. Please try again later.",
          retryAfter,
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(retryAfter),
            "X-RateLimit-Limit": String(limit),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(Math.ceil(entry.resetAt / 1000)),
          },
        }
      ),
    };
  }

  return {
    success: true,
    remaining: limit - entry.count,
    resetAt: entry.resetAt,
  };
}

/**
 * Pre-configured rate-limit profiles for each endpoint category.
 * Adjust `limit` / `window` to match your traffic expectations.
 */
export const RATE_LIMIT_CONFIGS = {
  /** Login / register — strict to prevent brute-force */
  auth: { limit: 10, window: 15 * 60 * 1000, prefix: "auth" },

  /** Admin login — tighter than regular auth */
  adminAuth: { limit: 5, window: 15 * 60 * 1000, prefix: "admin-auth" },

  /** Flight & hotel searches — moderate; each search is expensive */
  search: { limit: 30, window: 60 * 1000, prefix: "search" },

  /** TBO hotel API calls — keep costs down */
  tbo: { limit: 20, window: 60 * 1000, prefix: "tbo" },

  /** Booking endpoints — prevent duplicate submissions */
  booking: { limit: 10, window: 60 * 1000, prefix: "booking" },

  /** Contact / tailor-made query forms — anti-spam */
  contact: { limit: 5, window: 10 * 60 * 1000, prefix: "contact" },

  /** Generic read endpoints (airports, airlines, offers) */
  general: { limit: 60, window: 60 * 1000, prefix: "general" },
};
