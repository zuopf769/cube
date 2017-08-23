/// <reference path="../../common/js/Cube.js" />
/// <reference path="SubLineApp_Extend.js" />
var SubLineViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "SubLineViewModel");
    this.init();
};
SubLineViewModel.prototype = new cb.model.ContainerModel();
SubLineViewModel.prototype.constructor = SubLineViewModel;

SubLineViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "SubLineViewModel",
        returnAction: new cb.model.SimpleModel({ model: "no-text" }),
        addAction: new cb.model.SimpleModel({ model: "no-text" })
    };
    this.setData(fields);
    this.setDirty(false);

    //事件注册---需要整理，框架需要变动
    this.getreturnAction().on("click", function () { SubLineViewModel_Extend.returnAction(this.getParent()); });
    this.getaddAction().on("click", function () { SubLineViewModel_Extend.addAction(this.getParent()); });
    
    this.initParams();
    this.initData();
};

SubLineViewModel.prototype.initParams = function () {
    var params = cb.route.getViewPartParams(this);
    var parentViewModel = params.parentViewModel;
    var model3d = parentViewModel.getModel3D();
    var self = this;
    model3d.on("click", function (args) { SubLineViewModel_Extend.itemClick(self, args); });
    var $container = $("div[data-viewmodel='" + this.getName() + "'] .ui-form-content");
    if (!$container.length) return;
    var listElem = $("div[data-viewmodel='" + parentViewModel.getName() + "'] div[data-propertyname='bodyAction']").next().children().get(0);
    if (!listElem) return;
    $container.append(listElem);
};

SubLineViewModel.prototype.initData = function () {
    SubLineViewModel_Extend.doAction("init_Extend", this);
};