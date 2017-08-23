/// <reference path="../../common/js/Cube.js" />
/// <reference path="SalesOrderTableApp_Extend.js" />
var SalesOrderTableViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "SalesOrderTableViewModel");
    this.init();
};
SalesOrderTableViewModel.prototype = new cb.model.ContainerModel();
SalesOrderTableViewModel.prototype.constructor = SalesOrderTableViewModel;

SalesOrderTableViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "SalesOrderTableViewModel",
        Symbol:"UAP",
        returnAction: new cb.model.SimpleModel({ model: "no-text" }),
        cancelAction: new cb.model.SimpleModel({ model: "no-image" }),
        pullAction: new cb.model.SimpleModel({ model: "no-image" }),
		lines:new cb.model.Model3D()
    };
    this.setData(fields);
    this.setDirty(false);

    //事件注册---需要整理，框架需要变动
    this.getreturnAction().on("click", function () { SalesOrderTableViewModel_Extend.returnAction(this.getParent()); });
    this.getcancelAction().on("click", function () { SalesOrderTableViewModel_Extend.cancelAction(this.getParent()); });
    this.getpullAction().on("click", function () { SalesOrderTableViewModel_Extend.pullAction(this.getParent()); });
    this.getlines().on("changePage", function (args) { SalesOrderTableViewModel_Extend.changePage(this.getParent(), args); });
    
	var model3d = this.getModel3D();
	model3d.set("mode", "archives");
    model3d.setPageSize(15);
    
	this.initData();
};

SalesOrderTableViewModel.prototype.initData = function () {
    SalesOrderTableViewModel_Extend.doAction("init_Extend", this);
};
