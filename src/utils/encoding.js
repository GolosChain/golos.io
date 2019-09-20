export function uint8ArrayToHex(array) {
  const result = [];

  for (const num of array) {
    let str = num.toString(16);

    if (num < 16) {
      str = `0${str}`;
    }

    result.push(str);
  }

  return result.join('');
}

export function hexToUint8Array(hex) {
  const bytesLength = hex.length / 2;
  const bytes = [];

  for (let byteIndex = 0; byteIndex < bytesLength; byteIndex++) {
    bytes[byteIndex] = parseInt(hex.substr(byteIndex * 2, 2), 16);
  }

  return bytes;
}
