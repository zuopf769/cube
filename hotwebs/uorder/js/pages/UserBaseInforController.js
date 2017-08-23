UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.UserBaseInforController = function () { };
UOrderApp.pages.UserBaseInforController.prototype.preprocess = function (content, url, next) {
    var self = this;
    var context = $$.parseUrlQuery(url) || {};
    cb.rest.getJSON('ma/Users/getLoginUserInfo', function (data) {
        if (typeof data == 'string')
            data = JSON.parse(data);
        if (data.code != 200) {
            myApp.toast('获取用户信息失败！', 'error').show(true);
            return;
        }
        context.userInfo = data.data;
        self.userInfo = context.userInfo;
        context.serverhost = cb.rest.appContext.serviceUrl;
        var template = Template7.compile(content);
        var resultContent = template(context);
        next(resultContent);
    });
};
UOrderApp.pages.UserBaseInforController.prototype.pageInit = function (page) {
    var self = this;
    $$('div[data-page="userBaseInfoPage"] .userBaseInfo-btn-save').on('click', function () {
        if (self.formValidate()) {
            var formData = myApp.formToJSON('#form-userBaseInfoPage');
            formData.id = self.userInfo.user.id;

            cb.rest.postData('mc/Users/saveUser', { oUser: formData }, function (data) {
                if (typeof data == 'string')
                    data = JSON.parse(data);
                if (data.code != 200) {
                    myApp.toast('保存用户信息失败', 'error').show(true);
                    return;
                }
                myApp.toast('保存用户信息成功', 'success').show(true);
            });
        }
    });

    $$('div[data-page="userBaseInfoPage"] .userBaseInfoPage-change-userLogo').parent('.item-inner').on('click', function () {
        var buttons = [
       {
           text: '修改头像',
           label: true
       },
       {
           text: '拍照上传',
           bold: true,
           onClick: function () {
               if (window.plus) {
                   var cmr = plus.camera.getCamera();
                   cmr.captureImage(function (p) {
                       plus.io.resolveLocalFileSystemURL(p, function (entry) {
                           pic.src = entry.toLocalURL();
                           pic.realUrl = p;
                           myApp.toast("拍照图片：" + pic.realUrl, 'success').show(true);
                       }, function (e) {
                           myApp.toast("读取拍照文件错误：" + e.message, 'error').show(true);
                       });
                   }, function (e) {
                       myApp.toast("拍照失败：" + e.message, 'error').show(true);
                   });
               }
           }
       },
       {
           text: '本地上传',
           onClick: function () {
               plus.gallery.pick(function (p) {
                   pic.src = p;
                   pic.realUrl = pic.src;
                   myApp.toast("选择图片：" + pic.realUrl, 'success').show(true);
               });
           }
       },
       {
           text: '取消',
           color: 'red'
       },
        ];
        myApp.actions(buttons);
    });
};

UOrderApp.pages.UserBaseInforController.prototype.formValidate = function () {
    var formData = myApp.formToJSON('#form-userBaseInfoPage');
    if (!formData.cFullName) {
        myApp.toast('请输入姓名', 'tips').show(true);
        return false;
    }
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
    if (!formData.cEmail) {
        myApp.toast('请输入联系邮箱', 'tips').show(true);
        return false;
    }
    else {
        var myreg = /^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
        if (!myreg.test(formData.cEmail)) {
            myApp.toast('请输入正确格式的邮箱', 'tips').show(true);
            return false;
        }
    }
    if (formData.cQQ) {
        var myreg = /^[1-9][0-9]{4,9}$/;
        if (!myreg.test(formData.cQQ)) {
            myApp.toast('请输入正确的QQ号', 'tips').show(true);
            return false;
        }
    }
    return true;
};