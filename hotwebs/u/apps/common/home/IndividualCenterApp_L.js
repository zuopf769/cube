var IndividualCenterViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "IndividualCenterViewModel");
    this.init();
};
IndividualCenterViewModel.prototype = new cb.model.ContainerModel();
IndividualCenterViewModel.prototype.constructor = IndividualCenterViewModel;

IndividualCenterViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "IndividualCenterViewModel",
		tabMenu: new cb.model.SimpleModel(),
        CenterInformation:new cb.model.SimpleModel({dataSource:{userName:"lugza",integrate:"888",imgUrl:"/pc/images/menu/u32.png",CenterUrl:"common.home.IndividualCenterApp",MySettingUrl:'common.home.MySettingApp'}}),
		savePwd: new cb.model.SimpleModel()
	};

    this.setData(fields);
    this.setDirty(false);
    //this.getlistMenu().on("click", function (args) { IndividualCenterViewModel_Extend.menuItemClick(this.getParent(), args); });

this.getsavePwd().on("click", function (args) { IndividualCenterViewModel_Extend.savePwd(this.getParent(), args); });

    var proxyConfig = {
        PostChangePwd:     { url: "/u8services/classes/UAP/com.yonyou.u8.framework.server.core.U8UAPServiceFacade?method=updatePassWord", method: "Post"},
       // GetMessages: { url: "classes/Message/UAP/QueryOverView?method=GetMenu", method: "Get" }
    };
  


    this.setProxy(proxyConfig);

    IndividualCenterViewModel_Extend.doAction("init_Extend", this);
};