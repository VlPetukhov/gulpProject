var m = require('mithril');
var translateJs = require('translate-js');

TranslateDomain = {
    settings: {
        debug: true,
        array: false,
        resolveAliases: false
    },
    defaultLang: "en"
};
TranslateDomain.init = function (initData) {
    if (!initData.isArray()) {
        throw Error("Translate: wrong initialization array was given!");
    }

    translateJs.clear();

    initData.map(
        function (dataSet) {
            if (dataSet.isArray()) {
                translateJs.add(dataSet);
            } else if (TranslateDomain.isNameSpacedLangTranslation(dataSet)) {
                translateJs.add(dataSet.data, dataSet.locale, dataSet.namespace);
            } else if (TranslateDomain.isLangTranslation(dataSet)) {
                translateJs.add(dataSet.data, dataSet.locale);
            } else if (TranslateDomain.isTranslation(dataSet)) {
                translateJs.add(dataSet.data);
            } else {
                throw Error('Wrong translation setting!');
            }
        }
    );
};
TranslateDomain.isNameSpacedLangTranslation = function (data) {
    return TranslateDomain.isLangTranslation(data) && undefined !== data.namespace;
};
TranslateDomain.isLangTranslation = function (data) {
    return TranslateDomain.isTranslation(data) && undefined !== data.locale;
};
TranslateDomain.isTranslation = function (data) {
    return typeof data === 'object' && undefined !== data.data;
};

translateJs.init = TranslateDomain.init;

module.exports = translateJs;