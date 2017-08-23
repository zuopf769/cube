(function ($) {
    $.extend(true, window, {
        "cb": {
            "route": {
                "initViewPart": initViewPart,
                "loadViewPart": loadViewPart,
                "hideViewPart": hideViewPart,
                "toggleViewPart": toggleViewPart,
                "loadTabViewPart": loadTabViewPart,
                "hideTabViewPart": hideTabViewPart,
                "loadPageViewPart": loadPageViewPart,
                "hidePageViewPart": hidePageViewPart,
                "setPageViewPartTitle": setPageViewPartTitle,
                "loadArchiveViewPart": loadArchiveViewPart,
                "loadArchiveCurrentViewPart": loadArchiveCurrentViewPart,
                "hideArchiveCurrentViewPart": hideArchiveCurrentViewPart,
                "getViewPartParams": getViewPartParams,
                "loadView": loadView,
                "openWin": openWin,
                "getViewModelName": getViewModelName,
                "subscribeMessage": subscribeMessage,
                "unsubscribeMessage": unsubscribeMessage,
                "notifyMessage": notifyMessage
            }
        }
    });

    var _messages = {};

    function subscribeMessage(viewModel, msgId, callback, context) {
        var viewModelName = viewModel.getModelName();
        if (!viewModelName) {
            cb.console.error("subscribeMessage: viewModelName为空");
            return;
        }
        if (!msgId) {
            cb.console.error("subscribeMessage: msgId为空");
            return;
        }
        if (!callback) {
            cb.console.error("subscribeMessage: callback为空");
            return;
        }
        context = context || this;
        _messages[viewModelName] = _messages[viewModelName] || {};
        _messages[viewModelName][msgId] = _messages[viewModelName][msgId] || [];
        _messages[viewModelName][msgId].push({ callback: callback, context: context });
    }

    function unsubscribeMessage(viewModel, msgId, callback) {
        var viewModelName = viewModel.getModelName();
        if (!viewModelName) {
            cb.console.error("unsubscribeMessage: viewModelName为空");
            return;
        }
        if (!msgId) {
            cb.console.error("unsubscribeMessage: msgId为空");
            return;
        }
        var events = _messages[viewModelName] && _messages[viewModelName][msgId];
        if (!events || !events.length) return;
        if (!callback) {
            delete _messages[viewModelName][msgId];
        } else {
            var index = _messages[viewModelName][msgId].findIndex(function (value) {
                if (value.callback === callback)
                    return true;
            });
            if (index !== -1) {
                _messages[viewModelName][msgId].removeData(_messages[viewModelName][msgId][index]);
            }
        }
    }

    function notifyMessage(index, msgId, params) {
        if (!index) {
            cb.console.error("notifyMessage: index为空");
            return;
        }
        var items = index.split("|");
        if (items.length < 2) {
            cb.console.error("notifyMessage: index不满足规则");
            return;
        }
        if (!msgId) {
            cb.console.error("notifyMessage: msgId为空");
            return;
        }
        var tupleIndexMapping = _tupleIndexMappings[getTupleIndex(items[0], items[1])];
        var viewModelName = items.length === 3 ? tupleIndexMapping && tupleIndexMapping[items[2]] : tupleIndexMapping && tupleIndexMapping["default"];
        var events = _messages[viewModelName] && _messages[viewModelName][msgId];
        if (!events || !events.length) return true;
        var result = true;
        cb.each(events, function (event) {
            result = event.callback.call(event.context || this, params) === false ? false : result;
        });
        return result;
    }

    function initViewPart(viewModel, data) {

    }

    function loadViewPart(viewModel, appId, viewPartType, params) {
        var viewModelName = viewModel.getModelName();
        if (!viewModelName) {
            cb.console.error("loadViewPart: viewModelName为空");
            return;
        }
        if (!appId) {
            cb.console.error("loadViewPart: appId为空");
            return;
        }
        if (!viewPartType) {
            cb.console.error("loadViewPart: viewPartType为空");
            return;
        }
        var $elem = $(viewPartType);
        if ($elem.length > 1)
            $elem = $(".home-tab-content .active-tab-content " + viewPartType);
        if (!$elem.length) {
            cb.console.error("loadViewPart: viewPartType " + viewPartType + " 无效");
            return;
        }
        var animation = params && params.animation;
        var animationMode = animation && animation.mode;
        var animationDuration = animation && animation.duration || 0;
        var tuple = getTupleWhenLoad(viewModelName, appId, params && params.PK);
        if (!tuple) {
            tuple = { $elem: $elem, animationMode: animationMode, animationDuration: animationDuration, clickCount: 1, params: $.extend(true, {}, params, { parentViewModel: viewModel, appId: appId }) };
            innerLoadView(viewModelName, appId, $elem, tuple, function () {
                if ($elem[animationMode])
                    $elem[animationMode](animationDuration);
            }, params);
        }
        else {
            setTimeout(function () {
                tuple.clickCount++;
                innerRefreshView(tuple, params);
                if ($elem[animationMode]) $elem[animationMode](animationDuration);
            }, 100);
        }
    }

    function hideViewPart(viewModel, appId, params) {
        var viewModelName = typeof viewModel === "string" ? viewModel : viewModel.getModelName();
        if (!viewModelName) {
            cb.console.error("hideViewPart: viewModelName为空");
            return;
        }
        var tuple = appId ? getTupleWhenLoad(viewModelName, appId, params && params.PK) : getTupleByViewModelName(viewModelName);
        if (!tuple) return;
        tuple.clickCount++;
        var $elem = tuple.$elem;
        var animationMode = tuple.animationMode;
        if ($elem[animationMode])
            $elem[animationMode](tuple.animationDuration);
    }

    function toggleViewPart(viewModel, appId, viewPartType, params) {
        var viewModelName = viewModel.getModelName();
        if (!viewModelName) {
            cb.console.error("toggleViewPart: viewModelName为空");
            return;
        }
        if (!appId) {
            cb.console.error("toggleViewPart: appId为空");
            return;
        }
        var tuple = getTupleWhenLoad(viewModelName, appId, params && params.PK);
        if (!tuple)
            loadViewPart(viewModel, appId, viewPartType, params);
        else {
            if (tuple.clickCount % 2 === 1)
                hideViewPart(viewModel, appId, params);
            else
                loadViewPart(viewModel, appId, viewPartType, params);
        }
    }

    function loadTabViewPart(viewModel, appId, params) {
        if (!appId) {
            cb.console.error("loadViewPart: appId为空");
            return;
        }
        var pageUrl = cb.route.getPageUrl(appId, params && params.queryString);
        var viewModelName = viewModel.getModelName();
        if (!viewModelName) {
            cb.console.error("loadViewPart: viewModelName为空");
            return;
        }
        //var portalViewModel = viewModelName === "PortalViewModel" ? viewModel : cb.cache.get("PortalViewModel");
        var portalViewModel = viewModelName === "ApplicationViewModel" ? viewModel : cb.cache.get("ApplicationViewModel");
        if (!portalViewModel || !portalViewModel.gettabMenu) {
            location.href = pageUrl;
            return;
        }
        var viewModel1 = cb.cache.get("PortalViewModel");
        viewModel1.gettabTop().set('Active', { dataContent: 'common.home.Application' });
        var tupleIndex = getTupleIndex(viewModelName, appId);
        if (params && params.PK)
            tupleIndex += "|" + params.PK;
        var tuple = getTupleWhenLoad(viewModelName, appId, params && params.PK);
        if (!tuple) {
            var tabInfo = { "index": tupleIndex, "title": params && params.title };
            portalViewModel.gettabMenu().set("addTab", tabInfo);
            tuple = { tabInfo: tabInfo, params: $.extend(true, {}, params, { parentViewModel: viewModel, appId: appId }) };
            innerLoadView(viewModelName, appId, tabInfo.$content, tuple, function () {
                var $viewPart = $(this).children("div").first();
                if (!$viewPart.length) return;
                var $text = tabInfo.$header.children("span").first();
                if ($text.length && !$text.html() && $viewPart.attr("data-title"))
                    $text.html($viewPart.attr("data-title"));
            }, params);
        }
        else {
            setTimeout(function () {
                innerRefreshView(tuple, params);
                tuple.tabInfo.control.setActiveApplication(tuple.tabInfo.index, tuple.tabInfo.$header, tuple.tabInfo.$content);
            }, 100);
        }
    }

    function hideTabViewPart(viewModel, appId, params) {
        var viewModelName = typeof viewModel === "string" ? viewModel : viewModel.getModelName();
        if (!viewModelName) {
            cb.console.error("hideViewPart: viewModelName为空");
            return;
        }
        var tuple = appId ? getTupleWhenLoad(viewModelName, appId, params && params.PK) : getTupleByViewModelName(viewModelName);
        if (!tuple) return;
        tuple.tabInfo.control.hide(tuple.tabInfo.index, tuple.tabInfo.$header, tuple.tabInfo.$content);
    }

    function loadPageViewPart(viewModel, appId, params) {
        if (!appId) {
            cb.console.error("loadViewPart: appId为空");
            return;
        }
        var viewModelName = viewModel.getModelName();
        if (!viewModelName) {
            cb.console.error("loadViewPart: viewModelName为空");
            return;
        }
        var $elem = $("[data-viewmodel='" + viewModelName + "']");
        if (!$elem.length) {
            cb.console.error("loadViewPart: [data-viewmodel='" + viewModelName + "']无效");
            return;
        }
        var tuple = getTupleWhenLoad(viewModelName, appId, params && params.PK);
        if (!tuple) {
            params = params || {};
            var options = {};
            if (params.width)
                options.width = params.width;
            if (params.height)
                options.height = params.height;
            if (params.title)
                options.title = params.title;
            if (params.modal != null)
                options.modal = params.modal;
            var $dialog = $("<div></div>").appendTo($elem);
            var dialog = new cb.controls.Modal($dialog, options);
            tuple = { dialog: dialog, params: $.extend(true, {}, params, { parentViewModel: viewModel, appId: appId }) };
            innerLoadView(viewModelName, appId, $dialog, tuple, function ($viewPart) {
                if ($viewPart && $viewPart.length)
                    dialog.setTitle($viewPart.attr("data-title"));
                dialog.showModal();
            }, params);
        }
        else {
            setTimeout(function () {
                innerRefreshView(tuple, params);
                tuple.dialog.showModal();
            }, 100);
        }
    }

    function hidePageViewPart(viewModel, appId, params) {
        var viewModelName = typeof viewModel === "string" ? viewModel : viewModel.getModelName();
        if (!viewModelName) {
            cb.console.error("hideViewPart: viewModelName为空");
            return;
        }
        var tuple = appId ? getTupleWhenLoad(viewModelName, appId, params && params.PK) : getTupleByViewModelName(viewModelName);
        if (!tuple) return;
        tuple.dialog.hideModal();
        tuple.params.parentViewModel.afterExecute("hidePageViewPart");
    }

    function setPageViewPartTitle(viewModel, appId, title) {
        if (!title) return;
        var viewModelName = typeof viewModel === "string" ? viewModel : viewModel.getModelName();
        if (!viewModelName) {
            cb.console.error("setPageViewPartTitle: viewModelName为空");
            return;
        }
        var tuple = appId ? getTupleWhenLoad(viewModelName, appId, params && params.PK) : getTupleByViewModelName(viewModelName);
        if (!tuple) return;
        tuple.dialog.setTitle(title);
    }

    function loadArchiveViewPart(viewModel, appId, params) {
        loadTabViewPart(viewModel, appId, params);
    }

    function loadArchiveCurrentViewPart(viewModel, appId, params) {
        $('.archiveList').hide();
        $('.archiveDetail').show();
        loadViewPart(viewModel, appId, ".archiveDetail", params);
    }

    function hideArchiveCurrentViewPart(viewModel) {
        $('.archiveList').show();
        $('.archiveDetail').hide();
        //hideViewPart(viewModel);
    }

    function getViewPartParams(viewModel) {
        var viewModelName = viewModel.getModelName();
        if (!viewModelName) {
            cb.console.error("getViewPartParams: viewModelName为空");
            return;
        }
        var tuple = getTupleByViewModelName(viewModelName);
        if (!tuple) return;
        return tuple.params;
    }

    function loadView(viewContainer, appId, params) {
        if (!viewContainer.length) {
            cb.console.error("loadView: viewContainer为空");
            return;
        }
        if (!appId) {
            cb.console.error("loadView: appId为空");
            return;
        }
        var viewModelName = viewContainer.closest("[data-viewmodel]").attr("data-viewmodel");
        if (!viewModelName) {
            cb.console.error("loadView: viewModelName为空");
            return;
        }
        var tuple = getTupleWhenLoad(viewModelName, appId, params && params.PK);
        if (!tuple) {
            tuple = { params: $.extend(true, {}, params, { parentViewModel: cb.cache.get(viewModelName), appId: appId }) };
            innerLoadView(viewModelName, appId, viewContainer, tuple, function () {
                if (params && params.callback) params.callback.call(this);
            }, params);
        }
        else {
            setTimeout(function () {
                innerRefreshView(tuple, params);
            }, 100);
        }
    }

    function openWin(url, title, options) {
        if (arguments.length == 0) return;
        title = title || "";
        options = options || 'height=600, width=800, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no';
        window.open(url, title, options);
    }

    var _tupleIndexMappings = {};
    var _viewModelNameTuples = {};
    var _appIdMappings = {};
    var _viewModelNameMappings = {};

    function getViewModelName(viewModelName) {
        return _viewModelNameMappings[viewModelName] ? _viewModelNameMappings[viewModelName] : viewModelName;
    }

    function getTupleIndex(viewModelName, appId) {
        var rightAppId = _appIdMappings[appId] ? _appIdMappings[appId] : appId;
        return viewModelName + "|" + rightAppId;
    }

    function getTupleIndexFromDelete(tupleIndex) {
        var items = tupleIndex.split("|");
        if (items.length != 2) return;
        return getTupleIndex(items[0], items[1]);
    }

    function getTupleWhenLoad(parentViewModelName, appId, primaryKey) {
        var tupleIndexMapping = _tupleIndexMappings[getTupleIndex(parentViewModelName, appId)];
        var viewModelName = primaryKey ? tupleIndexMapping && tupleIndexMapping[primaryKey] : tupleIndexMapping && tupleIndexMapping["default"];
        return getTupleByViewModelName(viewModelName);
    }

    function getTupleByViewModelName(viewModelName) {
        if (!viewModelName) return null;
        return _viewModelNameTuples[viewModelName];
    }

    function innerLoadView(viewModelName, appId, viewContainer, tuple, callback, params) {
        if (params && params.iframe) {
            var iframe = document.createElement("iframe");
            iframe.src = appId;
            iframe.style.minHeight = "600px";
            iframe.style.width = "100%";
            iframe.style.border = "none";
            iframe.onload = function () {
                if (iframe.contentWindow.initParams)
                    iframe.contentWindow.initParams({ viewModelName: viewModelName, appId: appId });
            };
            viewContainer.append(iframe);
            if (callback)
                callback.call(this);
            var tupleIndex = getTupleIndex(viewModelName, appId);
            _tupleIndexMappings[tupleIndex] = _tupleIndexMappings[tupleIndex] || {};
            var newViewModelName = cb.getNewId("cb_viewmodel_" + tupleIndex);
            _tupleIndexMappings[tupleIndex][params && params.PK || "default"] = newViewModelName;
            _viewModelNameTuples[newViewModelName] = tuple;
            return;
        }
        var queryString = params && params.queryString;
        var pageUrl = cb.route.getPageUrl(appId, queryString);
        cb.loader.loadView(viewContainer, pageUrl, function () {
            var $viewPart = $(this).children("div").first();
            if (!$viewPart.length) return;
            if (callback)
                callback.call(this, $viewPart);
            innerLoadViewCallback.call(this, $viewPart, tuple, viewModelName, appId, params && params.PK);
        });
    }

    function innerLoadViewCallback($viewPart, tuple, viewModelName, appId, primaryKey) {
        var viewPartPageName = $viewPart.attr("data-page");
        if (!viewPartPageName) {
            cb.console.error("loadViewPart: viewPartPageName为空");
            return;
        }
        var viewPartModelName = $viewPart.attr("data-viewmodel");
        if (!viewPartModelName) {
            cb.console.error("loadViewPart: viewPartModelName为空");
            return;
        }
        var newViewModelName = cb.getNewId("cb_viewmodel_" + viewPartModelName);
        $viewPart.attr("data-viewmodel", newViewModelName);
        _viewModelNameMappings[newViewModelName] = viewPartModelName;
        tuple.viewPartModelName = newViewModelName;
        $viewPart.data("parentViewModelName", viewModelName);
        if (viewPartPageName !== appId) {
            cb.console.warn("loadViewPart: viewPartPageName与入口参数appId不匹配");
            if (!_appIdMappings[appId])
                _appIdMappings[appId] = viewPartPageName;
            else if (_appIdMappings[appId] != viewPartPageName)
                cb.console.error("----------innerLoadView严重错误----------");
        }
        var tupleIndex = getTupleIndex(viewModelName, viewPartPageName);
        _tupleIndexMappings[tupleIndex] = _tupleIndexMappings[tupleIndex] || {};
        _tupleIndexMappings[tupleIndex][primaryKey || "default"] = newViewModelName;
        _viewModelNameTuples[newViewModelName] = tuple;
    }

    function innerRefreshView(tuple, params) {
        if (params && params.refreshData === false) return;
        tuple.params = $.extend(true, {}, params, { parentViewModel: tuple.params.parentViewModel, appId: tuple.params.appId });
        if (!tuple.viewPartModelName) return;
        var viewPartModel = cb.cache.get(tuple.viewPartModelName);
        if (viewPartModel && viewPartModel.initData) viewPartModel.initData();
    }
})(jQuery);
cb.route.ViewPartType = {
    PanoramicMenu: ".menu-menu",
    MyTask: ".my-task",
    MySchedule: ".my-schedule",
    Catalog: ".cube-main-left",
    QueryScheme: ".ui-query-content",
    Detail: ".cube-main-right"
};
cb.route.CommonAppEnum = {
    PanoramicMenu: "common.menu.MenuApp",
    MyTask: "common.schedule.MyTaskApp",
    MySchedule: "common.schedule.MyScheduleApp",
    Catalog: "common.catalog.CatalogApp",
    QueryScheme: "common.queryscheme.QuerySchemeApp",
    Contact: "common.contact.ContactApp",
    ContactDetail: "common.contact.ContactDetailApp",
    HistoryStatus: "common.historystatus.StatusApp",
    Approval: "common.approve.ApprovalApp",
    ApprovalHistory: "common.approve.ApprovalHistoryApp",
    Pull: "common.pull.CommonPullListApp",
    Push: "common.push.CommonPushListApp",
    Refer: "common.refer.ReferApp",
    ReferTable: "common.refer.ReferTableApp",
    Column: "common.col.ColumnApp"
};