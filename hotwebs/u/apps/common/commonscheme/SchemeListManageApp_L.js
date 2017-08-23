/// <reference path="../../common/js/Cube.js" />
/// <reference path="ContactApp_Extend.js" />
var SchemeListManageViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "SchemeListManageViewModel");
    this.init();
};
SchemeListManageViewModel.prototype = new cb.model.ContainerModel();
SchemeListManageViewModel.prototype.constructor = SchemeListManageViewModel;

SchemeListManageViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "SchemeListManageViewModel",
        closeAction: new cb.model.SimpleModel(),
        schemelist: new cb.model.SimpleModel()
    };
    this.setData(fields);
    this.setDirty(false);

    //事件注册---需要整理，框架需要变动
    this.getcloseAction().on("click", function (args) { SchemeListManageViewModel_Extend.closeAction(this.getParent(), args); });
    this.getschemelist().on("click", function (args) { SchemeListManageViewModel_Extend.itemClick(this.getParent(), args); });

    this.initData();
};

SchemeListManageViewModel.prototype.initData = function () {
    SchemeListManageViewModel_Extend.doAction("init_Extend", this);
};