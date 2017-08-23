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
    var invociceData;
    cb.rest.getJSON('Enums/getInvoiceTypes', function (data) {
        invociceData = data;
        var values = [];
        for (var i = 0; i < data.data.length; i++) {
            values.push(data.data[i].cName);
        };
        if (data) {
            var myPicker1 = myApp.picker({
                input: '#invoice_type',
                toolbarCloseText: '关闭',
                rotateEffect: true,
                cols: [
                    {
                        values: values
                    }
                ]
            });
        } else {
            myApp.toast(data.message, 'error').show(true); //✕✓
        }
    });
    var self = this;
    if (page.query) {
        myApp.formFromJSON('#invoice_form', page.query);
    }
    $$('.invoice_save').on('click', function (e) {
        var formData = myApp.formToJSON('#invoice_form');
        for (var i = 0; i < invociceData.data.length; i++) {
            if (invociceData.data[i].cName == formData.cInvoiceName) {
                formData.cInvoiceType = invociceData.data[i].cCode;
            }
        }
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