var SysHomeViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "SysHomeViewModel");
    this.init();
};
SysHomeViewModel.prototype = new cb.model.ContainerModel();
SysHomeViewModel.prototype.constructor = SysHomeViewModel;

SysHomeViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "SysHomeViewModel",
        Symbol: "UAP",
        MenuTree: new cb.model.SimpleModel(),
        Panorama: new cb.model.SimpleModel(),
        lastOperation: new cb.model.SimpleModel() ,
        controlTreeAction: new cb.model.SimpleModel(),
        tabMenu1: new cb.model.SimpleModel()
    };
    this.setData(fields);
    this.setDirty(false);


    var proxyConfig = {
        GetDomainMenu: { url: "classes/Login/UAP/GetDomainMenu", method: "Get" },
        GetSubMenu: { url: "classes/Login/UAP/GetSubMenu", method: "Get" },
        UpdateMenuStats: { url: "classes/Login/UAP/UpdateMenuStats", method: "Get" },
        GetSwingInfo: { url: "classes/Login/UAP/getSSOKey", method: "Get" },
    };
    var queryStringParent = new cb.util.queryString(location.search);
    if (queryStringParent.get('isSys')=="true") {
           proxyConfig.GetDomainMenu = "upservices/up.uap.base.org.SystemManageService/UAP/GetMenu"
    }
    this.setProxy(proxyConfig);

    this.getlastOperation().on("click", function () { SysHomeViewModel_Extend.doAction("lastOperation", this.getParent()); });

    this.getPanorama().on("itemClick", function (data) { SysHomeViewModel_Extend.updateMenuStats(this.getParent(), data); });

    this.getcontrolTreeAction().on("click", function () { SysHomeViewModel_Extend.controlTreeAction(); });
    SysHomeViewModel_Extend.doAction("init_Extend", this);
}

SysHomeViewModel.prototype.onClick = function (func) {
    this.getMenuTree.on("click", func);
}