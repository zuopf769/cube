var MoreSchemeDetailViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "MoreSchemeDetailViewModel");
    this.init();
};
MoreSchemeDetailViewModel.prototype = new cb.model.ContainerModel();
MoreSchemeDetailViewModel.prototype.constructor = MoreSchemeDetailViewModel;

MoreSchemeDetailViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "MoreSchemeDetailViewModel",
        submitAction: new cb.model.SimpleModel(),
        closeAction:new cb.model.SimpleModel(),
        schemaname:new cb.model.SimpleModel(),
        saveAction:new cb.model.SimpleModel(),
        cancelAction: new cb.model.SimpleModel()
    };
    this.setData(fields);
    this.setDirty(false);

    this.getsubmitAction().on("click", function () { MoreSchemeDetailViewModel_Extend.queryAction(this.getParent()); });
    this.getcloseAction().on("click", function () { MoreSchemeDetailViewModel_Extend.closeAction(this.getParent()); });
    this.getcancelAction().on("click", function () { MoreSchemeDetailViewModel_Extend.closeAction(this.getParent()); });
    this.getsaveAction().on("click", function () { MoreSchemeDetailViewModel_Extend.saveAction(this.getParent()); });

    this.initData();
};

MoreSchemeDetailViewModel.prototype.initData = function () {
    MoreSchemeDetailViewModel_Extend.doAction("init_Extend", this);
};
