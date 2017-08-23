/// <reference path="../Control.js" />
cb.controls.widget("TabContent", function (controlType) {
    var control = function (id, options) {
        cb.controls.Control.call(this, id, options);
        this._set_data("chArr", new Array());
    };
    control.prototype = new cb.controls.Control();
    control.prototype.controlType = controlType;

    control.prototype.setData = function (data) {
        if (data.mode === "strip") this.initialize();
        var self = this;
        var dataSource = data.dataSource;
        if (!dataSource || dataSource.length == 0) return;
        var chArr = this._get_data("chArr");
        for (var i = 0; i < dataSource.length; i++) {
            if (dataSource[i].isSelected) {
                chArr.push(dataSource[i].content);
                this.getMenuObject(dataSource[i].content).addClass('active').siblings().removeClass('active');
                this.getContentObject(dataSource[i].content).fadeIn(150).siblings().hide();
            }
        }
    };

    control.prototype.initialize = function () {
        var $elem = this.getElement().find("[data-content]");
        var length = $elem.length;
        if (length > 0) {
            length = length > 3 ? length : 3;
            $elem.each(function () {
                $(this).css("width", parseFloat(98 / length) + "%");
            });
        }
    };

    control.prototype.getValue = function () {
        return this.getElement().find(".active").attr('data-content');
    };

    control.prototype.getMenuObject = function (val) {
        return this.getElement().find("[data-content=\"" + val + "\"]");
    };

    control.prototype.getContentObject = function (val) {
        return this.tabContain().filter("[data-content=\"" + val + "\"]");
    };

    control.prototype.setActive = function (val) {
        var tab = this.getMenuObject(val);
        tab.addClass('active').siblings().removeClass('active');
    };

    control.prototype.tabContain = function () {
        return $("div[data-related='" + this._get_data("propertyName") + "']");
    };

    control.prototype.on = function (eventName, func, context) {
        var me = this;
        if (eventName.indexOf("on") == 0)
            eventName = eventName.substr(2);
        if (eventName !== "click") {
            this.getElement().find('.ui-btn.ui-text').on(eventName, function () {
                func.call(context, me.getValue());
            });
        }
        else {
            this.getElement().find('.ui-btn.ui-text').on(eventName, function (e) {
                var tabMenu = $(this);
                tabMenu.addClass('active').siblings().removeClass('active');
                var datacontent = tabMenu.attr("data-content");
                var tabContent = me.getContentObject(datacontent);
                tabContent.fadeIn(0).siblings().hide();

                if (tabMenu.attr('data-remote') == 'true')
                    cb.route.loadView(tabContent, datacontent);
                if (datacontent.indexOf('.') < 0)
                    func.call(context, me.getValue());
            });
        }
    };

    control.prototype.un = function (eventName) {
        if (eventName.indexOf("on") == 0) {
            eventName = eventName.substr(2);
        }
        this.getElement().unbind(eventName);
    };


    control.prototype.setchHash = function (val) {
        var index = -1;
        var chArr = this._get_data("chArr");
        for (var i = 0; i < chArr.length; i++) {
            if (chArr[i] == val)
                index = i;
        }
        if (index < 0) {
            chArr.push(val);
            return false;
        }
        else
            return true;
    };

    return control;
});