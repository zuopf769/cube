/// <reference path="../../../common/js/Cube.js" />
/// <reference path="FieldPermApp_Extend.js" />

var FieldPermViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || 'FieldPermViewModel');
    this.init();
}
FieldPermViewModel.prototype = new cb.model.ContainerModel();
FieldPermViewModel.prototype.constructor = FieldPermViewModel;

FieldPermViewModel.prototype.init = function () {

    var fields = {
        ViewModelName: "FieldPermViewModel",
        roleuserlist: new cb.model.Model2D(),
        tabMenu: new cb.model.SimpleModel({
            dataSource: [
               { content: "sensitiveObj", isSelected: true },
               { content: "busField" }
            ]
        }),
        busObjList: new cb.model.SimpleModel(),
        setSensiAuthority: new cb.model.SimpleModel(),
        sensitiveObjects: new cb.model.Model3D(
            {
                title: "敏感数据对象", ctrlType: "DataGrid",
                owner: "sensitiveObjects 敏感数据对象", ReadOnly: true,
                dsMode: 'local', pageSize: -1,
                showCheckBox: false,
                columns: {
                    id: { isVisible: false },
                    authStat: { isVisible: false },
                    sensitiveObjectName: { ReadOnly: true, title: "敏感数据", ctrlType: "TextBox" },
                    sensitiveObject: { isVisible: false, title: "敏感数据对象ID", ctrlType: "TextBox" },
                    noAuth: { title: "无权", ctrlType: "CheckBox" },
                    readonlyAuth: { title: "只读", ctrlType: "CheckBox" },
                    auth: { title: "读写", ctrlType: "CheckBox" },
                }
            }),
        saveSensitiveAuth: new cb.model.SimpleModel(),
        defaultAuth: new cb.model.SimpleModel(),
        roleAuth: new cb.model.SimpleModel(),
        sensitiveAuth: new cb.model.SimpleModel(),
        setBusAuth: new cb.model.SimpleModel(),
        busFields: new cb.model.Model3D(
            {
                title: "业务对象", ctrlType: "DataGrid", dsMode: 'local',
                owner: "sensitiveObjects 业务对象", ReadOnly: true, pageSize: -1,
                showCheckBox: false,
                Columns: {
                    id: { isVisible: false },
                    field: { isVisible: false, title: "字段ID" },
                    entityTitle: { title: "实体名", ctrlType: 'TextBox' },
                    name: { title: "字段名", ctrlType: "TextBox" },
                    code: { isVisible: false, ctrlType: "TextBox" },
                    //busField: { isVisible: false, title: "对应字段", ctrlType: "TextBox" },
                    auth: { title: "读写", ctrlType: "CheckBox" },
                    noAuth: { title: "无权", ctrlType: "CheckBox" },
                    readonlyAuth: { title: "只读", ctrlType: "CheckBox" },
                    applicationName: { isVisible: false },
                    entityName: { isVisible: false },
                    moduleName: { isVisible: false },
                    viewModelName: { isVisible: false },
                    authStat: { isVisible: false }
                    //    "id": null,
                    //"code": "def4",
                    //"name": "自定义项4",
                    //"field": "022ac176-5be2-46c9-a8cd-26d90c3d7008",
                    //"authStat": null,
                    //"applicationName": "DispatchlistApp",
                    //"entityName": "Dispatchlist",
                    //"moduleName": "null",
                    //"viewModelName": "Dispatchlist"
                }
            }),
        saveBusAuth: new cb.model.SimpleModel()
    };
    this.setData(fields);
    this.setDirty(false);

    var proxyConfig = {
        //获取用户角色树
        GetRoleUser: { url: "classes/Login/UAP/GetRoleUser", method: "Get" },
        //根据用户获取敏感对象权限
        // http://127.0.0.1:8080/classes/Login/UAP/GetUserRoleSensitiveObject?token=2bf62842980f4509bbfc974e1c2bb7be&authTarget=1001ZZ100000000008HW&authTargetType=0
        GetUserRoleSensitiveObj: { url: 'classes/Login/UAP/GetUserRoleSensitiveObject', method: 'Get' },
        //获取用户业务对象字段权限
        //Request URL: http://127.0.0.1:8080/classes/Login/UAP/GetUserRoleFieldPerm?token=2bf62842980f4509bbfc974e1c2bb7be&authTarget=1&authTargetType=0&viewModel=person
        //authTargetType  0表示用户，1表示角色
        //authTarget 是对象的主键Id
        //viewModel 业务对象名称
        GetUserRoleFieldPerm: { url: 'classes/Login/UAP/GetUserRoleFieldPerm', method: 'GET' },
        //获取业务对象
        GetViewModelList: { url: "classes/Query/UAP/commonQueryBySmartDefCode", method: "Post" },
        //获取业务对象对应字段
        GetViewModelFields: { url: "classes/Query/UAP/commonQueryService", method: "Post" },
        //保存业务对象对应字段
        SaveViewModelFields: { url: "classes/Login/UAP/SaveSensFields", method: "Post" },
        //保存用户角色权限
        //SaveUserRoleSensitiveObject?token=dc3b3595f89d4ded91b63749ae81dd54
        //        //1.	[
        //        2.	 { id:"1", sensitiveObject:"1", authTarget:"1", authTargetType:0, authStat:0 }, 
        //        3.	 { id:"2", sensitiveObject:"2", authTarget:"2", authTargetType:0, authStat:1 }
        //4.	 ]
        SaveUserRoleSensitiveObj: { url: "classes/Login/UAP/SaveUserRoleSensitiveObject", method: "Post" },
        //保存用户角色权限
        //http://127.0.0.1:8080/classes/Login/UAP/SaveUserRoleFieldPerm?token=2bf62842980f4509bbfc974e1c2bb7be
        SaveUserRoleFieldPerm: { url: 'classes/Login/UAP/SaveUserRoleFieldPerm', method: 'Post' },
        //       : http://127.0.0.1:8080/classes/Login/UAP/GetComplexFieldPermission?token=2bf62842980f4509bbfc974e1c2bb7be
        //Request Method:POST
        GetComplexFieldPermission: { url: 'classes/Login/UAP/GetComplexFieldPermission', method: 'Post' },

    };
    this.setProxy(proxyConfig);

    this.getroleuserlist().on('click', function (args) {
        FieldPermApp_Extend.roleUserChange(this.getParent(), args)
    });

    this.getbusObjList().on('change', function (args) {
        FieldPermApp_Extend.busObjChange(this.getParent(), args)
    });

    //this.gettabMenu().on('click', function (args) {
    //    FieldPermApp_Extend.busTabClick(this.getParent(), args)
    //});

    this.getsetSensiAuthority().on('click', function (args) {
        FieldPermApp_Extend.setSensiAuth(this.getParent()), args
    });
    this.getsaveSensitiveAuth().on('click', function (args) {
        FieldPermApp_Extend.saveSensiAuth(this.getParent()), args
    });
    this.getdefaultAuth().on('afterchange', function (args) {
        FieldPermApp_Extend.defulatAuth(this.getParent()), args
    });
    this.getroleAuth().on('afterchange', function (args) {
        FieldPermApp_Extend.roleAuth(this.getParent()), args
    });
    this.getsensitiveAuth().on('afterchange', function (args) {
        FieldPermApp_Extend.sensiAuth(this.getParent()), args
    });
    this.getsetBusAuth().on('click', function (args) {
        FieldPermApp_Extend.setBusFieldAuth(this.getParent()), args
    });
    this.getsaveBusAuth().on('click', function (args) {
        FieldPermApp_Extend.saveBusFieldAuth(this.getParent()), args
    });
    this.getsensitiveObjects().on('aftercellchange', function (args) {
        FieldPermApp_Extend.sensiCellChange(this.getParent(), args), args
    });
    this.getbusFields().on('aftercellchange', function (args) {
        FieldPermApp_Extend.busCellChange(this.getParent(), args), args
    });
    this.initData();
}

FieldPermViewModel.prototype.initData = function () {
    FieldPermApp_Extend.doAction('initExtend', this);
}