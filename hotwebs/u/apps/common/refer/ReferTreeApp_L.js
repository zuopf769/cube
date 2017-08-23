var ReferTreeViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "ReferTreeViewModel");
    this.init();
};
ReferTreeViewModel.prototype = new cb.model.ContainerModel();
ReferTreeViewModel.prototype.constructor = ReferTreeViewModel;

ReferTreeViewModel.prototype.init = function () {
    var fields = {
        Symbol: "UAP",
        ViewModelName: "ReferTreeViewModel",
        CloseAction: new cb.model.SimpleModel(),       
        SubmitAction: new cb.model.SimpleModel(),        
        CancelAction: new cb.model.SimpleModel(),
        Catalog: new cb.model.SimpleModel(),
        TreePageSize: 10
    };
    this.setData(fields);
    this.setDirty(false);

    this.getCloseAction().on("click", function (args) { ReferTree_Extend.closeAction(this.getParent(), args); });
    this.getSubmitAction().on("click", function (args) { ReferTree_Extend.submitAction(this.getParent(), args); });
    this.getCancelAction().on("click", function () { ReferTree_Extend.cancelAction(this.getParent()); });
   
    this.getCatalog().on("beforeExpand", function (data) { ReferTree_Extend.beforeExpand(this.getParent(), data) });
    //this.getCatalog().on("click", function (data) { ReferTree_Extend.catalogClick(this.getParent(), data) });
    this.getCatalog().on("moreClick", function (data) { ReferTree_Extend.catalogMoreClick(this.getParent(), data) });
    //客户端代理
    var proxyConfig = {
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

ReferTreeViewModel.prototype.initData = function () {
    ReferTree_Extend.doAction("init_Extend", this);    
};