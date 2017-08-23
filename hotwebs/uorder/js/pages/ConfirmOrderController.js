UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.ConfirmOrderController = function () {
    this.addrList = Template7.compile($$('#addrListTpl').html());
    this.baseInfo = Template7.compile($$('#baseInfoTpl').html());
    this.payment = Template7.compile($$('#paymentTpl').html());
    this.invoice = Template7.compile($$('#invoiceTpl').html());
};
UOrderApp.pages.ConfirmOrderController.prototype.preprocess = function (content, url, next) {
    var context = $$.parseUrlQuery(url) || {};
    next(content);
};
UOrderApp.pages.ConfirmOrderController.prototype.pageInit = function (page) {
    var self = this;
    var odata;
    var cartId = [];
    var cartList = [];
    var data_type = '';
    var productDetail;
    var items = [];
    var quantity;
    if (page.query.data_type == 'addr') {
        var data = myApp.formGetData('form_data');
        odata = data.data;
        $$('.confirm_ul .addrList').html(self.addrList(data));
        $$('.confirm_ul .baseInfo').html(self.baseInfo(data));
        $$('.confirm_ul .payment').html(self.payment(data));
        $$('.confirm_ul .invoice').html(self.invoice(data));
        myApp.formFromJSON('#form_addrList', page.query);
        myApp.formFromJSON('#form_invoice', myApp.formGetData('form_invoice'));
        myApp.formFromJSON('#form_payment', myApp.formGetData('form_payment'));
        myApp.formFromJSON('#form_baseInfo', myApp.formGetData('form_baseInfo'));
        if (!data.data.cReceiveContacter && !data.data.cReceiveMobile && !data.data.cReceiveAddress) {
            $$('.hasInformation').hide();
        }
        else {
            $$('.noInformation').hide();
        }
        if (myApp.formGetData('cart')) {
            data_type = myApp.formGetData('cart').data_type;
            cartId = myApp.formGetData('cart').cartId;
            quantity = myApp.formGetData('cart').cartId.length;
            cb.rest.getJSON('ma/ShoppingCarts/getCartList', function (data) {
                if (data.code == 200) {
                    cartList = data.data;
                } else {
                    myApp.toast(data.message, 'error').show(true);
                }
            });
        }
        else if (myApp.formGetData('product')) {
            productDetail = myApp.formGetData('product').productDetail;
            quantity = myApp.formGetData('product').items.length;
            items = myApp.formGetData('product').items;
            data_type = '';
        } else {
            quantity = 1;
            productDetail = myApp.formGetData('productNoSKU');
            data_type = 'productNoSKU';
            debugger;
        }
        $$('.confirmList .quantity').html(quantity);
    }
    else {
        //请求信息把基本信息加载出来
        cb.rest.getJSON('ma/orders/getNewOrder', function (data) {
            if (data.code == 200) {
                odata = data.data;
                //编译  渲染 模板 将模板展示出来。。。
                $$('.confirm_ul .addrList').html(self.addrList(data));
                $$('.confirm_ul .baseInfo').html(self.baseInfo(data));
                $$('.confirm_ul .payment').html(self.payment(data));
                $$('.confirm_ul .invoice').html(self.invoice(data));
                //将信息存储起来；
                myApp.formStoreData('form_addrList', myApp.formToJSON('#form_addrList'));
                myApp.formStoreData('form_invoice', myApp.formToJSON('#form_invoice'));
                myApp.formStoreData('form_payment', myApp.formToJSON('#form_payment'));
                myApp.formStoreData('form_baseInfo', myApp.formToJSON('#form_baseInfo'));
                myApp.formStoreData('form_data', data);
                //var jj=myApp.formGetData('baseinfor');
                //end...
                //根据用户数据判断 如果没有用户数据就显示'信息不全，完善信息'，如果有信息就显示信息。
                if (!data.data.cReceiveContacter && !data.data.cReceiveMobile && !data.data.cReceiveAddress) {
                    $$('.hasInformation').hide();
                }
                else {
                    $$('.noInformation').hide();
                }
                //end
            }
            else {
                myApp.toast(data.message, 'error').show(true); //✕✓
            }
        });
        if (page.query.data_type == 'cart') {   //根据传递过来的数据data-type判断是从购物车中过来的还是从商品详情页中过来的
            data_type = page.query.data_type;
            cartId = page.query.cartId;
            quantity = page.query.cartId.length;
            cb.rest.getJSON('ma/ShoppingCarts/getCartList', function (data) {
                if (data.code == 200) {
                    cartList = data.data;
                } else {
                    myApp.toast(data.message, 'error').show(true);
                }
            });
            myApp.formStoreData('cart', page.query);
            myApp.formDeleteData('product');
            myApp.formDeleteData('productNoSKU');
        } else {
            if (page.query.data_type == 'productNoSKU') {
                quantity = 1;
                data_type = page.query.data_type;
                productDetail = page.query.data;
                productDetail.num = page.query.orderNumber;
                myApp.formStoreData('productNoSKU', productDetail);
                myApp.formDeleteData('cart');
                myApp.formDeleteData('product');
            } else {
                productDetail = page.query.productDetail;
                quantity = page.query.items.length;
                items = page.query.items;
                cb.rest.getJSON('ma/Products/getSkus', { id: productDetail.id }, function (data) {
                    if (data.code == 200) {
                        for (var i = 0; i < items.length; i++) {
                            for (var j = 0; j < data.data.length; j++) {
                                if (items[i].iSKUId == data.data[j].id) {
                                    var arr1 = [];
                                    for (var z = 0; z < data.data[j].lsSkuSpecItems.length; z++) {
                                        arr1.push(data.data[j].lsSkuSpecItems[z].cSpecItemName);
                                    }
                                    items[i].property = arr1;
                                }
                            }
                        }
                        myApp.formStoreData('product', { productDetail: productDetail, items: items });
                        myApp.formDeleteData('cart');
                        myApp.formDeleteData('productNoSKU');
                    } else {
                        myApp.toast(data.message, 'error').show(true);
                    }
                });
            }
        }
        $$('.quantity').html(quantity);
    }

    //给toolbar上的返回按钮注册时间，点击是返回上一层页面。
    $$('.confirm_back').on('click', function () {
        myApp.mainView.router.back({ url: 'pages/shopping-cart.html', force: true });
    });
    //end

    //给li注册click事件
    $$('.confirm_ul li').on('click', function () {
        var formData = myApp.formToJSON($$(this).find('form'));
        var url = $$(this).attr('data-link');
        myApp.mainView.router.load({
            url: url,
            query: formData
        });
    });

    //给商品清单添加点击事件并跳转到清单页面
    $$('.item-content.productsList').on('click', function (e) {
        var formData = {};
        if (data_type == 'cart') {
            formData.cartId = cartId;
        } else if (data_type == 'productNoSKU') {
            var data = [];
            var json = {};
            json.title = productDetail.cName;
            json.quantity = productDetail.num;
            json.price = productDetail.fSalePrice;
            json.code = productDetail.cCode;
            json.imageUrl = productDetail.oDefaultAlbum.cFolder + 's_' + productDetail.oDefaultAlbum.cImgName;
            data.push(json);
            formData.data = data;
        }
        else {
            var data = [];
            var json = {};
            for (var i = 0; i < items.length; i++) {
                json.property = '';
                for (var j = 0; j < items[i].property.length; j++) {
                    for (var z = 0; z < productDetail.lsSpecs.length; z++) {
                        for (var o = 0; o < productDetail.lsSpecs[z].lsSpecItem.length; o++) {
                            if (items[i].property[j] == productDetail.lsSpecs[z].lsSpecItem[o].cSpecItemName) {
                                json.property = json.property + " " + productDetail.lsSpecs[z].cName + ":" + items[i].property[j];
                            }
                        }
                    }
                }
                json.title = productDetail.cName;
                json.quantity = items[i].iQuantity;
                json.price = productDetail.fSalePrice;
                json.code = productDetail.cCode;
                json.imageUrl = productDetail.oDefaultAlbum.cFolder + 's_' + productDetail.oDefaultAlbum.cImgName;
                data.push(json);
            }
            formData.data = data;
        }
        myApp.mainView.router.load({
            url: 'pages/list-product.html',
            query: formData
        });
    });

    //监听基础信息页面返动作并执行相应逻辑
    $$(document).on('pageAfterBack', '.page[data-page="BaseInfo"]', function (e) {
        var page = e.detail.page;
        myApp.formStoreData('form_baseInfo', page.query);
        if (page.query) {
            var len = page.query.dDeliveryDate.length;
            myApp.formFromJSON('#form_baseInfo', page.query);
        }
    });

    //监听地址列表页面返动作并执行相应逻辑
    $$(document).on('pageAfterBack', '.page[data-page="addrListPage"]', function (e) {
        var page = e.detail.page;
        myApp.formStoreData('form_addrList', page.query);
        if (page.query) {
            myApp.formFromJSON('#form_addrList', page.query);
        }
    });

    //监听发票信息页面返动作并执行相应逻辑
    $$(document).on('pageAfterBack', '.page[data-page="invoice"]', function (e) {
        var page = e.detail.page;
        myApp.formStoreData('form_invoice', page.query);
        if (page.query) {
            myApp.formFromJSON('#form_invoice', page.query);
        }
    });

    $$(document).on('pageAfterBack', '.page[data-page="payment"]', function (e) {
        var page = e.detail.page;
        myApp.formStoreData('form_payment', page.query);
        if (page.query) {
            myApp.formFromJSON('#form_payment', page.query);
        }
    });
    $$('.confirmOrder_save').on('click', function (e) {
        var addrList = myApp.formToJSON('#form_addrList');
        var baseinfor = myApp.formToJSON('#form_baseInfo');
        var payment = myApp.formToJSON('#form_payment');
        var invoice = myApp.formToJSON('#form_invoice');
        var orderInfor = {};
        var json = {};
        var json1 = {};
        $$.each(addrList, function (key, value) {
            orderInfor[key] = value;
        });
        $$.each(baseinfor, function (key, value) {
            orderInfor[key] = value;
        });
        $$.each(payment, function (key, value) {
            if (key == 'payWay_code') {
                orderInfor['cOrderPayType'] = value;
            } else if (key == 'settleWay') {
                //json['cName']=value;
            } else if (key == 'settleWay_code') {
                //json['cCode']=value;   
                json['iCorpId'] = 0;
            } else if (key == 'settleWay_id') {
                json['id'] = value;
            } else if (key == 'shipping') {
                json1['cName'] = value;
            } else if (key == 'shippingCode') {
                json1['cCode'] = value;
                json1['iCorpId'] = 0;
            }
            orderInfor.oSettlementWay = json;
            orderInfor.oShippingChoice = json1;
        });
        $$.each(invoice, function (key, value) {
            orderInfor[key] = value;
        });
        orderInfor.iAgentShipToAddressId = odata.iAgentShipToAddressId;
        orderInfor.iSubmiterId = odata.iSubmiterId;
        orderInfor.iConfirmerId = odata.iConfirmerId;
        orderInfor.dSendDate = odata.dSendDate;
        orderInfor.iInvoiceMoney = 1234;
        orderInfor.oOrderDetails = [];
        orderInfor.iAgentId = odata.iAgentId;
        orderInfor.iCorpId = odata.iCorpId;
        if (data_type == 'cart') { //从购物车中来
            for (var i = 0; i < cartId.length; i++) {
                for (var j = 0; j < cartList.length; j++) {
                    if (cartId[i] == cartList[j].id) {
                        var json = {};
                        json.iQuantity = cartList[j].iQuantity;
                        json.iShoppingCartId = cartList[j].id;
                        json.iProductId = cartList[j].iProductId;
                        json.iSKUId = cartList[j].iSKUId;
                        orderInfor.oOrderDetails.push(json);
                    }
                }
            }
        } else { //从商品详情页过来
            if (data_type == 'productNoSKU') {
                var json = {};
                json.iQuantity = productDetail.num;
                json.iSKUId = productDetail.lsProductSkus[0].id;
                json.iProductId = productDetail.id;
                orderInfor.oOrderDetails.push(json);
            } else {
                for (var i = 0; i < items.length; i++) {
                    var json = {};
                    json.iQuantity = items[i].iQuantity;
                    json.iProductId = productDetail.id;
                    json.iSKUId = items[i].iSKUId;
                    orderInfor.oOrderDetails.push(json);
                };
            }
        }
        cb.rest.postData('mc/orders/submitOrder', { neworder: orderInfor }, function (data) {
            if (typeof data == 'string')
                data = JSON.parse(data);
            if (data.code != 200) {
                myApp.alert(data.message);
                return;
            }
            myApp.toast('订单提交成功', 'success').show(true); //✕✓
            myApp.mainView.router.loadPage({
                url: 'pages/orderSuccess.html',
                query: data.data
            });
        });
    });

};