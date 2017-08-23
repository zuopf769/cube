var PortalViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "PortalViewModel");
    this.init();
};
PortalViewModel.prototype = new cb.model.ContainerModel();
PortalViewModel.prototype.constructor = PortalViewModel;

PortalViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "PortalViewModel",
        tabMenu: new cb.model.SimpleModel(),
        tabTop: new cb.model.SimpleModel(),
        funcslist: new cb.model.SimpleModel(),
        exitAction: new cb.model.SimpleModel(),
        menuTiles: new cb.model.SimpleModel(),
        organizations: new cb.model.SimpleModel({ "dataValueField": "code", "dataTextField": "name" }),
        individualCenter: new cb.model.SimpleModel({
            dataSource: {
                userName: cb.rest.ApplicationContext.userName,
                integrate: "888",
                imgUrl: "/pc/images/menu/u32.png",
                CenterUrl: "common.home.IndividualCenterApp",
                MySettingUrl: 'common.home.MySettingApp'
            }
        })
    };
    this.setData(fields);
    this.setDirty(false);
    this.gettabTop().on('click', function (args) { PortalViewModel_Extend.tabTopClick(this.getParent(), args); });
    this.getfuncslist().on("click", function (args) { PortalViewModel_Extend.funcsListClick(this.getParent(), args); });
    this.getindividualCenter().on('exitAction', function (args) { PortalViewModel_Extend.exitActionClick(this.getParent(), args); });
    this.getorganizations().on('afterchange', function (args) { PortalViewModel_Extend.organizationsChange(this.getParent(), args); });
    var proxyConfig = {
        logout: { url: "upservices/com.yonyou.u8.framework.server.core.U8UAPServiceFacade/UAP/logout", method: "GET" },
        GetOrgs: { url: "classes/Org/UAP/GetPermissionOrgs4User", method: "Get" }
        //GetMsg: { url: "classes/Message/UAP/QueryMessage", method: "Post" },
        //GetSchedule: { url: "classes/General/tt.Schedule/QueryByEntity", method: "Post" }
        //GetScheduleSolution: { url: "classes/General/tt.Schedule/LoadSchemeList", method: "Get" },
        //GetSchedules: { url: "classes/General/Shedule/QueryByWhereSql", method: "Post" }
    };
    this.setProxy(proxyConfig);

    this.initData();
    cb.route.register("home", this.initData, this);
};
PortalViewModel.prototype.initData = function () {
    PortalViewModel_Extend.doAction("init_Extend", this);
};