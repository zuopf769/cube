var ImportDBPathViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "ImportDBPathViewModel");
    this.init();
};
ImportDBPathViewModel.prototype = new cb.model.ContainerModel();
ImportDBPathViewModel.prototype.constructor = ImportDBPathViewModel;

ImportDBPathViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "ImportDBPathViewModel",
        confirmAction: new cb.model.SimpleModel({ title: "确认", ctrlType: "Button", owner: "Toolbar 功能" }),
        cancelAction: new cb.model.SimpleModel({ title: "取消", ctrlType: "Button", owner: "Toolbar 功能" }),
        PrintPath: new cb.model.SimpleModel(),
        DirTree: new cb.model.Model2D({ expandAll: false, dragAndDrop: false,
            refName:"code"  }),
    };
    this.setData(fields);
    this.setDirty(false);

    //事件注册---需要整理，框架需要变动
    this.getconfirmAction().on("click", function (args) { ImportDBPathViewModel_Extend.confirmAction(this.getParent(), args); });
    this.getcancelAction().on("click", function (args) { ImportDBPathViewModel_Extend.cancelAction(this.getParent(), args); });
    this.getDirTree().on("expand", function (args) { ImportDBPathViewModel_Extend.DirTreeExpand(this.getParent(), args); });
    this.getDirTree().on("click", function (args) { ImportDBPathViewModel_Extend.DirTreeSelect(this.getParent(), args); });

    var proxyConfig = {
        GetWindowSysDirs: { url: "upservices/up.itf.uap.sysmng.service.IDBInputOutputService/UAP/queryWindowNTSysDirs", method: "Post" , mask:true },
        RestoreDatabase: { url: "upservices/up.itf.uap.sysmng.service.IDBInputOutputService/UAP/RestoreDatabase", method: "Post" , mask:true },
        
    };
    this.setProxy(proxyConfig);

    this.initData();
};

ImportDBPathViewModel.prototype.initData = function () {
    ImportDBPathViewModel_Extend.doAction("init_Extend", this);
};
