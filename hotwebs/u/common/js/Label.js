/// <reference path="../Control.js" />

cb.controls.widget("Label", function (controlType) {
    var control = function (id, options) {
        cb.controls.Control.call(this, id, options);
    };
    control.prototype = new cb.controls.Control();
    control.prototype.controlType = controlType;

    control.prototype.getValue = function () {
        return this.getElement().text();
    };

    control.prototype.setValue = function (val) {
        if (!val) val = "";
        var text = "";
        if (typeof val == "object") {
            for (var attr in val) {
                text += val[attr];
            }
        } else {
            text = val;
        }
        this.getElement().text(text);
    };

    control.prototype.addClass = function (styleName) {
        this.getElement().addClass(styleName);
    };

    control.prototype.removeCss = function (styleName) {
        this.getElement().removeClass(styleName);
    };

    control.prototype.setFormLink = function (url, tips) {
        var text = this.getElement().text();
        $("<a href=" + url + ">" + text + "</a>").appendTo(this.getElement());
    };

    return control;
});

