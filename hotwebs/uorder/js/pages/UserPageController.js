UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.UserPageController = function () { };
UOrderApp.pages.UserPageController.prototype.preprocess = function (content, url, next) {
    var context = $$.parseUrlQuery(url) || {};
    cb.rest.getJSON('ma/Users/getUserBaseInfo', function (data) {
        if (typeof data == 'string')
            data = JSON.parse(data);
        if (data.code != 200) {
            myApp.toast('获取登录账户信息失败', 'error').show(true);
            return;
        }
        context.userInfo = data.data;
        context.serverhost = cb.rest.appContext.serviceUrl;
        var template = Template7.compile(content);
        var resultContent = template(context);
        next(resultContent);
    });
};
UOrderApp.pages.UserPageController.prototype.pageInit = function (page) {
    $$('div[data-page="user"] .user-btn-OrderList').on('click', function () {
        myApp.mainView.router.loadPage({
            url: 'pages/orderList.html'
        });
    });

    $$('div[data-page="user"] .user-btn-OrderType').children('a').on('click', function () {
        myApp.mainView.router.loadPage({
            url: 'pages/orderList.html',
            query: {
                showOrderType: $$(this).attr('data-filter')
            }
        });
    });
};