/// <reference path="../../common/js/Cube.js" />
/// <reference path="DeliveryApp_Extend.js" />
var CommonBatchReportViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "CommonBatchReportViewModel");
    this.init();
};
CommonBatchReportViewModel.prototype = new cb.model.ContainerModel();
CommonBatchReportViewModel.prototype.constructor = CommonBatchReportViewModel;

CommonBatchReportViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "CommonBatchReportViewModel",
        AppId: "common.batch.BatchReport",
        Symbol: "common.batch.BatchReport",
        closeAction: new cb.model.SimpleModel(),
        notationAction: new cb.model.SimpleModel(),
        submitAction: new cb.model.SimpleModel(),
        cancelAction: new cb.model.SimpleModel(),
        totaltable: new cb.model.Model3D({
            "dsMode":"local",
            ReadOnly: true, Columns: {
                msgID: { title: "单据ID", ctrlType: "TextBox",width:150 },
                msgContent: { title: "错误信息", ctrlType: "TextBox",width:500 }
            }
        }),
    };
    this.setData(fields);
    this.setDirty(false);

    //事件注册---需要整理，框架需要变动
    this.getcloseAction().on("click", function (args) { CommonBatchReportViewModel_Extend.closeAction(this.getParent(), args); });
    this.getsubmitAction().on("click", function (args) { CommonBatchReportViewModel_Extend.submitAction(this.getParent(), args) });
    this.getnotationAction().on("click", function (args) { CommonBatchReportViewModel_Extend.notationAction(this.getParent(), args) });
    this.getcancelAction().on("click", function (args) { CommonBatchReportViewModel_Extend.cancelAction(this.getParent(), args) });
    this.gettotaltable().on("changePage", function (args) { CommonBatchReportViewModel_Extend.totalchangePage(this.getParent(), args); });
   
    this.initData();
};

CommonBatchReportViewModel.prototype.initData = function () {
    CommonBatchReportViewModel_Extend.doAction("init_Extend", this);
};
