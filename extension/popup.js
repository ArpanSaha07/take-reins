// Popup: manage the block list, start unblocks and extend running ones.
// All user values are rendered with textContent.
import { formatClock } from './core/display.js';

const $ = (id) => document.getElementById(id);
const form = $('add-form');
const input = $('site-input');
const formError = $('form-error');

let model = null; // { state, offset, unblockMinutes, extendMinutes }

async function send(message) {
  try {
    return await chrome.runtime.sendMessage(message);
  } catch (err) {
    return { ok: false, error: 'Take Reins is not responding. Try again.' };
  }
}

async function refresh() {
  const res = await send({ type: 'getState' });
  if (!res?.ok) {
    formError.textContent = res?.error ?? 'Could not load your settings.';
    return;
  }
  model = { state: res.state, offset: res.now - Date.now(), unblockMinutes: res.unblockMinutes, extendMinutes: res.extendMinutes };
  render();
}

async function act(message, errorEl = formError) {
  const res = await send(message);
  errorEl.textContent = res?.ok ? '' : (res?.error ?? 'Something went wrong.');
  if (res?.ok) {
    model.state = res.state;
    render();
  }
  return res;
}

function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  Object.assign(node, props);
  node.append(...children);
  return node;
}

let lastStructure = '';

function clockFor(site, left) {
  const clock = el('span', { className: 'clock', textContent: formatClock(left), title: 'Time left' });
  clock.dataset.site = site;
  return clock;
}

/**
 * Rebuild the lists only when what they contain changes; otherwise just update
 * the clocks. Rebuilding every second would swap buttons out from under a
 * click that is in progress.
 */
function render() {
  if (!model) return;
  const now = Date.now() + model.offset;
  const { sites, unblocks } = model.state;
  const active = sites.filter((s) => unblocks[s] > now).sort((a, b) => unblocks[a] - unblocks[b]);
  const structure = JSON.stringify([sites, active.map((s) => [s, unblocks[s], unblocks[s] - now <= 120_000])]);
  if (structure === lastStructure) {
    for (const clock of document.querySelectorAll('#unblocked-list .clock')) {
      clock.textContent = formatClock(unblocks[clock.dataset.site] - now);
    }
    return;
  }
  lastStructure = structure;

  const unblockedList = $('unblocked-list');
  unblockedList.replaceChildren(...active.map((site) => {
    const left = unblocks[site] - now;
    return el('li', { className: left <= 120_000 ? 'item urgent' : 'item' },
      el('span', { className: 'site', textContent: site }),
      clockFor(site, left),
      ...model.extendMinutes.map((m) => el('button', {
        type: 'button',
        className: 'small',
        textContent: `+${m} min`,
        ariaLabel: `Add ${m} minute${m > 1 ? 's' : ''} to ${site}`,
        onclick: () => act({ type: 'extend', site, minutes: m }),
      })),
    );
  }));
  $('unblocked-section').hidden = active.length === 0;

  $('empty').hidden = sites.length > 0;
  $('site-list').replaceChildren(...sites.map((site) => {
    const isActive = unblocks[site] > now;
    return el('li', { className: 'item' },
      el('span', { className: 'site', textContent: site }),
      ...(isActive ? [el('span', { className: 'muted small-text', textContent: 'unblocked' })] : model.unblockMinutes.map((m) => el('button', {
        type: 'button',
        className: 'small',
        textContent: `${m}m`,
        title: `Unblock for ${m} minutes`,
        ariaLabel: `Unblock ${site} for ${m} minutes`,
        onclick: () => act({ type: 'unblock', site, minutes: m }),
      }))),
      el('button', {
        type: 'button',
        className: 'small danger',
        textContent: 'Remove',
        ariaLabel: `Remove ${site} from the block list`,
        onclick: () => act({ type: 'removeSite', site }),
      }),
    );
  }));
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const res = await act({ type: 'addSite', input: input.value });
  if (res?.ok) input.value = '';
  input.focus();
});

// Keep countdowns live while the popup is open; re-sync occasionally for expiries.
setInterval(render, 1000);
setInterval(refresh, 5000);
refresh();
input.focus();
