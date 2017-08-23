/// <reference path="../../../common/js/Cube.js" />
/// <reference path="RoleUserRefApp_Extend.js" />

var RoleUserRefViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || 'RoleUserRefViewModel');
    this.init();
}
RoleUserRefViewModel.prototype = new cb.model.ContainerModel();
RoleUserRefViewModel.prototype.constructor = RoleUserRefViewModel;
RoleUserRefViewModel.prototype.init = function () {

    var fields = {
        ViewModelName: "RoleUserRefViewModel",
        userTree: new cb.model.Model2D({
            checkboxes: { checkChildren: true }
        }),
        auth: new cb.model.SimpleModel(),
        noAuth: new cb.model.SimpleModel(),
        readOnlyAuth: new cb.model.SimpleModel(),
        //auth: new cb.model.SimpleModel(),
        //noAuth: new cb.model.SimpleModel(),
        //readOnly: new cb.model.SimpleModel(),
        //busObjList: new cb.model.SimpleModel(),
        //fieldsList: new cb.model.SimpleModel(),
        ok: new cb.model.SimpleModel()
    };
    this.setData(fields);
    this.setDirty(false);

    var proxyConfig = {
        //获取用户角色树
        GetRoleUser: { url: "classes/Login/UAP/GetRoleUser", method: "Get" },
        //获取业务对象
        GetViewModelList: { url: "classes/Query/UAP/commonQueryBySmartDefCode", method: "Post" },
        //获取业务对象对应字段
        GetViewModelFields: { url: "classes/Query/UAP/commonQueryService", method: "Post" },
        //保存业务对象对应字段
        SaveViewModelFields: { url: "classes/Login/UAP/SaveSensFields", method: "Post" }
    };

    this.setProxy(proxyConfig);
    this.getauth().on('change', function (args) { RoleUserRefApp_Extend.authClick(this.getParent(), args), args });
    this.getnoAuth().on('change', function (args) { RoleUserRefApp_Extend.noAuthClick(this.getParent(), args), args });
    this.getreadOnlyAuth().on('change', function (args) { RoleUserRefApp_Extend.readOnlyAuthClick(this.getParent(), args), args });
    this.getuserTree().on('check', function (args) { RoleUserRefApp_Extend.treeCheck(this.getParent(), args), args });
    //this.getuserTree().on('click', function (args) { RoleUserRefApp_Extend.treeCheck(this.getParent(), args), args });
    this.getok().on('click', function (args) { RoleUserRefApp_Extend.okAction(this.getParent()), args });
    //this.getbusObjList().on('checkChange', function (args) { RoleUserRefApp_Extend.viewModelChange(this.getParent(), args), args });
    this.initData();
}
RoleUserRefViewModel.prototype.initData = function () {
    RoleUserRefApp_Extend.doAction('init_Extend', this);
}