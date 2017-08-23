var AddApplicationViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "AddApplicationViewModel");
    this.init();
};
AddApplicationViewModel.prototype = new cb.model.ContainerModel();
AddApplicationViewModel.prototype.constructor = AddApplicationViewModel;

AddApplicationViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "AddApplicationViewModel",
        confirmAction: new cb.model.SimpleModel(),
        cancelAction: new cb.model.SimpleModel(),
        ApplicationModule: new cb.model.Model2D({
            checkboxes: {
                checkChildren: true,
            },
            expandAll: true,
            dragAndDrop: false,
            refName:"disPlayName"
        }),
    };
    this.setData(fields);
    this.setDirty(false);

    //事件注册---需要整理，框架需要变动
    this.getconfirmAction().on("click", function (args) { AddApplication_Extend.confirmAction(this.getParent(), args); });
    this.getcancelAction().on("click", function (args) { AddApplication_Extend.cancelAction(this.getParent(), args); });
    this.getApplicationModule().on("check", function (args) { AddApplication_Extend.ApplicationModule(this.getParent(), args); });
    var proxyConfig = {
        GetdoInstallAcount: { url: "upservices/up.itf.uap.update.service.IUpdateAccountsService/UAP/doInstallDB", method: "Post" , mask:true},
        GetApplication: { url: "upservices/up.itf.uap.update.service.IUpdateAccountsService/UAP/updateAcountNew", method: "Post" , mask:true},
    };
    this.setProxy(proxyConfig);

    this.initData();
};

AddApplicationViewModel.prototype.initData = function () {
    AddApplication_Extend.doAction("init_Extend", this);
};
