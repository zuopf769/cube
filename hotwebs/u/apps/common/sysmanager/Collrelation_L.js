/// <reference path="../../../common/js/Cube.js" />
var CollrelationViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || 'CollrelationViewModel');
    this.init();
};
CollrelationViewModel.prototype = new cb.model.ContainerModel();
CollrelationViewModel.prototype.constructor = CollrelationViewModel;
CollrelationViewModel.prototype.init = function () {
    var fields = {
         ViewModelName:'CollrelationViewModel',
         Symbol:"sysmanager.Collrelation",
        saleOrganization:new cb.model.SimpleModel({

        }),
        organizationList:new cb.model.SimpleModel({

        }),
        businessType:new cb.model.SimpleModel({
            DataSource:[
                {text:"销售接单工厂发货",value:"a"},
                {text:"2",value:"b"},
                {text:"3",value:"c"}
            ]
        }),
        CollCustomList:new cb.model.SimpleModel({
            DataSource:[
                {text:"山东文曲",value:'a'},
                {text:"河北省",value:"b"},
                {text:"重庆",value:"c"}
            ]
        }),
        inStockCustomList:new cb.model.SimpleModel({
            showConfig:false,
            DataSource:[
                {text:"山东文曲",value:'a'},
                {text:"河北省",value:"b"},
                {text:"重庆",value:"c"}
            ]
        }),
        deliveryCustomList:new cb.model.SimpleModel({
            showConfig:false,
            DataSource:[
                {text:"山东文曲",value:'a'},
                {text:"河北省",value:"b"},
                {text:"重庆",value:"c"}
            ]
        }),
        financeCustomList:new cb.model.SimpleModel({
            showConfig:false,
            DataSource:[
                {text:"山东文曲",value:'a'},
                {text:"河北省",value:"b"},
                {text:"重庆",value:"c"}
            ]
        }),
        billingCustomList:new cb.model.SimpleModel({
            showConfig:false,
            DataSource:[
                {text:"山东文曲",value:'a'},
                {text:"河北省",value:"b"},
                {text:"重庆",value:"c"}
            ]
        }),
        add: new cb.model.SimpleModel({}),
    };
    this.setData(fields);
    this.setDirty(false);
     //    事件注册
    this.getadd().on('click',function(args){CollrelationViewModel_Extend.addAction(this.getParent(),args);});
    this.getCollCustomList().on('customSet', function (args) { CollrelationViewModel_Extend.CollCustomListAction(this.getParent(), args); });

    //服务代理
    var proxyConfig = {};
    this.setProxy(proxyConfig);
    this.initData();
};
CollrelationViewModel.prototype.initData = function () {
    CollrelationViewModel_Extend.doAction('init_Extend',this)
};
