export function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function fixDate(ts) {
  if (ts && ts.length === 19 && ts[10] === 'T') {
    return `${ts}Z`;
  }
  return ts;
}

export function secondsToDays(seconds) {
  return (seconds / 60 / 60 / 24).toFixed(1).replace(/\.0$/, '');
}
