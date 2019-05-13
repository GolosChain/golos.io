import { useEffect } from 'react';
import isHotkey from 'is-hotkey';

export default function useKeyboardEvent(key, callback) {
  useEffect(() => {
    const handler = event => {
      if (typeof key === 'function' && key(event)) {
        callback();
      } else if (typeof key === 'string' && isHotkey(key)(event)) {
        callback();
      }
    };
    window.addEventListener('keydown', handler);
    return () => {
      window.removeEventListener('keydown', handler);
    };
  }, []);
}
