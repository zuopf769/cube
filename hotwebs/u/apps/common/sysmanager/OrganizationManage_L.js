/// <reference path="../../../common/js/Cube.js" />
var OrganizationManageViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "OrganizationManageViewModel");
    this.init();
};
OrganizationManageViewModel.prototype = new cb.model.ContainerModel();
OrganizationManageViewModel.prototype.constructor = OrganizationManageViewModel;

OrganizationManageViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "OrganizationManageViewModel",
        Symbol: "sysmanager.OrganizationManage",
        code: new cb.model.SimpleModel({ title: "编码", isNullable: false, placeHolder: '请输入字母、数字' }),
        name: new cb.model.SimpleModel({ title: "名称", isNullable: false }),
        type: new cb.model.SimpleModel({
            DataSource:  [
                    { value: 0, text: "内部" },
                    { value: 1, text: "外部" }
            ]
        }),
        workcalendar: new cb.model.SimpleModel({ title: "工作日历", refKey: "pk_workcalendar", refCode: "code", refName: "name", ctrlType: "Refer", refId: "OrgWorkCalendar" }),
        shortname: new cb.model.SimpleModel({ title: "简称", isNullable: false }),
        entitytype: new cb.model.SimpleModel({ title: "组织形态","isNullable":false, isVisible: true, refKey: "pk_defdoc", refCode: "code", refName: "name", ctrlType: "Refer", refRelation: "entitytype_content=name", refId: "OrgEntityType" }),
        entitytype_content: new cb.model.SimpleModel(),
        orgtype2: new cb.model.SimpleModel({ title: "法人公司" }),
        legalbodycode: new cb.model.SimpleModel({ title: "法人代表" }),
        createdate: new cb.model.SimpleModel({ title: "成立日期" }),
        postaddr: new cb.model.SimpleModel({ title: "办公地址" }),
        url: new cb.model.SimpleModel({ title: "网站" }),
        zipcode: new cb.model.SimpleModel({ title: "邮政编码" }),
        phone: new cb.model.SimpleModel({ title: "联系电话" }),
        fax: new cb.model.SimpleModel({ title: "传真" }),
        linkman: new cb.model.SimpleModel({ title: "联系人" }),
        owncorp: new cb.model.SimpleModel({ title: "隶属法人组织", refKey: "pk_org", refCode: "code", refName: "name", ctrlType: "Refer", refId: "OrgOwnCorp" }),
        enabledate: new cb.model.SimpleModel({ title: "" }),
        fatherorg: new cb.model.SimpleModel({ title: "上级行政组织", refKey: "pk_org", refCode: "code", refName: "name", ctrlType: "Refer", refId: "OrgFatherOrg" }),
        disabledate: new cb.model.SimpleModel(),
        enablestate: new cb.model.SimpleModel(),
        orgBox: new cb.model.SimpleModel(),
        purchasingorganization: new cb.model.SimpleModel({ title: "采购" }),
        salesorganization: new cb.model.SimpleModel({ title: "销售" }),
        financialorganization: new cb.model.SimpleModel({ title: "财务" }),
        inventoryorganization: new cb.model.SimpleModel({ title: "库存" }),
        factoryorganization: new cb.model.SimpleModel({ title: "工厂" }),
        multiaccountingrecords: new cb.model.SimpleModel({ title: "多账簿" }),
        currencytype: new cb.model.SimpleModel({ title: "本位币", isNullable: false, refKey: "pk_currtype", refCode: "code", refName: "name", ctrlType: "Refer", refId: "OrgBaseCurrency" }),
        accperiodscheme: new cb.model.SimpleModel({ title: "会计期间", isNullable: false, refKey: "pk_accperiodscheme", refCode: "code", refName: "name", ctrlType: "Refer", refId: "OrgAccperiodScheme" }),
        ownorg: new cb.model.SimpleModel({ title: "" }),
        tabMenu: new cb.model.SimpleModel({
            isNeedCollect: false, mode: "strip", dataSource: [
				{ content: "baseinfo", isSelected: true },//业务单元
                { content: "addApplication" },
				{ content: "user" },
				{ content: "role" }
            ]
        }),
        parameterSettingMenu: new cb.model.SimpleModel({
            isNeedCollect: false, mode: "strip", dataSource: [
				{ content: "financialContent", isSelected: true },//参数设置
                { content: "salesContent" },
            ]
        }),
        OrganizationMenus: new cb.model.Model2D({ expandAll:true}),
        OrganizationTitle: new cb.model.SimpleModel({}),
        expandAction: new cb.model.SimpleModel(),
        addAction: new cb.model.SimpleModel({ title: "新增", ctrlType: "Button", owner: "Toolbar 功能" }),
        editAction: new cb.model.SimpleModel({ title: "编辑", ctrlType: "Button", owner: "Toolbar 功能" }),
        saveAction: new cb.model.SimpleModel({ title: "保存", ctrlType: "Button", owner: "Toolbar 功能" }),
        deleteAction: new cb.model.SimpleModel({ title: "删除", ctrlType: "Button", owner: "Toolbar 功能" }),
        startAction: new cb.model.SimpleModel({ title: "启用", ctrlType: "Button", owner: "Toolbar 功能" }),
        stopAction: new cb.model.SimpleModel({ title: "停用", ctrlType: "Button", owner: "Toolbar 功能" }),
        changeAction: new cb.model.SimpleModel({ title: "变更", ctrlType: "Button", owner: "Toolbar 功能" }),
        cancelAction: new cb.model.SimpleModel({ title: "取消", ctrlType: "Button", owner: "Toolbar 功能" }),

        //业务期初期间
        appSaveAction: new cb.model.SimpleModel({ title: "保存", ctrlType: "Button", owner: "Toolbar 功能" }),
        allNullAction: new cb.model.SimpleModel({ title: "批量设置为空", ctrlType: "Button", owner: "Toolbar 功能" }),
        DateStartAction: new cb.model.SimpleModel({ title: "批量设置为年初期间", ctrlType: "Button", owner: "Toolbar 功能" }),
        DateNowAction: new cb.model.SimpleModel({ title: "批量设置为当前期间", ctrlType: "Button", owner: "Toolbar 功能" }),
        ApplicationGrid: new cb.model.Model3D({
            pager: 'pager1', height: "500px",
            dsMode: 'local', readOnly: false, showCheckBox: false,
            title: "", ctrlType: "DataGrid", Columns: {
                app_num: { title: "序号", ctrlType: "TextBox", owner: "", width: "10%" },
                app_businessunit: { title: "业务单元", ctrlType: "TextBox", owner: "", width: "26%" },
                app_orgfunction: { title: "组织职能", ctrlType: "textBox", owner: "", width: "22%" },
                app_modalnum: { title: "模块号", ctrlType: "textBox", owner: "", width: "20%" },
                app_accountperiod: { title: "会计期间", refId: '1', refPath: "common.sysmanager.AccountingPeriodApp", ctrlType: "Refer", owner: "", width: "20%" }
            }
        }),
        //用户
        saveUserAction: new cb.model.SimpleModel({ title: "保存", ctrlType: "Button", owner: "Toolbar 功能" }),
        editUserAction: new cb.model.SimpleModel({ title: "编辑", ctrlType: "Button", owner: "Toolbar 功能" }),
        deleteUserAction: new cb.model.SimpleModel({ title: "删除", ctrlType: "Button", owner: "Toolbar 功能" }),
        UserGrid: new cb.model.Model3D({
            pager: 'pager2', height: "500px",
            dsMode: 'local', readOnly: false,
            title: "", ctrlType: "DataGrid", Columns: {
                app_org: { title: "所属组织", ctrlType: "TextBox", owner: "", width: "14%" },
                app_userCode: { title: "用户编码", ctrlType: "TextBox", owner: "", width: "14%" },
                app_userName: { title: "用户名称", ctrlType: "textBox", owner: "", width: "14%" },
                app_identityType: { title: "身份类型", ctrlType: "ComboBox", owner: "", width: "14%" },
                app_identity: { title: "身份", ctrlType: "textBox", owner: "", width: "14%" },
                app_authType: { title: "认证类型", ctrlType: "textBox", owner: "", width: "14%" },
                app_dataFormat: { title: "数据格式", ctrlType: "textBox", owner: "", width: "14%" }
            }
        }),
        AppRefresh: new cb.model.SimpleModel({ title: "刷新", ctrlType: "Button", owner: "Toolbar 功能" }),
        AppFilter: new cb.model.SimpleModel({ title: "过滤", ctrlType: "Button", owner: "Toolbar 功能" }),
        AppSearch: new cb.model.SimpleModel({ title: "搜索", ctrlType: "Button", owner: "Toolbar 功能" }),

        //角色
        saveRoleAction: new cb.model.SimpleModel({ title: "保存", ctrlType: "Button", owner: "Toolbar 功能" }),
        editRoleAction: new cb.model.SimpleModel({ title: "编辑", ctrlType: "Button", owner: "Toolbar 功能" }),
        deleteRoleAction: new cb.model.SimpleModel({ title: "删除", ctrlType: "Button", owner: "Toolbar 功能" }),
        lookRoleAction: new cb.model.SimpleModel({ title: "查看", ctrlType: "Button", owner: "Toolbar 功能" }),
        RoleRefresh: new cb.model.SimpleModel({ title: "刷新", ctrlType: "Button", owner: "Toolbar 功能" }),
        RoleFilter: new cb.model.SimpleModel({ title: "过滤", ctrlType: "Button", owner: "Toolbar 功能" }),
        RoleSearch: new cb.model.SimpleModel({ title: "搜索", ctrlType: "Button", owner: "Toolbar 功能" }),
        RoleGrid: new cb.model.Model3D({
            pager: 'pager3', height: "500px",
            dsMode: 'local', readOnly: false,
            title: "", ctrlType: "DataGrid", Columns: {
                role_org: { title: "所属组织", ctrlType: "TextBox", owner: "", width: "23%" },
                role_userCode: { title: "角色编码", ctrlType: "TextBox", owner: "", width: "23%" },
                role_userName: { title: "角色名称", ctrlType: "textBox", owner: "", width: "23%" },
                role_group: { title: "角色组", ctrlType: "textBox", owner: "", width: "23%" }
            }
        }),
        States: [
            {
                "state": "browse", "actions": [
                    { "field": "addAction", "disable": "0" },
                    { "field": "editAction", "disable": "0" },
                    { "field": "saveAction", "disable": "1" },
                    { "field": "deleteAction", "disable": "0" },
                    { "field": "startAction", "disable": "0" },
                    { "field": "stopAction", "disable": "0" },
                    { "field": "changeAction", "disable": "0" },
                ]
            },
            {
            "state": "add", "actions": [
                { "field": "addAction", "disable": "1" },
                { "field": "editAction", "disable": "1" },
                { "field": "saveAction", "disable": "0" },
                { "field": "deleteAction", "disable": "1" },
                { "field": "startAction", "disable": "0" },
                { "field": "stopAction", "disable": "0" },
                { "field": "changeAction", "disable": "1" },
            ]
            },
            {
                "state": "edit", "actions": [
                    { "field": "addAction", "disable": "1" },
                    { "field": "editAction", "disable": "1" },
                    { "field": "saveAction", "disable": "0" },
                    { "field": "deleteAction", "disable": "1" },
                    { "field": "startAction", "disable": "0" },
                    { "field": "stopAction", "disable": "0" },
                    { "field": "changeAction", "disable": "1" },
                ]
            },
             {
                 "state": "save", "actions": [
                     { "field": "addAction", "disable": "0" },
                     { "field": "editAction", "disable": "0" },
                     { "field": "saveAction", "disable": "1" },
                     { "field": "deleteAction", "disable": "0" },
                     { "field": "startAction", "disable": "0" },
                     { "field": "stopAction", "disable": "0" },
                     { "field": "changeAction", "disable": "0" },
                 ]
             },
        ]
    };
    this.setData(fields);
    this.setDirty(false);
    this.commonCRUD = new cb.data.commonCRUD(this);
    //事件注册---需要整理，框架需要变动
    this.getaddAction().on("click", function (args) { OrganizationManageViewModel_Extend.addAction(this.getParent(), args); });
    this.getcancelAction().on("click", function (args) {
        var viewModel = this.getParent();
        var data = { inputData: args, cancel: false, commonCRUD: viewModel.commonCRUD };
        OrganizationManageViewModel_Extend.cancelAction(viewModel, data);
        //if (data.cancel) return;
        //data.commonCRUD.cancel(args)
    });
    this.geteditAction().on("click", function (args) {
        var viewModel = this.getParent();
        var data = { inputData: args, cancel: false, commonCRUD: viewModel.commonCRUD };
        OrganizationManageViewModel_Extend.editAction(viewModel, data);
        //if (data.cancel) return;
       // data.commonCRUD.edit(args)
    });
    this.getsaveAction().on("click", function (args) {
        var viewModel = this.getParent();
        var data = { inputData: args, cancel: false, commonCRUD: viewModel.commonCRUD };
        OrganizationManageViewModel_Extend.saveAction(viewModel, data);
        //if (data.cancel) return;
        //data.commonCRUD.save(args)
    });
    this.getdeleteAction().on("click", function (args) { OrganizationManageViewModel_Extend.deleteAction(this.getParent(), args); });
    this.getstartAction().on("click", function (args) {
        var viewModel = this.getParent();
        var data = { inputData: args, cancel: false, commonCRUD: viewModel.commonCRUD };
        OrganizationManageViewModel_Extend.startAction(viewModel, args);
    });
    this.getstopAction().on("click", function (args) { OrganizationManageViewModel_Extend.stopAction(this.getParent(), args); });
    this.getchangeAction().on("click", function (args) { OrganizationManageViewModel_Extend.changeAction(this.getParent(), args); });
    this.gettabMenu().on("click", function (args) { OrganizationManageViewModel_Extend.tabMenuClick(this.getParent(), args); });
    this.getOrganizationMenus().on("click", function (args) {
        var viewModel = this.getParent();
        OrganizationManageViewModel_Extend.treeItemClick(viewModel, args);
    });
    this.getApplicationGrid().on('click', function (args) { OrganizationManageViewModel_Extend.applicationGridAction(this.getParent(), args); });
    this.getappSaveAction().on('click', function (args) { OrganizationManageViewModel_Extend.appSaveAction(this.getParent(), args); });
    this.getname().on("afterchange", function (args) { OrganizationManageViewModel_Extend.getnameAction(this.getParent(), args); });
    this.get('entitytype_content').on("aftervaluechange", function (args) { OrganizationManageViewModel_Extend.entitytypeAction(this.getParent(), args); });
    //服务代理
    var proxyConfig = {
        //http://127.0.0.1:8080/upservices/up.uap.base.org.SystemManageService/UAP/GetOrgTree?dataSource=design
        GetOrgTree: { url: "classes/Org/UAP/GetOrgTree", method: "Get", mask:true },
        GetCreateOrg: { url: "classes/Org/UAP/CreateOrg", method: "Post", mask:true },
        GetOrg: { url: "classes/Org/UAP/GetOrg", method: "Get", mask:true },
        GetTitle: { url: "upservices/up.itf.uap.sysmng.service.ISystemManageService/UAP/getBusiCenterVOs", method: "Post", mask:true },
        GetApplicationGrid: { url: "upservices/up.itf.uap.sysmng.service.ISystemManageService/UAP/getBusiCenterVOByCode", method: "Post", mask:true },
        UpdateOrg: { url: "classes/Org/UAP/UpdateOrg", method: "Post", mask:true },
        DeleteOrg: { url: "classes/Org/UAP/DeleteOrg", method: "Post", mask:true },
        EnableOrg: { url: "classes/UAP/UAP/EnableOrg", method: "Get", mask:true },
        DisableOrg: { url: "classes/UAP/UAP/DisableOrg", method: "Get", mask:true },
        OrganizationFunction: { url: "classes/Org/UAP/GetOrgType", method: "Post", mask:true }
        //GetMenu2:{} 请求服务
    };
    this.setProxy(proxyConfig);
    this.initData();
};

OrganizationManageViewModel.prototype.initData = function () {
    OrganizationManageViewModel_Extend.doAction("init_Extend", this);
};
