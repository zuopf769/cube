/// <reference path="../Control.js" />
cb.controls.widget("TextBox", function (controlType) {
    var keys = {};
    if (kendo.keys) {
        cb.eachIn(kendo.keys, function (index, attr, val) {
            keys[val] = attr;
        });
    }

    var control = function (id, options) {
        cb.controls.Control.call(this, id, options);
        this.getElement().on("keydown", this, function (e, args) {
            if (e.keyCode != 13) return;
            e.data.execute("change");
        });
    };

    control.prototype = new cb.controls.Control();
    control.prototype.controlType = controlType;


    // 设置数据
    control.prototype.setData = function (data) {
        /*
        *	一下是控件试用时只能初始化一次的属性 不带cube的单词
        */

        var defaultOptions = { "cubeControl": this,
            // 设置是否只读属性
            "cubeReadOnly": false,
            promptChar: " ",
            culture: "zh-CN"

        };

        var maxLength = 1000;
        if (data.iLength) {
            maxLength = parseInt(data.iLength);
        }

        var mask = [];
        switch (data.refShowMode) {
            case "Letter":
                for (var i = 0; i < maxLength; i++) {
                    mask.push("L");
                };
                break;
            case "Digit":
                for (var i = 0; i < maxLength; i++) {
                    mask.push("0");
                };
                break;
            case "LetterDigit":
                for (var i = 0; i < maxLength; i++) {
                    mask.push("A");
                };
                break;
        };
        if (mask.length) {
            data.mask = mask.join("");
        } else {
            this.getElement().on("keydown", this, function (e, args) {
                if (e.which === 0 || e.metaKey || e.ctrlKey) return;
                if (keys[e.keyCode]) return;
                var val = e.data.getValue();
                if (val && val.length >= maxLength)
                    e.preventDefault();
            });
        }
        var myOptions = $.extend(defaultOptions, data);
        this.getElement().kendoMaskedTextBox(myOptions);
        var numberic = this.getElement().data("kendoMaskedTextBox");
        numberic.bind("change", function (e, args) {
            this.options.cubeControl.execute("change");
        });

        for (var attr in data) {
            var attrUpper = attr.substring(0, 1).toUpperCase() + attr.substring(1);
            if (this["set" + attrUpper]) this["set" + attrUpper](data[attr]);
        }

    };

    control.prototype.setHint = function (val) {
        if (!val || !val.rule || !val.data) return;
        this._set_data("hint", val);
        this.getElement().attr("placeholder", val.rule);
        this.getElement().attr("title", val.data);
    };

    // 设置是否必输项,masked input 位于第1层 
    control.prototype.setIsNullable = function (val) {
        if (typeof val == "string")
            val = val == "false" ? false : true;
        var $label = this.getElement().parent().prev();
        if (!$label.length) return;
        $label.toggleClass("mustinput", !val);
    };
    control.prototype.setNoinput = function (val) {
        var $label = this.getElement().parent().prev();
        var $parent = this.getElement();
        $label.toggleClass("mustinput-noinput", val);
        $parent.toggleClass("parentdiv-noinput", val);
    };

    control.prototype.setVisible = function (visible) {
        var $parent = this.getElement().parent().parent();
        visible === false ? $parent.hide() : $parent.show();
    };

    /*
    *	设置输入框的值
    */
    control.prototype.setValue = function (val) {
        if (!val) {
            val = "";
            var hint = this._get_data("hint");
            if (hint) {
                this.getElement().attr("title", hint.data);
            }
        } else {
            this.getElement().attr("title", val);
        }
        var masked = this.getElement().data("kendoMaskedTextBox");
        masked.value(val);
    };

    /*
    *	得到输入框的值
    */
    control.prototype.getValue = function () {
        var maskedTextBox = this.getElement().data("kendoMaskedTextBox");
        var mask = maskedTextBox.options.mask;
        var val = mask ? maskedTextBox.raw() : maskedTextBox.value();
        return val;
    };


    /*
    *	获取 options
    */
    control.prototype.getOptions = function () {
        var masked = this.getElement().data("kendoMaskedTextBox");
        return masked.options;
    }



    /*
    *	设置 options 对象
    */
    control.prototype.setOptions = function (val) {

        var masked = this.getElement().data("kendoMaskedTextBox");
        return masked.setOptions(val);
    }


    /*
    *	设置 只读属性
    */
    control.prototype.setReadOnly = function (val) {

        var masked = this.getElement().data("kendoMaskedTextBox");
        masked.options.cubeReadOnly = val;
        masked.readonly(val);
    }

    /*
    *	获取 只读属性
    */
    control.prototype.getReadOnly = function () {

        var masked = this.getElement().data("kendoMaskedTextBox");
        return masked.options.cubeReadOnly;
    }




    return control;
});