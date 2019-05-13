import sanitize from 'sanitize-html';
import memoize from 'lodash/memoize';

import { smartTrim } from 'helpers/text';
import remarkableStripper from './remarkableStripper';
import { decodeSafeHtmlSymbols } from './html';
import { tryExtractImage } from './extractImage';

const DESC_LENGTH = 600;
const DESC_LENGTH_WITH_IMAGE = 300;

export default memoize(function extractContent(_data) {
  const data = {
    ..._data,
    raw: _data.raw.trim(),
    image: null,
  };

  tryExtractImage(data);
  extractDescBody(data);

  return data;
});

// export function extractRepost(body) {
//   return extractDescBody({ body: body.trim() });
// }

function extractDescBody(data, isComment = false) {
  if (!data || !data.raw) {
    data.desc = '';
    return;
  }

  let desc;
  // Short description.
  // Remove bold and header, etc.
  // Stripping removes links with titles (so we got the links above)..
  // Remove block quotes if detected comment preview
  const body = remarkableStripper.render(
    isComment ? data.raw.replace(/>([\s\S]*?).*\s*/g, '') : data.raw
  );

  desc = sanitize(body, { allowedTags: [] }); // remove all html, leaving text
  desc = decodeSafeHtmlSymbols(desc);

  desc = desc.replace(/\s{2,}/g, ' ');

  // Strip any raw URLs from preview text
  desc = desc.replace(/https?:\/\/[^\s]+/g, '');
  desc = desc.trim();

  const limit = data.image ? DESC_LENGTH_WITH_IMAGE : DESC_LENGTH;

  data.desc = smartTrim(desc, limit, !isComment);
}
