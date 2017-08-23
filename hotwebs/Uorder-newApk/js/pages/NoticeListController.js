UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.NoticeListController = function () {
    this.noticeItemFunc = Template7.compile($$('#noticeItemTpl').html());
};
UOrderApp.pages.NoticeListController.prototype.preprocess = function (content, url, next) {
    this.paramsContent = {
        serverUrl: 'ma/notices/getNotices',
        params: {
            pageIndex: 1,
            pageSize: 10
        }
    };
    next(content);
};
UOrderApp.pages.NoticeListController.prototype.pageInit = function (page) {
    var self = this;
    var getNoticeList = function (callBack) {
        cb.rest.getJSON(self.paramsContent.serverUrl, self.paramsContent.params, function (data) {
            if (data.code != 200) {
                myApp.toast(data.message, 'error').show(true);
                return;
            }
            var resultHtml = self.noticeItemFunc({ noticeList: data.data.notices });
            $$('.page[data-page="noticeListPage"] .noticeListPage-container').html(resultHtml);
            if (callBack) {
                callBack.call(this);
            }
        });
    };

    getNoticeList(function () {
        var lastIndex = $$('.noticeListPage-container li').length;
        if (lastIndex >= 10) {
            $$('.page-content.infinite-scroll').on('infinite', function () {
                lastIndex = parseInt($$('.noticeListPage-container li').length / 10) + 1;
                if (self.paramsContent.params.pageIndex < lastIndex) {
                    self.paramsContent.params.pageIndex = lastIndex;
                    cb.rest.getJSON(self.paramsContent.serverUrl, self.paramsContent.params, function (data) {
                        if (data.code != 200) {
                            myApp.toast(data.message, 'error').show(true);
                            return;
                        }
                        var resultHtml = self.noticeItemFunc({ noticeList: data.data.notices });
                        $$('.page[data-page="noticeListPage"] .noticeListPage-container').append(resultHtml);
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

        $$("div[data-page=noticeListPage] .list-bankInfor").on("click", function () {
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
    });

    //下拉刷新
    $$('.page-content.pull-to-refresh-content').on('refresh', function (e) {
        self.paramsContent.params.pageIndex = 1;
        getNoticeList(function () {
            myApp.pullToRefreshDone();
        });
    });
};