
var BussLogManageViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "BussLogManageViewModel");
    this.init();
};
BussLogManageViewModel.prototype = new cb.model.ContainerModel();
BussLogManageViewModel.prototype.constructor = BussLogManageViewModel;

BussLogManageViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "BussLogManageViewModel",
		Symbol: "sysmanager.BussLogManage",
		expandAction: new cb.model.SimpleModel(),
		BussLog: new cb.model.Model3D({
		    hasSelCol: false,
		    height: 530,
		    title: "日志", ctrlType: "DataGrid", Columns: {
		    pk_user:{title:"用户",ctrlType:"TextBox",owner:""},
			client:{title:"客户端IP",ctrlType:"TextBox",owner:""},
			pk_operation:{title:"操作名称",ctrlType:"TextBox",owner:""},
			busiobjcode:{title:"业务对象编码",ctrlType:"TextBox",owner:""},
			busiobjname:{title:"业务对象名称",ctrlType:"TextBox",owner:""},
			orgname:{title:"业务对象所属组织",ctrlType:"TextBox",owner:""},
			logdate:{title:"操作日期",ctrlType:"TextBox",owner:""}
			//username:{title:"真实姓名",ctrlType:"TextBox",owner:"LogManageDetail 日志"},
			//productmodule:{title:"产品模块",ctrlType:"TextBox",owner:"LogManageDetail 日志"},
		}}),
		searchAction: new cb.model.SimpleModel({ title: "查询", ctrlType: "Button", owner: "Toolbar 功能" }),
		ZhangSet : new cb.model.SimpleModel({dataValueField:"code"}),
    };
    this.setData(fields);
    this.setDirty(false);

    //事件注册---需要整理，框架需要变动
    this.getsearchAction().on("click", function (args) { BussLogManageViewModel_Extend.searchAction(this.getParent(), args); });

	var proxyConfig = {
		GetMenu: { url: "upservices/up.itf.uap.sysmng.service.ISystemManageService/UAP/getBusilogs", method: "Post" , mask:true},
	    GetApplicationMenus:{url: "upservices/up.itf.uap.sysmng.service.ISystemManageService/UAP/getBusiCenterVOs", method: "Post" , mask:true},
	};
	this.setProxy(proxyConfig);

	this.initData();
};

BussLogManageViewModel.prototype.initData = function () {
	BussLogManageViewModel_Extend.doAction("init_Extend", this);
};
