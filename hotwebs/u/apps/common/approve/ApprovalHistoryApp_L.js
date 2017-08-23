
var ApprovalHistoryViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "ApprovalHistoryViewModel");
    this.init();
};
ApprovalHistoryViewModel.prototype = new cb.model.ContainerModel();
ApprovalHistoryViewModel.prototype.constructor = ApprovalHistoryViewModel;

ApprovalHistoryViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "ApprovalHistoryViewModel",
        Symbol: "UAP",
        
        closeAction: new cb.model.SimpleModel({ model: "no-txt" }),
        processbar: new cb.model.SimpleModel()
      
    };
    this.setData(fields);
    this.setDirty(false);

    //事件注册---需要整理，框架需要变动
    this.getcloseAction().on("click", function (args) { ApprovalHistoryViewModel_Extend.closeAction(this.getParent(), args); });
    //this.getprocessbar().on("click", function (args) { ApprovalHistoryViewModel_Extend.processbarClick(this.getParent(), args); });
    this.initData();
};

ApprovalHistoryViewModel.prototype.initData = function () {
    ApprovalHistoryViewModel_Extend.doAction("init_Extend", this);
};
