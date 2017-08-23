UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.DeliveryListController = function () {
    this.deliveryItemFunc = Template7.compile($$('#deliveryItemTpl').html());
};
UOrderApp.pages.DeliveryListController.prototype.preprocess = function (content, url, next) {
    next(content);
};

UOrderApp.pages.DeliveryListController.prototype.pageInit = function (page) {
    var self = this;

    var params = {
        pageSize: 10,
        pageIndex: 1,
        cOrderNo: page.query.cOrderNo
    };

    //下拉刷新
    $$('.pull-to-refresh-content.deliveryList-container').on('refresh', function (e) {
        self.getOrderList(params, function (data) {
            myApp.pullToRefreshDone('.deliveryList-container');
            $$('div[data-page=deliveryLists] .deliveryListPage-container').html(self.deliveryItemFunc(data));
        });
    });
    myApp.pullToRefreshTrigger(".pull-to-refresh-content.deliveryList-container");

    //无限滚动
    $$('.pull-to-refresh-content.deliveryList-container').on('infinite', function (e) {
        var listLength = $$('.deliveryListPage-container').children('.list-wrap').length;
        if (listLength < 10) {
            myApp.detachInfiniteScroll($$('.deliveryList-container')); //注销下拉刷新
            // 删除加载提示符
            $$('.deliveryList-container .infinite-scroll-preloader').remove();
            return;
        };

        params.pageIndex = 1 + listLength / 10;

        self.getOrderList(params, function (data) {
            var html = self.orderItemFunc(data);
            $$('.deliveryListPage-container').append(html);
        });
    });
};

UOrderApp.pages.DeliveryListController.prototype.getOrderList = function (params, callback) {
    var self = this;
    cb.rest.getJSON('ma/Deliverys/getDeliveryListByOrder', params, function (data) {
        if (data.code != 200) {
            myApp.toast(data.message, 'error').show(true);
            return;
        }
        if (data.data.Deliverys.length < 10) {
            myApp.detachInfiniteScroll($$('.deliveryList-container')); //注销下拉刷新
            // 删除加载提示符
            $$('.deliveryList-container .infinite-scroll-preloader').remove();
        }

        callback.call(this, data.data);
        self.AddClickEvent($$('.deliveryListPage-container .order-btn'), 'a');
    });
};

UOrderApp.pages.DeliveryListController.prototype.AddClickEvent = function (container, targetName) {
    var self = this;
    container.find(targetName).on('click', function (e) {
        var orderId = $$(this).parent('.fr').data('oid');
        cb.rest.postData('mc/Deliverys/takeDelivery', { deliveryNo: orderId }, function (data) {
            if (typeof data == 'string')
                data = JSON.parse(data);
            if (data.code != 200) {
                myApp.toast(data.message, 'error').show(true);
                return;
            }
            myApp.toast('收货成功', 'success').show(true);
            myApp.mainView.router.back();
        });
    });
};