UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.CartPageController = function () {
    this.cartItemtplFunc = Template7.compile($$('#cartItemTpl').html());
    this.productAttrFunc = Template7.compile($$('#productAttrTpl').html());
};
UOrderApp.pages.CartPageController.prototype.preprocess = function (content, url, next) {
    var context = $$.parseUrlQuery(url) || {};
    var self = this;
    cb.rest.getJSON('ma/ShoppingCarts/getCartList', function (data) {
        if (data.code != 200) {
            myApp.toast(data.message, 'error').show(true);
            return;
        }
        self.rawData = data.data;
        context = self.FormatDetailDataFunc(data.data);
        var template = Template7.compile(content);
        var resultContent = template(context);
        self.cartServerData = context.cartList;
        next(resultContent);
    });
};

UOrderApp.pages.CartPageController.prototype.pageInit = function (page) {
    var self = this;
    //编辑按钮功能
    $$('div[data-page="cart"] .btn-editStatue').on('click', function (e) {
        var val = $$(this).attr('data-Type');
        if (val == 'edit') {
            $$(this).attr('data-Type', 'submit').html('完成');
            $$('div[data-page="cart"] .page-content').find('.editControl').addClass('edit-status');
            $$('div[data-page="cart"] .page-content').find('input.editControl').attr('disabled', 'disabled');
        }
        else {
            $$(this).attr('data-Type', 'edit').html('编辑');
            $$('div[data-page="cart"] .page-content').find('.editControl').removeClass('edit-status');
            $$('div[data-page="cart"] .page-content').find('input.editControl').removeAttr('disabled');
        }
    });

    self.RegeistEvent();

    //全选按钮功能
    $$('div[data-page="cart"] .ck-allSelect').on('click', function (e) {
        var isCheck = $$(this).find('input[type="checkbox"]').prop('checked');
        $$('div[data-page="cart"] .cartItemContainer').find('input[type="checkbox"]').prop('checked', !isCheck);

        $$('.sum-price.cart-balance-container').trigger('selectedChange');
    });

    //下拉刷新
    $$('.page-content.cart-main-container').on('refresh', function (e) {
        cb.rest.getJSON('ma/ShoppingCarts/getCartList', function (data) {
            if (data.code != 200) {
                myApp.toast(data.message, 'error').show(true);
                return;
            }
            var cartData = self.FormatDetailDataFunc(data.data);
            self.cartServerData = cartData.cartList;
            $$('div[data-page="cart"] .cartItemContainer').html(self.cartItemtplFunc(cartData));
            self.RegeistEvent();
            myApp.pullToRefreshDone();
        });
    });

    //计算页脚统计信息
    $$('.sum-price.cart-balance-container').on('selectedChange', function (e) {
        var total = {
            totalPrice: 0,
            type: 0,
            number: 0
        };
        var selectedList = $$('div[data-page="cart"] .cartItemContainer').find('input[type="checkbox"]:checked');
        if (selectedList.length > 0) {
            var typeArray = new Array();
            selectedList.each(function () {
                var $li = $$(this).parents('li');
                var skuId = $li.attr('data-skuid');
                var pid = $li.attr('data-productId');
                if (typeArray.indexOf(pid) < 0)
                    typeArray.push(pid);
                if (pid && skuId) {
                    if (!self.cartServerData) return;
                    for (var index = 0; index < self.cartServerData.length; index++) {
                        var item = self.cartServerData[index];
                        if (item.id == pid) {
                            for (var i = 0; i < item.SkuSpecItems.length; i++) {
                                var skuItem = item.SkuSpecItems[i];
                                if (skuItem.id == skuId) {
                                    total.totalPrice += skuItem.fSalePrice * skuItem.iQuantity;
                                    total.number += skuItem.iQuantity;
                                }
                            }
                        }
                    }
                }

            });
            total.type = typeArray.length;
            $$(this).html('合计:<span class="sum-price-c">￥' + total.totalPrice.toFixed(2) + '</span><br>' +
                        '<span class="count">' + total.type + '种' + total.number + '件 </span>');
        }
        else
            $$(this).html('合计:<span class="sum-price-c">￥' + total.totalPrice.toFixed(2) + '</span><br>' +
                        '<span class="count">' + total.type + '种' + total.number + '件 </span>');
    });

    //立即结算按钮功能
    $$('.button.cart-btn-submit').on('click', function (e) {
        var selectedItem = $$('div[data-page="cart"] .cartItemContainer').find('input[type="checkbox"]:checked');
        if (selectedItem.length == 0) {
            myApp.toast('请选择要结算的项', 'tips').show(true);
            return;
        }
        var param = new Array();
        selectedItem.each(function () {
            var $li = $$(this).parents('li');
            var skuId = $li.attr('data-skuid');
            var cid = $li.attr('data-id');
            if (cid && skuId) {
                var num = $li.find('.numberManage').find('input').val();
                param.push({
                    id: cid,
                    iSKUId: skuId,
                    iQuantity: num
                });
            }
        });
        //立即结算
        cb.rest.postData('mc/orders/GenerateOrderByShoppingCart', { items: param }, function (data) {
            if (typeof data == 'string')
                data = JSON.parse(data);

            if (data.code != 200) {
                myApp.toast(data.message, 'error').show(true);
                return;
            }
            myApp.mainView.router.loadPage({
                url: 'pages/confirmOrder.html'
            });
        });
    });

    //收藏按钮功能
    $$('.button.cart-btn-collection').on('click', function (e) {
        var selectedItem = $$('div[data-page="cart"] .cartItemContainer').find('input[type="checkbox"]:checked');
        if (selectedItem.length == 0) {
            myApp.toast('请选择要收藏的项目？', 'tips').show(true);
            return;
        }
        var param = new Array();
        selectedItem.each(function () {
            var $li = $$(this).parents('li');
            var id = $li.attr('data-id');
            if (id)
                param.push({ id: id });
        });
        cb.rest.postData('mc/ShoppingCarts/moveToFavorite', { skuIds: param }, function (data) {
            if (typeof data == 'string')
                data = JSON.parse(data);
            if (data.code != 200) {
                myApp.toast(data.message, 'error').show(true);
                return;
            }
            myApp.toast('收藏成功', 'success').show(true);
            myApp.mainView.router.refreshPage();
        });

    });

    //删除按钮功能
    $$('.button.cart-btn-delete').on('click', function (e) {
        var selectedItem = $$('div[data-page="cart"] .cartItemContainer').find('input[type="checkbox"]:checked');
        if (selectedItem.length == 0) {
            myApp.toast('请选择要删除的项目？', 'tips').show(true);
            return;
        }
        var param = new Array();
        selectedItem.each(function () {
            var $li = $$(this).parents('li');
            var id = $li.attr('data-id');
            if (id)
                param.push({ id: id });
        });

        myApp.confirm('您确定要删除这' + param.length + '条购物车记录?', '提示信息', function () {
            cb.rest.postData('mc/ShoppingCarts/del', { items: param }, function (data) {
                if (typeof data == 'string')
                    data = JSON.parse(data);
                if (data.code != 200) {
                    myApp.toast(data.message, 'error').show(true);
                    return;
                }
                myApp.toast('删除成功', 'success').show(true);
                myApp.mainView.router.refreshPage();
            });
        });
    });
};

