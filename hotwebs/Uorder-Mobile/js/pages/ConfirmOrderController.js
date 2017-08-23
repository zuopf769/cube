UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.ConfirmOrderController = function () {
    this.addrListFunc = Template7.compile($$('#addrListTpl').html());
    this.baseInfoFunc = Template7.compile($$('#baseInfoTpl').html());
    this.paymentFunc = Template7.compile($$('#paymentTpl').html());
    this.invoiceFunc = Template7.compile($$('#invoiceTpl').html());
    this.productDetailFunc = Template7.compile($$('#productDetailTpl').html());
};
UOrderApp.pages.ConfirmOrderController.prototype.preprocess = function (content, url, next) {
    var context = $$.parseUrlQuery(url) || {};
    next(content);
};

UOrderApp.pages.ConfirmOrderController.prototype.pageInit = function (page) {
    var self = this;
    cb.rest.getJSON('ma/orders/getNewOrder', function (data) {
        if (data.code != 200) {
            myApp.toast(data.message, 'error').show(true);
            return;
        }
        //编译  渲染 模板 将模板展示出来。。。
        var addressdata = self.GetInitData(data.data, 'address');
        if (!cb.cache.get('address')) {
            $$('.confirmOrderContent .addressContent').html(self.addrListFunc(addressdata));
            cb.cache.set('address', addressdata);
        }
        else
            $$('.confirmOrderContent .addressContent').html(self.addrListFunc(cb.cache.get('address')));

        var baseinfodata = self.GetInitData(data.data, 'baseInfo');
        if (!cb.cache.get('baseInfo')) {
            $$('.confirmOrderContent .baseInfoContent').html(self.baseInfoFunc(baseinfodata));
            cb.cache.set('baseInfo', baseinfodata);
        }
        else
            $$('.confirmOrderContent .baseInfoContent').html(self.baseInfoFunc(cb.cache.get('baseInfo')));

        var paymentdata = self.GetInitData(data.data, 'payment');
        if (!cb.cache.get('payment')) {
            $$('.confirm_ul .payment').html(self.paymentFunc(paymentdata));
            cb.cache.set('payment', paymentdata);
        }
        else
            $$('.confirm_ul .payment').html(self.paymentFunc(cb.cache.get('payment')));

        var invoicedata = self.GetInitData(data.data, 'invoice');
        if (!cb.cache.get('invoice')) {
            cb.cache.set('invoice', invoicedata)
            $$('.confirmOrderContent .invoiceContent').html(self.invoiceFunc(invoicedata));
        }
        else
            $$('.confirmOrderContent .invoiceContent').html(self.invoiceFunc(cb.cache.get('invoice')));

        //计算总价
        var totalPrice = 0, productType = 0, productCount = 0, productId = {};
        for (var index = 0; index < data.data.oOrderDetails.length; index++) {
            var item = data.data.oOrderDetails[index];
            if (!productId[item.iProductId])
                productType++;
            productId[item.iProductId] = true;
            totalPrice += item.fSalePrice * item.iQuantity;
            productCount += item.iQuantity;
        }
        $$('.totalTypeContainer').html(productType + '种' + productCount + '件');
        $$('.totalPriceContainer').html('￥' + totalPrice.toFixed(2));

        //初始化清单
        var productList = { detailData: self.FormatDetailDataFunc(data.data.oOrderDetails) };
        $$('.productDetailContainer').html(self.productDetailFunc(productList));

        //注册提交订单按钮功能
        $$('.button.confirmOrderSaveBtn').on('click', function (e) {
            var newOrderInfo = data.data;

            //收集数据
            var addrList = myApp.formToJSON('#form_addrList');
            var baseinfor = myApp.formToJSON('#form_baseInfo');
            var payment = myApp.formToJSON('#form_payment');
            var invoice = myApp.formToJSON('#form_invoice');

            //数据更新
            $$.each(addrList, function (key, value) {
                newOrderInfo[key] = value;
            });
            $$.each(baseinfor, function (key, value) {
                newOrderInfo[key] = value;
            });
            $$.each(payment, function (key, value) {
                newOrderInfo[key] = value;
            });
            $$.each(invoice, function (key, value) {
                newOrderInfo[key] = value;
            });
            //post data
            cb.rest.postData('mc/orders/submitOrder', { neworder: newOrderInfo }, function (data) {
                if (typeof data == 'string')
                    data = JSON.parse(data);
                if (data.code != 200) {
                    myApp.toast(data.message, "tips").show(true); //✕✓
                    return;
                }
                myApp.toast('订单提交成功', 'success').show(true); //✕✓
                myApp.mainView.router.loadPage({
                    url: 'pages/orderSuccess.html',
                    query: data.data
                });
            });
        });
    });
    //
    $$('.confirmOrderContent li').on('click', function () {
        var key = $$(this).attr('data-key');
        var data = cb.cache.get(key);
        var link = $$(this).attr('data-link');
        myApp.mainView.router.loadPage({
            url: link,
            query: data
        });
    });

    //监听基础信息页面返动作并执行相应逻辑
    $$(document).on('pageAfterBack', '.page[data-page="BaseInfo"]', function (e) {
        var page = e.detail.page;
        if (page.query) {
            cb.cache.set('baseInfo', page.query);
            $$('.confirmOrderContent .baseInfoContent').html(self.baseInfoFunc(cb.cache.get('baseInfo')));
        }
    });

    //监听地址列表页面返动作并执行相应逻辑
    $$(document).on('pageAfterBack', '.page[data-page="addrListPage"]', function (e) {
        var page = e.detail.page;
        if (page.query) {
            cb.cache.set('address', page.query);
            $$('.confirmOrderContent .addressContent').html(self.addrListFunc(cb.cache.get('address')));
        }
    });

    //监听发票信息页面返动作并执行相应逻辑
    $$(document).on('pageAfterBack', '.page[data-page="invoice"]', function (e) {
        var page = e.detail.page;
        var invDetail = $$("#form_invoice input").eq(0).nextAll();
        if (page.query.cInvoiceType == "NONE")
            invDetail.hide();
        else
            invDetail.show();

        if (page.query) {
            cb.cache.set('address', page.query);
            $$('.confirmOrderContent .invoiceContent').html(self.invoiceFunc(cb.cache.get('address')));
        }
    });

    //监听 发票信息维护 
    $$(document).on('pageAfterBack', '.page[data-page="payment"]', function (e) {
        var page = e.detail.page;
        if (page.query) {
            myApp.formFromJSON('#form_payment', page.query);
        }
    });
};

