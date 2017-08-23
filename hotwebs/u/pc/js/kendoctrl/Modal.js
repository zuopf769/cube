cb.controls.widget("Modal", function (controlType) {
    var control = function (id, options) {
        cb.controls.Control.call(this, id, options);
        this.initialize(options);
    };
    control.prototype = new cb.controls.Control();
    control.prototype.controlType = controlType;

    control.prototype.initialize = function (options) {
        var defaultOptions = {
            visible: false,
            modal: true,
            width: "60%"
        };
        this.getElement().kendoWindow(cb.extend(defaultOptions, options));
    };

    control.prototype.setTitle = function (title) {
        var dialog = this.getElement().data("kendoWindow");
        dialog.title(title);
    };

    control.prototype.showModal = function () {
        var dialog = this.getElement().data("kendoWindow");
        dialog.center();
        dialog.open();
    };

    control.prototype.hideModal = function () {
        var dialog = this.getElement().data("kendoWindow");
        dialog.close();
    };

    return control;
});