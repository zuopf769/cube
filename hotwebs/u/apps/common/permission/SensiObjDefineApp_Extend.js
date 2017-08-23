/// <reference path="../../../jquery/jquery-1.11.1.js" />
/// <reference path="../../../common/js/Cube.js" />
/// <reference path="SensiObjDefineApp_L.js" />
var SensiObjDefineViewModelApp_Extend = {

    doAction: function (name, viewModel) {
        if (this[name])
            this[name](viewModel);
    },
    init_Extend: function (viewModel) {
        ///<param name="viewModel" type="SenObjDefineViewModel"></param>

        //初始化敏感数据对象
        this.getSenstiveObjectList(viewModel);
    },
    getSenstiveObjectList: function (viewModel) {
        ///<param name="viewModel" type="SensiObjDefineViewModel"></param>
        var data = {};
        viewModel.getProxy().GetSensitiveObjectList(data, function (success, fail) {

            if (fail)
                alert("读取敏感数据列表失败");
            else {
                viewModel.getsensitiveObjList().setDataSource(success);
            }
        });
    },
    getSenstiveField: function (viewModel, args) {
        ///<param name='viewModel' type='SensiObjDefineViewModel'></param>
        var data = { 'sensitiveObject': args } //args;//senstiveObjID
        viewModel.getaddSensitiveData().set('sensitiveObject', args);
        viewModel.getdeleteSensitiveData().set('sensitiveObject', args);
        viewModel.getProxy().GetSensitiveField(data, function (success, fail) {
            if (fail)
                alert('读取敏感数据字段失败');
            else {
                //var dataSource = {};
                //var remoteDataConfig = {};
                //remoteDataConfig.result = 'success';
                //remoteDataConfig.param = data;
                //remoteDataConfig.url = viewModel.getProxy().config['GetSensitiveField'].url;
                //remoteDataConfig.method = viewModel.getProxy().config['GetSensitiveField'].method;
                //viewModel.getfieldGrid().setReadOnly(false);
                //viewModel.getfieldGrid().set('dataSource', remoteDataConfig);
                viewModel.getfieldGrid().setDataSource(success);
            }
        });
    },
    deleteSensitiveObject: function (viewModel, args) {
        ///<param name="viewModel" type="SensiObjDefineViewModel"></param>
        var data = {
            'sensitiveObject': args
        }
        viewModel.getProxy().DeleteSensitiveObject(data, function (success, fail) {
            if (fail) {
                alert('deleteError');
            }
            viewModel.getsensitiveObjList().set('deleteRow', data.sensitiveObject);
            if (viewModel.getaddSensitiveData().get('sensitiveObject') == data.sensitiveObject)
                viewModel.getmappingFields().setRows([]);
        });
    },
    addSensitiveObj: function (viewModel) {
        ///<param name="viewModel" type="SensiObjDefineViewModel"></param>
        var odata = { 'name': arguments[1] };
        viewModel.getProxy().SaveSensitiveOBj(odata, function (success, fail) {
            if (fail)
                alert('error');
            else {
                viewModel.getsensitiveObjList().set('insertRow', success);
            }
        });
    },
    addSensitiveField: function (viewModel, url) {
        ///<param name="viewModel" type="SensiObjDefineViewModel"></param>
        if (viewModel.getaddSensitiveData().get('sensitiveObject') == undefined) {
            alert('please select sensitivedata first');
            return;
        }

        cb.route.loadPageViewPart(viewModel, url, { height: '400px', width: '500px' });
    },
    addMappingField: function (viewModel, args) {
        ///<param name="viewModel" type="SensiObjDefineViewModel"></param>
        SensiObjDefineViewModelApp_Extend.getSenstiveField(viewModel, args);
    },
    deleteSensitiveField: function (viewModel) {
        ///<param name="viewModel" type="SensiObjDefineViewModel"></param>
        if (viewModel.getdeleteSensitiveData().get('sensitiveObject') == undefined) {
            alert('please select sensitivedata first');
            return;
        }

        var deleteIds = [];
        var selectedRows = viewModel.getmappingFields().getSelectedRows();
        selectedRows.forEach(function (row, rowIndex, rows) {
            if (row.id && row.id.length > 0) {
                deleteIds.push(row.id);
            }
        });

        viewModel.getProxy().DeleteSensitiveFields(deleteIds, function (success, fail) {
            var msg;
            if (fail) {
                msg = SensiObjDefineViewModelApp_Extend.getErrorMsg(fail);
                alert(msg);
                return;
            }
            else {
                msg = success;
                //Temp删除后刷新数据
                SensiObjDefineViewModelApp_Extend.getSenstiveField(viewModel, viewModel.getdeleteSensitiveData().get('sensitiveObject'));
            }

        });
    },
    setDirectAuthorization: function (viewModel, sensitiveObject) {
        ///<param name='viewModel' type='SensiObjDefineViewModel'></param>
        this.changeContorlStatus(true);
        //viewModel.getauthoritySensitiveDatas().set('Fixed', true);

    },
    changeContorlStatus: function (setAuth) {
        var $fieldgrid = $("#field_grid");
        var $fielddiv = $("#field_div");
        var $field_addbtn = $("#field_addbtn");
        var $field_delbtn = $("#field_delbtn");
        var $authdiv = $("#authority_div");
        var $authgrid = $("#authority_grid");
        var $auth_addbtn = $("#authority_addbtn");
        var $auth_savebtn = $("#authority_savebtn");
        if (setAuth) {
            $fieldgrid.hide();
            $fielddiv.hide();
            $field_addbtn.hide();
            $field_delbtn.hide();
            $authgrid.show();
            $authdiv.show();
            $auth_addbtn.show();
            $auth_savebtn.show();
        }
        else {
            $fieldgrid.show();
            $fielddiv.show();
            $field_addbtn.show();
            $field_delbtn.show();
            $authgrid.hide();
            $authdiv.hide();
            $auth_addbtn.hide();
            $auth_savebtn.hide();
        }
    },
    saveDirectAuthorization: function (viewModel) {
        ///<param name='viewModel' type='SensiObjDefineViewModel'></param>
        this.changeContorlStatus(false);
    },
    getErrorMsg: function (fail) {
        var msg = '';
        if (fail) {
            fail.forEach(function (error, errorIndex, errors) {
                msg = msg + "__" + error.msgContent;
            });
            return msg;
        }
    },
    testGrid: function (viewModel, args) {
        ///<param name="viewModel" type='SensiObjDefineViewModel'></param>
        //alert(viewModel, args);
        //viewModel.getfieldGrid().getCellValue(0, 'field');
        //viewModel.getfieldGrid().updateRow(0, {
        //});
        /////fieldCode: Object
        //fieldId: Object
        //fieldName: Object
        //viewModelCode: Object
        //viewModelName: Object
        viewModel.getfieldGrid().insertRow(0, { 'fieldCode': '1', 'fieldId': '2', 'fieldName': '3', 'viewModelCode': '4' });
    }
};