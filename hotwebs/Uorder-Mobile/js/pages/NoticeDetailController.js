UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.NoticeDetailController = function () {};
UOrderApp.pages.NoticeDetailController.prototype.preprocess = function (content, url, next) {
    var context = $$.parseUrlQuery(url) || {};
    cb.rest.getJSON('ma/notices/notice', { id: context.id }, function (data) {
        if (data.code != 200) {
            myApp.toast(data.message, 'error').show(true);
            return;
        }
        context.noticeInfo = data.data;
        context.noticeInfo.hasFile = context.noticeInfo.oAttachments && context.noticeInfo.oAttachments.length > 0
        //context.serverhost = cb.rest.appContext.serviceUrl;
        var template = Template7.compile(content);
        var resultContent = template(context);
        next(resultContent);
    });
};
UOrderApp.pages.NoticeDetailController.prototype.pageInit = function (page) {
};