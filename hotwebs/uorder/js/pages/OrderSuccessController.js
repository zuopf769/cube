UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.OrderSuccessController = function () {
    this.OrderSuccessDetailFunc = Template7.compile($$('#OrderSuccessDetail').html());
};
UOrderApp.pages.OrderSuccessController.prototype.preprocess = function (content, url, next) {
    next(content);
};
UOrderApp.pages.OrderSuccessController.prototype.pageInit = function (page) {
    var self=this;
    var orderId = page.query;
    cb.rest.getJSON('ma/orders/getOrderDetail', { cOrderNo: orderId }, function (data) {
        if (typeof data == 'string')
            data = JSON.parse(data);
        if (data.code != 200) {
            myApp.toast('获取订单信息失败', 'error').show(true);
            return;
        }
        var html = self.OrderSuccessDetailFunc(data.data);
        $$('div[data-page="OrderSuccess"]').find('.order-infor.OrderSuccessInfo').html(html);
    });

    $$('.icon-btn.OrderSuccess-viewOrder').on('click', function () {
        myApp.mainView.router.loadPage({
            url: 'pages/orderList.html'
        });
    });

    $$('.right.OrderSuccess-viewOrder').on('click', function () {
        $$('.icon-btn.OrderSuccess-viewOrder').trigger('click');
    });

    $$('.icon-btn.OrderSuccess-returnHome').on('click', function () {
        $$('#view-1').trigger('show');
        myApp.showToolbar('.toolbar.homeNavBar');
    });

    $$('.icon-btn.OrderSuccess-stroll').on('click', function () {
        $$('#view-1').trigger('show');
        myApp.showToolbar('.toolbar.homeNavBar');
    });
};