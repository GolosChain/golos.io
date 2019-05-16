export default class GateError extends Error {
  constructor(originalError, methodName) {
    const message = (originalError && originalError.message) || 'Internal Server Error';

    super(`GateError ${methodName}: ${message}`);

    this.originalMessage = message;

    // Возвращаем флаг enumerable обратно в true, чтобы JSON.stringify не отбрассывал это поле
    Object.defineProperty(this, 'message', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: this.message,
    });

    this.code = (originalError && originalError.code) || -32601;
    this.method = methodName;

    for (const key of Object.keys(originalError)) {
      if (!['message', 'code', 'stack'].includes(key) && !key.startsWith('_')) {
        this[key] = originalError[key];
      }
    }
  }
}
