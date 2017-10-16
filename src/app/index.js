// /src/js.app.js
const m = require('mithril');
const Application = require('./components/application');


const initState = window.__initState || {};
const defaultPersistents = window.__defaultPersistents || {};
window.eSlovoApp = window.eSlovoApp || new Application(initState, defaultPersistents);
