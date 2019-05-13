export const MINNOW = 1000000;
export const CRUCIAN = 10000000;
export const DOLPHIN = 100000000;
export const ORCA = 1000000000;

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
  return 'minnow';
};
