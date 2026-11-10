// declarativeNetRequest rule building. Pure functions.

export const RULE_ID = 1;

export function blockedPageBase(extensionId) {
  return `chrome-extension://${extensionId}/blocked.html`;
}

/** URL of the blocked page for a tab that was showing `originalUrl`. */
export function blockedPageUrl(extensionId, originalUrl) {
  return `${blockedPageBase(extensionId)}#${originalUrl}`;
}

/**
 * One rule redirects top-level navigations to any blocked domain (and its
 * subdomains, via requestDomains) to the blocked page, keeping the original
 * URL in the fragment so the page can offer to reopen it.
 */
export function buildRules(domains, extensionId) {
  if (domains.length === 0) return [];
  return [{
    id: RULE_ID,
    priority: 1,
    action: {
      type: 'redirect',
      redirect: { regexSubstitution: `${blockedPageBase(extensionId)}#\\1` },
    },
    condition: {
      regexFilter: '^(https?://.*)$',
      requestDomains: [...domains],
      resourceTypes: ['main_frame'],
    },
  }];
}
