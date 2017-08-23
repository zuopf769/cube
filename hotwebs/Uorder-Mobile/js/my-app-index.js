var myApp = new Framework7({
    modalButtonOk: '确定',
    modalButtonCancel: '取消',
    cache: false,
    fastClicks: true
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
        $$(viewSelector).parent().children('div.view-main.active').removeClass('view-main active');
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
        myApp.loginScreen();
    }, 1500);

    $$('.button.submit').on('click', function () {
        var formData = myApp.formToJSON('#mylogin');

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

        cb.rest.postData('mlogin?udid=' + udid, formData, function (data) {
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

    });
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

    $$('.forgetPwd').on('click', function () {
        var defaultOptions = {
            preprocess: function (content, url, next) {
                return preprocess(content, url, next);
            }
        };

        myApp.addView('.view-main', defaultOptions).router.loadPage('pages/forgetPwd.html');
        myApp.closeModal('.login-screen.modal-in');
    });
    //清除账户信息
    $$('span.value-clear').on('click', function () {
        $$('#mylogin').find('input').val('');
        $$(this).hide();
    });
    $$('#mylogin').find('input[name="username"]').on('keyup', function () {
        if ($$(this).val())
            $$('span.value-clear').show();
        else
            $$('span.value-clear').hide();
    });
    $$('.border-lightestgray-u.color-lightergray-u').on('click', function () {
        var defaultOptions = {
            preprocess: function (content, url, next) {
                return preprocess(content, url, next);
            }
        };

        myApp.addView('.view-main', defaultOptions).router.loadPage('pages/register.html');
        myApp.closeModal('.login-screen.modal-in');
    });
}());

/**
 * 扫码打开新窗口
 * @param {URIString} id : 要打开页面url
 * @param {boolean} wa : 是否显示等待框
 * @param {boolean} ns : 是否不自动显示
 */
var openw = null, waiting = null;
window.clicked = function (url, isOuter) {
    if (window.plus) {
        if (isOuter) {
            url = "pages/externalPage.html?outsideurl=" + url;
        }
        openw = plus.webview.create(url, url, { scrollIndicator: 'none', scalable: false });
        openw.addEventListener('loaded', function () {//页面加载完成后才显示
            openw.show("pop-in");
        }, false);
        openw.addEventListener('close', function () {//页面关闭后可再次打开
            openw = null;
        }, false);
        return openw;
    } else {
        myApp.toast('本功能只能在APP中使用!', 'error').show(true);
    }
    return null;
};

//扫码完成,供公共调用
function scaned(type, result, file) {
    plus.nativeUI.toast("扫码成功!", {
        duration: "short"
    });
    myApp.mainView.router.loadPage({
        url: 'pages/products.html?keyword=' + result + "&nosort=yes&dataType=searchProduct"
    });
}

var upTool = {
    numMulti: function (num1, num2) {//去误差乘
        if (!num1) {
            num1 = 1;
        }

        if (!num2) {
            num2 = 1;
        }

        var baseNum = 0;
        try {
            baseNum += num1.toString().split(".")[1].length;
        } catch (e) {
        }
        try {
            baseNum += num2.toString().split(".")[1].length;
        } catch (e) {
        }
        return Number(num1.toString().replace(".", "")) * Number(num2.toString().replace(".", "")) / Math.pow(10, baseNum);
    },
    numAdd: function (arg1, arg2) {//去误差加
        var r1, r2, m;
        try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
        try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
        m = Math.pow(10, Math.max(r1, r2))
        return (arg1 * m + arg2 * m) / m
    },
    numDiv: function (arg1, arg2) {
        var t1 = 0, t2 = 0, r1, r2;
        try { t1 = arg1.toString().split(".")[1].length } catch (e) { }
        try { t2 = arg2.toString().split(".")[1].length } catch (e) { }
        with (Math) {
            r1 = Number(arg1.toString().replace(".", ""))
            r2 = Number(arg2.toString().replace(".", ""))
            return (r1 / r2) * pow(10, t2 - t1);
        }
    },
    numSub: function (arg1, arg2) {
        return commonLogic.numAdd(arg1, -arg2);
    },
    numMO: function (num) {//千分符
        if (num && num.toString().indexOf(',') > 0) {
            return num;
        }
        num = parseFloat(num);
        return (num.toFixed(2) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
    }
};