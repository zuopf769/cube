/// <reference path="../../../common/js/Cube.js" />
var EntityViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "EntityViewModel");
    this.init();
};
EntityViewModel.prototype = new cb.model.ContainerModel();
EntityViewModel.prototype.constructor = EntityViewModel;

EntityViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "EntityViewModel",
        Symbol: "codelevel.Entity",
        Close: new cb.model.SimpleModel(),
        Determine:new cb.model.SimpleModel(),
        EntityGrid: new cb.model.Model3D({
            readOnly: true,pageSize:-1,height:"500px",
            dsMode: 'local', showCheckBox: false,
            title: "", ctrlType: "DataGrid", Columns: {
                elemname: { title: "候选属性", ctrlType: "", owner: "", width: "50%" },
                metaDisplayName: { title: "对应编码实体", ctrlType: "textBox", owner: "", width: "50%" },
            }
        })
    };
    this.setData(fields);
    this.setDirty(false);

    //事件注册---需要整理，框架需要变动
    this.getClose().on("click", function (args) { EntityViewModel_Extend.CloseAction(this.getParent(), args); });
    this.getDetermine().on("click", function (args) { EntityViewModel_Extend.DetermineAction(this.getParent(), args); });
    this.getEntityGrid().on("dblclickrow", function (args) {
        if (EntityViewModel_Extend.onDblClickRow)
            EntityViewModel_Extend.onDblClickRow(this.getParent(), args);
    });
    //this.getEntityGrid().on("click", function (args) { EntityViewModel_Extend.EntityGridAction(this.getParent(), args); });
    //服务代理
    var proxyConfig = {
       
        EntityQuery: { url: "classes/General/UAP/QueryRefEntity", method: "Get" },
        //选择数据后点击确定按钮
        QryEntity: { url: "classes/General/UAP/QryEntity", method: "Get" }
      
    };
	this.setProxy(proxyConfig);
	this.initData();
};

EntityViewModel.prototype.initData = function () {
    EntityViewModel_Extend.doAction("init_Extend", this);
};
