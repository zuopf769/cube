var CommonHomeViewModel_Extend = {
    doAction: function (name, viewModel) {
        if (this[name]) this[name](viewModel);
    },
    init_Extend: function (viewModel) {
		 var params = cb.route.getViewPartParams(viewModel);
        var self = this;
        params.parentViewModel.on("afterTabMenuClick", function () {
			self.func(viewModel,self)
        });
        this.func(viewModel,this)
    },
    func: function (viewModel,self) {
        self.initMessage(viewModel);
        self.initMenu(viewModel);
        cb.route.loadViewPart(viewModel, cb.route.CommonAppEnum.MyTask, cb.route.ViewPartType.MyTask);
        cb.route.loadViewPart(viewModel, cb.route.CommonAppEnum.MySchedule, cb.route.ViewPartType.MySchedule);

        var para = cb.route.getViewPartParams(viewModel);
        if (para.parentViewModel) {
            para.parentViewModel.on("commonFunctionAdd", function (args) {
                var listMenu = viewModel.getlistMenu();
                var data = { "currentPageData": [args], "mode": "append" };
                listMenu.set("PageRows", data);
            });
        }
    },

    initMessage: function (viewModel) {
        viewModel.getProxy().GetMessages(function (success, fail) {
            if (fail) {
                //alert("获取菜单数据失败");
                return;
            }
            if (success) {
                if (!isNaN(success.NOReadMessage)) {
                    $('.NOReadMessage').html(success.NOReadMessage);
                }
                if (!isNaN(success.NOReadMessage)) {
                    $('.WaitApprove').html(success.WaitApprove);
                }
                if (!isNaN(success.NOReadMessage)) {
                    $('.WaitSchedule').html(success.WaitSchedule);
                }
            }
            //listMenu.setDataSource(success);
        });
    },
    menuItemClick: function (viewModel, args) {
        if (!args || !args.type || !args.data || !args.data.url) return;
        var appParams = cb.route.getAppParamsFromMenu(args.data);
        if (!appParams.appId) {
            //location.href = cb.route.getPageUrl(args.data.url);
            //return;
            appParams.appId = args.data.url;
            appParams.params.appIdType = "special";
        }
        // appParams.params.isOpenNew = true;

        cb.route.loadTabViewPart(viewModel, appParams.appId, appParams.params);
    },
    initMenu: function (viewModel) {
        var listMenu = viewModel.getlistMenu();
        listMenu.set("mode", "tiles");
        viewModel.getProxy().GetMenu(function (success, fail) {
            if (fail) {
                alert("获取菜单数据失败");
                return;
            }
            listMenu.setDataSource(success);
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
    ///<param name="viewModel" type="PortalViewModel">viewModel类型为PortalViewModel</param>

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
    };

    viewModel.getProxy().GetSchedule(odata, function (args) {
        if (args && args.data)
            viewModel.getschedule().set('schedule', args.data);
    });
},

initIMmsg: function (viewModel) {
    //continue to do
}
};