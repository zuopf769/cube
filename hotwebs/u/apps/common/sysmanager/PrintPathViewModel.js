var PrintPathViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "PrintPathViewModel");
    this.init();
};
PrintPathViewModel.prototype = new cb.model.ContainerModel();
PrintPathViewModel.prototype.constructor = PrintPathViewModel;

PrintPathViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "PrintPathViewModel",
        confirmAction: new cb.model.SimpleModel({ title: "确认", ctrlType: "Button", owner: "Toolbar 功能" }),
        cancelAction: new cb.model.SimpleModel({ title: "取消", ctrlType: "Button", owner: "Toolbar 功能" }),
        PrintPath: new cb.model.SimpleModel(),
        DocumentName: new cb.model.SimpleModel(),
        DirTree: new cb.model.Model2D({ expandAll: false, dragAndDrop: false, }),
    };
    this.setData(fields);
    this.setDirty(false);

    //事件注册---需要整理，框架需要变动
    this.getconfirmAction().on("click", function (args) { PrintPathViewModel_Extend.confirmAction(this.getParent(), args); });
    this.getcancelAction().on("click", function (args) { PrintPathViewModel_Extend.cancelAction(this.getParent(), args); });
    this.getDirTree().on("expand", function (args) { PrintPathViewModel_Extend.DirTreeExpand(this.getParent(), args); });
    this.getDirTree().on("click", function (args) { PrintPathViewModel_Extend.DirTreeSelect(this.getParent(), args); });

    var proxyConfig = {
        GetWindowSysDirs: { url: "upservices/up.itf.uap.sysmng.service.IDBInputOutputService/UAP/queryWindowNTSysDirs", method: "Post", mask:true },
        RestoreDatabase: { url: "upservices/up.itf.uap.sysmng.service.IDBInputOutputService/UAP/RestoreDatabase", method: "Post", mask:true },
        
    };
    this.setProxy(proxyConfig);

    this.initData();
};

PrintPathViewModel.prototype.initData = function () {
    PrintPathViewModel_Extend.doAction("init_Extend", this);
};
