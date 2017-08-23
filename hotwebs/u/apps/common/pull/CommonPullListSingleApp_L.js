/// <reference path="../../../common/js/Cube.js" />
var CommonPullListSingleViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "CommonPullListSingleViewModel");
    this.init();
};
CommonPullListSingleViewModel.prototype = new cb.model.ContainerModel();
CommonPullListSingleViewModel.prototype.constructor = CommonPullListSingleViewModel;

CommonPullListSingleViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "CommonPullListSingleViewModel",
        Symbol: "UAP",
        closeAction: new cb.model.SimpleModel(),
        queryScheme: new cb.model.SimpleModel(),
        //expandAction: new cb.model.SimpleModel(),
        totalTableAction: new cb.model.SimpleModel(),
        partTableAction: new cb.model.SimpleModel(),
        setAction: new cb.model.SimpleModel(),
        //addschemeAction: new cb.model.SimpleModel(), // +的触发事件
        submitAction: new cb.model.SimpleModel(),
        cancelAction: new cb.model.SimpleModel(),
        tableSwitch: new cb.model.SimpleModel({
            isNeedCollect: false, dataSource: [
						{ content: "totalTable" },
						{ content: "partTable", isSelected: true }
            ]
        }),
        totaltable: new cb.model.Model3D({
            title: "平", ctrlType: "DataGrid", dsMode: "false", ReadOnly: true, height: 490,
            //Columns: {
            //    customer: { title: "客户名称", ctrlType: "TextBox" },
            //    saler: { title: "销售员", ctrlType: "TextBox" },
            //    pkorg: { title: "部门", ctrlType: "TextBox" },
            //    vbillno: { title: "订单编码", ctrlType: "TextBox" },
            //    billdate: { title: "订单日期", ctrlType: "TextBox" },
            //    approvestatus: { title: "审批状态", ctrlType: "TextBox" }
            //}
        }),
        partheadtable: new cb.model.Model3D({
            title: "表头", ctrlType: "DataGrid", dsMode: "false", ReadOnly: true, height: 200,
            //Columns: {
            //    customer: { title: "客户名称", ctrlType: "TextBox" },
            //    saler: { title: "销售员", ctrlType: "TextBox" },
            //    pkorg: { title: "部门", ctrlType: "TextBox" },
            //    vbillno: { title: "订单编码", ctrlType: "TextBox" },
            //    billdate: { title: "订单日期", ctrlType: "TextBox" },
            //    approvestatus: { title: "审批状态", ctrlType: "TextBox" }
            //}
        }),
        partbodytable: new cb.model.Model3D({
            title: "表体", ctrlType: "DataGrid", dsMode: "false", ReadOnly: true, height: 300,
            //Columns: {
            //    id: { title: "订单编号", ctrlType: "TextBox" },
            //    taxamount: { title: "订单总额", ctrlType: "TextBox" },
            //    vbillno: { title: "订单编码", ctrlType: "TextBox" },
            //    orderdetail: { title: "订单日期", ctrlType: "TextBox" },
            //    orderty: { title: "审批状态", ctrlType: "TextBox" }
            //}
        }),
        sumList: new cb.model.SimpleModel()
    };
    this.setData(fields);
    this.setDirty(false);

    //var proxyconfig = {
    //    //获取栏目
    //    GetColumnByColCode: { url: "classes/General/u8column/QueryColumnByCode", method: "Get" }
    //};
    //this.setProxy(proxyconfig);

    //事件注册---需要整理，框架需要变动
    this.getcloseAction().on("click", function (args) { CommonPullListViewModel_Extend.closeAction(this.getParent(), args); });
    this.getqueryScheme().on("click", function (args) { CommonPullListViewModel_Extend.queryScheme(this.getParent(), args); });
    //this.getexpandAction().on("click", function () { CommonPullListViewModel_Extend.expandAction(this.getParent()); });
    this.gettableSwitch().on("click", function (args) { CommonPullListViewModel_Extend.tableSwitch(this.getParent(), args); });
    this.getsetAction().on("click", function () { CommonPullListViewModel_Extend.setAction(this.getParent()); });
    this.getsubmitAction().on("click", function (args) { CommonPullListViewModel_Extend.submitAction(this.getParent(), args) });
    this.getcancelAction().on("click", function (args) { CommonPullListViewModel_Extend.cancelAction(this.getParent(), args) });
    this.gettotaltable().on("changePage", function (args) { CommonPullListViewModel_Extend.totalchangePage(this.getParent(), args); });
    this.getpartheadtable().on("afterSelect", function (args) { CommonPullListViewModel_Extend.hitemClick(this.getParent(), args); });
    this.getpartheadtable().on("afterunSelect", function (args) { CommonPullListViewModel_Extend.unHitemClick(this.getParent(), args); });
    this.getpartheadtable().on("afterSelectAll", function (args) { CommonPullListViewModel_Extend.hitemAllClick(this.getParent(), args); });
    this.getpartheadtable().on("afterunSelectAll", function (args) { CommonPullListViewModel_Extend.unHitemAllClick(this.getParent(), args); });
    this.getpartheadtable().on("changePage", function (args) { CommonPullListViewModel_Extend.partheadchangePage(this.getParent(), args); });
    this.getpartbodytable().on("changePage", function (args) { CommonPullListViewModel_Extend.partbodychangePage(this.getParent(), args); });
    this.getpartbodytable().on("afterSelect", function (args) { CommonPullListViewModel_Extend.bitemClick(this.getParent(), args); });
    this.getpartbodytable().on("afterunSelect", function (args) { CommonPullListViewModel_Extend.unBitemClick(this.getParent(), args); });
    //this.getaddschemeAction().on('click', function (args) { CommonPullListViewModel_Extend.addschemeAction(this.getParent()); });

    var proxyConfig = {
        GetMenu: { url: "u8services/classes/UAP/com.yonyou.u8.framework.server.service.base.MenuService?method=GetMenu", method: "Get" },
        //获取栏目
        GetColumnByColCode: { url: "classes/General/u8column/QueryColumnByCode", method: "Get" },
        //批量生单服务
        PushSave: { url: "classes/General/UAP/PushSave", method: "Post" },
        //拍平服务
        //http://127.0.0.1:8090/classes/General/UAP/buildVOPushSave?token=***
        BuildVOPushSave: { url: "classes/General/UAP/buildVOPushSave", method: "Post" },
        //classes/General/UAP/buildVOAndPull
        //单据拍平服务
        BuildVOAndPull: { url: "classes/General/UAP/buildVOAndPull", method: "Post" }
    };
    this.setProxy(proxyConfig);

    this.initData();
};

CommonPullListSingleViewModel.prototype.initData = function () {
    CommonPullListViewModel_Extend.doAction("init_Extend", this);
};
