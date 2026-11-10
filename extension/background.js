// Take Reins service worker: applies stored state to the browser.
// All decisions come from the pure modules in ./core; this file only does I/O.

import { hostMatchesSite } from './core/domain.js';
import {
  sanitizeState, addSite, removeSite, startUnblock, extendUnblock, expireUnblocks,
  blockedDomains, UNBLOCK_MINUTES, EXTEND_MINUTES,
} from './core/state.js';
import { badgeFor, nextWakeups, formatClock, COUNTDOWN_MS } from './core/display.js';
import { buildRules, blockedPageUrl, RULE_ID } from './core/rules.js';

const STATE_KEY = 'state';
const NOTIFIED_KEY = 'notified'; // session storage: { site: endsAt } already notified
const NOTIFICATION_PREFIX = 'countdown:';
const DEFAULT_ICON = { 16: 'icons/icon-16.png', 32: 'icons/icon-32.png' };
const STOPWATCH_ICON = { 16: 'icons/stopwatch-16.png', 32: 'icons/stopwatch-32.png' };

let ticker = null;
let iconMode = null; // 'default' | 'stopwatch'; null after a worker restart

// ---- Serialized state access -------------------------------------------------
// Every read-modify-write goes through this queue so concurrent messages,
// alarms and ticks cannot overwrite each other.
let queue = Promise.resolve();
function serialized(task) {
  const run = queue.then(task, task);
  queue = run.catch(() => {});
  return run;
}

async function loadState() {
  const stored = await chrome.storage.local.get(STATE_KEY);
  return sanitizeState(stored[STATE_KEY]);
}

async function saveState(state) {
  await chrome.storage.local.set({ [STATE_KEY]: state });
}

/** Expire finished unblocks, then make the browser match the state. */
async function syncNow() {
  const now = Date.now();
  let state = await loadState();
  const { state: next, expired } = expireUnblocks(state, now);
  if (expired.length) {
    state = next;
    await saveState(state);
  }
  await applyRules(state, now);
  await redirectBlockedTabs(state, now);
  await scheduleAlarms(state, now);
  await updateNotifications(state, now);
  await updateBadge(state, now);
  return state;
}

function sync() {
  return serialized(syncNow);
}

/** Per-second countdown update: cheap unless an unblock has just ended. */
function tick() {
  return serialized(async () => {
    const now = Date.now();
    const state = await loadState();
    if (Object.values(state.unblocks).some((end) => end <= now)) return syncNow();
    await updateNotifications(state, now);
    await updateBadge(state, now);
    return state;
  });
}

async function mutate(change) {
  return serialized(async () => {
    const before = await loadState();
    const { state, error } = change(before, Date.now());
    if (error) return { ok: false, error, state: before };
    await saveState(state);
    return { ok: true, state: await syncNow() };
  });
}

// ---- Browser effects --------------------------------------------------------

async function applyRules(state, now) {
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [RULE_ID],
    addRules: buildRules(blockedDomains(state, now), chrome.runtime.id),
  });
}

/** SB-06: tabs already showing a blocked site are sent to the blocked page. */
async function redirectBlockedTabs(state, now) {
  const blocked = blockedDomains(state, now);
  if (blocked.length === 0) return;
  const tabs = await chrome.tabs.query({ url: ['http://*/*', 'https://*/*'] });
  await Promise.all(tabs.map(async (tab) => {
    let host;
    try {
      host = new URL(tab.url).hostname;
    } catch {
      return;
    }
    if (!blocked.some((site) => hostMatchesSite(host, site))) return;
    try {
      await chrome.tabs.update(tab.id, { url: blockedPageUrl(chrome.runtime.id, tab.url) });
    } catch (err) {
      console.warn('Take Reins: could not redirect tab', tab.id, err);
    }
  }));
}

async function scheduleAlarms(state, now) {
  await chrome.alarms.clearAll();
  for (const when of nextWakeups(state, now)) {
    await chrome.alarms.create(`wake-${when}`, { when });
  }
}

async function updateBadge(state, now) {
  const badge = badgeFor(state, now);
  await chrome.action.setBadgeText({ text: badge.text });
  if (badge.text) {
    await chrome.action.setBadgeBackgroundColor({ color: badge.countdown ? '#c5221f' : '#3c4043' });
    await chrome.action.setBadgeTextColor?.({ color: '#ffffff' });
  }
  const mode = badge.countdown ? 'stopwatch' : 'default';
  if (mode !== iconMode) {
    await chrome.action.setIcon({ path: badge.countdown ? STOPWATCH_ICON : DEFAULT_ICON });
    iconMode = mode;
  }
  await chrome.action.setTitle({
    title: badge.site ? `Take Reins — ${badge.site} unblocked, ${formatClock(state.unblocks[badge.site] - now)} left` : 'Take Reins',
  });
  setTicker(badge.countdown);
}

