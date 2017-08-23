/// <reference path="../Control.js" />
cb.controls.widget("ComboBox", function (controlType) {

    var control = function (id, options) {
        cb.controls.Control.call(this, id, options);
    };
    control.prototype = new cb.controls.Control();
    control.prototype.controlType = controlType;

    control.prototype.setData = function (data) {
        /*
        *	一下是控件试用时只能初始化一次的属性 不带cube的单词
        */

        var defaultOptions = { "cubeControl": this,
            // 设置是否只读属性
            "cubeReadOnly": false,
            // 下拉选项显示属性
            dataTextField: "text",
            filter: "contains",
            // 下拉选项对应值域
            dataValueField: "value",
            culture: "zh-CN"

        };

        var myOptions = $.extend(defaultOptions, data);



        this.getElement().kendoComboBox(myOptions);
        var combo = this.getElement().data("kendoComboBox");
        combo.bind("change", function (e, args) {
            var valueField = this.options.dataValueField;
            var textField = this.options.dataTextField;
            var dataSource = this.options.dataSource.options.data;
            var value = this.value();
            var isValid = false;
            for (var i = 0, len = dataSource.length; i < len; i++) {
                if (dataSource[i][valueField] == value) {
                    this.text(dataSource[i][textField]);
                    isValid = true;
                    break;
                }
            }
            if (!isValid) this.value(null);
            this.options.cubeControl.execute("change", this.value());
        });

        //debugger;
        for (var attr in data) {
            var attrUpper = attr.substring(0, 1).toUpperCase() + attr.substring(1);
            if (this["set" + attrUpper]) this["set" + attrUpper](data[attr]);
        }
    };


    // 设置是否必输项,combobox input 位于第三层 ，上面有两个span
    control.prototype.setIsNullable = function (val) {
        var $label = this.getElement().parent().parent().prev();
        if (!$label.length) return;
        $label.toggleClass("mustinput", !val);
    };
    control.prototype.setNoinput = function (val) {
        var $label = this.getElement().parent().parent().prev();
        var $parent = this.getElement().parent();
        $label.toggleClass("mustinput-noinput", val);
        $parent.toggleClass("parentdiv-noinput", val);
    };

    control.prototype.setVisible = function (visible) {
        var $parent = this.getElement().parent().parent().parent();
        visible === false ? $parent.hide() : $parent.show();
    };

    /*
    *	设置输入框的值
    */
    control.prototype.setValue = function (val) {

        var combo = this.getElement().data("kendoComboBox");
        combo.value(val);
    };

    /*
    *	得到输入框的值
    */
    control.prototype.getValue = function () {

        var combo = this.getElement().data("kendoComboBox");
        var val = combo.value();
        if (val == null && combo.options.cubeRequiredInput == true) {
            this.getElement().css("background-color", "red");
        }
        return val;
    };

    /*
    *	得到输入框的显示值
    */
    control.prototype.getText = function () {

        var combo = this.getElement().data("kendoComboBox");
        var val = combo.text();
        if (val == null && combo.options.cubeRequiredInput == true) {
            this.getElement().css("background-color", "red");
        }
        return val;
    };


    /*
    *	获取 options
    */
    control.prototype.getOptions = function () {
        var combo = this.getElement().data("kendoComboBox");
        return combo.options;
    }



    /*
    *	设置 options 对象
    */
    control.prototype.setOptions = function (val) {

        var combo = this.getElement().data("kendoComboBox");
        return combo.setOptions(val);
    }


    /*
    *	设置 只读属性
    */
    control.prototype.setReadOnly = function (val) {

        var combo = this.getElement().data("kendoComboBox");
        combo.options.cubeReadOnly = val;
        combo.readonly(val);
    }

    /*
    *	获取 只读属性
    */
    control.prototype.getReadOnly = function () {

        var combo = this.getElement().data("kendoComboBox");
        var result = combo.readonly();
        return result;
        return combo.options.cubeReadOnly;
    }

    // 添加元素之前要得到元素，为了添加成功，要有返回值
    control.prototype.getAddElem = function () {
        return null;
    }


    // 添加元素（ 注意一定是元素格式，否则添加不成功 ）
    control.prototype.setAddElem = function (val) {
        var combobox = this.getElement().data("kendoComboBox");
        combobox.dataSource.add(val);
    }

    // 添加数组之前要得到元素，为了添加成功，要有返回值
    control.prototype.getAddArray = function () {
        return null;
    }

    // 添加数组( 注意一定是数组格式，否则添加不成功 )
    control.prototype.setAddArray = function (val) {
        var combobox = this.getElement().data("kendoComboBox");
        for (var i = 0; i < val.length; i++)
            combobox.dataSource.add(val[i]);
    }


    // 得到数据源
    control.prototype.getDataSource = function () {

        var combo = this.getElement().data("kendoComboBox");
        return combo.options.dataSource;
    }

    // 设置数据源
    control.prototype.setDataSource = function (val) {

        var combo = this.getElement().data("kendoComboBox");
        var newdata = new kendo.data.DataSource({
            data: val
        });
        combo.setDataSource(newdata);
        combo.refresh();

    }


    // 删除数据源第i条
    control.prototype.setRemoveItem = function (i) {

        var combo = this.getElement().data("kendoComboBox");
        var data = combo.dataSource.data();
        if (i >= 0 && i < data.length) {
            var dataItem = combo.dataSource.at(i);
            combo.dataSource.remove(dataItem);
            return true;
        }
        else return false;

    }

    // 附加删除数据源第i条函数
    control.prototype.getRemoveItem = function () {
        return null;

    }

    // 删除所有数据源
    control.prototype.setRemoveAllItem = function (val) {
        var combo = this.getElement().data("kendoComboBox");
        var data = combo.dataSource.data();
        for (var i = data.length - 1; i >= 0; i--) {
            var dataItem = combo.dataSource.at(i);
            combo.dataSource.remove(dataItem);
        }
    }

    // 附加删除所有数据源
    control.prototype.getRemoveAllItem = function () {
        return null;
    }

    // 设置聚焦
    control.prototype.setFocus = function (val) {
        var combo = this.getElement().data("kendoComboBox");
        combo.focus();
    }

    // 获得聚焦
    control.prototype.getFocus = function () {
        return false;
    }

    // 设置搜索关键字
    control.prototype.setSearch = function (val) {
        var combo = this.getElement().data("kendoComboBox");
        combo.search(val);
    }

    // 得到搜索关键字
    control.prototype.getSearch = function () {
        return null;
    }
    return control;
});