export function softTrim(text, limit) {
  if (text.length <= limit) {
    return text;
  }

  const lastChar = text[limit];
  let short = text.toString().substr(0, limit);

  if (/^[^\s.,;:]$/i.test(lastChar)) {
    short = short.replace(/[\s.,;:]+[^\s.,;:]*$/, '');
  } else {
    short = short.replace(/[\s.,;:]+$/, '');
  }

  return `${short}...`;
}
