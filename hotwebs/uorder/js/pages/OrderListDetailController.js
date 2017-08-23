UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.OrderListDetailController = function () {
    this.productFunc = Template7.compile($$('#orderProductTpl').html());
};
UOrderApp.pages.OrderListDetailController.prototype.preprocess = function (content, url, next) {
    next(content);
};
UOrderApp.pages.OrderListDetailController.prototype.pageInit = function (page) {
    var pageData = page.query;
    if (pageData.type == 'product') {
        var html = this.productFunc(pageData);
        $$('div[data-page="OrderListDetail"] .productList_ul').html(html);
    }
    else {

    }
    $$('div[data-page="OrderListDetail"] .navtitleName').text(pageData.title);
    $$('div[data-page="OrderListDetail"] .listQuantity').text(pageData.data.length);

    myApp.initImagesLazyLoad(myApp.mainView.activePage.container);
};