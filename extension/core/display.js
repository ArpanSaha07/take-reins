// Toolbar badge and wake-up scheduling derived from state. Pure functions.

export const COUNTDOWN_MS = 2 * 60_000;

/** Badge for the soonest-ending active unblock at `now`. */
export function badgeFor(state, now) {
  let site = null;
  let end = Infinity;
  for (const [s, e] of Object.entries(state.unblocks)) {
    if (e > now && e < end) {
      site = s;
      end = e;
    }
  }
  if (site === null) return { text: '', countdown: false, site: null };
  const remaining = end - now;
  if (remaining > COUNTDOWN_MS) return { text: `${Math.ceil(remaining / 60_000)}m`, countdown: false, site };
  return { text: formatClock(remaining), countdown: true, site };
}

/** m:ss, rounding up so the display reaches 0:01 before the end, never 0:00. */
export function formatClock(ms) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

/** Future instants at which the background must wake: countdown start and end. */
export function nextWakeups(state, now) {
  const times = [];
  for (const end of Object.values(state.unblocks)) {
    for (const t of [end - COUNTDOWN_MS, end]) if (t > now) times.push(t);
  }
  return times.sort((a, b) => a - b);
}
