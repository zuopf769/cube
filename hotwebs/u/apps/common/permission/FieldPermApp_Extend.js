/// <reference path="../../../common/js/Cube.js" />
/// <reference path="FieldPermApp_L.js" />
/// <reference path="../../../common/js/CommonProxy.js" />
var FieldPermApp_Extend = {

    doAction: function (name, viewModel) {

        if (this[name])
            this[name](viewModel);
    },
    initExtend: function (viewModel) {
        ///<param name='viewModel' type='FieldPermViewModel'></param>
        viewModel.getdefaultAuth().set('Text', '显示默认权限');
        viewModel.getroleAuth().set('Text', '显示角色权限');
        viewModel.getsensitiveAuth().set('Text', '显示敏感数据权限');
        this.initRoleUserList(viewModel);
    },
    initRoleUserList: function (viewModel) {
        ///<param name="viewModel" type="FieldPermViewModel"></param>
        var self = this;
        var data = {};
        viewModel.getProxy().GetRoleUser(data, function (success, fail) {
            if (fail) {
                var msg = self.getErrorMsg(fail);
                alert(msg);
                return;
            }
            var treeNodes = [];
            for (var attr in success) {
                var node = {};
                if (attr == 'users')
                    node['name'] = '用户';
                else if (attr == 'roles')
                    node['name'] = '角色';
                success[attr].forEach(function (data, dataIndex, datas) {
                    data['pNode'] = attr;
                });
                node['children'] = success[attr];
                treeNodes.push(node);
            }
            //viewModel.getroleuserlist().setValue(treeNodes);
            viewModel.getroleuserlist().setDataSource(treeNodes);
        });
    },
    roleUserChange: function (viewModel, args) {
        ///<param name='viewModel' type='FieldPermViewModel'></param>
        if (args && args.pNode) {
            var param = {
                authTarget: args.id,
                authTargetType: args.pNode == "users" ? 0 : 1,
            };
            viewModel.getbusObjList().set('userObj', param);
            viewModel.getsetSensiAuthority().set('userObj', param);
            viewModel.getsetBusAuth().set('userObj', param);
            viewModel.getroleuserlist().set('userObj', param);
            viewModel.getdefaultAuth().setValue(false);
            viewModel.getsensitiveAuth().setValue(false);
            viewModel.getroleAuth().setValue(false);
            viewModel.getProxy().GetUserRoleSensitiveObj(param, function (success, fail) {
                var msg;
                if (fail) {
                    msg = FieldPermApp_Extend.getErrorMsg(fail);
                    cb.util.tipMessage(msg);
                    return;
                }
                success.forEach(function (item, dataIndex, datas) {
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
                });
                viewModel.getsensitiveObjects().setDataSource(success);

            });
            FieldPermApp_Extend.loadBusObjList(viewModel);
            //viewModel.getbusFields().setDataSource([]);
        }
    },
    busTabClick: function (viewModel, args) {
        ///<param name='viewModel' type='FieldPermViewModel'></param>
        if (args === 'busField') {
            FieldPermApp_Extend.loadBusObjList(viewModel);
        }
    },
    loadBusObjList: function (viewModel) {
        if (!viewModel.getbusObjList().get('userObj') || !viewModel.getbusObjList().get('userObj').authTarget) {
            cb.util.tipMessage("用户角色未选择，请先选择");
            return;
        }
        var odata = {
            "pk_def": null,
            "code": "FIELDAUTH_VIEWMODEL",
            "context": null,
            "descs": null
        }
        viewModel.getProxy().GetViewModelList(odata, function (success, fail) {
            var msg;
            if (fail) {
                msg = FieldPermApp_Extend.getErrorMsg(fail);
                cb.util.tipMessage(msg);
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
                viewModel.getbusObjList().setDataSource(retDatas);
                if (retDatas.length > 0) {
                    viewModel.getbusObjList().setValue(retDatas[0].value);
                    FieldPermApp_Extend.busObjChange(viewModel, retDatas[0]);
                }
                //viewModel.getbusObjList().setValue(null);
            }
        });
    },
    busObjChange: function (viewModel, args) {
        ///<param name='viewModel' type='FieldPermViewModel'></param>
        var busObjList = viewModel.getbusObjList().getDataSource();
        if (!busObjList) {
            cb.util.tipMessage('请选择用户角色');
            return;
        }
        var filterModel = busObjList.filter(function (data, dataIndex, datas) {
            if (this.Value === data.value || this.value === data.value) {
                return true;
            }
        }, args);

        if (filterModel.length > 0) {
            viewModel.getbusObjList().set('busModel', filterModel[0].DISPLAYNAME);
            viewModel.getdefaultAuth().setValue(false);
            viewModel.getsensitiveAuth().setValue(false);
            viewModel.getroleAuth().setValue(false);
            var odata = {
                authTargetType: viewModel.getbusObjList().get('userObj').authTargetType,//  0表示用户，1表示角色
                authTarget: viewModel.getbusObjList().get('userObj').authTarget, //是对象的主键Id
                viewModel: filterModel[0].DISPLAYNAME,// 业务对象名称
            };
            viewModel.getProxy().GetUserRoleFieldPerm(odata, function (success, fail) {
                if (fail) {
                    var msg = FieldPermApp_Extend.getErrorMsg(fail);
                    cb.util.tipMessage(msg);
                    return;
                }
                viewModel.getbusObjList().set('defaultControlMode', success.defaultControlMode);

                if (success.fieldPermList.length > 0) {
                    viewModel.getbusObjList().set('applicationName', success.fieldPermList[0].applicationName);
                    viewModel.getbusObjList().set('moduleName', success.fieldPermList[0].moduleName);
                }
                success.fieldPermList.forEach(function (item, dataIndex, datas) {
                    //暂时处理 需要服务明确类型
                    var authInt = parseInt(item.authStat);
                    switch (authInt) {
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
                        case -1:
                            break;
                        default:
                            break;
                    }
                });
                viewModel.getbusFields().setDataSource(success.fieldPermList);
            });
        }
    },
    setBusFieldAuth: function (viewModel) {
        ///<param name='viewModel' type='FieldPermViewModel'></param>
        if (!viewModel.getsetBusAuth().get('userObj') || !viewModel.getsetBusAuth().get('userObj').authTarget) {
            cb.util.tipMessage('请选择用户角色');
            return;
        }

        viewModel.getdefaultAuth().setValue(false);
        viewModel.getroleAuth().setValue(false);
        viewModel.getsensitiveAuth().setValue(false);
        viewModel.getdefaultAuth().setState('readonly', true);
        viewModel.getroleAuth().setState('readonly', true);
        viewModel.getsensitiveAuth().setState('readonly', true);
        viewModel.getsetBusAuth().setState('disabled', true);
        viewModel.getbusFields().setReadOnly(false);
    },
    setSensiAuth: function (viewModel) {
        ///<param name='viewModel' type='FieldPermViewModel'></param>
        if (!viewModel.getsetSensiAuthority().get('userObj') || !viewModel.getsetSensiAuthority().get('userObj').authTarget) {
            cb.util.tipMessage('请选择用户角色');
            return;
        }
        viewModel.getsensitiveObjects().setReadOnly(false);
        viewModel.getsetSensiAuthority().setState('disabled', true);
    },
    saveSensiAuth: function (viewModel) {
        ///<param name='viewModel' type='FieldPermViewModel'></param>
        var param = [];
        //var sensiObj = viewModel.getaddPerson().get('sensiObj');
        viewModel.getsensitiveObjects().getRows().forEach(function (row, rowIndex, rows) {
            //{ id:"1", sensitiveObject:"1", authTarget:"1", authTargetType:0, authStat:0 },
            var authStat = -1;
            if (row['readonlyAuth'])
                authStat = 1;
            else if (row['auth'])
                authStat = 2;
            else if (row['noAuth'])
                authStat = 0;
            param.push({
                'id': row["id"],
                'sensitiveObject': row['sensitiveObject'],
                'authTargetType': viewModel.getsetSensiAuthority().get('userObj').authTargetType,//0用户1角色
                'authTarget': viewModel.getsetSensiAuthority().get('userObj').authTarget,
                'authStat': authStat,
            });
        });
        viewModel.getProxy().SaveUserRoleSensitiveObj(param, function (success, fail) {
            var msg;
            if (fail) {
                msg = SensitiveObjDefineViewModelApp_Extend.getErrorMsg(fail);
                alert(msg);
                return;
            }
            cb.util.tipMessage("保存成功");
            viewModel.getsensitiveObjects().setReadOnly(true);
            viewModel.getsetSensiAuthority().setState('disabled', false);
            cb.route.renewApps();
        });
    },
    saveBusFieldAuth: function (viewModel) {
        ///<param name='viewModel' type='FieldPermViewModel'></param>
        var odata = []; //viewModel.getbusFields().getRows();
        viewModel.getbusFields().getRows().forEach(function (row, rowInde, rows) {
            //alert(row);
            //console.log(row.authStat);
            //暂时处理，Grid-AfterCellChange调用值完成之后改用其他判断
            var authStat = -1;
            if (row['auth'])
                authStat = 2;
            if (row['readonlyAuth'])
                authStat = 1;
            if (row['noAuth'])
                authStat = 0;

            ///Temp 是否去掉authStat
            //if (authStat != -1) {
            row['authStat'] = authStat;
            row['authTarget'] = viewModel.getsetBusAuth().get('userObj').authTarget,
            row['authTargetType'] = viewModel.getsetBusAuth().get('userObj').authTargetType,
            odata.push(row);
            //}
        });
        viewModel.getProxy().SaveUserRoleFieldPerm(odata, function (success, fail) {
            var msg;
            if (fail) {
                msg = FieldPermApp_Extend.getErrorMsg(fail);
                cb.util.tipMessage(msg);
                return;
            }
            cb.util.tipMessage("保存成功");
            cb.route.renewApps();
            var odata = {
                authTargetType: viewModel.getbusObjList().get('userObj').authTargetType,//  0表示用户，1表示角色
                authTarget: viewModel.getbusObjList().get('userObj').authTarget, //是对象的主键Id
                viewModel: viewModel.getbusObjList().get('busModel'),// 业务对象名称
            };
            viewModel.getProxy().GetUserRoleFieldPerm(odata, function (success, fail) {
                if (fail) {
                    var msg = FieldPermApp_Extend.getErrorMsg(fail);
                    cb.util.tipMessage(msg);
                    return;
                }

                if (success.fieldPermList.length > 0) {
                    viewModel.getbusObjList().set('applicationName', success.fieldPermList[0].applicationName);
                    viewModel.getbusObjList().set('moduleName', success.fieldPermList[0].moduleName);
                }
                success.fieldPermList.forEach(function (item, dataIndex, datas) {
                    //暂时处理 需要服务明确类型
                    var authInt = parseInt(item.authStat);
                    switch (authInt) {
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
                        case -1:
                            break;
                        default:
                            break;
                    }
                });
                viewModel.getbusFields().setDataSource(success.fieldPermList);
            });
        });
        viewModel.getbusFields().setReadOnly(true);
        viewModel.getdefaultAuth().setState('readonly', false);
        viewModel.getroleAuth().setState('readonly', false);
        viewModel.getsensitiveAuth().setState('readonly', false);
        viewModel.getsetBusAuth().setState('disabled', false);
    },
    sensiCellChange: function (viewModel, args) {
        ///<param name='viewModel' type='FieldPermViewModel'></param>
        //field: "noAuth"
        //index: 0
        //oldValue: false
        //value: true
        if (!args) return;
        if (args.value) {
            ['noAuth', 'auth', 'readonlyAuth'].forEach(function (item, itemIndex, items) {
                if (item !== this.field) {
                    viewModel.getsensitiveObjects().setCellValue(this.index, item, false);
                    //viewModel.getsensitiveObjects().setCellState(this.index, item, 'value', false);
                    //viewModel.getsensitiveObjects().set(this.index, item, 'value', false);
                }
            }, args);
        }
    },
    busCellChange: function (viewModel, args) {
        ///<param name='viewModel' type='FieldPermViewModel'></param>
        if (!args) return;
        if (args.value) {
            ['noAuth', 'auth', 'readonlyAuth'].forEach(function (item, itemIndex, items) {
                if (item !== this.field) {
                    viewModel.getbusFields().setCellValue(this.index, item, false);
                }
            }, args);
        }
    },
    defulatAuth: function (viewModel) {
        FieldPermApp_Extend.getComplexFieldPermission(viewModel);
    },
    roleAuth: function (viewModel) {
        FieldPermApp_Extend.getComplexFieldPermission(viewModel);
    },
    sensiAuth: function (viewModel) {
        FieldPermApp_Extend.getComplexFieldPermission(viewModel);
    },
    getComplexFieldPermission: function (viewModel) {
        ///<param name='viewModel' type='FieldPermViewModel'></param>
        var array = [];
        if (viewModel.getdefaultAuth().getValue() === true)
            array.push(0);
        if (viewModel.getroleAuth().getValue() === true)
            array.push(1);
        if (viewModel.getsensitiveAuth().getValue() === true)
            array.push(2);
        var odata = {
            //    viewModel.getbusObjList().set('applicationName', success.fieldPermList[0].applicationName);
            //viewModel.getbusObjList().set('moduleName', success.fieldPermList[0].moduleName);
            "applicationName": viewModel.getbusObjList().get('applicationName'),
            "viewModel": viewModel.getbusObjList().get('busModel'),
            "moduleName": viewModel.getbusObjList().get('moduleName'),
            "authTarget": viewModel.getroleuserlist().get('userObj').authTarget,
            "authTargetType": viewModel.getroleuserlist().get('userObj').authTargetType,
            "defaultControlMode": viewModel.getbusObjList().get('defaultControlMode'),// 0,//默认无权，默认有权(未设置字段)
            "displayPerms": array,
        };
        var initMode = array.length === 0 ? true : false;
        viewModel.getProxy().GetComplexFieldPermission(odata, function (success, fail) {
            if (fail) {
                var msg = FieldPermApp_Extend.getErrorMsg(fail);
                cb.util.tipMessage(msg);
                return;
            }
            var fieldDatas;
            if (initMode)
                fieldDatas = success.fieldPermList;
            else
                fieldDatas = success;
            fieldDatas.forEach(function (item, dataIndex, datas) {
                //暂时处理 需要服务明确类型
                var authInt = parseInt(item.authStat);
                switch (authInt) {
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
                    case -1:
                        break;
                    default:
                        break;
                }
            });
            viewModel.getbusFields().setDataSource(fieldDatas);
        });
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

    //cb.route.renewApps()
}