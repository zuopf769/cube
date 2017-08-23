/// <reference path="../../../common/js/Cube.js" />
/// <reference path="SensitiveObjDefineApp_Extend.js" />
var SensiObjDefineViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "SensiObjDefineViewModel");
    this.init();
}
SensiObjDefineViewModel.prototype = new cb.model.ContainerModel();
SensiObjDefineViewModel.prototype.constructor = SensiObjDefineViewModel;

SensiObjDefineViewModel.prototype.init = function () {

    var fields = {
        sensitiveId: "",
        ViewModelName: "SensiObjDefineViewModel",
        sensitiveObjList: new cb.model.SimpleModel(),
        fieldGrid: new cb.model.Model31D(
            {
                title: "数据映射对象", ctrlType: "DataGrid", owner: "MappingFields 数据映射对象",
                dsMode: 'false', readOnly: false,
                Columns: {
                    viewModelName: {
                        title: "业务对象", type: "string", ctrlType: 'TextBox', visible: false,
                        //refKey: "modelKey", refId: "id", refCode: "code", refName: "name",
                        //refPath: "common.permission.BusObjRefApp",
                        //ctrlType: "Refer", refShowMode: "Code", owner: "MappingFieldsSubLine 数据映射对象行"
                    },
                    fieldName: {
                        title: "对应字段", type: "string", ctrlType: 'TextBox', visible: false,
                        //refKey: "fieldKey", refId: "id", refCode: "code", refName: "name",
                        //ctrlType: "Refer", refShowMode: "Name", owner: "MappingFieldsSubLine 数据映射对象行"
                    },
                    fieldId: {
                        //title: "测试参照FieldID",
                        width: 150,
                        type: 'string', ctrlType: 'Refer',
                        title: "客户编码", nullable: false,
                        refKey: "ccuscode_pk",
                        refCode: "code", refName: "name", refId: "customer",
                        refShowMode: "Code",
                        //refRelation: "ccusname=name,ccusabbname=ccusabbname,cvconperson=ccusperson,cvshipaddress=ccusoaddress,cpersoncode=ccuspperson,cperson=ccuspperson.name",
                        owner: "somain 订单主表"
                    },
                    fieldCode: {
                        title: "测试checkBoxFieldCode", type: 'boolean', ctrlType: 'CheckBox'
                    },
                    viewModelCode: {
                        width: 150,
                        title: "测试部门checkBoxviewModelCode", type: 'string', ctrlType: 'Refer',
                        refKey: "pk_dept", refCode: "code",
                        refName: "name", ctrlType: "Refer",
                        refId: "600905", refShowMode: "Name",
                    }
                },
            }),
        authorityGrid: new cb.model.Model31D(
            {
                title: "敏感数据直接授权", ctrlType: "DataGird", owner: "AuthoritySensitiveDatas 敏感数据直接授权",
                Columns: {
                    rolesCol: { title: "用户/角色", ctrlType: "CheckBox", owner: "AuthoritySensitiveData 直接授权敏感数据" },
                    userName: { title: "名称", ctrlType: "Refer", owner: "AuthoritySensitiveData 直接授权敏感数据" },
                    noAuthority: { title: "无权", ctrlType: "CheckBox", owner: "AuthoritySensitiveData 直接授权敏感数据" },
                    readOnly: { title: "只读", ctrlType: "CheckBox", owner: "AuthoritySensitiveData 直接授权敏感数据" },
                    readWrite: { title: "读写", ctrlType: "CheckBox", owner: "AuthoritySensitiveData 直接授权敏感数据" }
                }
            }),
        //fieldGrid: new cb.model.SimpleModel(),
        //authorityGrid: new cb.model.SimpleModel(),
        addSensitiveData: new cb.model.SimpleModel(),
        deleteSensitiveData: new cb.model.SimpleModel(),
        addPerson: new cb.model.SimpleModel(),
        saveAuthority: new cb.model.SimpleModel(),
        testBtn: new cb.model.SimpleModel()
    };
    this.setData(fields);
    this.setDirty(false);

    var proxyConfig = {
        //获取用户角色树
        GetRoleUser: { url: "classes/Login/UAP/GetRoleUser", method: "Get" },
        //表单字段权限服务
        GetFieldPerm: { url: "classes/Login/UAP/GetFieldPerm", method: "Get" },
        //根据用户、角色主键，获取字段权限定义
        GetUserRoleFieldPerm: { url: "classes/Login/UAP/GetUserRoleFieldPerm", method: "Get" },
        //获取可授权业务对象
        GetBusinessEntity: { url: "classes/Login/UAP/GetBusinessEntity", method: "Get" },
        //领域和模块菜单服务
        GetDomainMenu: { url: "classes/Login/UAP/GetDomainMenu", method: "Get" },
        //敏感对象加载服务
        GetSensitiveObjectList: { url: "classes/Login/UAP/GetSensitiveObjectList", method: "Get" },
        //根据敏感对象加载敏感字段定义
        GetSensitiveField: { url: "classes/Login/UAP/GetSensitiveField", method: "Get" },
        //删除敏感对象定义
        DeleteSensitiveObject: { url: "classes/Login/UAP/DeleteSensitiveObject", method: "Get" },
        //子集菜单服务
        GetSubMenu: { url: "classes/Login/UAP/GetSubMenu", method: "Get" },
        //最近操作菜单统计服务
        UpdateMenuStats: { url: "classes/Login/UAP/UpdateMenuStats", method: "Get" },
        //新增保存敏感数据对象
        SaveSensitiveOBj: { url: "classes/General/UAP/SaveSensObj", method: "Post" },
        //删除敏感数据业务对象
        DeleteSensitiveFields: { url: "classes/Login/UAP/DeleteSensitiveField", method: "Post" },
        //获取用户/角色的敏感对象权限设定
        //http://127.0.0.1:8080/classes/Login/UAP/GetUserRoleSensitiveObject?token=2bf62842980f4509bbfc974e1c2bb7be&authTarget=1001ZZ100000000008HW&authTargetType=0
        GetUserRoleSensiAuth: { url: "classes/Login/UAP/GetUserRoleSensitiveObject", method: "Get" },
        //保存用户/角色的敏感对象权限设定
        //http://127.0.0.1:8080/classes/Login/UAP/SaveUserRoleSensitiveObject?token=dc3b3595f89d4ded91b63749ae81dd54
        SaveUserRoleSensiAuth: { url: "classes/Login/UAP/SaveUserRoleSensitiveObject", method: "Post" }
    };

    this.setProxy(proxyConfig);

    this.getaddSensitiveData().on('click',
        function (args) {
            SensiObjDefineViewModelApp_Extend.addSensitiveField(
                  this.getParent(), "common.permission.BusObjRefApp"), args
        });
    this.getdeleteSensitiveData().on('click',
        function (args) { SensiObjDefineViewModelApp_Extend.deleteSensitiveField(this.getParent()), args });
    this.getaddPerson().on('click',
        function (args) { SensiObjDefineViewModelApp_Extend.addSensitiveObj(this.getParent()), args });
    this.getsaveAuthority().on('click',
        function (args) { SensiObjDefineViewModelApp_Extend.saveDirectAuthorization(this.getParent()), args });
    this.getsensitiveObjList().on('loadBusField',
        function (args) { SensiObjDefineViewModelApp_Extend.getSenstiveField(this.getParent(), args), args });
    this.getsensitiveObjList().on('setAuthority',
        function (args) { SensiObjDefineViewModelApp_Extend.setDirectAuthorization(this.getParent(), args), args });
    this.getsensitiveObjList().on('deleteSensObj',
        function (args) { SensiObjDefineViewModelApp_Extend.deleteSensitiveObject(this.getParent(), args), args });
    this.getsensitiveObjList().on('sensitiveObjAdded',
        function (args) { SensiObjDefineViewModelApp_Extend.addSensitiveObj(this.getParent(), args), args });
    //this.getmappingFields().on('mappingFieldAdded',
    //    function (args) { SensiObjDefineViewModelApp_Extend.addMappingField(this.getParent(), args), args });
    this.gettestBtn().on('click',
        function (args) { SensiObjDefineViewModelApp_Extend.testGrid(this.getParent(), args), args });

    this.initData();
}

SensiObjDefineViewModel.prototype.initData = function () {
    SensiObjDefineViewModelApp_Extend.doAction('init_Extend', this);
}