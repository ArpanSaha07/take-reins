// SB-01, SB-03, SB-05, SB-06, SB-07: state transitions with a fake clock
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  emptyState, sanitizeState, addSite, removeSite, startUnblock, extendUnblock,
  expireUnblocks, blockedDomains, MAX_SITES, UNBLOCK_MINUTES, EXTEND_MINUTES,
} from '../extension/core/state.js';

const MIN = 60_000;
const T0 = Date.UTC(2026, 10, 9, 12, 0, 0);

function withSites(...sites) {
  let s = emptyState();
  for (const site of sites) s = addSite(s, site).state;
  return s;
}

test('SB-01 addSite normalizes, rejects duplicates and keeps state on error', () => {
  const r = addSite(emptyState(), 'https://www.Example.com/x');
  assert.equal(r.error, undefined);
  assert.deepEqual(r.state.sites, ['example.com']);
  const dup = addSite(r.state, 'example.com');
  assert.match(dup.error, /already/i);
  assert.equal(dup.state, r.state);
  const bad = addSite(r.state, 'nope');
  assert.ok(bad.error);
  assert.equal(bad.state, r.state);
});

test('SB-01 enforces the site limit', () => {
  let s = emptyState();
  for (let i = 0; i < MAX_SITES; i++) s = addSite(s, `site${i}.com`).state;
  const r = addSite(s, 'one-more.com');
  assert.match(r.error, /limit/i);
  assert.equal(r.state.sites.length, MAX_SITES);
});

test('SB-01 removeSite also drops its unblock timer', () => {
  let s = withSites('a.com', 'b.com');
  s = startUnblock(s, 'a.com', 5, T0).state;
  s = removeSite(s, 'a.com');
  assert.deepEqual(s.sites, ['b.com']);
  assert.deepEqual(s.unblocks, {});
});

test('SB-03 unblocks one site only, for an offered duration', () => {
  const s = withSites('a.com', 'b.com');
  assert.deepEqual(UNBLOCK_MINUTES, [5, 10, 15]);
  const r = startUnblock(s, 'a.com', 5, T0);
  assert.equal(r.error, undefined);
  assert.equal(r.state.unblocks['a.com'], T0 + 5 * MIN);
  assert.deepEqual(blockedDomains(r.state, T0), ['b.com']);
  assert.ok(startUnblock(s, 'a.com', 7, T0).error, 'rejects non-offered duration');
  assert.ok(startUnblock(s, 'zzz.com', 5, T0).error, 'rejects unknown site');
});

test('SB-05 extend adds 1 or 2 minutes to an active unblock only', () => {
  const s = startUnblock(withSites('a.com'), 'a.com', 5, T0).state;
  const now = T0 + 4.5 * MIN;
  const r = extendUnblock(s, 'a.com', 2, now);
  assert.equal(r.state.unblocks['a.com'], T0 + 7 * MIN);
  assert.deepEqual(EXTEND_MINUTES, [1, 2]);
  assert.ok(extendUnblock(s, 'a.com', 3, now).error);
  assert.ok(extendUnblock(s, 'a.com', 1, T0 + 6 * MIN).error, 'cannot extend after expiry');
});

test('SB-06/SB-07 expiry re-blocks exactly at end time, even after a long sleep', () => {
  let s = startUnblock(withSites('a.com', 'b.com'), 'a.com', 10, T0).state;
  s = startUnblock(s, 'b.com', 5, T0).state;
  let r = expireUnblocks(s, T0 + 5 * MIN - 1);
  assert.deepEqual(r.expired, []);
  r = expireUnblocks(s, T0 + 5 * MIN);
  assert.deepEqual(r.expired, ['b.com']);
  assert.deepEqual(blockedDomains(r.state, T0 + 5 * MIN), ['b.com']);
  r = expireUnblocks(s, T0 + 24 * 60 * MIN); // woke a day later
  assert.deepEqual(r.expired.sort(), ['a.com', 'b.com']);
  assert.deepEqual(r.state.unblocks, {});
});

test('SB-07 blockedDomains fails closed for a past timer not yet expired', () => {
  const s = startUnblock(withSites('a.com'), 'a.com', 5, T0).state;
  assert.deepEqual(blockedDomains(s, T0 + 5 * MIN), ['a.com']);
});

test('SB-07 sanitizeState repairs corrupt or hostile stored data', () => {
  assert.deepEqual(sanitizeState(undefined), emptyState());
  assert.deepEqual(sanitizeState('junk'), emptyState());
  const s = sanitizeState({
    sites: ['Example.com', 'example.com', 'bad site', 5, 'b.com'],
    unblocks: { 'b.com': T0, 'ghost.com': T0, 'example.com': 'soon', constructor: T0 },
  }, T0);
  assert.deepEqual(s.sites, ['example.com', 'b.com']);
  assert.deepEqual(s.unblocks, { 'b.com': T0 });
  const farFuture = sanitizeState({ sites: ['a.com'], unblocks: { 'a.com': T0 + 25 * 60 * MIN } }, T0);
  assert.deepEqual(farFuture.unblocks, {}, 'rejects implausible end times');
});
