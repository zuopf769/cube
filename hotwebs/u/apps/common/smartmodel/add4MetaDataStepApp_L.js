var add4MetaDataStepAppViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "add4MetaDataStepAppViewModel");
    this.init();
};
add4MetaDataStepAppViewModel.prototype = new cb.model.ContainerModel();
add4MetaDataStepAppViewModel.prototype.constructor = add4MetaDataStepAppViewModel;

add4MetaDataStepAppViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "add4MetaDataStepAppViewModel",
        Symbol: "common.smartmodel.SmartModelWebWizard",
        closeAction:new cb.model.SimpleModel(),
		
    };
	this.setData(fields);
    this.setDirty(false);
	//事件注册---需要整理，框架需要变动
}