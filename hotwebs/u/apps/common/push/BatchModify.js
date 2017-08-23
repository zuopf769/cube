/// <reference path="../../../jquery/jquery-1.11.1.js" />
/// <reference path="../../../common/js/Cube.js" />
/// <reference path="../../../common/js/Control.js" />

cb.controls.widget('BatchModify', function (controltype) {

    var control = function (id, options) {
        this._id = id;
        this.$this = $("#" + id);
        cb.controls.Control.call(this, id, options);
    }
    control.prototype = new cb.controls.Control();
    control.prototype.controlType = controltype;

    control.prototype.setValue = function () { };
    control.prototype.getValue = function () { };

    control.prototype.on = function (eventName, func, context) {

        this.getElement().on(eventName, function (e, args) {
            func.call(context, args);
        });
    }

    control.prototype.setData = function (data) {

        for (var attr in data) {
            var attrUpper = attr.substring(0, 1).toUpperCase() + attr.substring(1);
            if (this['set' + attrUpper]) this['set' + attrUpper](data[attr]);
        }

        var self = this;
        var $btn = $("#" + this._id + " Button");
        if ($btn) {
            $btn.on("click", function (e, args) {
                debugger;
                //alert("btnClicked");
                var collectData = {};
                var $fieldContainer = $("#" + self._id + " #pushBatchModifyFields");
                if ($fieldContainer && $fieldContainer.length > 0) {

                    var divs = $fieldContainer.find("div");
                    if (divs && divs.length > 0) {
                        for (var i = 0; i < divs.length; i++) {
                            var $div = $(divs[i]);
                            var key = $div.data().fieldcode;
                            var value = $div.find("input").val();
                            if (value && value.length > 0) {
                                collectData[key] = value;
                            }
                        }
                        args = collectData;
                        self.getElement().trigger("btnClicked", collectData);
                    }
                }
            });
        }
    }

    control.prototype.setDataSource = function (datas) {
        ///<param name='datas' type='Array'>datas</param>
        if (datas && datas.length > 0) {
            var $fieldContainer = $("#" + this._id + " #pushBatchModifyFields");
            if ($fieldContainer && $fieldContainer.length > 0) {
                $fieldContainer.empty();
            }
            datas.forEach(function (data, dataindex, datas) {

                if (data.editflag === false)
                    return;
                var $div = $("<div>");
                $div.css("width", '100%');
                $div.css('height', '30px');
                $div.text(data['fieldname']);
                //$div.val(data['fieldcode']);
                $div.data('fieldcode', data['fieldcode']);

                var $input = $("<input>");
                $input.attr("type", "text");
                //$input.text(data['']);
                $div.append($input);

                $fieldContainer.append($div);
            });
        }
    }

    control.prototype.setVisible = function (visible) {

        if (visible == "false")
            this.$this.hide();
        else
            this.$this.show();
    }

    return control;
});

