/// <reference path="../Control.js" />

/// <reference path="../Control.js" />
cb.controls.widget("Tiles", function (controlType) {
    var control = function (id, options) {
        cb.controls.Control.call(this, id, options);
    };
    control.prototype = new cb.controls.Control();
    control.prototype.controlType = "Tiles";

    control.prototype.setData = function (data) {
        for (var attr in data) {
            var attrUpper = attr.substring(0, 1).toUpperCase() + attr.substring(1);
            if (this["set" + attrUpper]) {
                this["set" + attrUpper](data[attr]);
            }
        }
    };

    control.prototype.setDataSource = function (dataSource) {
        debugger;
        //var $ul = $("<ul></ul>");
        for (var i = 0, len = dataSource.length; i < len; i++) {
            var itemData = dataSource[i];
            var $li = $("<li></li>").data("itemData", itemData).click(this, function (e, args) { e.data.execute('ItemClick') });
            if (itemData.image)
                $li.css("background", "url('pc/images/menu/" + itemData.image + "') no-repeat center 16px");
            if (!itemData.image)
                $li.css("background", "url('pc/images/menu/u8report.png') no-repeat center 16px");
            var $a = $("<a>" + itemData.displayName + "</a>").appendTo($li);
            var editSpan = $("<span>Edit</span>").click(this, function (e, args) { e.data.execute('EditClick')}).appendTo($li);
            var deleteSpan = $("<span>Delete</span>").click(this, function (e, args) { e.data.execute('EditClick') }).appendTo($li);
           // $li.append(content);
            this.getElement().append($li);
        }

        function handleClick(e, args) {
            var $li;
            var target = $(e.target);
            var type = 'ItemClick';
            if (target.text() == "Edit") {
                type = 'EditClick';
            }
            else if (target.text() == "Delete") {
                type = 'DeleteClick';
            }
            if (!e) $li = $defaultSelectedListItem;
            else $li = $(e.target).closest("li");
            
            if (!$li || !$li.length) return;
            //if ($li.get(0) === _lastClickItem) return;
            //_lastClickItem = $li.get(0);
            //if (e) $li.parent().trigger("itemClick", { type: "common", data: $li.data("itemData") });
                       debugger
            e.data.execute(type);
            $li.addClass("selected");
            $li.siblings().removeClass("selected");
        }
    };


    return control;
});