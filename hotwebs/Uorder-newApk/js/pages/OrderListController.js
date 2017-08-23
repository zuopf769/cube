UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.OrderListController = function () {
    this.orderItemFunc = Template7.compile($$('#orderItemTpl').html());
};
UOrderApp.pages.OrderListController.prototype.preprocess = function (content, url, next) {
    next(content);
};

UOrderApp.pages.OrderListController.prototype.pageInit = function (page) {

    var self = this;

    var hideSearch = function () {
        $$("#barNoSearch").css("display", "");
        $$("#barSearch").hide();
        $$("#shade").hide();
    };
    //取消搜索
    $$("#barSearch input[type=search]").on("blur", hideSearch);
    $$("#shade").on("click", hideSearch);

    //显示搜索框
    $$("#btnSearchOrder").on("click", function () {
        $$("#barNoSearch").hide();
        $$("#barSearch").show();
        $$("#shade").css({ 'height': $$(window).height() - 44 + "px" }).show();
    });

    $$("#txtSearchOrder").on("keypress", function ($event) {
        if ($event.which == 13) {
            var keyword = $$("#txtSearchOrder").val();
            keyword = keyword.replace(/(^\s*)|(\s*$)/g, "")
            if (keyword) {
                self.searchOrderNo = keyword;
                changeTab($$('a[data-filter="all"]'));
                hideSearch();
                self.searchOrderNo = "";
            }
        }
    });

    //监听返回
    $$(document).on('pageAfterBack', '.page[data-page="orderInfo"]', function (e) {
        myApp.pullToRefreshTrigger(".pull-to-refresh-content.orderList-container");
    });
    $$(document).on('pageAfterBack', '.page[data-page="deliveryLists"]', function (e) {
        myApp.pullToRefreshTrigger(".pull-to-refresh-content.orderList-container");
    });

    self.params = {
        pageSize: 10,
        pageIndex: 1
    };

    var changeTab = function (obj) {
        $$(obj).parent('.orderlist-filter').children('a').removeClass('active');
        $$(obj).addClass('active');

        var filter = $$(obj).attr('data-filter');
        self.params.status = filter == 'all' ? "" : filter;

        self.getOrderList();
    }

    //切换过滤条件
    $$('.buttons-row.orderlist-filter a').on('click', function (e) {
        changeTab(this);
    });

    if (page.query && page.query.showOrderType) {
        $$('.buttons-row.orderlist-filter a').each(function () {
            if ($$(this).attr('data-filter') == page.query.showOrderType)
                changeTab(this);
        });
    }
    else {
        self.getOrderList();
    }
    //下拉刷新
    $$('.pull-to-refresh-content.orderList-container').on('refresh', function (e) {
        //下拉刷新
        var filter = 'all';

        $$('.row.orderlist-filter a').each(function () {
            if ($$(this).hasClass('active')) {
                filter = $$(this).attr('data-filter');
                return false;
            }
        });

        if (filter != 'all')
            self.params.status = filter;

        self.getOrderList();
        myApp.pullToRefreshDone('.orderList-container');
    });
    self.timeMark = null;
};

UOrderApp.pages.OrderListController.prototype.getOrderList = function (callback) {
    var self = this;
    if (self.searchOrderNo) {
        self.params.searchOrderNo = self.searchOrderNo;
    }
    var orderType = $$('.link.popover-orders-links').attr('data-orderType');
    if (orderType == 'salesOrder') {
        cb.rest.getJSON('ma/orders/getUserOrders', self.params, function (data) {
            if (data.code != 200) {
                myApp.toast('加载单据列表失败', 'error').show(true);
                return;
            }
            if (data.data.orders.length < 10) {
                myApp.detachInfiniteScroll($$('.orderList-container')); //注销下拉刷新
                // 删除加载提示符
                $$('.orderList-container .infinite-scroll-preloader').remove();
            }
            if (callback)
                callback.call(this, data);
            else {
                $$("div[data-page=orderLists] .orderlistContent").html(self.orderItemFunc(data));
            }
            self.AddClickEvent($$('.order-list .order-btn'), 'a');

            var lastIndex = $$('.order-list .orderItem').length;
            if (lastIndex >= 10) {
                //无限滚动
                $$('.pull-to-refresh-content.orderList-container').on('infinite', function (e) {
                    if (self.timeMark) {
                        return false;
                    }
                    else {
                        self.timeMark = setTimeout(function () {
                            lastIndex = $$('.order-list .orderItem').length / 10 + 1;
                            if (self.params.pageIndex < lastIndex) {
                                self.params.pageIndex = lastIndex;
                                var filter = 'all';

                                $$('.row.orderlist-filter a').each(function () {
                                    if ($$(this).hasClass('active')) {
                                        filter = $$(this).attr('data-filter');
                                        return false;
                                    }
                                });

                                if (filter != 'all')
                                    self.params.status = filter;

                                self.getOrderList(function (data) {
                                    var html = self.orderItemFunc(data);
                                    $$('.order-list').append(html);
                                    self.timeMark = null;
                                    myApp.refreshScroller();
                                });
                            }
                            else {
                                myApp.detachInfiniteScroll($$('.orderList-container')); //注销下拉刷新
                                // 删除加载提示符
                                $$('.orderList-container .infinite-scroll-preloader').remove();
                            }
                        });
                    }
                });
            }
            else {
                myApp.detachInfiniteScroll($$('.orderList-container')); //注销下拉刷新
                // 删除加载提示符
                $$('.orderList-container .infinite-scroll-preloader').remove();
            }
        });
    }
    else if (orderType == '') {

    }
};

UOrderApp.pages.OrderListController.prototype.reLoadData = function () {
    $$('.buttons-row.orderlist-filter a').each(function () {
        if ($$(this).hasClass('active'))
            $$(this).trigger('click');
    });
};

UOrderApp.pages.OrderListController.prototype.AddClickEvent = function (container, targetName) {
    var self = this;
    container.find(targetName).on('click', function (e) {
        var btnType = $$(this).attr('data-btnType');
        var orderId = $$(this).parent('.fr').data('oid');
        switch (btnType) {
            case "del":
                var param = { cOrderNo: orderId };
                cb.rest.postData('mc/orders/delOrder', param, function (data) {
                    if (data.code != 200) {
                        myApp.toast(data.message, 'error').show(true);
                        return;
                    }
                    myApp.toast('删除订单成功', 'success').show(true);
                    self.reLoadData();
                });
                break;
            case "payfor":
                myApp.toast('支付功能开发中', 'tips').show(true);
                break;
        }
    });

    $$('div[data-page="orderLists"] .orderNone-btn').on('click', function (e) {
        $$('#view-1').trigger('show');
        myApp.showToolbar('.toolbar.homeNavBar');
    });
};