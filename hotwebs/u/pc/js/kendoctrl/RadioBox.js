cb.controls.widget("RadioBox", function (controlType) {
    var control = function (id, options) {
        cb.controls.Control.call(this, id, options);
        this.getElement().on("change", this, function (e, args) {
            var inputs = e.data._get_data("inputs");
            if (!inputs) return;
            cb.eachIn(inputs, function (index, attr, val) {
                if (val === e.target)
                    val.setAttribute("checked", "checked");
                else
                    val.removeAttribute("checked");
            });
            e.data.execute("change");
        });
    };
    control.prototype = new cb.controls.Control();
    control.prototype.controlType = controlType;

    control.prototype.setData = function (data) {
        var defaultOptions = {
            dataTextField: "text",
            dataValueField: "value"
        };
        var myOptions = cb.extend(defaultOptions, data);
        this._set_data("options", myOptions);
        if (myOptions.dataSource)
            this.setDataSource(myOptions.dataSource);
        for (var attr in myOptions) {
            if (attr === "dataSource") continue;
            var attrUpper = attr.substring(0, 1).toUpperCase() + attr.substring(1);
            if (this["set" + attrUpper]) this["set" + attrUpper](myOptions[attr]);
        }
    };

    control.prototype.setDataSource = function (dataSource) {
        if (!dataSource || !cb.isArray(dataSource)) return;
        var parentId = this._get_data("id");
        var options = this._get_data("options");
        var valueField = options["dataValueField"];
        var textField = options["dataTextField"];
        var $parent = this.getElement();
        var inputs = {};
        var li;
        var input;
        var label;
        var id;
        cb.each(dataSource, function (item) {
            id = parentId + "_" + item[valueField];
            li = document.createElement("li");
            input = document.createElement("input");
            input.setAttribute("type", "radio");
            input.setAttribute("name", parentId);
            input.setAttribute("id", id);
            input.setAttribute("class", "k-radio");
            if (item.isSelected)
                input.setAttribute("checked", "checked");
            li.appendChild(input);
            label = document.createElement("label");
            label.setAttribute("class", "k-radio-label");
            label.setAttribute("for", id);
            label.textContent = item[textField];
            li.appendChild(label);
            $parent.append(li);
            inputs[item[valueField]] = input;
        });
        this._set_data("inputs", inputs);
    };

    control.prototype.getValue = function () {
        var inputs = this._get_data("inputs");
        if (!inputs) return;
        for (var attr in inputs) {
            if (inputs[attr].getAttribute("checked") === "checked")
                return attr;
        }
        return null;
    };

    control.prototype.setValue = function (val) {
        if (!val) return;
        var inputs = this._get_data("inputs");
        if (!inputs) return;
        inputs[val].setAttribute("checked", "checked");
    };

    control.prototype.setReadOnly = function (val) {
        if (val)
            this.getElement().attr("disabled", "disabled");
        else
            this.getElement().removeAttr("disabled");
    };

    control.prototype.getReadOnly = function () {
        return this.getElement().attr("disabled") === "disabled" ? true : false;
    };

    control.prototype.setVisible = function (visible) {
        var $parent = this.getElement().parent().parent();
        visible === false ? $parent.hide() : $parent.show();
    };

    return control;
});