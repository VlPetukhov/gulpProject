var StateManager = require('./state-manager'); //simple state manager
// var Translator = require('./translations'); //translation function


function Application (initState) {
    this.components = {};
    this.init(initState);
    console.log('construct');
}
Application.prototype = Object.create({});
Application.prototype.constructor = Application;

Application.prototype.init = function (initState, defaultPersistents) {
    //components
    var stateManager =  new StateManager();
    stateManager.initState(initState);
    stateManager.initDefaultPersistents(defaultPersistents);
    this.components.stateManager = stateManager;


    //translations
    // this.components.t = Object.create(
    //     Translator,
    //     {
    //         stateManager: this.components.stateManager
    //     }
    // ).translate;
};

module.exports = Application;