var StateManager = require('./components/storage'); //simple state manager
var Translator = require('./components/translations'); //translation function


Application = function (initState) {
    this.init(initState);
    this.components = {};
};
Application.prototype = Object.create({});
Application.prototype.constructor = Application;

Application.prototype.init = function (initState, defaultPersistents) {
    //components
    var stateManager =  Object.create(StateManager);
    stateManager.initState(initState);
    stateManager.initDefaultPersistents(defaultPersistents);
    this.components.stateManager = stateManager;


    //translations
    this.components.t = Object.create(
        Translator,
        {
            stateManager: this.components.stateManager
        }
    ).translate;
};