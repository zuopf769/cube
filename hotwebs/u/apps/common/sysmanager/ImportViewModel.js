var ImportViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "ImportViewModel");
    this.init();
};
ImportViewModel.prototype = new cb.model.ContainerModel();
ImportViewModel.prototype.constructor = ImportViewModel;

ImportViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "ImportViewModel",
        confirmAction: new cb.model.SimpleModel({ title: "确认", ctrlType: "Button", owner: "Toolbar 功能" }),
        cancelAction: new cb.model.SimpleModel({ title: "取消", ctrlType: "Button", owner: "Toolbar 功能" }),
        BackupFile: new cb.model.SimpleModel(),
		DBFile: new cb.model.SimpleModel(),
        DirTree: new cb.model.Model2D({ expandAll: false, dragAndDrop: false,
            refName:"code"  }),
		DBSrvAddr: new cb.model.SimpleModel(),
		DBSrvPort: new cb.model.SimpleModel(),
		dbuser: new cb.model.SimpleModel(),
		dbpass: new cb.model.SimpleModel(),
		connectAction: new cb.model.SimpleModel({ title: "连接", ctrlType: "Button", owner: "Toolbar 功能" }),
		dbpathAction: new cb.model.SimpleModel({ title: "...", ctrlType: "Button", owner: "Toolbar 功能" })
    };
    this.setData(fields);
    this.setDirty(false);

    //事件注册---需要整理，框架需要变动
    this.getconfirmAction().on("click", function (args) { ImportViewModel_Extend.confirmAction(this.getParent(), args); });
    this.getcancelAction().on("click", function (args) { ImportViewModel_Extend.cancelAction(this.getParent(), args); });
    this.getDirTree().on("expand", function (args) { ImportViewModel_Extend.DirTreeExpand(this.getParent(), args); });
    this.getDirTree().on("click", function (args) { ImportViewModel_Extend.DirTreeSelect(this.getParent(), args); });
	this.getconnectAction().on("click", function (args) { ImportViewModel_Extend.connectAction(this.getParent(), args); });
	this.getdbpathAction().on("click", function (args) { ImportViewModel_Extend.dbpathAction(this.getParent(), args); });

    var proxyConfig = {
        GetWindowSysDirs: { url: "upservices/up.itf.uap.sysmng.service.IDBInputOutputService/UAP/queryWindowNTSysDirs", method: "Post" , mask:true },
        RestoreDatabase: { url: "upservices/up.itf.uap.sysmng.service.IDBInputOutputService/UAP/restoreDatabase", method: "Post" , mask:true },
        
    };
    this.setProxy(proxyConfig);

    this.initData();
};

ImportViewModel.prototype.initData = function () {
    ImportViewModel_Extend.doAction("init_Extend", this);
};
