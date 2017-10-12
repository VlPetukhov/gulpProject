// /src/js.app.js
var m = require('mithril');
var store = require('store'); //local storage
var stateManager = require('./components/storage'); //simple state manager
var t = require('./components/translations'); //translation function

App = window.App || {};

App.init = function () {
    var initState = window.__initState || {};

    App.components = {
        sotore: store,
        stateManager: Object.create(stateManager)
    };
    App.components.stateManager.init(initState);
    App.components.t = t;

};

App.init();
