/* eslint-disable import/prefer-default-export */

export function defaults(data, defaultData) {
  const result = { ...data };

  for (const fieldName of Object.keys(defaultData)) {
    if (result[fieldName] === undefined) {
      result[fieldName] = defaultData[fieldName];
    }
  }

  return result;
}

export function fieldsToString(data) {
  const result = {};

  for (const fieldName of Object.keys(data)) {
    const value = data[fieldName];

    if (value === undefined || value === null) {
      result[fieldName] = '';
      continue;
    }

    if (typeof value === 'number') {
      result[fieldName] = value.toString();
      continue;
    }

    if (value instanceof Date) {
      result[fieldName] = value.toJSON();
      continue;
    }

    result[fieldName] = value;
  }

  return result;
}

export function isInteger(str) {
  return /^-?\d+$/.test(str);
}

export function isPositiveInteger(str) {
  return /^\d+$/.test(str);
}

export function parsePercent(percent) {
  return (percent / 100).toFixed(2);
}

export function parsePercentString(str) {
  if (!/^\d{1,3}(?:\.\d{1,2})?$/.test(str)) {
    return NaN;
  }

  const value = Math.floor(parseFloat(str) * 100);

  if (value > 10000) {
    return NaN;
  }

  return value;
}
