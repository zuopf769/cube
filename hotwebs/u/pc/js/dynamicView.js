var DynamicViewModel = function(name,tplName,container){
    cb.model.ContainerModel.call(this, null, name || "DynamicViewModel");
    this.init();
}


DynamicViewModel.prototype=new cb.model.ContainerModel();
DynamicViewModel.prototype.constructor=DynamicViewModel;

DynamicViewModel.prototype.init = function(){
    var fields = {
        ViewModelName: "DynamicViewModel",
        closeAction: new cb.model.SimpleModel(),
        submitAction: new cb.model.SimpleModel(),
        cancelAction: new cb.model.SimpleModel(),
        saveSchemeAction: new cb.model.SimpleModel()
    };

    this.setData(fields);
    this.setDirty(false);

    this.getcloseAction().on("click", function () { DynamicViewModel_Extend.closeAction(this.getParent()); });
    this.getsubmitAction().on("click", function () { DynamicViewModel_Extend.submitAction(this.getParent()); });
    this.getcancelAction().on("click", function () { DynamicViewModel_Extend.cancelAction(this.getParent()); });
    this.getsaveSchemeAction().on("click", function () { DynamicViewModel_Extend.saveSchemeAction(this.getParent()); });


    // var params = cb.route.getViewPartParams(this);
    // var parentViewModel = params.parentViewModel;
    // if (!params) {
    //         cb.console.error("ApprovalViewModel_Extend.submitAction: getViewPartParams为空");
    //         return;
    // }
    // var schemeID = parentViewModel.getqueryScheme().getValue();

    var proxyConfig = {
        getSchemeDetail: { url: "classes/General/sa.Delivery/LoadSchemeDetail", method: "Get" }
    };
    this.setProxy(proxyConfig);

    //DynamicViewModel_Extend.doAction("init_Extend", this);
    //DynamicViewModel_Extend.init_Extend(this);
    this.initData();
}

DynamicViewModel.prototype.initData = function(){
    DynamicViewModel_Extend.doAction("init_Extend", this);
};


