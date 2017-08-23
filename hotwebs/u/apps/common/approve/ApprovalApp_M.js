
var ApprovalViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "ApprovalViewModel");
    this.init();
};
ApprovalViewModel.prototype = new cb.model.ContainerModel();
ApprovalViewModel.prototype.constructor = ApprovalViewModel;

ApprovalViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "ApprovalViewModel",
        Symbol: "UAP",
        billno: new cb.model.SimpleModel(),
        creater: new cb.model.SimpleModel(),
        closeAction: new cb.model.SimpleModel({ model: "no-txt" }),
        approvalcomments: new cb.model.SimpleModel(),
        submitAction: new cb.model.SimpleModel(),
        approvalview: new cb.model.SimpleModel({
            dataSource: {
                type: "Radio", name: "appview", list: [
                    { value: "0", text: "同意", checked: true },
                    { value: "1", text: "不同意"},
                    { value: "2", text: "驳回" }
                ]
            }
        })
      };
    this.setData(fields);
    this.setDirty(false);

    //事件注册---需要整理，框架需要变动
    this.getcloseAction().on("click", function (args) { ApprovalViewModel_Extend.closeAction(this.getParent(), args); });
    this.getsubmitAction().on("click", function (args) { ApprovalViewModel_Extend.submitAction(this.getParent(), args) });
    this.initData();
};

ApprovalViewModel.prototype.initData = function () {
    ApprovalViewModel_Extend.doAction("init_Extend", this);
};
