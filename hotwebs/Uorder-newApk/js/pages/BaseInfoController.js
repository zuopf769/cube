UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.BaseInfoController = function () { };
UOrderApp.pages.BaseInfoController.prototype.preprocess = function (content, url, next) {
    next(content);
};
UOrderApp.pages.BaseInfoController.prototype.pageInit = function (page) {
    var month = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
    var weeks = ["日", "一", "二", "三", "四", "五", "六"];
    var calendarDefault = myApp.calendar({
        input: '#calendar-default',
        closeOnSelect: true,
        monthNames: month,
        dayNamesShort: weeks
    });

    if (page.query) {
        myApp.formFromJSON('#baseInfo', page.query);
        $$('div[data-page="BaseInfo"] .companyName').html(page.query.agentName);
        $$('div[data-page="BaseInfo"] .orderType').html('订单日期：' + page.query.dConfirmDate);
    }
    $$('.button.baseInfo-submit').on('click', function (e) {
        var formData = myApp.formToJSON('#baseInfo');
        formData.agentName = page.query.agentName;
        formData.dConfirmDate = page.query.dConfirmDate;
        if (!formData.dSendDate || new Date(formData.dSendDate) < new Date(new Date().format("yyyy-MM-dd"))) {
            myApp.toast('请输入正确的发货日期', 'tips').show(true);
            return false;
        }
        var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
        if (!myreg.test(formData.cReceiveContacterPhone)) {
            myApp.toast('请输入正确的手机号码', 'tips').show(true);
            return false;
        }
        var pageVewList = $$(myApp.mainView.pagesContainer).find('.page');
        pageVewList[pageVewList.length - 1].f7PageData.query = { baseInfoData: formData };
        myApp.mainView.router.back({
            query: { baseInfoData: formData }
        });
    });
};