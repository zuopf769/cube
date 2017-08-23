UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.BaseInfoController = function () { };
UOrderApp.pages.BaseInfoController.prototype.preprocess = function (content, url, next) {
    next(content);
};
UOrderApp.pages.BaseInfoController.prototype.pageInit = function (page) {
    var calendarDefault = myApp.calendar({
        input: '#calendar-default',
    });
    if (page.query) {
        myApp.formFromJSON('#baseInfo', page.query);
    }
    $$('.button.baseInfo-submit').on('click', function (e) {
        var formData = myApp.formToJSON('#baseInfo');
        var pageVewList = $$(myApp.mainView.pagesContainer).find('.page');
        $$(myApp.mainView.pagesContainer).find('.page')[pageVewList.length - 1].f7PageData.query = formData;
        myApp.mainView.router.back({
            query: formData
        });
    });
};