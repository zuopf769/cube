UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.ForgetPwdController = function () { };
UOrderApp.pages.ForgetPwdController.prototype.preprocess = function (content, url, next) {
    next(content);
};

UOrderApp.pages.ForgetPwdController.prototype.pageInit = function (page) {
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

    $$('.img-forgetPwd-verification').on('click', function () {
        var code;
        if (window.plus && plus.device)
            code = plus.device.imei;
        else if (cb.rest.appContext.code)
            code = cb.rest.appContext.code;
        else {
            code = (new Date()).valueOf() + '|' + Math.random();
            cb.rest.appContext.code = code;
        }

        $$(this).removeAttr('src');
        $$(this).attr('src', cb.rest.getUrl('ma/captcha') + '?code='+code+'&key=' + Math.random());
    }).trigger('click');

    //定时更新验证码
    setTimeout(function () {
        $$('.img-forgetPwd-verification').trigger('click');
    }, 60000)

    //第一个下一步按钮事件
    $$('.button.step-one').on('click', function () {
        var userName = $$('.forgetPwd.step-one .input-forgetPwd-userName').val();
        var code = $$('.forgetPwd.step-one .input-forgetPwd-verification').val();
        if (!userName) {
            myApp.toast('请输入账户/手机/邮箱', 'tips').show(true);
            return;
        }
        if (!code) {
            myApp.toast('请输入验证码', 'tips').show(true);
            return;
        }
        cb.rest.getJSON('ma/getTempToken', { username: userName, captcha: code }, function (data) {
            if (typeof data == 'string')
                data = JSON.parse(data);
            if (data.code != 200) {
                myApp.toast(data.message, 'error').show(true);
                return;
            }
            self.userInfo = data.data;
            if (!self.userInfo.userName)
                self.userInfo.userName = $$('.forgetPwd.step-one .input-forgetPwd-userName').val();

            cb.rest.appContext.token = data.data.token;
            $$('.forgetPwd.step-one').hide();
            $$('.forgetPwd.step-two').show();

            if (data.data.phone)
                $$('#picker-inputlinkType').val('手机号：' + data.data.phone);
            else
                $$('#picker-inputlinkType').val('邮箱：' + data.data.email);

            var pickerLinkType = myApp.picker({
                input: '#picker-inputlinkType',
                toolbarCloseText: '关闭',
                cols: [
                    {
                        textAlign: 'center',
                        values: ['手机号：' + data.data.phone, '邮箱：' + data.data.email]
                    }
                ]
            });
            //清空输入
            $$('.forgetPwd.step-one .input-forgetPwd-userName').val('');
            $$('.forgetPwd.step-one .input-forgetPwd-verification').val('');
        });
    });

    //获取验证码按钮
    $$('.get-forgetPwd-DynamicCode').on('click', function () {
        var link = $$('#picker-inputlinkType').val();
        if (link) {
            link = link.split('：')[1];
            var params = { uname: self.userInfo.userName };
            if (link.indexOf('@') > 0)
                params.bPhone = false;
            else
                params.bPhone = true;

            cb.rest.getJSON('ma/Users/sendValidCode', params, function (data) {
                if (typeof data == 'string')
                    data = JSON.parse(data);
                if (data.code != 200) {
                    myApp.confirm('发送验证码失败，是否重新获取?', '提示信息', function () {
                        $$('.get-forgetPwd-DynamicCode').trigger('click');
                    });
                    return;
                }
                $$('.get-forgetPwd-DynamicCode').attr('disabled', 'disabled');

                var index = 60;
                var setInter = window.setInterval(function () {
                    if (index <= 0) {
                        $$('.get-forgetPwd-DynamicCode').removeAttr('disabled');
                        $$('.get-forgetPwd-DynamicCode').text('获取验证码');
                        clearInterval(setInter);
                    }
                    else {
                        $$('.get-forgetPwd-DynamicCode').text(index + '秒后获取');
                        index--;
                    }
                }, 1000);
            });
        }
        else {
            myApp.toast('请选择验证类型！', 'tips').show(true);
        }
    });

    $$('.forgetPwd .button.step-two').on('click', function () {
        var params = {
            uname: self.userInfo.userName
        };
        var dynamicCode = $$('.input-forgetPwd-DynamicCode').val();
        if (dynamicCode) {
            params.validCode = dynamicCode;
            var link = $$('#picker-inputlinkType').val().split('：');
            if (link.indexOf('@') > 0)
                params.bPhone = false;
            else
                params.bPhone = true;

            cb.rest.getJSON('ma/Users/checkValidCode', params, function (data) {
                if (typeof data == 'string')
                    data = JSON.parse(data);
                if (data.code != 200) {
                    myApp.alert(data.message, '提示信息');
                    return;
                }
                $$('.forgetPwd.step-two').hide();
                $$('.forgetPwd.step-three').show();
            });
        }
        else
            myApp.toast('请输入验证码', 'tips').show(true);
    });

    $$('.forgetPwd .button.step-three').on('click', function () {
        var newPwd = $$('.forgetPwd-new-pwd').val();
        if (!newPwd) {
            myApp.toast('请输入新密码', 'tips').show(true);
            return;
        }
        else if (newPwd != $$('.forgetPwd-reconfirm-pwd').val()) {
            myApp.toast('两次输入不一致！', 'error').show(true);
            return;
        }
        var params = {
            uname: self.userInfo.userName,
            password: newPwd
        };
        var link = $$('#picker-inputlinkType').val().split('：');
        if (link.indexOf('@') > 0)
            params.bPhone = false;
        else
            params.bPhone = true;

        cb.rest.postData('mc/Users/resetPassword', params, function (data) {
            if (typeof data == 'string')
                data = JSON.parse(data);
            if (data.code == 200) {
                $$('.forgetPwd.step-three').hide();
                $$('.forgetPwd-infor.forgetPwd-success').show();
            }
            else {
                myApp.toast(data.message, 'error').show(true);
                $$('.forgetPwd-infor.forgetPwd-success').hide();
            }
        });
    });
};