import { imgHostingUrl } from 'constants/config';

export function proxyImage(url, size) {
  if (!url || url.startsWith('data:image/') || !imgHostingUrl) {
    return url || null;
  }

  const sizePart = size ? `/${size}` : '';
  let urlParts;

  try {
    urlParts = new URL(url);
  } catch (err) {
    console.warn('Invalid URL:', url);
    return null;
  }

  if (urlParts.origin === imgHostingUrl) {
    const match = urlParts.pathname.match(/^\/images\/(?:\d+x\d+\/)?([A-Za-z0-9]+\.[A-Za-z]+)$/);

    if (match) {
      return `${imgHostingUrl}/images${sizePart}/${match[1]}`;
    }

    const proxyMatch = urlParts.pathname.match(/^\/proxy\/(?:\d+x\d+\/)?(.*)$/);

    if (proxyMatch) {
      return proxyImage(decodeURIComponent(proxyMatch[1]), size);
    }
  }

  return `${imgHostingUrl}/proxy${sizePart}/${url}`;
}
