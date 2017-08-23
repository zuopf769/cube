var myApp = new Framework7({
    modalButtonOk: '确定',
    modalButtonCancel: '取消',
    cache: false
});
var $$ = Dom7;

UOrderApp.init = (function () {
    var _controllers = {};
    var preprocess = function (content, url, next) {
        var node = cb.loader.getNode(content);
        if (!node) return;
        var container = node.childNodes.length && node.childNodes[0];
        // Node.TEXT_NODE (3)
        if (container.nodeType === 3) return content;
        var controllerName = container && $$(container).dataset()['controller'];
        if (!controllerName) return content;
        var controller = _controllers[url];
        if (!controller) {
            cb.loader.processNode(node, function () {
                controller = new UOrderApp.pages[controllerName]();
                _controllers[url] = controller;
                if (controller.preprocess)
                    controller.preprocess(content, url, next);
            });
        } else {
            if (controller.preprocess)
                controller.preprocess(content, url, next);
        }
    };

    var _viewIds = {};
    var addView = function (viewId) {
        var viewSelector = '#' + viewId;
        $$(viewSelector).parent().children('div.view.tab').removeClass('view-main active');
        $$(viewSelector).addClass('view-main active');
        var toolbarItem = $$(viewSelector).parent().find('a[href="' + viewSelector + '"]');
        toolbarItem.parent().children().removeClass('active');
        toolbarItem.addClass('active');

        var defaultOptions = {
            preprocess: function (content, url, next) {
                return preprocess(content, url, next);
            }
        };
        var view = myApp.addView(viewSelector, defaultOptions);
        _viewIds[viewId] = true;
        view.router.refreshPage();
    };
    myApp.popup('.popup-welcome');
    setTimeout(function () {
        myApp.closeModal('.popup-welcome')
        //myApp.loginScreen();
    }, 1500);

    //------------------------
    var udid;
    if (window.plus && plus.device)
        udid = plus.device.imei;
    else if (cb.rest.appContext.code)
        udid = cb.rest.appContext.code;
    else {
        if (window.localStorage) {
            if (localStorage.upudid) {
                udid = localStorage.upudid;
            }
            else {
                udid = (new Date()).valueOf() + '|' + Math.random();
                localStorage.upudid = udid;
            }
            cb.rest.appContext.code = udid;
        } else {
            alert('手机系统版本太低了,无法使用本软件!');
        }
    }

    cb.rest.postData('mlogin?udid=' + udid, { username: "0006@huch.com.cn", password: "huch12345" }, function (data) {
        var dataObj = data;
        if (typeof data == 'string')
            dataObj = JSON.parse(data);
        if (dataObj.code == 200 && dataObj.data) {
            cb.rest.appContext.token = dataObj.data;
            $$('#view-1').trigger('show');
            myApp.closeModal('.login-screen.modal-in');
            myApp.showToolbar('.toolbar.homeNavBar');
        }
        else {
            myApp.alert(dataObj.message, "提示信息");
        }
    });
    //------------------------
    $$('div.view.tab').on('show', function (e) {
        var viewId = e.target.id;
        addView(viewId);
    });


    $$(document).on('pageInit', function (e) {
        var page = e.detail.page;
        var controller = _controllers[page.url];
        if (controller && controller.pageInit)
            controller.pageInit(page);
    });

    $$(document).on('pageAfterAnimation', function (e) {
        myApp.initImagesLazyLoad(myApp.mainView.activePage.container);
    });
}());
