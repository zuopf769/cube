var PanoramaMenuViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "PanoramaMenuViewModel");
    this.init();
};
PanoramaMenuViewModel.prototype = new cb.model.ContainerModel();
PanoramaMenuViewModel.prototype.constructor = PanoramaMenuViewModel;

PanoramaMenuViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "PanoramaMenuViewModel",
        Symbol: "UAP",
        MenuTree: new cb.model.SimpleModel(),
        Panorama: new cb.model.SimpleModel(),
        lastOperation: new cb.model.SimpleModel(),
		SeachContent: new cb.model.SimpleModel()

    };
    this.setData(fields);
    this.setDirty(false);


    var proxyConfig = {
        GetDomainMenu: { url: "classes/Login/UAP/GetDomainMenu", method: "Get" },
        GetSubMenu: { url: "classes/Login/UAP/GetSubMenu", method: "Get" },
        UpdateMenuStats: { url: "classes/Login/UAP/UpdateMenuStats", method: "Get" },
        GetSwingInfo: { url: "classes/Login/UAP/getSSOKey", method: "Get" },
        GetAddFrequently:{url:"classes/Login/UAP/AddFrequentlyFunction",method:"post"},
        GetSearchMenu:{url:"classes/Login/UAP/SearchMenu",method:"post"},
    };
    var queryStringParent = new cb.util.queryString(location.search);
    if (queryStringParent.get('isSys')=="true") {
           proxyConfig.GetDomainMenu = "upservices/up.uap.base.org.SystemManageService/UAP/GetMenu"
    }
    this.setProxy(proxyConfig);
	
    this.getlastOperation().on("click", function () { PanoramaMenuViewModel_Extend.doAction("lastOperation", this.getParent()); });
    this.getPanorama().on("itemClick", function (data) { PanoramaMenuViewModel_Extend.updateMenuStats(this.getParent(), data); });
	this.getSeachContent().on("search", function (data) { PanoramaMenuViewModel_Extend.search(this.getParent(), data); });
	this.getPanorama().on("imgClick", function (data) { PanoramaMenuViewModel_Extend.imgClick(this.getParent(), data); });
	this.getMenuTree().on("beforeExpand",function (data) { PanoramaMenuViewModel_Extend.beforeExpand(this.getParent(), data); });
	this.getMenuTree().on("click",function (data) { PanoramaMenuViewModel_Extend.menuTreeClick(this.getParent(), data); });

	this.getPanorama().on("itemClick",function (data) { PanoramaMenuViewModel_Extend.itemClick(this.getParent(), data); });


    this.initData();
}

PanoramaMenuViewModel.prototype.initData = function () {
    PanoramaMenuViewModel_Extend.doAction("init_Extend", this);
}

PanoramaMenuViewModel.prototype.onClick = function (func) {
    this.getMenuTree.on("click", func);
}