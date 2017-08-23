UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.PaymentPageController = function () {
};
UOrderApp.pages.PaymentPageController.prototype.preprocess = function (content, url, next) {
    next(content);
}
UOrderApp.pages.PaymentPageController.prototype.pageInit = function (page) {
    var self = this;
    var query = page.query;
    if (query && query.oPayWayCode == "FIRSTPAY")
        $$('div[data-page="payment"] .payTypeContainer').find('input[value="1"]').prop('checked', true);
    //获取结算方式  
    cb.rest.getJSON('ma/SettlementWays/getSettlementWayTree?iDepth=1', function (data) {
        if (data.code != 200) {
            myApp.toast(data.message, 'error').show(true);
            return;
        }
        var container = $$('div[data-page="payment"] .settlementWayContainer');

        var radio = '';
        for (var i = 0; i < data.data.length; i++) {
            var item = data.data[i];
            radio += '<div class="pay-style">' +
                               '<input type="radio" name="settlementWay" data-text="'+item.cName+'" value="' + item.id + '">' +
                                '<span>' + item.cName + '</span>' +
                         '</div>';
        }
        container.html(radio);
        if (query)
            container.find('input[value="' + query.oSettlementWayCode + '"]').prop('checked', true);
    });
    //获取发货方式列表
    cb.rest.getJSON('ma/ShippingChoices/getShippingChoices', function (data) {
        if (data.code != 200) {
            myApp.toast(data.message, 'error').show(true);
            return;
        }
        var container = $$('div[data-page="payment"] .shippingChoicesContainer');

        var radio = '';
        for (var i = 0; i < data.data.length; i++) {
            var item = data.data[i];
            radio += '<div class="pay-style">' +
                               '<input type="radio" name="shippingChoices" data-text="' + item.cName + '"  value="' + item.id + '">' +
                                '<span>' + item.cName + '</span>' +
                         '</div>';
        }
        container.html(radio);
        if (query)
            container.find('input[value="' + query.oShippingChoiceCode + '"]').prop('checked', true);
    });

    $$('div[data-page="payment"] .isDefalutPayType').on('click', function () {
        $$(this).toggleClass('default');
    });

    $$('div[data-page="payment"] .button.payment_save').on('click', function (e) {
        var shoppingcontainer = $$('div[data-page="payment"] .shippingChoicesContainer');
        var paymentcontainer = $$('div[data-page="payment"] .settlementWayContainer');
        var payTypecontainer = $$('div[data-page="payment"] .payTypeContainer');

        var param = {
            oPayWayCode: payTypecontainer.find('input:checked').val(),
            oPayWayName: payTypecontainer.find('input:checked').attr('data-text'),
            oSettlementWayCode: paymentcontainer.find('input:checked').val(),
            oSettlementWayName: paymentcontainer.find('input:checked').attr('data-text'),
            oShippingChoiceCode: shoppingcontainer.find('input:checked').val(),
            oShippingChoiceName: shoppingcontainer.find('input:checked').attr('data-text')
        };
    });
};