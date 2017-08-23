/// <reference path="../../../common/js/Cube.js" />
var AccountingPeriodViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || 'AccountingPeriodViewModel');
    this.init();
};
AccountingPeriodViewModel.prototype = new cb.model.ContainerModel();
AccountingPeriodViewModel.prototype.constructor = AccountingPeriodViewModel;
AccountingPeriodViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: 'AccountingPeriodViewModel',
        Symbol: "sysmanager.AccountingPeriod",
        AccountYear: new cb.model.SimpleModel({}),
        AccountGrid: new cb.model.Model3D({
            height: "400px",
            dsMode: 'local', readOnly: false, showCheckBox: false,
            title: "", ctrlType: "KendoGrid", Columns: {
                app_num: { title: "序号", ctrlType: "TextBox", owner: "", width: "15%" },
                app_month: { title: "月份", ctrlType: "TextBox", owner: "", width: "25%" },
                app_startTime: { title: "开始时间", ctrlType: "textBox", owner: "", width: "30%" },
                app_endTime: { title: "结束时间", ctrlType: "textBox", owner: "", width: "30%" }
            }
        }),
        close: new cb.model.SimpleModel({}),
        cancel: new cb.model.SimpleModel({}),
        determine: new cb.model.SimpleModel({})

    };
    this.setData(fields);
    this.setDirty(false);
    //    事件注册
    this.getclose().on('click', function (args) { AccountingPeriodViewModel_Extend.closeAction(this.getParent(), args) });
    this.getcancel().on('click', function (args) { AccountingPeriodViewModel_Extend.cancelAction(this.getParent(), args) });
    this.getdetermine().on('click', function (args) { AccountingPeriodViewModel_Extend.determineAction(this.getParent(), args) });

    //服务代理
    var proxyConfig = {};
    this.setProxy(proxyConfig);
    this.initData();
};
AccountingPeriodViewModel.prototype.initData = function () {
    AccountingPeriodViewModel_Extend.doAction('init_Extend', this)
};
