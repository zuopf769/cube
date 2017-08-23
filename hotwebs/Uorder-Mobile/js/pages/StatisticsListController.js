UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.StatisticsListController = function () {
    this.noticeItemFunc = Template7.compile($$('#noticeItemTpl').html());
};
UOrderApp.pages.StatisticsListController.prototype.preprocess = function (content, url, next) {
    this.paramsContent = {
        serverUrl: 'ma/OrderStatistics/getOrderStatisticsList',
        params: {
            pageIndex: 1,
            pageSize: 10
        }
    };
    next(content);
};
UOrderApp.pages.StatisticsListController.prototype.pageInit = function (page) {
    var self = this;

    //点击切换单据类型
    //$$('.link.popover-orders-links').on('click', function (e) {
    //    var clickedLink = this;
    //    var popoverHTML = '<div class="popover dy-popover-orders-links">' +
    //                        '<div class="popover-inner">' +
    //                          '<div class="list-block">' +
    //                            '<ul>' +
    //                            '<li><a href="pages/statistics.html" class="item-link list-button" data-orderType="price">订货统计</li>' +
    //                            '</ul>' +
    //                          '</div>' +
    //                        '</div>' +
    //                      '</div>';
    //    myApp.popover(popoverHTML, clickedLink);

    //    //动态关闭popover
    //    $$('.popover.dy-popover-orders-links a').on('click', function (e) {
    //        myApp.closeModal('.dy-popover-orders-links');
    //        //$$(clickedLink).html($$(this).html());
    //        myApp.mainView.router.loadPage({ url: $$(this).attr("href") })
    //    });
    //});

    var getNoticeList = function (callBack) {
        cb.rest.getJSON(self.paramsContent.serverUrl, self.paramsContent.params, function (data) {
            if (typeof data == 'string')
                data = JSON.parse(data);
            if (data.code != 200) {
                myApp.toast(data.message, 'error').show(true);
                return;
            }
            var resultHtml = self.noticeItemFunc({ list: data.data.list });
            $$('.page[data-page="statisticsListPage"] .noticeListPage-container').html(resultHtml);
            if (callBack) {
                callBack.call(this);
            }
        });
    };

    getNoticeList(function () {
        var lastIndex = $$('.noticeListPage-container .list-wrap').length;
        if (lastIndex >= 10) {
            $$('.page-content.infinite-scroll').on('infinite', function () {
                lastIndex = parseInt($$('.noticeListPage-container .list-wrap').length / 10) + 1;
                if (self.paramsContent.params.pageIndex < lastIndex) {
                    self.paramsContent.params.pageIndex = lastIndex;
                    cb.rest.getJSON(self.paramsContent.serverUrl, self.paramsContent.params, function (data) {
                        if (typeof data == 'string')
                            data = JSON.parse(data);
                        if (data.code != 200) {
                            myApp.toast(data.message, 'error').show(true);
                            return;
                        }
                        var resultHtml = self.noticeItemFunc({ list: data.data.list });
                        $$('.page[data-page="statisticsListPage"] .noticeListPage-container').append(resultHtml);
                    });
                }
                else {
                    $$('.infinite-scroll-preloader').remove();
                }
            });
        }
        else {
            $$('.infinite-scroll-preloader').remove();
        }
    });

    //下拉刷新
    $$('.page-content.pull-to-refresh-content').on('refresh', function (e) {
        self.paramsContent.params.pageIndex = 1;
        getNoticeList(function () {
            myApp.pullToRefreshDone();
        });
    });
};