cb.controls.widget("DropDownButton", function (controlType) {
    var control = function (id, options) {
        cb.controls.Control.call(this, id, options);
        var menuList = [];//二级菜单ID list
        this._set_data("menuList", menuList);
        var $container = this.getElement().children().last();
        $(document).on("click.bs.dropdownbutton.data-api", function (e) {
            $container.hide();
        });
        $container.on("click", this, function (e, args) {
            var disabled = e.data._get_data("disabled");
            if (disabled) return;
            if (e.data.getValue(e) != "menuBtn")
            {
                var menuList = e.data._get_data("menuList");
                for (var i = 0, j = menuList.length; i < j; i++) {
                    $("#" + menuList[i]).hide();
                }
                e.data.execute("click", e.data.getValue(e));
            }
        });
    };
    control.prototype = new cb.controls.Control();
    control.prototype.controlType = controlType;

    control.prototype.setData = function (data) {
        for (var attr in data) {
            var attrUpper = attr.substring(0, 1).toUpperCase() + attr.substring(1);
            if (attr == "dataSource") continue;
            if (this["set" + attrUpper]) this["set" + attrUpper](data[attr]);
        }
        var dataSource = data["dataSource"];
        if (dataSource) {
            this.Init(dataSource.length);
            this.setDataSource(dataSource);
        }
    };

    control.prototype.getValue = function (e) {
        var e = e || window.event;
        if (!e) return;
        var $li = $(e.target).closest("li");
        if ($li)
            return $li.data("value");
        else
            return null;
    };

    control.prototype.Init = function (val) {
        var me = this;
        this.getElement().children().click(this, function (e, args) {
            var disabled = e.data._get_data("disabled");
            if (disabled) return;
            var e = e || window.event;
            var $container = me.getElement().children().last();
            $container.css("top", e.pageY + 10);
            $container.css("left", e.pageX - 20);
            $container.toggle();
            e.stopPropagation();
        });
        if (val > 0)
            this.getElement().children().last().css("height", val * 35);
    };
    /**data的数据格式如下： "name": "","category":"", "default": , "value": "columnSet", "type": "popPageBtn", "text": "栏目"
    * name : menuButton 的名称  menuID 按钮的唯一标识
    * category: 对菜单按钮进行分组显示
    * default：true or false 表示当前的button 是否默认被选中
    * value ： button所携带的值（所携带的操作）
    * type: 指定button的类型，目前下拉按钮控件仅支持如下三种类型：popPageBtn 表示弹出框操作，normalBtn 正常按钮(表示复选按钮)
    *       menuBtn 子按钮组，可包含二级菜单
    * text：当前按钮在界面显示的名称
    * 这里面着重要说明一下二级菜单（menuBtn）：
    * 每个menuBtn可以包含多个normalBtn，当鼠标悬浮在menuBtn时在当前的按钮右侧展现一个新的按钮组列表以供选择
    * 注：如果后期需要支持多级菜单，则可以将setDataSource内部结构进行调整将其写成递归
    */

    control.prototype.setDataSource = function (data) {
        this.getElement().children().last().empty();
        for (var i = 0; i < data.length; i++) {
            var value = data[i].value;
            var text = data[i].text;
            var type = data[i].type;
            var name = data[i].name;
            var defualtValue = data[i].default;
            var $li = $("<li></li>");
            switch(type)
            {
                case "popPageBtn":
                    $li.data("value", value).append("<span>" + text + "</span>");
                    break;
                case "checkBoxBtn":
                    if (defualtValue)
                    {
                        $li.data("value", value).append("<span >" + text + "</span><span style='float:right;' ><img id='" + value + "' status='1' src='./pc/images/set-select.png'></img>&nbsp;&nbsp;</span>");
                    } else {
                        $li.data("value", value).append("<span >" + text + "</span><span style='float:right;' ><img id='" + value + "' status='0' src='./pc/images/set-unselect.png'></img>&nbsp;&nbsp;</span>");
                    }
                    break;
                case "menuBtn":
                    $li.data("value", "menuBtn").append("<span >" + text + "</span><span  style='float:right;'><img src='./pc/images/arrow-r.png' />&nbsp;&nbsp;</span>");
                    $subMenu = this.createMenu(name, value);
                    $li.append($subMenu);
                    break;
                default:
                    $li.data("value", value).append("<span>" + text + "</span>");
            }
            $li.attr("menuID", name);
            $li.attr("number", i);/**number属性指明当前按钮属于主菜单上的第几个按钮，用于控制二级菜单的弹出位置*/
            $li.attr("type",type);
            $li.bind("mouseover", this,this.showSubMenu); /**默认情况下对主菜单上的所有按钮添加mouseover事件 */
            if (i > 0) {
                if (data[i].category != data[i - 1].category)
                    $li.css("border-top", "1px solid #CCC");
            }
            this.getElement().children().last().append($li);
        }
    };
    control.prototype.showSubMenu = function (control) {
        var menuList = control.data._get_data("menuList");
        var $li = $(this);
        var menuID = $li.attr("menuID");
        var number = parseInt($li.attr("number"));
        for (var i = 0, j = menuList.length; i < j; i++) {
            if (menuList[i] != menuID) {
                $("#" + menuList[i]).hide();
            }
        }
        var type = $li.attr("type");
        if (type == "menuBtn")
        {
            var $submenu = $("#" + menuID);
            var obj = $(this);
            var offset = obj.offset();
            var width = obj.width();
            var height = obj.height();
            var top = offset.top;
            var left = offset.left;
            $submenu.css({ "position": "absolute", "left": width + 15, "top": height * number, "z-index": 1000 });
            $submenu.slideDown("normal");
        }
    };
    /**目前只支持到二级菜单*/
    control.prototype.createMenu = function (menuID, val) {
        var style = {
            "border": "1px solid rgba(0, 0, 0, .15)",
            "border-left": "0px",
            "border-radius": "4px",
            "text-align": "left",
            "line-height": "20px",
            "font-size": "12px",
            "font-weight": "bold",
            "z-index": "-1",
            "display": "none",
            "padding-left":"5px",
            "width": "150px",
            "height":"130px",
            "background-color": "#fff",
            "box-shadow": "0 6px 12px rgba(0, 0, 0, .175)"
        };
        $div = $("<div id=" + menuID + " ></div>");
        var menuList = this._get_data("menuList");
        menuList.push(menuID);
        $div.css(style);
        $ul = $("<ul style='list-style: none;padding:10px; margin-left:-1px;margin-top:0px;'></ul>");
        for (var i = 0, j = val.length; i < j; i++) {
            var value = val[i].value;
            var text = val[i].text;
            var type = val[i].type;
            var name = val[i].name;
            var defaultValue = val[i].default;
            var $li = $("<li  style='padding-left:0px;width:120px;' type='subMenu_" + type + "'></li>");
            if (defaultValue)
            {
                $li.data("value", value).append("<span>" + text + "</span><span style='float:right;' ><img id='" + value + "' status='0' src='./pc/images/set-select.png'></img>&nbsp;&nbsp;</span>");
            } else {
                $li.data("value", value).append("<span>" + text + "</span><span style='float:right;' ><img id='" + value + "' status='0' src='./pc/images/set-unselect.png'></img>&nbsp;&nbsp;</span>");
            }
            $ul.append($li);
        }
        $div.append($ul);
        return $div;
    };
    control.prototype.setDisabled = function (val) {
        this.getElement().attr("disabled", val);
        this._set_data("disabled", val);
    };

    control.prototype.getDisabled = function (val) {
        return this._get_data("disabled");
    };

    return control;
});