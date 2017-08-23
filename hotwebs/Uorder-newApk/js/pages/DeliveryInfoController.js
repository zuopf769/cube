UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.DeliveryInfoController = function () { };
UOrderApp.pages.DeliveryInfoController.prototype.preprocess = function (content, url, next) {
    var context = $$.parseUrlQuery(url) || {};
    if (!context.oid) {
        myApp.toast('发货单编号为空！', 'tips').show(true);
        return;
    }
    var self = this;
    cb.rest.getJSON('ma/Deliverys/getDeliveryByNo', { cDeliveryNo: context.oid }, function (data) {
        if (data.code != 200) {
            myApp.toast('获取发货单详情失败！', 'error').show(true);
            return;
        }
        context.deliveryDetail = data.data;
        context.serverhost = cb.rest.appContext.serviceUrl;
        var template = Template7.compile(content);
        var resultContent = template(context);

        next(resultContent);
    });
};
UOrderApp.pages.DeliveryInfoController.prototype.pageInit = function (page) {
    $$('.toolbar .order-btn a').on('click', function (e) {
        var btnType = $$(this).attr('data-btnType');
        var orderNo = $$(this).parent().data("orderno");
        if (!orderNo) {
            myApp.toast('单据编号不存在', 'error').show(true);
            myApp.mainView.router.back();
            return;
        }
        switch (btnType) {
            case "received":
                cb.rest.postData('mc/Deliverys/takeDelivery', { deliveryNo: orderNo }, function (data) {
                    if (data.code != 200) {
                        myApp.toast(data.message, 'error').show(true);
                        return;
                    }
                    myApp.toast('收货成功', 'success').show(true);
                    myApp.mainView.router.back();
                });
                break;
        }
    });

    myApp.initImagesLazyLoad(myApp.mainView.activePage.container);
};