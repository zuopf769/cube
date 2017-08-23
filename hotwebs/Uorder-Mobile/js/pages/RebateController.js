UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.RebateController = function () {
    this.rebateItemFunc = Template7.compile($$('#rebateItemTpl').html());
    this.rebateItemTplSelect = Template7.compile($$('#rebateItemTplSelect').html());
};
UOrderApp.pages.RebateController.prototype.preprocess = function (content, url, next) {
    next(content);
};
UOrderApp.pages.RebateController.prototype.pageInit = function (page) {
    //var context = $$.parseUrlQuery(url) || {};
    var selectModel = page.query.type == "select";
    this.paramsContent = {
        serverUrl: 'ma/Rebates/getRebateList',
        params: {
            pageIndex: 1,
            pageSize: 10
        }
    };

    //格式化数据源
    var formatData = function (list) {
        if (list && list.length > 0) {
            for (var i = 0; i < list.length; i++) {
                var curr = list[i];
                var dValidStartDate = new Date(curr.dValidStartDate);
                var dValidEndDate = new Date(curr.dValidEndDate);
                curr.dValidStartDate = dValidStartDate.format("yyyy/MM/dd");
                curr.dValidEndDate = dValidEndDate.format("yyyy/MM/dd");
            }
        }
        return list;
    };

    //选择模式时,绑定事件
    var bindEvent = function () {
        $$('.page[data-page="rebateListPage"] .rebateListPage-container dd').on("click", function () {
            var $$this = $$(this);
            var parent = $$this.parents(".available").eq(0);
            if (parent.is(".active")) {
                parent.removeClass("active");
            }
            else {
                parent.addClass("active");
            }
        });
    };

    var self = this;
    var getRebateList = function (callBack) {
        cb.rest.getJSON(self.paramsContent.serverUrl, self.paramsContent.params, function (data) {
            if (typeof data == 'string')
                data = JSON.parse(data);
            if (data.code != 200) {
                myApp.toast(data.message, 'error').show(true);
                return;
            }

            var resultHtml = "";
            if (selectModel) {
                resultHtml = self.rebateItemTplSelect({ rebateList: formatData(data.data.list) });
                $$('.page[data-page="rebateListPage"] .rebateListPage-container').html(resultHtml);
                bindEvent();
            }
            else {
                resultHtml = self.rebateItemFunc({ rebateList: formatData(data.data.list) });
                $$('.page[data-page="rebateListPage"] .rebateListPage-container').html(resultHtml);
            }
            if (callBack) {
                callBack.call(this);
            }
        });
    };

    getRebateList(function () {
        var lastIndex = $$('.rebateListPage-container dl').length;
        if (lastIndex >= 10) {
            $$('.page-content.infinite-scroll').on('infinite', function () {
                lastIndex = parseInt($$('.rebateListPage-container dl').length / 10) + 1;
                if (self.paramsContent.params.pageIndex < lastIndex) {
                    self.paramsContent.params.pageIndex = lastIndex;
                    cb.rest.getJSON(self.paramsContent.serverUrl, self.paramsContent.params, function (data) {
                        if (typeof data == 'string')
                            data = JSON.parse(data);
                        if (data.code != 200) {
                            myApp.toast(data.message, 'error').show(true);
                            return;
                        }
                        var resultHtml = "";
                        if (selectModel) {
                            resultHtml = self.rebateItemTplSelect({ rebateList: formatData(data.data.list) });
                            //resultHtml.find("dd").on("click", function () {
                            //    var $$this = $$(this);
                            //    var parent = $$this.parents(".available").eq(0);
                            //    if (parent.is(".active")) {
                            //        parent.removeClass("active");
                            //    }
                            //    else {
                            //        parent.addClass("active");
                            //    }
                            //});
                            $$('.page[data-page="rebateListPage"] .rebateListPage-container').append(resultHtml);
                            bindEvent();
                        }
                        else {
                            resultHtml = self.rebateItemFunc({ rebateList: formatData(data.data.list) });
                            $$('.page[data-page="rebateListPage"] .rebateListPage-container').append(resultHtml);
                        }
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

        $$("div[data-page=rebateListPage] .list-bankInfor").on("click", function () {
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
        getRebateList(function () {
            myApp.pullToRefreshDone();
        });
    });
}