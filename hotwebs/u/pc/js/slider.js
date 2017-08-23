cb.controls.widget("Slider", function (controlType) {
    var control = function (id, options) {
        cb.controls.Control.call(this, id, options);
    };
    control.prototype = new cb.controls.Control();
    control.prototype.controlType = controlType;

    control.prototype.setData = function (data) {
        if (data) {
            for (var attr in data) {
                var attrValue = data[attr];
                this.setValue(attrValue);
            }
        }
        else
            this.setSelect(true);

        this.getElement().children('span').on("click", this, function (e, args) {
            var val = e.data.getValue() === 'true' ? true : false;
            e.data.setSelect(!val);
            e.data.execute("click", !val);
        });
    };


    control.prototype.getValue = function () {
        return this.getElement().find('input').val();
    };
    control.prototype.setValue = function (val) {
        this.setSelect(val);
        this.getElement().find('input').val(val);
    };

    control.prototype.setSelect = function (val) {
        if (val && val == true) {
            this.getElement().removeClass('unChecked');
            this.getElement().addClass('Checked');
            this.getElement().children("span:last-child").text("是");
        }
        else {
            this.getElement().removeClass('Checked');
            this.getElement().addClass('unChecked');
            this.getElement().children("span:last-child").text("否");
        }
    };

    control.prototype.setDisabled = function (val) {
        this.getElement().attr("disabled", val);
        this._set_data("disabled", val);
    };
    return control;
});