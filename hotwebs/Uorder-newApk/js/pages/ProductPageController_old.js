UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.ProductPageController = function () {
    this.SUKtplFunc = Template7.compile($$('#SUKTemplate').html());
};
UOrderApp.pages.ProductPageController.prototype.preprocess = function (content, pid, container) {
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
        var json = {};
        // 拼接图片URL
        context.product.productImgUrl = cb.rest.appContext.serviceUrl + context.product.oDefaultAlbum.cFolder + 'lm_' + context.product.oDefaultAlbum.cImgName;
        // 判断商品属性是否多个
        if (context.product.lsSpecs.length <= 1) {
            context.product.lsSpecsLength = false;
            cb.rest.getJSON('ma/Products/getSkus', params, function (data) {
                if (data.code != 200) {
                    myApp.toast('获取商品信息失败', 'error').show(true); //✕✓
                    return;
                }
                $$('#SUKInfo').html(self.SUKtplFunc({ SKUDetails: data.data, unit: context.product.oUnit.cName }));
                $$('.icon-add').on('click', function (e) {

                    var container = $$(this).parent().find('input');
                    container.val(parseInt(container.val()) + 1);
                });
                // 数量减
                $$('.icon-less').on('click', function (e) {
                    var container = $$(this).parent().find('input');
                    if (parseInt(container.val()) == 0) {
                        container.val("0");
                    } else {
                        container.val(parseInt(container.val()) - 1);
                    }
                });
            });
        } else {
            context.product.lsSpecsLength = true;
            json = context.product.lsSpecs.pop();
        }
        var template = Template7.compile(content);
        var resultContent = template(context);
        container.html($$($$(resultContent)[0]).children('.pages')[0].innerHTML);

        //添加购物车
        $$('.updateCancel').on('click', function (e) {
            var formDatas = myApp.formToJSON('#sku');
            // 组装参数JSON对象
            var length = 0;
            var formJson = {};
            var itemsArray = new Array();
            for (var item in formDatas) {
                var keyval = item.split('_');
                var index = Number(keyval[1]);
                itemsArray[index] = itemsArray[index] || {};
                itemsArray[index][keyval[0]] = Number(formDatas[item]);
            }
            var resultArray = [];
            for (var i = 0; i < itemsArray.length; i++) {
                var curr = itemsArray[i];
                if (curr.iQuantity > 0) {
                    resultArray.push(curr);
                }
            }
            formJson.items = resultArray;
            if (formJson.items.length == 0) {
                myApp.toast('订购量不能为0', 'error').show(true); //✕✓
                return;
            }
            for (var i = 0; i < itemsArray.length; i++) {
                var curr = itemsArray[i];
                if (curr.iQuantity < 0 && curr.iQuantity < curr.iMinOrderQuantity) {
                    myApp.toast("订购数量不能小于起订量", 'tips').show(true);
                    return;
                }
            }

            for (var i = 0; i < formJson.items.length; i++) {
                var curr = formJson.items[i];
                if (curr.iQuantity) {
                    var num = curr.iQuantity.toString();
                    var pointIndex = num.indexOf('.');
                    if (pointIndex > -1 && num.length - (pointIndex + 1) > 2) {
                        myApp.toast("订购数量最大精确度为2", 'tips').show(true);
                        return;
                    }
                }
            }

            cb.rest.postData('mc/ShoppingCarts/add', formJson, function (data) {
                var dataObj = JSON.parse(data);
                if (dataObj.code == 200 && dataObj.data) {
                    myApp.toast('添加购物车成功', 'success').show(true); //✕✕✓
                    myApp.closeModal('.productParam-popup');
                }
                else {
                    myApp.toast(dataObj.message, 'error').show(true); //✕✓
                }
            });

        });
        // 立即订购 将加入购物车的数据传到订单页面
        $$('.updateOk').on('click', function (e) {
            var formDatas = myApp.formToJSON('#sku');
            // 组装参数JSON对象
            var itemsArray = new Array();
            for (var item in formDatas) {
                var keyval = item.split('_');
                var index = Number(keyval[1]);
                itemsArray[index] = itemsArray[index] || {};
                itemsArray[index][keyval[0]] = Number(formDatas[item]);
            }

            var resultArray = [];
            for (var i = 0; i < itemsArray.length; i++) {
                var curr = itemsArray[i];
                if (curr.iQuantity > 0 && curr.iQuantity < curr.iMinOrderQuantity) {
                    myApp.toast("订购数量不能小于起订量", 'tips').show(true);
                    return;
                }
                if (curr.iQuantity > 0) {
                    resultArray.push(curr);
                }
            }
            // 商品详细信息
            if (!context.product.lsSpecsLength) { }
            else {
                data.data.lsSpecs.push(json);
            }
            // 商品SKUid和数量
            var orderJsonData = { items: resultArray, productDetail: data.data };

            if (orderJsonData.items.length == 0) {
                myApp.toast('订购量不能为0', 'tips').show(true); //✕✓
                return;
            }

            var amount = 0;
            for (var i = 0; i < orderJsonData.items.length; i++) {
                var curr = orderJsonData.items[i];
                amount += curr.iQuantity * parseFloat($$("div[data-page=protDetailPage] input[data-skuid='" + curr.iSKUId + "']").attr("data-price"));
                if (curr.iQuantity) {
                    var num = curr.iQuantity.toString();
                    var pointIndex = num.indexOf('.');
                    if (pointIndex > -1 && num.length - (pointIndex + 1) > 2) {
                        myApp.toast("订购数量最大精确度为2", 'tips').show(true);
                        return;
                    }
                }
            }
            orderJsonData.priceAount = amount;
            myApp.mainView.router.loadPage({
                url: 'pages/confirmOrder.html', query: orderJsonData
            });
            myApp.closeModal('.productParam-popup');
        });
        self.pageInit(context.product);
    });
};
UOrderApp.pages.ProductPageController.prototype.pageInit = function (product) {
    var self = this;
    var getPrice = function (skuid, count, obj) {
        cb.rest.getJSON('ma/Products/getDiscountPrice?skuId=' + skuid + "&count=" + count, function (data) {
            if (data.code != 200) {
                myApp.toast(data.message, 'error').show(true); //✕✕✓
                return;
            }

            obj.parent().find("input").attr("data-price", data.data);
            $$("div[data-page=protDetailPage] .col-66 .color-orange-u span").text(data.data);
        });
    }
    var reloadSpec = function () {
        var params = {};
        var formProductId = myApp.formToJSON('#ProductId');
        params.id = formProductId.productId
        var formData = myApp.formToJSON('#SpecsDetail');
        var specItemIdArray = new Array();
        for (var item in formData) {
            specItemIdArray.push(formData[item]);
        }
        params.specItemIds = specItemIdArray
        cb.rest.getJSON('ma/Products/getSkus', params, function (data) {
            if (data.code != 200) {
                myApp.toast('加载最新商品信息失败', 'error').show(true); //✕✓
                return;
            }

            $$('#SUKInfo').html(self.SUKtplFunc({ SKUDetails: data.data, unit: product.oUnit.cName }));
            // 数量加
            $$('.icon-add').on('click', function (e) {
                var container = $$(this).parent().find('input');
                container.val(parseInt(container.val()) + 1);
                getPrice($$(this).data("skuid"), parseFloat(container.val()), $$(this));
            });

            //数量改变事件
            $$("div[data-page=protDetailPage] input[type=number]").on("change", function () {
                var count = parseFloat($$(this).val());
                if (isNaN(count)) {
                    $$(this).val(0);
                    return;
                }
                getPrice($$(this).data("skuid"), count, $$(this));
            });

            // 数量减
            $$('.icon-less').on('click', function (e) {
                var container = $$(this).parent().find('input');
                if (parseInt(container.val()) == 0) {
                    container.val(0);
                } else {
                    container.val(parseInt(container.val()) - 1);
                }
                getPrice($$(this).data("skuid"), parseFloat(container.val()), $$(this));
            });
        });
    };
    if ($$("#SpecsDetail .row").length > 0) {
        reloadSpec();
    }
    $$('.attrItem').on('click', reloadSpec);
};