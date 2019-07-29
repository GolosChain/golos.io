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
