var _ = require('lodash');

describe('Storage', function () {
    var storageManager = require('../../src/js/components/storage');
    beforeEach(function () {
        storageManager.init({});
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

        storageManager.init(init);

        _.forOwn(
            init,
            function (value, key) {
                expect(storageManager.get(key)).toEqual(value);

                if (_.isObject(value) && !_.isArray(value)) {
                    //not the same object
                    expect(storageManager.get(key) === value).toEqual(false);
                } else if (_.isArray(value)) {
                    //not the same array
                    expect(storageManager.get(key) === value).toEqual(false);
                } else {
                    expect(storageManager.get(key) === value).toEqual(true);
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
                storageManager.set(key, value);
                expect(storageManager.get(key)).toEqual(value);

                if (_.isObject(value) && !_.isArray(value)) {
                    //not the same object
                    expect(storageManager.get(key) === value).toEqual(false);
                } else if (_.isArray(value)) {
                    //not the same array
                    expect(storageManager.get(key) === value).toEqual(false);
                } else {
                    expect(storageManager.get(key) === value).toEqual(true);
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
                storageManager.set(key, value);

                var pathParts = key.split('.'),
                    lastPart = pathParts.pop(),
                    cumulativePath = '';

                _.forOwn(
                    pathParts,
                    function (pathPart) {
                        cumulativePath += pathPart;
                        expect(typeof (storageManager.get(cumulativePath)) ).toEqual('object');
                        cumulativePath += '.'
                    }
                );

                cumulativePath += lastPart;

                expect(storageManager.get(cumulativePath)).toEqual(value);

                if (_.isObject(value) && !_.isArray(value)) {
                    //not the same object
                    expect(storageManager.get(cumulativePath)).not.toBe(value);
                } else if (_.isArray(value)) {
                    //not the same array
                    expect(storageManager.get(cumulativePath)).not.toBe(value);
                } else {
                    expect(storageManager.get(cumulativePath)).toBe(value);
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

        storageManager.init(init);

        unSubscribe_a1 = storageManager.addListener('a', listener.a1);
        unSubscribe_a2 = storageManager.addListener('a', listener.a2);
        unSubscribe_b = storageManager.addListener('b.b.b', listener.b);
        unSubscribe_c = storageManager.addListener('c', listener.c);

        expect(typeof unSubscribe_a1).toBe('function');
        expect(typeof unSubscribe_a2).toBe('function');
        expect(typeof unSubscribe_b).toBe('function');
        expect(typeof unSubscribe_c).toBe('function');

        var newValue = 1;
        storageManager.set('a', newValue);
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

        storageManager.init(init);

        unSubscribe_a1 = storageManager.addListener('a', listener.a1);
        unSubscribe_a2 = storageManager.addListener('a', listener.a2);
        unSubscribe_b = storageManager.addListener('b.b.b', listener.b);
        unSubscribe_c = storageManager.addListener('c', listener.c);

        expect(typeof unSubscribe_a1).toBe('function');
        expect(typeof unSubscribe_a2).toBe('function');
        expect(typeof unSubscribe_b).toBe('function');
        expect(typeof unSubscribe_c).toBe('function');

        unSubscribe_a2();
        newValue = 2;
        storageManager.set('a', newValue);
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

        storageManager.init(init);

        unSubscribe_a1 = storageManager.addListener('a', listener.a1);
        unSubscribe_a2 = storageManager.addListener('a', listener.a2);
        unSubscribe_b = storageManager.addListener('b.b.b', listener.b);
        unSubscribe_c = storageManager.addListener('c', listener.c);

        expect(typeof unSubscribe_a1).toBe('function');
        expect(typeof unSubscribe_a2).toBe('function');
        expect(typeof unSubscribe_b).toBe('function');
        expect(typeof unSubscribe_c).toBe('function');

        newValue = 'Ok';
        storageManager.set('b.b.b', newValue);
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

        storageManager.init(init);

        unSubscribe_a1 = storageManager.addListener('a', listener.a1);
        unSubscribe_a2 = storageManager.addListener('a', listener.a2);
        unSubscribe_b = storageManager.addListener('b.b.b', listener.b);
        unSubscribe_c = storageManager.addListener('c', listener.c);

        expect(typeof unSubscribe_a1).toBe('function');
        expect(typeof unSubscribe_a2).toBe('function');
        expect(typeof unSubscribe_b).toBe('function');
        expect(typeof unSubscribe_c).toBe('function');

        newValue = {cc: 11};
        storageManager.set('c', newValue);
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

        storageManager.init(init);

        unSubscribe_a1 = storageManager.addListener('a', listener.a1);
        unSubscribe_a2 = storageManager.addListener('a', listener.a2);
        unSubscribe_b = storageManager.addListener('b.b.b', listener.b);
        unSubscribe_c = storageManager.addListener('c', listener.c);

        expect(typeof unSubscribe_a1).toBe('function');
        expect(typeof unSubscribe_a2).toBe('function');
        expect(typeof unSubscribe_b).toBe('function');
        expect(typeof unSubscribe_c).toBe('function');

        unSubscribe_c();
        newValue = {cc: 11};
        storageManager.set('c', newValue);
        expect(listener.a1).not.toHaveBeenCalled();
        expect(listener.a2).not.toHaveBeenCalled();
        expect(listener.b).not.toHaveBeenCalled();
        expect(listener.c).not.toHaveBeenCalled();

    });
});