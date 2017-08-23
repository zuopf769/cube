UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.UserBaseInfoEditController = function () { };
UOrderApp.pages.UserBaseInfoEditController.prototype.preprocess = function (content, url, next) {
    var self = this;
    var context = $$.parseUrlQuery(url) || {};
    var showNameList = {
        cFullName: '姓名',
        cDepartment: '部门',
        cPosition: '职位',
        cMobile: '联系电话',
        cEmail: '邮箱',
        cQQ: 'QQ'
    };
    self.fieldName = context.fieldName;

    cb.rest.getJSON('ma/Users/getLoginUserInfo', function (data) {
        if (data.code != 200) {
            myApp.toast('获取用户信息失败！', 'error').show(true);
            return;
        }
        context.userInfo = data.data.user;
        self.userInfo = data.data;
        var data = {};
        data[context.fieldName] = context.userInfo[context.fieldName];
        data.showName = showNameList[context.fieldName];

        var template = Template7.compile(content);
        var resultContent = template(data);
        next(resultContent);
    });
};

UOrderApp.pages.UserBaseInfoEditController.prototype.pageInit = function (page) {
    var self = this;

    $$('div[data-page="userBaseInfoEditPage"]').children('.navbar').find('.userBaseInfo-btnSave').on('click', function () {
        var val = $$('div[data-page="userBaseInfoEditPage"]').children('.page-useBaseInfoEdit-content').find('input[name="' + self.fieldName + '"]').val();
        var fieldName = self.fieldName;
        var obj = new Object();
        obj[fieldName] = val;

        if (self.formValidate(obj)) {
            var formData = self.userInfo.user;
            formData[fieldName] = val;

            cb.rest.postData('mc/Users/saveUser', { oUser: formData }, function (data) {
                if (data.code != 200) {
                    myApp.toast(data.message, 'error').show(true);
                    return;
                }
                myApp.toast('保存用户信息成功', 'success').show(true);
            });
        }
    });
};

UOrderApp.pages.UserBaseInfoEditController.prototype.formValidate = function (formData) {
    if (formData.hasOwnProperty('cFullName') && !formData.cFullName) {
        myApp.toast('请输入姓名', 'tips').show(true);
        return false;
    }
    if (formData.hasOwnProperty('cMobile')) {
        if (!formData.cMobile) {
            myApp.toast('请输入联系电话', 'tips').show(true);
            return false;
        }
        else {
            var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
            if (!myreg.test(formData.cMobile)) {
                myApp.toast('请输入正确的手机号码', 'tips').show(true);
                return false;
            }
        }
    }
    if (formData.hasOwnProperty('cEmail')) {
        if (formData.cEmail) {
            var myreg = /^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
            if (!myreg.test(formData.cEmail)) {
                myApp.toast('请输入正确格式的邮箱', 'tips').show(true);
                return false;
            }
        }
        else {
            myApp.toast('请输入联系邮箱', 'tips').show(true);
            return false;
        }
    }

    if (formData.hasOwnProperty('cQQ') && formData.cQQ) {
        var myreg = /^[1-9][0-9]{4,9}$/;
        if (!myreg.test(formData.cQQ)) {
            myApp.toast('请输入正确的QQ号', 'tips').show(true);
            return false;
        }
    }
    return true;
};