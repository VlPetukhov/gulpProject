var _ = require('lodash');

describe('StateManager', function () {
    var StateManager = require('../../src/js/components/state-manager');
    var state = new StateManager();

    beforeEach(function () {
        state.initState({});
    });

    it('should be able to initialize storage with configuration object', function () {
        var init = {
            a: null,
            b: true,
            c: undefined,
            d: 1,
            e: 3.14,
            f: [1,2,3],
            g: {aa:1, bb:33},
            h: "string"
        };

        state.initState(init);

        _.forOwn(
            init,
            function (value, key) {
                expect(state.get(key)).toEqual(value);

                if (_.isObject(value) && !_.isArray(value)) {
                    //not the same object
                    expect(state.get(key)).not.toBe(value);
                } else if (_.isArray(value)) {
                    //not the same array
                    expect(state.get(key)).not.toBe(value);
                } else {
                    expect(state.get(key)).toBe(value);
                }
            }
        );
    });

    it("should be able to set different type of data by direct key", function () {
        var init = {
            a: null,
            b: true,
            c: undefined,
            d: 1,
            e: 3.14,
            f: [1,2,3],
            g: {aa:1, bb:33},
            h: "string"
        };

        _.forOwn(
            init,
            function (value, key) {
                state.set(key, value);
                expect(state.get(key)).toEqual(value);

                if (_.isObject(value) && !_.isArray(value)) {
                    //not the same object
                    expect(state.get(key) === value).toEqual(false);
                } else if (_.isArray(value)) {
                    //not the same array
                    expect(state.get(key) === value).toEqual(false);
                } else {
                    expect(state.get(key) === value).toEqual(true);
                }

            }
        );
    });

    it("should be able to set different type of data by indirect key", function () {
        var init = {
            'a.a.a': null,
            'b.b': true,
            'c.c.c.c': undefined,
            'd.a.b': 1,
            'e.ss.ss': 3.14,
            'f.b.b.b': [1,2,3],
            'g.f': {aa:1, bb:33},
            'h.f.f.f': "string"
        };

        _.forOwn(
            init,
            function (value, key) {
                state.set(key, value);

                var pathParts = key.split('.'),
                    lastPart = pathParts.pop(),
                    cumulativePath = '';

                _.forOwn(
                    pathParts,
                    function (pathPart) {
                        cumulativePath += pathPart;
                        expect(typeof (state.get(cumulativePath)) ).toEqual('object');
                        cumulativePath += '.'
                    }
                );

                cumulativePath += lastPart;

                expect(state.get(cumulativePath)).toEqual(value);

                if (_.isObject(value) && !_.isArray(value)) {
                    //not the same object
                    expect(state.get(cumulativePath)).not.toBe(value);
                } else if (_.isArray(value)) {
                    //not the same array
                    expect(state.get(cumulativePath)).not.toBe(value);
                } else {
                    expect(state.get(cumulativePath)).toBe(value);
                }

            }
        );
    });

    it("should be able to subscribe/unsubscribe listeners to fields", function () {
        var init = {
            'a': 0,
            'b.b.b': "test",
            'c': {aa: 1, bb: true}
        };

        var listener = {};
        listener.a1 = jasmine.createSpy('a1');
        listener.a2 = jasmine.createSpy('a2');
        listener.b = jasmine.createSpy('b');
        listener.c = jasmine.createSpy('c');

        var unSubscribe_a1, unSubscribe_a2;
        var unSubscribe_b, unSubscribe_c;

        state.initState(init);

        unSubscribe_a1 = state.addListener('a', listener.a1);
        unSubscribe_a2 = state.addListener('a', listener.a2);
        unSubscribe_b = state.addListener('b.b.b', listener.b);
        unSubscribe_c = state.addListener('c', listener.c);

        expect(typeof unSubscribe_a1).toBe('function');
        expect(typeof unSubscribe_a2).toBe('function');
        expect(typeof unSubscribe_b).toBe('function');
        expect(typeof unSubscribe_c).toBe('function');

        var newValue = 1;
        state.set('a', newValue);
        expect(listener.a1).toHaveBeenCalledWith(newValue);
        expect(listener.a2).toHaveBeenCalledWith(newValue);
        expect(listener.b).not.toHaveBeenCalled();
        expect(listener.c).not.toHaveBeenCalled();

    });

    it("should be able to subscribe/unsubscribe listeners to fields", function () {
        var init = {
            'a': 0,
            'b.b.b': "test",
            'c': {aa: 1, bb: true}
        };

        var listener = {};
        listener.a1 = jasmine.createSpy('a1');
        listener.a2 = jasmine.createSpy('a2');
        listener.b = jasmine.createSpy('b');
        listener.c = jasmine.createSpy('c');

        var unSubscribe_a1, unSubscribe_a2;
        var unSubscribe_b, unSubscribe_c;

        state.initState(init);

        unSubscribe_a1 = state.addListener('a', listener.a1);
        unSubscribe_a2 = state.addListener('a', listener.a2);
        unSubscribe_b = state.addListener('b.b.b', listener.b);
        unSubscribe_c = state.addListener('c', listener.c);

        expect(typeof unSubscribe_a1).toBe('function');
        expect(typeof unSubscribe_a2).toBe('function');
        expect(typeof unSubscribe_b).toBe('function');
        expect(typeof unSubscribe_c).toBe('function');

        unSubscribe_a2();
        newValue = 2;
        state.set('a', newValue);
        expect(listener.a1).toHaveBeenCalledWith(newValue);
        expect(listener.a2).not.toHaveBeenCalled();
        expect(listener.b).not.toHaveBeenCalled();
        expect(listener.c).not.toHaveBeenCalled();

    });

    it("should be able to subscribe/unsubscribe listeners to fields", function () {
        var init = {
            'a': 0,
            'b.b.b': "test",
            'c': {aa: 1, bb: true}
        };

        var listener = {};
        listener.a1 = jasmine.createSpy('a1');
        listener.a2 = jasmine.createSpy('a2');
        listener.b = jasmine.createSpy('b');
        listener.c = jasmine.createSpy('c');

        var unSubscribe_a1, unSubscribe_a2;
        var unSubscribe_b, unSubscribe_c;

        state.initState(init);

        unSubscribe_a1 = state.addListener('a', listener.a1);
        unSubscribe_a2 = state.addListener('a', listener.a2);
        unSubscribe_b = state.addListener('b.b.b', listener.b);
        unSubscribe_c = state.addListener('c', listener.c);

        expect(typeof unSubscribe_a1).toBe('function');
        expect(typeof unSubscribe_a2).toBe('function');
        expect(typeof unSubscribe_b).toBe('function');
        expect(typeof unSubscribe_c).toBe('function');

        newValue = 'Ok';
        state.set('b.b.b', newValue);
        expect(listener.a1).not.toHaveBeenCalled();
        expect(listener.a2).not.toHaveBeenCalled();
        expect(listener.b).toHaveBeenCalledWith(newValue);
        expect(listener.c).not.toHaveBeenCalled();

    });

    it("should be able to subscribe/unsubscribe listeners to fields", function () {
        var init = {
            'a': 0,
            'b.b.b': "test",
            'c': {aa: 1, bb: true}
        };

        var listener = {};
        listener.a1 = jasmine.createSpy('a1');
        listener.a2 = jasmine.createSpy('a2');
        listener.b = jasmine.createSpy('b');
        listener.c = jasmine.createSpy('c');

        var unSubscribe_a1, unSubscribe_a2;
        var unSubscribe_b, unSubscribe_c;

        state.initState(init);

        unSubscribe_a1 = state.addListener('a', listener.a1);
        unSubscribe_a2 = state.addListener('a', listener.a2);
        unSubscribe_b = state.addListener('b.b.b', listener.b);
        unSubscribe_c = state.addListener('c', listener.c);

        expect(typeof unSubscribe_a1).toBe('function');
        expect(typeof unSubscribe_a2).toBe('function');
        expect(typeof unSubscribe_b).toBe('function');
        expect(typeof unSubscribe_c).toBe('function');

        newValue = {cc: 11};
        state.set('c', newValue);
        expect(listener.a1).not.toHaveBeenCalled();
        expect(listener.a2).not.toHaveBeenCalled();
        expect(listener.b).not.toHaveBeenCalled();
        expect(listener.c).toHaveBeenCalledWith(newValue);

    });

    it("should be able to subscribe/unsubscribe listeners to fields", function () {
        var init = {
            'a': 0,
            'b.b.b': "test",
            'c': {aa: 1, bb: true}
        };

        var listener = {};
        listener.a1 = jasmine.createSpy('a1');
        listener.a2 = jasmine.createSpy('a2');
        listener.b = jasmine.createSpy('b');
        listener.c = jasmine.createSpy('c');

        var unSubscribe_a1, unSubscribe_a2;
        var unSubscribe_b, unSubscribe_c;

        state.initState(init);

        unSubscribe_a1 = state.addListener('a', listener.a1);
        unSubscribe_a2 = state.addListener('a', listener.a2);
        unSubscribe_b = state.addListener('b.b.b', listener.b);
        unSubscribe_c = state.addListener('c', listener.c);

        expect(typeof unSubscribe_a1).toBe('function');
        expect(typeof unSubscribe_a2).toBe('function');
        expect(typeof unSubscribe_b).toBe('function');
        expect(typeof unSubscribe_c).toBe('function');

        unSubscribe_c();
        newValue = {cc: 11};
        state.set('c', newValue);
        expect(listener.a1).not.toHaveBeenCalled();
        expect(listener.a2).not.toHaveBeenCalled();
        expect(listener.b).not.toHaveBeenCalled();
        expect(listener.c).not.toHaveBeenCalled();

    });

    it("should be able initialize persistent store", function () {
        var spy = {
            clearAll: jasmine.createSpy('clearAll'),
            namespace: jasmine.createSpy('namespace'),
            hasNamespace: jasmine.createSpy('hasNamespace'),
            get: jasmine.createSpy('get'),
            set: jasmine.createSpy('set')
        };
        PersistStoreMock = function () {};
        PersistStoreMock.prototype = {
            __nameSpace: null,
            clearAll: function() {
                spy.clearAll();
            },
            namespace: function(namespace) {
                spy.namespace();
                var newStore = _.cloneDeep(this);
                newStore.__nameSpace = namespace;
                return newStore;
            },
            hasNamespace: function(namespace) {
                spy.hasNamespace();
                return this.__nameSpace === namespace;
            },
            get: function() {
                spy.get();
            },
            set: function() {
                spy.set();
            }
        };
        PersistStoreMock.prototype.constructor = PersistStoreMock;

        var persistStoreMock = new PersistStoreMock();

        var customStorage = new StateManager(persistStoreMock);

        customStorage.clearPersist();
        expect(spy.clearAll).toHaveBeenCalled();

        var oldStore = customStorage.persistentStore;
        var value = '__NS';
        customStorage.setPersistNamespace(value);
        expect(spy.namespace).toHaveBeenCalled();
        expect(oldStore).not.toBe(customStorage.persistentStore);
        expect(persistStoreMock.__nameSpace).not.toEqual(value);
        expect(customStorage.persistentStore.__nameSpace).toEqual(value);

        expect(customStorage.persistHasNamespace(value)).toBe(true);
    });



    it("should be able to set different type of data by direct key to persist storage", function () {
        state.setPersistNamespace('test');
        state.clearPersist();
        var init = {
            a: null,
            b: true,
            c: undefined,
            d: 1,
            e: 3.14,
            f: [1,2,3],
            g: {aa:1, bb:33},
            h: "string"
        };

        _.forOwn(
            init,
            function (value, key) {
                state.setPersist(key, value);
                expect(state.getPersist(key)).toEqual(value);

                if (_.isObject(value) && !_.isArray(value)) {
                    //not the same object
                    expect(state.getPersist(key)).not.toBe(value);
                } else if (_.isArray(value)) {
                    //not the same array
                    expect(state.getPersist(key)).not.toBe(value);
                } else {
                    expect(state.getPersist(key)).toBe(value);
                }

            }
        );

        state.clearPersist();
    });

    it("should be able to set different type of data by indirect key to persist storage", function () {
        state.setPersistNamespace('test');
        state.clearPersist();
        var init = {
            'a.a.a': null,
            'b.b': true,
            'c.c.c.c': undefined,
            'd.a.b': 1,
            'e.ss.ss': 3.14,
            'f.b.b.b': [1,2,3],
            'g.f': {aa:1, bb:33},
            'h.f.f.f': "string"
        };

        _.forOwn(
            init,
            function (value, key) {
                state.setPersist(key, value);

                var pathParts = key.split('.'),
                    lastPart = pathParts.pop(),
                    cumulativePath = '';

                _.forOwn(
                    pathParts,
                    function (pathPart) {
                        cumulativePath += pathPart;
                        expect(typeof(state.getPersist(cumulativePath))).toBe('object');
                        cumulativePath += '.'
                    }
                );

                cumulativePath += lastPart;
                expect(state.getPersist(cumulativePath)).toEqual(value);

                if (_.isObject(value) && !_.isArray(value)) {
                    //not the same object
                    expect(state.getPersist(cumulativePath)).not.toBe(value);
                } else if (_.isArray(value)) {
                    //not the same array
                    expect(state.getPersist(cumulativePath)).not.toBe(value);
                } else {
                    expect(state.getPersist(cumulativePath)).toBe(value);
                }

            }
        );

        state.clearPersist();
    });


    it("should be able to subscribe/unsubscribe listeners to fields of persist store", function () {
        var init = {
            'a': 0,
            'b.b.b': "test",
            'c': {aa: 1, bb: true}
        };

        var listener = {};
        listener.a1 = jasmine.createSpy('a1');
        listener.a2 = jasmine.createSpy('a2');
        listener.b = jasmine.createSpy('b');
        listener.c = jasmine.createSpy('c');

        var unSubscribe_a1, unSubscribe_a2;
        var unSubscribe_b, unSubscribe_c;

        state.setPersistNamespace('test');
        state.clearPersist();
        _.forOwn(
            init,
            function (value, key) {
                state.setPersist(key, value);
            }
        );

        unSubscribe_a1 = state.addPersistListener('a', listener.a1);
        unSubscribe_a2 = state.addPersistListener('a', listener.a2);
        unSubscribe_b = state.addPersistListener('b.b.b', listener.b);
        unSubscribe_c = state.addPersistListener('c', listener.c);

        expect(typeof unSubscribe_a1).toBe('function');
        expect(typeof unSubscribe_a2).toBe('function');
        expect(typeof unSubscribe_b).toBe('function');
        expect(typeof unSubscribe_c).toBe('function');

        var newValue = 1;
        state.setPersist('a', newValue);
        expect(listener.a1).toHaveBeenCalledWith(newValue);
        expect(listener.a2).toHaveBeenCalledWith(newValue);
        expect(listener.b).not.toHaveBeenCalled();
        expect(listener.c).not.toHaveBeenCalled();

    });

    it("should be able to subscribe/unsubscribe listeners to fields of persist store", function () {
        var init = {
            'a': 0,
            'b.b.b': "test",
            'c': {aa: 1, bb: true}
        };

        var listener = {};
        listener.a1 = jasmine.createSpy('a1');
        listener.a2 = jasmine.createSpy('a2');
        listener.b = jasmine.createSpy('b');
        listener.c = jasmine.createSpy('c');

        var unSubscribe_a1, unSubscribe_a2;
        var unSubscribe_b, unSubscribe_c;

        state.setPersistNamespace('test');
        state.clearPersist();
        _.forOwn(
            init,
            function (value, key) {
                state.setPersist(key, value);
            }
        );

        unSubscribe_a1 = state.addPersistListener('a', listener.a1);
        unSubscribe_a2 = state.addPersistListener('a', listener.a2);
        unSubscribe_b = state.addPersistListener('b.b.b', listener.b);
        unSubscribe_c = state.addPersistListener('c', listener.c);

        expect(typeof unSubscribe_a1).toBe('function');
        expect(typeof unSubscribe_a2).toBe('function');
        expect(typeof unSubscribe_b).toBe('function');
        expect(typeof unSubscribe_c).toBe('function');

        unSubscribe_a2();
        newValue = 2;
        state.setPersist('a', newValue);
        expect(listener.a1).toHaveBeenCalledWith(newValue);
        expect(listener.a2).not.toHaveBeenCalled();
        expect(listener.b).not.toHaveBeenCalled();
        expect(listener.c).not.toHaveBeenCalled();

    });

    it("should be able to subscribe/unsubscribe listeners to fields of persist store", function () {
        var init = {
            'a': 0,
            'b.b.b': "test",
            'c': {aa: 1, bb: true}
        };

        var listener = {};
        listener.a1 = jasmine.createSpy('a1');
        listener.a2 = jasmine.createSpy('a2');
        listener.b = jasmine.createSpy('b');
        listener.c = jasmine.createSpy('c');

        var unSubscribe_a1, unSubscribe_a2;
        var unSubscribe_b, unSubscribe_c;

        state.setPersistNamespace('test');
        state.clearPersist();
        _.forOwn(
            init,
            function (value, key) {
                state.setPersist(key, value);
            }
        );

        unSubscribe_a1 = state.addPersistListener('a', listener.a1);
        unSubscribe_a2 = state.addPersistListener('a', listener.a2);
        unSubscribe_b = state.addPersistListener('b.b.b', listener.b);
        unSubscribe_c = state.addPersistListener('c', listener.c);

        expect(typeof unSubscribe_a1).toBe('function');
        expect(typeof unSubscribe_a2).toBe('function');
        expect(typeof unSubscribe_b).toBe('function');
        expect(typeof unSubscribe_c).toBe('function');

        newValue = 'Ok';
        state.setPersist('b.b.b', newValue);
        expect(listener.a1).not.toHaveBeenCalled();
        expect(listener.a2).not.toHaveBeenCalled();
        expect(listener.b).toHaveBeenCalledWith(newValue);
        expect(listener.c).not.toHaveBeenCalled();

    });

    it("should be able to subscribe/unsubscribe listeners to fields of persist store", function () {
        var init = {
            'a': 0,
            'b.b.b': "test",
            'c': {aa: 1, bb: true}
        };

        var listener = {};
        listener.a1 = jasmine.createSpy('a1');
        listener.a2 = jasmine.createSpy('a2');
        listener.b = jasmine.createSpy('b');
        listener.c = jasmine.createSpy('c');

        var unSubscribe_a1, unSubscribe_a2;
        var unSubscribe_b, unSubscribe_c;

        state.setPersistNamespace('test');
        state.clearPersist();
        _.forOwn(
            init,
            function (value, key) {
                state.setPersist(key, value);
            }
        );

        unSubscribe_a1 = state.addPersistListener('a', listener.a1);
        unSubscribe_a2 = state.addPersistListener('a', listener.a2);
        unSubscribe_b = state.addPersistListener('b.b.b', listener.b);
        unSubscribe_c = state.addPersistListener('c', listener.c);

        expect(typeof unSubscribe_a1).toBe('function');
        expect(typeof unSubscribe_a2).toBe('function');
        expect(typeof unSubscribe_b).toBe('function');
        expect(typeof unSubscribe_c).toBe('function');

        newValue = {cc: 11};
        state.setPersist('c', newValue);
        expect(listener.a1).not.toHaveBeenCalled();
        expect(listener.a2).not.toHaveBeenCalled();
        expect(listener.b).not.toHaveBeenCalled();
        expect(listener.c).toHaveBeenCalledWith(newValue);

    });

    it("should be able to subscribe/unsubscribe listeners to fields of persist store", function () {
        var init = {
            'a': 0,
            'b.b.b': "test",
            'c': {aa: 1, bb: true}
        };

        var listener = {};
        listener.a1 = jasmine.createSpy('a1');
        listener.a2 = jasmine.createSpy('a2');
        listener.b = jasmine.createSpy('b');
        listener.c = jasmine.createSpy('c');

        var unSubscribe_a1, unSubscribe_a2;
        var unSubscribe_b, unSubscribe_c;

        state.setPersistNamespace('test');
        state.clearPersist();
        _.forOwn(
            init,
            function (value, key) {
                state.setPersist(key, value);
            }
        );

        unSubscribe_a1 = state.addPersistListener('a', listener.a1);
        unSubscribe_a2 = state.addPersistListener('a', listener.a2);
        unSubscribe_b = state.addPersistListener('b.b.b', listener.b);
        unSubscribe_c = state.addPersistListener('c', listener.c);

        expect(typeof unSubscribe_a1).toBe('function');
        expect(typeof unSubscribe_a2).toBe('function');
        expect(typeof unSubscribe_b).toBe('function');
        expect(typeof unSubscribe_c).toBe('function');

        unSubscribe_c();
        newValue = {cc: 11};
        state.setPersist('c', newValue);
        expect(listener.a1).not.toHaveBeenCalled();
        expect(listener.a2).not.toHaveBeenCalled();
        expect(listener.b).not.toHaveBeenCalled();
        expect(listener.c).not.toHaveBeenCalled();

    });
});