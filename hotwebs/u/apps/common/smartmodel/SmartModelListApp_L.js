var SmartModelListViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "SmartModelListViewModel");
    this.init();
};
SmartModelListViewModel.prototype = new cb.model.ContainerModel();
SmartModelListViewModel.prototype.constructor = SmartModelListViewModel;

SmartModelListViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "SmartModelListViewModel",
        Symbol: "common.smartmodel.SmartModelList",
		closeAction:new cb.model.SimpleModel(),
        topToolBar:new cb.model.SimpleModel(),
		addSmartModelButton:new cb.model.SimpleModel(),
		updateSmartModelButton:new cb.model.SimpleModel(),
		deleteSmartModelButton:new cb.model.SimpleModel(),
		designSmartModelButton:new cb.model.SimpleModel(),
		treeToolbar:new cb.model.SimpleModel(),
		addNodeButton:new cb.model.SimpleModel(),
		updateNodeButton:new cb.model.SimpleModel(),
		deleteNodeButton:new cb.model.SimpleModel(),
		smartModelTree:new cb.model.SimpleModel(),
		smartModelForm:new cb.model.Model3D({title:"语义模型",ctrlType:"dataGrid",Mode:"Remote",Columns:{
			pk_dir:{title:"pk_dir",ctrlType:"TextBox",visible:false},
			pk_def:{title:"pk_def",ctrlType:"TextBox",visible:false},
			defcode:{title:"语义模型编码",ctrlType:"TextBox"},
			defname:{title:"语义模型名称",ctrlType:"TextBox"},
			operator:{title:"数据源",ctrlType:"TextBox"},
			dataType:{title:"分类",ctrlType:"TextBox"},
			refCode:{title:"创建者",ctrlType:"TextBox"},
			value:{title:"修改者",ctrlType:"TextBox"},
			required:{title:"创建时间",ctrlType:"TextBox"},
			refDepend:{title:"修改时间",ctrlType:"TextBox"},
			enablePermission:{title:"备注",ctrlType:"TextBox"},
		}}),
		NCMDFootToolbar:new cb.model.SimpleModel(),
		cancelButton:new cb.model.SimpleModel(),
		saveButton:new cb.model.SimpleModel(),
    };
	this.setData(fields),
    this.setDirty(false);
	//事件注册---需要整理，框架需要变动
	this.getcloseAction().on("click", function () {SmartModelListViewModel_Extend.closeAction(this.getParent())});
	this.getsmartModelTree().on("beforeExpand",function(data){SmartModelListViewModel_Extend.openNode(this.getParent(),data)});
	this.getsmartModelTree().on("click",function(data){SmartModelListViewModel_Extend.fillForm(this.getParent(),data)});
	this.getaddSmartModelButton().on("click",function(data){SmartModelListViewModel_Extend.addSmartModelButton(this.getParent(),data);});
	this.getupdateSmartModelButton().on("click",function(data){SmartModelListViewModel_Extend.updateSmartModelButton(this.getParent(),data);});
	this.getdeleteSmartModelButton().on("click",function () {SmartModelListViewModel_Extend.deleteSmartModelButton(this.getParent(),data)});
	this.getdesignSmartModelButton().on("click",function () {SmartModelListViewModel_Extend.designSmartModelButton(this.getParent(),data)});
	this.getaddNodeButton().on("click",function () {SmartModelListViewModel_Extend.addNodeButton(this.getParent())});
	this.getupdateNodeButton().on("click",function () {SmartModelListViewModel_Extend.updateNodeButton(this.getParent())});
	this.getdeleteNodeButton().on("click",function () {SmartModelListViewModel_Extend.deleteNodeButton(this.getParent(),data)});
	this.getcancelButton().on("click",function () {SmartModelListViewModel_Extend.cancelButton(this.getParent(),data)});
	this.getsaveButton().on("click",function () {SmartModelListViewModel_Extend.saveButton(this.getParent(),data)});
	
	this.initData();
}

SmartModelListViewModel.prototype.initData = function () {
    SmartModelListViewModel_Extend.doAction("init_Extend", this);
};