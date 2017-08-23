UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.BillController = function () {
    this.billItemFunc = Template7.compile($$('#billItemTpl').html());
};

UOrderApp.pages.BillController.prototype.preprocess = function (content, url, next) {
    var context = $$.parseUrlQuery(url) || {};
    var self = this;

    cb.rest.getJSON('ma/Payments/getPayments', { pageIndex: 1, pageSize: 10 }, function (data) {
        if (typeof data == 'string')
            data = JSON.parse(data);
        if (data.code != 200) {
            myApp.toast('获取支付单列表信息失败', 'error').show(true);
            return;
        }
        var newdata = self.formatData(data.data.data);
        var template = Template7.compile(content);
        var resultContent = template({ payList: newdata });
        next(resultContent);
    });
};

UOrderApp.pages.BillController.prototype.pageInit = function (page) {
    var self = this;
    //下拉刷新
    var $container = $$('.pull-to-refresh-content.billListContainer');
    //下拉刷新
    $container.on('refresh', function (e) {
        cb.rest.getJSON('ma/Payments/getPayments', { pageIndex: 1, pageSize: 10 }, function (data) {
            if (typeof data == 'string')
                data = JSON.parse(data);
            if (data.code != 200) {
                myApp.toast('获取支付单列表信息失败', 'error').show(true);
                return;
            }
            var newdata = self.formatData(data.data.data);
            var resultContent = self.billItemFunc({ payList: newdata });
            $container.find('.listContainer').html(resultContent);

            self.RegeistEvent();
            //重置下拉刷新 
            myApp.pullToRefreshDone('.pull-to-refresh-content.billListContainer');
        });
    });
    var loading = false;
    //无限滚动
    $container.on('infinite', function (e) {
        var param = {
            pageSize: 10
        };
        var len = $$(this).find('.listContainer').find('li').length;
        if (len < 10) return;

        // 如果正在加载，则退出
        if (loading) return;

        // 设置flag
        loading = true;

        param.pageIndex = len / 10 + 1;
        //加载数据
        cb.rest.getJSON('ma/Payments/getPayments', param, function (data) {
            if (typeof data == 'string')
                data = JSON.parse(data);
            if (data.code != 200) {
                myApp.toast('获取支付单列表信息失败', 'error').show(true);
                return;
            }
            loading = false;
            var newdata = self.formatData(data.data.data);
            var resultContent = self.billItemFunc({ payList: newdata });
            $container.find('.listContainer').append(resultContent);

            self.RegeistEvent();
            if (data.data.data.length < 10) {
                myApp.detachInfiniteScroll($container);
                // 删除加载提示符
                $container.find('.infinite-scroll-preloader').remove();
            }
        });
    });

    $$('.btn-addPayBill').click(function (e) {
        myApp.mainView.router.loadPage({
            url: 'pages/newpaybill.html'
        });
    });
    self.RegeistEvent();
};

UOrderApp.pages.BillController.prototype.RegeistEvent = function () {
    $$('.pull-to-refresh-content.billListContainer').find('li').on('click', function (e) {
        var id = $$(this).attr('data-id');
        if (id) {
            myApp.mainView.router.loadPage({
                url: 'pages/newpaybill.html',
                query: {id:id}
            });
        }
    });
};

//格式化支付单列表数据 for 匹配模板
UOrderApp.pages.BillController.prototype.formatData = function (val) {
    var data = new Array();

    var splitTime = function (date) {
        date = new Date(date.replace(/-/g, "/"));

        var year = date.getFullYear();
        //获取当前月份
        var mouth = date.getMonth();

        var newDate = new Date(year, mouth + 2, 1);

        var day = (new Date(newDate.getTime() - 1000 * 60 * 60 * 24)).getDate();

        return {
            startTime: new Date(year, mouth, 1, 0, 0, 0),
            endTime: new Date(year, mouth, day, 23, 59, 59),
        };
    };

    var weekday = new Array(7)
    weekday[0] = "周日";
    weekday[1] = "周一";
    weekday[2] = "周二";
    weekday[3] = "周三";
    weekday[4] = "周四";
    weekday[5] = "周五";
    weekday[6] = "周六";

    var mark = {};

    for (var i = 0; i < val.length; i++) {
        var item = val[i];
        if (mark[item.id]) continue;
        var o = {
            showDate: '',
            list: new Array()
        };

        var dPayCreateDate = splitTime(item.dPayCreateDate);
        if (new Date() < dPayCreateDate.endTime && new Date() > dPayCreateDate.startTime)
            o.showDate = '本月';
        else
            o.showDate = (new Date(item.dPayCreateDate.replace(/-/g, "/")).getMonth() + 1) + '月';


        var newArray = val.filter(function (item) {
            return new Date(item.dPayCreateDate.replace(/-/g, "/")) <= dPayCreateDate.endTime && new Date(item.dPayCreateDate.replace(/-/g, "/")) >= dPayCreateDate.startTime;
        });
        for (var j = 0; j < newArray.length; j++) {

            var obj = {
                id: newArray[j].id,
                cPayNo: newArray[j].cPayNo,
                iPayType: newArray[j].iPayType,
                oPayType: newArray[j].oPayType.cName,
                cPayBusinessCode: newArray[j].cPayBusinessCode ? newArray[j].cPayBusinessCode : 'FAN',
                statusName: newArray[j].oPaymentStatus.statusName,
                cSettlementWay: newArray[j].cSettlementWay,
                iAmount: newArray[j].iAmount.toFixed(2),
                iNotUsedMoney: newArray[j].iNotUsedMoney.toFixed(2)
            };
            var payDate = new Date(newArray[j].dPayCreateDate.replace(/-/g, "/"));
            obj.weekDay = weekday[payDate.getDay()];
            obj.date = (payDate.getMonth() + 1) + '-' + payDate.getDate();
            o.list.push(obj);

            mark[newArray[j].id] = true;
        }
        data.push(o);
    }
    return data;
};

