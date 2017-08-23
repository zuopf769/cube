/// <reference path="../../jquery/jquery.js" />
/// <reference path="../Control.js" />
cb.controls.widget("RejectList", function (controlType) {

    var $select;
    var _id;
    var control = function (id, options) {
        cb.controls.Control.call(this, id, options);

        if (id) {
            _id = id;
            $select = $("#" + id + " select");
        }
    };
    control.prototype = new cb.controls.Control();
    control.prototype.controlType = controlType;

    control.prototype.getValue = function () {

    };

    control.prototype.setValue = function (val) {

    };
    control.prototype.on = function (eventName, func, context) {
        //var data = { me: this, context: context };
        debugger;
        this.getElement().on(eventName, function () {
            func.call(context);
        });
    };
    control.prototype.setData = function (data) {
        ///<param name="datas" type='Array'>datas</param>
        debugger;
        for (var attr in data) {
            var attrUpper = attr.substring(0, 1).toUpperCase() + attr.substring(1);
            if (this["set" + attrUpper]) this["set" + attrUpper](data[attr]);
        }
        var self = this;
        $select.on("change", function (e, args) {
            debugger;
            self.getElement().trigger("selectedIndexChanged", "ddd");
        });
    };

    control.prototype.setDataSource = function (datas) {
        ///<param name="datas" type='Array'>datas</param>
        debugger;
        $select.empty();
        if ($select && datas && datas.length > 0) {
            datas.forEach(function (data, dataindex, datas) {
                var $option = $("<option>");
                $option.text(data['name']);
                $option.val(data['id']);
                $select.append($option);
            });
        }
    };

    control.prototype.setVisible = function (visible) {

        if (visible)
            $("#" + _id).show();
        else
            $("#" + _id).hide();

    }

    return control;
});