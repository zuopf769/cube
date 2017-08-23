UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.OrderStatusInvoiceController = function () {
   
};
UOrderApp.pages.OrderStatusInvoiceController.prototype.preprocess = function (content, url, next) {
    var context = $$.parseUrlQuery(url) || {};
    next(content);
};

