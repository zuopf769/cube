UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.RegisterController = function () { };
UOrderApp.pages.RegisterController.prototype.preprocess = function (content, url, next) {
    next(content);
};

UOrderApp.pages.RegisterController.prototype.pageInit = function (page) {
    var self = this;
    //返回按钮注册  nav
    $$('.link.forgetPwd-back').on('click', function () {
        myApp.loginScreen();
        myApp.mainView.router.back();
    });
    //返回首页
    $$('.button.forgetPwd-retern-btn').on('click', function () {
        myApp.loginScreen();
        myApp.mainView.router.back();
    });

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
                $$("#reg2").show();

                if (userData.bPhone) {
                    $$("#liPhone").find("input[name='cMobile']").val(userData.contactway);
                    $$("#liEmail").show();
                }
                else {
                    $$("#liEmail").find("input[name='cEmail']").val(userData.contactway);
                    $$("#liPhone").show();
                }
                $$("input[name='cUserName']").val(userData.contactway);
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
                cAlias: param.cAlias
            }
        }, function (data) {
            if (data.code != 200) {
                myApp.toast(data.message, 'error').show(true);
                return;
            }

            $$("#coprNameP").html("公司: " + param.cName);
            $$("#accountP").html("账号: " + param.cUserName);
            $$("#reg2").hide();
            $$("#reg3").show();
        });
    });

    $$("#btnExperience").on("click", function () {
        myApp.loginScreen();
        myApp.mainView.router.back();
    });

    $$("#btnBackToHome").on("click", function () {
        myApp.loginScreen();
        myApp.mainView.router.back();
    });
};