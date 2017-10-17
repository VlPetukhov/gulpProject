const StateManager = require('./state-manager'); //simple state manager
const Locale = require('./locale');
const Translator = require('./translator');
const Resources = require('./resources');

class Application {
  constructor(initState) {
    this.components = {};
    this.init(initState);
    this.envDev = process.env.NODE_ENV !== 'production';
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

    //binding locale setting to fetching new translations
    this.components.locale.addListener(
        (locale) => {
          let target = this.components.translator.currentMessagesSource;

          Resources.getMessages(locale)
          .then((response) => {
            this.components.stateManager.set(target, response);
          })
          .catch((err) => {
            if (this.envDev) {
              console.log('Message fetchong error', err);
            }
          });

        },
    );

    //test @ToDo remove
    this.components.locale.setLocale('ru_RU');
  }

}

module.exports = Application;