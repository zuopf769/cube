
var LoginLogManageViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "LoginLogManageViewModel");
    this.init();
};
LoginLogManageViewModel.prototype = new cb.model.ContainerModel();
LoginLogManageViewModel.prototype.constructor = LoginLogManageViewModel;

LoginLogManageViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "LoginLogManageViewModel",
		Symbol: "sysmanager.LoginLogManage",
       // ccuswhcode: new cb.model.SimpleModel(),
		expandAction: new cb.model.SimpleModel(),
		loginlogManages: new cb.model.Model3D({
            height:530,
		    hasSelCol: false,
		    dsMode: 'local', readOnly: true,
		    title: "日志", ctrlType: "KendoGrid", Columns: {
		        ip: { title: "客户端IP", ctrlType: "TextBox", owner: "LogManageDetail 日志" },
		        user_name: { title: "用户", ctrlType: "TextBox", owner: "LogManageDetail 日志" },
		        logdate: { title: "登录日期", ctrlType: "TextBox", owner: "LogManageDetail 日志" },
		        logtime: { title: "登录时间", ctrlType: "TextBox", owner: "LogManageDetail 日志" },
		        logoffdate: { title: "注销日期", ctrlType: "TextBox", owner: "LogManageDetail 日志" },
                logofftime: { title: "注销时间", ctrlType: "TextBox", owner: "LogManageDetail 日志" },
                entersystemresult: { 
                    title: "登录结果",ctrlType: "ComboBox", owner: "LogManageDetail 日志", 
                        values: [
                                { text: "成功", value: "0" },
                                { text: "失败", value: "1" }
                            ] },
                detail: { title: "详细信息", ctrlType: "TextBox", owner: "LogManageDetail 日志" }
		    }
		}),
		combobox: new cb.model.SimpleModel({
		    title: "数据源", ctrlType: "ComboBox", owner: "Toolbar 功能", defaultValue: "-1",
		    dataSource: [], dataValueField:"code"
		}),
		searchAction: new cb.model.SimpleModel({ title: "查询", ctrlType: "Button", owner: "Toolbar 功能" }),
    };
    this.setData(fields);
    this.setDirty(false);

    //事件注册---需要整理，框架需要变动
    this.getsearchAction().on("click", function () { LoginLogManageViewModel_Extend.searchAction(this.getParent()); });

    var proxyConfig = {
        GetMenu: { url: "upservices/up.itf.uap.sysmng.service.ISystemManageService/UAP/getComuterLoginLogs", method: "Post" , mask:true },
        //GetMenu2:{} 请求服务
        GetApplicationMenus: { url: "upservices/up.itf.uap.sysmng.service.ISystemManageService/UAP/getBusiCenterVOs", method: "Post" , mask:true },
    };
	this.setProxy(proxyConfig);

	this.initData();
};

LoginLogManageViewModel.prototype.initData = function () {
	LoginLogManageViewModel_Extend.doAction("init_Extend", this);
};
