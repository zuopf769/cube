UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.HomePageController = function () {
    this.tplProductFunc = Template7.compile($$('#homeProductList').html());
};
UOrderApp.pages.HomePageController.prototype.preprocess = function (content, url, next) {
    var context = {};
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

        cb.rest.getJSON('ma/Products/getNewestProducts', { pageIndex: 1, pageSize: 8 }, function (data) {
            if (data.code != 200) {
                myApp.toast(data.message, 'error').show(true);
                return;
            }

            context.products = data.data.data;

            if (context.products) {
                if (context.products.length < 8) {
                    var evenIndex = context.products.length + (context.products.length % 2 == 0 ? 0 : -1);
                    if (evenIndex > 0) {
                        context.products = context.products.splice(0, evenIndex);
                    }
                }
                if ($$('div[data-page="home"].page').length == 2)
                    $$('.page.page-on-center #newProducts').html(self.tplProductFunc(context));
                else
                    $$('#newProducts').html(self.tplProductFunc(context));
                myApp.initImagesLazyLoad(myApp.mainView.activePage.container);
                $$.each($$("#newProducts .upimgdiv"), function (index, item) {
                    var parentWidth = $$(item).parent().width();
                    $$(item).css({ width: parentWidth + "px", height: parentWidth + "px" });
                });
            }
        });

        cb.rest.getJSON('ma/Products/getRecommendedProducts', { pageIndex: 1, pageSize: 8 }, function (data) {
            if (data.code != 200) {
                myApp.toast(data.message, 'error').show(true);
                return;
            }
            context.products = data.data.data;
            if (context.products) {
                if (context.products.length < 8) {
                    var evenIndex = context.products.length + (context.products.length % 2 == 0 ? 0 : -1);
                    if (evenIndex > 0) {
                        context.products = context.products.splice(0, evenIndex);
                    }
                }

                if ($$('div[data-page="home"].page').length == 2)
                    $$('.page.page-on-center #adviceProducts').html(self.tplProductFunc(context));
                else
                    $$('#adviceProducts').html(self.tplProductFunc(context));
                myApp.initImagesLazyLoad(myApp.mainView.activePage.container);
                $$.each($$("#adviceProducts .upimgdiv"), function (index, item) {
                    var parentWidth = $$(item).parent().width();
                    $$(item).css({ width: parentWidth + "px", height: parentWidth + "px" });
                });
            }
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
            //myApp.mainView.router.loadPage(link);
            if (link) {
                if (window.plus) {
                    clicked(link, true);
                }
                else {
                    window.location.href = link;
                }
            }
        });

    //获取购物车数据
    var getShoppingCartCount = function () {
        cb.rest.getJSON('ma/ShoppingCarts/getCartList', function (data) {
            if (data.code == 200 && data.data.length > 0) {
                if ($$('div[data-page="home"].page').length == 2)
                    $$('.page.page-on-center .homeNavBar #toolBarShoppingCartCount').html('<span class="badge bg-red">' + data.data.length + '</span>');
                else
                    $$('.homeNavBar #toolBarShoppingCartCount').html('<span class="badge bg-red">' + data.data.length + '</span>');
            }
        });
    };
    getShoppingCartCount();
    // fix swiper bug
    $$('#view-1').on('show', function (e) {
        var swiper = $$('.swiper-container.home-swiper')[0].swiper;
        swiper.onTransitionEnd();
        swiper.stopAutoplay();
        swiper.startAutoplay();
        getShoppingCartCount();
    });

    $$('div[data-page="home"] #btnScan').on('click', function () {
        var scanWin = clicked("pages/barCode.html");
    });

    cb.rest.getJSON('ma/notices/getNotices', { pageIndex: 1, pageSize: 5 }, function (data) {
        if (typeof data == 'string')
            data = JSON.parse(data);
        if (data.code != 200) {
            myApp.toast(data.message, 'error').show(true);
            return;
        }
        if (!(data.data.notices && data.data.notices.length > 0)) {
            data.data.notices = [{ cTitle: "暂无公告" }, { cTitle: "暂无公告" }, { cTitle: "暂无公告" }];
        }
        else if (data.data.notices.length == 1) {
            data.data.notices.push(data.data.notices[0]);
        }
        for (var i = 0; i < data.data.notices.length; i++) {
            var curr = data.data.notices[i];
            $$("#noticeDiv").append($$('<a href="#"  data-id="' + curr.id + (curr.cUrl ? 'data-url="' + curr.cUrl + '"' : '') + '" data-notictype="' + curr.cNoticeType + '">' + curr.cTitle + '</a>'));
        }
        $$("#noticeDiv a").on("click", function () {
            var $$this = $$(this);
            if ($$this.data("notictype") == "URL") {
                var link = $$this.data("url");
                if (link) {
                    if (window.plus) {
                        clicked(link, true);
                    }
                    else {
                        window.location.href = link;
                    }
                }
            }
            else {
                myApp.mainView.router.loadPage({
                    url: 'pages/noticeDetail.html?id=' + $$this.data("id")
                });
            }
        });

        var go = function () {
            if (animatemark) {
                window.clearInterval(animatemark);
            }
            if (startmark) {
                window.clearTimeout(startmark);
            }
            animatemark = setInterval(function () {
                var noticeDiv = document.querySelector("#noticeDiv");
                if (noticeDiv) {
                    noticeDiv.style.marginTop = start-- + "px";
                    if (start < -40) {
                        window.clearInterval(animatemark);
                        $$("#noticeDiv").append($$("#noticeDiv a").eq(0));
                        start = 0;
                        noticeDiv.style.marginTop = start;
                        startmark = window.setTimeout(go, 2000);
                    }
                }
            }, 20);
        };
        startmark = window.setTimeout(go, 3000);
    });
};
//头条轮播
var start = 0;
var animatemark = null;
var startmark = null;