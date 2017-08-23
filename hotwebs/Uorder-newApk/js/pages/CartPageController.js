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
        context.totalCount = context.cartList.length;
        context.serverhost = cb.rest.appContext.serviceUrl;
        var template = Template7.compile(content);
        var resultContent = template(context);
        self.cartServerData = context.cartList;
        next(resultContent);

        if (self.rawData.length == 0) {
            $$('div[data-page="cart"] .cartItemContainer').parent().html(self.GetEmptyHtml());
            $$('div[data-page="cart"] .cart-balance-container').parent().hide();
        }
        else
            $$('div[data-page="cart"] .cart-balance-container').parent().show();
    });
};

UOrderApp.pages.CartPageController.prototype.pageInit = function (page) {
    cb.reKeyboard($$("div[data-page=cart] input.editControl"), "cart");
    var self = this;
    //编辑按钮功能
    $$('div[data-page="cart"] .btn-editStatue').on('click', function (e) {
        var val = $$(this).attr('data-Type');
        if (val == 'edit') {
            $$(this).attr('data-Type', 'submit').html('完成');
            $$('div[data-page="cart"] .page-content').find('.editControl').addClass('edit-status');
            $$('div[data-page="cart"] .bottom-bar.row').find('.editControl').addClass('edit-status');
            $$('div[data-page="cart"] .page-content').find('input.editControl').attr('disabled', 'disabled');
        }
        else {
            $$(this).attr('data-Type', 'edit').html('编辑');
            $$('div[data-page="cart"] .page-content').find('.editControl').removeClass('edit-status');
            $$('div[data-page="cart"] .bottom-bar.row').find('.editControl').removeClass('edit-status');
            $$('div[data-page="cart"] .page-content').find('input.editControl').removeAttr('disabled');
        }
    });

    self.RegeistEvent();

    //全选按钮功能
    $$('div[data-page="cart"] .ck-allSelect').on('change', function (e) {
        var isCheck = $$(this).find('input[type="checkbox"]').prop('checked');
        $$('div[data-page="cart"] .cartItemContainer').find('input[type="checkbox"]').prop('checked', isCheck);

        $$('.sum-price.cart-balance-container').trigger('selectedChange');
    });

    //下拉刷新
    $$('.page-content.cart-main-container').on('refresh', function (e) {
        cb.rest.getJSON('ma/ShoppingCarts/getCartList', function (data) {
            if (data.code != 200) {
                myApp.toast(data.message, 'error').show(true);
                return;
            }
            self.rawData = data.data;
            var cartData = self.FormatDetailDataFunc(data.data);
            cartData.serverhost = cb.rest.appContext.serviceUrl;
            self.cartServerData = cartData.cartList;
            $$('div[data-page="cart"] .cartItemContainer').html(self.cartItemtplFunc(cartData));
            $$('div[data-page="cart"] .navbar .totalContainer').html('(' + self.cartServerData.length + ')');
            self.RegeistEvent();
            myApp.pullToRefreshDone();
            cb.reKeyboard($$("div[data-page=cart] input.editControl"), "cart");
            myApp.initImagesLazyLoad(myApp.mainView.activePage.container);
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
        if ($$('div[data-page="cart"] .cartItemContainer').find('input[type="checkbox"]').length == selectedList.length)
            $$('div[data-page="cart"] .ck-allSelect').find('input[type="checkbox"]').prop('checked', true);
        else
            $$('div[data-page="cart"] .ck-allSelect').find('input[type="checkbox"]').prop('checked', false);

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
                    var iQuantity = $li.find('input[type="number"]').val();
                    if (isNaN(iQuantity))
                        iQuantity = 0;
                    else
                        iQuantity = parseInt(iQuantity);
                    for (var index = 0; index < self.cartServerData.length; index++) {
                        var item = self.cartServerData[index];
                        if (item.id == pid) {
                            for (var i = 0; i < item.SkuSpecItems.length; i++) {
                                var skuItem = item.SkuSpecItems[i];
                                if (skuItem.skuid == skuId) {
                                    if (!iQuantity) {
                                        total.totalPrice += upTool.numMulti(skuItem.fSalePrice, skuItem.iQuantity);
                                        total.number += skuItem.iQuantity;
                                    } else {
                                        total.totalPrice += upTool.numMulti(skuItem.fSalePrice, iQuantity);
                                        total.number += iQuantity;
                                    }
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

    $$('div[data-page="cart"] .cartItemContainer').find('input[type="number"]').on('change', function () {
        $$('.sum-price.cart-balance-container').trigger('selectedChange');
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
    $$('span.cart-btn-collection').on('click', function (e) {
        var selectedItem = $$('div[data-page="cart"] .cartItemContainer').find('input[type="checkbox"]:checked');
        if (selectedItem.length == 0) {
            myApp.toast('请选择要收藏的项目？', 'tips').show(true);
            return;
        }
        var paraStr = "skuIds=";
        selectedItem.each(function () {
            var $li = $$(this).parents('li');
            var id = $li.attr('data-skuid');

            if (id)
                paraStr += id + "&skuIds=";
        });
        paraStr = paraStr.substr(0, paraStr.length - 8);

        cb.rest.postData('mc/ShoppingCarts/moveToFavorite?' + paraStr, undefined, function (data) {
            var result = data;
            if (result.code != 200) {
                myApp.toast(result.message, 'error').show(true); //✕✕✓
                return;
            }
            myApp.toast('收藏成功', 'success').show(true);
            cb.reloadShoppingCartCount();
            myApp.mainView.router.refreshPage();
        });

    });

    //删除按钮功能
    $$('.button.cart-btn-delete').on('click', function (e) {
        var selectedItem = $$('div[data-page="cart"] .cartItemContainer').find('input[type="checkbox"]:checked');
        if (selectedItem.length == 0) {
            myApp.toast('请选择要删除的项目', 'tips').show(true);
            return;
        }
        var param = new Array();
        selectedItem.each(function () {
            var $li = $$(this).parents('li');
            var id = $li.attr('data-id');
            if (id)
                param.push({ id: id });
        });

        cb.confirm('您确定要删除吗?', '提示信息', function () {
            cb.rest.postData('mc/ShoppingCarts/del', { items: param }, function (data) {
                if (data.code != 200) {
                    myApp.toast(data.message, 'error').show(true);
                    return;
                }
                myApp.toast('删除成功', 'success').show(true);

                cb.reloadShoppingCartCount();
                myApp.mainView.router.refreshPage();
            });
        });
    });

    //回退到购物车页  清除缓存信息
    $$(document).on('pageAfterBack', '.page[data-page="confirmOrder"]', function (e) {
        cb.cache.clear();
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
    $$('div[data-page="cart"] .numberManage').find('input').keyup(function () {
        $$(this).val($$(this).val().replace(/[^\d]/g, ''));
        if (!$$(this).val())
            $$(this).val($$(this).attr('data-min'));
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
            var num = $$('div[data-page="cart"] .js-numberManage').find('input').val();
            var price = $$('div[data-page="cart"] .js-numberManage').find('input').attr('data-saleprice');
            if (num) {
                var totalPrice = upTool.numMulti(parseInt(num), parseFloat(price));
                $$(this).parents().find('span.price').html('￥' + totalPrice.toFixed(2));
            }
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
                else if ($$(this).parent('ul').find('input[type="checkbox"]:checked').length < $$(this).parents('.productItemContent').find('ul').children('li').length) {
                    $$(this).parents('.productItemContent').children('label').children('input[name="my-checkbox"]').prop('checked', isCheck);
                }
            }
            else {
                if ($$(this).parents('.productItemContent').find('ul').children('li').length == $$(this).parents('.productItemContent').find('ul').find('input[type="checkbox"]:checked').length)
                    $$(this).parents('.productItemContent').children('label').children('input[name="my-checkbox"]').prop('checked', isCheck);
            }
        }
        $$('.sum-price.cart-balance-container').trigger('selectedChange');
        e.stopPropagation();
    });

    //属性容器点击事件
    $$('.editControl.propertyContainer').on('click', function (e) {
        e.stopPropagation();
        if ($$('div[data-page="cart"] .btn-editStatue').attr('data-Type') != 'edit') {
            var pid = $$(this).attr('data-productid');
            var skuid = $$(this).attr('data-skuid');
            var selectItemData = null;
            for (var i = 0; i < self.rawData.length; i++) {
                if (self.rawData[i].iProductId == pid && self.rawData[i].iSKUId == skuid)
                    selectItemData = self.rawData[i];
            }
            cb.rest.getJSON('ma/Products/getProduct', { id: pid }, function (data) {
                if (data.code != 200) {
                    myApp.toast(data.message, 'error').show(true);
                    return;
                }
                var data = self.FormatAttrDataFunc(data.data.product, selectItemData);
                var attrHtml = self.productAttrFunc({ product: data, serverhost: cb.rest.appContext.serviceUrl });

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
                        var stepHtml = '<dl><dt>' + (skudata.data[0].iMinOrderQuantity ? skudata.data[0].iMinOrderQuantity : '>0') + skudata.data[0].oProduct.oUnit.cName + ' 起订</dt><dd><em>￥</em>' + skudata.data[0].fSalePrice.toFixed(2) + '</dd></dl>';
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
                cb.reKeyboard($$("div.popup-prodSUK .editControl"), $$("div.popup-prodSUK .p-close"));
                $$('.popup.popup-prodSUK').find('input[type="radio"]').eq(0).trigger('change');

                //控制数量输入
                $$('.popup.popup-prodSUK .numberManage').find('i').on('click', function (e) {
                    var $input = $$(this).parent().find('input');
                    var minOrderNumber = $input.attr('data-min') ? parseInt($input.attr('data-min')) : 1;
                    var val = parseInt($input.val());
                    if ($$(this).hasClass('icon-cart-less')) {
                        if (val <= 1) {
                            myApp.toast('至少订购一件哦', 'tips').show(true);
                            $$(this).addClass('disabled');
                        }
                        else {
                            if (minOrderNumber >= val) {
                                myApp.toast('不能低于起订量哦', 'tips').show(true);
                                $$(this).addClass('disabled');
                            } else
                                $input.val(val - 1);
                        }

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
    //优惠信息点击事件
    $$('.cartItemContainer .discountDescContainer').on('click', function (e) {
        var id = $$(this).attr('data-id');
        var productInfo = self.rawData.filter(function (item) {
            return item.iProductId == id;
        })[0];

        var discountArr = productInfo.lsPricePrePromotions;
        if (discountArr.length == 0) return;

        var modalHtml = {
            title: '<div class="discountTitle">' +
                      '优惠说明' +
                      '<i class="icon icon-colse-popup"></i>' +
                    '</div>',
            text: '<div class="list-block  media-list detail-title m-t-0 m-b-0"><ul class=" no-border">'

        };
        for (var i = 0; i < discountArr.length; i++) {
            var item = '<li class="align-top"><div class="item-inner no-border"><span class="promo-type  p-lr-5 ';;
            if (discountArr[i].pType == 1)
                item += 'col-1">商品折';
            else if (discountArr[i].pType == 2)
                item += 'col-2">商品减';
            else
                item += 'col-3">商品赠';

            item += '</span><p class="title">' + discountArr[i].pName + '</p><p>';
            for (var j = 0; j < discountArr[i].pricePreferentialItem.length; j++) {
                if (discountArr[i].pType == 1)
                    item += '满￥' + discountArr[i].pricePreferentialItem[j].consumerSpending + '打' + discountArr[i].pricePreferentialItem[j].discountNum + '折；';
                else if (discountArr[i].pType == 2)
                    item += '满￥' + discountArr[i].pricePreferentialItem[j].consumerSpending + '减￥' + discountArr[i].pricePreferentialItem[j].fireNum + '；';
                else {
                    if (discountArr[i].iGiveawayRule == 1)
                        item += '满￥' + discountArr[i].pricePreferentialItem[j].consumerSpending + '送赠品；';
                    else
                        item += '满' + discountArr[i].pricePreferentialItem[j].consumerSpending + '件送赠品；';
                }
            }
            item += '</p><span class="promotion-date">' + self.FormatDateFunc(discountArr[i].pStartDate) + ' — ' + self.FormatDateFunc(discountArr[i].pEndDate) + '</span></div></li>'
            modalHtml.text += item;
        }
        modalHtml.text += '<ul></div>';
        myApp.modal(modalHtml);
        $$('.discountTitle i.icon-colse-popup').on('click', function () {
            myApp.closeModal();
        });
        e.stopPropagation();
    });
};

//格式化：构件清单数据源
UOrderApp.pages.CartPageController.prototype.FormatDetailDataFunc = function (val) {
    var detailData = new Array();
    var productType = {};
    if (val.length > 0) {
        for (var index = 0; index < val.length; index++) {
            var item = val[index];
            var o = item.oSKU.oProduct;
            o.lsPricePrePromotions = item.lsPricePrePromotions;
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
                        fSalePrice: parseFloat(arraySku[j].fSalePrice.toFixed(2)),
                        iProductId: item.iProductId,
                        lsSkuSpecItems: arraySku[j].oSKU.lsSkuSpecItems,
                        oUnit: arraySku[j].oSKU.oProduct.oUnit.cName
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

UOrderApp.pages.CartPageController.prototype.FormatDateFunc = function (val) {
    if (val.indexOf('.') > 0)
        val = val.split('.')[0];

    var date = new Date(val.replace(/-/g, "/"));
    var mounth = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    return mounth + '月' + day + '日 ' + hour + ':' + minute;
};
//获取商品总数
UOrderApp.pages.CartPageController.prototype.GetTotalCount = function (val) {
    var count = 0;
    for (var i = 0; i < val.length; i++) {
        count += parseInt(val[i].iQuantity);
    }
    return count;
};

UOrderApp.pages.CartPageController.prototype.GetEmptyHtml = function () {
    var html = '<div class="empty">' +
                	'<i class="icon icon-no-cart"></i>' +
                	'<p>购物车里空空如也，赶紧去订货吧！</p>' +
                	'<a href="pages/products.html?dataType=newProduct" class="button">去订货</a>' +
                '</div>';
    return html;
};