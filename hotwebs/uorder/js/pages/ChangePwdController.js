UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.ChangePwdController = function () { };
UOrderApp.pages.ChangePwdController.prototype.preprocess = function (content, url, next) {
    next(content);
};
UOrderApp.pages.ChangePwdController.prototype.pageInit = function (page) {
    var self = this;
    $$('div[data-page="changePwdPage"] .changePwd-btn-save').on('click', function (e) {
        var formdata = myApp.formToJSON('#form-changePwd');
        if (!self.formValidate()) return;
        cb.rest.postData('mc/Users/changepassword', { oldPassword: formdata.oldPwd, newPassword: formdata.newPwd }, function (data) {
            if (typeof data == 'string')
                data = JSON.parse(data);
            if (data.code != 200) {
                myApp.toast(data.message, 'error').show(true);
                return;
            }
            else
                myApp.toast('修改密码成功', 'success').show(true);
            myApp.loginScreen();
        });
    });
};

UOrderApp.pages.ChangePwdController.prototype.formValidate = function () {
    var formdata = myApp.formToJSON('#form-changePwd');
    if (!formdata.oldPwd) {
        $$('.content-block-title.changePwd-Validatelog').text('请输入原密码');
        return false;
    }
    else if (formdata.oldPwd.length < 6) {
        $$('.content-block-title.changePwd-Validatelog').text('原密码长度至少6位');
        return false;
    }
    if (!formdata.newPwd) {
        $$('.content-block-title.changePwd-Validatelog').text('请输入新密码');
        return false;
    }
    else if (formdata.oldPwd.length < 6) {
        $$('.content-block-title.changePwd-Validatelog').text('新密码长度至少6位');
        return false;
    }
    if (!formdata.renewPwd) {
        $$('.content-block-title.changePwd-Validatelog').text('请再次输入新密码');
        return false;
    }
    else if (formdata.newPwd != formdata.renewPwd) {
        $$('.content-block-title.changePwd-Validatelog').text('两次密码输入不一致！');
        return false;
    }
    return true;
};