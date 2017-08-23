cb.controls.widget("CheckBox", function (controlType) {
    var control = function (id, options) {
        cb.controls.Control.call(this, id, options);
        this.getElement().next().attr("for", id);
    };
    control.prototype = new cb.controls.Control();
    control.prototype.controlType = controlType;

    control.prototype.setData = function (data) {
        this.getElement().on("change", this, function (e, args) {
            this.checked ? e.data.getElement().attr("checked", "checked") : e.data.getElement().removeAttr("checked");
            e.data.execute("change");
        });
        for (var attr in data) {
            var attrUpper = attr.substring(0, 1).toUpperCase() + attr.substring(1);
            if (this["set" + attrUpper]) this["set" + attrUpper](data[attr]);
        }
    };

    control.prototype.getValue = function () {
        if (this.getElement().attr("checked") === "checked")
            return "Y";
        else
            return "N";
    };

    control.prototype.setValue = function (val) {
        if (val === "Y")
            this.getElement().attr("checked", "checked");
        else
            this.getElement().removeAttr("checked");
    };

    control.prototype.setReadOnly = function (val) {
        if (val)
            this.getElement().attr("disabled", "disabled");
        else
            this.getElement().removeAttr("disabled");
    };

    control.prototype.getReadOnly = function () {
        return this.getElement().attr("disabled") === "disabled" ? true : false;
    };

    control.prototype.setVisible = function (visible) {
        var $parent = this.getElement().parent();
        visible === false ? $parent.hide() : $parent.show();
    };

    return control;
});