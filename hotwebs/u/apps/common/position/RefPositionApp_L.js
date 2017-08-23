
var RefPositionViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "RefPositionViewModel");
    this.init();
};
RefPositionViewModel.prototype = new cb.model.ContainerModel();
RefPositionViewModel.prototype.constructor = RefPositionViewModel;

RefPositionViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "RefPositionViewModel",
        selectContent: new cb.model.SimpleModel({dataTextField:"name",dataValueField:"name"}),
        selectAttr: new cb.model.SimpleModel({dataTextField:"name", dataValueField:"attr"}),
        partMatch: new cb.model.SimpleModel(),
        caseMatch: new cb.model.SimpleModel(),
        searchNextAction: new cb.model.SimpleModel({ title: "查找下一处", ctrlType: "Button", owner: "Toolbar 功能" }),
        closeAction: new cb.model.SimpleModel({ title: "关闭", ctrlType: "Button", owner: "Toolbar 功能" })
    };
    this.setData(fields);
    this.setDirty(false);

    this.getsearchNextAction().on("click", function (args) { RefPositionViewModel_Extend.searchNextAction(this.getParent(), args); });
    this.getcloseAction().on("click", function (args) { RefPositionViewModel_Extend.closeAction(this.getParent(), args); });

    var proxyConfig = {
        AllSimpleRefRecord: { url:"classes/General/common.referdesigner/AllSimpleRefRecord", method: "Post" },
        QueryRefRecord: { url: "classes/General/common.referdesigner/QueryRefRecord", method: "Post" },
        QueryRefPosition: { url: "classes/General/common.referdesigner/QueryRefPosition", method: "Post" }
    };
    this.setProxy(proxyConfig);
    this.initData();
};

RefPositionViewModel.prototype.initData = function () {
    RefPositionViewModel_Extend.doAction("init_Extend", this);
};
