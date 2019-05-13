import Remarkable from 'remarkable';

import { getTags } from 'utils/bodyProcessing/htmlReady';

const remarkable = new Remarkable({ html: true, linkify: false });

export function tryExtractImage(data) {
  const meta = data.json_metadata;

  // First, attempt to find an image url in the json metadata
  if (meta) {
    if (meta.image && Array.isArray(meta.image)) {
      data.image = meta.image[0] || null;
      return;
    }
  }

  const isHtml = /^<html>([\S\s]*)<\/html>$/.test(data.raw);

  let htmlText;

  if (isHtml) {
    htmlText = data.raw;
  } else {
    htmlText = remarkable.render(data.raw.replace(/<!--[\s\S]*?(?:-->|$)/g, ''));
  }

  const bodyInfo = getTags(htmlText);

  data.image = Array.from(bodyInfo.images)[0];
}
