
var UseSystemViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "UseSystemViewModel");
    this.init();
};
UseSystemViewModel.prototype = new cb.model.ContainerModel();
UseSystemViewModel.prototype.constructor = UseSystemViewModel;

UseSystemViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "UseSystemViewModel",
        tabMenu: new cb.model.SimpleModel({
            isNeedCollect: false, dataSource: [
				{ content: "usingSystem", isSelected: true }
            ]
        }),
        editAction: new cb.model.SimpleModel({ title: "编辑", ctrlType: "Button", owner: "Toolbar 功能" }),
        saveAction: new cb.model.SimpleModel({ title: "保存", ctrlType: "Button", owner: "Toolbar 功能" }),
        cancelAction:new cb.model.SimpleModel({ title: "取消", ctrlType: "Button", owner: "Toolbar 功能" }),
        ModuleTree: new cb.model.Model2D({
            checkboxes: {
                checkChildren: true,
            },
            dragAndDrop: false,
        }),
        createcalendar: new cb.model.SimpleModel({ title: "启用日期", ctrlType: "DateBox", owner: "Toolbar 功能" }),
        GroupTree: new cb.model.Model2D({ dragAndDrop: false}),
    };
    this.setData(fields);
    this.setDirty(false);

    //事件注册---需要整理，框架需要变动
    this.geteditAction().on("click", function (args) { UseSystemViewModel_Extend.editAction(this.getParent(), args); });
    this.getsaveAction().on("click", function (args) { UseSystemViewModel_Extend.saveAction(this.getParent(), args); });
    this.getcancelAction().on("click", function (args) { UseSystemViewModel_Extend.cancelAction(this.getParent(), args); });
    this.getGroupTree().on("click", function (args) { UseSystemViewModel_Extend.GroupTree(this.getParent(), args); });
    this.getModuleTree().on("check", function (args) { UseSystemViewModel_Extend.ModuleTree(this.getParent(), args); });
    this.getModuleTree().on("expand", function (args) { UseSystemViewModel_Extend.ModuleTreeExpand(this.getParent(), args); });
    this.getModuleTree().on("click", function (args) { UseSystemViewModel_Extend.ModuleTreeClick(this.getParent(), args); });
    this.getcreatecalendar().on("afterchange", function (args) { UseSystemViewModel_Extend.createcalendar(this.getParent(), args); });

    var proxyConfig = {
        GetGroupTree: { url: "upservices/up.itf.uap.sysmng.service.ISystemManageService/UAP/querySysGroups", method: "Post", mask:true },
        GetApplicationMenus: { url: "upservices/up.itf.uap.sysmng.service.ISystemManageService/UAP/getBusiCenterVOs", method: "Post", mask:true },
        GetInitModuleTree: { url: "upservices/up.itf.uap.sysmng.service.ISystemManageService/UAP/queryInitModuleTree", method: "Post", mask:true },
        innitModule:{url:"upservices/up.itf.uap.sysmng.service.ISystemManageService/UAP/initModuleTree", method: "Post", mask:true }
    }
    this.setProxy(proxyConfig);
    this.initData();
};

UseSystemViewModel.prototype.initData = function () {
    UseSystemViewModel_Extend.doAction("init_Extend", this);
};
