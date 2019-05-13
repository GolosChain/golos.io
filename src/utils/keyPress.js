import KEY_CODES from './keyCodes';

// eslint-disable-next-line consistent-return
function getCodeByKey(key) {
  switch (key) {
    case 'Enter':
      return KEY_CODES.ENTER;
    case 'Escape':
      return KEY_CODES.ESC;
    case 'Backspace':
      return KEY_CODES.BACKSPACE;
    default:
  }
}

// eslint-disable-next-line import/prefer-default-export
export function checkPressedKey({ which, keyCode, key }) {
  return which || keyCode || getCodeByKey(key);
}
