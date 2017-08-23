/// <reference path="../../../common/js/Cube.js" />
var ParameterSettingViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || 'ParameterSettingViewModel');
    this.init();
};
ParameterSettingViewModel.prototype = new cb.model.ContainerModel();
ParameterSettingViewModel.prototype.constructor = ParameterSettingViewModel;
ParameterSettingViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: 'ParameterSettingViewModel',
         Symbol: "sysmanager.ParameterSetting",
        NewDeliveryTree:new cb.model.SimpleModel({}),
        Close:new cb.model.SimpleModel({}),
        Determine:new cb.model.SimpleModel({}),
        productList:new cb.model.SimpleModel({
            DataSource:[
                {text:"主分类",value:"1"},
                {text:"采购分类",value:"2"},
                {text:"销售分类",value:"3"},
                {text:"财务分类",value:"4"}
            ]
        })
    };
    this.setData(fields);
    this.setDirty(false);
     //事件注册
    this.getClose().on('click', function (args) { ParameterSettingViewModel_Extend.closeAction(this.getParent(), args); });
    this.getDetermine().on('click', function (args) { ParameterSettingViewModel_Extend.determineAction(this.getParent(), args); });
    //服务代理
    var proxyConfig = {};
    this.setProxy(proxyConfig);
    this.initData();
};
ParameterSettingViewModel.prototype.initData = function () {
    ParameterSettingViewModel_Extend.doAction('init_Extend', this)
};
