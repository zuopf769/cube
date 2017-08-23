var SuperAdminViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "SuperAdminViewModel");
    this.init();
};
SuperAdminViewModel.prototype = new cb.model.ContainerModel();
SuperAdminViewModel.prototype.constructor = SuperAdminViewModel;

SuperAdminViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "SuperAdminViewModel",
        deleteAction: new cb.model.SimpleModel(),
        saveAction: new cb.model.SimpleModel(),
        editAction: new cb.model.SimpleModel(),
        cancleAction: new cb.model.SimpleModel(),
        adminVos: new cb.model.Model3D({
            readOnly: false,
            height:500,
            Columns: {
                admCode: { title: "管理员编码", ctrlType: "TextBox", owner: "DeliveryDetail 发货单", isNullable: false, width: "auto", refShowMode: "LetterDigit", iLength: 20 },
                admName: { title: "管理员名称", ctrlType: "TextBox", owner: "DeliveryDetail 发货单", isNullable: false, width: "auto" },
                password: { title: "管理员密码", ctrlType: "Password", owner: "DeliveryDetail 发货单", isNullable: false, width: "auto" },
                pwdinuse: { title: "密码确认", ctrlType: "Password", owner: "DeliveryDetail 发货单", isNullable: false, width: "auto" },
                identify: {
                    title: "认证方式", ctrlType: "ComboBox", owner: "DeliveryDetail 发货单", dataSource: [
                        { text: "静态密码", value: "staticpwd" },
                        { text: "CA认证", value: "ncca" }
                    ], isNullable: false, width: "auto", defaultValue: "staticpwd"
                },
                isLocked: {
                    title: "是否锁定", ctrlType: "ComboBox", owner: "DeliveryDetail 发货单",
                    dataSource: [
                                    { text: "是", value:"true" },
                                    { text: "否", value:"false" }
                    ],
                    isNullable: false, width: "auto", dataType: "string", defaultValue: "false"
                },
            },
            commands: {
                isVisible:false,
                width:60,
                cmds: [{ name: 'add', text: "<img src='apps/common/sysmanager/image/add.png'/>" }, { name: "delete", text: "<img src='apps/common/sysmanager/image/delete.png'/>" }],
            }
        }),

    };
    this.setData(fields);
    this.setDirty(false);

    this.getdeleteAction().on("click", function (args) { SuperAdminViewModel_extend.deleteAction(this.getParent(), args); });
    this.getsaveAction().on("click", function (args) { SuperAdminViewModel_extend.saveAction(this.getParent(), args); });
    this.geteditAction().on("click", function (args) { SuperAdminViewModel_extend.editAction(this.getParent(), args); });
    this.getcancleAction().on("click", function (args) { SuperAdminViewModel_extend.cancleAction(this.getParent(), args); });
    var proxyConfig = {
        LoadData: { url: "upservices/up.itf.uap.sysmng.service.ISystemManageService/UAP/getAllAdms", method: "Post", mask:true },
        UpdateAdmin: { url: "upservices/up.itf.uap.sysmng.service.ISystemManageService/UAP/batchOperateAdmsNew", method: "Post", mask:true },//更新超级管理员
    };
    this.setProxy(proxyConfig);

    this.initData();
};

SuperAdminViewModel.prototype.initData = function () {
    SuperAdminViewModel_extend.doAction("init_Extend", this);
};