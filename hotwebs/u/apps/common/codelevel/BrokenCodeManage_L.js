/// <reference path="../../../common/js/Cube.js" />
var BrokenCodeManageViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "BrokenCodeManageViewModel");
    this.init();
};
BrokenCodeManageViewModel.prototype = new cb.model.ContainerModel();
BrokenCodeManageViewModel.prototype.constructor = BrokenCodeManageViewModel;

BrokenCodeManageViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "BrokenCodeManageViewModel",
        Symbol: "codelevel.BrokenCodeManage",
        Close: new cb.model.SimpleModel(),
        Determine:new cb.model.SimpleModel(),
        BrokenCodeManageGrid: new cb.model.Model3D({
            readOnly: true,pageSize:-1,height:"500px",
            dsMode: 'local', showCheckBox: false,
            title: "", ctrlType: "DataGrid", Columns: {
                markstr: { title: "标识", ctrlType: "", owner: "", width: "50%" },
                rtnsn: { title: "断码", ctrlType: "textBox", owner: "", width: "50%" },
            }
        })
    };
    this.setData(fields);
    this.setDirty(false);

    //事件注册---需要整理，框架需要变动
    this.getClose().on("click", function (args) { BrokenCodeManageViewModel_Extend.CloseAction(this.getParent(), args); });
    this.getDetermine().on("click", function (args) { BrokenCodeManageViewModel_Extend.DetermineAction(this.getParent(), args); });
    this.getBrokenCodeManageGrid().on("click", function (args) { BrokenCodeManageViewModel_Extend.BrokenCodeGridAction(this.getParent(), args); });
    //服务代理
    var proxyConfig = {
        BrokenCodeManageQuery: { url: "classes/General/UAP/QryRtnVO", method: "Get" },
	};
	this.setProxy(proxyConfig);
	this.initData();
};

BrokenCodeManageViewModel.prototype.initData = function () {
    BrokenCodeManageViewModel_Extend.doAction("init_Extend", this);
};
