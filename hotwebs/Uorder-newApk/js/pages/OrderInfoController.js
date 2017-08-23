UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.OrderInfoController = function () { };
UOrderApp.pages.OrderInfoController.prototype.preprocess = function (content, url, next) {
    var context = $$.parseUrlQuery(url) || {};
    if (!context.oid) {
        myApp.toast('订单编号为空！', 'tips').show(true);
        return;
    }
    var self = this;
    var params = { cOrderNo: context.oid };
    cb.rest.getJSON('ma/orders/getOrderDetail', params, function (data) {
        if (data.code != 200) {
            myApp.toast('获取订单详情失败！', 'error').show(true);
            return;
        }
        context.orderDetail = data.data;
        context.orderDetail.oOrderDetails = self.FormatData(context.orderDetail.oOrderDetails);
        self.productList = context.orderDetail;
        context.orderDetail.totalCount = 0;
        for (var i = 0; i < context.orderDetail.oOrderDetails.length; i++) {
            if (context.orderDetail.oOrderDetails[i].iQuantity)
                context.orderDetail.totalCount += context.orderDetail.oOrderDetails[i].iQuantity;

            for (var j = 0; j < context.orderDetail.oOrderDetails[i].SkuSpecItems.length; j++) {
                context.orderDetail.totalCount += context.orderDetail.oOrderDetails[i].SkuSpecItems[j].iQuantity;
            }
        }

        var template = Template7.compile(content);
        var resultContent = template(context);

        next(resultContent);
    });
};
UOrderApp.pages.OrderInfoController.prototype.pageInit = function (page) {
    var self = this;
    $$('.toolbar .order-btn a').on('click', function (e) {
        var btnType = $$(this).attr('data-btnType');
        var orderNo = $$(this).parent().data("orderno");
        if (!orderNo) {
            myApp.toast('单据编号不存在', 'error').show(true);
            myApp.mainView.router.back();
            return;
        }
        switch (btnType) {
            case "del":
                var param = { cOrderNo: orderNo };
                cb.rest.postData('mc/orders/delOrder', param, function (data) {
                    if (data.code != 200) {
                        myApp.toast(data.message, 'error').show(true);
                        return;
                    }
                    myApp.toast('删除订单成功', 'success').show(true);
                    myApp.mainView.router.back();
                });
                break;
        }
    });

    //优惠信息点击事件
    $$('div[data-page="orderInfo"] .productDetailContainer .discountDescContainer').on('click', function () {
        var pid = $$(this).attr('data-productid');
        var itemObj = self.productList.oOrderDetails.filter(function (item) {
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

    myApp.initImagesLazyLoad(myApp.mainView.activePage.container);
};

UOrderApp.pages.OrderInfoController.prototype.FormatData = function (val) {
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
                cImgUrl: item.oDefaultProAlbum ? (cb.rest.appContext.serviceUrl + item.oDefaultProAlbum.cFolder + item.oDefaultProAlbum.cImgName) : 'img/nopic.jpg',
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
                return itemObj.iProductId === iProductId;
            });

            productType[iProductId] = true;
            if (arraySku.length > 0) {
                var attrArray = new Array();
                for (var j = 0; j < arraySku.length; j++) {
                    var attr = {
                        iQuantity: arraySku[j].iQuantity,
                        cProductUnitName: o.cProductUnitName,
                        fSalePrice: parseFloat(arraySku[j].fSalePrice.toFixed(2)),
                        lsSkuSpecItems: splitAttr(arraySku[j].cSpecDescription)
                    };
                    attrArray.push(attr);
                    if (oOrderProductApportions.length > 0)
                        oOrderProductApportions.concat(arraySku[j].oOrderProductApportions);
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