/// <reference path="../../../common/js/Cube.js" />
var TimeTypeViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "TimeTypeViewModel");
    this.init();
};
TimeTypeViewModel.prototype = new cb.model.ContainerModel();
TimeTypeViewModel.prototype.constructor = TimeTypeViewModel;

TimeTypeViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "TimeTypeViewModel",
        Symbol: "codelevel.TimeType",
        timeType: new cb.model.SimpleModel({
            dataSource: {
                type: "Radio",list: [
                    { value: "0", text: "系统时间", checked: true },
                    { value: "1", text: "业务时间" }
                ]
            }
        }),
        codeEntityTree: new cb.model.Model2D({
        	template: "# if(item.cansel) {#  <span style='color:red;'> #=item.name #</span> #} else {# #=item.name # #}#" 
        }),  
        Close: new cb.model.SimpleModel(),
        Determine:new cb.model.SimpleModel()
    };
    this.setData(fields);
    this.setDirty(false);

    //事件注册---需要整理，框架需要变动
    this.getClose().on("click", function (args) { TimeTypeViewModel_Extend.CloseAction(this.getParent(), args); });
    this.getDetermine().on("click", function (args) { TimeTypeViewModel_Extend.DetermineAction(this.getParent(), args); });
    this.gettimeType().on("click",function(args) {TimeTypeViewModel_Extend.timeTypeRadioAction(this.getParent(), args); })
   	this.getcodeEntityTree().on("click",function(args) {TimeTypeViewModel_Extend.codeEntityTreeClickAction(this.getParent(), args);});
   	
   //服务代理
    var proxyConfig = {
       TimeTypeQuery: { url: "classes/General/UAP/CreateEntityAttrTree", method: "Get" },
       ActionTreeQuery: { url: "classes/General/UAP/ActionTree", method: "POST" }
	};
	this.setProxy(proxyConfig);
	this.initData();
};

TimeTypeViewModel.prototype.initData = function () {
    TimeTypeViewModel_Extend.doAction("init_Extend", this);
};
