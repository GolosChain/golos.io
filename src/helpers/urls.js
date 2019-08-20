import { LEAVE_PAGE_WHITELIST_DOMAINS } from 'constants/config';

function checkIsWhitelistUrl(url) {
  try {
    const { hostname } = new URL(url);

    return LEAVE_PAGE_WHITELIST_DOMAINS.some(
      domain => domain === hostname || hostname.endsWith(`.${domain}`)
    );
  } catch (err) {
    return false;
  }
}

export function sanitizeUrl(url) {
  if (url.startsWith('#')) {
    return url;
  }

  // If this link is not hash, relative, http or https, or tag - add https
  if (!/^#|^\/(?!\/)|^(?:https?:)?\/\/|^\[?.*\]$/.test(url)) {
    url = `https://${url}`;
  }
  if (checkIsWhitelistUrl(url) || url.startsWith('/leave_page?')) {
    return url;
  }

  return `/leave?target=${encodeURIComponent(url)}`;
}

export function makeSocialLink(urlOrName, prefix) {
  let accountName;

  if (/^(https?:)?\/\//.test(urlOrName)) {
    try {
      const pathname = new URL(urlOrName).pathname.substr(1);

      accountName = pathname.match(/^[^/]+/)[0];
    } catch (err) {
      return urlOrName;
    }
  } else {
    accountName = urlOrName;
  }

  return prefix + accountName;
}
