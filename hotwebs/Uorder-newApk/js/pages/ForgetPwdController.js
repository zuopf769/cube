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

    var verificationImg = $$('.img-forgetPwd-verification');
    var reflushImg = function () {

        verificationImg.removeAttr('src');
        verificationImg.attr('src', cb.rest.getUrl('ma/captcha?key=' + Math.random() + "&code=" + cb.getUDID()));
    };
    verificationImg.on('click', reflushImg);
    reflushImg();
    //定时更新验证码
    setTimeout(function () {
        reflushImg();
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
        cb.rest.getJSON('ma/getTempToken', { username: userName, captcha: code, code: cb.getUDID() }, function (data) {
            if (data.code != 200) {
                reflushImg();
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
                $$('#input-phone').val(data.data.phone);

            if (data.data.email)
                $$('#input-email').val(data.data.email);

            $$('div[data-page="ForgetPwd"] .forgetPwd-validateType li').on('click', function (e) {
                $$(this).parent().children('li').removeClass('checked');
                $$(this).addClass('checked');
            });

            //清空输入
            $$('.forgetPwd.step-one .input-forgetPwd-userName').val('');
            $$('.forgetPwd.step-one .input-forgetPwd-verification').val('');
        });
    });

    //获取验证码按钮
    $$('.get-forgetPwd-DynamicCode').on('click', function () {
        var link = $$('div[data-page="ForgetPwd"] .forgetPwd-validateType .checked').find('input').attr('type');

        var params = { uname: self.userInfo.userName };
        if (link == 'email')
            params.bPhone = false;
        else
            params.bPhone = true;

        cb.rest.getJSON('ma/Users/sendValidCode', params, function (data) {
            if (data.code != 200) {
                cb.confirm('发送验证码失败，是否重新获取?', '提示信息', function () {
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
    });

    $$('.forgetPwd .button.step-two').on('click', function () {
        var params = {
            uname: self.userInfo.userName
        };
        var dynamicCode = $$('.input-forgetPwd-DynamicCode').val();
        if (dynamicCode) {
            params.validCode = dynamicCode;
            var link = $$('div[data-page="ForgetPwd"] .forgetPwd-validateType .checked').find('input').attr('type');
            if (link == 'email')
                params.bPhone = false;
            else
                params.bPhone = true;

            cb.rest.getJSON('ma/Users/checkValidCode', params, function (data) {
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

    $$('.forgetPwd-changePwd li i').on('click', function () {
        if ($$(this).hasClass('icon-see-pwd')) {
            $$(this).removeClass('icon-see-pwd').addClass('icon-see-pwd-un');
            $$(this).parent().prev().find('input').attr('type', 'password');
        }
        else {
            $$(this).addClass('icon-see-pwd').removeClass('icon-see-pwd-un');
            $$(this).parent().prev().find('input').attr('type', 'text');
        }
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
        var link = $$('div[data-page="ForgetPwd"] .forgetPwd-validateType .checked').find('input').attr('type');
        if (link == 'email')
            params.bPhone = false;
        else
            params.bPhone = true;

        cb.rest.postData('mc/Users/resetPassword', params, function (data) {
            if (data.code == 200) {
                $$('.forgetPwd.step-three').hide();
                myApp.modal({
                    title: '<div class="common-tips-title success-tips">' +
                              '<i class="icon icon-succeed"></i><span  class="font-23">找回密码成功！</span>' +
                            '</div>',
                    text: '<div class="common-tips-content">' +
                             '<div class="tips-info">请牢牢记住您设置的新密码哦！</div>' +
                           '</div>',
                    buttons: [
              {
                  text: '去登录',
                  onClick: function () {
                      myApp.loginScreen();
                      myApp.mainView.router.back();
                  }
              }
                    ]
                });
            }
            else {
                myApp.modal({
                    title: '<div class="common-tips-title error-tips">' +
                              '<i class="icon icon-failure"></i><span class="font-23">找回密码失败～</span>' +
                              '<i class="icon icon-colse"></i>' +
                            '</div>',
                    buttons: [
              {
                  text: '重新找回',
                  onClick: function () {                      
                      myApp.mainView.router.refashPage();
                  }
              },
              {
                  text: '去登陆',
                  onClick: function () {
                      myApp.loginScreen();
                      myApp.mainView.router.back();
                  }
              }
                    ]
                });
                //关闭modal
                $$('.common-tips-title .icon.icon-colse').on('click', function () {
                    myApp.closeModal();
                    myApp.mainView.router.back();
                });
            }
        });
    });
};