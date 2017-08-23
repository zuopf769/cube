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
        context.productInfo = data.data.product;
        context.lsPricePrePromotions = data.data.lsPricePrePromotions?data.data.lsPricePrePromotions:[];
        self.productInfo = context.productInfo;
        self.productInfo.hasParam = !(context.productInfo.lsProductParameters && context.productInfo.lsProductParameters.length > 0);
        for (var i = 0; i < context.lsPricePrePromotions.length; i++) {
            var curr = context.lsPricePrePromotions[i];
            curr.pStartDate = (new Date(curr.pStartDate)).format("yyyy年MM月dd日 hh:mm:ss");
            curr.pEndDate = (new Date(curr.pEndDate)).format("yyyy年MM月dd日 hh:mm:ss");
            for (var j = 0; j < curr.pricePreferentialItem.length; j++) {
                curr.pricePreferentialItem[j].pType = curr.pType;
                curr.pricePreferentialItem[j].iGiveawayRule = curr.iGiveawayRule;
            }
        }
        if (data.data.minPrice == data.data.maxPrice)
            context.productInfo._Price = true
        context.serverhost = cb.rest.appContext.serviceUrl;
        var template = Template7.compile(content);
        var resultContent = template(context);

        next(resultContent);
        myApp.initImagesLazyLoad(myApp.mainView.activePage.container);
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
        var $$this = $$(this);
        var params = {
            ids: [$$this.attr('data-id')]
        };
        if (self.productInfo.bFavorited) {
            cb.rest.postData('mc/ProductFavorites/delFavorite', { id: $$this.attr('data-id') }, function (data) {
                var result = data;
                if (result.code != 200) {
                    myApp.toast(result.message, 'error').show(true); //✕✕✓
                    return;
                }
                $$this.html('<i class="icon icon-coll"></i>收藏');
                self.productInfo.bFavorited = false;
            });
        }
        else {
            cb.rest.postData('mc/ProductFavorites/addProductFavorite', {
                ids: [$$this.attr('data-id')]
            }, function (data) {
                var result = data;
                if (result.code != 200) {
                    myApp.toast(result.message, 'error').show(true); //✕✕✓
                    return;
                }
                $$this.html('<i class="icon icon-coll active"></i>已收藏');
                self.productInfo.bFavorited = true;
            });
        }
    });

    //页面内容块点击
    $$('.productDetail-Clickli').find('li').on('click', function (e) {
        var _data = $$(this).dataset();

        switch (_data.property) {
            case "property":
                self.createParaFunc($$('.popup-prodSUK'));
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

    //回到首页
    $$(".icon-home").on("click", function () {
        $$('#view-1').trigger('show');
        myApp.showToolbar('.toolbar.homeNavBar');
    });

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

    cb.reloadShoppingCartCount();

    //购物车图标点击事件
    $$('.productDetail-cart').on('click', function (e) {
        $$('#view-3').trigger('show');
        myApp.showToolbar('.toolbar.homeNavBar');
    });

    var animateTimeMark = null;
    $$('.button.productDetail-addCart1').on('click', function (e) {
        self.createParaFunc($$('.popup-prodSUK'));
    });
    myApp.refreshScroller();

    var toTopBtn = $$('div[data-page="productDetail"] #proDtop');

    myApp.getScroller().on("scroll", function (e) {
        var totalHeight = $$(this).find('.swiper-container.product-swiper').height() - $$('div[data-page="productDetail').children('.navbar.lucencyBar').height();
        var scrollHeight = $$(this).scrollTop();
        if (scrollHeight > 150) {
            toTopBtn.show();
        }
        else {
            toTopBtn.hide();
        }
        $$('div[data-page="productDetail').children('.navbar.lucencyBar').children('.navbar-inner').attr('style', 'background:rgba(251,251,251,' + (scrollHeight / totalHeight) + ')');
    })

    //回到顶部
    toTopBtn.on("click", function () {
        $$('div[data-page="productDetail"] .page-content.detail-page').scrollTop(0, 800);
    });
};

UOrderApp.pages.productDetailController.prototype.createParaFunc = function (popcontainer) {
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
                    controller.preprocess(data, self.productId, popcontainer);
            });
        } else
            myApp.toast('暂无规格参数！', 'tips').show(true); //✕✕✓
    });
};