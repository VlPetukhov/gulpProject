var m = require('mithril');

var messages = {};
var options = {
  debug: false,
  namespaceSplitter: '.'
};

var translate = function (key, args) {
  const t = translatejs(messages, options);
  return args ? m.trust(t(key, args)) : t(key);
};

translate.setOptions = function(data) {
  if (!data || typeof data !== 'object') {
    return;
  }

  if (options.debug) {
    options.debug = !!data.debug;
  }

  if (options.namespaceSplitter &&
      typeof options.namespaceSplitter === 'string'
  ) {
    options.namespaceSplitter = data.namespaceSplitter;
  }
};

translate.initMessages = function(data) {
  if (data) {
    messages = data;
  }
};

translate.getTranslations = function (){
  return messages;
};

module.exports = translate;