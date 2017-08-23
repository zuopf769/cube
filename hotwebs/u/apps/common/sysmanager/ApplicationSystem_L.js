var ApplicationSystemViewModel = function(name) {
    cb.model.ContainerModel.call(this, null, name || "ApplicationSystemViewModel");
    this.init();
};
ApplicationSystemViewModel.prototype = new cb.model.ContainerModel();
ApplicationSystemViewModel.prototype.constructor = ApplicationSystemViewModel;

ApplicationSystemViewModel.prototype.init = function() {
    var fields = {
        ViewModelName: "ApplicationSystemViewModel",
        Symbol: "sysmanager.ApplicationSystem",
        code: new cb.model.SimpleModel({
            isNullable: false
        }),
        name: new cb.model.SimpleModel({
            isNullable: false
        }),
        effectDate: new cb.model.SimpleModel({
            defaultValue: "@SYSDATE",
            isNullable: false
        }),
        dataSourceName: new cb.model.SimpleModel({
            title: "数据源",
            noinput: true
        }),
        companyOrgApp: new cb.model.SimpleModel(),
        companyName: new cb.model.SimpleModel(),
        shortname: new cb.model.SimpleModel(),
        companyCode: new cb.model.SimpleModel(),
        domain: new cb.model.SimpleModel(),
        addr: new cb.model.SimpleModel(),
        juridicalperson: new cb.model.SimpleModel(),
        postcode: new cb.model.SimpleModel(),
        phone: new cb.model.SimpleModel(),
        fax: new cb.model.SimpleModel(),
        email: new cb.model.SimpleModel(),
        taxnumber: new cb.model.SimpleModel(),
        mutilaccount: new cb.model.SimpleModel({
            ctrlType: "ComboBox",
            owner: "DeliveryDetail 发货单",
            dataSource: [{
                text: "是",
                value: "true"
            }, {
                text: "否",
                value: "false"
            }],
            enable: false
        }),
        def1: new cb.model.SimpleModel(),
        def2: new cb.model.SimpleModel(),
        standardmoney: new cb.model.SimpleModel({
            title: "本位币",
            refKey: "pk_currtype",
            refCode: "code",
            refName: "name",
            ctrlType: "Refer",
            refId: "OrgBaseCurrency"
        }),
        accountingperiod: new cb.model.SimpleModel({
            title: "会计期间",
            refKey: "pk_accperiodscheme",
            refCode: "code",
            refName: "name",
            ctrlType: "Refer",
            refId: "OrgAccperiodScheme"
        }),
        langvalues: new cb.model.SimpleModel({
            title: "主语种"
        }),
        langvalues1: new cb.model.SimpleModel({
            enable: false,
        }),
        langvalues2: new cb.model.SimpleModel({
            enable: false,
        }),
        tabMenu: new cb.model.SimpleModel({
            isNeedCollect: false,
            dataSource: [{
                content: "baseinfo",
                isSelected: true
            }]
        }),
        ApplicationMenus: new cb.model.Model2D({
            expandAll: true,
            dragAndDrop: false
        }),
        users: new cb.model.Model3D({
            readOnly: false,
            dsMode: "Local",
            height: 300,
            showCheckBox: false,
            title: "管理员",
            ctrlType: "KendoGrid",
            Columns: {
                cuserid: {
                    title: "管理员主键",
                    ctrlType: "TextBox",
                    owner: "adminForm 管理员",
                    isVisible: false,
                },
                user_code: {
                    title: "管理员编码",
                    ctrlType: "TextBox",
                    owner: "adminForm 管理员",
                    isNullable: false
                },
                user_name: {
                    title: "管理员名称",
                    ctrlType: "TextBox",
                    owner: "adminForm 管理员",
                    isNullable: false
                },
                user_password: {
                    title: "密码",
                    ctrlType: "Password",
                    owner: "adminForm 管理员",
                    isNullable: false
                },
                user_password1: {
                    title: "密码确认",
                    ctrlType: "Password",
                    owner: "adminForm 管理员",
                    isNullable: false
                },
                pwdlevelcode: {
                    title: "密码策略",
                    ctrlType: "ComboBox",
                    owner: "DeliveryDetail 发货单",
                    dataType: "string",
                    width: 140,
                    defaultValue: "update"
                },
                identityverifycode: {
                    defaultValue: "staticpwd",
                    title: "认证方式",
                    ctrlType: "ComboBox",
                    owner: "adminForm 管理员",
                    dataSource: [{
                        value: "staticpwd",
                        text: "静态密码"
                    }, {
                        value: "ncca",
                        text: "CA认证"
                    }, ],
                    defaultValue: "staticpwd"
                },
                abledate: {
                    title: "生效日期",
                    ctrlType: "DateBox",
                    dataType: "date",
                    width: 100,
                    defaultValue: 0
                },
                disabledate: {
                    title: "失效日期",
                    ctrlType: "DateBox",
                    dataType: "date",
                    width: 100,
                    defaultValue: 3650
                },
                islocked: {
                    title: "是否锁定",
                    ctrlType: "ComboBox",
                    owner: "DeliveryDetail 发货单",
                    defaultValue: "false",
                    dataSource: [{
                        text: "是",
                        value: "true"
                    }, {
                        text: "否",
                        value: "false"
                    }],
                    dataType: "string"
                },
                dealbusi: {
                    title: "是否参与业务",
                    ctrlType: "ComboBox",
                    owner: "DeliveryDetail 发货单",
                    dataSource: [{
                        text: "是",
                        value: "true"
                    }, {
                        text: "否",
                        value: "false"
                    }],
                    dataType: "string",
                    width: 140,
                    defaultValue: "true"
                },
            },
            commands: {
                cmds: [{
                    name: 'add',
                    text: "<img src='apps/common/sysmanager/image/add.png'/>"
                }, {
                    name: "delete",
                    text: "<img src='apps/common/sysmanager/image/delete.png'/>"
                }],
                isVisible: false,
                width: 60,
                pos: -1,
            }
        }),
        expandAction: new cb.model.SimpleModel(),
        addAction: new cb.model.SimpleModel({
            title: "新增",
            ctrlType: "Button",
            owner: "Toolbar 功能"
        }),
        editAction: new cb.model.SimpleModel({
            title: "编辑",
            ctrlType: "Button",
            owner: "Toolbar 功能"
        }),
        saveAction: new cb.model.SimpleModel({
            title: "保存",
            ctrlType: "Button",
            owner: "Toolbar 功能"
        }),
        deleteAction: new cb.model.SimpleModel({
            title: "删除",
            ctrlType: "Button",
            owner: "Toolbar 功能"
        }),
        cancleAction: new cb.model.SimpleModel({
            title: "取消",
            ctrlType: "Button",
            owner: "Toolbar 功能"
        }),
        editAmAction: new cb.model.SimpleModel({
            title: "编辑",
            ctrlType: "Button",
            owner: "Toolbar 功能"
        }),
        addAmAction: new cb.model.SimpleModel({
            title: "增加",
            ctrlType: "Button",
            owner: "Toolbar 功能"
        }),
        saveAmAction: new cb.model.SimpleModel({
            title: "保存",
            ctrlType: "Button",
            owner: "Toolbar 功能"
        }),
        deleteAmAction: new cb.model.SimpleModel({
            title: "删除",
            ctrlType: "Button",
            owner: "Toolbar 功能"
        }),
        updateAction: new cb.model.SimpleModel({
            title: "系统升级",
            ctrlType: "Button",
            owner: "Toolbar 功能"
        }),
        addAppData: new cb.model.SimpleModel({
            "displayMode": "addApp"
        }),
        addapp: new cb.model.SimpleModel({
            title: "添加应用",
            ctrlType: "Button",
            owner: "Toolbar 功能"
        }),
        lockAction: new cb.model.SimpleModel({
            title: "锁定",
            ctrlType: "Button",
            owner: "Toolbar 功能"
        }),
        printAction: new cb.model.SimpleModel({
            title: "输出",
            ctrlType: "Button",
            owner: "Toolbar 功能"
        }),
        importAction: new cb.model.SimpleModel({
            title: "输入",
            ctrlType: "Button",
            owner: "Toolbar 功能"
        }),
        importAction2: new cb.model.SimpleModel({
            title: "引入",
            ctrlType: "Button",
            owner: "Toolbar 功能"
        }),
        languageExtension: new cb.model.SimpleModel({
            title: "语言扩展",
            ctrlType: "Button",
            owner: "Toolbar 功能"
        }),

    };
    this.setData(fields);
    this.setDirty(false);

    //事件注册---需要整理，框架需要变动
    this.getaddAction().on("click", function(args) {
        ApplicationSystemViewModel_Extend.addAction(this.getParent(), args);
    });
    this.geteditAction().on("click", function(args) {
        ApplicationSystemViewModel_Extend.editAction(this.getParent(), args);
    });
    this.getsaveAction().on("click", function(args) {
        ApplicationSystemViewModel_Extend.saveAction(this.getParent(), args);
    });
    this.getdeleteAction().on("click", function(args) {
        ApplicationSystemViewModel_Extend.deleteAction(this.getParent(), args);
    });
    this.getApplicationMenus().on("click", function(args) {
        ApplicationSystemViewModel_Extend.appMenuClick(this.getParent(), args);
    });
    this.geteditAmAction().on("click", function(args) {
        ApplicationSystemViewModel_Extend.editAmAction(this.getParent(), args);
    });
    this.getaddAmAction().on("click", function(args) {
        ApplicationSystemViewModel_Extend.addAmAction(this.getParent(), args);
    });
    this.getsaveAmAction().on("click", function(args) {
        ApplicationSystemViewModel_Extend.saveAmAction(this.getParent(), args);
    });
    this.getdeleteAmAction().on("click", function(args) {
        ApplicationSystemViewModel_Extend.deleteAmAction(this.getParent(), args);
    });
    this.getaddAppData().on("click", function(args) {
        ApplicationSystemViewModel_Extend.addappClick(this.getParent(), args);
    });
    this.getupdateAction().on("click", function(args) {
        ApplicationSystemViewModel_Extend.updateAction(this.getParent(), args);
    });
    this.getaddapp().on("click", function(args) {
        ApplicationSystemViewModel_Extend.addapplication(this.getParent(), args);
    });
    this.getlockAction().on("click", function(args) {
        ApplicationSystemViewModel_Extend.lockAction(this.getParent(), args);
    });
    this.getcancleAction().on("click", function(args) {
        ApplicationSystemViewModel_Extend.cancleAction(this.getParent(), args);
    });
    this.getlangvalues1().on("afterchange", function(args) {
        ApplicationSystemViewModel_Extend.langvalues1(this.getParent(), args);
    });
    this.getlangvalues2().on("afterchange", function(args) {
        ApplicationSystemViewModel_Extend.langvalues2(this.getParent(), args);
    });
    this.getprintAction().on("click", function(args) {
        ApplicationSystemViewModel_Extend.printAction(this.getParent(), args);
    });
    this.getimportAction().on("click", function(args) {
        ApplicationSystemViewModel_Extend.importAction(this.getParent(), args);
    });
    this.getimportAction2().on("click", function(args) {
        ApplicationSystemViewModel_Extend.importAction(this.getParent(), args);
    });
    this.getlanguageExtension().on("click", function(args) {
        ApplicationSystemViewModel_Extend.languageExtension(this.getParent(), args);
    });

    this.getdataSourceName().on("afterchange", function(args) {
        ApplicationSystemViewModel_Extend.dataSourceName(this.getParent(), args);
    });
    var proxyConfig = {
        //GetMenu: { url: "classes/General/UAP/LoginLogs", method: "Post" }
        //GetMenu2:{} 请求服务
        GetReModule: {
            url: "upservices/up.itf.uap.update.service.IUpdateAccountsService/UAP/requiredShips",
            method: "Post" , mask:true
        },
        GetApplicationMenus: {
            url: "upservices/up.itf.uap.sysmng.service.ISystemManageService/UAP/getBusiCenterVOsWithAdm",
            method: "Post" , mask:true
        },
        //GetApplicationDetail:{url: "upservices/up.itf.uap.sysmng.service.ISystemManageService/UAP/getBusiCenterVOByCode", method: "Post"},
        SaveApplicationSystems: {
            url: "upservices/up.itf.uap.sysmng.service.ISystemManageService/UAP/updateBusiCenterVOWithAdm",
            method: "Post" , mask:true
        },
        GetAdminForm: {
            url: "upservices/up.itf.uap.sysmng.service.ISystemManageService/UAP/queryAllSysAdms",
            method: "Post" , mask:true
        },
        SaveAdminForm: {
            url: "upservices/up.itf.uap.sysmng.service.ISystemManageService/UAP/saveOrUpdateSysAdms",
            method: "Post" , mask:true
        },
        DeleteAdminForm: {
            url: "upservices/up.itf.uap.sysmng.service.ISystemManageService/UAP/deleteSysAdms",
            method: "Post" , mask:true
        },
        GetdeleteBusiCenterVO: {
            url: "upservices/up.itf.uap.sysmng.service.ISystemManageService/UAP/deleteBusiCenterVO",
            method: "Post" , mask:true
        },
        lockAction: {
            url: "upservices/up.itf.uap.sysmng.service.ISystemManageService/UAP/doLockBC",
            method: "Post" , mask:true
        },
        GetDataSource: {
            url: "upservices/up.itf.uap.sysmng.service.ISystemManageService/UAP/queryAllDataSources",
            method: "Post"
        },
        GetAllLanguages: {
            url: "upservices/up.itf.uap.sysmng.service.ISystemManageService/UAP/getAllLanguages",
            method: "Post"
        },
        GetInforByDs: {
            url: "upservices/up.itf.uap.sysmng.service.ISystemManageService/UAP/getCompanyInfoAndAdmsByDateSourceCode",
            method: "Post"
        }
    }
    this.setProxy(proxyConfig);
    this.initData();
};

ApplicationSystemViewModel.prototype.initData = function() {
    ApplicationSystemViewModel_Extend.doAction("init_Extend", this);
};
