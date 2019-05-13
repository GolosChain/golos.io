import { allowedTags } from './bodyProcessing/sanitizeConfig';

export function checkPostHtml(rtags) {
  for (const tag of allowedTags) {
    rtags.htmltags.delete(tag);
  }

  if (rtags.htmltags.length) {
    return {
      text: `Please remove the following HTML elements from your post: ${Array(...rtags.htmltags)
        .map(tag => `<${tag}>`)
        .join(', ')}`,
    };
  }
}
