/// <reference path="../Control.js" />

cb.controls.widget("CheckBox", function (controlType) {

    var control = function (id, options) {
        cb.controls.Control.call(this, id, options);

    };

    control.prototype = new cb.controls.Control();
    control.prototype.controlType = controlType;

    // 设置数据
    control.prototype.setData = function (data) {
        var $input = this.getElement();
        if (!$input.is(":checkbox"))
            $input = $input.children("input");

        this._set_data("$input", $input);
        this.getElement().on("change", this, function (e, args) {
            e.data.execute("change");
        });

        for (var attr in data) {
            var attrUpper = attr.substring(0, 1).toUpperCase() + attr.substring(1);
            if (this["set" + attrUpper]) this["set" + attrUpper](data[attr]);
        }

    };

    control.prototype.getValue = function () {
        return this._get_data("$input").prop("checked") == true ? true : false;
    };
    control.prototype.setValue = function (val) {
        //var checked = val == "Y" ? true : false;
        this._get_data("$input").prop("checked", val);
    };
    control.prototype.setReadOnly = function (val) {
        if (val) {
            this._get_data("$input").prop("disabled", "disabled");
            if (this._get_data("$input").flipswitch)
                this._get_data("$input").flipswitch({ "disabled": "disabled" });
        }
        else {
            this._get_data("$input").prop("disabled", false);
            if (this._get_data("$input").flipswitch)
                this._get_data("$input").flipswitch({ "disabled": false });
        }
    };
    // control.prototype.setData = function (data) {
    //     for (var attr in data) {
    //         var attrValue = data[attr];
    //         switch (attr) {
    //             case "Text":
    //                 this.setText(attrValue);
    //                 break;
    //         }
    //     }
    // };

    control.prototype.getReadOnly = function () {
        return this._get_data("$input").prop("disabled") == "disabled" ? true : false;
    };

    //设置CheckBox的文本值
    control.prototype.setText = function (val) {
        this.getElement().append(val);
    };

    control.prototype.setVisible = function (visible) {
        var $parent = this.getElement().parent();
        visible === false ? $parent.hide() : $parent.show();
    };

    return control;
});