const StateManager = require('./state-manager'); //simple state manager
const Locale = require('./locale');
const Translator = require('./translator');

// const Translator = require('./translations'); //translation function


function Application (initState) {
    this.components = {};
    this.init(initState);
    console.log('construct');
}
Application.prototype = Object.create({});
Application.prototype.constructor = Application;

Application.prototype.init = function (initState, defaultPersistents) {
    //components
    let stateManager =  new StateManager();
    stateManager.initState(initState);
    stateManager.initDefaultPersistents(defaultPersistents);
    stateManager.setPersist(
        Locale.LOCALE_NAME,
        Locale.DEFAULT_LOCALE
    );
    this.components.stateManager = stateManager;

    //locale
    this.components.locale = Object.create(Locale);

    //translations
    let translator = new Translator(this.components.stateManager);
    translator.setFetchUrl('#');
    this.components.translator = translator;
};

module.exports = Application;