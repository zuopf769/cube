﻿UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.ProductsPageController = function () {
    this.tplListFunc = Template7.compile($$('#tpl_list').html());
    this.tplBlockFunc = Template7.compile($$('#tpl_block').html());
};
UOrderApp.pages.ProductsPageController.prototype.preprocess = function (content, url, next) {
    var context = $$.parseUrlQuery(url) || {};
    var router = {
        getProducts: "ma/Products/getProducts",
        getNewestProducts: "ma/Products/getNewestProducts",  //最新商品
        getRecommendedProducts: 'ma/Products/getRecommendedProducts',
        getHistoryProducts: "ma/products/getHistories",  //历史商品
        getFavoriteProducts: "ma/ProductFavorites/getProductFavorites",  //收藏的商品
        getRecentBuyProduct: "ma/Products/getRecentBuyProduct" //最近购买的商品
    };

    if (!context.keyword) {
        context.keyword = "";
    }
    this.paramsContent = {
        serverUrl: '',
        params: {
            currentPage: 1,
            pageSize: 10,
            keyword: context.keyword
        }
    };
    this.titleText = "";
    if (context.cid) {
        this.paramsContent.params.classid = context.cid;
        this.paramsContent.serverUrl = router.getProducts;
    }
    else {
        switch (context.dataType) {
            case "newProduct":
                this.paramsContent.serverUrl = router.getNewestProducts;
                break;
            case "advProduct":
                this.paramsContent.serverUrl = router.getRecommendedProducts;
                break;
            case "favoriteProduct":
                this.paramsContent.serverUrl = router.getFavoriteProducts;
                this.titleText = "收藏商品";
                break;
            case "historyProduct":
                this.paramsContent.serverUrl = router.getHistoryProducts;
                this.titleText = "浏览记录";
                break;
            case "searchProduct":
                this.paramsContent.serverUrl = router.getProducts;
                this.titleText = "查找结果";
                break;
            case "recentBuyProduct":
                this.paramsContent.serverUrl = router.getRecentBuyProduct;
                this.titleText = "最近订购";
                var t = new Date();
                this.paramsContent.params.startDate =(new Date(t.getFullYear(),t.getMonth(),(t.getDate()-30))).format("yyyy-MM-dd"); 
                this.paramsContent.params.endDate = t.format('yyyy-MM-dd');
                break;
        }
    }
    //if (context.cid) {
    //    this.paramsContent.params.classid = context.cid;
    //    this.paramsContent.serverUrl = router.getProducts;
    //}
    //else if (context.dataType == 'newProduct') {
    //    this.paramsContent.serverUrl = router.getNewestProducts;
    //}
    //else if (context.dataType == 'advProduct') {
    //    this.paramsContent.serverUrl = router.getRecommendedProducts;
    //}
    //else if (context.dataType == 'favoriteProduct') {
    //    this.paramsContent.serverUrl = router.getFavoriteProducts;
    //    this.titleText = "收藏商品";
    //}
    //else if (context.dataType == 'historyProduct') {
    //    this.paramsContent.serverUrl = router.getHistoryProducts;
    //    this.titleText = "浏览记录";
    //}
    //else if (context.dataType == "searchProduct") {
    //    this.paramsContent.serverUrl = router.getProducts;
    //    this.titleText = "查找结果";
    //}
    var self = this;
    this.listType = 'list'; //设置默认显示方式
    this.classId = context.cid ? context.cid : null;
    this.dataType = context.dataType ? context.dataType : null;
    self.timeMark = null;
    cb.rest.getJSON(this.paramsContent.serverUrl, this.paramsContent.params, function (data) {
        if (data.code != 200) {
            myApp.alert(data.message, '提示信息');
            return;
        }
        context.products = data.data.data;
        if (!context.products || context.products.length == 0) {
            //取消下拉事件监听
            myApp.detachInfiniteScroll(".product-container.infinite-scroll");
            $$('.infinite-scroll-preloader').remove();
        }
        context.serverhost = cb.rest.appContext.serviceUrl;
        $$('#products_list').find('ul').html(self.tplListFunc(context));
        $$('#products_block').html(self.tplBlockFunc(context));
        myApp.initImagesLazyLoad(myApp.mainView.activePage.container);
        self.InitaddClick();  //注册事件
        //下拉加载
        var lastIndex = self.listType == 'list' ? $$('#products_list li').length : $$('#products_block .col-50.list').length;
        if (lastIndex >= 10) {
            $$('.product-container.infinite-scroll').on('infinite', function () {
                if (self.timeMark) {
                    return false;
                }
                else {
                    self.timeMark = setTimeout(function () {
                        lastIndex = parseInt((self.listType == 'list' ? $$('#products_list li').length : $$('#products_block .col-50.list').length) / 10 + 1);
                        if (self.paramsContent.params.currentPage < lastIndex) {
                            self.paramsContent.params.currentPage = lastIndex;
                            cb.rest.getJSON(self.paramsContent.serverUrl, self.paramsContent.params, function (data) {
                                if (data.code != 200) {
                                    myApp.alert(data.message, '提示信息');
                                    return;
                                }
                                context.products = data.data.data;
                                if (!context.products || context.products.length == 0) {
                                    //取消下拉事件监听
                                    myApp.detachInfiniteScroll(".product-container.infinite-scroll");
                                    $$('.infinite-scroll-preloader').remove();
                                    myApp.toast('拉到底了', 'tips').show(true);
                                    return;
                                }
                                context.serverhost = cb.rest.appContext.serviceUrl;
                                $$('#products_list').find('ul').append(self.tplListFunc(context));
                                $$('#products_block').append(self.tplBlockFunc(context));
                                self.InitaddClick();  //注册事件
                                lastIndex = this.listType == 'list' ? $$('#products_list li').length : $$('#products_block .col-50.list').length;
                                if (data.data.data.length < 10)
                                    $$('.infinite-scroll-preloader').remove();

                                myApp.initImagesLazyLoad(myApp.mainView.activePage.container);
                                self.timeMark = null;
                            });
                        }
                        else {
                            $$('.infinite-scroll-preloader').remove();
                        }
                    }, 300);
                }
            });
        }
        else
            $$('.infinite-scroll-preloader').remove();
    });
    next(content);
};
UOrderApp.pages.ProductsPageController.prototype.pageInit = function (page) {
    var self = this;
    if (page && page.query && page.query.nosort == 'yes') {
        $$(".subnavbar,#proSearchBar").hide();
        $$("#spanProTitle").text(self.titleText);
        $$("#spanProTitle").show();
        $$("#products_list>.media-list").addClass("m-t-0");
    }
    else {
        $$(".subnavbar,#proSearchBar").css({ "display": "inherit" });
        $$("#spanProTitle").hide();
        $$("#products_list>.media-list").removeClass("m-t-0");
    }
    //点击切换显示方式
    $$('.icon.icon-product-list').on('click', function () {
        self.listType = self.listType == 'list' ? 'block' : 'list';

        $$('.product-container .list-continer').each(function () {
            if ($$(this).css('display') == 'none') {
                $$(this).show();
            }
            else {
                $$(this).hide();
            }
        });

        $$.each($$(".product-container .list-continer .upimgdiv"), function (index, item) {
            var parentWidth = $$(item).parent().width();
            $$(item).css({ width: parentWidth + "px", height: parentWidth + "px" });
        });
    });
    $$("#products_txtSearch").on("click", function () {
        if (page.query && page.query.keyword) {
            myApp.mainView.router.back();
        }
        else {
            myApp.mainView.router.loadPage('pages/search.html');
        }
    });

    $$('.product-container.pull-to-refresh-content').on('refresh', function (e) {
        self.paramsContent.params.currentPage = 1;
        cb.rest.getJSON(self.paramsContent.serverUrl, self.paramsContent.params, function (data) {
            if (data.code != 200) {
                myApp.alert(data.message, '提示信息');
                return;
            }
            var context = new Object();
            context.serverhost = cb.rest.appContext.serviceUrl;
            context.products = data.data.data;
            $$('#products_list').find('ul').html(self.tplListFunc(context));
            $$('#products_block').html(self.tplBlockFunc(context));
            myApp.initImagesLazyLoad(myApp.mainView.activePage.container);
            self.InitaddClick();  //注册事件
            myApp.pullToRefreshDone();
        });
    });

    var sortMark = new Object();
    $$('#sortRow a').on('click', function (e) {
        $$(this).parent().find('a').removeClass('active');
        $$(this).addClass('active');

        var fieldName = $$(this).attr('data-name');
        self.paramsContent.params.order = fieldName;
        if (!sortMark[fieldName]) {
            sortMark[fieldName] = 'desc';
            self.paramsContent.params.orderDirection = 'desc';
        }
        else {
            sortMark[fieldName] == 'desc' ? sortMark[fieldName] = 'asc' : sortMark[fieldName] = 'desc';
            self.paramsContent.params.orderDirection = sortMark[fieldName];
        }
        var searchUrl = "ma/Products/getProducts";
        if (!fieldName) {
            searchUrl = self.paramsContent.serverUrl;
        }

        cb.rest.getJSON(searchUrl, self.paramsContent.params, function (data) {
            if (data.code != 200) {
                myApp.alert(data.message, '提示信息');
                return;
            }
            var context = new Object();
            context.products = data.data.data;
            context.serverhost = cb.rest.appContext.serviceUrl;
            $$('#products_list').find('ul').html(self.tplListFunc(context));
            $$('#products_block').html(self.tplBlockFunc(context));
            myApp.initImagesLazyLoad(myApp.mainView.activePage.container);
            self.InitaddClick();  //注册事件
        });
    });
};
UOrderApp.pages.ProductsPageController.prototype.InitaddClick = function (callback) {
    var self = this;
    $$('.add-cart-btn').on('click', function (e) {
        if (callback) {
            callback.call(this);
            return;
        }
        self.createParaFunc($$(this).attr('data-id'), $$('.productParam-popup'));
    });
};

UOrderApp.pages.ProductsPageController.prototype.createParaFunc = function (productId, popcontainer) {
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
                    controller.preprocess(data, productId, popcontainer);

                myApp.popup('.productParam-popup');
            });
        } else
            myApp.toast('暂无规格参数！', 'error').show(true);
    });
};