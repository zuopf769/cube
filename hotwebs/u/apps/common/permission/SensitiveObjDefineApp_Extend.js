/// <reference path="../../../jquery/jquery-1.11.1.js" />
/// <reference path="../../../common/js/Cube.js" />
/// <reference path="SensitiveObjDefineApp_L.js" />
/// <reference path="../../../common/js/CommonProxy.js" />
var SensitiveObjDefineViewModelApp_Extend = {

    doAction: function (name, viewModel) {
        if (this[name])
            this[name](viewModel);
    },
    init_Extend: function (viewModel) {
        ///<param name="viewModel" type="SensitiveObjDefineViewModel"></param>

        //初始化敏感数据对象
        this.getSenstiveObjectList(viewModel);
    },
    getSenstiveObjectList: function (viewModel) {
        ///<param name="viewModel" type="SensitiveObjDefineViewModel"></param>
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
        ///<param name='viewModel' type='SensitiveObjDefineViewModel'></param>
        var data = { 'sensitiveObject': args } //args;//senstiveObjID
        viewModel.getaddSensitiveData().set('sensitiveObject', args);
        viewModel.getdeleteSensitiveData().set('sensitiveObject', args);
        viewModel.getaddSensitiveData().setState('disabled', false);
        viewModel.getdeleteSensitiveData().setState('disabled', false);
        SensitiveObjDefineViewModelApp_Extend.changeContorlStatus(viewModel, false);
        viewModel.getProxy().GetSensitiveField(data, function (success, fail) {
            if (fail)
                alert('读取敏感数据字段失败');
            else {
                viewModel.getmappingFields().setDataSource(success);
            }
        });
    },
    deleteSensitiveObject: function (viewModel, args) {
        ///<param name="viewModel" type="SensitiveObjDefineViewModel"></param>
        cb.util.confirmMessage('是否删除', function () {
            var data = {
                'sensitiveObject': args
            }
            viewModel.getProxy().DeleteSensitiveObject(data, function (success, fail) {
                if (fail) {
                    var msg = SensitiveObjDefineViewModelApp_Extend.getErrorMsg(fail);
                    alert(msg);
                    return;
                }
                viewModel.getsensitiveObjList().set('deleteRow', data.sensitiveObject);
                if (viewModel.getaddSensitiveData().get('sensitiveObject') == data.sensitiveObject)
                    viewModel.getmappingFields().setDataSource([]);
                cb.route.renewApps();
            });
        });
    },
    addSensitiveObj: function (viewModel) {
        ///<param name="viewModel" type="SensitiveObjDefineViewModel"></param>
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
        ///<param name="viewModel" type="SensitiveObjDefineViewModel"></param>
        if (viewModel.getaddSensitiveData().get('sensitiveObject') == undefined) {
            alert('请先选择敏感数据对象');
            return;
        }
        cb.route.loadPageViewPart(viewModel, url, { height: '600px', width: '1200px' });
    },
    addMappingField: function (viewModel, args) {
        ///<param name="viewModel" type="SensitiveObjDefineViewModel"></param>
        cb.route.renewApps();
        SensitiveObjDefineViewModelApp_Extend.getSenstiveField(viewModel, args);
    },
    deleteSensitiveField: function (viewModel) {
        ///<param name="viewModel" type="SensitiveObjDefineViewModel"></param>
        if (viewModel.getdeleteSensitiveData().get('sensitiveObject') == undefined) {
            alert('请先选择敏感数据对象');
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
                msg = SensitiveObjDefineViewModelApp_Extend.getErrorMsg(fail);
                alert(msg);
                return;
            }
            else {
                msg = success;
                //Temp删除后刷新数据
                cb.route.renewApps();
                SensitiveObjDefineViewModelApp_Extend.getSenstiveField(viewModel, viewModel.getdeleteSensitiveData().get('sensitiveObject'));
            }

        });
    },
    changeContorlStatus: function (viewModel, setAuth) {
        ///<param name='viewModel' type='SensitiveObjDefineViewModel'></param>
        //mappingFields
        //authoritySensitiveDatas
        var $field_addbtn = $("#field_addbtn");
        var $field_delbtn = $("#field_delbtn");
        var $auth_addbtn = $("#authority_addbtn");
        var $auth_savebtn = $("#authority_savebtn");
        if (setAuth) {
            viewModel.getmappingFields().setState('visible', false);
            $field_addbtn.hide();
            $field_delbtn.hide();
            viewModel.getauthoritySensitiveDatas().setState('visible', true);
            $auth_addbtn.show();
            $auth_savebtn.show();
        }
        else {
            viewModel.getmappingFields().setState('visible', true);
            $field_addbtn.show();
            $field_delbtn.show();
            viewModel.getauthoritySensitiveDatas().setState('visible', false);
            $auth_addbtn.hide();
            $auth_savebtn.hide();
        }
    },
    saveDirectAuthorization: function (viewModel) {
        ///<param name='viewModel' type='SensitiveObjDefineViewModel'></param>
        var param = [];
        var sensiObj = viewModel.getaddPerson().get('sensiObj');
        viewModel.getauthoritySensitiveDatas().getRows().forEach(function (row, rowIndex, rows) {
            //{ id:"1", sensitiveObject:"1", authTarget:"1", authTargetType:0, authStat:0 },
            var authStat = -1;
            if (row['readonlyAuth'])
                authStat = 1;
            else if (row['auth'])
                authStat = 2;
            else if (row['noAuth'])
                authStat = 0;
            param.push({
                'sensitiveObject': sensiObj,
                'authTargetType': row['roles'] == '用户' ? 0 : 1,//0用户1角色
                'authTarget': row['authTarget'],
                'authStat': authStat,
                'id': row['id'] === undefined ? null : row['id'],
            });
        });
        viewModel.getProxy().SaveUserRoleSensitiveObj(param, function (success, fail) {
            var msg;
            if (fail) {
                msg = SensitiveObjDefineViewModelApp_Extend.getErrorMsg(fail);
                cb.util.warningMessage(msg);
                return;
            }
            else {
                cb.util.tipMessage("保存成功");
                SensitiveObjDefineViewModelApp_Extend.setDirectAuthorization(viewModel, sensiObj);
            }

        });
        //this.changeContorlStatus(viewModel, false);
        cb.route.renewApps();
    },
    setDirectAuthorization: function (viewModel, sensitiveObject) {
        ///<param name='viewModel' type='SensitiveObjDefineViewModel'></param>
        this.changeContorlStatus(viewModel, true);
        viewModel.getaddPerson().set('sensiObj', sensitiveObject);
        var data = { sensitiveObject: sensitiveObject };
        viewModel.getProxy().GetUserRoleAuth(data, function (success, fail) {
            var msg;
            if (fail) {
                msg = SensitiveObjDefineViewModelApp_Extend.getErrorMsg(fail);
                alert(msg);
                return;
            }
            var retData = [];
            success.forEach(function (item, itemIndex, items) {
                retData.push({
                    roles: item.authTargetType === 0 ? '用户' : '角色',
                    authTarget: item.authTarget,
                    authName: item.authName,
                    noAuth: item.authStat === 0 ? true : false,
                    readonlyAuth: item.authStat === 1 ? true : false,
                    auth: item.authStat === 2 ? true : false,
                    id: item.id
                });
            });
            viewModel.getauthoritySensitiveDatas().setDataSource(retData);
        });
    },
    addDirectAuthorization: function (viewModel, url) {
        ///<param name='viewModel' type='SensitiveObjDefineViewModel'></param>
        if (viewModel.getaddPerson().get('sensiObj') == undefined) {
            alert('sensitiveObject is null');
            return;
        }
        cb.route.loadPageViewPart(viewModel, url, { height: '600px', width: '600px' });

    },
    directAuthorizationAdded: function (viewModel, args) {
        ///<param name='viewModel' type='SensitiveObjDefineViewModel'></param>
        ///<param name='args' type='Array'></param>
        //alert(args);
        args.forEach(function (item, itemIndex, items) {
            switch (item.authStat) {
                case 0:
                    item.auth = false;
                    item.noAuth = true;
                    item.readonlyAuth = false;
                    break;
                case 1:
                    item.auth = false;
                    item.noAuth = false;
                    item.readonlyAuth = true;
                    break;
                case 2:
                    item.auth = true;
                    item.noAuth = false;
                    item.readonlyAuth = false;
                    break;
                default:
                    item.auth = false;
                    item.noAuth = true;
                    item.readonlyAuth = false;
                    break;
            }
            viewModel.getauthoritySensitiveDatas().appendRow(item);
        });

        //viewModel.getauthoritySensitiveDatas().appendRow(args);// setDataSource(args);
        //viewModel.getauthoritySensitiveDatas().setDataSource(args);
        //viewModel.getauthoritySensitiveDatas().add(args);
    },
    authorityCellChange: function (viewModel, args) {
        if (!args) return;
        if (args.value) {
            ['noAuth', 'auth', 'readonlyAuth'].forEach(function (item, itemIndex, items) {
                if (item !== this.field) {
                    viewModel.getauthoritySensitiveDatas().setCellValue(this.index, item, false);
                }
            }, args);
        }
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
    }
};