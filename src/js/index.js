// /src/js.app.js
var m = require('mithril');
var Application = require('./components/application');


var initState = window.__initState || {};
var defaultPersistents = window.__defaultPersistents || {};
eSlovoApp = window.eSlovoApp || new Application(initState, defaultPersistents);
