UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.ConfirmOrderController = function () {
    this.addrListFunc = Template7.compile($$('#addrListTpl').html());
    this.baseInfoFunc = Template7.compile($$('#baseInfoTpl').html());
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
        self.newOrder = data.data;
        //编译  渲染 模板 将模板展示出来。。。
        var addressdata = self.GetInitData(data.data, 'address');
        if (!cb.cache.get('address')) {
            $$('.confirmOrderContent .addressContent').html(self.addrListFunc(addressdata));
            cb.cache.set('address', addressdata);
        } else
            $$('.confirmOrderContent .addressContent').html(self.addrListFunc(cb.cache.get('address')));

        var baseinfodata = self.GetInitData(data.data, 'baseInfo');
        if (!cb.cache.get('baseInfo')) {
            $$('.confirmOrderContent .baseInfoContent').html(self.baseInfoFunc(baseinfodata));
            cb.cache.set('baseInfo', baseinfodata);
        } else
            $$('.confirmOrderContent .baseInfoContent').html(self.baseInfoFunc(cb.cache.get('baseInfo')));

        var invoicedata = self.GetInitData(data.data, 'invoice');
        if (!cb.cache.get('invoice')) {
            cb.cache.set('invoice', invoicedata)
            $$('.confirmOrderContent .invoiceContent').html(self.invoiceFunc(invoicedata));
        } else
            $$('.confirmOrderContent .invoiceContent').html(self.invoiceFunc(cb.cache.get('invoice')));

        //计算总价
        self.totalPrice = data.data.fTotalMoney, productType = 0, productCount = 0, productId = {};
        for (var index = 0; index < data.data.oOrderDetails.length; index++) {
            var item = data.data.oOrderDetails[index];
            if (!productId[item.iProductId])
                productType++;
            productId[item.iProductId] = true;
            productCount += item.iQuantity;
        }
        $$('.totalTypeContainer').html(productType + '种' + productCount + '件');
        $$('.ProPriceContainer').html(self.totalPrice.toFixed(2));
        $$("#spanPromotion").text(data.data.fPromotionMoney.toFixed(2));
        self.fPromotionMoney = data.data.fPromotionMoney;
        $$(".totalPriceContainer").html((self.totalPrice - self.fPromotionMoney).toFixed(2));
        //初始化清单
        var productList = {
            detailData: self.FormatDetailDataFunc(data.data.oOrderDetails)
        };
        $$('.productDetailContainer-title').html('商品清单（' + productList.detailData.length + '）');
        $$('.productDetailContainer').html(self.productDetailFunc(productList));

        //注册提交订单按钮功能
        $$('.button.confirmOrderSaveBtn').on('click', function (e) {
            var submitOrderFunc = function () {
                var newOrderInfo = data.data;

                //收集数据
                var addrList = cb.cache.get('address');
                var baseinfor = cb.cache.get('baseInfo');
                var invoice = cb.cache.get('invoice');

                //数据更新
                $$.each(addrList, function (key, value) {
                    newOrderInfo[key] = value;
                });
                $$.each(baseinfor, function (key, value) {
                    newOrderInfo[key] = value;
                });
                $$.each(invoice, function (key, value) {
                    newOrderInfo[key] = value;
                });
                if (cb.cache.get('rebateAmount') &&cb.cache.get('rebateAmount').resultArray) {
                    newOrderInfo.oRebates = cb.cache.get('rebateAmount').resultArray; //返利单信息
                }
                newOrderInfo.cRemark = $$('div[data-page="confirmOrder"] .page-content .input-orderMsg-container').val();
                //post data
                cb.rest.postData('mc/orders/submitOrder', {
                    neworder: newOrderInfo
                }, function (data) {
                    if (data.code != 200) {
                        myApp.modal({
                            title: '<div class="common-tips-title error-tips">' +
                                '<i class="icon icon-failure"></i><span>提交失败～</span>' +
                                '<i class="icon icon-colse"></i>' +
                                '</div>',
                            text: '<div class="common-tips-content">' +
                                '<div class="tips-info">' + data.message + '</div>' +
                                '<div class="tips-manage"><span>您还可以</span></div>' +
                                '</div>',
                            buttons: [{
                                text: '修改订单',
                                onClick: function () {
                                    myApp.closeModal();
                                    //myApp.mainView.router.refashPage();
                                }
                            }, {
                                text: '返回购物车',
                                onClick: function () {
                                    $$('#view-3').trigger('show');
                                    myApp.showToolbar('.toolbar.homeNavBar');
                                }
                            }]
                        });
                        //关闭modal
                        $$('.common-tips-title .icon.icon-colse').on('click', function () {
                            myApp.closeModal();
                        });
                        return;
                    }
                    cb.cache.clear();

                    myApp.modal({
                        title: '<div class="common-tips-title success-tips">' +
                            '<i class="icon icon-succeed"></i><span>提交成功！</span>' +
                            '<i class="icon icon-colse"></i>' +
                            '</div>',
                        text: '<div class="common-tips-content">' +
                            '<div class="tips-content"><div>' + data.data.cOrderNo + '</div><div class="sp-money">￥' + data.data.fPayMoney + '<span>元</span></div></div>' +
                            '<div class="tips-manage"><span>您还可以</span></div>' +
                            '<div class="button-row"><span><i class="icon icon-payfor"></i>去付款</span><span><i class="icon icon-forOrder"></i>查看订单</span><span><i class="icon icon-goon"></i>继续订货</span></div>' +
                            '</div>'
                    });
                    //关闭modal
                    $$('.common-tips-title .icon.icon-colse').on('click', function () {
                        myApp.closeModal();

                        myApp.mainView.router.loadPage({
                            url: 'pages/orderList.html'
                        });
                    });
                    $$('.common-tips-content .button-row span').on('click', function () {
                        myApp.closeModal();
                        var i = $$(this).find("i");
                        if (i.hasClass('icon-payfor')) {
                            myApp.mainView.router.loadPage({
                                url: 'pages/newpaybill.html'
                            });
                        }
                        if (i.hasClass('icon-forOrder')) {
                            myApp.mainView.router.loadPage({
                                url: 'pages/orderList.html'
                            });
                        }
                        if (i.hasClass('icon-goon')) {
                            myApp.mainView.router.loadPage({
                                url: 'pages/products.html?dataType=newProduct'
                            });
                        }
                    });
                });
            };

            var skuArray = new Array();
            for (var i = 0; i < self.newOrder.oOrderDetails.length; i++) {
                var item = self.newOrder.oOrderDetails[i];
                skuArray.push({ iSKUId: item.iSKUId, iQuantity: item.iQuantity });
            }
            //检测是否可超库存预定
            cb.rest.postData('mc/Orders/getExceedInventoryOrder', { products: skuArray }, function (exceedData) {

                if (typeof exceedData == 'string')
                    exceedData = JSON.parse(exceedData);
                if (exceedData.code != 200) {
                    myApp.toast(exceedData.message, 'error').show(true);
                    return;
                }
                if (exceedData.data.isControl) {
                    if (exceedData.data.isExceed) {
                        myApp.toast('库存不足', 'tips').show(true);
                        return;
                    }
                    else {
                        submitOrderFunc();
                    }
                } else {
                    if (exceedData.data.isExceed) {
                        cb.confirm('库存不足，是否允许保存订单？', '提示信息', function () {
                            //检测信用额度是否足够
                            cb.rest.getJSON('ma/BaseData/getFunctionOptionByCode?cCodes=CREDITWORTHREMIND', function (creditData) {
                                if (typeof creditData == 'string')
                                    creditData = JSON.parse(creditData);
                                if (creditData.code != 200) {
                                    mApp.toast(creditData.message, 'error').show(true);
                                    return;
                                }
                                if (creditData.data[0] && creditData.data[0]['CREDITWORTHREMIND'] == 'true') {
                                    var careditWorth = self.newOrder.oAgent.iCusCreLine ? self.newOrder.oAgent.iCusCreLine : 0;
                                    var reditworthiness = self.newOrder.oAgent.iCreditworthiness ? self.newOrder.oAgent.iCreditworthiness : 0;
                                    if (reditworthiness < self.newOrder.fPayMoney) {
                                        var msg = '您的信用额度为：' + careditWorth + '，当前余额是：' + reditworthiness + '，该订单提交会超出信用额度，是否确认提交该订单？';
                                        cb.confirm(msg, '提示信息', function () {
                                            submitOrderFunc();
                                        });
                                    }
                                    else {
                                        submitOrderFunc();
                                    }
                                }
                                else {
                                    submitOrderFunc();
                                }
                            });
                        });
                    }
                    else
                        submitOrderFunc();
                }
            });
        });

        myApp.initImagesLazyLoad(myApp.mainView.activePage.container);

        //优惠信息点击事件
        $$('div[data-page="confirmOrder"] .productDetailContainer .discountDescContainer').on('click', function () {
            var pid = $$(this).attr('data-productid');
            var itemObj = productList.detailData.filter(function (item) {
                return item.iProductId == pid;
            })[0];

            var modalHtml = {
                title: '<div class="discountTitle">' +
					'优惠说明' +
					'<i class="icon icon-colse-popup"></i>' +
					'</div>',
                text: '<div class="list-block  media-list detail-title m-t-0 m-b-0"><ul class=" no-border">'
            };
            for (var i = 0; i < itemObj.oOrderProductApportions.length; i++) {
                var item = '<li class="align-top"><div class="item-inner"><span class="promo-type  p-lr-5 col-3"></span>';

                item += '<p class="title">' + itemObj.oOrderProductApportions[i].cApportionName + '</p><p>' + itemObj.oOrderProductApportions[i].cApportionAttr;

                item += '</p></div></li>'
                modalHtml.text += item;
            }
            modalHtml.text += '<ul></div>';
            myApp.modal(modalHtml);
            $$('.discountTitle i.icon-colse-popup').on('click', function () {
                myApp.closeModal();
            });
        });
        //获取可用返利信息
        cb.rest.getJSON('ma/Rebates/getUsablePrice', {
            fPayMoney: data.data.fPayMoney
        }, function (updata) {
            if (updata.code != 200) {
                myApp.toast(updata.message, 'error').show(true);
                return;
            }
            var abledSpan = $$(".confirmList-rabeta #spanUseableM");
            abledSpan.text(updata.data.orderUsableMoney.toFixed(2));
            abledSpan.parents("a").eq(0).on('click', function () {
                myApp.mainView.router.loadPage({
                    url: 'pages/rebate.html',
                    query: {
                        type:'select',
                        orderUsableMoney: updata.data.orderUsableMoney,
                        cashMaxRebateMoney: updata.data.cashMaxRebateMoney,
                        fMaxRebateMoney: data.data.fMaxRebateMoney,
                        fPayMoney: data.data.fPayMoney
                    }
                });
            });
            $$(".confirmList-rabeta #spanSurplusM").text(updata.data.rebateSurplusMoney.toFixed(2));
            $$('div[data-page="confirmOrder"] .confirmList-rabeta .rabate-tip').text('最多可折扣' + updata.data.orderUsableMoney + '元, 最多可抵现' + updata.data.cashMaxRebateMoney + '元');
        });
    });

    $$('.confirmOrderContent li').on('click', function () {
        if ($$(this).hasClass('btn-isShowMore')) {
            $$(this).prevAll().toggleClass('hide');
            $$(this).parent().children().eq(0).removeClass('hide');
            if ($$(this).parent().children('.hide').length)
                $$(this).text('展开更多');
            else
                $$(this).text('收起更多');
        }
        else {
            var key = $$(this).attr('data-key');
            var data = cb.cache.get(key);
            var link = $$(this).attr('data-link');
            myApp.mainView.router.loadPage({
                url: link,
                query: data
            });
        }
    });

    //监听基础信息页面返动作并执行相应逻辑
    $$(document).on('pageAfterBack', '.page[data-page="BaseInfo"]', function (e) {
        var page = e.detail.page;
        if (page.query.baseInfoData) {
            cb.cache.set('baseInfo', page.query.baseInfoData);
            $$('.confirmOrderContent .baseInfoContent').html(self.baseInfoFunc(cb.cache.get('baseInfo')));
        }
    });

    //监听返利列表页面
    $$(document).on('pageAfterBack', '.page[data-page="RebateListPage"]', function (e) {
        var page = e.detail.page;
        if (page.query.rebateData) {
            cb.cache.set('rebateAmount', page.query.rebateData);
            var rebateAmount = 0;
            var rebateTocash = 0;
            if (page.query.rebateData.resultArray && page.query.rebateData.resultArray.length > 0) {
                for (var i = 0; i < page.query.rebateData.resultArray.length; i++) {
                    var attrValue = page.query.rebateData.resultArray[i];
                    if (attrValue.cUseWayCode != 'TOCASH')
                        rebateAmount += parseFloat(attrValue.fOrderRebateMoney);
                    else
                        rebateTocash += parseFloat(attrValue.fOrderRebateMoney);
                }
            }

            $$("#spanRebateA").text(rebateAmount.toFixed(2));
            $$("#spanTocash").text(rebateTocash.toFixed(2));

            self.oRebates = page.query.rebateData.resultArray;
            $$(".totalPriceContainer").html((self.totalPrice - rebateAmount - self.fPromotionMoney).toFixed(2));

            var param = { order: self.newOrder };
            param.order.oRebates = page.query.rebateData.resultArray;

            cb.rest.postData('mc/Orders/computePromotion', param, function (data) {
                if (data.code != 200) {
                    myApp.toast(data.message, 'error').show(true);
                    return;
                }
                //初始化清单
                var productList = {
                    detailData: self.FormatDetailDataFunc(data.data.apportions)
                };
                $$('.productDetailContainer-title').html('商品清单（' + productList.detailData.length + '）');
                $$('.productDetailContainer').html(self.productDetailFunc(productList));
            });
        }
    });

    //监听地址列表页面返动作并执行相应逻辑
    $$(document).on('pageAfterBack', '.page[data-page="addrListPage"]', function (e) {
        var page = e.detail.page;
        if (page.query.addressData) {
            cb.cache.set('address', page.query.addressData);
            $$('.confirmOrderContent .addressContent').html(self.addrListFunc(cb.cache.get('address')));
        }
    });

    //监听发票信息页面返动作并执行相应逻辑
    $$(document).on('pageAfterBack', '.page[data-page="invoice"]', function (e) {
        var page = e.detail.page;
        var invDetail = $$("#form_invoice input").eq(0).nextAll();       

        if (page.query.invoiceData) {
            if (page.query.invoiceData.cInvoiceType == "NONE")
                invDetail.hide();
            else
                invDetail.show();
            cb.cache.set('invoice', page.query.invoiceData);
            $$('.confirmOrderContent .invoiceContent').html(self.invoiceFunc(cb.cache.get('invoice')));
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

//格式化：构件清单数据源
UOrderApp.pages.ConfirmOrderController.prototype.FormatDetailDataFunc = function (val) {
    var productList = new Array();
    var productGift = new Array();
    var productType = {};
    var oOrderProductApportions = new Array();

    if (val.length > 0) {
        for (var index = 0; index < val.length; index++) {
            var item = val[index];

            var iProductId = item.iProductId;
            var o = {
                cName: item.cProductName,
                cProductUnitName: item.cProductUnitName,
                iProductId: iProductId,
                cImgUrl: item.oDefaultProAlbum ? (cb.rest.appContext.serviceUrl + item.oDefaultProAlbum.cFolder + 's_' + item.oDefaultProAlbum.cImgName) : 'img/nopic.jpg',
                oOrderProductApportions: new Array()
            };
            var splitAttr = function (str) {
                var arr = new Array();
                if (str) {
                    var strList = str.split(';');
                    for (var i = 0; i < strList.length; i++) {
                        if (strList[i].indexOf(':') > 0)
                            arr.push({
                                cName: strList[i].split(':')[0],
                                cSpecItemName: strList[i].split(':')[1]
                            });
                    }
                }
                return arr;
            };

            if (item.cOrderProductType && item.cOrderProductType == "GIFT") {
                o.cOrderProductType = false;
                o.iQuantity = item.iQuantity;
                o.fSalePrice = item.fSalePrice;
                o.SkuSpecItems = splitAttr(item.cSpecDescription);
                productGift.push(o);
                continue;
            } else
                o.cOrderProductType = true;

            if (productType[iProductId]) continue;

            var arraySku = val.filter(function (itemObj) {
                return itemObj.iProductId === iProductId && itemObj.cOrderProductType != "GIFT";
            });
            var totalfApportionMoney = function (itemArr) {
                var totalApportion = 0;
                for (var k = 0; k < itemArr.length; k++) {
                    totalApportion += itemArr[k].fApportionMoney;
                }
                return totalApportion;
            };
            productType[iProductId] = true;
            if (arraySku.length > 0) {
                var attrArray = new Array();
                for (var j = 0; j < arraySku.length; j++) {
                    var attr = {
                        iQuantity: arraySku[j].iQuantity,
                        cProductUnitName: o.cProductUnitName,
                        fSalePrice: parseFloat(arraySku[j].fSalePrice.toFixed(2)),
                        fSalePayMoney: parseFloat(arraySku[j].fSalePayMoney.toFixed(2)),
                        apportionMoney: arraySku[j].oOrderProductApportions ? totalfApportionMoney(arraySku[j].oOrderProductApportions) : 0,
                        lsSkuSpecItems: splitAttr(arraySku[j].cSpecDescription)
                    };
                    attrArray.push(attr);
                    if (oOrderProductApportions.length > 0)
                        arraySku[j].oOrderProductApportions && oOrderProductApportions.concat(arraySku[j].oOrderProductApportions);
                    else
                        oOrderProductApportions = arraySku[j].oOrderProductApportions;
                }
                o.SkuSpecItems = attrArray;
            }
            o.oOrderProductApportions = oOrderProductApportions;
            productList.push(o);
        }
    }
    return productList.concat(productGift);
};

//构件初始化页面数据
UOrderApp.pages.ConfirmOrderController.prototype.GetInitData = function (val, type) {
    var o = {};
    switch (type) {
        case "address":
            o.iReceiveId = val.iReceiveId;
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
            o.oSettlementWayCode = val.oSettlementWay ? val.oSettlementWay.id : '';
            o.oSettlementWayName = val.oSettlementWay ? val.oSettlementWay.cName : '';
            o.oShippingChoiceCode = val.oShippingChoice ? val.oShippingChoice.id : '';
            o.oShippingChoiceName = val.oShippingChoice ? val.oShippingChoice.cName : '';
            break;
        case "invoice":
            o.cInvoiceType = val.cInvoiceType;
            o.cBankAccount = val.cBankAccount;
            o.cBankCode = val.cBankCode;
            o.cBankName = val.cBankName;
            o.cInvoiceContent = val.cInvoiceContent;
            o.cInvoiceTitle = val.cInvoiceTitle;
            o.cInvoiceName = val.oDefaultInvoiceType ? val.oDefaultInvoiceType.cName : '';
            o.cSubBankName = val.cSubBankName;
            o.cTaxNum = val.oAgent.cTaxNo;
            break;
    }
    return o;
};