const WINDOW_MS = 10 * 60 * 1000
const MAX_REQUESTS = 5

const hits = new Map<string, number[]>()

/**
 * In-memory sliding-window limiter. Good enough for a single-instance deploy;
 * swap for a shared store (Redis/Upstash) if the site scales horizontally.
 */
export function isRateLimited(key: string): boolean {
  const now = Date.now()
  const recent = (hits.get(key) ?? []).filter((timestamp) => now - timestamp < WINDOW_MS)

  if (recent.length >= MAX_REQUESTS) {
    hits.set(key, recent)
    return true
  }

  recent.push(now)
  hits.set(key, recent)
  return false
}
