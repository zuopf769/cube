var OperatorViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "OperatorViewModel");
    this.init();
};
OperatorViewModel.prototype = new cb.model.ContainerModel();
OperatorViewModel.prototype.constructor = OperatorViewModel;

OperatorViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "OperatorViewModel",
        applicationName:new cb.model.SimpleModel(),
        displayName:new cb.model.SimpleModel(),
        SubmitAction:new cb.model.SimpleModel(),
        CancelAction:new cb.model.SimpleModel()
    };

    this.setData(fields);
    this.setDirty(false);	
	this.getSubmitAction().on("click", function (args) { OperatorViewModel_Extend.submitAction(this.getParent(), args) });
	this.getCancelAction().on("click", function (args) { OperatorViewModel_Extend.cancelAction(this.getParent(), args) });
	this.initData();
	
};
OperatorViewModel.prototype.initData = function () {
    OperatorViewModel_Extend.doAction("init_Extend", this);
};