/// <reference path="../../common/js/Cube.js" />
/// <reference path="SalesOrderListApp_Extend.js" />
var SalesOrderListViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "SalesOrderListViewModel");
    this.init();
};
SalesOrderListViewModel.prototype = new cb.model.ContainerModel();
SalesOrderListViewModel.prototype.constructor = SalesOrderListViewModel;

SalesOrderListViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "SalesOrderListViewModel",
        Symbol: "UAP",
        returnAction: new cb.model.SimpleModel({ model: "no-text" }),
		lines:new cb.model.Model3D()
    };
    this.setData(fields);
    this.setDirty(false);

    //事件注册---需要整理，框架需要变动
    this.getreturnAction().on("click", function () { SalesOrderListViewModel_Extend.returnAction(this.getParent()); });
    this.getlines().on("click", function (args) { SalesOrderListViewModel_Extend.itemClick(this.getParent(), args); });
    this.getlines().on("changePage", function (args) { SalesOrderListViewModel_Extend.changePage(this.getParent(), args); });
    
	var model3d = this.getModel3D();
	model3d.set("mode", "archives");
    model3d.setPageSize(15);
    
	this.initData();
};

SalesOrderListViewModel.prototype.initData = function () {
    SalesOrderListViewModel_Extend.doAction("init_Extend", this);
};
