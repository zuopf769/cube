/// <reference path="../Control.js" />
cb.controls.widget("ImageButton", function (controlType) {
    var control = function (id, options) {
        cb.controls.Control.call(this, id, options);
        var elem = this.getElement().get(0);
        elem.addEventListener("touchstart", function (e, args) {
            $(e.target).closest("div").css("background-color", "#E4E4E4");
        }, false);
        elem.addEventListener("touchend", function (e, args) {
            $(e.target).closest("div").css("background-color", "#fff");
        }, false);
        this.getElement().on("click", this, function (e, args) {
            var disabled = e.data._get_data("disabled");
            if (disabled) return;
            e.data.execute("click");
        });
    };
    control.prototype = new cb.controls.Control();
    control.prototype.controlType = controlType;

    control.prototype.getValue = function () {
        return this.getElement().children("span:last-Child").text();
    };

    control.prototype.setValue = function (val) {
        if (val == "" || val == null) return;
        this.getElement().children("span:last-Child").text(val);
    };

    control.prototype.setIcon = function (val) {
        if (val == "") return;
        this.getElement().children("span:first-Child").attr("class",val);
    };

    control.prototype.getIcon = function () {        
        return this.getElement().children("span:first-Child").attr("class");
    };

    control.prototype.setDisabled = function (val) {
        this.getElement().attr("disabled", val);
        this._set_data("disabled", val);
    };

    control.prototype.getDisabled = function (val) {
        return this._get_data("disabled");
    };

    control.prototype.setModel = function (val) {
        switch (val) {
            case "no-image":
                this.getElement().children("span:first-child").css("display", "none");
                break;
            case "no-text":
                this.getElement().children("span:last-child").css("display", "none");
                break;
            case "image-text":
                this.getElement().children().css("display", "block");
                break;
        }
    };

    control.prototype.getVisible = function () {
       
    };
    control.prototype.setVisible = function (visible) {
        this.getElement().css("display", visible ? "block" : "none");
    };

    return control;
});