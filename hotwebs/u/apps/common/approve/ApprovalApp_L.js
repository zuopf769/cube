
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
        billType: new cb.model.SimpleModel(),
        billno: new cb.model.SimpleModel(),
        creater: new cb.model.SimpleModel(),
        closeAction: new cb.model.SimpleModel({ model: "no-txt" }),
        approvalcomments: new cb.model.SimpleModel(),
        submitAction: new cb.model.SimpleModel(),
        processbar: new cb.model.SimpleModel(),
        rejectCombo: new cb.model.SimpleModel(
            {
                title: "业务类型", ctrlType: "ComboBox", owner: "DeliveryDetail 发货单详情",
                fieldType: "image-text"
                //dataSource: [
                //{ value: "1", text: "0陆征", image: "pc/images/menu/u32.png" },
                //{ value: "2", text: "1陆征", image: "pc/images/menu/u32.png" },
                //{ value: "3", text: "2陆征", image: "pc/images/menu/u32.png" }
                //]
            }),

        approvalview: new cb.model.SimpleModel({
            dataSource: {
                type: "Radio", name: "appview", list: [
                    { value: "0", text: "同意", checked: true },
                    { value: "1", text: "不同意" },
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
    this.getprocessbar().on("click", function (args) { ApprovalViewModel_Extend.processbarClick(this.getParent(), args); });
    this.getapprovalview().on("click", function (args) { ApprovalViewModel_Extend.approvalViewClick(this.getParent(), args); });
    this.initData();
};

ApprovalViewModel.prototype.initData = function () {
    ApprovalViewModel_Extend.doAction("init_Extend", this);
};
