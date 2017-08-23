/// <reference path="../../common/js/Cube.js" />
/// <reference path="customerListApp_Extend.js" />
var customerListViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "customerListViewModel");
    this.init();
};
customerListViewModel.prototype = new cb.model.ContainerModel();
customerListViewModel.prototype.constructor = customerListViewModel;

customerListViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "customerListViewModel",
        Symbol: "u8.customer",
        listMenu: new cb.model.SimpleModel(),
        menuAction: new cb.model.SimpleModel({model:"no-text"}),
        cardAction: new cb.model.SimpleModel({model:"no-text"}),
        queryScheme: new cb.model.SimpleModel(),
        searchAction: new cb.model.SimpleModel(),
        queryAction: new cb.model.SimpleModel({model:"no-text"}),
        expandAction: new cb.model.SimpleModel(),
        timeLine: new cb.model.SimpleModel(),
        leftToolbar: new cb.model.SimpleModel(),
        rightToolbar: new cb.model.SimpleModel(),
		customers:new cb.model.Model3D({title:"客户集合",ctrlType:"DataGrid",owner:"customerList 客户列表",Columns:{
			ts:{title:"时间戳",ctrlType:"DateTimeBox",alwaysReadOnly:true,visible:false,owner:"customer 客户"},
			dr:{title:"删除标记",ctrlType:"CheckBox",alwaysReadOnly:true,visible:false,owner:"customer 客户"},
			ccuscode_pk:{title:"客户PK",length:20,nullable:false,ctrlType:"TextBox",key:true,visible:false,owner:"customer 客户"},
			code:{title:"客户编码",length:50,ctrlType:"TextBox",owner:"customer 客户"},
			name:{title:"客户名称",length:50,ctrlType:"TextBox",owner:"customer 客户"},
			cscode:{title:"客户分类编码",length:20,refKey:"pk_customerclass",refCode:"code",refName:"name",ctrlType:"Refer",refId:"customerclass",owner:"customer 客户"},
			maketime:{title:"制单时间",nullable:false,ctrlType:"DateTimeBox",owner:"customer 客户"},
			pk_group:{title:"集团",length:20,nullable:false,refKey:"pk_group",refCode:"code",refName:"name",ctrlType:"Refer",refId:"600001",owner:"customer 客户"},
			pk_org:{title:"所属权限组",length:20,refKey:"pk_org",refCode:"code",refName:"name",ctrlType:"Refer",refId:"600015",owner:"customer 客户"},
			pk_org_v:{title:"组织版本",length:20,refKey:"pk_vid",refCode:"code",refName:"name",ctrlType:"Refer",refId:"600700",owner:"customer 客户"},
			creator:{title:"创建人",length:20,refKey:"cuserid",refCode:"user_code",refName:"user_name",ctrlType:"Refer",refId:"600026",owner:"customer 客户"},
			creationtime:{title:"创建时间",ctrlType:"DateTimeBox",owner:"customer 客户"},
			modifier:{title:"修改人",length:20,refKey:"cuserid",refCode:"user_code",refName:"user_name",ctrlType:"Refer",refId:"600026",owner:"customer 客户"},
			modifiedtime:{title:"修改时间",ctrlType:"DateTimeBox",owner:"customer 客户"},
			ccusabbname:{title:"客户简称",length:50,ctrlType:"TextBox",owner:"customer 客户"},
			ccusmnemcode:{title:"助记码",length:50,ctrlType:"TextBox",owner:"customer 客户"},
			bcusdomestic:{title:"国内",length:50,ctrlType:"TextBox",owner:"customer 客户"},
			bcusoverseas:{title:"国外",length:50,ctrlType:"TextBox",owner:"customer 客户"},
			cdccode:{title:"地区编码",refModelName:"国家地区",length:20,refKey:"pk_country",refCode:"code",refName:"name",ctrlType:"Refer",refId:"600203",owner:"customer 客户"},
			ccusaddress:{title:"地址",length:50,ctrlType:"TextBox",owner:"customer 客户"},
			ccuspostcode:{title:"邮政编码",length:50,ctrlType:"TextBox",owner:"customer 客户"},
			ccusregcode:{title:"纳税人登记号",length:50,ctrlType:"TextBox",owner:"customer 客户"},
			dcusdevdate:{title:"发展日期",ctrlType:"DateTimeBox",owner:"customer 客户"},
			ccuslperson:{title:"法人",length:50,ctrlType:"TextBox",owner:"customer 客户"},
			ccusemail:{title:"Email地址",length:50,ctrlType:"TextBox",owner:"customer 客户"},
			ccusoaddress:{title:"发货地址",length:50,ctrlType:"TextBox",owner:"customer 客户"},
			ccusperson:{title:"联系人",length:50,ctrlType:"TextBox",owner:"customer 客户"},
			ccusphone:{title:"电话",length:50,ctrlType:"TextBox",owner:"customer 客户"},
			ccusfax:{title:"传真",length:50,ctrlType:"TextBox",owner:"customer 客户"},
			ccushand:{title:"手机",length:50,ctrlType:"TextBox",owner:"customer 客户"},
			ccuspperson:{title:"专营业务员编码",length:20,refKey:"person_pk",refCode:"code",refName:"name",ctrlType:"Refer",refId:"person",owner:"customer 客户"},
			icusdisrate:{title:"扣率",scale:8,ctrlType:"NumberBox",precision:28,owner:"customer 客户"},
			ccusotype:{title:"发运方式编码",length:50,ctrlType:"TextBox",owner:"customer 客户"},
			ccuswhcode:{title:"发货仓库编码",length:20,refKey:"wh_pk",refCode:"code",refName:"name",ctrlType:"Refer",refId:"warehouse",owner:"customer 客户"},
			cdepname:{title:"分管部门名称",length:20,refKey:"pk_dept",refCode:"code",refName:"name",ctrlType:"Refer",refId:"600905",owner:"customer 客户"},
			dlastdate:{title:"最后交易日期",ctrlType:"DateTimeBox",owner:"customer 客户"},
			ilastmoney:{title:"最后交易金额",scale:8,ctrlType:"NumberBox",precision:28,owner:"customer 客户"},
			denddate:{title:"停用日期",ctrlType:"DateTimeBox",owner:"customer 客户"},
			dcuscreatedatetime:{title:"建档日期",ctrlType:"DateTimeBox",owner:"customer 客户"},
			ccreateperson:{title:"建档人",length:20,refKey:"cuserid",refCode:"user_code",refName:"user_name",ctrlType:"Refer",refId:"600026",owner:"customer 客户"},
			cmodifyperson:{title:"变更人",length:20,refKey:"cuserid",refCode:"user_code",refName:"user_name",ctrlType:"Refer",refId:"600026",owner:"customer 客户"},
			dmodifydate:{title:"变更日期",ctrlType:"DateTimeBox",owner:"customer 客户"},
			cmemo:{title:"备注",length:50,ctrlType:"TextBox",owner:"customer 客户"},
			def1:{title:"自定义项1",length:100,ctrlType:"TextBox",visible:false,owner:"customer 客户"},
			def2:{title:"自定义项2",length:100,ctrlType:"TextBox",visible:false,owner:"customer 客户"},
			def3:{title:"自定义项3",length:100,ctrlType:"TextBox",visible:false,owner:"customer 客户"},
			def4:{title:"自定义项4",length:100,ctrlType:"TextBox",visible:false,owner:"customer 客户"},
			def5:{title:"自定义项5",length:100,ctrlType:"TextBox",visible:false,owner:"customer 客户"},
			def6:{title:"自定义项6",length:100,ctrlType:"TextBox",visible:false,owner:"customer 客户"},
			def7:{title:"自定义项7",length:100,ctrlType:"TextBox",visible:false,owner:"customer 客户"},
			def8:{title:"自定义项8",length:100,ctrlType:"TextBox",visible:false,owner:"customer 客户"},
			def9:{title:"自定义项9",length:100,ctrlType:"TextBox",visible:false,owner:"customer 客户"},
			def10:{title:"自定义项10",length:100,ctrlType:"TextBox",visible:false,owner:"customer 客户"},
			def11:{title:"自定义项11",length:100,ctrlType:"TextBox",visible:false,owner:"customer 客户"},
			def12:{title:"自定义项12",length:100,ctrlType:"TextBox",visible:false,owner:"customer 客户"},
			def13:{title:"自定义项13",length:100,ctrlType:"TextBox",visible:false,owner:"customer 客户"},
			def14:{title:"自定义项14",length:100,ctrlType:"TextBox",visible:false,owner:"customer 客户"},
			def15:{title:"自定义项15",length:100,ctrlType:"TextBox",visible:false,owner:"customer 客户"},
			def16:{title:"自定义项16",length:100,ctrlType:"TextBox",visible:false,owner:"customer 客户"}
		}}),
		addAction:new cb.model.SimpleModel({title:"增加",ctrlType:"Button",owner:"Toolbar 功能"}),
		editAction:new cb.model.SimpleModel({title:"修改",ctrlType:"Button",owner:"Toolbar 功能"}),
		batchAction:new cb.model.SimpleModel({title:"批改",ctrlType:"Button",owner:"Toolbar 功能"}),
		deleteAction:new cb.model.SimpleModel({title:"删除",ctrlType:"Button",owner:"Toolbar 功能"}),
		mergeAction:new cb.model.SimpleModel({title:"并户",ctrlType:"Button",owner:"Toolbar 功能"}),
		creditAction:new cb.model.SimpleModel({title:"信用",ctrlType:"Button",owner:"Toolbar 功能"}),
		checkAction:new cb.model.SimpleModel({title:"查重",ctrlType:"Button",owner:"Toolbar 功能"}),
		printAction:new cb.model.SimpleModel({title:"打印",ctrlType:"Button",owner:"Toolbar 功能"}),
		outputAction:new cb.model.SimpleModel({title:"输出",ctrlType:"Button",owner:"Toolbar 功能"}),
		bizAction:new cb.model.SimpleModel({title:"业务操作",ctrlType:"Button",owner:"Toolbar 功能"}),
		filterAction:new cb.model.SimpleModel({title:"过滤",ctrlType:"Button",owner:"Toolbar 功能"}),
		refreshAction:new cb.model.SimpleModel({title:"刷新",ctrlType:"Button",owner:"Toolbar 功能"}),
		setAction:new cb.model.SimpleModel({title:"设置",ctrlType:"Button",owner:"Toolbar 功能"})        
    };
    this.setData(fields);
    this.setDirty(false);

    //事件注册---需要整理，框架需要变动
    this.getlistMenu().on("click", function (args) { customerListViewModel_Extend.menuItemClick(this.getParent(), args); });
    this.getmenuAction().on("click", function () { customerListViewModel_Extend.menuAction(this.getParent()); });
    this.getcardAction().on("click", function () { customerListViewModel_Extend.cardAction(this.getParent()); });
    this.getqueryScheme().on("click", function (args) { customerListViewModel_Extend.queryScheme(this.getParent(), args); });
    this.getsearchAction().on("search", function (args) { customerListViewModel_Extend.searchAction(this.getParent(), args); });
    this.getqueryAction().on("click", function () { customerListViewModel_Extend.queryAction(this.getParent()); });
    this.getexpandAction().on("click", function () { customerListViewModel_Extend.expandAction(this.getParent()); });
    this.gettimeLine().on("click", function (args) { customerListViewModel_Extend.timeItemClick(this.getParent(), args) });

    this.on("click", function (args) { customerListViewModel_Extend.qryAction(this.getParent(), args); });
    this.getcustomers().on("clickrow", function (args) {
		if (customerListViewModel_Extend.itemClick)
			customerListViewModel_Extend.itemClick(this.getParent(), args);
	});
    this.getcustomers().on("dblclickrow", function (args) {
		if (args == null) args = {};
		if (typeof args !== "object") args = { inputData: args };
		args.cancel = false;
		var viewModel = this.getParent();
		args.commonCRUD = new cb.data.commonCRUD(viewModel);
		if (customerListViewModel_Extend.activeRowClick)
			customerListViewModel_Extend.activeRowClick(viewModel, args);
		if (args.cancel) return;
		args.commonCRUD.ActiveRowClick();
	});
    this.getcustomers().on("changePage", function (args) {
		if (customerListViewModel_Extend.changePage)
			customerListViewModel_Extend.changePage(this.getParent(), args);
	});
    this.getaddAction().on("click", function (args) {
		if (customerListViewModel_Extend.addAction)
			customerListViewModel_Extend.addAction(this.getParent(), args);
	});
    this.geteditAction().on("click", function (args) {
		if (customerListViewModel_Extend.editAction)
			customerListViewModel_Extend.editAction(this.getParent(), args);
	});
    this.getbatchAction().on("click", function (args) {
		if (customerListViewModel_Extend.batchAction)
			customerListViewModel_Extend.batchAction(this.getParent(), args);
	});
    this.getdeleteAction().on("click", function (args) {
		if (args == null) args = {};
		if (typeof args !== "object") args = { inputData: args };
		args.cancel = false;
		var viewModel = this.getParent();
		args.commonCRUD = new cb.data.commonCRUD(viewModel);
		if (customerListViewModel_Extend.deleteAction)
			customerListViewModel_Extend.deleteAction(viewModel, args);
		if (args.cancel) return;
		args.commonCRUD.BatchDelete();
	});
    this.getmergeAction().on("click", function (args) {
		if (customerListViewModel_Extend.mergeAction)
			customerListViewModel_Extend.mergeAction(this.getParent(), args);
	});
    this.getcreditAction().on("click", function (args) {
		if (customerListViewModel_Extend.creditAction)
			customerListViewModel_Extend.creditAction(this.getParent(), args);
	});
    this.getcheckAction().on("click", function (args) {
		if (customerListViewModel_Extend.checkAction)
			customerListViewModel_Extend.checkAction(this.getParent(), args);
	});
    this.getprintAction().on("click", function (args) {
		if (customerListViewModel_Extend.printAction)
			customerListViewModel_Extend.printAction(this.getParent(), args);
	});
    this.getoutputAction().on("click", function (args) {
		if (customerListViewModel_Extend.outputAction)
			customerListViewModel_Extend.outputAction(this.getParent(), args);
	});
    this.getbizAction().on("click", function (args) {
		if (customerListViewModel_Extend.bizAction)
			customerListViewModel_Extend.bizAction(this.getParent(), args);
	});
    this.getfilterAction().on("click", function (args) {
		if (customerListViewModel_Extend.filterAction)
			customerListViewModel_Extend.filterAction(this.getParent(), args);
	});
    this.getrefreshAction().on("click", function (args) {
		if (customerListViewModel_Extend.refreshAction)
			customerListViewModel_Extend.refreshAction(this.getParent(), args);
	});
    this.getsetAction().on("click", function (args) {
		if (customerListViewModel_Extend.setAction)
			customerListViewModel_Extend.setAction(this.getParent(), args);
	});

    var proxyConfig = {
        GetMenu: { url: "u8services/classes/UAP/com.yonyou.u8.framework.server.service.base.MenuService?method=GetMenu", method: "Get" }
    };
    this.setProxy(proxyConfig);
    
    var model3d = this.getModel3D();
	model3d.set("Mode", "Remote");
    model3d.set("ReadOnly", true);
    model3d.set("mode", "archives");
    model3d.setPageSize(15);

    this.initData();
};

customerListViewModel.prototype.initData = function () {
    customerListViewModel_Extend.doAction("init_Extend", this);
};
