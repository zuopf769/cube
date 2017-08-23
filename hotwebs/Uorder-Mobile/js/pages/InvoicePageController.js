UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.invoicePageController = function () {
};
UOrderApp.pages.invoicePageController.prototype.preprocess = function (content, url, next) {
    var self = this;
    next(content);
    cb.rest.getJSON('BaseData/getBanks', function (data) {
        if (data) {
            self.data = data.data;
            var banks = data.data;
            var allBanks = {};
            allBanks['常用银行'] = [];
            for (var i = 0; i < banks.length; i++) {
                if (banks[i].bHot == true) {
                    allBanks['常用银行'].push(banks[i].cName);
                }
                var flag = banks[i].cFlag.slice(0, 1).toUpperCase();
                if (!allBanks[flag]) {
                    allBanks[flag] = [];
                }
                allBanks[flag].push(banks[i].cName);
            }
            self.banks = allBanks;
        } else {
            myApp.toast(data.message, 'error').show(true); //✕✓
        }
    });
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
        if (typeof data == 'string')
            data = JSON.parse(data);

        if (data.code != 200) {
            myApp.toast(data.message, 'error').show(true); //✕✓
            return;
        }
        var container = $$('div[data-page="invoice"] .invoiceTypeContent');
        var option = '';
        for (var i = 0; i < data.data.length; i++) {
            var item = data.data[i];
            option += '<div class="pay-style">' +
                            '<input type="radio" name="invoiceType" value="' + item.cCode + '">' +
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
    //是否默认开关
    $$('#invoice_form .isDefault').on('click', function () {
        $$(this).toggleClass('default');
    });

    $$('.invoice_save').on('click', function (e) {
        var formData = myApp.formToJSON('#invoice_form');
        formData.cInvoiceType = $$('div[data-page="invoice"] .invoiceTypeContent').find('input:checked').val();

        for (var i = 0; i < self.data.length; i++) {
            if (self.data[i].cName == formData.cBankName) {
                formData.cBankCode = self.data[i].cCode;
            }
        }
        var pageVewList = $$(myApp.mainView.pagesContainer).find('.page');
        $$(myApp.mainView.pagesContainer).find('.page')[pageVewList.length - 1].f7PageData.query = formData;
        myApp.mainView.router.back({
            query: formData
        });
    });
    $$('.page[data-page="invoice"] .bankName').on('click', function (e) {
        var banks = self.banks;
        var flags = [];
        for (key in self.banks) {
            flags.push(key);
            flags.sort();
            flags.unshift('常用银行');
            flags.pop();
        }
        var myPicker = myApp.picker({
            input: '#invoiceBankName',
            rotateEffect: true,
            toolbarCloseText: '关闭',
            formatValue: function (picker, values) {
                return values[1];
            },
            cols: [
                {
                    textAlign: 'left',
                    values: flags,
                    onChange: function (picker, country) {
                        if (picker.cols[1].replaceValues) {
                            if (!banks[country]) {
                                banks[country] = [];
                            }
                            picker.cols[1].replaceValues(banks[country]);
                        }
                    }
                },
                {
                    textAlign: 'right',
                    values: banks['常用银行']
                }
            ]
        });
        myPicker.open();
    });
};