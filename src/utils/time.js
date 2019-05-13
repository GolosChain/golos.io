export function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function fixDate(ts) {
  if (ts && ts.length === 19 && ts[10] === 'T') {
    return `${ts}Z`;
  }
  return ts;
}
