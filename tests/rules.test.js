// SB-02: declarativeNetRequest rule building
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildRules, RULE_ID, blockedPageUrl } from '../extension/core/rules.js';

test('SB-02 no rules when nothing is blocked', () => {
  assert.deepEqual(buildRules([], 'abc'), []);
});

test('SB-02 one main_frame redirect rule covering all blocked domains', () => {
  const [rule, ...rest] = buildRules(['a.com', 'b.org'], 'extid');
  assert.equal(rest.length, 0);
  assert.equal(rule.id, RULE_ID);
  assert.deepEqual(rule.condition.requestDomains, ['a.com', 'b.org']);
  assert.deepEqual(rule.condition.resourceTypes, ['main_frame']);
  assert.equal(rule.condition.regexFilter, '^(https?://.*)$');
  assert.equal(rule.action.type, 'redirect');
  assert.equal(rule.action.redirect.regexSubstitution, 'chrome-extension://extid/blocked.html#\\1');
});

test('SB-06 blockedPageUrl carries the original URL in the fragment', () => {
  assert.equal(blockedPageUrl('extid', 'https://a.com/x?y=1'), 'chrome-extension://extid/blocked.html#https://a.com/x?y=1');
});
