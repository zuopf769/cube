UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.logisticsInforController = function () { };
UOrderApp.pages.logisticsInforController.prototype.preprocess = function (content, url, next) {
    var context = $$.parseUrlQuery(url) || {};
    if (!context.oid) {
        myApp.toast('订单编号为空！', 'tips').show(true);
        return;
    }
    var data = {
        logisticsName: '德邦物流',
        logisticsNo: '2015001100122546',
        logisticsInfo: [{
            log: '在北京海淀区上地公司进行派件扫描；派送业务员：于栋彪；联系电话：15890495655',
            date: '2015-8-5 1:34:41'
        },
        {
            log: '到达目的地网点北京海淀区上地公司，快件将很快进行派送',
            date: '2015-8-5 1:34:41'
        },
        {
            log: '从北京分拨中心发出，本次转运目的地：北京海淀区上地公司',
            date: '2015-8-5 1:34:41'
        },
        {
            log: '在分拨中心北京分拨中心进行卸车扫描',
            date: '2015-8-5 1:34:41'
        },
        {
            log: '在湖南长沙分拨中心进行装车扫描，即将发往：北京分拨中心',
            date: '2015-8-5 1:34:41'
        }
        ]
    };
    var template = Template7.compile(content);
    var resultContent = template(data);

    next(resultContent);
};
UOrderApp.pages.logisticsInforController.prototype.pageInit = function (page) {
    $$('.retern-btn.logistics').on('click', function () {
        myApp.mainView.router.back();
    });
};
