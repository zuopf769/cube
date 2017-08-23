UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.ChangePhoneController = function () { };
UOrderApp.pages.ChangePhoneController.prototype.preprocess = function (content, url, next) {
    var context = $$.parseUrlQuery(url) || {};
    if (context.valid == 'false')
        this.valid = false;
    else
        this.valid = true;
    next(content);
};

UOrderApp.pages.ChangePhoneController.prototype.pageInit = function (page) {
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
            var input = $$('div[data-page="changePhonePage"] .changePhonePage-main-container').find('input[name="phone"]');
            input.val(userInfo.cMobile);
            input.attr('readOnly', 'readOnly');
            $$('div[data-page="changePhonePage"] .changePhonePage-btn-submit').text('下一步');
        });
    }
    //图片验证码点击事件
    $$('.img-changePhone-verification').on('click', function () {
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
        $$('.img-changePhone-verification').trigger('click');
    }, 60000)

    //获取校验码点击事件
    $$('.TestGetCode.changePhonePage-btn-getCode').on('click', function () {
        var selfBtn = this;
        var serverUrl = 'ma/Users/SendNewPhoneValidCode';
        if (self.valid) {
            serverUrl = 'ma/Users/SendPhoneValidCode';
        }
        var param = myApp.formToJSON("#form-changePhonePage");
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
    $$('div[data-page="changePhonePage"] .button.changePhonePage-btn-submit').on('click', function () {
        var selfbtn = this;
        if ($$(this).text() == '保存') {
            var formData = myApp.formToJSON('#form-changePhonePage');
            delete formData.captcha;

            cb.rest.postData('mc/Users/verifyPhone', formData, function (data) {
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
            var formData = myApp.formToJSON('#form-changePhonePage');
            cb.rest.getJSON('ma/Users/CheckPhone', { validCode: formData.validCode }, function (data) {
                if (typeof data == 'string')
                    data = JSON.parse(data);
                if (data.code != 200) {
                    myApp.toast(data.message, 'error').show(true);
                    return;
                }
                var input = $$('div[data-page="changePhonePage"] .changePhonePage-main-container').find('input[name="phone"]');
                input.removeAttr('readOnly');
                $$('.img-changePhone-verification').trigger('click');
                var newformData = {
                    phone: '', captcha: '', validCode: ''
                };
                self.valid = false;
                myApp.formFromJSON('#form-changePhonePage', newformData);
                $$(selfbtn).text('保存');
            });
        }
    });

};

UOrderApp.pages.ChangePhoneController.prototype.validData = function (val) {
    var errlogContainer = $$('div[data-page="changePhonePage"] .changePhonePage-error-container');

    var formData = myApp.formToJSON('#form-changePhonePage');
    if (!formData.phone) {
        errlogContainer.text('请输入手机号');
        return false;
    }
    else {
        var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
        if (!myreg.test(formData.phone)) {
            errlogContainer.text('请输入正确格式的手机号');
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