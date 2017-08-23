/// <reference path="../../../common/js/Cube.js" />
var WaterManageViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "WaterManageViewModel");
    this.init();
};
WaterManageViewModel.prototype = new cb.model.ContainerModel();
WaterManageViewModel.prototype.constructor = WaterManageViewModel;

WaterManageViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "WaterManageViewModel",
        Symbol: "codelevel.WaterManage",
        Close: new cb.model.SimpleModel(),
        Determine: new cb.model.SimpleModel(),
        addWater: new cb.model.SimpleModel({title:"新增流水号"}),
        waterManageGrid: new cb.model.Model3D({
            readOnly: false,pageSize:-1,height:"500px",
            dsMode: 'local', showCheckBox: false,
            title: "", ctrlType: "DataGrid", Columns: {
                organization: { title: "组织", ctrlType: "", owner: "", width: "115px" ,editable:false},
                waterbasis: { title: "流水依据", ctrlType: "TextBox", owner: "", width: "100px",editable:false},
                markstr: { title: "编码", ctrlType: "TextBox", owner: "", editable:false,width: "400px" },
                lastsn: { title: "流水号", ctrlType: "TextBox", owner: "", width: "100px", editable:true},
            }
        })
    };
    this.setData(fields);
    this.setDirty(false);

    //事件注册---需要整理，框架需要变动
    this.getClose().on("click", function (args) { WaterManageViewModel_Extend.CloseAction(this.getParent(), args); });
    this.getDetermine().on("click", function (args) { WaterManageViewModel_Extend.DetermineAction(this.getParent(), args); });
    this.getaddWater().on("click", function (args) { WaterManageViewModel_Extend.AddWaterAction(this.getParent(), args); });
    this.getwaterManageGrid().on("afterCellChange", function (args) { WaterManageViewModel_Extend.waterManageGridAction(this.getParent(), args); });
    //服务代理
    var proxyConfig = {
        WaterManageQuery: { url: "classes/General/UAP/QrySNVOByBasePK", method: "Get" },
        WaterManageInsert: { url: "classes/General/UAP/InsertSNVO", method: "Post" },
        UpdateSNVOBatch: { url: "classes/General/UAP/UpdateSNVOBatch", method: "Post" }
	};
	this.setProxy(proxyConfig);
	this.initData();
};

WaterManageViewModel.prototype.initData = function () {
    WaterManageViewModel_Extend.doAction("init_Extend", this);
};
