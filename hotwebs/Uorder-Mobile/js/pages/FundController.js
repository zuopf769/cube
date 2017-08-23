UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.FundController = function () { };
UOrderApp.pages.FundController.prototype.preprocess = function (content, url, next) {
    var context = $$.parseUrlQuery(url) || {};
    //ªÒ»°’Àªß”‡∂Ó
    cb.rest.getJSON('ma/Payments/getBalance', function (data) {
        if (typeof data == 'string')
            data = JSON.parse(data);
        if (data.code == 200) {
            var total = parseFloat(data.data.iPayNotUsedAmount) + parseFloat(data.data.iRebateNotUsedAmount);
            var data = {
                total: total.toFixed(2),
                iPayNotUsedAmount: data.data.iPayNotUsedAmount.toFixed(2),
                iRebateNotUsedAmount: data.data.iRebateNotUsedAmount.toFixed(2)
            };
            var template = Template7.compile(content);
            var resultContent = template(data);

            next(resultContent);
        }
    });
};

UOrderApp.pages.FundController.prototype.pageInit = function (page) {

};

