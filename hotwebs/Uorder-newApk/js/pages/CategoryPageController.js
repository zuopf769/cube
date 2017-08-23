UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.CategoryPageController = function () {
    this.contentTpl = Template7.compile($$('#categoryTemplate').html());
    this.hotContentTpl = Template7.compile($$('#hotCategoryTemplate').html());
};
UOrderApp.pages.CategoryPageController.prototype.preprocess = function (content, url, next) {
    var self = this;
    cb.rest.getJSON('ma/ProductClasses/getClasses', function (data) {
        if (data.code == 200) {
            self.CategoryData = data;
            var template = Template7.compile(content);
            var resultContent = template(data);
            next(resultContent);
        }
        else {
            myApp.toast(data.mesage, 'error').show(true);
        }
    });
};
UOrderApp.pages.CategoryPageController.prototype.pageInit = function (page) {
    var contentTpl = this.contentTpl;
    var hotContentTpl = this.hotContentTpl;

    var pageContainer = $$(page.container);
    var self = this;
    $$("#hotCategory").nextAll("li").on('click', function (e) {
        var $$this = $$(this);
        myApp.getScroller().scrollTop(myApp.getScroller().scrollTop() + $$this.offset().top - 44, 600);
        $$this.parent().children("li.cur").removeClass("cur");
        $$this.addClass("cur");
        var id = $$this.data("id");
        if (self.CategoryData) {
            for (var i = 0; i < self.CategoryData.data.length; i++) {
                var currCate = self.CategoryData.data[i];
                if (currCate.id == id) {
                    currCate.serviceUrl = cb.rest.appContext.serviceUrl;
                    if (!currCate.lsChildClass || currCate.lsChildClass.length == 0) {
                        currCate.lsChildClass.push(currCate);
                    }
                    else {
                        currCate.lsChildClass.forEach(function (item, index) {
                            if (!item.lsChildClass || item.lsChildClass.length == 0) {
                                item.lsChildClass.push(item);
                            }
                        });
                    }
                    $$('.category-content').html(contentTpl(currCate));
                    myApp.initImagesLazyLoad(myApp.mainView.activePage.container);
                    myApp.refreshScroller();
                    break;
                }
            }
        }
    });

    //打开热门分类
    var activHotCategory = function () {
        var $$this = $$("#hotCategory");
        $$this.parent().children("li.cur").removeClass("cur");
        $$this.addClass("cur");
        cb.rest.getJSON('ma/ProductClasses/getHotProductClass', function (hdata) {
            if (hdata.code == 200) {
                hdata.data.serverhost = cb.rest.appContext.serviceUrl;//cb.rest.appContext.serviceUrl;
                $$('.category-content').html(hotContentTpl(hdata.data));
                myApp.refreshScroller($$("div[data-page='category'] .page-content")[0]);
            }
            else
                myApp.toast(data.mesage, 'error').show(true);
        });
    };
    activHotCategory();
    //热门分类
    $$("#hotCategory").on("click", activHotCategory);

    $$(".category-content").css({ "width": ($$(".category-content").parent().width() - 90) + "px" });//低版本安卓,不支持css3计算

    $$('div[data-page="category"] #btnScan').on('click', function () {
        var scanWin = clicked("pages/barCode.html");
    });

    myApp.getScroller().on("scroll", function (e) {
        myApp.refreshScroller();
    });
};