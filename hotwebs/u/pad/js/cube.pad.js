(function ($) {
    $.extend(true, window, {
        "cb": {
            "route": {
                "initViewPart": initViewPart,
                "loadViewPart": loadViewPart,
                "hideViewPart": hideViewPart,
                "toggleViewPart": toggleViewPart,
                "loadTabViewPart": loadTabViewPart,
                "loadPageViewPart": loadPageViewPart,
                "hidePageViewPart": hidePageViewPart,
                "loadArchiveViewPart": loadArchiveViewPart,
                "hideArchiveViewPart": hideArchiveViewPart,
                "getViewPartParams": getViewPartParams,
                "loadView": loadView,
                "scanAutoLogin":scanAutoLogin,
                "loginOut":loginOut,
                "changeHost":changeHost
            }
        }
    });

    function initViewPart(viewModel, data) {
        if (!data) {
            data = {
                ".document-wrapper": { responsive: true, startX: "-40%" },
                ".detail-wrapper": { responsive: true, startX: "-50%" },
                ".content-wrapper": { responsive: true }
            };
        }
        if (typeof data !== "object") {
            cb.console.error("initViewPart: 输入参数无效");
            return;
        }
        var viewModelName = viewModel.getName();
        if (!viewModelName) {
            cb.console.error("initViewPart: viewModelName为空");
            return;
        }
        var scrollers = cb.cache.get("scrollers");
        if (!scrollers) scrollers = {};
        for (var wrapperSelector in data) {
            var $wrapper = $("[data-viewmodel='" + viewModelName + "'] " + wrapperSelector);
            if (!$wrapper.length) {
                cb.console.error("initViewPart: " + wrapperSelector + " wrapper选择器无效");
                continue;
            }
            var id = "wrapper_" + Math.round(1000000 * Math.random());
            while ($("#" + id).length) {
                id = "wrapper_" + Math.round(1000000 * Math.random());
            }
            $wrapper.attr("id", id);
            var wrapper = $wrapper.get(0);
            var scrollerIndex = id;
            if (scrollers[scrollerIndex]) {
                cb.console.warn("initViewPart: " + scrollerIndex + " IScroll已经初始化");
                continue;
            }
            var params = data[wrapperSelector];
            var defaultOptions = { scrollX: true, scrollY: false, preventDefault: false };
            var options = $.extend(true, {}, params, defaultOptions);
            var defaultHidden = false;
            if ($wrapper.is(":hidden")) {
                defaultHidden = true;
                $wrapper.show();
            }
            $wrapper.data("defaultHidden", defaultHidden);
            var scroller = new IScroll(wrapper, options);
            if (defaultHidden) $wrapper.hide();
            scroller.disable();
            scrollers[scrollerIndex] = { scroller: scroller, options: options };
        }
        cb.cache.set("scrollers", scrollers);
    }

    function loadViewPart(viewModel, appId, viewPartType, params) {
        if (!appId) {
            cb.console.error("loadViewPart: 输入参数appId为空");
            return;
        }
        var viewModelName = viewModel.getName();
        if (!viewModelName) {
            cb.console.error("loadViewPart: viewModelName为空");
            return;
        }
        var $elem = $("[data-viewmodel='" + viewModelName + "'] " + viewPartType);
        if (!$elem.length) {
            cb.console.error("loadViewPart: " + elemSelector + " 选择器无效");
            return;
        }
        var $wrapper = $elem.parent().parent();
        if (!$wrapper.length) {
            cb.console.error("loadViewPart: " + elemSelector + " 其祖先wrapper无效");
            return;
        }
        if ($wrapper.is(":hidden")) $wrapper.show();
        var scrollerIndex = $wrapper.attr("id");
        var element = $elem.get(0);
        var scrollers = cb.cache.get("scrollers");
        var scroller = scrollers && scrollers[scrollerIndex] && scrollers[scrollerIndex].scroller;
        if (!scroller) {
            cb.console.error("loadViewPart: " + scrollerIndex + " 无法获取IScroll对象");
            return;
        }
        var options = scrollers && scrollers[scrollerIndex] && scrollers[scrollerIndex].options;
        var duration = params && params.animation && params.animation.duration || 1000;
        var tuples = cb.cache.get("tuples");
        if (!tuples) tuples = {};
        var tupleIndex = viewModelName + "_" + appId;
        var tuple = tuples[tupleIndex];
        if (!tuple) {
            tuple = { scroller: scroller, options: options, duration: duration, clickCount: 1, params: $.extend(true, {}, params, { parentViewModel: viewModel, appId: appId }) };
            var pageUrl = cb.route.getPageUrl(appId);
            cb.loader.loadView($elem, pageUrl, function () {
                scroller.enable();
                var startX = options && options.startX;
                //if (!startX) scroller.scrollToElement(element, duration);
                if (!startX) scroller.scrollTo("-50%", 0, duration);
                else scroller.scrollTo(0, 0, duration);
                scroller.disable();
                var $viewPart = $(this).children().first();
                if (!$viewPart.length) return;
                var viewPartModelName = $viewPart.attr("data-viewmodel");
                if (!viewPartModelName) {
                    cb.console.error("loadViewPart: viewPartModelName为空");
                    return;
                }
                tuple.viewPartModelName = viewPartModelName;
                $viewPart.data("parentViewModelName", viewModelName);
                tuples[tupleIndex] = tuple;
                cb.cache.set("tuples", tuples);
            });
        }
        else {
            setTimeout(function () {
                tuple.clickCount++;
                tuple.params = $.extend(true, {}, params, { parentViewModel: tuple.params.parentViewModel, appId: tuple.params.appId });
                scroller.enable();
                var startX = options && options.startX;
                //if (!startX) scroller.scrollToElement(element, duration);
                if (!startX) scroller.scrollTo("-50%", 0, duration);
                else scroller.scrollTo(0, 0, duration);
                scroller.disable();
                if (!tuple.viewPartModelName) return;
                var viewPartModel = cb.cache.get(tuple.viewPartModelName);
                if (viewPartModel && viewPartModel.initData) viewPartModel.initData();
            }, 100);
        }
    }

    function hideViewPart(viewModel, appId) {
        var tuples = cb.cache.get("tuples");
        if (!tuples) return;
        var viewPartParams = getViewPartParams(viewModel);
        var viewModelName;
        var tupleIndex;
        if (!viewPartParams) {
            viewModelName = viewModel.getName();
        }
        else {
            viewModelName = viewPartParams.parentViewModel.getName();
            var $elem = $("[data-viewmodel='" + viewModel.getName() + "']");
            if ($elem.length) {
                appId = $elem.attr("data-page");
            }
        }
        if (!viewModelName) {
            cb.console.error("hideViewPart: viewModelName为空");
            return;
        }
        if (!appId) {
            cb.console.error("hideViewPart: 必需参数appId为空");
            return;
        }
        tupleIndex = viewModelName + "_" + appId;
        var tuple = tuples[tupleIndex];
        if (!tuple) return;
        tuple.clickCount++;
        tuple.scroller.enable();
        var startX = tuple.options && tuple.options.startX;
        if (!startX) tuple.scroller.scrollTo(0, 0, tuple.duration);
        else tuple.scroller.scrollTo(startX, 0, tuple.duration);
        var $wrapper = $(tuple.scroller.wrapper);
        tuple.scroller.disable();
        setTimeout(function () {
            if ($wrapper.data("defaultHidden")) $wrapper.hide();
        }, tuple.duration);
    }

    function toggleViewPart(viewModel, appId, viewPartType, params) {
        var viewModelName = viewModel.getName();
        if (!viewModelName) {
            cb.console.error("toggleViewPart: viewModelName为空");
            return;
        }
        if (!appId) {
            cb.console.error("toggleViewPart: 输入参数appId为空");
            return;
        }
        var tuples = cb.cache.get("tuples");
        var tupleIndex = viewModelName + "_" + appId;
        var tuple = tuples && tuples[tupleIndex];
        if (!tuple) loadViewPart(appId, elemSelector, params);
        else {
            if (tuple.clickCount % 2 === 1) hideViewPart(appId);
            else loadViewPart(appId, elemSelector, params);
        }
    }

    function loadTabViewPart(viewModel, appId, params) {
        if (!appId) {
            cb.console.error("loadViewPart: 输入参数appId为空");
            return;
        }
        var pageUrl = cb.route.getPageUrl(appId);
        if (!viewModel.getcontrolpages) {
            location.href = pageUrl;
            return;
        }
        var viewModelName = viewModel.getName();
        if (!viewModelName) {
            cb.console.error("loadViewPart: viewModelName为空");
            return;
        }
        //if (history.pushState) history.pushState({}, "", pageUrl);
        var tuples = cb.cache.get("tuples");
        if (!tuples) tuples = {};
        var tupleIndex = viewModelName + "_" + appId;
        var tuple = tuples[tupleIndex];
        if (!tuple) {
            tuple = { params: $.extend(true, {}, params, { parentViewModel: viewModel, appId: appId }) };
            function callback() {
                tuples[tupleIndex] = tuple;
                cb.cache.set("tuples", tuples);
            };
            viewModel.getcontrolpages().set("addPage", { "url": appId, "callback": callback });
        }
        else
            viewModel.getcontrolpages().set("addPage", { "url": appId });
    }

    function loadPageViewPart(viewModel, appId, params) {
        if (!appId) {
            cb.console.error("loadPageView: 输入参数appId为空");
            return;
        }
        var viewModelName = viewModel.getName();
        if (!viewModelName) {
            cb.console.error("loadPageView: viewModelName为空");
            return;
        }
        var $elem = $("[data-viewmodel='" + viewModelName + "'] > .cube-main");
        if (!$elem.length) {
            cb.console.error("loadPageView: 不存在viewModelName为" + viewModelName + "的容器");
            return;
        }
        var duration = (params && params.duration) || 500;
        var tuples = cb.cache.get("tuples");
        if (!tuples) tuples = {};
        var tupleIndex = viewModelName + "_" + appId;
        var tuple = tuples[tupleIndex];
        if (!tuple) {
            var $page = $("<div class='page-view'></div>").appendTo($elem);
            tuple = { $page: $page, duration: duration, clickCount: 1, params: $.extend(true, {}, params, { parentViewModel: viewModel, appId: appId }) };
            var queryString = params && params.queryString;
            var pageUrl = cb.route.getPageUrl(appId, queryString);
            cb.loader.loadView($page, pageUrl, function () {
                $page.showFromRight2(duration);
                var $viewPart = $(this).children("div").first();
                if (!$viewPart.length) return;
                var viewPartPageName = $viewPart.attr("data-page");
                if (!viewPartPageName) {
                    cb.console.error("loadViewPart: viewPartPageName为空");
                    return;
                }
                //else if (viewPartPageName !== appId) {
                //    cb.console.error("loadViewPart: viewPartPageName与入口参数appId不匹配");
                //    return;
                //}
                var viewPartModelName = $viewPart.attr("data-viewmodel");
                if (!viewPartModelName) {
                    cb.console.error("loadViewPart: viewPartModelName为空");
                    return;
                }
                tuple.viewPartModelName = viewPartModelName;
                $viewPart.data("parentViewModelName", viewModelName);
                tuples[tupleIndex] = tuple;
                if (viewPartPageName !== appId) {
                    cb.console.warn("loadViewPart: viewPartPageName与入口参数appId不匹配");
                    tuples[viewModelName + "_" + viewPartPageName] = tuple;
                }
                cb.cache.set("tuples", tuples);
            });
        }
        else {
            setTimeout(function () {
                tuple.clickCount++;
                tuple.params = $.extend(true, {}, params, { parentViewModel: tuple.params.parentViewModel, appId: tuple.params.appId });
                tuple.$page.css("z-index", cb.util.getPopupZIndex());
                tuple.$page.showFromRight2(duration);
                if (!tuple.viewPartModelName) return;
                var viewPartModel = cb.cache.get(tuple.viewPartModelName);
                if (viewPartModel && viewPartModel.initData) viewPartModel.initData();
            }, 100);
        }
    }

    function hidePageViewPart(viewModel, appId) {
        var tuples = cb.cache.get("tuples");
        if (!tuples) return;
        var viewPartParams = getViewPartParams(viewModel);
        var viewModelName;
        var tupleIndex;
        if (!viewPartParams) {
            viewModelName = viewModel.getName();
        }
        else {
            viewModelName = viewPartParams.parentViewModel.getName();
            var $elem = $("[data-viewmodel='" + viewModel.getName() + "']");
            if ($elem.length) {
                appId = $elem.attr("data-page");
            }
        }
        if (!viewModelName) {
            cb.console.error("hideViewPart: viewModelName为空");
            return;
        }
        if (!appId) {
            cb.console.error("hideViewPart: 必需参数appId为空");
            return;
        }
        tupleIndex = viewModelName + "_" + appId;
        var tuple = tuples[tupleIndex];
        if (!tuple) return;
        tuple.clickCount++;
        tuple.$page.hideToRight2(tuple.duration);
    }

    function loadArchiveViewPart(viewModel, appId, params) {
        loadViewPart(viewModel, appId, ".detail-part", params);
        $(".document-wrapper").showToLeft2();
    }

    function hideArchiveViewPart(viewModel) {
        hideViewPart(viewModel);
        $(".document-wrapper").showToRight2();
    }

    function getViewPartParams(viewModel) {
        var viewModelName = viewModel.getName();
        if (!viewModelName) {
            cb.console.error("getViewPartParams: viewModelName为空");
            return;
        }
        var tuples = cb.cache.get("tuples");
        if (!tuples) return;
        var $elem = $("[data-viewmodel='" + viewModelName + "']");
        if (!$elem.length) {
            cb.console.error("getViewPartParams: 选择器无效");
            return;
        }
        var appId = $elem.attr("data-page");
        if (!appId) {
            cb.console.error("getViewPartParams: 必需参数appId为空");
            return;
        }
        var parentViewModelName = $elem.data("parentViewModelName");
        if (!parentViewModelName) {
            cb.console.warn("getViewPartParams: parentViewModelName为空");
            return;
        }
        var tupleIndex = parentViewModelName + "_" + appId;
        var tuple = tuples[tupleIndex];
        if (!tuple) return;
        return tuple.params;
    }

    function loadView(viewContainer, appId, params) {
        if (!viewContainer.length) {
            cb.console.error("cb.route.loadView: 输入参数$elem为空");
            return;
        }
        if (!appId) {
            cb.console.error("cb.route.loadView: 输入参数appId为空");
            return;
        }
        var viewModelName = viewContainer.closest("[data-viewmodel]").attr("data-viewmodel");
        if (!viewModelName) {
            cb.console.error("cb.route.loadView: viewModelName为空");
            return;
        }
        var tuples = cb.cache.get("tuples");
        if (!tuples) tuples = {};
        var tupleIndex = viewModelName + "_" + appId;
        var tuple = tuples[tupleIndex];
        if (!tuple) {
            tuple = { params: $.extend(true, {}, params, { parentViewModel: cb.cache.get(viewModelName), appId: appId }) };
            var pageUrl = cb.route.getPageUrl(appId);
            cb.loader.loadView(viewContainer, pageUrl, function () {
                var $viewPart = $(this).children("div").first();
                if (!$viewPart.length) return;
                var viewPartModelName = $viewPart.attr("data-viewmodel");
                if (!viewPartModelName) {
                    cb.console.error("cb.route.loadView: viewPartModelName为空");
                    return;
                }
                tuple.viewPartModelName = viewPartModelName;
                $viewPart.data("parentViewModelName", viewModelName);
                tuples[tupleIndex] = tuple;
                cb.cache.set("tuples", tuples);
            });
        }
        else {
            setTimeout(function () {
                tuple.params = $.extend(true, {}, params, { parentViewModel: tuple.params.parentViewModel, appId: tuple.params.appId });
                if (!tuple.viewPartModelName) return;
                var viewPartModel = cb.cache.get(tuple.viewPartModelName);
                if (viewPartModel && viewPartModel.initData) viewPartModel.initData();
            }, 100);
        }
    }

    function scanAutoLogin(){
        if(cb.rest.userAgent){
            if(cb.rest.userAgent=="iosApp"){
                        document.location = "http:\\\scanAutoLogin\\";
                    }
                    if(cb.rest.userAgent=="androidApp"){
                        window.main.scanAutoLogin();
                    }
        }
    }
    function loginOut(){
        if(cb.rest.userAgent&&cb.rest.userAgent!=""){
            if(cb.rest.userAgent=="iosApp"){
                        document.location = "http:\\\loginOut\\";
                    }
                    if(cb.rest.userAgent=="androidApp"){
                        window.main.loginOut();
                    }
        }
    }
    function changeHost(){
        if(cb.rest.userAgent&&cb.rest.userAgent!=""){
            if(cb.rest.userAgent=="iosApp"){
                        document.location = "http:\\\changeHost\\";
                    }
                    if(cb.rest.userAgent=="androidApp"){
                        window.main.changeHost();
                    }
        }
    }
})(jQuery);
cb.route.ViewPartType = {
    PanoramicMenu: ".menu-menu",
    MyTask: ".my-task",
    MySchedule: ".my-schedule",
    Catalog: ".class-part",
    QueryScheme: ".query-scheme",
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
    SubLine: "common.voucherbody.SubLineApp",
    Approval: "common.approve.ApprovalApp",
    Pull: "common.pull.SalesOrderListApp",
    Push: "common.push.CommonPushListApp",
    Refer: "common.refer.ReferApp",
    Column: "common.col.ColumnApp"
};