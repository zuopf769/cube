var SysPanoramaMenuViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "SysPanoramaMenuViewModel");
    this.init();
};
SysPanoramaMenuViewModel.prototype = new cb.model.ContainerModel();
SysPanoramaMenuViewModel.prototype.constructor = SysPanoramaMenuViewModel;

SysPanoramaMenuViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "SysPanoramaMenuViewModel",
        Symbol: "UAP",
        MenuTree: new cb.model.SimpleModel(),       
        lastOperation: new cb.model.SimpleModel()
    };
    this.setData(fields);
    this.setDirty(false);


    var proxyConfig = {
        GetMenu: { url: "upservices/up.uap.base.org.SystemManageService/UAP/GetMenu", method: "Get" },
    };
    this.setProxy(proxyConfig);

    //this.getlastOperation().on("click", function () { SysPanoramaMenuViewModel_Extend.doAction("lastOperation", this.getParent()); });    

    SysPanoramaMenuViewModel_Extend.doAction("init_Extend", this);
}
