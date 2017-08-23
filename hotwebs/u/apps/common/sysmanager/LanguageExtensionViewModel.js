
var LanguageExtensionViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "LanguageExtensionViewModel");
    this.init();
};
LanguageExtensionViewModel.prototype = new cb.model.ContainerModel();
LanguageExtensionViewModel.prototype.constructor = LanguageExtensionViewModel;

LanguageExtensionViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "LanguageExtensionViewModel",
        confirmAction: new cb.model.SimpleModel({ title: "确认", ctrlType: "Button", owner: "Toolbar 功能" }),
        cancelAction: new cb.model.SimpleModel({ title: "取消", ctrlType: "Button", owner: "Toolbar 功能" }),
        LanguagesList: new cb.model.Model3D({
            readOnly: false,
            dsMode: "Local",
            height: 360,
            pager:"pager",
            showCheckBox: true,
            title: "管理员", ctrlType: "KendoGrid", Columns: {
                text: { title: "语言名称", ctrlType: "TextBox", dataType: "string" },
                code: { title: "语言编码", ctrlType: "TextBox", dataType: "string" },
                langseq: { title: "顺序", ctrlType: "TextBox", dataType: "string",isVisible:false}
            },
                commands: {
                    cmds: [{ name: 'add', text: "<img src='pc/images/add.png'/>" }, { name: "delete", text: "<img src='pc/images/delete.png'/>" }],
                    isVisible: false,
                    width: 60,
                }
        }),
    };
    this.setData(fields);
    this.setDirty(false);

    this.getcancelAction().on("click", function (args) { LanguageExtensionViewModel_Extend.cancelAction(this.getParent(), args); });
    this.getconfirmAction().on("click", function (args) { LanguageExtensionViewModel_Extend.confirmAction(this.getParent(), args); });

    var proxyConfig = {
        updateDBML: { url: "upservices/up.itf.uap.sysmng.service.ISystemManageService/UAP/updateDBML", method: "Post" , mask:true },
        getBusiCenterLanguageVOs: { url: "upservices/up.itf.uap.sysmng.service.ISystemManageService/UAP/getBusiCenterLanguageVOs", method: "Post" , mask:true },
    }
    this.setProxy(proxyConfig);
    this.initData();
};

LanguageExtensionViewModel.prototype.initData = function () {
    LanguageExtensionViewModel_Extend.doAction("init_Extend", this);
};
