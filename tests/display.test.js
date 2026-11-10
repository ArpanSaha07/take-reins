// SB-04: badge/countdown presentation and wake-up schedule
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { emptyState, addSite, startUnblock } from '../extension/core/state.js';
import { badgeFor, nextWakeups, COUNTDOWN_MS } from '../extension/core/display.js';

const MIN = 60_000;
const T0 = Date.UTC(2026, 10, 9, 12, 0, 0);
const state = (...pairs) => {
  let s = emptyState();
  for (const [site] of pairs) s = addSite(s, site).state;
  for (const [site, mins] of pairs) if (mins) s = startUnblock(s, site, mins, T0).state;
  return s;
};

test('SB-04 no badge when nothing is unblocked', () => {
  assert.deepEqual(badgeFor(state(['a.com']), T0), { text: '', countdown: false, site: null });
});

test('SB-04 shows rounded-up minutes before the countdown window', () => {
  const s = state(['a.com', 5]);
  assert.equal(badgeFor(s, T0).text, '5m');
  assert.equal(badgeFor(s, T0 + 1).text, '5m');
  const justBefore = T0 + 3 * MIN - 1; // 2:00.001 left
  assert.equal(badgeFor(s, justBefore).text, '3m');
  assert.equal(badgeFor(s, justBefore).countdown, false);
});

test('SB-04 counts down m:ss during the last two minutes', () => {
  assert.equal(COUNTDOWN_MS, 2 * MIN);
  const s = state(['a.com', 5]);
  const end = T0 + 5 * MIN;
  assert.deepEqual(badgeFor(s, end - 2 * MIN), { text: '2:00', countdown: true, site: 'a.com' });
  assert.equal(badgeFor(s, end - 119_500).text, '2:00');
  assert.equal(badgeFor(s, end - 61_000).text, '1:01');
  assert.equal(badgeFor(s, end - 9_000).text, '0:09');
  assert.equal(badgeFor(s, end - 1).text, '0:01');
  assert.equal(badgeFor(s, end).text, '');
});

test('SB-04 shows the soonest-ending unblock', () => {
  const s = state(['a.com', 15], ['b.com', 5]);
  assert.equal(badgeFor(s, T0).site, 'b.com');
});

test('SB-07 wake-ups cover countdown start and end for each future unblock', () => {
  const s = state(['a.com', 5], ['b.com', 10]);
  assert.deepEqual(nextWakeups(s, T0), [T0 + 3 * MIN, T0 + 5 * MIN, T0 + 8 * MIN, T0 + 10 * MIN]);
  assert.deepEqual(nextWakeups(s, T0 + 4 * MIN), [T0 + 5 * MIN, T0 + 8 * MIN, T0 + 10 * MIN]);
});
