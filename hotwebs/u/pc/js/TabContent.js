/// <reference path="../Control.js" />

cb.controls.widget("TabContent", function (controlType) {
    var control = function (id, options) {
        cb.controls.Control.call(this, id, options);
        this.handleClick();
    };
    control.prototype = new cb.controls.Control();
    control.prototype.controlType = controlType;

    control.prototype.handleClick = function () {
        this.getElement().click(this, function (e, args) {
            var mode = e.data._get_data("mode");
            switch (mode) {
                case "application":
                    e.data.handleClickApplication(e);
                    break;
                case "slide":
                    e.data.handleClickSlide(e);
                    break;
                default:
                    e.data.handleClickDefault(e);
                    break;
            };
        });
    };

    control.prototype.setData = function (data) {
        if (data.mode)
            this._set_data("mode", data.mode);
        switch (data.mode) {
            case "application":
                break;
            case "slide":
                this.setDataSlide(data);
                break;
            default:
                this.setDataDefault(data);
                break;
        };
    };

    // #region mode = "application"

    control.prototype.handleClickApplication = function (e) {
        var tabMenu = $(e.target).closest("li");
        var dataContent = tabMenu.attr("data-content");
        var tabContent = e.data.getContentObject(dataContent);
        e.data.setActiveApplication(dataContent, tabMenu, tabContent);
    };

    control.prototype.setAddTab = function (tabInfo) {
        if (!tabInfo || !tabInfo.index) return;
        tabInfo.title = tabInfo.title || "";
        var $elem = this.getElement();
        var $related = $elem.parent().next();
        var $header = $('<li class="ui-text" data-content="' + tabInfo.index + '" data-remote="true"><span>' + tabInfo.title + '</span></li>').appendTo($elem);
        var $span = $("<span>x</span>").click({ control: this, tabInfo: tabInfo }, function (e, args) {
            var canClose = e.data.control.execute("beforeClose", e.data.tabInfo.index);
            if (canClose === false) return;
            var tabMenu = $(e.target).closest("li");
            var dataContent = tabMenu.attr("data-content");
            var tabContent = e.data.control.getContentObject(dataContent);
            e.data.control.hide(dataContent, tabMenu, tabContent);
            e.stopPropagation();
        }).appendTo($header);
        var $content = $('<div style="width:100%;height:100%;min-height:500px;" class="clearfix ui-form-contain" data-content="' + tabInfo.index + '" data-remote="true"></div>').appendTo($related);
        this.setActiveApplication(tabInfo.index, $header, $content);
        tabInfo.$header = $header;
        tabInfo.$content = $content;
        tabInfo.control = this;
    };

    control.prototype.hide = function (dataContent, $header, $content) {
        $header.hide();
        $content.hide();
        var $active = this.getElement().find(".active");
        if ($active.length && $active.get(0) !== $header.get(0))
            return;
        var historyState = this._get_data("historyState");
        var lastDataContent = historyState[dataContent];
        var $tabMenu = this.getMenuObject(lastDataContent);
        var $tabContent = this.getContentObject(lastDataContent);
        this.setActiveApplication(lastDataContent, $tabMenu, $tabContent);
    };

    control.prototype.setActiveApplication = function (dataContent, $header, $content) {
        this.setActive($header);
        if ($header.is(":hidden"))
            $header.show().appendTo(this.getElement());
        $content.show().siblings().hide();
        this.setHistoryState(dataContent);
    };

    control.prototype.setHistoryState = function (val) {
        var historyState = this._get_data("historyState");
        if (!historyState) {
            historyState = {};
            this._set_data("historyState", historyState);
        }
        historyState[val] = historyState["lastSelected"] || "baseinfo";
        historyState["lastSelected"] = val;
    };

    // #endregion

    // #region mode = "slide"

    control.prototype.handleClickSlide = function (e) {
        var tabMenu = $(e.target).closest("li");
        e.data.setActive(tabMenu);
        var itemData = tabMenu.data("itemData");
        if (itemData)
            e.data.execute("click", itemData);
    };

    control.prototype.setDataSlide = function (data) {
        var $_co_container = this.getElement().children(".cube-bar-close-container");
        $(document).on("click.bs.tabcontent.data-api", function (e) {
            $_co_container.hide();
        });
        var $elem = this.getElement();
        if (!$elem.hasClass("navbar-pc-slide"))
            $elem.addClass("navbar-pc-slide");
        if (data.fields)
            this._set_data("fields", data.fields);
        if (data.dataSource)
            this.setDataSource(data.dataSource);
    };

    control.prototype.setDataSource = function (dataSource) {
        var mode = this._get_data("mode");
        if (mode !== "slide") return;
        if (!dataSource || !cb.isArray(dataSource) || !dataSource.length) return;
        var fields = this._get_data("fields");
        if (!fields) return;
        var $_op_container = this.getElement().children(".cube-bar-open-container");
        $_op_container.empty();
        var $_co_container = this.getElement().children(".cube-bar-close-container");
        $_co_container.empty();
        var maxCount = 4;
        var $items = {};
        var $li;
        for (var i = 0, len = dataSource.length; i < len; i++) {
            var itemData = dataSource[i];
            if (i < maxCount)
                $li = $("<li class='ui-text'></li>").data("itemData", itemData).appendTo($_op_container);
            else
                $li = $("<li class='ui-text'></li>").data("itemData", itemData).appendTo($_co_container);
            var text = itemData[fields["textField"]];
            if (text != null)
                $li.html("<span>" + text + "</span><span></span>");
            $items[itemData[fields["valueField"]]] = $li;
            if (itemData.isSelected)
                $li.addClass('active');
        }
        if (dataSource.length > maxCount) {
            var $li = $("<li class='ui-text'><div data-controltype='ImageButton' class='tab-else'><span class='else-icon'></span><span style='display:none;'></span></div></li>");
            $li.on("click", function (e) {
                $_co_container.toggle();
                e.stopPropagation();
            });
            $li.appendTo($_op_container)
        }
        if ($_co_container.children().length > 1)
            $_co_container.css("height", $_co_container.children().length * 38);
        this._set_data("$items", $items);
    };

    control.prototype.setDataCount = function (dataCount) {
        if (!dataCount || dataCount.length == 0) return;
        var fields = this._get_data("fields");
        if (!fields) return;
        var $items = this._get_data("$items");
        if (!$items) return;
        var $li, $span;
        for (var i = 0, len = dataCount.length; i < len; i++) {
            var dataCountItem = dataCount[i];
            $li = $items[dataCountItem[fields["valueField"]]];
            $span = $li.children("span:last-child");
            var count = dataCountItem["dataCount"];
            if (count) $span.html(count);
            else $span.html(0);
        }
    };

    // #endregion

    // #region mode = "default"

    control.prototype.handleClickDefault = function (e) {
        var tabMenu = $(e.target).closest("li");
        var dataContent = tabMenu.attr("data-content");
        var tabContent = e.data.getContentObject(dataContent);
        e.data.setActiveDefault(tabMenu, tabContent);
        var hasLoaded = e.data.hasLoaded(dataContent);
        if (hasLoaded || tabMenu.attr("data-remote") !== "true") return;
        var appParams = cb.route.getAppParamsFromUrl(dataContent);
        cb.route.loadView(tabContent, appParams.appId, appParams.params);
    };

    control.prototype.setDataDefault = function (data) {
        var loadedContent = [];
        this._set_data("loadedContent", loadedContent);
        var dataSource = data.dataSource;
        if (!dataSource || !cb.isArray(dataSource) || !dataSource.length) return;
        for (var i = 0; i < dataSource.length; i++) {
            if (dataSource[i].isSelected) {
                loadedContent.push(dataSource[i].content);
                this.setActiveDefault(this.getMenuObject(dataSource[i].content), this.getContentObject(dataSource[i].content));
            }
        }
    };

    control.prototype.setActiveDefault = function ($header, $content) {
        this.setActive($header);
        $content.show().siblings().hide();
    };

    control.prototype.hasLoaded = function (dataContent) {
        var loadedContent = this._get_data("loadedContent");
        if (!loadedContent) return;
        var index = loadedContent.findIndex(function (item) {
            return item === dataContent;
        });
        if (index < 0) {
            loadedContent.push(dataContent);
            return false;
        }
        return true;
    };

    // #endregion

    control.prototype.getValue = function () {
        return this.getElement().children(".active").attr('data-content');
    };

    control.prototype.getMenuObject = function (val) {
        return this.getElement().children("[data-content=\"" + val + "\"]");
    };

    control.prototype.getContentObject = function (val) {
        return this.tabContain().children("[data-content=\"" + val + "\"]");
    };

    control.prototype.tabContain = function () {
        return this.getElement().parent().siblings("div[data-related='" + this._get_data("propertyName") + "']");
    };

    control.prototype.setActive = function ($header) {
        $header.addClass("active").siblings().removeClass("active");
    };

    return control;
});