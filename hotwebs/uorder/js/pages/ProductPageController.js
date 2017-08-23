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
        } else {
            context.product.lsSpecsLength = true;
            json = context.product.lsSpecs.pop();
        }
        var template = Template7.compile(content);
        var resultContent = template(context);
        container.html($$($$(resultContent)[0]).children('.pages')[0].innerHTML);

        if (context.product.lsSpecs.length == 1) {
            cb.rest.getJSON('ma/Products/getSkus', params, function (data) {
                if (data.code != 200) {
                    myApp.toast('获取商品信息失败', 'error').show(true); //✕✓
                    return;
                }
                $$('#SUKInfo').html(self.SUKtplFunc({ SKUDetails: data.data }));
                $$('.icon-add').on('click', function (e) {
                    var container = $$(e.target.closest('div.item-title')).find('input');
                    container.val(parseInt(container.val()) + 1);
                });
                // 数量减
                $$('.icon-less').on('click', function (e) {
                    var container = $$(e.target.closest('div.item-title')).find('input');
                    if (parseInt(container.val()) == 0) {
                        container.val("0");
                    } else {
                        container.val(parseInt(container.val()) - 1);
                    }
                });
            });
        }
        // 添加购物车
        $$('.updateCancel').on('click', function (e) {
            var formData = myApp.formToJSON('#sku');
            // 组装参数JSON对象
            var length = 0;
            var formJson = {};
            var itemsArray = new Array();
            var id, count;
            for (var item in formData) {
                length++;
                if (length % 2) {
                    id = formData[item]
                } else {
                    count = formData[item]
                }
                if (length % 2 == 0) {
                    itemsArray.push({ iSKUId: id, iQuantity: count });
                }
            }
            formJson.items = itemsArray;
            if (formJson.items.length == 0) {
                myApp.toast('该商品不能加入购物车', 'error').show(true); //✕✓
                return;
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
            var length = 0;
            var orderJsonData = {};
            var itemsArray = new Array();
            var id, count;
            for (var item in formDatas) {
                length++;
                if (length % 2) {
                    id = formDatas[item]
                } else {
                    count = formDatas[item]
                }
                if (length % 2 == 0 && parseInt(count) > 0) {
                    itemsArray.push({ iSKUId: id, iQuantity: count });
                }
            }
            // 商品SKUid和数量
            orderJsonData.items = itemsArray;
            // 商品详细信息
            if (!context.product.lsSpecsLength) { }
            else {
                data.data.lsSpecs.push(json);
            }
            orderJsonData.productDetail = data.data;
            if (orderJsonData.items.length == 0) {
                myApp.toast('该商品不能订购', 'tips').show(true); //✕✓
                return;
            }
            myApp.mainView.router.loadPage({
                url: 'pages/confirm-order.html', query: orderJsonData
            });
            myApp.closeModal('.productParam-popup');
        });
        self.pageInit();
    });
};
UOrderApp.pages.ProductPageController.prototype.pageInit = function (page) {
    var self = this;
    $$('.attrItem').on('click', function (e) {
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
            var context = {};
            context.SKUDetails = data.data;
            $$('#SUKInfo').html(self.SUKtplFunc(context));
            // 数量加
            $$('.icon-add').on('click', function (e) {
                var container = $$(e.target.closest('div.item-title')).find('input');
                container.val(parseInt(container.val()) + 1);
            });
            // 数量减
            $$('.icon-less').on('click', function (e) {
                var container = $$(e.target.closest('div.item-title')).find('input');
                if (parseInt(container.val()) == 0) {
                    container.val("0");
                } else {
                    container.val(parseInt(container.val()) - 1);
                }
            });
        });
    });

};