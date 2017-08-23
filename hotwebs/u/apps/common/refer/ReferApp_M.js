var ReferViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "ReferViewModel");
    this.init();
};
ReferViewModel.prototype = new cb.model.ContainerModel();
ReferViewModel.prototype.constructor = ReferViewModel;

ReferViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "ReferViewModel",
        AppId: "common.refer.Refer",
        menuAction: new cb.model.SimpleModel(),
        searchAction: new cb.model.SimpleModel(),
        closeAction : new cb.model.SimpleModel(),
        Grid: new cb.model.Model3D(),
        title: new cb.model.SimpleModel(),
 
    };
    this.setData(fields);
    this.setDirty(false);

    
    this.getmenuAction().on("click", function () { ReferViewModel_Extend.menuAction(this.getParent()); });
    this.getsearchAction().on("search", function (args) { ReferViewModel_Extend.searchAction(this.getParent(), args); });
    this.getcloseAction().on("click", function () { ReferViewModel_Extend.closeAction(this.getParent()); });
    this.getGrid().on("click", function (args) { ReferViewModel_Extend.listItemClick(this.getParent(), args); });
    this.getGrid().on("changePage", function (args) { ReferViewModel_Extend.changePage(this.getParent(), args); });
    
    this.getCatalog().on("beforeExpand", function (data) { ReferViewModel_Extend.beforeExpand(this.getParent(), data) });
    this.getCatalog().on("click", function (data) { ReferViewModel_Extend.catalogClick(this.getParent(), data) });
    this.getCatalog().on("moreClick", function (data) { ReferViewModel_Extend.catalogMoreClick(this.getParent(), data) });


    //客户端代理
    var proxyConfig = {
        //LoadMD: { url: "logics.ReferBP?method=read", method: "GET" },
        //load: { url: "u8services/classes/UAP/u8.pubitf.uap.ref.common.IReferRunTimeService?method=getRefer&dataType=u8.vo.uap.ref.ReferRequestInfoVO", method: "POST" },
        load: { url: "classes/Ref/UAP/getRefer", method: "Post" },
        //获取参照携带
        //loadCarrier: { url: "u8services/classes/UAP/com.yonyou.u8.framework.server.refer.ReferService?method=GetRefCarrier&dataType=com.yonyou.u8.framework.server.refer.carrier.ReferCarrierInfoVO", method: "POST" }
    };
    this.setProxy(proxyConfig);

    this.initData();
};

ReferViewModel.prototype.initData = function () {
    ReferViewModel_Extend.doAction("init_Extend", this);

};