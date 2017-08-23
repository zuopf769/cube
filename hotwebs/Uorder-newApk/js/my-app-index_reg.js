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
        myApp.loginScreen();
    }, 1500);

    $$(document).on('pageInit', function (e) {
        var page = e.detail.page;
        var controller = _controllers[page.url];
        if (controller && controller.pageInit)
            controller.pageInit(page);
    });

    $$(document).on('pageAfterAnimation', function (e) {
        myApp.initImagesLazyLoad(myApp.mainView.activePage.container);
    });



    //------------------------

    var userData = null;
    var udid = null;
    //发送验证码
    $$("#btnGetCode").on("click", function () {
        var userName = $$("#txtUserName").val();
        if (userName) {
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
            deviceId =
            cb.rest.getJSON('ma/Register/sendValidCode', { contactWay: userName, deviceId: udid }, function (data) {
                if (data.code != 200) {
                    myApp.toast(data.message, 'error').show(true);
                    return;
                }
                else {
                    userData = data.data;
                    var btn = $$("#btnGetCode").attr("disabled", true);
                    var timeMark = 120;
                    var timeInterMark = setInterval(function () {
                        btn.html(timeMark + "秒获取");
                        timeMark--;
                        if (timeMark <= 0) {
                            clearInterval(timeInterMark);
                            btn.removeAttr("disabled");
                            btn.html("校验码");
                        }
                    }, 1000);
                }
            });
        }
        else {
            myApp.toast('请输入手机号或邮箱', 'error').show(true);
        }
    });

    var currIndex = 2;
    //返回
    $$("#regBack2").on("click", function () {
        if (currIndex == 2) {
            $$("#reg1").show();
            $$("#regNavbar").hide();
            $$("#reg2").hide();
            $$('.toolbar.homeNavBar').css({ "z-index": -1 });
        }
        else {
            $$("#reg2").show();
            $$('.toolbar.homeNavBar').css({ "z-index": 99999 });
            $$("#reg3").hide();
            $$("#regNavbar .center").html("设置账户信息");
            currIndex = 2;
        }
    });

    //注册
    $$("#btnRegister").on("click", function () {
        var code = $$("#txtValidCode").val();
        if (code) {
            cb.rest.getJSON('ma/Register/checkNumber', { contactWay: userData.contactway, validCode: code, deviceId: udid }, function (data) {
                if (data.code != 200) {
                    myApp.toast(data.message, 'error').show(true);
                    return;
                }
                $$("#reg1").hide();
                $$("#regNavbar").show();
                $$("#reg2").show();
                $$('.toolbar.homeNavBar').css({ "z-index": 99999 });
                if (userData.bPhone) {
                    $$("#liPhone").find("input[name='cMobile']").val(userData.contactway);
                    $$("#liEmail").show();
                }
                else {
                    $$("#liEmail").find("input[name='cEmail']").val(userData.contactway);
                    $$("#liPhone").show();
                }
                $$("input[name='cUserName']").val(userData.contactway);

                //$$("#reg2").scroll(function () {
                //    var topValue = $$("#reg2").height() + $$("#reg2").scrollTop() - $$(".regComplate").height();
                //    if (topValue < 668) {
                //        $$(".regComplate").css({ top: topValue + "px" });
                //    }
                //});
            });
        }
        else {
            myApp.toast('请输入校验码', 'error').show(true);
        }
    });

    //完成注册
    $$("#btnRegisterComplate").on("click", function () {
        var param = myApp.formToJSON('#form-RegPage');
        if (param.cPassword != param.cPassword2) {
            myApp.toast('两次密码输入不一致', 'error').show(true);
            return false;
        }
        cb.rest.postData('mc/Register/checkAccount', {
            contactWay: userData.contactway, deviceId: udid, accountInfo: {
                cUserName: param.cUserName,
                cPassword: param.cPassword,
                cEmail: param.cEmail,
                cFullName: param.cFullName,
                cMobile: param.cMobile
            },
            oCorp: {
                cName: param.cName,
                cAlias: param.cAlias,
                cUPPartner: param.cUPPartner
            }
        }, function (data) {
            if (data.code != 200) {
                myApp.toast(data.message, 'error').show(true);
                return;
            }

            currIndex = 3;
            $$("#regNavbar .center").html("注册成功");
            $$("#coprNameP").html("公司: " + param.cName);
            $$("#accountP").html("账号: " + param.cUserName);
            $$("#pwdP").html("账号: " + param.cPassword);
            $$("#reg2").hide();
            $$('.toolbar.homeNavBar').css({ "z-index": -1 });
            $$("#reg3").show();
        });
    });
}());
