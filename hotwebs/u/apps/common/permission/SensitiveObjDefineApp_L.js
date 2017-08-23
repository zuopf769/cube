/// <reference path="../../../common/js/Cube.js" />
/// <reference path="SensitiveObjDefineApp_Extend.js" />
var SensitiveObjDefineViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "SensitiveObjDefineViewModel");
    this.init();
}
SensitiveObjDefineViewModel.prototype = new cb.model.ContainerModel();
SensitiveObjDefineViewModel.prototype.constructor = SensitiveObjDefineViewModel;

SensitiveObjDefineViewModel.prototype.init = function () {

    var fields = {
        sensitiveId: "",
        ViewModelName: "SensitiveObjDefineViewModel",
        sensitiveObjList: new cb.model.SimpleModel(),
        mappingFields: new cb.model.Model3D(
            {
                dsMode: 'false', title: "数据映射对象", ctrlType: "DataGrid", owner: "MappingFields 数据映射对象",
                height: '460px', pageSize: -1, readOnly: true,
                Columns: {
                    id: { isVisible: false },
                    viewModelName: {
                        title: "业务对象",
                        //refKey: "modelKey", refId: "id", refCode: "code", refName: "name",
                        //refPath: "common.permission.BusObjRefApp",
                        //ctrlType: "Refer", refShowMode: "Code",
                        //owner: "MappingFieldsSubLine 数据映射对象行"
                    },
                    fieldName: {
                        title: "对应字段",
                        //refKey: "fieldKey", refId: "id", refCode: "code", refName: "name",
                        //ctrlType: "Refer",
                        //refShowMode: "Name", owner: "MappingFieldsSubLine 数据映射对象行"
                    },
                }
            }),
        authoritySensitiveDatas: new cb.model.Model3D(
            {
                readOnly: false, pageSize: -1,
                dsMode: 'false', height: '460px',
                showCheckBox: false,
                title: "敏感数据直接授权", ctrlType: "DataGird", owner: "AuthoritySensitiveDatas 敏感数据直接授权",
                Columns: {
                    id: { isVisible: false },
                    sensitiveObject: { isVisible: false },
                    roles: { title: "用户/角色", editable: false, ctrlType: "TextBox", owner: "AuthoritySensitiveData 直接授权敏感数据" },
                    authTarget: { isVisible: false },
                    authName: { title: "名称", editable: false, ctrlType: "TextBox", owner: "AuthoritySensitiveData 直接授权敏感数据" },
                    noAuth: { title: "无权", ctrlType: "CheckBox", owner: "AuthoritySensitiveData 直接授权敏感数据" },
                    readonlyAuth: { title: "只读", ctrlType: "CheckBox", owner: "AuthoritySensitiveData 直接授权敏感数据" },
                    auth: { title: "读写", ctrlType: "CheckBox", owner: "AuthoritySensitiveData 直接授权敏感数据" },
                }
            }),
        addSensitiveData: new cb.model.SimpleModel(),
        deleteSensitiveData: new cb.model.SimpleModel(),
        addPerson: new cb.model.SimpleModel(),
        saveAuthority: new cb.model.SimpleModel()
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
        //http://172.20.8.145:8080/classes/Login/UAP/DeleteSensitiveField?token=c4d902edb0194e49b8aab1b5140c201d
        DeleteSensitiveFields: { url: "classes/Login/UAP/DeleteSensitiveField", method: "Post" },
        //新增用户角色权限
        //SaveUserRoleSensitiveObject?token=dc3b3595f89d4ded91b63749ae81dd54
        //        //1.	[
        //        2.	 { id:"1", sensitiveObject:"1", authTarget:"1", authTargetType:0, authStat:0 }, 
        //        3.	 { id:"2", sensitiveObject:"2", authTarget:"2", authTargetType:0, authStat:1 }
        //4.	 ]
        SaveUserRoleSensitiveObj: { url: "classes/Login/UAP/SaveUserRoleSensitiveObject", method: "Post" },
        //根据敏感权限ID获取权限
        //URL:http://127.0.0.1:8080/classes/Login/UAP/GetUserRoleAuthBySensitiveObject?token=011eb1645ef348aba157a7e734628f53&sensitiveObject=fec79b14-b413-11e4-9f58-b58942c2722e
        GetUserRoleAuth: { url: "classes/Login/UAP/GetUserRoleAuthBySensitiveObject", method: "Get" }
    };
    this.setProxy(proxyConfig);

    this.getaddSensitiveData().on('click',
        function (args) {
            SensitiveObjDefineViewModelApp_Extend.addSensitiveField(this.getParent(), "common.permission.BusObjRefApp")
            , args
        });
    this.getdeleteSensitiveData().on('click',
        function (args) { SensitiveObjDefineViewModelApp_Extend.deleteSensitiveField(this.getParent()), args });
    this.getaddPerson().on('click',
        function (args) {
            SensitiveObjDefineViewModelApp_Extend.addDirectAuthorization(this.getParent(), "common.permission.RoleUserRefApp")
            , args
        });
    this.getsaveAuthority().on('click',
        function (args) { SensitiveObjDefineViewModelApp_Extend.saveDirectAuthorization(this.getParent()), args });
    this.getsensitiveObjList().on('loadBusField',
        function (args) { SensitiveObjDefineViewModelApp_Extend.getSenstiveField(this.getParent(), args), args });
    this.getsensitiveObjList().on('setAuthority',
        function (args) {
            SensitiveObjDefineViewModelApp_Extend.setDirectAuthorization(this.getParent(), args),
            args
        });
    this.getsensitiveObjList().on('deleteSensObj',
        function (args) { SensitiveObjDefineViewModelApp_Extend.deleteSensitiveObject(this.getParent(), args), args });
    this.getsensitiveObjList().on('sensitiveObjAdded',
        function (args) { SensitiveObjDefineViewModelApp_Extend.addSensitiveObj(this.getParent(), args), args });
    this.getmappingFields().on('mappingFieldAdded',
        function (args) { SensitiveObjDefineViewModelApp_Extend.addMappingField(this.getParent(), args), args });
    this.getauthoritySensitiveDatas().on('filedsAdded',
        function (args) { SensitiveObjDefineViewModelApp_Extend.directAuthorizationAdded(this.getParent(), args), args });
    this.getauthoritySensitiveDatas().on('aftercellchange',
        function (args) { SensitiveObjDefineViewModelApp_Extend.authorityCellChange(this.getParent(), args) });

    this.initData();
}

SensitiveObjDefineViewModel.prototype.initData = function () {
    SensitiveObjDefineViewModelApp_Extend.doAction('init_Extend', this);
}