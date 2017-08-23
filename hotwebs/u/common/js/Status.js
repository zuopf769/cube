/// <reference path="../Control.js" />
cb.controls.widget("Status", function (controlType) {
    var control = function (id, options) {
        cb.controls.Control.call(this, id, options);
    };
    control.prototype = new cb.controls.Control();
    control.prototype.controlType = controlType;

    control.prototype.setValue = function (val) {
        if (val == null) return;
        var data = this._get_data("data");
        if (!data) return;
        var item = data[val];
        if (!item) return;
        var html = "<span class='img-" + item["name"] + "'></span><span>" + item["text"] + "</span>";
        this.getElement().html(html);
    };

    control.prototype.setData = function (data) {
        if (!data || !data.dataSource || !data.dataSource.length) return;
        this.setDataSource(data.dataSource);
        var attrUpper;
        for (var attr in data) {
            if (attr === "dataSource") continue;
            attrUpper = attr.substring(0, 1).toUpperCase() + attr.substring(1);
            if (this["set" + attrUpper]) this["set" + attrUpper](data[attr]);
        }
    };

    control.prototype.setDataSource = function (dataSource) {
        var data = {};
        for (var i = 0, len = dataSource.length; i < len; i++) {
            var itemData = dataSource[i];
            data[itemData["value"]] = { "name": itemData["name"], "text": itemData["text"] };
        }
        this._set_data("data", data);
    };

    return control;
});