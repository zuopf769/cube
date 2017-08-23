/// <reference path="../../../common/js/Cube.js" />
var CodeMapReflectViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "CodeMapReflectViewModel");
    this.init();
};
CodeMapReflectViewModel.prototype = new cb.model.ContainerModel();
CodeMapReflectViewModel.prototype.constructor = CodeMapReflectViewModel;

CodeMapReflectViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "CodeMapReflectViewModel",
        Symbol: "codelevel.CodeLevel",
        Close: new cb.model.SimpleModel(),
        Determine:new cb.model.SimpleModel(),
        reflectGrid: new cb.model.Model3D({
            readOnly: true,
            filterable:false,
            height: "435px", 
            dsMode: 'local', pageSize: -1, showCheckBox: true,
            title: "", ctrlType: "DataGrid", Columns: {
                code: { title: "编码", ctrlType: "TextBox", owner: "", width: "33%" },
                name: { title: "名称", ctrlType: "TextBox", owner: "", width: "33%" },
                pk_org: { title: "组织", ctrlType: "TextBox", owner: "", width: "34%" },
            }
        })
    };
    this.setData(fields);
    this.setDirty(false);
    //事件驱动
    this.getreflectGrid().on("afterCellChange", function (args) {});
    this.getClose().on("click", function (args) { CodeMapReflectViewModel_Extend.CloseAction(this.getParent(), args); });
    this.getDetermine().on("click", function (args) { CodeMapReflectViewModel_Extend.DetermineAction(this.getParent(), args); });
    //服务代理
    var proxyConfig = { 
        QueryRefdataByClassID: { url: "classes/General/UAP/QueryRefdataByClassID", method: "GET" }   
	};
	this.setProxy(proxyConfig);
	this.initData();
};
CodeMapReflectViewModel.prototype.initData = function () {
    CodeMapReflectViewModel_Extend.doAction("init_Extend", this);
};
