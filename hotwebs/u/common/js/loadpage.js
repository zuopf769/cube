/// <reference path="../Control.js" />
cb.controls.widget("LoadPage", function (controlType) {
    var _isPageLoaded = true;
    var control = function (id, options) {
        cb.controls.Control.call(this, id, options);
        //this._set_data("chArr", new Array());
    };
    control.prototype = new cb.controls.Control();
    control.prototype.controlType = controlType;

    control.prototype.setData = function (data) {
        if (data.loadPage)
            this.setLoadPage(data.loadPage);
    };

    control.prototype.setLoadPage = function (params) {
        var data = this.getElement().get(0).dataset;
        if (!data) return;
        var remote = data.remote;
        var content = data.content;
        if (remote == "true" && content != null)
            this.setAddPage({ url: content, params: params });
    };

    control.prototype.getValue = function () {
        return this.getElement().children(".active-page");
    };

    control.prototype.getContentItem = function (val) {
        tab.addClass('active-page').siblings().removeClass('active');
    };

    control.prototype.setActive = function (val) {
        var item = this.getElement().children('[data-page=' + val + ']');
        if (item.children().length) {
            //this.getValue().removeClass("active-page");
            item.addClass("active-page");
        } else {
            var new_item = $('<div data-page=' + val + '></div>');
            this.getElement().append(new_item);
            cb.route.loadView(val, new_item);
        }
    };

    control.prototype.getContentList = function () {
        return this.getElement().children('[data-page]');
    };

    control.prototype.on = function (eventName, func, context) {

    };

    control.prototype.un = function (eventName) {
        if (eventName.indexOf("on") == 0) {
            eventName = eventName.substr(2);
        }
        this.getElement().unbind(eventName);
    };

    control.prototype.setAddPage = function (val) {
        if (!val || !val.url) return;
        this.getElement().children(".active-page").removeClass("active-page").hide();
        var appParams = cb.route.getAppParamsFromUrl(val.url);
        if (!appParams) return;
        cb.extend(appParams.params, val.params);
        var item = this.getElement().children('[data-page="' + appParams.appId + '"]');
        if (item.length) {
            item.addClass("active-page").show();
        } else {
            item = $('<div data-page="' + appParams.appId + '"></div>');
            item.addClass("active-page");
            this.getElement().append(item);
        }
        cb.route.loadView(item, appParams.appId, appParams.params);
    };

    control.prototype.innerLoadView = function (new_item, val) {
        if (!_isPageLoaded) {
            setTimeout(this.innerLoadView, 100, new_item, val);
            return;
        }
        _isPageLoaded = false;
        cb.route.loadView(new_item, val.url, { callback: function () {
            _isPageLoaded = true;
        }
        });
    };

    return control;
});