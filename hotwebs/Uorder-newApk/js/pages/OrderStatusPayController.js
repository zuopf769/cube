UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.OrderStatusPayController = function () {};
UOrderApp.pages.OrderStatusPayController.prototype.preprocess = function (content, url, next) {
    var context = $$.parseUrlQuery(url) || {};
    if (!context.pid) return;    

    cb.rest.getJSON('ma/Payments/getPayment?id=' + context.pid, function (data) {
        if (data.code != 200) {
            myApp.toast('获取支付单列表信息失败', 'error').show(true);
            return;
        }
        var payment = data.data;
        payment.serverUrl = cb.rest.appContext.serviceUrl;

        var template = Template7.compile(content);
        var resultContent = template(data.data);
        next(resultContent);
    });
};