//注册动态内容事件
UOrderApp.pages.CartPageController.prototype.RegeistEvent = function () {
    var self = this;
    //是否显示输入框控制按钮
    $$('div[data-page="cart"] .numberManage').find('input').focus(function (e) {
        $$(this).parent().find('i').removeClass('hide');
    }).blur(function (e) {
        $$(this).parent().find('i').addClass('hide');
    });

    //控制输入框数量
    $$('div[data-page="cart"] .numberManage').find('i').on('click', function (e) {
        $$(this).parent().find('i').removeClass('hide');
        var $input = $$(this).parent().find('input');
        var val = $input.val();
        if (!val) return;
        val = parseInt(val);

        if ($$(this).hasClass('icon-cart-less')) {
            if (val <= 1) {
                myApp.toast('订购数量不能再少了', 'tips').show(true);
                return;
            }
            else if (parseInt($input.attr('data-min')) > val) {
                myApp.toast('订购数量不能少于起订量', 'tips').show(true);
                return;
            }
            else
                $input.val(val - 1);
        }
        if ($$(this).hasClass('icon-cart-add'))
            $input.val(val + 1);

        if ($$(this).hasClass('icon-cart-ok')) {
            $$(this).parent().find('i').addClass('hide');
        }
        e.stopPropagation();
    });

    //checkbox 选中操作
    $$('div[data-page="cart"] .cartNew-list').find('li').on('change', function (e) {
        if ($$(this).hasClass('productItemContent')) {
            var isCheck = $$(this).children('label').children('input[name="my-checkbox"]').prop('checked');
            $$(this).find('input[type="checkbox"]').prop('checked', isCheck);
        }
        else {
            var isCheck = $$(this).find('input[name="my-checkbox"]').prop('checked');
            if (!isCheck) {
                if ($$(this).parent('ul').find('input[type="checkbox"]:checked').length == 0)
                    $$(this).parents('.productItemContent').children('label').children('input[name="my-checkbox"]').prop('checked', isCheck);
            }
            else
                $$(this).parents('.productItemContent').children('label').children('input[name="my-checkbox"]').prop('checked', isCheck);
        }
        $$('.sum-price.cart-balance-container').trigger('selectedChange');
        e.stopPropagation();
    });

    //属性容器点击事件
    $$('.editControl.propertyContainer').on('click', function (e) {
        if ($$('div[data-page="cart"] .btn-editStatue').attr('data-Type') != 'edit') {
            var pid = $$(this).attr('data-productid');
            var skuid = $$(this).attr('data-skuid');
            var selectItemData = null;
            for (var i = 0; i < self.rawData.length; i++) {
                if (self.rawData[i].iProductId == pid && self.rawData[i].iSKUId == skuid)
                    selectItemData = self.rawData[i];
            }
            cb.rest.getJSON('ma/Products/getProduct', { id: pid }, function (data) {
                if (typeof data == 'string')
                    data = JSON.parse(data);
                if (data.code != 200) {
                    myApp.toast(data.message, 'error').show(true);
                    return;
                }
                var data = self.FormatAttrDataFunc(data.data, selectItemData);
                var attrHtml = self.productAttrFunc({ product: data });

                $$('.popup.popup-prodSUK').html(attrHtml);
                //属性切换事件触发
                $$('.popup.popup-prodSUK').find('input[type="radio"]').on('change', function (e) {
                    var param = { id: pid };
                    var specItemIds = new Array();
                    $$('.popup.popup-prodSUK').find('input[type="radio"]:checked').each(function () {
                        specItemIds.push($$(this).val());
                    });
                    param.specItemIds = specItemIds;
                    //加载SKU
                    cb.rest.getJSON('ma/Products/getSkus', param, function (skudata) {
                        if (typeof skudata == 'string')
                            skudata = JSON.parse(skudata);
                        if (skudata.code != 200) {
                            myApp.toast(data.message, 'error').show(true);
                            return;
                        }
                        var stepHtml = '<dl><dt>' + skudata.data[0].iMinOrderQuantity + '件 起订</dt><dd><em>￥</em>' + skudata.data[0].fSalePrice.toFixed(2) + '</dd></dl>';
                        //价格阶梯
                        if (skudata.data[0].lsPriceJustifyItems.length > 0) {
                            for (var index = 0; index < skudata.data[0].lsPriceJustifyItems.length; index++) {
                                var priceItem = skudata.data[0].lsPriceJustifyItems[index];
                                stepHtml += '<dl><dt>' + priceItem.iLowerlimit + '-' + priceItem.iHigherlimit + '</dt><dd><em>￥</em>' + priceItem.iPrice.toFixed(2) + '</dd></dl>';
                            }
                        }
                        $$('#InventoryCount').html('库存  ' + skudata.data[0].lInventoryCount);
                        $$('.popup-number.priceStepContainer').html(stepHtml);
                    });
                });

                myApp.popup('.popup.popup-prodSUK');

                $$('.popup.popup-prodSUK').find('input[type="radio"]').eq(0).trigger('change');

                //控制数量输入
                $$('.popup.popup-prodSUK .numberManage').find('i').on('click', function (e) {
                    var $input = $$(this).parent().find('input');
                    var val = parseInt($input.val());
                    if ($$(this).hasClass('icon-cart-less')) {
                        if (val <= 1) {
                            myApp.toast('至少订购一件哦', 'tips').show(true);
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

                //数量输入框事件
                $$('.popup.popup-prodSUK .numberManage').find('input').on('keyup change', function (e) {
                    $$(this).val($$(this).val().replace(/[^\d]/g, ''));
                    if ($$(this).val())
                        $$('.popup-bottom .totalContainer').html($$(this).val() + ' <em>件</em>   ' + (parseInt($$(this).val()) * data.fSalePrice).toFixed(2) + ' <em>元</em> ');
                    else
                        $$('.popup-bottom .totalContainer').html('0 <em>件</em>   0.00 <em>元</em> ');
                });

                //修改SKU属性按钮
                $$('.popup-bottom .btn-update-sku').on('click', function (e) {
                    var param = { cart: { id: selectItemData.id } };
                    var specItemIds = new Array();
                    $$('.popup.popup-prodSUK').find('input[type="radio"]:checked').each(function () {
                        specItemIds.push($$(this).val());
                    });
                    param.specItemsIds = specItemIds;
                    if ($$('.popup.popup-prodSUK .numberManage').find('input').val())
                        param.count = $$('.popup.popup-prodSUK .numberManage').find('input').val();
                    //修改SKU
                    cb.rest.postData('mc/ShoppingCarts/updateSku', param, function (mdata) {
                        if (typeof mdata == 'string')
                            mdata = JSON.parse(mdata);
                        if (mdata.code != 200) {
                            myApp.toast(data.message, 'error').show(true);
                            return;
                        }
                        myApp.closeModal('.popup.popup-prodSUK');
                        myApp.mainView.router.refreshPage();
                    });
                });
            });
        }
    });
};

//格式化：构件清单数据源
UOrderApp.pages.CartPageController.prototype.FormatDetailDataFunc = function (val) {
    var detailData = new Array();
    var productType = {};
    if (val.length > 0) {
        for (var index = val.length - 1; index > 0; index--) {
            var item = val[index];
            var o = item.oSKU.oProduct;
            var iProductId = item.iProductId;

            if (productType[iProductId]) continue;

            var arraySku = val.filter(function (itemObj) {
                return itemObj.iProductId === iProductId;
            });
            productType[iProductId] = true;
            if (arraySku.length > 0) {
                var attrArray = new Array();
                for (var j = 0; j < arraySku.length; j++) {
                    var attr = {
                        id: arraySku[j].id,
                        skuid: arraySku[j].oSKU.id,
                        iMinOrderQuantity: arraySku[j].oSKU.iMinOrderQuantity,
                        iQuantity: arraySku[j].iQuantity,
                        fSalePrice: arraySku[j].fSalePrice,
                        iProductId: item.iProductId,
                        lsSkuSpecItems: arraySku[j].oSKU.lsSkuSpecItems
                    };
                    attrArray.push(attr);
                }
                o.SkuSpecItems = attrArray;
            }
            detailData.push(o);
        }
    }
    return { cartList: detailData };
};

//格式化：构件属性选择数据源
UOrderApp.pages.CartPageController.prototype.FormatAttrDataFunc = function (val, data) {
    if (val) {
        val.iQuantity = data.iQuantity;
        for (var i = 0; i < val.lsSpecs.length; i++) {
            var item = val.lsSpecs[i];
            for (var j = 0; j < data.oSKU.lsSkuSpecItems.length; j++) {
                var selectedItem = data.oSKU.lsSkuSpecItems[j];
                if (selectedItem.iSpecId == item.id) {
                    for (var k = 0; k < item.lsSpecItem.length; k++) {
                        item.lsSpecItem[k].parentId = item.id;
                        if (item.lsSpecItem[k].id == selectedItem.id)
                            item.lsSpecItem[k].isCheck = true;
                    }
                }
            }
        }
    }
    return val;
};