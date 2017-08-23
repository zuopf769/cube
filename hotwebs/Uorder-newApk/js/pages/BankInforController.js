UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.BankInforController = function () {
    this.bankItemFunc = Template7.compile($$('#bankItemTpl').html());
};
UOrderApp.pages.BankInforController.prototype.preprocess = function (content, url, next) {
    next(content);
};
UOrderApp.pages.BankInforController.prototype.pageInit = function (page) {
    var self = this;
    cb.rest.getJSON('ma/Agents/getAgentFinancialsWithStoped', function (data) {
        if (data.code != 200) {
            myApp.toast('获取银行信息列表失败', 'error').show(true);
            return;
        }
        var resultHtml = self.bankItemFunc({ banksList: data.data,serverhost : cb.rest.appContext.serviceUrl });
        $$('.page[data-page="bandInfoListPage"] .bandInfoListPage-container').html(resultHtml);
    });

    $$(document).on('pageBack', '.page[data-page="bandInfoManagePage"]', function (e) {
        cb.rest.getJSON('ma/Agents/getAgentFinancialsWithStoped', function (data) {
            if (data.code != 200) {
                myApp.toast('获取银行信息列表失败', 'error').show(true);
                return;
            }
            var resultHtml = self.bankItemFunc({ banksList: data.data, serverhost: cb.rest.appContext.serviceUrl });
            $$('.page[data-page="bandInfoListPage"] .bandInfoListPage-container').html(resultHtml);
        });
    });
};