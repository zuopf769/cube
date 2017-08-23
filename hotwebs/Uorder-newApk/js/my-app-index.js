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

    //键盘打开时,更新文本框位置
    var logincheckKeyBoardTimeMark = null;
    var loginwindowHeight = document.body.clientHeight;
    var loginreKeyboard = function (obj) {
        obj.focus(function () {
            var $$this = $$(this);
            setTimeout(function () {
                var bottom = document.body.clientHeight - ($$this.offset().top - $$("div.login-screen .page").scrollTop());
                if (bottom < 120) {
                    $$("div.login-screen .login-avatar").addClass("renderVIPositon");
                }
            }, 600);
            logincheckKeyBoardTimeMark = setInterval(function () {
                if (document.body.clientHeight > (loginwindowHeight / 3 * 2)) {
                    $$("div.login-screen .login-avatar").removeClass("renderVIPositon");
                    window.clearInterval(logincheckKeyBoardTimeMark);
                    logincheckKeyBoardTimeMark = null;
                }
            }, 800);
        });
    };

    loginreKeyboard($$("#mylogin input[type=text]"));
    loginreKeyboard($$("#mylogin input[type=password]"));

    $$('.button.submit').on('click', function () {
        var formData = myApp.formToJSON('#mylogin');
        cb.rest.postData('mlogin', formData, function (data) {
            var dataObj = data;
            if (dataObj.code == 200 && dataObj.data) {
                cb.rest.appContext.token = dataObj.data;
                window.localStorage.setItem("uptoken", dataObj.data);

                if (window.localStorage.getItem('accountList')) {
                    var accountStr = window.localStorage.getItem('accountList');
                    if (accountStr.indexOf(formData.username) < 0)
                        accountStr += '|' + formData.username;

                    window.localStorage.setItem('accountList', accountStr);
                }
                else
                    window.localStorage.setItem('accountList', formData.username);

                $$('#view-1').trigger('show');
                myApp.closeModal('.login-screen');
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
        //  myApp.initImagesLazyLoad(myApp.mainView.activePage.container);
    });

    cb.reloadShoppingCartCount = function () {
        cb.rest.getJSON('ma/shoppingcarts/count', function (data) {
            if (data.code == 200) {
                var span = '<span class="badge bg-red">' + data.data + '</span>';
                if (data.data == 0) span = '';
                $$(".upShoppingCount").html(span);
            }
        });
    };

    $$('.forgetPwd').on('click', function () {
        var defaultOptions = {
            preprocess: function (content, url, next) {
                return preprocess(content, url, next);
            }
        };

        myApp.addView('.view-main', defaultOptions).router.loadPage('pages/forgetPwd.html');
        myApp.closeModal('.login-screen.modal-in');
    });

    var loadLoginedAccount = function () {
        if (window.localStorage.getItem('accountList')) {
            var accoutStr = window.localStorage.getItem('accountList').split('|');
            $$('#mylogin .list-login ul').children().remove();
            for (var i = 0; i < accoutStr.length; i++) {
                if (!accoutStr[i]) continue;

                var li = '<li><span class="accountItem">' + accoutStr[i] + '</span><span class="value-clear"><i class="icon icon-loginclear"></i></span></li>';
                $$('#mylogin .list-login ul').append(li);
            }
        }

        if ($$('#mylogin .list-login ul').children('li').length == 0) {
            $$('#mylogin .list-onOff').children('i').removeClass('icon-dropdown').addClass('icon-loginclear').hide();
            $$('#mylogin input[name="username"]').keyup(function () {
                if ($$(this).val())
                    $$('#mylogin').find('span.list-onOff').children().show();
                else
                    $$('#mylogin').find('span.list-onOff').children().hide();
            });
        }

        //清除账户信息
        $$('#mylogin .list-login span.value-clear').on('click', function (e) {
            var txt = $$(this).parent().children('.accountItem').text();
            var accountStr = window.localStorage.getItem('accountList');

            if (accountStr.indexOf(txt) >= 0) {
                window.localStorage.setItem('accountList', accountStr.replace(txt, ''));
                $$(this).parent().remove();
            }

            if ($$('#mylogin .list-login li').length == 0) {
                $$('#mylogin .list-login').hide();
                $$('#mylogin').find('span.list-onOff').children('i').removeClass('icon-dropup').addClass('icon-dropdown');
            }
            e.stopPropagation();
        });

        $$('#mylogin .list-login li').on('click', function () {
            $$('#mylogin').find('input[name="username"]').val($$(this).children('span.accountItem').text());
            $$('#mylogin').find('input[name="password"]').val('');

            $$('#mylogin .list-login').hide();

            $$('#mylogin').find('span.list-onOff').children('i').removeClass('icon-dropup').addClass('icon-dropdown');
        });
    };

    loadLoginedAccount();

    $$('#mylogin').find('span.list-onOff').on('click', function () {
        if ($$(this).children('i').hasClass('icon-dropdown')) {
            $$(this).children('i').removeClass('icon-dropdown').addClass('icon-dropup');
            $$(this).parent().children('div.list-login').show();
        }
        else if ($$(this).children('i').hasClass('icon-dropup')) {
            $$(this).children('i').removeClass('icon-dropup').addClass('icon-dropdown');
            $$(this).parent().children('div.list-login').hide();
        }
        else if ($$(this).children('i').hasClass('icon-loginclear')) {
            $$('#mylogin').find('input').val('');
            $$(this).hide();
        }
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

    var welcomeScreenFunc = function () {
        var options = {
            'bgcolor': '#6fe1dc',
            'fontcolor': '#fff',
            closeButtonText: '跳过',
            'onClosed': function () {
                var token = window.localStorage.getItem("uptoken");
                if (token) {
                    cb.rest.appContext.token = token;
                    $$('#view-1').trigger('show');
                    myApp.showToolbar('.toolbar.homeNavBar');
                }
                else {
                    myApp.loginScreen();
                }
            }
        },
      welcomescreen_slides,
      welcomescreen;

        welcomescreen_slides = [
          {
              picture: 'welcomescreen-picture1'
          },
          {
              picture: 'welcomescreen-picture2'
          },
          {
              picture: 'welcomescreen-picture3',
              text: '<span></span>'
          }
        ];

        welcomescreen = myApp.welcomescreen(welcomescreen_slides, options);
        window.localStorage.setItem("systemUsed", true);

        $$('.welcomescreen-container .welcomescreen-text').find('span').on('click', function () {
            welcomescreen.close();
        });
    };

    if (!window.localStorage.getItem("systemUsed"))
        welcomeScreenFunc();
    else {
        var token = window.localStorage.getItem("uptoken");
        if (token) {
            cb.rest.appContext.token = token;
            $$('#view-1').trigger('show');
            myApp.showToolbar('.toolbar.homeNavBar');
        }
        else {
            myApp.loginScreen();
        }
    }
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