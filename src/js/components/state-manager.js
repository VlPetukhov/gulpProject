var store = require('store');
var _ = require('lodash');

function StorageManager (persistentStorage) {
    this.persistentStore = persistentStorage || store;
    tihs.persistenListeners = [];
    this.state = {};
    this.listeners = [];
}

StorageManager.prototype = Object.create({});
StorageManager.prototype.constructor = StorageManager;

StorageManager.initState = function (initialState) {
    this.state = JSON.parse(JSON.stringify(initialState)) || {};
    this.listeners = [];
};