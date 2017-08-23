UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.OrderInfoController = function () { };
UOrderApp.pages.OrderInfoController.prototype.preprocess = function (content, url, next) {
    var context = $$.parseUrlQuery(url) || {};
    if (!context.oid) {
        myApp.toast('订单编号为空！', 'tips').show(true);
        return;
    }
    var self=this;
    var params = { cOrderNo: context.oid };
    cb.rest.getJSON('ma/orders/getOrderDetail', params, function (data) {
        if (typeof data == 'string')
            data = JSON.parse(data);
        if (data.code != 200) {
            myApp.toast('获取订单详情失败！', 'error').show(true);
            return;
        }
        context.orderDetail = data.data;
        context.orderDetail.oOrderDetails = self.FormatData(context.orderDetail.oOrderDetails);
        var template = Template7.compile(content);
        var resultContent = template(context);

        next(resultContent);
    });
};
UOrderApp.pages.OrderInfoController.prototype.pageInit = function (page) {
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
                    if (typeof data == 'string')
                        data = JSON.parse(data);
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

};

UOrderApp.pages.OrderInfoController.prototype.FormatData = function (data) {
    var detailList = new Array();

    var productId = {};
    for (var i = 0; i < data.length; i++) {
        var pid = data[i].iProductId;
        if (productId[pid]) continue;

        productId[pid] = true;

        var o = {
            iProductId:data[i].iProductId,
            cProductName: data[i].cProductName,
            cProductCode: data[i].cProductCode,
            oDefaultProAlbum: data[i].oDefaultProAlbum.cFolder + data[i].oDefaultProAlbum.cImgName,
            sKuList:new Array()
        };
        var sameProduct = data.filter(function (item) {
            return item.iProductId == pid;
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

        if (sameProduct.length) {
            for (var j = 0; j < sameProduct.length; j++) {
                var obj = new Object();
                obj.iQuantity = sameProduct[j].iQuantity;
                obj.fSalePrice = sameProduct[j].fSalePrice;
                obj.lsSkuSpecItems = splitAttr(sameProduct[j].cSpecDescription);
                o.sKuList.push(obj);
            }
        }
        detailList.push(o);
    }
    return detailList;
};