var _ = require('lodash');
require('mithril/test-utils/browserMock')(global);

describe("Translations", function () {
    var translate = require('../../src/js/components/translate');
    beforeEach(function () {
        translate.init({})
    });

    it("should be able to apply initial values", function () {
        var init = {
            'translate1': "test",
            'translate2': "text"
        };

        translate.init(init);
        expect(translate.getTranslations()).toEqual(init);
    });

    it("should be able to translate keys", function () {
        var init = {
            'translate1': "test",
            'translate2': "text"
        };

        translate.init(init);

        _.forOwn(
            init,
            function (value, key) {
                expect(translate(key)).toEqual(value);
            }
        );
    });
});
