/// <reference path="common/js/Cube.js" />
var HomePadViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "HomePadViewModel");
    this.init();
};
//
HomePadViewModel.prototype = new cb.model.ContainerModel();
HomePadViewModel.prototype.constructor = HomePadViewModel;

HomePadViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "HomePadViewModel",
        listTile: new cb.model.SimpleModel(),
        listMenu: new cb.model.SimpleModel(),
        msgTask: new cb.model.SimpleModel(),
        schedule: new cb.model.SimpleModel(),
        controlpages: new cb.model.SimpleModel(),
        settingMenu:new cb.model.SimpleModel()
    };
   
    this.setData(fields);
    this.setDirty(false);

    //this.getlistMenu2().on("click", function (args) { DeliveryViewModel_Extend.menuItem2Click(this.getParent(), args); });

    this.getlistTile().on("click", function (args) { HomePadViewModel_Extend.tileItemClick(this.getParent(), args); });
    this.getlistMenu().on("click", function (args) { HomePadViewModel_Extend.menuItemClick(this.getParent(), args); });
    this.getsettingMenu().on("click", function (args) { HomePadViewModel_Extend.settingMenuClick(this.getParent(), args); });
    var proxyConfig = {
        GetMenu: { url: "u8services/classes/UAP/com.yonyou.u8.framework.server.service.base.MenuService?method=GetMenu", method: "Get" },
        GetMsg: { url: "classes/Message/UAP/QueryMessage", method: "Post" },
        GetSchedule: { url: "classes/General/tt.Schedule/QueryByEntity", method: "Post" },
        //GetScheduleSolution: { url: "classes/General/tt.Schedule/LoadSchemeList", method: "Get" },
        //GetSchedules: { url: "classes/General/tt.Schedule/Query", method: "Post" }
    };
    this.setProxy(proxyConfig);

    HomePadViewModel_Extend.doAction("init_Extend", this);
};

var HomePadViewModel_Extend = {
    doAction: function (name, viewModel) {
        if (this[name]) this[name](viewModel);
    },
    loadMenu: function (viewModel, menu) {
        var appParams = cb.route.getAppParamsFromMenu(menu);
        if (!appParams.appId) {
            location.href = cb.route.getPageUrl(menu.url);
            return;
        }
        cb.route.loadTabViewPart(viewModel, appParams.appId, appParams.params);
    },
    tileItemClick: function (viewModel, args) {
        if (!args || !args.type || !args.data) return;
        $("[data-page=menu-part]").show();
        this.loadMenu(viewModel, args.data);
        viewModel.getlistMenu().set("selectedItem", args.data);
    },

    settingMenuClick:function(viewModel,args)
    {
         if(args=="scanAutoLgin"){
            cb.route.scanAutoLogin();
         }
         if(args=="logout"){
            cb.route.loginOut();
         }
         if(args=="changeHost"){
            cb.route.changeHost();
         }
    },
    menuItemClick: function (viewModel, args) {
        if (!args || !args.type || !args.data) return;
        if (args.data.appId == "homepage") {
            $("[data-page=menu-part]").hide();
            cb.route.loadTabViewPart(viewModel, args.data.appId);
        } else {
            $("[data-page=menu-part]").show();
            this.loadMenu(viewModel, args.data);
        }
    },

    init_Extend: function (viewModel) {
        var queryStringParent = new cb.util.queryString(location.search);
		if (queryStringParent.get('isSys')=="true") {
			   //proxyConfig.GetDomainMenu = "upservices/up.uap.base.org.SystemManageService/UAP/GetMenu"
		}else{
			 this.initMenu(viewModel);
			 cb.route.loadViewPart(viewModel, cb.route.CommonAppEnum.MyTask, cb.route.ViewPartType.MyTask);
			cb.route.loadViewPart(viewModel, cb.route.CommonAppEnum.MySchedule, cb.route.ViewPartType.MySchedule);
		}
        //this.initMsgTask(viewModel);
        //this.initSchedule(viewModel);
        //this.initSttingMenu(viewModel);
        //this.initSchedule(viewModel);
        //this.initIxiongdiMmsg(viewModel);
    },
    initSttingMenu:function(viewModel){
         if(typeof(ua) != "undefined")
        {
             
            if (viewModel.getsettingMenu) viewModel.getsettingMenu().setDataSource([{ "name": "pull", "value": "scanAutoLgin", "text": "扫描登录" },
                { "name": "pull", "value": "logout", "text": "注销" },
                { "name": "pull", "value": "changeHost", "text": "更换服务器" }]);
        }else
        {
            if (viewModel.getsettingMenu) viewModel.getsettingMenu().setDataSource([
                { "name": "pull", "value": "logout", "text": "注销" },]);
        } 
    },
    initMenu: function (viewModel) {
        var listTile = viewModel.getlistTile();
        listTile.set("mode", "tiles");

        var listMenu = viewModel.getlistMenu();
        listMenu.set("mode", "menus");
        var dataSource = [{ appId: "homepage"}];

        viewModel.getProxy().GetMenu(function (success, fail) {
            if (fail) {
                alert("获取菜单数据失败");
                return;
            }
            listTile.setDataSource(success);

            for (var i = 0, len = success.length; i < len; i++) {
                dataSource.push(success[i]);
            }
            listMenu.setDataSource(dataSource);

            $("[data-page=menu-part]").hide();
        });
    },

    initMsgTask: function (viewModel) {
        /// <param name="viewModel" type="HomePadViewModel">viewModel类型为HomePadViewModel</param>

        var odata = {
            "isDelete": "N",
            "destination": "",
            "ishandled": "",
            "receiver": "",
            "msgtype": "",
            "isread": "",
            "msgsourcetype": "",
            "sendtime": "2014-10-11 01:01:01",
            "displocation": ""
        };
        viewModel.getProxy().GetMsg(odata, function (args) {

            viewModel.getmsgTask().set('msg', {
                args: args
            });
        });
    },

    initSchedule: function (viewModel) {
        ///<param name="viewModel" type="HomePadViewModel">viewModel类型为HomePadViewModel</param>

        var today = new Date();
        var startDate;
        var endDate;
        var todays = today.toJSON().split('T');
        if (todays.length > 0)
            startDate = todays[0];

        endDate = startDate;

        var odata = {
            'userID': '1001ZZ1000000000LE39',
            'startDate': startDate,
            'endDate': endDate
        }

        viewModel.getProxy().GetSchedule(odata, function (args) {

            if (args && args.data)
                viewModel.getschedule().set('schedule', args.data);
        });
    },

    initIMmsg: function (viewModel) {
        //continue to do
    }

};