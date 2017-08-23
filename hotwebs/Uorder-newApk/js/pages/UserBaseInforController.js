UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.UserBaseInforController = function () { };
UOrderApp.pages.UserBaseInforController.prototype.preprocess = function (content, url, next) {
    var self = this;
    var context = $$.parseUrlQuery(url) || {};
    cb.rest.getJSON('ma/Users/getLoginUserInfo', function (data) {
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
    
    $$(document).on('pageAfterBack', '.page[data-page="userBaseInfoEditPage"]', function (e) {
       myApp.mainView.router.refreshPage();
    });
};