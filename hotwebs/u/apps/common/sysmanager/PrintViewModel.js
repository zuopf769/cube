var PrintViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "PrintViewModel");
    this.init();
};
PrintViewModel.prototype = new cb.model.ContainerModel();
PrintViewModel.prototype.constructor = PrintViewModel;

PrintViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "PrintViewModel",
        confirmAction: new cb.model.SimpleModel({ title: "确认", ctrlType: "Button", owner: "Toolbar 功能" }),
        cancelAction: new cb.model.SimpleModel({ title: "取消", ctrlType: "Button", owner: "Toolbar 功能" }),
        PrintPath: new cb.model.SimpleModel(),
        DocumentName: new cb.model.SimpleModel(),
        DirTree: new cb.model.Model2D({ expandAll: false, dragAndDrop: false,
            refName:"code" }),
    };
    this.setData(fields);
    this.setDirty(false);

    //事件注册---需要整理，框架需要变动
    this.getconfirmAction().on("click", function (args) { PrintViewModel_Extend.confirmAction(this.getParent(), args); });
    this.getcancelAction().on("click", function (args) { PrintViewModel_Extend.cancelAction(this.getParent(), args); });
    this.getDirTree().on("expand", function (args) { PrintViewModel_Extend.DirTreeExpand(this.getParent(), args); });
    this.getDirTree().on("click", function (args) { PrintViewModel_Extend.DirTreeSelect(this.getParent(), args); });

    var proxyConfig = {
        GetWindowSysDirs: { url: "upservices/up.itf.uap.sysmng.service.IDBInputOutputService/UAP/queryWindowNTSysDirs", method: "Post", mask:true },
        BackupDatabase: { url: "upservices/up.itf.uap.sysmng.service.IDBInputOutputService/UAP/backupDatabase", method: "Post", mask:true },
    };
    this.setProxy(proxyConfig);

    this.initData();
};

PrintViewModel.prototype.initData = function () {
    PrintViewModel_Extend.doAction("init_Extend", this);
};