/** A 1-second ticker runs only during a countdown. Alarms cover the rest. */
function setTicker(on) {
  if (on && !ticker) {
    ticker = setInterval(() => { tick().catch(logError); }, 1000);
  } else if (!on && ticker) {
    clearInterval(ticker);
    ticker = null;
  }
}

/** SB-05: one notification per unblock when its countdown starts. */
async function updateNotifications(state, now) {
  const stored = await chrome.storage.session.get(NOTIFIED_KEY);
  const notified = stored[NOTIFIED_KEY] && typeof stored[NOTIFIED_KEY] === 'object' ? stored[NOTIFIED_KEY] : {};
  const next = {};
  for (const [site, end] of Object.entries(state.unblocks)) {
    const remaining = end - now;
    if (remaining <= 0 || remaining > COUNTDOWN_MS) continue;
    next[site] = end;
    if (notified[site] === end) continue;
    await chrome.notifications.create(NOTIFICATION_PREFIX + site, {
      type: 'basic',
      iconUrl: 'icons/icon-128.png',
      title: `${site} will be blocked soon`,
      message: `About ${Math.ceil(remaining / 60_000)} min left. Need a little longer?`,
      buttons: EXTEND_MINUTES.map((m) => ({ title: `+${m} min` })),
      requireInteraction: true,
      priority: 1,
    });
  }
  for (const site of Object.keys(notified)) {
    if (!Object.hasOwn(next, site)) await chrome.notifications.clear(NOTIFICATION_PREFIX + site);
  }
  await chrome.storage.session.set({ [NOTIFIED_KEY]: next });
}

// ---- Messages from extension pages ------------------------------------------

const isString = (v) => typeof v === 'string' && v.length > 0 && v.length <= 2048;

async function handleMessage(msg) {
  if (!msg || typeof msg !== 'object') return { ok: false, error: 'Bad request.' };
  switch (msg.type) {
    case 'getState':
      return { ok: true, state: await sync(), now: Date.now(), unblockMinutes: UNBLOCK_MINUTES, extendMinutes: EXTEND_MINUTES };
    case 'addSite':
      if (!isString(msg.input)) return { ok: false, error: 'Enter a website such as example.com.' };
      return mutate((s) => addSite(s, msg.input));
    case 'removeSite':
      if (!isString(msg.site)) return { ok: false, error: 'Bad request.' };
      return mutate((s) => ({ state: removeSite(s, msg.site) }));
    case 'unblock':
      if (!isString(msg.site) || !Number.isInteger(msg.minutes)) return { ok: false, error: 'Bad request.' };
      return mutate((s, now) => startUnblock(s, msg.site, msg.minutes, now));
    case 'unblockHost':
      // From the blocked page: unblock every listed site that covers this host.
      if (!isString(msg.host) || !Number.isInteger(msg.minutes)) return { ok: false, error: 'Bad request.' };
      return mutate((s, now) => {
        const sites = s.sites.filter((site) => hostMatchesSite(msg.host, site));
        if (sites.length === 0) return { state: s, error: 'That site is not on your block list.' };
        let next = s;
        for (const site of sites) {
          const r = startUnblock(next, site, msg.minutes, now);
          if (r.error) return { state: s, error: r.error };
          next = r.state;
        }
        return { state: next };
      });
    case 'extend':
      if (!isString(msg.site) || !Number.isInteger(msg.minutes)) return { ok: false, error: 'Bad request.' };
      return mutate((s, now) => extendUnblock(s, msg.site, msg.minutes, now));
    default:
      return { ok: false, error: 'Unknown request.' };
  }
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  // Only our own extension pages may change settings.
  if (sender.id !== chrome.runtime.id || !sender.url?.startsWith(`chrome-extension://${chrome.runtime.id}/`)) return false;
  handleMessage(msg)
    .then(sendResponse)
    .catch((err) => {
      logError(err);
      sendResponse({ ok: false, error: 'Something went wrong. Please try again.' });
    });
  return true; // async response
});

// ---- Wake-up sources ---------------------------------------------------------

chrome.notifications.onButtonClicked.addListener((id, index) => {
  if (!id.startsWith(NOTIFICATION_PREFIX)) return;
  const minutes = EXTEND_MINUTES[index];
  if (!minutes) return;
  const site = id.slice(NOTIFICATION_PREFIX.length);
  chrome.notifications.clear(id);
  mutate((s, now) => extendUnblock(s, site, minutes, now)).catch(logError);
});

chrome.alarms.onAlarm.addListener(() => { sync().catch(logError); });
chrome.runtime.onStartup.addListener(() => { sync().catch(logError); });
chrome.runtime.onInstalled.addListener(() => { sync().catch(logError); });
// Any worker start (including after being idle-terminated) reconciles state.
sync().catch(logError);

function logError(err) {
  console.error('Take Reins:', err);
}
