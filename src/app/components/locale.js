const LOCALE_NAME = 'LOCALE';
const DEFAULT_LOCALE = 'en_US';
const AVAILABLE_LOCALES = [
  'en_US',
  'ru_RU',
  'ua_UA',
];

class Locale {
  constructor(stateManager) {
    this.__stateManager = stateManager;
    this.init();
  }

  init() {
    if (undefined === this.__stateManager.getPersist(LOCALE_NAME)) {
      this.__stateManager.setPersist(LOCALE_NAME, DEFAULT_LOCALE);
    }

    this.listeners = [];
  }

  static get LOCALE_NAME() {
    return LOCALE_NAME;
  }

  static get DEFAULT_LOCALE() {
    return DEFAULT_LOCALE;
  }

  static get AVAILABLE_LOCALES() {
    return AVAILABLE_LOCALES;
  }

  addListener(callback, options) {
    let obj = {
      callback: callback,
      options: options,
    };

    if (typeof callback === 'function') {
      this.listeners.push(obj);
    }

    return function unSubscribePersist() {
      let index = this.listeners.indexOf(obj);

      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    }.bind(this);
  }

  setLocale(newLocale) {
    if (AVAILABLE_LOCALES.indexOf(newLocale) === -1) {
      return;
    }

    this.__stateManager.setPersist(LOCALE_NAME, newLocale);

    for (let index in this.listeners) {
      if (this.listeners.hasOwnProperty(index)) {
        let obj = this.listeners[index];
        obj.callback(newLocale, obj.options);
      }
    }
  }
}

module.exports = Locale;