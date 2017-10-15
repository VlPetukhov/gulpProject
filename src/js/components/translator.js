const m = require('mithril');
const translateJs = require('translate.js');
const Locale = require('./locale');

class Translator {
  constructor (stateManager) {
    if (!stateManager.getPersist(Locale.LOCALE_NAME)) {
      stateManager.setPersist(Locale.LOCALE_NAME, Locale.DEFAULT_LOCALE);
    }

    this.initTranslateFunction = function () {
        this.__translate = translateJs(this.messages, this.options);
    };

    this.fetchUrl = null;
    this.unsubscribe = stateManager.addPersistListener(Locale.LOCALE_NAME, this.fetchMessages);

    this.options = {
        debug: false,
        namespaceSplitter: '.'
    };
    this.messages = {};

    this.fetchMessages();
  }

  fetchMessages() {
    console.log('Fetching messages...');
    if (null === this.fetchUrl) {
      console.log('...no URL');
      return;
    }
    console.log('... Ok');
  }

  setFetchUrl(url) {
    this.fetchUrl = url;
    this.fetchMessages();
  }

  setOptions (options) {
    if (!options || typeof options !== 'object') {
        return;
    }

    if (options.debug) {
        this.options.debug = options.debug;
    }

    if (options.namespaceSplitter &&
        typeof options.namespaceSplitter === 'string'
    ) {
        this.options.namespaceSplitter = options.namespaceSplitter;
    }

    this.initTranslateFunction();
  }

  setMessages(messages) {
    this.messages = messages;
    this.initTranslateFunction();
  }

  translate (key, args) {
    return args ?
      m.trust(this.__translate(key, args)) :
      this.__translate(key);
  }
}

module.exports = Translator;