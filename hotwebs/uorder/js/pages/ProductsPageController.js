UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.ProductsPageController = function () {
    this.tplListFunc = Template7.compile($$('#tpl_list').html());
    this.tplBlockFunc = Template7.compile($$('#tpl_block').html());
};
UOrderApp.pages.ProductsPageController.prototype.preprocess = function (content, url, next) {
    var context = $$.parseUrlQuery(url) || {};
    if (!context.cid && !context.dataType) {
        myApp.toast('获取商品列表失败！', 'error').show(true);
        return;
    }
    var router = {
        getProducts: "ma/Products/getProducts",
        getNewestProducts: "ma/Products/getNewestProducts",
        getRecommendedProducts: 'ma/Products/getRecommendedProducts'
    };
    this.paramsContent = {
        serverUrl: '',
        params: {
            currentPage: 1,
            pageSize: 10
        }
    };
    if (context.cid) {
        this.paramsContent.params.classid = context.cid;
        this.paramsContent.serverUrl = router.getProducts;
    }
    else if (context.dataType == 'newProduct') {
        this.paramsContent.serverUrl = router.getNewestProducts;
    }
    else if (context.dataType == 'advProduct') {
        this.paramsContent.serverUrl = router.getRecommendedProducts;
    }
    var self = this;
    this.listType = 'list'; //设置默认显示方式
    this.classId = context.cid ? context.cid : null;
    this.dataType = context.dataType ? context.dataType : null;
    cb.rest.getJSON(this.paramsContent.serverUrl, this.paramsContent.params, function (data) {
        if (data.code != 200) {
            myApp.alert(data.message, '提示信息');
            return;
        }
        context.products = data.data.data;
        context.serverhost = cb.rest.appContext.serviceUrl;
        $$('#products_list').find('ul').html(self.tplListFunc(context));
        $$('#products_block').html(self.tplBlockFunc(context));
        myApp.initImagesLazyLoad(myApp.mainView.activePage.container);
        self.InitaddClick();  //注册事件
        //下拉加载
        var lastIndex = self.listType == 'list' ? $$('#products_list li').length : $$('#products_block .col-50.list').length;
        if (lastIndex >= 10) {
            $$('.product-container.infinite-scroll').on('infinite', function () {
                self.paramsContent.params.currentPage = lastIndex / 10 + 1;
                cb.rest.getJSON(self.paramsContent.serverUrl, self.paramsContent.params, function (data) {
                    if (data.code != 200) {
                        myApp.alert(data.message, '提示信息');
                        return;
                    }
                    context.products = data.data.data;
                    context.serverhost = cb.rest.appContext.serviceUrl;
                    $$('#products_list').find('ul').append(self.tplListFunc(context));
                    $$('#products_block').append(self.tplBlockFunc(context));
                    self.InitaddClick();  //注册事件
                    lastIndex = this.listType == 'list' ? $$('#products_list li').length : $$('#products_block .col-50.list').length;
                    if (data.data.data.length < 10)
                        $$('.infinite-scroll-preloader').remove();

                    myApp.initImagesLazyLoad(myApp.mainView.activePage.container);
                });
            });
        }
        else
            $$('.infinite-scroll-preloader').remove();
    });
    next(content);
};
UOrderApp.pages.ProductsPageController.prototype.pageInit = function (page) {
    var self = this;
    //点击切换显示方式
    $$('.link.show-list').on('click', function () {
        if (self.listType == 'list') {
            self.listType = 'block'
            $$(this).children('i').addClass('icon-showcard');
        } else {
            self.listType = 'list'
            $$(this).children('i').removeClass('icon-showcard');
        };

        $$('.product-container .list-continer').each(function () {
            if ($$(this).css('display') == 'none') {
                $$(this).show();
            }
            else {
                $$(this).hide();
            }
        });
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
    $$('#products_list a.button').on('click', function (e) {
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