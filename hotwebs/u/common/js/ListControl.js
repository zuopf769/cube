cb.controls.widget("ListControl", function (controlType) {
    var control = function (id, options) {
        cb.controls.Control.call(this, id, options);
    };
    control.prototype = new cb.controls.Control();
    control.prototype.controlType = controlType;

    control.prototype.handleItemClick = function (itemData) {
        this.execute("itemClick", itemData);
    };

    control.prototype.handleValueChange = function (itemData) {
        this.execute("itemClick", itemData);
    };

    return control;
});