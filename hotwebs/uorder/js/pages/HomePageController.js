UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.HomePageController = function () {
    this.tplProductFunc = Template7.compile($$('#homeProductList').html());
};
UOrderApp.pages.HomePageController.prototype.preprocess = function (content, url, next) {
    var context = {
        photos: [
            { cAdImageUrl: '<img src="img/banner-1.png">', id: 'about.html' }
        ],
        links: [
            { img: '<img src="img/icon/order-form.png">', caption: '订单', link: 'pages/orderList.html' },
            { img: '<img src="img/icon/account.png">', caption: '资金账户', link: 'about.html' },
            { img: '<img src="img/icon/statistics.png">', caption: '订货统计', link: 'about.html' },
            { img: '<img src="img/icon/notice.png">', caption: '公告', link: 'pages/baseInfo.html' }
        ]
    };
    var self = this;
    //加载轮播图片
    cb.rest.getJSON('ma/Corprations/getCorpAdImages', function (data) {
        if (data.code != 200) {
            myApp.toast('获取轮播图片信息失败', 'error').show(true);
            return;
        }
        context.photos = data.data;
        context.serverhost = cb.rest.appContext.serviceUrl;//cb.rest.appContext.serviceUrl;
        var template = Template7.compile(content);
        var resultContent = template(context);
        next(resultContent);

        cb.rest.getJSON('ma/Products/getNewestProducts', { pageIndex: 1, pageSize: 6 }, function (data) {
            if (data.code != 200) {
                myApp.toast('加载最新商品信息失败', 'error').show(true);
                return;
            }
            context.products = data.data.data;
            if ($$('div[data-page="home"].page').length == 2)
                $$('.page.page-on-center #newProducts').html(self.tplProductFunc(context));
            else
                $$('#newProducts').html(self.tplProductFunc(context));
            myApp.initImagesLazyLoad(myApp.mainView.activePage.container);
        });
        cb.rest.getJSON('ma/Products/getRecommendedProducts', { pageIndex: 1, pageSize: 6 }, function (data) {
            if (data.code != 200) {
                myApp.toast('加载推荐商品信息失败', 'error').show(true);
                return;
            }
            context.products = data.data.data;
            if ($$('div[data-page="home"].page').length == 2)
                $$('.page.page-on-center #adviceProducts').html(self.tplProductFunc(context));
            else
                $$('#adviceProducts').html(self.tplProductFunc(context));
            myApp.initImagesLazyLoad(myApp.mainView.activePage.container);
        });
    });
};
UOrderApp.pages.HomePageController.prototype.pageInit = function (page) {
    var homeSwiper;
    if ($$('div[data-page="home"]').length == 2)
        homeSwiper = new Swiper('.page-on-center .swiper-container.home-swiper', {
            pagination: '.page-on-center .home-swiper .swiper-pagination',
            speed: 600,
            autoplay: 2000,
            autoplayDisableOnInteraction: false,
            loop: true,
            grabCursor: true,
            paginationClickable: true
        });
    else
        homeSwiper = new Swiper('.swiper-container.home-swiper', {
            pagination: '.home-swiper .swiper-pagination',
            speed: 600,
            autoplay: 2000,
            autoplayDisableOnInteraction: false,
            loop: true,
            grabCursor: true,
            paginationClickable: true
        });
    if (homeSwiper.on)
        homeSwiper.on("tap", function (swiper, event) {
            if (!swiper.clickedSlide) return;
            var link = $$.dataset(swiper.clickedSlide)["link"];
            myApp.mainView.router.loadPage(link);
        });

    //获取购物车数据
    cb.rest.getJSON('ma/ShoppingCarts/getCartList', function (data) {
        if (data.code == 200 && data.data.length > 0) {
            if ($$('div[data-page="home"].page').length == 2)
                $$('.page.page-on-center .homeNavBar a').eq(2).children('i').html('<span class="badge bg-red">' + data.data.length + '</span>');
            else
                $$('.homeNavBar a').eq(2).children('i').html('<span class="badge bg-red">' + data.data.length + '</span>');
        }
    });

    // fix swiper bug
    $$('#view-1').on('show', function (e) {
        var swiper = $$('.swiper-container.home-swiper')[0].swiper;
        swiper.onTransitionEnd();
        swiper.stopAutoplay();
        swiper.startAutoplay();
    });

    $$('div[data-page="home"].page .icon.icon-scan').on('click', function () {
        myApp.mainView.router.loadPage('pages/barCode.html');
    });
};

