const request = require('./request');
const config = require('../config/config');

module.exports = {
  getMessages(locale) {
    return request.post(
        config.messagesFetchUrl,
        {
          locale: locale
        }
    );
  }
};
