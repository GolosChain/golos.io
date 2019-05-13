import { APP_DOMAIN } from 'constants/config';

const urlChar = '[^\\s"<>\\]\\[\\(\\)]';
const urlCharEnd = urlChar.replace(/\]$/, ".,']"); // insert bad chars to end on
const imagePath = '(?:(?:\\.(?:tiff?|jpe?g|gif|png|svg|ico)|ipfs/[a-z\\d]{40,}))';
const domainPath = '(?:[-a-zA-Z0-9\\._]*[-a-zA-Z0-9])';
const urlChars = `(?:${urlChar}*${urlCharEnd})?`;

const urlSet = ({ domain = domainPath, path } = {}) =>
  // urlChars is everything but html or markdown stop chars
  `https?:\/\/${domain}(?::\\d{2,5})?(?:[/\\?#]${urlChars}${path || ''})${path ? '' : '?'}`;
/**
    Unless your using a 'g' (glob) flag you can store and re-use your regular expression.  Use the cache below.  If your using a glob (for example: replace all), the regex object becomes stateful and continues where it left off when called with the same string so naturally the regexp object can't be cached for long.
*/
export const any = (flags = 'i') => new RegExp(urlSet(), flags);

export const local = (flags = 'i') =>
  new RegExp(urlSet({ domain: `(?:localhost|(?:.*\\.)?${APP_DOMAIN})` }), flags);

export const remote = (flags = 'i') =>
  new RegExp(urlSet({ domain: `(?!localhost|(?:.*\\.)?'${APP_DOMAIN}')${domainPath}` }), flags);

export const youTube = (flags = 'i') =>
  new RegExp(urlSet({ domain: '(?:(?:.*.)?youtube.com|youtu.be)' }), flags);

export const image = (flags = 'i') => new RegExp(urlSet({ path: imagePath }), flags);

export const imageFile = (flags = 'i') => new RegExp(imagePath, flags);

export default {
  any: any(),
  local: local(),
  remote: remote(),
  image: image(),
  imageFile: imageFile(),
  youTube: youTube(),
  youTubeId: /(?:(?:youtube.com\/watch\?v=)|(?:youtu.be\/)|(?:youtube.com\/embed\/))([A-Za-z0-9_-]+)/i,
  vimeoId: /(?:vimeo.com\/|player.vimeo.com\/video\/)([0-9]+)/,
  coubId: /(?:(?:https?:)?\/\/)?coub\.com\/view\/([A-Za-z0-9]+)/,
  rutubeId: /(?:(?:https?:)?\/\/)?rutube\.ru\/video\/([A-Za-z0-9]+)\/?/,
  okVideoId: /(?:(?:https?:)?\/\/)?ok\.ru\/(?:live|video)\/([A-Za-z0-9]+)/,
  ipfsPrefix: /(https?:\/\/.*)?\/ipfs/i,
  embedContent: /^https?:\/\/([\w_-]+(?:(?:\.[\w_-]+)+))(?:[\w.,@?^=%:/~+#-]*[\w@?^=%/~+#-])?/i,
};
