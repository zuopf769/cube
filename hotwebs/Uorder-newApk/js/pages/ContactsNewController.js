UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.ContactsNewController = function () { };
UOrderApp.pages.ContactsNewController.prototype.preprocess = function (content, url, next) {
    next(content);
};
UOrderApp.pages.ContactsNewController.prototype.pageInit = function (page) {
    var self = this;
    if (page.query.id) {
        this.contactid = page.query.id;
        var param = {
            contactid: page.query.id
        };
        cb.rest.getJSON('ma/Agents/getAgentContact', param, function (data) {
            if (data.code != 200) {
                myApp.toast('获取用户信息失败！', 'error').show(true);
                return;
            }
            var formdata = data.data;
            if (formdata.bDefault)
                $$('div[data-page="addContactPage"] li.isDefault').addClass('default');

            myApp.formFromJSON('#form-ContactManage', formdata);
            if (formdata.cMobile) {
                var container = $$('#form-ContactManage').find('input[name="cMobile"]').parent().next('.hideForAdd');
                container.find('.icon-message').parent().attr('href', 'sms:' + formdata.cMobile);
                container.find('.icon-phone').parent().attr('href', 'tel:' + formdata.cMobile);
            }
            if (formdata.cTelePhone) {
                var container = $$('#form-ContactManage').find('input[name="cTelePhone"]').parent().next('.hideForAdd');
                container.find('.icon-phone').parent().attr('href', 'tel:' + formdata.cTelePhone);
            }
        });
        $$('div[data-page="addContactPage"] .contactPage-btn-del').parents('.list-block.m-t-10').show();
        $$('div[data-page="addContactPage"] .contactPage-btn-del').on('click', function () {
            var params = {
                ids: [self.contactid]
            };
            cb.confirm('确定要删除此联系人吗？', '提示信息', function () {
                cb.rest.postData('mc/Agents/deleteAgentContact', params, function (data) {
                    if (data.code != 200) {
                        myApp.toast(data.message, 'error').show(true);
                        return;
                    }
                    myApp.toast('删除联系人成功！', 'success').show(true);
                    myApp.mainView.router.back();
                });
            });
        });

        $$('div[data-page="addContactPage"]').children('.navbar').find('.center').text('编辑联系人');
        $$('div[data-page="addContactPage"] #form-ContactManage').find('.hideForAdd').show();
    }
    else {
        self.contactid = null;
        $$('div[data-page="addContactPage"] .contactPage-btn-del').parents('.list-block.m-t-10').hide();
        $$('div[data-page="addContactPage"] #form-ContactManage').find('.hideForAdd').hide();
    }

    $$('div[data-page="addContactPage"] li.isDefault').on('click', function () {
        $$(this).toggleClass('default');
    })

    $$('div[data-page="addContactPage"] .contactManage-btn-submit a').on('click', function () {
        if (!self.formValidate()) return;
        var data = myApp.formToJSON('#form-ContactManage');
        if (self.contactid)
            data.id = self.contactid;
            data.bDefault = $$('div[data-page="addContactPage"] li.isDefault').hasClass('default');

        cb.rest.postData('mc/Agents/saveAgentContact', { newcontact: data }, function (data) {
            if (data.code != 200) {
                myApp.toast(data.message, 'error').show(true);
                return;
            }
            delete self.contactid;
            myApp.toast('保存联系人成功！', 'success').show(true);
            myApp.mainView.router.back();
        });
    });
};

UOrderApp.pages.ContactsNewController.prototype.formValidate = function () {
    var formData = myApp.formToJSON('#form-ContactManage');
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
    if (formData.cEmail) {
        var myreg = /^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
        if (!myreg.test(formData.cEmail)) {
            myApp.toast('请输入正确格式的邮箱', 'tips').show(true);
            return false;
        }
    }
    return true;
};