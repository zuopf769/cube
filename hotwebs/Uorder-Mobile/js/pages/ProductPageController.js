UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.ProductPageController = function () { };
UOrderApp.pages.ProductPageController.prototype.preprocess = function (content, pid, container, isCreateOrder) {
    var context = { pid: pid };
    var self = this;
    if (!context.pid) {
        myApp.alert('无效的商品id，请核对', '提示信息');
        return;
    }
    var params = { id: context.pid };
    cb.rest.getJSON('ma/Products/getProduct', params, function (data) {
        if (data.code != 200) {
            myApp.toast('获取商品信息失败', 'error').show(true); //✕✓、
            return;
        }
        context.product = data.data;
        // 拼接图片URL
        context.product.productImgUrl = cb.rest.appContext.serviceUrl + context.product.oDefaultAlbum.cFolder + 'lm_' + context.product.oDefaultAlbum.cImgName;
        var template = Template7.compile(content);
        var resultContent = template(context);
        container.html($$($$(resultContent)[0]).children('.pages')[0].innerHTML);
        self.pageInit(context.product, isCreateOrder);
    });
};
UOrderApp.pages.ProductPageController.prototype.pageInit = function (product, isCreateOrder) {
    var self = this;

    var reloadSpec = function () {
        var params = { id: product.id };
        var specItemIdArray = new Array();
        for (var i = 0; i < product.lsSpecs.length; i++) {
            specItemIdArray.push($$('.popup.popup-prodSUK').find("input[name=attrItem_" + product.lsSpecs[i].id + "]:checked").val());
        }
        params.specItemIds = specItemIdArray
        //加载SKU
        cb.rest.getJSON('ma/Products/getSkus', params, function (skudata) {
            if (typeof skudata == 'string')
                skudata = JSON.parse(skudata);
            if (skudata.code != 200) {
                myApp.toast(data.message, 'error').show(true);
                return;
            }
            var stepHtml = '<dl><dt>' + skudata.data[0].iMinOrderQuantity + '件 起订</dt><dd><em>￥</em>' + skudata.data[0].fSalePrice.toFixed(2) + '</dd></dl>';
            self.oldCount = skudata.data[0].iMinOrderQuantity;
            $$('.popup.popup-prodSUK').find("#txtProSpecsCount").val(self.oldCount);
            //价格阶梯
            if (skudata.data[0].lsPriceJustifyItems.length > 0) {
                for (var index = 0; index < skudata.data[0].lsPriceJustifyItems.length; index++) {
                    var priceItem = skudata.data[0].lsPriceJustifyItems[index];
                    stepHtml += '<dl><dt>' + priceItem.iLowerlimit + '-' + priceItem.iHigherlimit + '</dt><dd><em>￥</em>' + priceItem.iPrice.toFixed(2) + '</dd></dl>';
                }
            }
            $$('#InventoryCount').html('库存  ' + skudata.data[0].lInventoryCount);
            $$('.popup-number.priceStepContainer').html(stepHtml);
            self.sku = skudata.data[0];
            getDiscountPrice();
        });
    };
    reloadSpec();
    //属性切换事件触发
    $$('.popup.popup-prodSUK').find('input[type="radio"]').on('change', reloadSpec);
    //控制数量输入
    $$('.popup.popup-prodSUK .numberManage').find('i').on('click', function (e) {
        var $input = $$(this).parent().find('input');
        if (!$input.val()) {
            $input.val(0);
        }
        var val = parseInt($input.val());
        if ($$(this).hasClass('icon-cart-less')) {
            if (val <= 1) {
                myApp.toast('至少订购1件', 'tips').show(true);
                $$(this).addClass('disabled');
            }
            else
                $input.val(val - 1);
        }
        else if ($$(this).hasClass('icon-cart-add')) {
            $$(this).parent().find('i').removeClass('disabled');
            $input.val(val + 1);
        }
        $$('.popup.popup-prodSUK .numberManage').find('input').trigger('change');
    });

    //获取价格
    var getDiscountPrice = function () {
        var count = parseFloat($$('.popup.popup-prodSUK .numberManage').find('input').val());
        cb.rest.getJSON('ma/Products/getDiscountPrice?skuId=' + self.sku.id + "&count=" + count, function (data) {
            if (data.code != 200) {
                myApp.toast(data.message, 'error').show(true); //✕✕✓
                return;
            }
            $$('.popup.popup-prodSUK').find(".priceStepContainer dd").html("<em>￥</em>" + data.data.toFixed(2));
            self.priceAount = count * data.data
            $$('.popup-bottom .totalContainer').html(count + ' <em>件</em>   ' + self.priceAount.toFixed(2) + ' <em>元</em> ');
        });
    };

    //数量输入框事件
    $$('.popup.popup-prodSUK .numberManage').find('input').on('keyup change', function (e) {
        $$(this).val($$(this).val().replace(/[^\d]/g, ''));
        if ($$(this).val()) {
            if (self.oldCount != $$(this).val()) {
                getDiscountPrice();
                self.oldCount = $$(this).val();
            }
        }
        else {
            self.oldCount = 0;
            $$('.popup-bottom .totalContainer').html('0 <em>件</em>   0.00 <em>元</em> ');
        }
    });
    //修改SKU属性按钮
    $$('.popup-bottom .btn-update-sku').on('click', function (e) {
        var count = $$('.popup.popup-prodSUK').find("#txtProSpecsCount").val();
        if (!count) {
            myApp.toast("请输入订购数量", 'tips').show(true);
            return;
        }
        if (count < self.sku.iMinOrderQuantity) {
            myApp.toast("订购数量不能小于起订量", 'tips').show(true);
            return;
        }

        // 商品SKUid和数量
        var orderJsonData = { items: [{ iSKUId: self.sku.id, iQuantity: count }] };

        var num = count.toString();
        var pointIndex = num.indexOf('.');
        if (pointIndex > -1 && num.length - (pointIndex + 1) > 2) {
            myApp.toast("订购数量最大精确度为2", 'tips').show(true);
            return;
        }

        orderJsonData.priceAount = self.priceAount;
        if (isCreateOrder) {
            orderJsonData.items[0].productDetail = product;
            myApp.mainView.router.loadPage({
                url: 'pages/confirmOrder.html', query: orderJsonData
            });
            myApp.closeModal('.popup-prodSUK');
        }
        else {
            cb.rest.postData('mc/ShoppingCarts/add', orderJsonData, function (data) {
                var dataObj = JSON.parse(data);
                if (dataObj.code == 200 && dataObj.data) {
                    myApp.toast('添加购物车成功', 'success').show(true); //✕✕✓
                    myApp.closeModal('.popup-prodSUK');
                }
                else {
                    myApp.toast(dataObj.message, 'error').show(true); //✕✓
                }
            });
        }
    });
};