var ReferTableViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "ReferTableViewModel");
    this.init();
};
ReferTableViewModel.prototype = new cb.model.ContainerModel();
ReferTableViewModel.prototype.constructor = ReferTableViewModel;

ReferTableViewModel.prototype.init = function () {
	var fields = {
        ViewModelName: "ReferTableViewModel",
        Symbol: "UAP",
        CloseAction: new cb.model.SimpleModel(),        
        SortAction: new cb.model.SimpleModel(),
        RefreshAction: new cb.model.SimpleModel(),
        SetAction: new cb.model.SimpleModel(),
        Grid: new cb.model.Model3D({ ReadOnly: true, "Mode":"Remote", "mode": "archives" }),
        SubmitAction: new cb.model.SimpleModel(),        
        CancelAction: new cb.model.SimpleModel(),     
        //TablePageSize: 10,       
        SearchAction: new cb.model.SimpleModel(), //搜索  
        title: new cb.model.SimpleModel(),
        Search: new cb.model.SimpleModel(),
    };
    this.setData(fields);
    this.setDirty(false);

    this.getCloseAction().on("click", function (args) { ReferTable_Extend.closeAction(this.getParent(), args); });

    this.getSortAction().on("click", function (args) { ReferTable_Extend.SortAction(this.getParent(), args); });
    this.getRefreshAction().on("click", function () { ReferTable_Extend.refreshAction(this.getParent()); });
    this.getSetAction().on("click", function () { ReferTable_Extend.setAction(this.getParent()); });
    this.getSubmitAction().on("click", function (args) { ReferTable_Extend.submitAction(this.getParent(), args); });
    this.getCancelAction().on("click", function () { ReferTable_Extend.cancelAction(this.getParent()); });
   
    this.getSearchAction().on("search", function (args) { ReferTable_Extend.searchAction(this.getParent(), args); });

	this.getGrid().on("dblclickrow", function (args) {
        if (ReferTable_Extend.onDblClickRow)
            ReferTable_Extend.onDblClickRow(this.getParent(), args);
    });
    this.getSearch().on("search", function (data) { ReferTable_Extend.searchClick(this.getParent(), data) });

    //客户端代理
    var proxyConfig = {
        saveColumn: { url: "classes/General/u8column/ColumnSaveDifferent", method: "Post" },
        //saveColumn: { url: "classes/General/u8column/ColumnSave", method: "Post" },
        //LoadMD: { url: "logics.ReferBP?method=read", method: "GET" },
        //load: { url: "u8services/classes/UAP/u8.pubitf.uap.ref.common.IReferRunTimeService?method=getRefer&dataType=u8.vo.uap.ref.ReferRequestInfoVO", method: "POST" },
        load: { url: "classes/Ref/UAP/getRefer", method: "Post" },
        //获取参照携带
        //loadCarrier: { url: "u8services/classes/UAP/com.yonyou.u8.framework.server.refer.ReferService?method=GetRefCarrier&dataType=com.yonyou.u8.framework.server.refer.carrier.ReferCarrierInfoVO", method: "POST" }
        loadCarrier: { url: "classes/Ref/UAP/GetRefCarry", method: "POST" }
    };
    this.setProxy(proxyConfig);

    this.initData();
};

ReferTableViewModel.prototype.initData = function () {
    ReferTable_Extend.doAction("init_Extend", this);
    //this.refer_extend = new Refer_Extend();
    //this.refer_extend.doAction("init_Extend", this);
};