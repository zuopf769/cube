/// <reference path="../ListControl.js" />
cb.controls.widget("UpgradeListBox", function (controlType){
    var control = function (id, options) {
        cb.controls.ListControl.call(this, id, options);
    };
    control.prototype = new cb.controls.ListControl();
    control.prototype.controlType = "ListControl";

    control.prototype.setData = function (data) {
        for (var attr in data) {
            var attrUpper = attr.substring(0, 1).toUpperCase() + attr.substring(1);
            if (attrUpper == "DataSource") continue;
            if (this["set" + attrUpper]) this["set" + attrUpper](data[attr]);
        }
        this.setDataSource(data["dataSource"]);
    };

    control.prototype.setValue = function (data) {
        this.getElement().val(data);
    }
    control.prototype.setDisplayMode = function (mode) {
        this._set_data("displayMode", mode);
    };

    control.prototype.setDataSource = function (dataSource) {
        if (!dataSource || !cb.isArray(dataSource)) return;
        var mode = this._get_data("displayMode");

        switch (mode) {
            case "addApp":
                if (dataSource.class) { }
                else {
                    $(".same").remove();
                }
                this.setValue({ "data": {},"bool":false});
                if (this.getElement().children(".same").length == 0) {
                    for (var i = 0; i < dataSource.length; i++) {
                        var content = dataSource[i];
                        var same = document.createElement("div");
                        same.className = "same";
                        var module = document.createElement("span");
                        module.className = "module"
                        module.innerHTML = content.disPlayName;
                        var ul = document.createElement("ul");
                        for (var j = 0; j < content.children.length; j++) {
                            var li = document.createElement("li");
                            var list = content.children[j];
                            var item = document.createElement("span");
                            item.className = "item";
                            item.innerHTML = list.disPlayName;
                            li.appendChild(item);


                            var flag = document.createElement("span");
                            flag.className = "flag";
                            flag.innerHTML = "安装";
                            li.appendChild(flag);
                            var cur = this;
                            $(flag).click({ control: this, list: list }, function (e, args) {
                                var condition = e.data.list.moduleConfig.hm.requiredmodule;
                                function checkElse(val) {
                                    var bool = false;
                                    for (var i = 0; i < $(".flag").length; i++) {
                                        if ($(".flag").eq(i).html() == "正在安装") {
                                            var bool = true;
                                            break;
                                        }
                                        else {
                                        };
                                    };
                                    return bool;
                                };
                                    switch ($(this).html()) {
                                        case "安装":
                                            if (checkElse()) {
                                                alert("其他应用正在安装，请稍后");
                                            }
                                            else if (condition == null) {
                                                e.data.control.handleItemClick({ "data": e.data.list, "bool": true, "condition": condition });
                                                $(this).css({ "border-width": "0px", "color": "#E75656" }).html("正在安装");
                                            }
                                            else {
                                                e.data.control.handleItemClick({ "data": e.data.list, "bool": true,"condition":condition}); //跳转到后台服务判断依赖关系
                                            };
                                            break;
                                        case "正在安装":
                                            break;
                                        case "安装失败":
                                            break;
                                    };
                                 
                            });

                            var newversion = document.createElement("span");
                            newversion.className = "newversion";
                            newversion.innerHTML = "";
                            li.appendChild(newversion);

                            ul.appendChild(li);
                        };
                        same.appendChild(module);
                        same.appendChild(ul);
                        this.getElement().append(same);
                    };
                }
                else {
                    return;
                }
                    break;

            case "systemUpdate":
                $(".same-update").remove();
                    for (var i = 0; i < dataSource.length; i++) {
                        var content = dataSource[i];
                        var same = document.createElement("div");
                        same.className = "same-update";
                        var module = document.createElement("span");
                        module.className = "module"
                        module.innerHTML = content.disPlayName;
                        var ul = document.createElement("ul");
                        for (var j = 0; j < content.children.length; j++) {
                            var li = document.createElement("li");
                            var list = content.children[j];
                            var item = document.createElement("span");
                            item.className = "item-update";
                            item.innerHTML = list.disPlayName;
                            li.appendChild(item);

                            var oldversion = document.createElement("span");
                            oldversion.className = "oldversion-update";
                            oldversion.innerHTML = list.moduleConfig.hm.code;
                            li.appendChild(oldversion);

                            var flag = document.createElement("span");
                            flag.className = "flag-update";
                            flag.innerHTML = "NEW";
                            li.appendChild(flag);

                            var newversion = document.createElement("span");
                            newversion.className = "newversion-update";
                            newversion.innerHTML = list.moduleConfig.hm.version;
                            li.appendChild(newversion);

                            ul.appendChild(li);
                        };
                        same.appendChild(module);
                        same.appendChild(ul);
                        this.getElement().append(same);
                    };
                break;

          default:
                break;
        
    };//对应swicth；
        
    };
    control.prototype.setUpdateRow = function (data) {                  //setXXX中XXX首字母应该大写
        if (!data || !cb.isArray(data)) return;
        var length = $(".oldversion-update").length;
        for (var i = 0; i < length; i++) {
            if (data.some(function (item, index, Array) {
            return item == $(".oldversion-update").eq(i).html();
            })) {
                $(".flag-update").eq(i).html("已安装").css({
                    "color": "black",
                    "border-color": "RGB(187,203,223)",
                    "backgroundColor": "rgb(242,242,242)"
                });
            }
            else {
                $(".flag-update").eq(i).html("失败");
            };
        }
    };
    control.prototype.setShadow = function (data) {                  //setXXX中XXX首字母应该大写
        if (data) {
            $("#shadow").show();
            $("#minimize").show();
        }
        else {
            $("#shadow").hide();
            $("#minimize").hide();
        }
    };
    control.prototype.setResetData = function (dataSource) {
        $(".same").remove();
            for (var i = 0; i < dataSource.length; i++) {
                var content = dataSource[i];
                var same = document.createElement("div");
                same.className = "same";
                var module = document.createElement("span");
                module.className = "module"
                module.innerHTML = content.userObject.name;
                var ul = document.createElement("ul");
                for (var j = 0; j < content.children.length; j++) {
                    var li = document.createElement("li");
                    var list = content.children[j];
                    var item = document.createElement("span");
                    item.className = "item";
                    item.innerHTML = list.userObject.name;
                    li.appendChild(item);

                    var newversion = document.createElement("span");
                    newversion.className = "oldversion";
                    newversion.innerHTML = list.userObject.code;
                    li.appendChild(newversion);

                    ul.appendChild(li);
                };
                same.appendChild(module);
                same.appendChild(ul);
                this.getElement().append(same);
            };
    };


    control.prototype.setComplete = function (val) {
        if (val == true) {
            $("#cancle,#confirm").hide();
            $("#complete").show();
        }
        else {

        };
    };
    control.prototype.setClear = function (val) {
        if (val==true) {
            $(".same-update").remove();
            $("#cancle,#confirm").show();
            $("#complete").hide();
        }
        else {
        };
    };

    control.prototype.setBack = function (val) {
        for (var i = 0; i < $(".flag").length; i++) {
            if ($(".flag").eq(i).html() == "正在安装") {
                $(".flag").eq(i).html(val);
            }
        }
    };
    control.prototype.setDoInstall = function (val) {
        for (var i = 0; i < $(".item").length; i++) {
            if ($(".item").eq(i).html() == val) {
                $(".flag").eq(i).css({ "border-width": "0px", "color": "#E75656" }).html("正在安装");
            }
        }
    }; 
    return control;
});