/// <reference path="../../common/js/Cube.js" />
/// <reference path="ContactApp_Extend.js" />
var SchemeDetailViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "SchemeDetailViewModel");
    this.init();
};
SchemeDetailViewModel.prototype = new cb.model.ContainerModel();
SchemeDetailViewModel.prototype.constructor = SchemeDetailViewModel;

SchemeDetailViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "SchemeDetailViewModel",
        closeAction: new cb.model.SimpleModel(),
        propertyNameList:new cb.model.SimpleModel(),
        name: new cb.model.SimpleModel(),
        fieldName: new cb.model.SimpleModel(),
        operators: new cb.model.SimpleModel(),        
        defaultValue:new cb.model.SimpleModel(),
        isRequired: new cb.model.SimpleModel(),
        isDefault: new cb.model.SimpleModel(),
        cancelAction:new cb.model.SimpleModel(),
        submitAction:new cb.model.SimpleModel()
    };
    this.setData(fields);
    this.setDirty(false);

    //事件注册---需要整理，框架需要变动
    this.getcloseAction().on("click", function (args) { SchemeDetailViewModel_Extend.closeActionClick(this.getParent(), args); });
    this.getpropertyNameList().on("click", function (args) { SchemeDetailViewModel_Extend.propertyClick(this.getParent(), args); });
    this.getoperators().on("change", function (args) { SchemeDetailViewModel_Extend.operatorChange(this.getParent(), args); });
    this.getcancelAction().on("click", function (args) { SchemeDetailViewModel_Extend.closeActionClick(this.getParent(), args); });
    this.getsubmitAction().on("click", function (args) { SchemeDetailViewModel_Extend.submitAction(this.getParent(), args); });

    this.initData();
    
};

SchemeDetailViewModel.prototype.initData = function () {
    SchemeDetailViewModel_Extend.doAction("init_Extend", this);
};