/// <reference path="../../../common/js/Cube.js" />
/// <reference path="BusObjRefApp_Extend.js" />

var BusObjRefViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || 'BusObjRefViewModel');
    this.init();
}
BusObjRefViewModel.prototype = new cb.model.ContainerModel();
BusObjRefViewModel.prototype.constructor = BusObjRefViewModel;

BusObjRefViewModel.prototype.init = function () {

    var fields = {
        ViewModelName: "BusObjRefViewModel",
        busObjList: new cb.model.SimpleModel(),
        fieldGrid: new cb.model.Model3D({
            dsMode: 'local', readOnly: true,
            pageSize: -1,
            height: 455,
            ctrlType: 'DataGrid',
            Columns: {
                Code: { title: '编码' },
                DisplayName: { title: '名称' },
                ID: { isVisible: false, title: 'Id号' },
                applicationName: { isVisible: false, title: '应用名称' },
                entityName: { title: '实体名' },
                moduleName: { isVisible: false, title: '模块名' },
                viewModelId: { isVisible: false, title: '视图模型ID' },
                viewModelName: { title: '视图模型名' },
            }
        }),
        ok: new cb.model.SimpleModel()
    };
    this.setData(fields);
    this.setDirty(false);

    var proxyConfig = {
        //获取业务对象
        GetViewModelList: { url: "classes/Query/UAP/commonQueryBySmartDefCode", method: "Post" },
        //获取业务对象对应字段
        GetViewModelFields: { url: "classes/Query/UAP/commonQueryService", method: "Post" },
        //保存业务对象对应字段
        SaveViewModelFields: { url: "classes/Login/UAP/SaveSensFields", method: "Post" }
    };

    this.setProxy(proxyConfig);
    this.getok().on('click', function (args) { BusObjRefApp_Extend.okAction(this.getParent()), args });
    this.getbusObjList().on('afterchange', function (args) { BusObjRefApp_Extend.viewModelChange(this.getParent(), args), args });


    this.initData();
}

BusObjRefViewModel.prototype.initData = function () {
    BusObjRefApp_Extend.doAction('init_Extend', this);
}