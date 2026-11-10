// End-to-end acceptance run against real Chrome / Edge with a throwaway profile.
// Usage: node tests/e2e/browser.e2e.mjs <chrome|edge|path-to-browser-exe>
// Uses a local HTTP server and *.test host mapping; no real sites or profiles are touched.
import puppeteer from 'puppeteer-core';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { mkdtemp, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const BROWSERS = {
  chrome: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  edge: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
};
const exe = BROWSERS[process.argv[2]] ?? process.argv[2];
if (!exe) throw new Error('Pass chrome, edge or a browser path');
const EXT = fileURLToPath(new URL('../../extension/', import.meta.url));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const results = [];
async function check(name, fn) {
  try {
    await fn();
    results.push(['PASS', name]);
    console.log('PASS', name);
  } catch (err) {
    results.push(['FAIL', name, err.message]);
    console.log('FAIL', name, '-', err.message);
  }
}
function expect(cond, msg) {
  if (!cond) throw new Error(msg);
}
async function until(fn, msg, timeout = 5000) {
  const start = Date.now();
  let last;
  while (Date.now() - start < timeout) {
    last = await fn().catch((e) => e);
    if (last === true) return;
    await sleep(150);
  }
  throw new Error(`${msg} (last: ${last instanceof Error ? last.message : JSON.stringify(last)})`);
}

const server = http.createServer((req, res) => {
  res.setHeader('content-type', 'text/html');
  res.end(`<!doctype html><title>test</title><body>OK ${req.headers.host.split(':')[0]}${req.url}</body>`);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const port = server.address().port;
const site = (host, p = '/') => `http://${host}:${port}${p}`;

const profile = await mkdtemp(path.join(os.tmpdir(), 'take-reins-e2e-'));
const launch = () => puppeteer.launch({
  executablePath: exe,
  headless: true,
  pipe: true,
  enableExtensions: true,
  userDataDir: profile,
  args: ['--host-resolver-rules=MAP *.test 127.0.0.1', '--no-first-run', '--no-default-browser-check'],
});

const browser = await launch();
console.log('Browser:', await browser.version());
const id = await browser.installExtension(EXT);
const blockedPrefix = `chrome-extension://${id}/blocked.html#`;

async function worker() {
  const target = await browser.waitForTarget((t) => t.type() === 'service_worker' && t.url().startsWith(`chrome-extension://${id}/`));
  return target.worker();
}
const sw = async (fn, ...args) => (await worker()).evaluate(fn, ...args);
const badge = () => sw(() => chrome.action.getBadgeText({}));
const setEnd = (host, msFromNow) => sw(async (h, ms) => {
  const { state } = await chrome.storage.local.get('state');
  state.unblocks[h] = Date.now() + ms;
  await chrome.storage.local.set({ state });
}, host, msFromNow);

async function clickByText(page, selector, text) {
  return page.$$eval(selector, (els, t) => {
    const b = els.find((e) => e.textContent === t);
    if (!b) return false;
    b.click();
    return true;
  }, text);
}

const popup = await browser.newPage();
const popupUrl = `chrome-extension://${id}/popup.html`;
await popup.goto(popupUrl);
const listed = () => popup.$$eval('#site-list .site', (els) => els.map((e) => e.textContent));
async function addViaPopup(text) {
  await popup.$eval('#site-input', (el) => { el.value = ''; });
  await popup.type('#site-input', text);
  await popup.click('#add-form button[type=submit]');
  await sleep(300);
}

await check('AC2 add normalizes input', async () => {
  await addViaPopup('https://WWW.Blocked.test/some/path');
  await until(async () => JSON.stringify(await listed()) === '["blocked.test"]', 'list should be [blocked.test]');
});
await check('AC2 duplicate and invalid input are rejected with a message', async () => {
  await addViaPopup('blocked.test');
  expect(/already/i.test(await popup.$eval('#form-error', (e) => e.textContent)), 'duplicate error');
  await addViaPopup('not a site');
  expect((await popup.$eval('#form-error', (e) => e.textContent)).length > 0, 'invalid error');
  expect(JSON.stringify(await listed()) === '["blocked.test"]', 'list unchanged');
});

const tab = await browser.newPage();
const body = () => tab.$eval('body', (b) => b.textContent);

await check('AC1 blocked site redirects to the blocked page with original URL', async () => {
  await tab.goto(site('blocked.test', '/a?x=1'));
  await until(async () => tab.url() === blockedPrefix + site('blocked.test', '/a?x=1'), `url was ${tab.url()}`);
  await until(async () => (await tab.$eval('#site', (e) => e.textContent)) === 'blocked.test', 'site name shown');
});
await check('AC1 subdomain is blocked', async () => {
  await tab.goto(site('sub.blocked.test'));
  await until(async () => tab.url().startsWith(blockedPrefix), `url was ${tab.url()}`);
});
await check('AC1 near-miss domain is allowed', async () => {
  await tab.goto(site('notblocked.test'));
  expect((await body()).startsWith('OK notblocked.test'), await body());
});
await check('Blocked page renders hostile fragment as text only', async () => {
  await tab.goto(`chrome-extension://${id}/blocked.html#javascript:alert(1)`);
  await sleep(300);
  expect(await tab.$eval('#unblock', (e) => e.hidden), 'no unblock offered for non-http URL');
  expect(await tab.$eval('#continue-wrap', (e) => e.hidden), 'no continue offered');
});

await check('AC4 unblock 5 min from blocked page reopens the URL; badge 5m', async () => {
  await tab.goto(site('blocked.test', '/a'));
  await tab.waitForSelector('#unblock-buttons button');
  await Promise.all([tab.waitForNavigation(), tab.click('#unblock-buttons button')]);
  expect(tab.url() === site('blocked.test', '/a'), `url was ${tab.url()}`);
  expect((await body()).startsWith('OK blocked.test/a'), await body());
  await until(async () => (await badge()) === '5m', 'badge 5m');
});

await check('AC5 last 2 minutes: m:ss badge ticks down and notification appears', async () => {
  await setEnd('blocked.test', 118_000);
  await popup.reload();
  await until(async () => /^1:5\d$/.test(await badge()), 'badge m:ss');
  const first = await badge();
  await sleep(2200);
  const second = await badge();
  expect(first !== second, `badge did not tick (${first} -> ${second})`);
  const notes = await sw(() => new Promise((r) => chrome.notifications.getAll(r)));
  expect(Object.hasOwn(notes, 'countdown:blocked.test'), `notifications: ${JSON.stringify(notes)}`);
  await until(async () => (await popup.$$('#unblocked-list .item.urgent')).length === 1, 'popup highlights urgent unblock');
});

await check('AC6 +2 min in popup extends and leaves the countdown window', async () => {
  await popup.waitForSelector('#unblocked-list button');
  await clickByText(popup, '#unblocked-list button', '+2 min');
  await until(async () => (await badge()) === '4m', 'badge 4m');
  const notes = await sw(() => new Promise((r) => chrome.notifications.getAll(r)));
  expect(!Object.hasOwn(notes, 'countdown:blocked.test'), 'notification cleared');
});

await check('AC7 at zero the open tab is redirected and the badge clears', async () => {
  await setEnd('blocked.test', 3_000);
  await popup.reload();
  await until(async () => tab.url().startsWith(blockedPrefix), `tab url ${tab.url()}`, 10_000);
  expect((await badge()) === '', 'badge cleared');
  await tab.goto(site('blocked.test', '/again'));
  await until(async () => tab.url().startsWith(blockedPrefix), 'new visit blocked');
});

await check('AC8 (partial) wake-up alarms persist for countdown start and end', async () => {
  await popup.goto(popupUrl);
  await until(() => clickByText(popup, '#site-list button', '5m'), 'unblock 5m button');
  await until(async () => (await badge()) === '5m', 'unblocked');
  const { end, alarms } = await sw(async () => ({
    end: (await chrome.storage.local.get('state')).state.unblocks['blocked.test'],
    alarms: (await chrome.alarms.getAll()).map((a) => a.scheduledTime).sort(),
  }));
  expect(JSON.stringify(alarms) === JSON.stringify([end - 120_000, end]), `alarms ${alarms} vs end ${end}`);
  // Browser restart / worker termination are verified manually (see docs/validation.md):
  // CDP-loaded extensions do not survive a restart and stopAllWorkers wedges the worker under automation.
});

await check('AC3 removing the site unblocks it', async () => {
  const step = (m) => process.env.E2E_DEBUG && console.log('  step:', m);
  step('goto popup');
  await popup.goto(popupUrl);
  step('click remove');
  await until(() => clickByText(popup, '#site-list button', 'Remove'), 'remove button');
  step('wait list empty');
  await until(async () => (await listed()).length === 0, 'list empty');
  step('visit');
  const t = await browser.newPage();
  await t.goto(site('blocked.test', '/free'));
  step('read body');
  expect((await t.$eval('body', (b) => b.textContent)).startsWith('OK blocked.test'), `url ${t.url()}`);
});

await browser.close();
server.close();
await rm(profile, { recursive: true, force: true }).catch(() => {});
const failed = results.filter((r) => r[0] === 'FAIL');
console.log(`\n${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length ? 1 : 0);
