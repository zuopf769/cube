/// <reference path="../../common/js/Cube.js" />
/// <reference path="ContactDetailApp_Extend.js" />
var ContactDetailViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "ContactDetailViewModel");
    this.init();
};
ContactDetailViewModel.prototype = new cb.model.ContainerModel();
ContactDetailViewModel.prototype.constructor = ContactDetailViewModel;

ContactDetailViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "ContactDetailViewModel",
        tabMenu1: new cb.model.SimpleModel({
            isNeedCollect: false,
            mode: "strip",
            dataSource: [
                { content: "baseinfo", isSelected: true },
			    { content: "linkman" }
			]
        }),
        returnAction: new cb.model.SimpleModel({ model: "no-text" }),
        editAction: new cb.model.SimpleModel({ model: "no-text" }),
        cancelAction: new cb.model.SimpleModel(),
        saveAction: new cb.model.SimpleModel()
    };
    this.setData(fields);
    this.setDirty(false);

    //事件注册---需要整理，框架需要变动
    this.getreturnAction().on("click", function () { ContactDetailViewModel_Extend.returnAction(this.getParent()); });

    ContactDetailViewModel_Extend.doAction("init_Extend", this);
};