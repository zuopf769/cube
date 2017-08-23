/// <reference path="../Control.js" />
cb.controls.widget("TimeBox", function (controlType) {

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
            culture:"zh-CN"
         
        };

        var myOptions = $.extend(defaultOptions,data);
        this.getElement().kendoTimePicker(myOptions);
        var numberic = this.getElement().data("kendoTimePicker");
        numberic.bind("change", function (e, args) {
            this.options.cubeControl.execute("change", this.value());
        });

        for (var attr in data) {
            var attrUpper = attr.substring(0, 1).toUpperCase() + attr.substring(1);
            if (this["set" + attrUpper]) this["set" + attrUpper](data[attr]);
        }

    };


    // 设置是否必输项,time input 位于第三层 ，上面有两个span
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
    *	获取 options
    */
    control.prototype.getOptions = function () {
        var timepicker = this.getElement().data("kendoTimePicker");
        return timepicker.options;
    }



    /*
    *	设置 options 对象
    */
    control.prototype.setOptions = function (val) {

        var timepicker = this.getElement().data("kendoTimePicker");
        return timepicker.setOptions(val);
    }


    /*
    *	设置 只读属性 true/false
    */
    control.prototype.setReadOnly = function (val) {

        var timepicker = this.getElement().data("kendoTimePicker");
        this.getElement().parent().addClass("readonly");
        timepicker.options.cubeReadOnly = val;
        timepicker.readonly(val);
    }

    /*
    *	获取 只读属性
    */
    control.prototype.getReadOnly = function () {

        var timepicker = this.getElement().data("kendoTimePicker");
        return timepicker.options.cubeReadOnly;
    }


    /*
    *	设置 日期最大值
    */
    control.prototype.setMax = function (val) {

        var timepicker = this.getElement().data("kendoTimePicker");
        timepicker.setOptions({ "max": val });

    }

    /*
    *	获取 日期最大值
    */
    control.prototype.getMax = function () {

        var timepicker = this.getElement().data("kendoTimePicker");
        return timepicker.options.max;
    }


    /*
    *	设置 日期最小值
    */
    control.prototype.setMin = function (val) {

        var timepicker = this.getElement().data("kendoTimePicker");
        timepicker.setOptions({ "min": val });

    }

    /*
    *	获取 日期最小值
    */
    control.prototype.getMin = function () {

        var timepicker = this.getElement().data("kendoTimePicker");
        return timepicker.options.min;
    }


    /*
    *	设置 日期
    */
    control.prototype.setValue = function (val) {

        var timepicker = this.getElement().data("kendoTimePicker");
        timepicker.value(val);

    }

    /*
    *	获取 日期
    */
    control.prototype.getValue = function () {

        var timepicker = this.getElement().data("kendoTimePicker");
        var val = timepicker.value();
        if (val == null && timepicker.options.cubeRequiredInput == true) {
            this.getElement().css("background-color", "red");
        }
        return val;
    }
    return control;
});