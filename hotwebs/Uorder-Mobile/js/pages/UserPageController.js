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

        cb.rest.getJSON("ma/Corprations/getCorpInfo", function (data2) {
            if (typeof data2 == 'string')
                data2 = JSON.parse(data);
            if (data2 && data2.code == 200) {
                context.servePhone = data2.data.cPhone;
                context.userInfo = data.data;
                context.serverhost = cb.rest.appContext.serviceUrl;
                var template = Template7.compile(content);
                var resultContent = template(context);
                next(resultContent);
            }
            else {
                myApp.toast('获取客服热线失败,请联系管理员!', 'error').show(true);
            }
        });
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

    $$(".account-infor.btnFavorite").on("click", function () {
        myApp.mainView.router.loadPage({
            url: 'pages/products.html?dataType=favoriteProduct&nosort=yes'
        });
    });

    $$(".account-infor.btnHistory").on("click", function () {
        myApp.mainView.router.loadPage({
            url: 'pages/products.html?dataType=historyProduct&nosort=yes'
        });
    });

    //获取账户余额
    cb.rest.getJSON('ma/Payments/getBalance', function (data) {
        if (typeof data == 'string')
            data = JSON.parse(data);
        if (data.code == 200) {
            var total = parseFloat(data.data.iPayNotUsedAmount) + parseFloat(data.data.iRebateNotUsedAmount);
            $$('.item-content.moneyContent').find('.item-after').html('￥' + total.toFixed(2));
        }
    });
};