var DynamicViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "DynamicViewModel");
    this.init();
};
DynamicViewModel.prototype = new cb.model.ContainerModel();
DynamicViewModel.prototype.constructor = DynamicViewModel;

DynamicViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "DynamicViewModel",
        listMenu: new cb.model.SimpleModel(),
        msgTask: new cb.model.SimpleModel(),
        schedule: new cb.model.SimpleModel()
    };

    this.setData(fields);
    this.setDirty(false);
    this.getlistMenu().on("click", function (args) { DynamicViewModel_Extend.menuItemClick(this.getParent(), args); });



    var proxyConfig = {
        GetMenu:     { url: "u8services/classes/UAP/com.yonyou.u8.framework.server.service.base.MenuService?method=GetMenu", method: "Get" },
        GetMessages: { url: "classes/Message/UAP/QueryOverView?method=GetMenu", method: "Get" },
        GetSchedules: { url: "classes/General/Shedule/QueryByWhereSql", method: "Post" }
    };
  


    this.setProxy(proxyConfig);

    DynamicViewModel_Extend.doAction("init_Extend", this);
};