/// <reference path="../Control.js" />
cb.controls.widget("NumberBox", function (controlType) {

    var control = function (id, options) {
        cb.controls.Control.call(this, id, options);
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
            culture: "zh-CN"

        };

        data = data || {};
        data.decimals = data.iScale == 0 ? 0 : (data.iScale || 2);
        data.format = data.format || "n" + data.decimals;

        var myOptions = $.extend(defaultOptions, data);
        this.getElement().kendoNumericTextBox(myOptions);
        var numberic = this.getElement().data("kendoNumericTextBox");
        numberic.bind("change", function (e, args) {
            this.options.cubeControl.execute("change", this.value());
        });

        for (var attr in data) {
            var attrUpper = attr.substring(0, 1).toUpperCase() + attr.substring(1);
            if (this["set" + attrUpper]) this["set" + attrUpper](data[attr]);
        }

    };

    // 设置是否必输项,Numeric input 位于第三层 ，上面有两个span
    control.prototype.setIsNullable = function (val) {
        var $label = this.getElement().parent().parent().parent().prev();
        if (!$label.length) return;
        $label.toggleClass("mustinput", !val);
    };
    control.prototype.setNoinput = function (val) {
        var $label = this.getElement().parent().parent().parent().prev();
        var $parent = this.getElement().parent().parent();
        $label.toggleClass("mustinput-noinput", val);
        $parent.toggleClass("parentdiv-noinput", val);
    };

    control.prototype.setVisible = function (visible) {
        var $parent = this.getElement().parent().parent().parent().parent();
        visible === false ? $parent.hide() : $parent.show();
    };

    /*
    *	设置输入框的值
    */
    control.prototype.setValue = function (val) {
        var numberic = this.getElement().data("kendoNumericTextBox");
        numberic.value(val);
    };

    /*
    *	得到输入框的值
    */
    control.prototype.getValue = function () {
        var numberic = this.getElement().data("kendoNumericTextBox");
        var val = numberic.value();
        if (val == null && numberic.options.cubeRequiredInput == true) {
            this.getElement().css("background-color", "red");
        }
        return val;
    };

    /*
    *	设置精确度（小数长度）
    */
    control.prototype.setDecimals = function (val) {

        var numberic = this.getElement().data("kendoNumericTextBox");
        numberic.options.decimals = val;
        numberic.options.format = "n" + val;

    }

    /*
    *	获取精确度
    */
    control.prototype.getDecimals = function () {

        var numberic = this.getElement().data("kendoNumericTextBox");
        return numberic.options.decimals;
    }

    /*
    *	设置 数据可以达到的最大值
    */
    control.prototype.setMaxValue = function (val) {
        if (val) {
            var numberic = this.getElement().data("kendoNumericTextBox");
            numberic.options.max = val;
        }
    }

    /*
    *	获取 数据可以达到的最大值
    */
    control.prototype.getMaxValue = function () {
        var numberic = this.getElement().data("kendoNumericTextBox");
        return numberic.options.max;
    }


    /*
    *	设置 数据可以达到的最小值
    */
    control.prototype.setMinValue = function (val) {
        if (val) {
            var numberic = this.getElement().data("kendoNumericTextBox");
            numberic.options.min = val;
        }
    }

    /*
    *	获取 数据可以达到的最小值
    */
    control.prototype.getMinValue = function () {
        var numberic = this.getElement().data("kendoNumericTextBox");
        return numberic.options.min;
    }

    /*
    *	设置 数据滚动的步子大小
    */
    control.prototype.setStep = function (val) {

        var numberic = this.getElement().data("kendoNumericTextBox");
        numberic.setOptions({ "step": val });
    }

    /*
    *	获取 数据滚动的步子大小
    */
    control.prototype.getStep = function () {
        var numberic = this.getElement().data("kendoNumericTextBox");
        return numberic.options.step;
    }


    /*
    *	获取 options
    */
    control.prototype.getOptions = function () {
        var numberic = this.getElement().data("kendoNumericTextBox");
        return numberic.options;
    }



    /*
    *	设置 options 对象
    */
    control.prototype.setOptions = function (val) {

        var numberic = this.getElement().data("kendoNumericTextBox");
        return numberic.setOptions(val);
    }


    /*
    *	设置 只读属性
    */
    control.prototype.setReadOnly = function (val) {

        var numberic = this.getElement().data("kendoNumericTextBox");
        if(val)
        	this.getElement().parent().addClass("readonly");
        else
        	this.getElement().parent().removeClass("readonly");
        numberic.options.cubeReadOnly = val;
        numberic.readonly(val);
    }

    /*
    *	获取 只读属性
    */
    control.prototype.getReadOnly = function () {

        var numberic = this.getElement().data("kendoNumericTextBox");
        return numberic.options.cubeReadOnly;
    }

    /*
    *	设置 关注
    */
    control.prototype.setFocus = function (val) {
        var numberic = this.getElement().data("kendoNumericTextBox");
        numberic.focus();
    }

    /*
    *	获取 关注
    */
    control.prototype.getFocus = function () {
        return null;
    }

    return control;
});