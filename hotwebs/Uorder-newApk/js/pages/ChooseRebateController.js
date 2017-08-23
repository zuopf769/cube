UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.ChooseRebateController = function () {
   
};
UOrderApp.pages.ChooseRebateController.prototype.preprocess = function (content, url, next) {
    var context = $$.parseUrlQuery(url) || {};
    next(content);
};

