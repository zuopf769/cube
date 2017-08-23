var UpgradeViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "UpgradeViewModel");
    this.init();
};
UpgradeViewModel.prototype = new cb.model.ContainerModel();
UpgradeViewModel.prototype.constructor = UpgradeViewModel;

UpgradeViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "UpgradeViewModel",
        upgradeData: new cb.model.Model2D({
            expandAll: true,
            dragAndDrop: false,
            refName:"disPlayName"
        }),

        confirmAction: new cb.model.SimpleModel({ title: "确认", ctrlType: "Button", owner: "Toolbar 功能" }),
        cancelAction: new cb.model.SimpleModel({ title: "取消", ctrlType: "Button", owner: "Toolbar 功能" }),
    };
    this.setData(fields);
    this.setDirty(false);

    //事件注册---需要整理，框架需要变动
    this.getconfirmAction().on("click", function (args) { UpgradeViewModel_Extend.confirmAction(this.getParent(), args); });
    this.getcancelAction().on("click", function (args) { UpgradeViewModel_Extend.cancelAction(this.getParent(), args); });

    var proxyConfig = {
        GetUpdateAcount: { url: "upservices/up.itf.uap.update.service.IUpdateAccountsService/UAP/updateAcountNew", method: "Post", mask:true },
        GetinstalledAcount: { url: "upservices/up.itf.uap.update.service.IUpdateAccountsService/UAP/installedAcount", method: "Post", mask:true },
        GetdoInstallAcount: { url: "upservices/up.itf.uap.update.service.IUpdateAccountsService/UAP/doInstallDB", method: "Post", mask:true }
    };
    this.setProxy(proxyConfig);

    this.initData();
};

UpgradeViewModel.prototype.initData = function () {
    UpgradeViewModel_Extend.doAction("init_Extend", this);
};
