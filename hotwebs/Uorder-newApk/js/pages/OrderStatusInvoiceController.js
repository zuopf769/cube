UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.OrderStatusInvoiceController = function () {

};
UOrderApp.pages.OrderStatusInvoiceController.prototype.preprocess = function (content, url, next) {
    var context = $$.parseUrlQuery(url) || {};
    if (!context.orderId) {
        myApp.toast('未获取单据编号', 'error').show(true);
        myApp.mainView.router.back();
        return;
    }
    var params = { cOrderNo: context.orderId };
    cb.rest.getJSON('ma/orders/getOrderDetail', params, function (data) {
        if (data.code != 200) {
            myApp.toast('获取订单详情失败！', 'error').show(true);
            return;
        }
        var template = Template7.compile(content);
        var resultContent = template(data.data);

        next(resultContent);
    });
};

