UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.invoicePageController = function () {
};
UOrderApp.pages.invoicePageController.prototype.preprocess = function (content, url, next) {
    var self = this;
    next(content);
};
UOrderApp.pages.invoicePageController.prototype.pageInit = function (page) {
    var self = this;
    var fromDetail = $$("#invoice_form li").eq(0).nextAll();
    if (page.query) {
        myApp.formFromJSON('#invoice_form', page.query);
        if (page.query.cInvoiceType == "NONE") {//不开发票时,将其余详情隐藏
            fromDetail.hide();
        }
    }
   
    //加载发票类型
    cb.rest.getJSON('Enums/getInvoiceTypes', function (data) {
        if (data.code != 200) {
            myApp.toast(data.message, 'error').show(true); //✕✓
            return;
        }
        var container = $$('div[data-page="invoice"] .invoiceTypeContent');
        var option = '';
        for (var i = 0; i < data.data.length; i++) {
            var item = data.data[i];
            option += '<div class="pay-style">' +
                            '<input type="radio" name="invoiceType" data-text="' + item.cName + '" value="' + item.cCode + '">' +
                            '<span>' + item.cName + '</span>' +
                      '</div>';
        }
        container.html(option);
        if (page.query && page.query.cInvoiceType)
            container.find('input[value="' + page.query.cInvoiceType + '"]').prop('checked', true);
        else
            container.find('input').eq(0).prop('checked', true);

        container.find('input').on('change', function () {
            if ($$(this).val() == 'NONE')
                fromDetail.hide();
            else
                fromDetail.show();
        });
    });

    $$('.invoice_save').on('click', function (e) {
        var formData = myApp.formToJSON('#invoice_form');
        formData.cInvoiceType = $$('div[data-page="invoice"] .invoiceTypeContent').find('input:checked').val();
        formData.cInvoiceName = $$('div[data-page="invoice"] .invoiceTypeContent').find('input:checked').attr('data-text');

        formData.cBankCode = $$('#invoiceBankName').data('value');
        var pageVewList = $$(myApp.mainView.pagesContainer).find('.page');
        $$(myApp.mainView.pagesContainer).find('.page')[pageVewList.length - 1].f7PageData.query = { invoiceData: formData };
        myApp.mainView.router.back({
            query: { invoiceData: formData }
        });
    });
    //获取银行信息
    $$('.page[data-page="invoice"] .bankName').on('click', function (e) {
        myApp.mainView.router.loadPage({
            url: 'pages/smartSelect.html',
            query: {
                backOnSelect: true,
                pageTitle: "选择银行",
                fieldValue: 'id',
                fieldName: 'cName',
                phoneImg: 'cPhoneImage',
                serverUrl: 'BaseData/getBanks',
                container: $$('#invoiceBankName'),
                selectValue: self.bankId
            }
        });
    });

    $$(document).on('pageAfterBack', '.page[data-page="SmartSelectListPage"]', function (e) {
        var page = e.detail.page;
        if (page.query.value && page.query.name) {
            page.query.container.data('value', page.query.value).val(page.query.name);
        }
    });
};