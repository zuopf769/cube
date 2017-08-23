UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.OrderInfoController = function () {};
UOrderApp.pages.OrderInfoController.prototype.preprocess = function (content, url, next) {
    var context = $$.parseUrlQuery(url) || {};
    if (!context.oid) {
        myApp.toast('订单编号为空！', 'tips').show(true);
        return;
    }

    var params = { cOrderNo: context.oid };
    cb.rest.getJSON('ma/orders/getOrderDetail', params, function (data) {
        if (typeof data == 'string')
            data = JSON.parse(data);
        if (data.code != 200) {
            myApp.toast('获取订单详情失败！', 'error').show(true);
            return;
        }
        context.orderDetail = data.data;

        var template = Template7.compile(content);
        var resultContent = template(context);

        next(resultContent);

        $$('.product-listpage').data('listData', context.orderDetail.oOrderDetails);
    });
};
UOrderApp.pages.OrderInfoController.prototype.pageInit = function (page) {
    //alert();
    $$('.toolbar-inner.orderInfo-btngroup').find('a').on('click', function (e) {
        var btnType = $$(this).attr('data-btnType');
        var orderNo = $$(this).parents('.orderInfo-btngroup').attr('data-orderNo');
        if (!orderNo) {
            myApp.toast('单据编号不存在', 'error').show(true);
            myApp.mainView.router.back();
            return;
        }
        switch (btnType) {
            case "del":
                var param = { cOrderNo: orderId };
                cb.rest.postData('ma/orders/delOrder', param, function (data) {
                    if (typeof data == 'string')
                        data = JSON.parse(data);
                    if (data.code != 200) {
                        myApp.toast('删除订单失败', 'error').show(true);
                        return;
                    }
                    myApp.toast('删除订单成功', 'success').show(true);
                    myApp.mainView.router.back();
                });
                break;
        }
    });

    $$('.product-listpage').on('click', function (e) {
        myApp.mainView.router.loadPage({
            url: "pages/orderListDetail.html",
            query: {
                title: "商品清单",
                type:"product",
                data: $$(this).data('listData')
            }
        });
    });
}