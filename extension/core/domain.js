// Site normalization and host matching. Pure functions; no browser APIs.

const LABEL = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;

function fail(error) {
  return { ok: false, error };
}

/**
 * Turn user input ("https://www.Example.com/path", "example.com") into a bare
 * registrable host such as "example.com". Subdomains other than a leading
 * "www." are kept so users can block e.g. "m.example.com" specifically.
 */
export function normalizeSite(input) {
  if (typeof input !== 'string') return fail('Enter a website such as example.com.');
  const text = input.trim();
  if (!text) return fail('Enter a website such as example.com.');
  if (text.length > 2048) return fail('That address is too long.');
  if (/\s/.test(text)) return fail('A website address cannot contain spaces.');

  let candidate = text;
  const scheme = /^([a-z][a-z0-9+.-]*):\/\//i.exec(text);
  if (scheme) {
    if (!/^https?$/i.test(scheme[1])) return fail('Only http and https websites can be blocked.');
  } else {
    candidate = `http://${text}`;
  }

  let url;
  try {
    url = new URL(candidate);
  } catch {
    return fail('That does not look like a website address.');
  }
  if (url.username || url.password) return fail('That does not look like a website address.');

  let host = url.hostname.toLowerCase().replace(/\.$/, '');
  if (host.startsWith('www.')) host = host.slice(4);
  if (host.length === 0 || host.length > 253) return fail('That does not look like a website address.');

  const labels = host.split('.');
  if (labels.length < 2 || !labels.every((l) => LABEL.test(l))) {
    return fail('That does not look like a website address.');
  }
  return { ok: true, site: host };
}

/** True when `host` is `site` or one of its subdomains. */
export function hostMatchesSite(host, site) {
  if (typeof host !== 'string' || typeof site !== 'string') return false;
  const h = host.toLowerCase().replace(/\.$/, '');
  return h === site || h.endsWith(`.${site}`);
}
