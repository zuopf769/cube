
var LogManageViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "LogManageViewModel");
    this.init();
};
LogManageViewModel.prototype = new cb.model.ContainerModel();
LogManageViewModel.prototype.constructor = LogManageViewModel;

LogManageViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "LogManageViewModel",
		Symbol: "sysmanager.LogManage",
		expandAction: new cb.model.SimpleModel(),
		logManages: new cb.model.Model3D({
		    hasSelCol: false,
		    height: 530,
            dsMode:'local',readOnly:true,
            title: "日志", ctrlType: "KendoGrid", Columns: {
            user_name:{title:"用户名称",ctrlType:"TextBox",owner:"LogManageDetail 日志"},
            ip:{title:"客户端IP",ctrlType:"TextBox",owner:"LogManageDetail 日志"},
            buttoncode:{title:"动作编码",ctrlType:"TextBox",owner:"LogManageDetail 日志"},
            buttonname:{title:"动作名称",ctrlType:"TextBox",owner:"LogManageDetail 日志"},
            funcname:{title:"功能节点名称",ctrlType:"TextBox",owner:"LogManageDetail 日志"},
			logdate:{title:"操作日期",ctrlType:"TextBox",owner:"LogManageDetail 日志"},
			logtime: { title: "操作时间", ctrlType: "TextBox", owner: "LogManageDetail 日志" },
		}}),
		deleteAction:new cb.model.SimpleModel({title:"删除",ctrlType:"Button",owner:"Toolbar 功能"}),
		printAction:new cb.model.SimpleModel({title:"打印",ctrlType:"Button",owner:"Toolbar 功能"}),
		outputAction:new cb.model.SimpleModel({title:"输出",ctrlType:"Button",owner:"Toolbar 功能"}),
		filterAction:new cb.model.SimpleModel({title:"过滤",ctrlType:"Button",owner:"Toolbar 功能"}),
		combobox: new cb.model.SimpleModel({
		    title: "数据源", ctrlType: "ComboBox", owner: "Toolbar 功能", defaultValue: "-1",
		    enable: false, dataValueField:"code"
		}),
		searchAction: new cb.model.SimpleModel({ title: "查询", ctrlType: "Button", owner: "Toolbar 功能" }),
    };
    this.setData(fields);
    this.setDirty(false);

    //事件注册---需要整理，框架需要变动
	this.getsearchAction().on("click", function () { LogManageViewModel_Extend.searchAction(this.getParent()); });


	var proxyConfig = {
	    GetApplicationMenus:{url: "upservices/up.itf.uap.sysmng.service.ISystemManageService/UAP/getBusiCenterVOs", method: "Post", mask:true},
	};
	this.setProxy(proxyConfig);

	this.initData();
};

LogManageViewModel.prototype.initData = function () {
	LogManageViewModel_Extend.doAction("init_Extend", this);
};
