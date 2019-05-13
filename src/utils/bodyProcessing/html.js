const htmlCharMap = {
  amp: '&',
  quot: '"',
  lsquo: '‘',
  rsquo: '’',
  sbquo: '‚',
  ldquo: '“',
  rdquo: '”',
  bdquo: '„',
  hearts: '♥',
  trade: '™',
  hellip: '…',
  pound: '£',
  copy: '',
};

export function decodeSafeHtmlSymbols(html) {
  return html.replace(/&([a-z]+);/g, (match, entryName) => htmlCharMap[entryName] || match);
}
