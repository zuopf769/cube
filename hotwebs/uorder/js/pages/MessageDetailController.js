UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.MessageDetailController = function () {
    this.msgDetailFunc = Template7.compile($$('#msgDetailTpl').html());
};
UOrderApp.pages.MessageDetailController.prototype.preprocess = function (content, url, next) {
    var context = $$.parseUrlQuery(url) || {};
    if (!context.voucherType) {
        myApp.toast('消息类型不能为空！', 'tips').show(true);
        return;
    }
    var param = {
        pageIndex: 1,
        pageSize: 10,
        voucherType: context.voucherType
    };
    var self = this;
    self.param = param;
    next(content);

    cb.rest.getJSON('ma/Bulletins/getBulletins', param, function (data) {
        if (typeof data == 'string')
            data = JSON.parse(data);
        if (data.code != 200) {
            myApp.toast('获取消息列表失败！', 'error').show(true);
            return;
        }

        var html = self.msgDetailFunc({
            bulletins: data.data.bulletins,
            serverhost: cb.rest.appContext.serviceUrl
        });

        $$('div[data-page="MessageDetail"] .media-list.msgDetail').find('ul').html(html);
        myApp.initImagesLazyLoad(myApp.mainView.activePage.container);

        if (data.data.bulletins.length == 10) {
            $$('div[data-page="MessageDetail"] .infinite-scroll.messageDetail-container').on('infinite', function () {
                var param = {
                    pageSize: 10,
                    voucherType: self.param.voucherType
                };
                var itemLength = $$(this).find('li').length;
                param.pageIndex = itemLength / 10 + 1;

                cb.rest.getJSON('ma/Bulletins/getBulletins', param, function (cdata) {
                    if (typeof cdata == 'string')
                        cdata = JSON.parse(cdata);

                    var chtml = self.msgDetailFunc({
                        bulletins: cdata.data.bulletins,
                        serverhost: cb.rest.appContext.serviceUrl
                    });

                    $$('div[data-page="MessageDetail"] .media-list.msgDetail').find('ul').append(chtml);
                    myApp.initImagesLazyLoad(myApp.mainView.activePage.container);
                });
            });
        }
        else
            $$('.messageDetail-container .infinite-scroll-preloader').remove();
    });    
};

UOrderApp.pages.MessageDetailController.prototype.pageInit = function (page) {
    var self = this;
    var param = {
        pageIndex: 1,
        pageSize: 10,
        voucherType: this.param.voucherType
    };

    $$('div[data-page="MessageDetail"] .infinite-scroll.messageDetail-container').on('refresh', function () {
        var container = this;
        cb.rest.getJSON('ma/Bulletins/getBulletins', param, function (data) {
            if (typeof data == 'string')
                data = JSON.parse(data);
            if (data.code != 200) {
                myApp.toast('获取消息列表失败！', 'error').show(true);
                return;
            }

            var html = self.msgDetailFunc({
                bulletins: data.data.bulletins,
                serverhost: cb.rest.appContext.serviceUrl
            });

            $$(container).find('ul').html(html);
            myApp.initImagesLazyLoad(myApp.mainView.activePage.container);
            myApp.pullToRefreshDone('.infinite-scroll.messageDetail-container');
        });
    });
};