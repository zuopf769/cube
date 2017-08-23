UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.PaymentPageController = function () {
};
UOrderApp.pages.PaymentPageController.prototype.preprocess = function (content, url, next) {
    next(content);
}
UOrderApp.pages.PaymentPageController.prototype.pageInit = function (page) {
    var self = this;
    //获取结算方式    
    cb.rest.getJSON('ma/SettlementWays/getSettlementWayTree?iDepth=1', function (data) {
        if (data.code == 200) {
            self.settleWay = data.data;
            var values = [];
            for (var i = 0; i < data.data.length; i++) {
                values.push(data.data[i].cName);
            }
            var myPicker = myApp.picker({
                input: '#invoiceSettleway',
                toolbarCloseText: '关闭',
                rotateEffect: true,
                cols: [
                    {
                        values: values
                    }
                ]
            });
        }
        else {
            myApp.toast(data.message, 'error').show(true);
        }
    });
    //获取发货方式列表
    cb.rest.getJSON('ma/ShippingChoices/getShippingChoices', function (data) {
        if (data.code == 200) {
            self.shipping = data.data;
            var values = [];
            for (var i = 0; i < data.data.length; i++) {
                values.push(data.data[i].cName);
            }
            var myPicker = myApp.picker({
                input: '#invoiceShipping',
                rotateEffect: true,
                toolbarCloseText: '关闭',
                cols: [
                    {
                        values: values
                    }
                ]
            });
        } else {
            myApp.toast(data.message, 'error').show(true);
        }
    });
    var myPicker1 = myApp.picker({
        input: '#invoicePayway',
        rotateEffect: true,
        toolbarCloseText: '关闭',
        cols: [
            {
                values: ['货到付款', '款到发货']
            }
        ]
    });
    if (page.query) {
        myApp.formFromJSON('#paymentForm', page.query);
    }
    $$('.payment_save').on('click', function (e) {
        var formData = myApp.formToJSON('#paymentForm');//收集数据
        for (var i = 0; i < self.settleWay.length; i++) {
            if (self.settleWay[i].cName == formData.settleWay) {
                formData.settleWay_code = self.settleWay[i].cCode;
                formData.settleWay_id = self.settleWay[i].id;
            }
        }
        for (var i = 0; i < self.shipping.length; i++) {
            if (self.shipping[i].cName == formData.shipping) {
                formData.shippingCode = self.shipping[i].cCode;
            }
        }
        var pageVewList = $$(myApp.mainView.pagesContainer).find('.page');
        $$(myApp.mainView.pagesContainer).find('.page')[pageVewList.length - 1].f7PageData.query = formData;
        myApp.mainView.router.back({
            query: formData
        });
    });
};