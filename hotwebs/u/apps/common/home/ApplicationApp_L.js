var ApplicationViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "ApplicationViewModel");
    this.init();
};
ApplicationViewModel.prototype = new cb.model.ContainerModel();
ApplicationViewModel.prototype.constructor = ApplicationViewModel;

ApplicationViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "IndividualCenterViewModel",
        tabMenu: new cb.model.SimpleModel({ mode: "application" }),
        menuTiles: new cb.model.SimpleModel(),
        addmenulist: new cb.model.SimpleModel(),
        operatormenulist: new cb.model.SimpleModel(),
        goBackmenulist: new cb.model.SimpleModel()
    };

    this.setData(fields);
    this.setDirty(false);
    this.gettabMenu().on("beforeClose", function (args) { return ApplicationViewModel_Extend.tabMenuBeforeClose(this.getParent(), args); });
    this.gettabMenu().on('click', function (args) { ApplicationViewModel_Extend.tabMenuClick(this.getParent(), args); });
    this.getaddmenulist().on("click", function (args) { ApplicationViewModel_Extend.addmenulistClick(this.getParent(), args); });
    this.getoperatormenulist().on("click", function (args) { ApplicationViewModel_Extend.operatormenulistClick(this.getParent(), args); });
    this.getgoBackmenulist().on("click", function (args) { ApplicationViewModel_Extend.goBackmenulistClick(this.getParent(), args); });
    this.getmenuTiles().on("ItemClick", function (args) { ApplicationViewModel_Extend.menuItemClick(this.getParent(), args); });
    this.getmenuTiles().on("EditClick", function (args) { ApplicationViewModel_Extend.menuEditClick(this.getParent(), args); });
    this.getmenuTiles().on("DeleteClick", function (args) { ApplicationViewModel_Extend.menuDeleteClick(this.getParent(), args); });

    var proxyConfig = {
        //GetMenu:     { url: "u8services/classes/UAP/com.yonyou.u8.framework.server.service.base.MenuService?method=GetMenu", method: "Get" },
        GetMenu: { url: "classes/Login/UAP/GetMenu", method: "Get" },
        UpdateMenuStats: { url: "classes/Login/UAP/UpdateMenuStats", method: "Get" },
        UpdateFrequentlyFunction: { url: "classes/Login/UAP/UpdateFrequentlyFunction", method: "post" },
        DeleteFrequentlyFunction: { url: "classes/Login/UAP/DeleteFrequentlyFunction", method: "post" }
    };



    this.setProxy(proxyConfig);

    ApplicationViewModel_Extend.doAction("init_Extend", this);
};