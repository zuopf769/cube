var NCMetaDataProviderViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "NCMetaDataProviderViewModel");
    this.init();
};
NCMetaDataProviderViewModel.prototype = new cb.model.ContainerModel();
NCMetaDataProviderViewModel.prototype.constructor = NCMetaDataProviderViewModel;

NCMetaDataProviderViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "NCMetaDataProviderViewModel",
        Symbol: "common.smartmodel.SmartModelWebWizard",
        closeAction:new cb.model.SimpleModel(),
		treeComp:new cb.model.SimpleModel(),
		treeEntity:new cb.model.SimpleModel(),
		NCMDFootToolbar:new cb.model.SimpleModel(),
		cancelButton:new cb.model.SimpleModel({title:"取消",ctrlType:"Button"}),
		saveButton:new cb.model.SimpleModel({title:"确定",ctrlType:"Button"}),
    };
	this.setData(fields);
    this.setDirty(false);
	//事件注册---需要整理，框架需要变动
	this.getcloseAction().on("click", function () {NCMetaDataProviderViewModel_Extend.closeAction(this.getParent())});
	this.gettreeComp().on("beforeExpand",function(data){
		NCMetaDataProviderViewModel_Extend.treeCompNodeAction(this.getParent(),data)});
	this.getsaveButton().on("click",function(data){NCMetaDataProviderViewModel_Extend.saveAction(this.getParent(),data);});
	this.getcancelButton().on("click",function () {NCMetaDataProviderViewModel_Extend.closeAction(this.getParent())});
	
	this.initData();
}

NCMetaDataProviderViewModel.prototype.initData = function () {
    NCMetaDataProviderViewModel_Extend.doAction("init_Extend", this);
};