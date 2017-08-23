UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.OrderStatusController = function () { };
UOrderApp.pages.OrderStatusController.prototype.preprocess = function (content, url, next) {
    var context = $$.parseUrlQuery(url) || {};
    if (!context.orderId) {
        myApp.toast('单据编号不能为空', 'error').show(true);
        myApp.mainView.router.back();
        return;
    }
    var params = { cOrderNo: context.orderId };
    cb.rest.getJSON('ma/orders/getOrderDetail', params, function (data) {
        if (data.code != 200) {
            myApp.toast('获取订单详情失败！', 'error').show(true);
            return;
        }
        context.orderDetail = data.data;

        var template = Template7.compile(content);
        var resultContent = template(context);

        next(resultContent);
        if (context.orderDetail.cNextStatus == "OPPOSE" || context.orderDetail.cStatusCode == "OPPOSE") {
            $$("#normalState").hide();
            $$("#cancleState").show();
            if (context.orderDetail.cNextStatus == "OPPOSE")
                $$('#cancleState dl').eq(1).addClass('active');
            $$('#cancleState dl').eq(0).find('em').text(context.orderDetail.dOrderDate);
            $$('#cancleState dl').eq(1).find('em').text(context.orderDetail.dConfirmDate);
        }
        else {
            var orderStatusDict = ['SUBMITORDER', 'CONFIRMORDER', 'DELIVERGOODS', 'TAKEDELIVERY', 'ENDORDER'];
            var arrIndex = orderStatusDict.indexOf(context.orderDetail.cNextStatus);
            if (arrIndex >= 0) {
                $$('.orderstatu-content dl').each(function (index, item) {
                    if (index < arrIndex) {
                        if (index < arrIndex - 1)
                            $$(this).addClass('actived');
                        else
                            $$(this).addClass('active');
                        switch (index) {
                            case 0:
                                $$(this).find('em').text(context.orderDetail.dOrderDate);
                                break;
                            case 1:
                                $$(this).find('em').text(context.orderDetail.dConfirmDate);
                                break;
                            case 2:
                                break;
                            case 3:
                                break;
                            case 4:
                                break;
                        }
                    }
                });
            }
        }
    });
};