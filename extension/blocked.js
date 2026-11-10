// Blocked page. The original URL arrives in the fragment (set by the DNR rule
// or by the worker when it redirects an open tab). It is untrusted input:
// shown only as text, and reopened only if it is http(s) and its host matches
// a site the user has just unblocked.
import { hostMatchesSite } from './core/domain.js';

const $ = (id) => document.getElementById(id);

function parseTarget() {
  const raw = location.hash.slice(1);
  if (!raw) return null;
  try {
    const url = new URL(raw);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url : null;
  } catch {
    return null;
  }
}

const target = parseTarget();

function showContinue() {
  $('continue-wrap').hidden = false;
  $('continue').onclick = () => location.replace(target.href);
}

async function init() {
  if (!target) {
    $('site').textContent = '';
    return;
  }
  const host = target.hostname;
  $('site').textContent = host;
  document.title = `${host} blocked — Take Reins`;

  let res;
  try {
    res = await chrome.runtime.sendMessage({ type: 'getState' });
  } catch {
    res = null;
  }
  if (!res?.ok) {
    $('error').textContent = 'Take Reins is not responding. Reload this page to try again.';
    return;
  }
  const { state, now, unblockMinutes } = res;
  const matching = state.sites.filter((site) => hostMatchesSite(host, site));
  const stillBlocked = matching.some((site) => !(state.unblocks[site] > now));

  if (!stillBlocked) {
    // Removed from the list or already unblocked (e.g. from the popup).
    $('title').textContent = matching.length ? 'This site is unblocked for now' : 'This site is no longer blocked';
    showContinue();
    return;
  }

  $('unblock').hidden = false;
  $('unblock-buttons').replaceChildren(...unblockMinutes.map((minutes) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = `Unblock for ${minutes} min`;
    button.addEventListener('click', async () => {
      $('error').textContent = '';
      let r;
      try {
        r = await chrome.runtime.sendMessage({ type: 'unblockHost', host, minutes });
      } catch {
        r = null;
      }
      if (r?.ok) location.replace(target.href);
      else $('error').textContent = r?.error ?? 'Could not unblock. Please try again.';
    });
    return button;
  }));
}

init();
