export const MINNOW = 10000000;
export const CRUCIAN = 100000000;
export const DOLPHIN = 1000000000;
export const ORCA = 10000000000;

export const getUserStatus = gests => {
  if (gests < 0) {
    return null;
  }
  if (gests < MINNOW) {
    return 'minnow';
  }
  if (gests < CRUCIAN) {
    return 'crucian';
  }
  if (gests < DOLPHIN) {
    return 'dolphin';
  }
  if (gests < ORCA) {
    return 'orca';
  }
  return 'whale';
};
