const StateManager = require('./state-manager'); //simple state manager
const Locale = require('./locale');
const Translator = require('./translator');
const Resources = require('./resources');

// const Translator = require('./translations'); //translation function

class Application {
  constructor (initState) {
    console.log('construct');
    this.components = {};
    console.log('init...');
    this.init(initState);
    console.log('...done');
  }

  init(initState, defaultPersistents) {
    //components
    let stateManager = new StateManager();
    stateManager.initState(initState);
    stateManager.initDefaultPersistents(defaultPersistents);
    this.components.stateManager = stateManager;

    //locale
    this.components.locale = new Locale(this.components.stateManager);

    //translations
    this.components.translator = new Translator(this.components.stateManager);

    //binding
    console.log(this.components.locale);
    this.components.locale.addListener(
        (locale) => {
          let target = this.components.translator.currentMessagesSource;

          Resources.getMessages(locale).then((response) => {
            this.components.stateManager.set(target, response);
          });

        },
    );

    //test @ToDo remove
    this.components.locale.setLocale('ru_RU');
  }

}

module.exports = Application;