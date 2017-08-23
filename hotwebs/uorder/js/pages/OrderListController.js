UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.OrderListController = function () {
    this.orderItemFunc = Template7.compile($$('#orderItemTpl').html());
};
UOrderApp.pages.OrderListController.prototype.preprocess = function (content, url, next) {
    next(content);
};

UOrderApp.pages.OrderListController.prototype.pageInit = function (page) {
    var self = this;
    //点击切换单据类型
    $$('.link.popover-orders-links').on('click', function (e) {
        var clickedLink = this;
        var popoverHTML = '<div class="popover dy-popover-orders-links">' +
                            '<div class="popover-inner">' +
                              '<div class="list-block">' +
                                '<ul>' +
                                '<li><a href="#" class="item-link list-button" data-orderType="salesOrder">销售订单</li>' +
                                '<li><a href="#" class="item-link list-button" data-orderType="returnedOrder">退货单</li>' +
                                '</ul>' +
                              '</div>' +
                            '</div>' +
                          '</div>';
        myApp.popover(popoverHTML, clickedLink);

        //动态关闭popover
        $$('.popover.dy-popover-orders-links a').on('click', function (e) {
            myApp.closeModal('.dy-popover-orders-links');
            $$(clickedLink).html($$(this).html());
            $$(clickedLink).attr('data-orderType', $$(this).attr('data-orderType'));
        });;
    });
    //切换过滤条件
    $$('.buttons-row.orderlist-filter a').on('click', function (e) {
        $$(this).parent('.orderlist-filter').children('a').removeClass('active');
        $$(this).addClass('active');

        var orderType = $$('.link.popover-orders-links').attr('data-orderType');
        var filter = $$(this).attr('data-filter');

        var params = {
            pageSize: 10,
            pageIndex: 1
        };
        if (filter != 'all')
            params.status = filter;

        self.getOrderList($$('.order-list'), orderType, params);
    });

    $$('.buttons-row.orderlist-filter').children('a.active').trigger('click');

    if (page.query) {
        if (page.query.showOrderType) {
            $$('.buttons-row.orderlist-filter a').each(function () {
                if ($$(this).attr('data-filter') == page.query.showOrderType)
                    $$(this).trigger('click');
            });
        }
    }
    //下拉刷新
    $$('.pull-to-refresh-content.orderList-container').on('refresh', function (e) {
        //下拉刷新
        var orderType = $$('.link.popover-orders-links').attr('data-orderType');
        var filter = 'all';

        $$('.row.orderlist-filter a').each(function () {
            if ($$(this).hasClass('active')) {
                filter = $$(this).attr('data-filter');
                return false;
            }
        });

        var params = {
            pageSize: 10,
            pageIndex: 1
        };
        if (filter != 'all')
            params.status = filter;

        self.getOrderList($$('.order-list'), orderType, params);
        myApp.pullToRefreshDone('.orderList-container');
    });

    //无限滚动
    $$('.pull-to-refresh-content.orderList-container').on('infinite', function (e) {
        //无限滚动
        var orderType = $$('.link.popover-orders-links').attr('data-orderType');
        var filter = 'all';

        $$('.row.orderlist-filter a').each(function () {
            if ($$(this).hasClass('active')) {
                filter = $$(this).attr('data-filter');
                return false;
            }
        });

        var listLength = $$('.order-list').children('.list-wrap').length;
        if (listLength < 10) {
            myApp.detachInfiniteScroll($$('.orderList-container')); //注销下拉刷新
            // 删除加载提示符
            $$('.orderList-container .infinite-scroll-preloader').remove();
            return;
        };

        var params = {
            pageSize: 10,
            pageIndex: 1 + listLength / 10
        };
        if (filter != 'all')
            params.status = filter;

        self.getOrderList($$('.order-list'), orderType, params, function (data) {
            var html = self.orderItemFunc(data);
            $$('.order-list').append(html);
        });
    });
};

UOrderApp.pages.OrderListController.prototype.getOrderList = function (container, orderType, params, callback) {
    var self = this;
    if (orderType == 'salesOrder') {
        cb.rest.getJSON('ma/orders/getUserOrders', params, function (data) {
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
            else{
                container.html(self.orderItemFunc(data));
            }
            self.AddClickEvent($$('.order-list .order-btn'), 'a');
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
        var orderId = $$(this).parent('.fr').attr('data-oid');
        switch (btnType) {
            case "del":
                var param = { cOrderNo: orderId };
                cb.rest.postData('mc/orders/delOrder', param, function (data) {
                    if (typeof data == 'string')
                        data = JSON.parse(data);
                    if (data.code != 200) {
                        myApp.toast('删除订单失败', 'error').show(true);
                        return;
                    }
                    myApp.toast('删除订单成功', 'success').show(true);
                    self.reLoadData();
                });
                break;
            case "payfor":
                myApp.toast('支付功能开发中', 'tips').show(true);
                break;
            case "received":
                myApp.toast('确认收货功能开发中', 'tips').show(true);
                break;
        }
    });
};