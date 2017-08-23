/// <reference path="../../common/js/Cube.js" />
/// <reference path="ContactApp_Extend.js" />
var ContactDetailViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "ContactDetailViewModel");
    this.init();
};
ContactDetailViewModel.prototype = new cb.model.ContainerModel();
ContactDetailViewModel.prototype.constructor = ContactDetailViewModel;

ContactDetailViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "ContactDetailViewModel",
        name: new cb.model.SimpleModel(),
        position: new cb.model.SimpleModel(),
        tel: new cb.model.SimpleModel(),
        phone: new cb.model.SimpleModel(),
        msgAction: new cb.model.SimpleModel(),
        sinaAction: new cb.model.SimpleModel(),
        uuAction: new cb.model.SimpleModel()
    };
    this.setData(fields);
    this.setDirty(false);

    //事件注册---需要整理，框架需要变动
    this.getmsgAction().on("click", function (args) { ContactDetailViewModel_Extend.contactClick(this.getParent(), args); });
    this.getsinaAction().on("click", function (args) { ContactDetailViewModel_Extend.contactClick(this.getParent(), args); });
    this.getuuAction().on("click", function (args) { ContactDetailViewModel_Extend.contactClick(this.getParent(), args); });

    ContactDetailViewModel_Extend.doAction("init_Extend", this);
};