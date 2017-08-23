/// <reference path="../Control.js" />
/// <reference path="../../../jquery/jquery-1.11.1.min.js" />

cb.controls.widget("OrgBox", function (controlType) {
    var control = function (id, options) {
        cb.controls.Control.call(this, id, options);
        this._id = id;
        this._control = $("#"+id);
        this._value = {};
    };

    control.prototype = new cb.controls.Control();
    control.prototype.controlType = controlType;

    control.prototype.setData = function (data) {
        for (var attr in data) {
            var attrUpper = attr.substring(0, 1).toUpperCase() + attr.substring(1);
            if (this["set" + attrUpper]) this["set" + attrUpper](data[attr]);
        }
    };
    control.prototype.setDataSource = function (datas) {
        ///<param name='datas' type='Array'></param>
        this._control.empty();
        if (datas && datas.length > 0) {
            datas.forEach(function (data, dataIndex, datas) {
                
                var $div = $('<div class="col-lg-1"></div>');
                var $input = $("<input>");
                $input.attr('type', 'checkbox');
                $input.attr('name', data.fieldname);
                $input.data('data', data);
                $input.attr('checked',data.value);
                this._value[data.fieldname] = data.value;

                $input.on("change", this, function (e) {
                    var attrName = $(e.currentTarget).attr('name');
                    if (e.data._value.hasOwnProperty(attrName)){
                        e.data._value[attrName] = e.currentTarget.checked;
                    }
                    e.data.execute('change', e.data._value);
                });
                $div.append($input);
                $div.append(data.displayname);
                if (this._control) {
                    this._control.append($div);
                }
            },this)
        }
    }
    control.prototype.setValue = function (val) {
        ///<param name='val' type='Array'></param>
        if (!val) {
            return;
        }
        val.forEach(function (data, dataIndex, datas) {
            if (this._value.hasOwnProperty(data.fieldname)) {
                this._value[data.fieldname] = data['value'];
                     var $input = $("input[name='" + data.fieldname + "']");
                    if ($input.length > 0) {
                        if (data.value)
                            $($input[0]).prop('checked', true);
                        else
                            $($input[0]).prop('checked', false);
                    }
            }
        },this)
    };

    control.prototype.getValue = function () {
        return this._value;
    };
    control.prototype.setReadOnly = function (val) {
         if (val) {
             this._control.find('input').prop("disabled", "disabled");
         }
         else {
             this._control.find('input').prop("disabled", false);
        }
    };

  
    return control;
});