/// <reference path="../../../common/js/Cube.js" />
var NewWaterViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "NewWaterViewModel");
    this.init();
};
NewWaterViewModel.prototype = new cb.model.ContainerModel();
NewWaterViewModel.prototype.constructor = NewWaterViewModel;

NewWaterViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "NewWaterViewModel",
        Symbol: "codelevel.NewWater",
        lastsn: new cb.model.SimpleModel({ title: "流水号", isNullable: false }),
       	//pk_org: new cb.model.SimpleModel({ "refCode": "code", "refId": "600015", "refKey": "pk_org", "refName": "name" }),
        //entity: new cb.model.SimpleModel({ "refCode": "code", "refId": "code", "refKey": "pk_org", "refName": "name" }),
        //date: new cb.model.SimpleModel(),
        Close: new cb.model.SimpleModel(),
        Determine:new cb.model.SimpleModel()
    };
    this.setData(fields);
    this.setDirty(false);

    //事件注册---需要整理，框架需要变动
    this.getClose().on("click", function (args) { NewWaterViewModel_Extend.CloseAction(this.getParent(), args); });
    this.getDetermine().on("click", function (args) { NewWaterViewModel_Extend.DetermineAction(this.getParent(), args); });
    //服务代理
    var proxyConfig = {
       //查询数据
        NewWaterQuery: { url: "classes/General/UAP/QueryRefNewWater", method: "Get" },
        //选择数据后点击确定按钮
        InsertSNVO: { url: "classes/General/UAP/InsertSNVO", method: "Post" },
        QrySnEntityRef: { url: "classes/General/UAP/QrySnEntityRef", method: "Get" },

    };
	this.setProxy(proxyConfig);
	this.initData();
};

NewWaterViewModel.prototype.initData = function () {
    NewWaterViewModel_Extend.doAction("init_Extend", this);
};
