UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.CategoryPageController = function () {
    this.contentTpl = Template7.compile($$('#categoryTemplate').html());
};
UOrderApp.pages.CategoryPageController.prototype.preprocess = function (content, url, next) {
    var self = this;
    cb.rest.getJSON('ma/ProductClasses/getClasses', function (data) {
        if (data.code == 200) {
            self.CategoryData = data;
            var template = Template7.compile(content);
            var resultContent = template(data);
            next(resultContent);
        }
        else
            myApp.toast(data.mesage, 'error').show(true);
    });
};
UOrderApp.pages.CategoryPageController.prototype.pageInit = function (page) {
    var contentTpl = this.contentTpl;
    var pageContainer = $$(page.container);
    var self = this;
    pageContainer.find('.category-list').on('click', function (e) {
        var link = $$(e.target);
        var list = link.parents('ul');
        list.children('li').removeClass('cur');
        link.parent('li').addClass('cur');
        var id = link.dataset()['id'];

        if (self.CategoryData) {
            for (var i = 0; i < self.CategoryData.data.length; i++) {
                if (self.CategoryData.data[i].id == id) {
                    var data = self.CategoryData.data[i];
                    data.serviceUrl = cb.rest.appContext.serviceUrl;
                    $$('.category-content').html(contentTpl(data));
                    myApp.initImagesLazyLoad(myApp.mainView.activePage.container);
                    break;
                }
            }
        }
    });
    pageContainer.find('.category-list').children('li:first-child').children('a').trigger('click');
};