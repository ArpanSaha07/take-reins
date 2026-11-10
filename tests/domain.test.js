// SB-01, SB-02: site normalization and matching
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeSite, hostMatchesSite } from '../extension/core/domain.js';

test('SB-01 normalizes URLs, case, port, path and leading www', () => {
  assert.deepEqual(normalizeSite('https://WWW.Example.com:8080/path?q=1#x'), { ok: true, site: 'example.com' });
  assert.deepEqual(normalizeSite('  youtube.com  '), { ok: true, site: 'youtube.com' });
  assert.deepEqual(normalizeSite('m.youtube.com/watch'), { ok: true, site: 'm.youtube.com' });
  assert.deepEqual(normalizeSite('example.com.'), { ok: true, site: 'example.com' });
});

test('SB-01 converts internationalized names to punycode', () => {
  assert.deepEqual(normalizeSite('bücher.de'), { ok: true, site: 'xn--bcher-kva.de' });
});

test('SB-01 rejects invalid input', () => {
  const bad = ['', '   ', 'localhost', 'not a site', 'ftp://example.com', 'exa_mple.com',
    'javascript:alert(1)', '.com', 'www.', null, 42, 'a'.repeat(300) + '.com', 'user@example.com'];
  for (const input of bad) {
    const r = normalizeSite(input);
    assert.equal(r.ok, false, `expected rejection for ${String(input)}`);
    assert.equal(typeof r.error, 'string');
  }
});

test('SB-02 matches the site and its subdomains only', () => {
  assert.equal(hostMatchesSite('example.com', 'example.com'), true);
  assert.equal(hostMatchesSite('a.b.example.com', 'example.com'), true);
  assert.equal(hostMatchesSite('EXAMPLE.COM', 'example.com'), true);
  assert.equal(hostMatchesSite('notexample.com', 'example.com'), false);
  assert.equal(hostMatchesSite('example.com.evil.net', 'example.com'), false);
});
