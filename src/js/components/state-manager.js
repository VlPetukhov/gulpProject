var store = require('store');

function StateManager (persistentStorage) {
    this.persistentStore = persistentStorage || store;
    this.persistenListeners = [];
    this.state = {};
    this.listeners = [];
    this.persistListeners = [];
}
StateManager.prototype = Object.create({});
StateManager.prototype.constructor = StateManager;

StateManager.prototype.initState = function (initialState) {
    this.state = JSON.parse(JSON.stringify(initialState)) || {};
    this.listeners = [];
};
StateManager.prototype.clearPersist = function () {
    this.persistentStore.clearAll();
    this.persistenListeners = [];
};
StateManager.prototype.setPersistNamespace = function (namespace) {
    this.persistentStore = this.persistentStore.namespace(namespace);
};
StateManager.prototype.persistHasNamespace = function (namespace) {
    return this.persistentStore.hasNamespace(namespace);
};
StateManager.prototype.isObject = function (value) {
    var type = typeof value;
    return value !== null && (type === 'object' || type === 'function');
};
StateManager.prototype.isValidPath = function (pathString) {
    var pathRegexp = /^([a-zA-Z0-9_]+?.)*?[a-zA-Z0-9_]+?$/;
    return pathRegexp.test(pathString);
};
StateManager.prototype.toPath = function (pathString) {
    if (!this.isValidPath(pathString)) {
        throw new Error("Wrong path( '" + pathString + "' ) was given to StateManager!");
    }

    if (pathString.indexOf('.') >= 0) {
        return pathString.split('.');
    }

    return [pathString];
};
StateManager.prototype.has = function (field) {
    if (this.state.hasOwnProperty(field)) {
        return true;
    }

    var path = this.toPath(field);
    var result;

    if (this.state.hasOwnProperty(path[0])) {
        result = this.state[path[0]];
        path = path.shift();
        path.map(
            function (pathElement) {
                if (result.hasOwnProperty(pathElement)) {
                    result = result[pathElement];
                } else {
                    result = undefined;
                    return false;
                }
            }
        );
    }

    return undefined !== result;
};
StateManager.prototype.hasPersist = function (field) {
    var result;
    if (field.indexOf('.') === -1) {

        result = this.persistentStore.get(field);
    } else {
        var path = this.toPath(field);

        if (result = this.persistentStore.get(path[0])) {
            path = path.shift();
            path.map(
                function (pathElement) {
                    if (result.hasOwnProperty(pathElement)) {
                        result = result[pathElement];
                    } else {
                        result = undefined;
                        return false;
                    }
                }
            );
        }
    }

    return undefined !== result;
};
StateManager.prototype.get =  function (field) {
    var result;
    if (this.state.hasOwnProperty(field)) {
        result = this.state[field];
    } else {
        var path = this.toPath(field);

        if (this.state.hasOwnProperty(path[0])) {
            result = this.state[path[0]];
            path.shift();
            var last = path.pop();
            path.map(
                function (pathElement) {
                    if (result.hasOwnProperty(pathElement)) {
                        result = result[pathElement];
                    } else {
                        result = undefined;
                        return false;
                    }
                }
            );

            if (this.isObject(result) && result.hasOwnProperty(last)) {
                result = result[last];
            }
        }
    }

    if (this.isObject(result)) {
        return JSON.parse(JSON.stringify(result));
    }

    return result;
};
StateManager.prototype.getPersist =  function (field) {
    var result;
    if (field.indexOf('.') === -1) {
        result = this.persistentStore.get(field);
    } else {
        var path = this.toPath(field);
        var last = path.pop();

        if (undefined !== this.persistentStore.get(path[0])) {
            result = this.persistentStore.get(path[0]);
            path.shift();
            path.map(
                function (pathElement) {
                    if (result.hasOwnProperty(pathElement)) {
                        result = result[pathElement];
                    } else {
                        result = undefined;
                        return false;
                    }
                }
            );
        }

        if (this.isObject(result)) {
            result = result[last];
        }
    }

    if (this.isObject(result)) {
        return JSON.parse(JSON.stringify(result));
    }

    return result;
};
StateManager.prototype.set = function (field, value) {
    if (!this.isValidPath(field)) {
        throw new Error("Wrong path( '" + field + "' ) was given to StateManager!");
    }

    var internalValue  = this.isObject(value) ? JSON.parse(JSON.stringify(value)) : value;

    if (field.indexOf('.') >= 0) {
        var path = this.toPath(field);

        var target = null;
        var internal = false;

        if (this.state.hasOwnProperty(path[0])) {
            target = this.state[path[0]];
        } else {
            this.state[path[0]] = {};
            target = this.state[path[0]];
            internal = true;
        }

        path.shift();
        var last = path.pop();
        path.map(
            function (pathElement) {
                if ( !target.hasOwnProperty(pathElement) || internal) {
                    target[pathElement] = {};
                }

                target = target[pathElement];
            }
        );

        target[last] = internalValue;
    } else {
        this.state[field] = internalValue;
    }

    var cbValue = this.isObject(internalValue) ? JSON.parse(JSON.stringify(internalValue)) : internalValue;

    this.listeners
        .filter(function (data) { return data.field === field;})
        .forEach(function(data) { data.callback(cbValue) });
};
StateManager.prototype.setPersist = function (field, value) {
    if (!this.isValidPath(field)) {
        throw new Error("Wrong path( '" + field + "' ) was given to StateManager!");
    }

    var internalValue  = this.isObject(value) ? JSON.parse(JSON.stringify(value)) : value;

    if (field.indexOf('.') >= 0) {
        var path = this.toPath(field);

        var target = this.persistentStore.get(path[0]);
        var targetIndex = path.shift();
        var last = path.pop();

        if (undefined === target) {
            target = {};
        }
        var cursor = target;

        path.map(
            function (pathElement) {
                if ( !cursor.hasOwnProperty(pathElement)) {
                    cursor[pathElement] = {};
                }

                cursor = cursor[pathElement];
            }
        );

        cursor[last] = internalValue;
        //rewrite target element
        this.persistentStore.set(targetIndex, target);
    } else {
        this.persistentStore.set(field, internalValue);
    }

    var cbValue = this.isObject(internalValue) ? JSON.parse(JSON.stringify(internalValue)) : internalValue;

    this.persistListeners
        .filter(function (data) { return data.field === field;})
        .forEach(function(data) { data.callback(cbValue) });
};
StateManager.prototype.addListener = function (field, callback) {
    var obj = {
        field: field,
        callback: callback
    };

    if (typeof callback !== 'function') {
        throw new Error('callback should be a function');
    }

    this.listeners.push(obj);

    return function unSubscribe() {
        var index = this.listeners.indexOf(obj);

        if (index > -1) {
            this.listeners.splice(index, 1);
        }
    }.bind(this)
};
StateManager.prototype.addPersistListener = function (field, callback) {
    var obj = {
        field: field,
        callback: callback
    };

    if (typeof callback !== 'function') {
        throw new Error('callback should be a function');
    }

    this.persistListeners.push(obj);

    return function unSubscribePersist() {
        var index = this.persistListeners.indexOf(obj);

        if (index > -1) {
            this.persistListeners.splice(index, 1);
        }
    }.bind(this)
};

module.exports = StateManager;