interface EventListeners {
    [key: string]: <T>(key: T) => {};
}

export default class EventEmitter {
  private _eventListeners: any = {};

  private _eventOnceListener: EventListeners = {};

  constructor() {
    this.eventReset();
  }

  eventReset() {
    if (this._eventListeners) {
      Object.keys(this._eventListeners).forEach((key: string) => {
        delete this._eventListeners[key];
      });
    }
    this._eventListeners = {};
    if (this._eventOnceListener) {
      Object.keys(this._eventOnceListener).forEach((key) => {
        delete this._eventOnceListener[key];
      });
    }
    this._eventOnceListener = {};
  }

  on(funKey: string, callback: () => {}) {
    if (!funKey) {
      throw Error('event listener funkey undefined');
    }
    if (!(callback instanceof Function)) {
      throw Error('event listener next param should be function');
    }
    if (this._eventListeners[funKey]) {
      (this._eventListeners[funKey] as any).push(callback);
    } else {
      this._eventListeners[funKey] = [callback];
    }
  }

  off(funKey: string) {
    if (!funKey) {
      throw Error('event listener funkey undefined');
    }
    if (this._eventListeners[funKey]) {
      delete this._eventListeners[funKey];
    } else {
      throw Error('event listener unbind failed!');
    }
  }

  once(funKey: string, callback: () => {}) {
    if (!funKey) {
      throw Error('event once listener funkey undefined');
    }
    if (!(callback instanceof Function)) {
      throw Error('event once listener next param should be function');
    }
    this._eventOnceListener[funKey] = callback;
  }

  emit<T>(funKey: string, params: T) {
    if (
      this._eventOnceListener && this._eventOnceListener[funKey] instanceof Function
    ) {
      this._eventOnceListener[funKey](params);
      delete this._eventOnceListener[funKey];
    }
    if (
      this._eventListeners && this._eventListeners[funKey] && this._eventListeners[funKey].length > 0
    ) {
      (this._eventListeners[funKey] as any).forEach(callback => {
        callback(params);
      });
    }
  }
}
