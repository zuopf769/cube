var CommonHomeViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "CommonHomeViewModel");
    this.init();
};
CommonHomeViewModel.prototype = new cb.model.ContainerModel();
CommonHomeViewModel.prototype.constructor = CommonHomeViewModel;

CommonHomeViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "CommonHomeViewModel",
        listMenu: new cb.model.SimpleModel(),
        msgTask: new cb.model.SimpleModel(),
        schedule: new cb.model.SimpleModel()
    };

    this.setData(fields);
    this.setDirty(false);
    this.getlistMenu().on("click", function (args) { CommonHomeViewModel_Extend.menuItemClick(this.getParent(), args); });



    var proxyConfig = {
        GetMenu:     { url: "u8services/classes/UAP/com.yonyou.u8.framework.server.service.base.MenuService?method=GetMenu", method: "Get" },
        GetMessages: { url: "classes/Message/UAP/QueryOverView?method=GetMenu", method: "Get" }
    };
  


    this.setProxy(proxyConfig);

    CommonHomeViewModel_Extend.doAction("init_Extend", this);
};