// /src/js/components/storage.js


var StateDomain = {
    state: {},
    listeners: [],
    isValidPath: function (pathString) {
        var pathRegexp = /^([a-zA-Z0-9_]+?.)*?[a-zA-Z0-9_]+?$/;
        return pathRegexp.test(pathString);
    },
    toPath: function (pathString) {
        if (!StateDomain.isValidPath(pathString)) {
            throw new Error("Wrong path( '" + pathString + "' ) was given to StateManager!");
        }

        if (pathString.indexOf('.') >= 0) {
            return pathString.split('.');
        }

        return [pathString];
    },
    isObject: function (value) {
        var type = typeof value;
        return value !== null && (type === 'object' || type === 'function');
    }
};

var StateManager = {
    init: function (initialState) {
        StateDomain.state = JSON.parse(JSON.stringify(initialState)) || {};
        StateDomain.listeners = [];
    },
    has: function (field) {
        if (StateDomain.state.hasOwnProperty(field)) {
            return true;
        }

        var path = StateDomain.toPath(field);
        var notFound = {};
        var result = notFound;

        if (StateDomain.state.hasOwnProperty(path[0])) {
            result = StateDomain.state[path[0]];
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

        if (StateDomain.isObject(result)) {
            return JSON.parse(JSON.stringify(StateDomain.state[field]));
        }

        return result;
    },
    get: function (field) {
        if (StateDomain.state.hasOwnProperty(field)) {
            if (StateDomain.isObject(StateDomain.state[field])) {
                return JSON.parse(JSON.stringify(StateDomain.state[field]));
            }

            return StateDomain.state[field];
        }

        var path = StateDomain.toPath(field);
        var notFound = {};
        var result = notFound;

        if (StateDomain.state.hasOwnProperty(path[0])) {
            result = StateDomain.state[path[0]];
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

        if (StateDomain.isObject(result)) {
            return JSON.parse(JSON.stringify(result));
        }

        return result;
    },
    set: function (field, value) {
        if (!StateDomain.isValidPath(field)) {
            throw new Error("Wrong path( '" + field + "' ) was given to StateManager!");
        }

        var internalValue  = StateDomain.isObject(value) ? JSON.parse(JSON.stringify(value)) : value;

        if (field.indexOf('.') >= 0) {
            var path = StateDomain.toPath(field);

            var target = null;
            var internal = false;

            if (StateDomain.state.hasOwnProperty(path[0])) {
                target = StateDomain.state[path[0]];
            } else {
                StateDomain.state[path[0]] = {};
                target = StateDomain.state[path[0]];
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
            StateDomain.state[field] = internalValue;
        }

        var cbValue = StateDomain.isObject(internalValue) ? JSON.parse(JSON.stringify(internalValue)) : internalValue;

        StateDomain.listeners
            .filter(function (data) { return data.field === field;})
            .forEach(function(data) { data.callback(cbValue) });
    },
    addListener: function (field, callback) {
        var obj = {
            field: field,
            callback: callback
        };

        if (typeof callback !== 'function') {
            throw new Error('callback should be a function');
        }

        StateDomain.listeners.push(obj);

        return function unSubscribe() {
            var index = StateDomain.listeners.indexOf(obj);

            if (index > -1) {
                StateDomain.listeners.splice(index, 1);
            }
        }
    }
};

module.exports = StateManager;