var ReferViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "ReferViewModel");
    this.init();
};
ReferViewModel.prototype = new cb.model.ContainerModel();
ReferViewModel.prototype.constructor = ReferViewModel;

ReferViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "ReferViewModel",
        Symbol: "UAP",
        CloseAction: new cb.model.SimpleModel(),        
        SortAction: new cb.model.SimpleModel(),
        RefreshAction: new cb.model.SimpleModel(),
        SetAction: new cb.model.SimpleModel(),
        Grid: new cb.model.Model3D({ ReadOnly: true, "Mode": "Remote", "mode": "archives" }),
        SubmitAction: new cb.model.SimpleModel(),        
        CancelAction: new cb.model.SimpleModel(),
        Catalog: new cb.model.SimpleModel(),
        TreePageSize: 10,
        TablePageSize: 10,
        Search:new cb.model.SimpleModel(),
        MenuAction: new cb.model.SimpleModel(), //展开树参照
        SearchAction: new cb.model.SimpleModel() //搜索       
    };
    this.setData(fields);
    this.setDirty(false);

    this.getCloseAction().on("click", function (args) { Refer_Extend.closeAction(this.getParent(), args); });
    

    this.getSortAction().on("click", function (args) { Refer_Extend.sortAction(this.getParent(), args); });
    this.getRefreshAction().on("click", function () { Refer_Extend.refreshAction(this.getParent()); });
    this.getSetAction().on("click", function () { Refer_Extend.setAction(this.getParent()); });
    this.getSubmitAction().on("click", function (args) { Refer_Extend.submitAction(this.getParent(), args); });
    this.getCancelAction().on("click", function () { Refer_Extend.cancelAction(this.getParent()); });

    this.getMenuAction().on("click", function () { Refer_Extend.menuAction(this.getParent()); });
    this.getSearchAction().on("search", function (args) { Refer_Extend.searchAction(this.getParent(), args); });
        

    this.getCatalog().on("beforeExpand", function (data) { Refer_Extend.beforeExpand(this.getParent(), data) });
    this.getCatalog().on("click", function (data) { Refer_Extend.catalogClick(this.getParent(), data) });
    this.getCatalog().on("moreClick", function (data) { Refer_Extend.catalogMoreClick(this.getParent(), data) });

    this.getSearch().on("search", function (data) { Refer_Extend.searchClick(this.getParent(), data) });

    this.getGrid().on("dblclickrow", function (args) {
        if (Refer_Extend.onDblClickRow)
            Refer_Extend.onDblClickRow(this.getParent(), args);
    });
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

ReferViewModel.prototype.initData = function () {
    Refer_Extend.doAction("init_Extend", this);
};