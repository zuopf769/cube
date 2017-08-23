/// <reference path="../../../common/js/Cube.js" />
/// <reference path="BusObjRefApp_L.js" />
var BusObjRefApp_Extend = {

    doAction: function (name, viewModel) {
        if (this[name])
            this[name](viewModel);
    },
    init_Extend: function (viewModel) {
        this.getViewModelList(viewModel);
        BusObjRefApp_Extend.TempViewModel = viewModel;
        //if (viewModel.getbusObjList().get("checkedrows") == undefined)
        //    viewModel.getbusObjList().set("checkedrows", []);
        //if (viewModel.getfieldsList().get("checkedrows") == undefined)
        //    viewModel.getfieldsList().set("checkedrows", []);
    },
    getViewPartParams: function (viewModel) {
        var params;
        if (viewModel)
            params = cb.route.getViewPartParams(viewModel);
        return params;
    },
    getViewModelList: function (viewModel) {
        ///<param name="viewModel" type="BusObjRefViewModel"></param>
        var odata = {
            "pk_def": null,
            "code": "FIELDAUTH_VIEWMODEL",
            "context": null,
            "descs": null
        }

        viewModel.getProxy().GetViewModelList(odata, function (success, fail) {
            if (fail) {
                var msg = '';
                fail.forEach(function (data, dataIndex, datas) {
                    msg = msg + "  " + data.msgContent;
                });
                alert(msg);
                return;
            }
            var retDatas = [];
            if (success.dataSet) {
                var datas = success.dataSet.m_Datas;
                var fields = success.dataSet.metaData.m_fields;
                datas.forEach(function (data, dataIndex, datas) {
                    var retData = {};
                    for (var i = 0; i < fields.length; i++) {
                        retData[fields[i].m_fldname] = data[i];
                    }
                    retData.text = retData['DISPLAYNAME'];
                    retData.value = retData['ID'];
                    retDatas.push(retData);
                });
                //viewModel.getbusObjList().setDataSource({ 'mode': 'single', 'datas': retDatas });
                viewModel.getbusObjList().setDataSource(retDatas);
                //viewModel.getbusObjList().setData({ 'dataTextField': 'DISPLAYNAME', 'dataValueField': 'ID', 'dataSource': retDatas });
                //viewModel.getfieldsList().set('clear', {});
                //viewModel.getfieldsList().set('dataSource', retDatas);
            }
        });
    },
    viewModelChange: function (viewModel, args) {

        var params = BusObjRefApp_Extend.getViewPartParams(viewModel);
        var parentViewModel = params.parentViewModel;
        //alert(parentViewModel.getmappingFields());

        if (viewModel.getbusObjList().getValue()) {
            var odata = {
                "code": "FIELDAUTH_FIELD",
                "pageIndex": "1",
                "pageSize": "10000",
                "filters": [{ "filterExpression": "viewModelId='" + viewModel.getbusObjList().getValue() + "'" }]
            }
            viewModel.getProxy().GetViewModelFields(odata, function (success, fail) {
                if (fail) {
                    var msg = '';
                    fail.forEach(function (fail, failIndex, fails) {
                        msg = msg + "   " + fail.msgContent;
                    });
                    alert(msg);
                    return;
                }
                viewModel.getfieldGrid().setDataSource(success.currentPageData);
            });
        }
        else {
            //fieldGrid
            //viewModel.getfieldsList().set('clear', {});
        }
    },
    okAction: function (viewModel) {
        ///<param name='viewModel' type='BusObjRefViewModel'></param>
        ///<param name='parentViewModel' type='SensitiveObjDefineViewModel'></param>
        var params = this.getViewPartParams(viewModel);
        var parentViewModel = params.parentViewModel;
        var sensitiveObj = parentViewModel.getaddSensitiveData().get('sensitiveObject');

        var odata = [];
        var checkedRows = viewModel.getfieldGrid().getSelectedRows();
        checkedRows.forEach(function (row, rowIndex, rows) {
            odata.push({
                "code": row['Code'],
                "name": row['DisplayName'],
                "sensitiveObject": sensitiveObj,
                "referenceField": row['ID'],
                "moduleName": row['moduleName'],
                "applicationName": row['applicationName'],
                "viewModelName": row['viewModelName'],
                "entityName": row['entityName'],
                "fieldName": row['Code']
            });
        });
        if (odata.length > 0) {
            viewModel.getProxy().SaveViewModelFields(odata, function (success, fail) {
                if (fail) {
                    var msg = BusObjRefApp_Extend.getErrorMsg(fail);
                    alert(msg);
                    return;
                }
                parentViewModel.getmappingFields().fireEvent("mappingFieldAdded", sensitiveObj);
            });
        }
        else {
            alert('无字段数据保存失败');
        }
        cb.route.hidePageViewPart(viewModel);
        //viewModel.getbusObjList().set('clear', {});
        //viewModel.getfieldsList().set('clear', {});
    },
    getErrorMsg: function (fail) {
        var msg = '';
        if (Object.prototype.toString.call(fail) == '[object Object]')
            msg = fail.error;
        else if (Object.prototype.toString.call(fail) == '[object Array]') {
            fail.forEach(function (error, errorIndex, errors) {
                msg = msg + "__" + error;
            });
        }
        else
            msg = fail.error;
        return msg;
    },
    CloseAction: function () {
        if (BusObjRefApp_Extend.TempViewModel != undefined) {
            cb.route.hidePageViewPart(BusObjRefApp_Extend.TempViewModel);
            //BusObjRefApp_Extend.TempViewModel.getbusObjList().set('clear', {});
            //BusObjRefApp_Extend.TempViewModel.getfieldsList().set('clear', {});
        }
    },
    TempViewModel: undefined
}