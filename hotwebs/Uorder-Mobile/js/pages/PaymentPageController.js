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
        if (typeof data == 'string')
            data = JSON.parse(data);

        if (data.code != 200) {
            myApp.toast(data.message, 'error').show(true);
            return;
        }
        var container = $$('div[data-page="payment"] .settlementWayContainer');
        
        var radio = '';
        for (var i = 0; i < data.data.length; i++) {
            var item = data.data[i];
            radio += '<div class="pay-style">' +
                               '<input type="radio" name="settlementWay" value="'+item.id+'">' +
                                '<span>' + item.cName + '</span>' +
                         '</div>';
            container.html(radio);
        }
    });
    //获取发货方式列表
    cb.rest.getJSON('ma/ShippingChoices/getShippingChoices', function (data) {
        if (typeof data == 'string')
            data = JSON.parse(data);

        if (data.code != 200) {
            myApp.toast(data.message, 'error').show(true);
            return;
        }
        var container = $$('div[data-page="payment"] .shippingChoicesContainer');

        var radio = '';
        for (var i = 0; i < data.data.length; i++) {
            var item = data.data[i];
            radio += '<div class="pay-style">' +
                               '<input type="radio" name="shippingChoices" value="' + item.id + '">' +
                                '<span>' + item.cName + '</span>' +
                         '</div>';
            container.html(radio);
        }
    });
    
    $$('div[data-page="payment"] .isDefalutPayType').on('click', function () {
        $$(this).toggleClass('default');
    });

    $$('.payment_save').on('click', function (e) {
       
    });
};