UOrderApp.pages.ConfirmOrderController.prototype.InitHtml = function () {

};

//格式化：构件清单数据源
UOrderApp.pages.ConfirmOrderController.prototype.FormatDetailDataFunc = function (val) {
    var detailData = new Array();
    var productType = {};
    if (val.length > 0) {
        for (var index = 0; index < val.length; index++) {
            var item = val[index];
            var iProductId = item.iProductId;
            var o = {
                cName: item.cProductName,
                cProductUnitName: item.cProductUnitName,
                cImgUrl: '',
                iProductId: iProductId
            };
            if (productType[iProductId]) continue;

            var arraySku = val.filter(function (itemObj) {
                return itemObj.iProductId === iProductId;
            });
            var splitAttr = function (str) {
                var arr = new Array();
                if (str) {
                    var strList = str.split(';');
                    for (var i = 0; i < strList.length; i++) {
                        if (strList[i].indexOf(':') > 0)
                            arr.push({ cName: strList[i].split(':')[0], cSpecItemName: strList[i].split(':')[1] });
                    }
                }
                return arr;
            };
            productType[iProductId] = true;
            if (arraySku.length > 0) {
                var attrArray = new Array();
                for (var j = 0; j < arraySku.length; j++) {
                    var attr = {
                        iQuantity: arraySku[j].iQuantity,
                        fSalePrice: arraySku[j].fSalePrice,
                        lsSkuSpecItems: splitAttr(arraySku[j].cSpecDescription)
                    };
                    attrArray.push(attr);
                }
                o.SkuSpecItems = attrArray;
            }
            detailData.push(o);
        }
    }
    return detailData;
};

//构件初始化页面数据
UOrderApp.pages.ConfirmOrderController.prototype.GetInitData = function (val, type) {
    var o = {};
    switch (type) {
        case "address":
            o.cReceiver = val.cReceiver;
            o.cReceiveMobile = val.cReceiveMobile;
            o.cReceiveAddress = val.cReceiveAddress;
            break;
        case "baseInfo":
            o.agentName = val.oAgent.cName;
            o.cReceiveContacter = val.cReceiveContacter;
            o.cReceiveContacterPhone = val.cReceiveContacterPhone;
            o.dConfirmDate = val.dConfirmDate;
            o.dSendDate = val.dSendDate;
            break;
        case "payment":
            o.oPayWayCode = val.oPayWayCode.cCode;
            o.oPayWayName = val.oPayWayCode.cName;
            o.oSettlementWayCode = val.oSettlementWay.id;
            o.oSettlementWayName = val.oSettlementWay.cName;
            o.oShippingChoiceCode = val.oShippingChoice.id;
            o.oShippingChoiceName = val.oShippingChoice.cName;
            break;
        case "invoice":
            o.cInvoiceType = val.cInvoiceType;
            o.cBankAccount = val.cBankAccount;
            o.cBankCode = val.cBankCode;
            o.cBankName = val.cBankName;
            o.cInvoiceContent = val.cInvoiceContent;
            o.cInvoiceTitle = val.cInvoiceTitle;
            o.cInvoiceName = val.oDefaultInvoiceType.cName;
            o.cSubBankName = val.cSubBankName;
            o.TaxNum = val.oAgent.cTaxNo;
            break;
    }
    return o;
};
