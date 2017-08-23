UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.productDetailController = function () {
};
UOrderApp.pages.productDetailController.prototype.preprocess = function (content, url, next) {
    var self = this;
    var context = $$.parseUrlQuery(url) || {};
    var params = { id: context.pid };
    this.productId = context.pid;
    cb.rest.getJSON('ma/Products/getProduct', params, function (data) {
        if (data.code != 200) {
            myApp.toast('获取商品信息失败', 'error').show(true);
            return;
        }
        context.productInfo = data.data;
        self.productInfo = context.productInfo;
        if (data.data.minPrice == data.data.maxPrice)
            context.productInfo._Price = true
        context.serverhost = cb.rest.appContext.serviceUrl;
        var template = Template7.compile(content);
        var resultContent = template(context);

        next(resultContent);
    });
};
UOrderApp.pages.productDetailController.prototype.pageInit = function (page) {
    var self = this;
    //轮播图片
    var productDetailSwiper = new Swiper('.swiper-container.product-swiper', {
        preloadImages: false,
        lazyLoading: true,
        pagination: '.product-swiper .swiper-pagination'
    });
    //注册收藏功能
    $$('#upCollect').on('click', function (e) {
        var params = {
            ids: [$$(this).attr('data-id')]
        };
        cb.rest.postData('mc/ProductFavorites/addProductFavorite', params, function (data) {
            var result = JSON.parse(data);
            if (result.code != 200) {
                myApp.toast(result.message, 'error').show(true); //✕✕✓
                return;
            }
            myApp.toast('收藏商品成功', 'success').show(true); // success tips error
        });
    });

    //页面内容块点击
    $$('.productDetail-Clickli').find('li').on('click', function (e) {
        var _data = $$(this).dataset();

        switch (_data.property) {
            case "property":
                if (_data.contentlength == 0) {
                    var text = "暂无可选规格参数！";
                    myApp.toast(text, 'tips').show(true); //✕✕✓
                }
                else {
                    self.createParaFunc($$('.popup-prodSUK'),true);
                }
                break;
            case "attachment":
                if (_data.contentlength == 0) {
                    var text = "暂无相关附件信息";
                    myApp.toast(text, 'tips').show(true); //✕✕✓
                }
                else {

                }
                break;
        };
    });

    //获取阶梯价格
    var getDiscountPrice = function (obj) {
        if (self.productInfo.lsProductSkus && self.productInfo.lsProductSkus.length == 1) {
            cb.rest.getJSON('ma/Products/getDiscountPrice?skuId=' + self.productInfo.lsProductSkus[0].id + "&count=" + parseFloat(obj.val()), function (data) {
                if (data.code != 200) {
                    myApp.toast(data.message, 'error').show(true); //✕✕✓
                    return;
                }

                $$("div[data-page=productDetail] #spanPrice").text(data.data);
            });
        }
    };

    $$('li[data-property="number"]').find('i').on('click', function (e) {
        var input = $$(this).parent('.item-title').children('input');
        if ($$(this).hasClass('icon-add')) {
            if (input.val() == '' || parseInt(input.val()) <= 0)
                input.val(1);
            else
                input.val(parseInt(input.val()) + 1);
        }
        else {
            if (input.val() == '' || parseInt(input.val()) <= 1)
                return;
            input.val(parseInt(input.val()) - 1);
        }

        getDiscountPrice(input);
    });

    $$('li[data-property="number"]').find('input[type=number]').on('blur', function (e) {
        getDiscountPrice($$(this));
    });

    //获取购物车数据
    cb.rest.getJSON('ma/ShoppingCarts/getCartList', function (data) {
        if (data.code == 200 && data.data.length > 0) {
            $$('.productDetail-cart').children('i').html('<span class="badge bg-red">' + data.data.length + '</span>');
        }
    });

    //购物车图标点击事件
    $$('.productDetail-cart').on('click', function (e) {
        $$('#view-3').trigger('show');
        myApp.showToolbar('.toolbar.homeNavBar');
    });

    $$('.button.productDetail-addCart1').on('click', function (e) {
        if (self.productInfo.lsSpecs.length)
            self.createParaFunc($$('.popup-prodSUK'), false);
        else {
            var num = $$('.productDetail-Clickli li[data-property="number"]').find('input').val();
            if (!num) {
                myApp.toast('请输入订购数量', 'tips').show(true);
                return;
            }
            if (num < self.productInfo.iMinOrderQuantity) {
                myApp.toast('订购数量不能小于起订量', 'tips').show(true);
                return;
            }

            var pointIndex = num.indexOf('.');
            if (pointIndex > -1 && num.length - (pointIndex + 1) > 2) {
                myApp.toast("订购数量最大精确度为2", 'tips').show(true);
                return;
            }

            //加入购物车处理逻辑
            cb.rest.postData('mc/ShoppingCarts/add', { items: [{ iSKUId: self.productInfo.lsProductSkus[0].id, iQuantity: num }] }, function (data) {
                var dataObj = JSON.parse(data);
                if (dataObj.code == 200 && dataObj.data) {
                    myApp.toast('添加购物车成功', 'success').show(true); //✕✕✓
                    //获取购物车数据
                    cb.rest.getJSON('ma/ShoppingCarts/getCartList', function (data) {
                        if (data.code == 200 && data.data.length > 0) {
                            $$('.productDetail-cart').children('i').html('<span class="badge bg-red">' + data.data.length + '</span>');
                            $$('.homeNavBar #toolBarShoppingCartCount').html('<span class="badge bg-red">' + data.data.length + '</span>');
                        }
                    });
                    myApp.closeModal('.popup-prodSUK');
                }
                else {
                    myApp.toast(dataObj.message, 'error').show(true); //✕✓
                }
            });
        }
    });

    $$('.button.productDetail-addOrder').on('click', function (e) {
        if (self.productInfo.lsSpecs.length)
            self.createParaFunc($$('.popup-prodSUK'), true);
        else {
            var num = $$('.productDetail-Clickli li[data-property="number"]').find('input').val();
            if (!num) {
                myApp.toast('请输入正确的订购数量', 'tips').show(true);
                return;
            }
            self.productInfo.iMinOrderQuantity = self.productInfo.iMinOrderQuantity || 0;
            if (Number(num) < self.productInfo.iMinOrderQuantity) {
                myApp.toast("订购数量不能小于起订量", 'tips').show(true);
                return;
            }

            var pointIndex = num.indexOf('.');
            if (pointIndex > -1 && num.length - (pointIndex + 1) > 2) {
                myApp.toast("订购数量最大精确度为2", 'tips').show(true);
                return;
            }

            myApp.mainView.router.loadPage({
                url: "pages/confirmOrder.html",
                query: {
                    data_type: "productNoSKU",
                    data: self.productInfo,
                    orderNumber: num,
                    priceAount: num * parseFloat($$("div[data-page=productDetail] .prices .font-18").text())
                }
            });
        }
    });
};

UOrderApp.pages.productDetailController.prototype.createParaFunc = function (popcontainer, isCreateOrder) {
    var self = this;
    cb.loader.loadPageContent('./pages/product.html', function (data) {
        if (data) {
            var node = cb.loader.getNode(data);
            if (!node) return;
            var container = node.childNodes.length && node.childNodes[0];
            // Node.TEXT_NODE (3)
            if (container.nodeType === 3) return content;
            var controllerName = container && $$(container).dataset()['controller'];
            if (!controllerName) return content;
            cb.loader.processNode(node, function () {
                controller = new UOrderApp.pages[controllerName]();
                if (controller.preprocess)
                    controller.preprocess(data, self.productId, popcontainer, isCreateOrder);

                myApp.popup('.popup-prodSUK');
            });
        } else
            myApp.toast('暂无规格参数！', 'tips').show(true); //✕✕✓
    });
};