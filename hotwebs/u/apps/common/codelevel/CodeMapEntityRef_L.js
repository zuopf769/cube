/// <reference path="../../../common/js/Cube.js" />
var CodeMapEntityRefViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "CodeMapEntityRefViewModel");
    this.init();
};
CodeMapEntityRefViewModel.prototype = new cb.model.ContainerModel();
CodeMapEntityRefViewModel.prototype.constructor = CodeMapEntityRefViewModel;

CodeMapEntityRefViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "CodeMapEntityRefViewModel",
        Symbol: "codelevel.CodeLevel",
        entityRefGrid: new cb.model.Model3D({
            readOnly: true,
            height: "460px", 
            filterable:false,
            dsMode: 'local', pageSize: -1, showCheckBox: false,
            title: "", ctrlType: "DataGrid", Columns: {
                grp_name: { title: "集团", ctrlType: "TextBox", owner: "", width: "20%"},
                billtypecode: { title: "编码对象编码", ctrlType: "TextBox", owner: "", width: "20%" },
                billtypename: { title: "编码对象名称", ctrlType: "TextBox", owner: "", width: "20%" },
                rulecode: { title: "规则编码", ctrlType: "TextBox", owner: "", width: "20%" },
                rulename: { title: "编码名称", ctrlType: "TextBox", owner: "", width: "20%" }
            }
        })
    };
    this.setData(fields);
    this.setDirty(false);
    //事件驱动
    this.getentityRefGrid().on("afterCellChange", function (args) {});
    
    //服务代理
    var proxyConfig = { 
        GetCodeMapEntityRef: { url: "classes/General/UAP/GetCodeMapEntityRef", method: "GET" }   
	};
	this.setProxy(proxyConfig);
	this.initData();
};
CodeMapEntityRefViewModel.prototype.initData = function () {
    CodeMapEntityRefViewModel_Extend.doAction("init_Extend", this);
};
