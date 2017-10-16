const m = require('mithril');
const translateJs = require('translate.js');


const MESSAGES_NAME = 'MESSAGES';

class Translator {
  constructor (stateManager) {
    this.__stateManager = stateManager;

    this.initTranslateFunction = function () {
        this.__translate = translateJs(this.messages, this.options);
    };

    this.init();

    this.unsubscribe = stateManager.addListener(
        MESSAGES_NAME,
        this.setMessages
    );
  }

  init () {
    if (undefined === this.__stateManager.get(MESSAGES_NAME)) {
      this.__stateManager.set(MESSAGES_NAME, {}); //empty message set
    }

    this.currentMessagesSource = MESSAGES_NAME;

    this.options = {
      debug: false,
      namespaceSplitter: '.'
    };

    this.messages = this.__stateManager.get(MESSAGES_NAME);
  }

  static get MESSAGES_NAME () {
    return MESSAGES_NAME;
  }

  listenTo(newTarget) {
    if (this.unsubscribe && typeof this.unsubscribe === 'function') {
      this.unsubscribe();
    }

    this.currentMessagesSource = newTarget;
    this.unsubscribe = this.__stateManager.addListener(
          newTarget,
          this.setMessages
    );
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