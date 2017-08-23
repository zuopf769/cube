cb.controls.widget("SchemeList", function (controlType) {
    var control = function (id, options) {
        cb.controls.ListControl.call(this, id, options);
    };
    control.prototype = new cb.controls.ListControl();
    control.prototype.controlType = "ListControl";

    control.prototype.setDataSource = function (dataSource) {
        if (!dataSource || !cb.isArray(dataSource)) return;
        this.getElement().children().remove();
        var self = this;
        for (var i = 0; i < dataSource.length; i++) {
            var $div = $("<div class=\"ui-list row\"></div>").data("itemData", dataSource[i]).appendTo(this.getElement());
            
            var $left = $("<div class=\"ui-left col-lg-6\"><div><span class=\"move-icon\"></span><span>" + dataSource[i].name + "</span></div></div>").appendTo($div);

            var $right = $("<div class=\"ui-right col-lg-6\"></div>").appendTo($div);
            var $tbContainer = $("<div data-controltype=\"ToolBar\" class=\"cube-bar-modelicon scheme\"></div>").appendTo($right);
            var array = [{ name: "changeAction", css: "private-icon" }, { name: "editAction", css: "edit-icon" }, { name: "deleteAction", css: "delete-icon" }];
            for (var j = 0; j < array.length; j++) {
                var css = j == 0 ? (dataSource[i].isprivate ? "private-icon":"public-icon" ) : array[j].css;
                var $li = $("<li><div data-propertyname=\"" + array[j].name + "\" data-controltype=\"ImageButton\"><span class=\"" + css + "\"></span><span></span></div></li>")
                    .data("itemData", dataSource[i]).appendTo($tbContainer);
                $li.on("click",this, function (e) {
                    var args = {
                        queryschemeid: $(this).data("itemData").queryschemeID,
                        isprivate: $(this).data("itemData").isprivate,
                        action: $(this).children().attr('data-propertyname')
                    };
                    e.data.handleItemClick(args);
                });
            }
            
            if (dataSource[i].issystem) {
                $right.hide();
            }
        };
       
    };
    return control;
});