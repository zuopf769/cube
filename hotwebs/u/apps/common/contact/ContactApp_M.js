/// <reference path="../../common/js/Cube.js" />
/// <reference path="ContactApp_Extend.js" />
var ContactViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "ContactViewModel");
    this.init();
};
ContactViewModel.prototype = new cb.model.ContainerModel();
ContactViewModel.prototype.constructor = ContactViewModel;

ContactViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "ContactViewModel",
        contacts: new cb.model.Model3D()
    };
    this.setData(fields);
    this.setDirty(false);

    //事件注册---需要整理，框架需要变动
    this.getcontacts().on("click", function (args) { ContactViewModel_Extend.contactClick(this.getParent(), args); });
    this.getcontacts().on("changePage", function (args) { ContactViewModel_Extend.contactsChangePage(this.getParent(), args); });

    ContactViewModel_Extend.doAction("init_Extend", this);
};