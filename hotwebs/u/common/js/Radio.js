/// <reference path="../Control.js" />

/// <reference path="../Control.js" />
cb.controls.widget("Radio", function (controlType) {
    var _shieldChar;
    var control = function (id, options) {
        cb.controls.Control.call(this, id, options);
    };
    control.prototype = new cb.controls.Control();
    control.prototype.controlType = controlType;

    control.prototype.getValue = function () {
        if (this.getElement().children("input:checked"))
            return this.getElement().children("input:checked").data("itemData");
    };
    control.prototype.setValue = function (val) {
        this.getElement().children("input:checked").attr("checked",false);
        this.getElement().children("input").each(function (i, n) {
           // debugger;
            if ($(n).data("itemData") == val) {
                $(n).attr("checked", true);
				$(n).trigger("click");
            }
        });
    };

    control.prototype.setData = function (data) {
         this.setRadio(data);
    };

    control.prototype.setRadio = function (data) {
        for (var attr in data.dataSource.list) {
            var attrValue = data.dataSource.list[attr];
            if (attr.length == 1) {

                var isChecked = "";
                if (attrValue.checked) {
                    isChecked += "checked";
                }
                var ele = $('<input type="radio" name="' + data.dataSource.name + '" value="' + attrValue.value + '" ' + isChecked + ' />').data("itemData", attr);
                ele.on("click", this, function (e, args) {
                    var disabled = e.data._get_data("disabled");
                    if (disabled) return;
                    e.data.execute("click", e.data.getValue());
                });
                this.getElement().append(ele);
                this.getElement().append('<label></label>');
                this.getElement().append(attrValue.text);
                this.getElement().addClass("radio");
            }

        }

    };
  
    /*control.prototype.on = function (val, name) {
        var isChecked = "";
        if (val.checked) {
            isChecked += "checked";
        }
        var ele = $('<input type="checkbox" name="' + name + '" id="' + name + '" value="' + val.value + '" ' + isChecked + ' />');
        this.getElement().append(ele);
        this.getElement().append('<label  for=' + name + '></label>');
        this.getElement().append(val.text);
        this.getElement().addClass("checkbox");
    };*/
    return control;
});