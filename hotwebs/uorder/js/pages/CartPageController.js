UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.CartPageController = function () {
};
UOrderApp.pages.CartPageController.prototype.preprocess = function (content, url, next) {
    var node = document.createElement("div");
    node.innerHTML = content;
    var scripts = node.getElementsByTagName("script");
    for (var i = scripts.length - 1; i >= 0; i--) {
        scripts[i].parentNode.removeChild(scripts[i]);
    }
    content = node.innerHTML;
    var context = $$.parseUrlQuery(url) || {};
    var self = this;
    cb.rest.getJSON('ma/ShoppingCarts/getCartList', function (data) {
        if (data.code == 200) {
            self.oData = data;
            context.data = data;
            for (var i = 0; i < data.data.length; i++) {
                if (data.data[i].oSKU.lsSkuSpecItems.length == 0) {
                    data.data[i].oSKU.hasSKU = false;
                } else {
                    data.data[i].oSKU.hasSKU = true;
                }
            }
            context.serverhost = cb.rest.appContext.serviceUrl;
            var template = Template7.compile(content);
            var resultContent = template(context);
            next(resultContent);
            myApp.initImagesLazyLoad(myApp.mainView.activePage.container);
        }
        else {
            myApp.toast(data.message, 'error').show(true);
        }
    });
};
UOrderApp.pages.CartPageController.prototype.pageInit = function (page) {
    var self = this;
    var IsEdit = false;
    var pageContainer = $$(page.container);
    $$('div[data-page="cart"] .afterEdit').hide();
    $$('div[data-page="cart"] li input[type="checkbox"]').on('change', function (e) {
        var id = $$(this).parents('.rootLi').attr('data-id');
        var isChecked = $$(this).prop('checked');
        var json = {};
        var index;
        for (var i = 0; i < self.oData.data.length; i++) {
            if (self.oData.data[i].id == id) {
                index = i;
            }
        }
        json.price = self.oData.data[index].fSalePrice;
        json.quantity = self.oData.data[index].iQuantity;
        var fPrice = json.price * json.quantity;
        if (!IsEdit) {
            if (isChecked) {
                var oPrice = parseFloat($$("#finalPrice").html().split("￥")[1]);
                fPrice = fPrice + oPrice;
                $$("#finalPrice").html("￥" + fPrice);
                var flag = 0;
                for (var i = 0; i < self.oData.data.length; i++) {
                    var isCheck = $$('li input[type="checkbox"]').eq(i).prop('checked');
                    if (isCheck) {
                        flag++;
                    }
                };
                if (flag == self.oData.data.length) {
                    $$('#all').prop('checked', true);
                }
            }
            else {
                var oPrice = parseFloat($$("#finalPrice").html().split("￥")[1]);
                oPrice = parseFloat(oPrice - fPrice);
                if (oPrice == 0) {
                    $$("#finalPrice").html("￥0.00");
                }
                else {
                    $$("#finalPrice").html("￥" + oPrice);
                }
                $$('#all').prop('checked', false);
            }
        } else {
            if (isChecked) {
                var flag = 0;
                for (var i = 0; i < self.oData.data.length; i++) {
                    var isCheck = $$('li input[type="checkbox"]').eq(i).prop('checked');
                    if (isCheck) {
                        flag++;
                    }
                };
                if (flag == self.oData.data.length) {
                    $$('#all').prop('checked', true);
                }
            }
            else {
                $$('#all').prop('checked', false);
            }
        }
    });
    $$('#all').on('change', function (e) {
        var isChecked = $$(this).prop('checked');
        if (isChecked) {
            $$('li input[type="checkbox"]').prop('checked', true);
            var fPrice = 0;
            for (var i = 0; i < self.oData.data.length; i++) {
                fPrice = self.oData.data[i].fSalePrice * self.oData.data[i].iQuantity + fPrice;
            };
            $$("#finalPrice").html("￥" + fPrice);
        }
        else {
            $$('li input[type="checkbox"]').prop('checked', false);
            $$("#finalPrice").html("￥0.00");
        }
    });
    $$('div[data-page="cart"] .shoppingCart_property').on('click', function (e) {
        var rootLi = $$(this).parents('.rootLi');
        var id = rootLi.attr('data-id');
        var index;
        for (var i = 0; i < self.oData.data.length; i++) {
            if (self.oData.data[i].id == id) {
                index = i;
            }
        }
        var template = $$('#linkToDetail').html();
        var params = { id: self.oData.data[index].iProductId.toString() }//'203' 
        cb.rest.getJSON('ma/Products/getProduct', params, function (data) {
            if (data.code != 200) {
                myApp.toast('获取商品信息失败', 'error').show(true);
                return;
            }
            var compiledTemplate = Template7.compile(template);
            var html = compiledTemplate(data);
            $$('.cart-popup').html(html);

            $$('.cart-popup .updateOk').on('click', function () {
                var params = {};
                params.item = [];
                params.text = [];
                for (var i = 0; i < $$('.cart-popup input[type="radio"]').length; i++) {
                    var s = $$('.cart-popup input[type="radio"]')[i].checked;
                    var jsonText = {};
                    if (s) {
                        params.item.push($$('.cart-popup input[type="radio"]').eq(i).val());
                        jsonText.text = $$('.cart-popup input[type="radio"]').eq(i).next('span').html();
                        var h = $$('.cart-popup input[type="radio"]').eq(i).parents('.col-100.row').find('.cName').html();
                        jsonText.cName = h;
                        params.text.push(jsonText);
                    }
                }
                var cName = rootLi.find('.afterEdit .item-text p.property').find('.cName');
                for (var i = 0; i < params.text.length; i++) {
                    for (var j = 0; j < cName.length; j++) {
                        if (params.text[i].cName == cName.eq(j).html()) {
                            cName.eq(j).nextAll('.propertySpan').html(params.text[i].text);
                        }
                    }
                }
                if (params.item.length > 0) {
                    cb.rest.postData('mc/ShoppingCarts/updateSku',
                        {
                            cart: { id: self.oData.data[index].id },
                            specItemsIds: params.item
                        },
                            function (data) {
                                data = JSON.parse(data);
                                if (data.code == 200) {
                                }
                                else {
                                    myApp.toast(data.message, 'error').show(true); //✕✓
                                }
                            });
                }
            });
            myApp.popup(".cart-popup");
        });
    });
    $$('div[data-page="cart"] .addNumber').on('click', function (e) {
        $$(this).prev('input').eq(0).val(parseInt($$(this).prev('input').eq(0).val()) + 1);
        var id = $$(this).parents('.rootLi').attr('data-id');
        var index;
        for (var i = 0; i < self.oData.data.length; i++) {
            if (self.oData.data[i].id == id) {
                index = i;
            }
        }
        self.oData.data[index].iQuantity++;
    });
    $$('div[data-page="cart"] .reduceNumber').on('click', function (e) {
        var number = parseInt($$(this).next('input').eq(0).val());
        if (number > 1) {
            $$(this).next('input').eq(0).val(number - 1);
            var id = $$(this).parents('.rootLi').attr('data-id');
            var index;
            for (var i = 0; i < self.oData.data.length; i++) {
                if (self.oData.data[i].id == id) {
                    index = i;
                }
            }
            self.oData.data[index].iQuantity--;
        }
        else {
            myApp.toast('数量不能在减少了', 'tips').show(true);
        }
    });
    $$('div[data-page="cart"] .item-title-row .item-number1 input[type=number]').on('keyup', function (e) {
        var index;
        var id = $$(this).parents('.rootLi').attr('data-id');
        for (var i = 0; i < self.oData.data.length; i++) {
            if (self.oData.data[i].id == id) {
                index = i;
                break;
            }
        }
        if (/^[1-9]\d*$/.test($$(this).val())) {
            self.oData.data[index].iQuantity = parseInt($$(this).val());
        } else {
            $$(this).val(1);
            self.oData.data[index].iQuantity = 1;
        }
    });
    $$('div[data-page="cart"] .shopping-count').on('click', function (e) {
        var length = $$('li input[type=checkbox]').length;
        var cartId = [];
        for (var i = 0; i < length; i++) {
            if ($$('li input[type=checkbox]').eq(i).prop('checked')) {
                cartId.push($$('.rootLi').eq(i).attr('data-id'));
            }
            else {
            }
        }
        if (cartId.length == 0) {
            myApp.toast('请选择要结算的商品', 'tips').show(true);
        }
        else {
            var formData = {};
            formData.cartId = cartId;
            formData.data_type = 'cart';
            myApp.mainView.router.load({
                url: 'pages/confirm-order.html',
                query: formData
            });
        }
    });
    $$('div[data-page="cart"] .shoppingDel_btn').on('click', function (e) {
        var delArray = [];
        var idArray = [];
        for (var i = 0; i < $$('li input[type="checkbox"]').length; i++) {
            var isCheck = $$('li input[type="checkbox"]').eq(i).prop('checked');
            if (isCheck) {
                var id = $$('.rootLi').eq(i).attr('data-id');
                for (var j = 0; j < self.oData.data.length; j++) {
                    if (self.oData.data[j].id == id) {
                        var json = {};
                        json.id = id;
                        delArray.push(json);
                        idArray.push(id);
                    }
                }
            }
        }
        if (delArray.length > 0) {
            myApp.confirm('确定要删除吗', '', okCallback);
            function okCallback() {
                cb.rest.postData('mc/ShoppingCarts/del', { items: delArray }, function (data) {
                    data = JSON.parse(data);
                    if (data.code == 200) {
                        for (var i = 0; i < idArray.length; i++) {
                            for (var j = 0; j < $$('.rootLi').length; j++) {
                                if ($$('.rootLi').eq(j).attr('data-id') == idArray[i]) {
                                    $$('ul .rootLi').eq(j).remove();
                                }
                            }
                        }
                        var len = $$('.rootLi').length;
                        if (len == 0) {
                            myApp.mainView.router.refreshPage();
                        }
                    }
                    else {
                        myApp.toast(data.message, 'error').show(true); //✕✓
                    }
                });
            }
        }
        else {
            myApp.toast('请选择要结算的商品', 'tips').show(true); //✕✓
        }
    });
    $$('div[data-page="cart"] .cart-del').on('click', function (e) {
        myApp.confirm('确定要删除吗', '', okCallback);
        var _this = this;
        var id = $$(this).parents('.rootLi').attr('data-id');
        var index;
        for (var i = 0; i < self.oData.data.length; i++) {
            if (self.oData.data[i].id == id) {
                index = i;
            }
        }
        function okCallback() {
            cb.rest.postData('mc/ShoppingCarts/del', { items: [{ id: self.oData.data[index].id }] }, function (data) {
                data = JSON.parse(data);
                if (data.code == 200) {
                    var that = $$(_this).parents('.rootLi').index();
                    $$('ul .rootLi').eq(that).remove();
                    var len = $$('.rootLi').length;
                    if (len == 0) {
                        myApp.mainView.router.refreshPage();
                    }
                }
                else {
                    myApp.toast(data.message, 'error').show(true); //✕✓
                }
            });
        }
    });
    $$('#cart-edit').on('click', function (e) {
        if (!IsEdit) {
            $$('.beforEdit').hide();
            $$('.afterEdit').css('display', 'flex');
            $$('#cart-edit').html('完成');
            $$('.bottom-bar.row span.col-33').html('').css('height', '10px');
            $$('.shopping-count').hide();
            $$('.shoppingDel_btn').show();
            IsEdit = true;
        }
        else {
            var param = [];
            for (var i = 0; i < $$('.rootLi').length; i++) {
                for (var j = 0; j < self.oData.data.length; j++) {
                    if (self.oData.data[j].id == $$('.rootLi').eq(i).attr('data-id')) {
                        var json = {};
                        json.id = self.oData.data[j].id;
                        json.iSKUId = self.oData.data[j].iSKUId;
                        json.iQuantity = self.oData.data[j].iQuantity;
                        param.push(json);
                    }
                }
            }
            cb.rest.postData('mc/ShoppingCarts/update', { items: param }, function (data) {
                data = JSON.parse(data);
                if (data.code == 200) {
                } else {
                    myApp.toast(data.message, 'error').show(true);
                }
                IsEdit = false;
                myApp.mainView.router.refreshPage();
            });
        }
    });

    $$('div[data-page="cart"] .retern-btn.shoppingCart').on('click', function () {
        $$('#view-1').trigger('show');
    });
};
