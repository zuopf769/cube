var AddSmartModelKindViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "AddSmartModelKindViewModel");
    this.init();
};
AddSmartModelKindViewModel.prototype = new cb.model.ContainerModel();
AddSmartModelKindViewModel.prototype.constructor = AddSmartModelKindViewModel;

AddSmartModelKindViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "AddSmartModelKindViewModel",
        Symbol: "common.smartmodel.AddSmartModelKind",
        closeAction:new cb.model.SimpleModel(),
		name:new cb.model.SimpleModel(),
		upperLevel:new cb.model.SimpleModel({readOnly:true}),
		pk:new cb.model.SimpleModel({visible:false}),
		code:new cb.model.SimpleModel(),
		creator:new cb.model.SimpleModel(),
		modifier:new cb.model.SimpleModel(),
		createdtTime:new cb.model.SimpleModel(),
		modifiedTime:new cb.model.SimpleModel(),
		group:new cb.model.SimpleModel(),
		footToolbar:new cb.model.SimpleModel(),
		save:new cb.model.SimpleModel(),
		cancel:new cb.model.SimpleModel(),
    };
	this.setData(fields),
    this.setDirty(false);
	//事件注册---需要整理，框架需要变动
	this.getcloseAction().on("click", function () {AddSmartModelKindViewModel_Extend.closeAction(this.getParent());});
	this.getsave().on("click",function(){AddSmartModelKindViewModel_Extend.save(this.getParent());});
	this.getcancel().on("click",function(){AddSmartModelKindViewModel_Extend.cancel(this.getParent());});
	this.initData();
}


AddSmartModelKindViewModel.prototype.initData = function () {
    AddSmartModelKindViewModel_Extend.doAction("init_Extend", this);
};