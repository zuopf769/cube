/// <reference path="../../../common/js/Cube.js" />
var NewDeliveryOrganizationViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || 'NewDeliveryOrganizationViewModel');
    this.init();
};
NewDeliveryOrganizationViewModel.prototype = new cb.model.ContainerModel();
NewDeliveryOrganizationViewModel.prototype.constructor = NewDeliveryOrganizationViewModel;
NewDeliveryOrganizationViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: 'NewDeliveryOrganizationViewModel',
        Symbol: "sysmanager.NewDeliveryOrganization",
        NewDeliveryTree: new cb.model.SimpleModel({}),
        Close: new cb.model.SimpleModel({}),
        Determine: new cb.model.SimpleModel({})
    };
    this.setData(fields);
    this.setDirty(false);
    //事件注册
    this.getClose().on('click', function (args) { NewDeliveryOrganizationViewModel_Extend.closeAction(this.getParent(), args); });
    this.getDetermine().on('click', function (args) { NewDeliveryOrganizationViewModel_Extend.determineAction(this.getParent(), args); });
    //服务代理
    var proxyConfig = {};
    this.setProxy(proxyConfig);
    this.initData();
};
NewDeliveryOrganizationViewModel.prototype.initData = function () {
    NewDeliveryOrganizationViewModel_Extend.doAction('init_Extend', this)
};
