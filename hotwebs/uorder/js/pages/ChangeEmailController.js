UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.ChangeEmailsController = function () { };
UOrderApp.pages.ChangeEmailsController.prototype.preprocess = function (content, url, next) {
    var context = $$.parseUrlQuery(url) || {};
    if (context.valid == 'false')
        this.valid = false;
    else
        this.valid = true;
    next(content);
};

UOrderApp.pages.ChangeEmailsController.prototype.pageInit = function (page) {
    var self = this;
    if (this.valid) {
        cb.rest.getJSON('ma/Users/getLoginUserInfo', function (data) {
            if (typeof data == 'string')
                data = JSON.parse(data);
            if (data.code != 200) {
                myApp.toast('获取用户信息失败！', 'error').show(true);
                return;
            }
            var userInfo = data.data.user;
            var input = $$('div[data-page="changeEmailPage"] .changeEmailPage-main-container').find('input[name="email"]');
            input.val(userInfo.cEmail);
            input.attr('readOnly', 'readOnly');
            $$('div[data-page="changeEmailPage"] .changeEmailPage-btn-submit').text('下一步');
        });
    }
    //图片验证码点击事件
    $$('.img-changeEmail-verification').on('click', function () {
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
        $$(this).attr('src', cb.rest.getUrl('ma/captcha') + '&code=' + code + '&key=' + Math.random());
    }).trigger('click');

    //定时更新验证码
    setTimeout(function () {
        $$('.img-changeEmail-verification').trigger('click');
    }, 60000)

    //获取校验码点击事件
    $$('.TestGetCode.changeEmailPage-btn-getCode').on('click', function () {
        var selfBtn = this;
        var serverUrl = 'ma/Users/SendNewEmailValidCode';
        if (self.valid) {
            serverUrl = 'ma/Users/SendEmailValidCode';
        }
        var param = myApp.formToJSON("#form-changeEmailPage");
        delete param.validCode;

        cb.rest.getJSON(serverUrl, param, function (data) {
            if (typeof data == 'string')
                data = JSON.parse(data);
            if (data.code != 200) {
                myApp.confirm('发送验证码失败，是否重新获取?', '提示信息', function () {
                    $$(selfBtn).trigger('click');
                });
                return false;
            }
            myApp.toast('发送校验码成功', 'success').show(true);

            var index = 10;
            var setInter = window.setInterval(function () {
                if (index <= 0) {
                    $$(selfBtn).removeAttr('disabled');
                    $$(selfBtn).text('获取验证码');
                    clearInterval(setInter);
                }
                else {
                    $$(selfBtn).text(index + '秒后获取');
                    index--;
                }
            }, 1000);
        });
    });

    //确定按钮点击事件
    $$('div[data-page="changeEmailPage"] .button.changeEmailPage-btn-submit').on('click', function () {
        var selfbtn = this;
        if ($$(this).text() == '保存') {
            var formData = myApp.formToJSON('#form-changeEmailPage');
            delete formData.captcha;

            cb.rest.postData('mc/Users/verifyEmail', formData, function (data) {
                if (typeof data == 'string')
                    data = JSON.parse(data);
                if (data.code != 200) {
                    myApp.toast(data.message, 'error').show(true);
                    return;
                }
                myApp.toast('保存成功', 'success').show(true);
            });
        }
        else {
            if (!self.validData()) return;
            var formData = myApp.formToJSON('#form-changeEmailPage');
            cb.rest.getJSON('ma/Users/CheckEmail', { validCode: formData.validCode }, function (data) {
                if (typeof data == 'string')
                    data = JSON.parse(data);
                if (data.code != 200) {
                    myApp.toast(data.message, 'error').show(true);
                    return;
                }
                var input = $$('div[data-page="changeEmailPage"] .changeEmailPage-main-container').find('input[name="email"]');
                input.removeAttr('readOnly');
                $$('.img-changeEmail-verification').trigger('click');
                var newformData = {
                    email: '', captcha: '', validCode: ''
                };
                self.valid = false;
                myApp.formFromJSON('#form-changeEmailPage', newformData);
                $$(selfbtn).text('保存');
            });
        }
    });

};

UOrderApp.pages.ChangeEmailsController.prototype.validData = function (val) {
    var errlogContainer = $$('div[data-page="changeEmailPage"] .changeEmailPage-error-container');

    var formData = myApp.formToJSON('#form-changeEmailPage');
    if (!formData.email) {
        errlogContainer.text('请输入邮箱');
        return false;
    }
    else {
        var myreg = /^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
        if (!myreg.test(formData.email)) {
            errlogContainer.text('请输入正确格式的邮箱');
            return false;
        }
    }
    if (!formData.captcha) {
        errlogContainer.text('请输入验证码');
        return false;
    }
    if (!val) {
        if (!formData.validCode) {
            errlogContainer.text('请输入校验码');
            return false;
        }
    }
    return true;
};