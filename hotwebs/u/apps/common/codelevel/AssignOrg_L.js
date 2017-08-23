/// <reference path="../../../common/js/Cube.js" />
var AssignOrgViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "AssignOrgViewModel");
    this.init();
};
AssignOrgViewModel.prototype = new cb.model.ContainerModel();
AssignOrgViewModel.prototype.constructor = AssignOrgViewModel;

AssignOrgViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "AssignOrgViewModel",
        orgTree: new cb.model.Model2D({
        	checkboxes: {
    			checkChildren: true
        	}
        }),
        cancelAction: new cb.model.SimpleModel(),
        determineAction:new cb.model.SimpleModel()
    };
    this.setData(fields);
    this.setDirty(false);

    //事件注册---需要整理，框架需要变动
    this.getcancelAction().on("click", function (args) { AssignOrg_Extend.cancelAction(this.getParent(), args); });
    this.getdetermineAction().on("click", function (args) { AssignOrg_Extend.determineAction(this.getParent(), args); });
   	
   //服务代理
    var proxyConfig = {
       CreateOrgTree: { url: "classes/General/UAP/CreateOrgTree", method: "POST" },
       BatchProcessRORelaVO: { url: "classes/General/UAP/BatchProcessRORelaVO", method: "POST" }
	};
	this.setProxy(proxyConfig);
	this.initData();
};

AssignOrgViewModel.prototype.initData = function () {
    AssignOrg_Extend.doAction("init_Extend", this);
};
