cb.controls.widget("ListBox", function (controlType) {
    var control = function (id, options) {
        cb.controls.ListControl.call(this, id, options);
    };
    control.prototype = new cb.controls.ListControl();
    control.prototype.controlType = "ListControl";

    control.prototype.setFields = function (fields) {
        this._set_data("fields", fields);
    };

    control.prototype.setDataSource = function (dataSource) {
        if (!dataSource || !cb.isArray(dataSource)) return;
        this.getElement().empty();
        var fields = this._get_data("fields");
        var valueField = fields && fields["valueField"]||"value";
        var textField = fields && fields["textField"]||"text";
        var $container = $("<div class='cube-left-menu'></div>");
        var $li;
        dataSource.each(function (itemData) {
            $li = $("<li><span>" + itemData[valueField] + " " + itemData[textField] + "</span></li>").data("itemData", itemData).appendTo($container);
            $li.click(this, function (e, args) {
                $(".cube-left-menu").children("li").removeClass("selected");
                $(".cube-left-menu").children("li").children("span").removeClass("selected");
                $(this).addClass("selected");
                $(this).children("span").addClass("selected");
                e.data.handleItemClick($(this).data("itemData"));
            });
        }, this);
        $container.appendTo(this.getElement());
    };

    return control;
});