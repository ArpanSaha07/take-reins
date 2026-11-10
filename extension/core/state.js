// Blocker state and its transitions. Pure functions: callers pass `now` (epoch ms).
// Shape: { sites: string[], unblocks: { [site]: endsAtEpochMs } }

import { normalizeSite } from './domain.js';

export const MAX_SITES = 500;
export const UNBLOCK_MINUTES = Object.freeze([5, 10, 15]);
export const EXTEND_MINUTES = Object.freeze([1, 2]);
const MINUTE = 60_000;
// Longest end time we accept from storage: guards against corrupt far-future values.
const MAX_UNBLOCK_MS = 24 * 60 * MINUTE;

export function emptyState() {
  return { sites: [], unblocks: {} };
}

/** Validate anything read from storage; drop invalid parts instead of failing. */
export function sanitizeState(raw, now = Date.now()) {
  const state = emptyState();
  if (!raw || typeof raw !== 'object') return state;
  if (Array.isArray(raw.sites)) {
    for (const entry of raw.sites) {
      const n = normalizeSite(entry);
      if (n.ok && !state.sites.includes(n.site) && state.sites.length < MAX_SITES) state.sites.push(n.site);
    }
  }
  const unblocks = raw.unblocks;
  if (unblocks && typeof unblocks === 'object') {
    for (const site of state.sites) {
      if (!Object.hasOwn(unblocks, site)) continue;
      const end = unblocks[site];
      if (Number.isSafeInteger(end) && end > 0 && end <= now + MAX_UNBLOCK_MS) state.unblocks[site] = end;
    }
  }
  return state;
}

export function addSite(state, input) {
  const n = normalizeSite(input);
  if (!n.ok) return { state, error: n.error };
  if (state.sites.includes(n.site)) return { state, error: `${n.site} is already blocked.` };
  if (state.sites.length >= MAX_SITES) return { state, error: `You can block up to ${MAX_SITES} sites (limit reached).` };
  return { state: { ...state, sites: [...state.sites, n.site] } };
}

export function removeSite(state, site) {
  const { [site]: _removed, ...unblocks } = state.unblocks;
  return { sites: state.sites.filter((s) => s !== site), unblocks };
}

export function startUnblock(state, site, minutes, now) {
  if (!state.sites.includes(site)) return { state, error: 'That site is not on your block list.' };
  if (!UNBLOCK_MINUTES.includes(minutes)) return { state, error: 'Choose 5, 10 or 15 minutes.' };
  return { state: { ...state, unblocks: { ...state.unblocks, [site]: now + minutes * MINUTE } } };
}

export function extendUnblock(state, site, minutes, now) {
  if (!EXTEND_MINUTES.includes(minutes)) return { state, error: 'You can add 1 or 2 minutes.' };
  const end = state.unblocks[site];
  if (!Object.hasOwn(state.unblocks, site) || end <= now) return { state, error: 'That site is not currently unblocked.' };
  return { state: { ...state, unblocks: { ...state.unblocks, [site]: end + minutes * MINUTE } } };
}

/** Remove finished unblocks. `expired` lists the sites that are blocked again. */
export function expireUnblocks(state, now) {
  const expired = [];
  const unblocks = {};
  for (const [site, end] of Object.entries(state.unblocks)) {
    if (end <= now) expired.push(site);
    else unblocks[site] = end;
  }
  if (expired.length === 0) return { state, expired };
  return { state: { ...state, unblocks }, expired };
}

/** Sites that must be blocked at `now`. A timer at or past its end counts as blocked. */
export function blockedDomains(state, now) {
  return state.sites.filter((site) => !(Object.hasOwn(state.unblocks, site) && state.unblocks[site] > now));
}
