/// <reference path="../../common/js/Cube.js" />
/// <reference path="DeliveryApp_Extend.js" />
var CommonPushListViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "CommonPushListViewModel");
    this.init();
};
CommonPushListViewModel.prototype = new cb.model.ContainerModel();
CommonPushListViewModel.prototype.constructor = CommonPushListViewModel;

CommonPushListViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "CommonPushListViewModel",
        Symbol: "UAP",
        closeAction: new cb.model.SimpleModel(),
        notationAction: new cb.model.SimpleModel(),
        submitAction: new cb.model.SimpleModel(),
        cancelAction: new cb.model.SimpleModel(),
        totaltable: new cb.model.Model3D({ Mode: "Remote" }),
        batchMContainer: new cb.model.SimpleModel()
        //batchModifyOk: new cb.model.SimpleModel()
    };
    this.setData(fields);
    this.setDirty(false);

    var proxyconfig = {
        //获取栏目
        GetColumnByColCode: { url: "classes/General/u8column/QueryColumnByCode", method: "Get" }
    };
    this.setProxy(proxyconfig);

    //事件注册---需要整理，框架需要变动
    this.getcloseAction().on("click", function (args) { CommonPushListViewModel_Extend.closeAction(this.getParent(), args); });
    this.getsubmitAction().on("click", function (args) { CommonPushListViewModel_Extend.submitAction(this.getParent(), args) });
    this.getnotationAction().on("click", function (args) { CommonPushListViewModel_Extend.notationAction(this.getParent(), args) });
    this.getcancelAction().on("click", function (args) { CommonPushListViewModel_Extend.cancelAction(this.getParent(), args) });
    this.gettotaltable().on("changePage", function (args) { CommonPushListViewModel_Extend.totalchangePage(this.getParent(), args); });
    this.getbatchMContainer().on("updateData", function (args) { CommonPushListViewModel_Extend.updateData(this.getParent(), args); });
    //this.getbatchModifyOk().on("click", function (args) { CommonPushListViewModel_Extend.batchModifyOk(this.getParent(), args); });

    this.initData();
};

CommonPushListViewModel.prototype.initData = function () {
    CommonPushListViewModel_Extend.doAction("init_Extend", this);
};

CommonPushListViewModel.prototype.updateData = function (args) {
    CommonPushListViewModel_Extend.updateData(this, args);
}
