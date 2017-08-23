UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.SearchPageController = function () { };
UOrderApp.pages.SearchPageController.prototype.preprocess = function (content, url, next) {
    next(content);
};