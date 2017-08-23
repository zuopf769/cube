/// <reference path="../Control.js" />
cb.controls.widget("DateTimeBox", function (controlType) {

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
            format: "yyyy/MM/dd HH:mm:ss",
            culture: "zh-CN"

        };

        var myOptions = $.extend(defaultOptions, data);
        this.getElement().kendoDateTimePicker(myOptions);
        var numberic = this.getElement().data("kendoDateTimePicker");
        numberic.bind("change", function (e, args) {
            if (this.value() == null)
                this.value(null);
            this.options.cubeControl.execute("change", this.value());
        });
        this.getElement().bind("focusout", numberic, function (e, args) {
            if (e.data.value() == null)
                e.data.value(null);
            e.data.options.cubeControl.execute("change", e.data.value());
        });

        for (var attr in data) {
            var attrUpper = attr.substring(0, 1).toUpperCase() + attr.substring(1);
            if (this["set" + attrUpper]) this["set" + attrUpper](data[attr]);
        }

    };

    // 设置是否必输项,datetime input 位于第三层 ，上面有两个span
    control.prototype.setIsNullable = function (val) {
        if (typeof val == "string")
            val = val == "false" ? false : true;
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
    *	设置 只读属性
    */
    control.prototype.setReadOnly = function (val) {
        var datetimepicker = this.getElement().data("kendoDateTimePicker");
        if (val)
            this.getElement().parent().addClass("readonly");
        else
            this.getElement().parent().removeClass("readonly");
        datetimepicker.options.cubeReadOnly = val;
        datetimepicker.readonly(val);
    }

    /*
    *	获取 只读属性
    */
    control.prototype.getReadOnly = function () {

        var datetimepicker = this.getElement().data("kendoDateTimePicker");
        return datetimepicker.options.cubeReadOnly;
    }


    /*
    *	设置 日期最大值
    */
    control.prototype.setMax = function (val) {

        var datetimepicker = this.getElement().data("kendoDateTimePicker");
        datetimepicker.setOptions({ "max": val });

    }

    /*
    *	获取 日期最大值
    */
    control.prototype.getMax = function () {

        var datetimepicker = this.getElement().data("kendoDateTimePicker");
        return datetimepicker.options.max;
    }


    /*
    *	设置 日期最小值
    */
    control.prototype.setMin = function (val) {

        var datetimepicker = this.getElement().data("kendoDateTimePicker");
        datetimepicker.setOptions({ "min": val });

    }

    /*
    *	获取 日期最小值
    */
    control.prototype.getMin = function () {

        var datetimepicker = this.getElement().data("kendoDateTimePicker");
        return datetimepicker.options.min;
    }


    /*
    *	设置 日期和时间
    */
    control.prototype.setValue = function (val) {

        var datetimepicker = this.getElement().data("kendoDateTimePicker");
        var value = val == null ? "" : new Date(val);
        datetimepicker.value(value);

    }

    /*
    *	获取 日期和时间
    */
    control.prototype.getValue = function () {

        var datetimepicker = this.getElement().data("kendoDateTimePicker");
        var val = datetimepicker.value();
        var value = val == null ? null : cb.util.formatDateTime(val);
        return value;
    }


    /*
    *	获取 options
    */
    control.prototype.getOptions = function () {
        var datetime = this.getElement().data("kendoDateTimePicker");
        return datetime.options;
    }



    /*
    *	设置 options 对象
    */
    control.prototype.setOptions = function (val) {

        var datetime = this.getElement().data("kendoDateTimePicker");
        return datetime.setOptions(val);
    }


    return control;
});