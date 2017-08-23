/// <reference path="../../../jquery/jquery-1.11.1.js" />
/// <reference path="../../../common/js/Cube.js" />
/// <reference path="../../../common/js/Control.js" />

cb.controls.widget('CheckList', function (controltype) {

    var control = function (id, options) {
        cb.controls.Control.call(this, id, options);
        this.$ul = $("#" + id);
        this._checkedRows = [];
    }
    control.prototype = new cb.controls.Control();
    control.prototype.controlType = controltype;

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
    }
    control.prototype.setDataSource = function (data) {
        if (this.$ul.length > 0) {
            this.$ul.empty();
        }
        var mode = data.mode;
        var datas = data.datas;
        var self = this;
        datas.forEach(function (data, dataIndex, datas) {

            var $li = $('<li>');
            $li.data('obj', data);
            var $input = $('<input>');
            $input.attr('type', 'checkbox');
            $input.val(data['ID']);
            $input.data('obj', data);
            $input.on('change', function (e, args) {
                var data = { 'id': this.value, 'data': $(this).data('obj') };
                var arguments = {
                    'target': this, 'mode': mode, 'changedata': data
                };
                self.getElement().trigger('itemChecked', arguments);
                if (mode == 'single') {
                    var inputs = self.$ul.find("input");
                    if (this.checked) {
                        for (var i = 0; i < inputs.length; i++) {
                            if (inputs[i] != this)
                                $(inputs[i]).attr('disabled', 'disabled');
                        }
                    }
                    else {
                        for (var i = 0; i < inputs.length; i++) {
                            if (inputs[i] != this)
                                $(inputs[i]).removeAttr('disabled');
                        }
                    }
                }
                e.stopPropagation();
            });
            $li.append($input);
            $li.append(data['DISPLAYNAME'] || data['entityName'] + "____" + data['DisplayName']);
            self.$ul.append($li);
        });
    }

    control.prototype.setClear = function () {
        if (this.$ul.length > 0) {
            this.$ul.empty();
        }
    }
    return control;
});