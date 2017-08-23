/// <reference path="../../../common/js/Cube.js" />
/// <reference path="RoleUserRefApp_L.js" />
var RoleUserRefApp_Extend = {

    doAction: function (name, viewModel) {
        if (this[name])
            this[name](viewModel);
    },
    init_Extend: function (viewModel) {
        //this.getViewModelList(viewModel);
        viewModel.getauth().set('Text', '读写');
        viewModel.getnoAuth().set('Text', '无权');
        viewModel.getreadOnlyAuth().set('Text', '只读');
        viewModel.getnoAuth().setValue(true);
        viewModel.getauth().setValue(false);
        viewModel.getreadOnlyAuth().setValue(false);
        RoleUserRefApp_Extend.TempViewModel = viewModel;
        RoleUserRefApp_Extend.initRoleUserList(viewModel);
        //RoleUserRefApp_Extend.CheckedItems.removeAll();
        RoleUserRefApp_Extend.CheckedItems = {};
    },
    getViewPartParams: function (viewModel) {
        var params;
        if (viewModel)
            params = cb.route.getViewPartParams(viewModel);
        return params;
    },
    initRoleUserList: function (viewModel) {
        ///<param name="viewModel" type="FieldPermViewModel"></param>
        var self = this;
        var data = {};
        var params = RoleUserRefApp_Extend.getViewPartParams(viewModel);
        var parentViewModel = params.parentViewModel;
        var existRow = [];
        if (parentViewModel && parentViewModel.getauthoritySensitiveDatas()) {
            parentViewModel.getauthoritySensitiveDatas().getRows().forEach(function (row, rowIndex, rows) {
                //Temp 有用户ID后用ID判断
                existRow.push(row['authTarget']);
            });
        }
        viewModel.getProxy().GetRoleUser(data, function (success, fail) {
            if (fail) {
                var msg = self.getErrorMsg(fail);
                alert(msg);
                return;
            }
            var treeNodes = [];
            for (var attr in success) {
                var node = {};
                if (attr == 'users') {
                    node['name'] = '用户';
                }
                else if (attr == 'roles') {
                    node['name'] = '角色';
                }
                success[attr].forEach(function (data, dataIndex, datas) {
                    data['pNode'] = attr;
                    //Temp 有用户ID后用ID判断
                    if (existRow.indexOf(data['id']) >= 0) {
                        data['enabled'] = false;
                    }
                });
                node['children'] = success[attr];
                node['code'] = attr;
                treeNodes.push(node);
            }
            viewModel.getuserTree().setDataSource(treeNodes);
        }, existRow);
    },
    getViewPartParams: function (viewModel) {
        var params;
        if (viewModel)
            params = cb.route.getViewPartParams(viewModel);
        return params;
    },
    treeCheck: function (viewModel, args) {
        //if (args.checked) {
        //    RoleUserRefApp_Extend.CheckedItems[args.id] = {
        //        id: args.id,
        //        name: args.name,
        //        code: args.code,
        //        roleCode: args.pNode,
        //        roles: args.pNode === 'roles' ? '角色' : '用户',
        //    };
        //}
        //else {
        //    if (RoleUserRefApp_Extend.CheckedItems.hasOwnProperty(args.id))
        //        delete RoleUserRefApp_Extend.CheckedItems[args.id];
        //}
        RoleUserRefApp_Extend.initCheckedLeafItems(args);
    },
    initCheckedLeafItems: function (arg) {
        if (arg.children && arg.children.length > 0) {
            //RoleUserRefApp_Extend.initCheckedLeafItems(arg);
            arg.children.forEach(function (item, itemIndex, items) {
                if (this.checked)
                    item.checked = true;
                else
                    item.checked = false;
                RoleUserRefApp_Extend.initCheckedLeafItems(item);
            }, arg);
        }
        else {
            if (arg.checked) {
                RoleUserRefApp_Extend.CheckedItems[arg.id] = {
                    id: arg.id,
                    name: arg.name,
                    code: arg.code,
                    roleCode: arg.pNode,
                    roles: arg.pNode === 'roles' ? '角色' : '用户',
                };
            }
            else {
                if (RoleUserRefApp_Extend.CheckedItems.hasOwnProperty(arg.id))
                    delete RoleUserRefApp_Extend.CheckedItems[arg.id];
            }
        }
    },
    okAction: function (viewModel) {
        ///<param name='viewModel' type='RoleUserRefViewModel'></param>
        var params = this.getViewPartParams(viewModel);
        var parentViewModel = params.parentViewModel;
        var sensitiveObj = parentViewModel.getaddSensitiveData().get('sensitiveObject');
        var existRow = [];
        if (parentViewModel && parentViewModel.getauthoritySensitiveDatas()) {
            parentViewModel.getauthoritySensitiveDatas().getRows().forEach(function (row, rowIndex, rows) {
                //Temp 有用户ID后用ID判断
                existRow.push(row['authTarget']);
            });
        }
        var returnData = [];
        var authStat = 0;
        if (viewModel.getauth().getValue())
            authStat = 2;
        else if (viewModel.getreadOnlyAuth().getValue())
            authStat = 1;
        for (var attr in RoleUserRefApp_Extend.CheckedItems) {
            if (existRow.indexOf(RoleUserRefApp_Extend.CheckedItems[attr].id) >= 0)
                continue;
            returnData.push({

                //    _$id: "rowID_3"
                //    auth: true
                //authStat: 2
                //code: "u1"
                //noAuth: false
                //readonlyAuth: false
                //roles: "用户"
                //userId: "1001AA1000000000008W"
                //userName: "u1"
                authTarget: RoleUserRefApp_Extend.CheckedItems[attr].id,
                authName: RoleUserRefApp_Extend.CheckedItems[attr].name,
                code: RoleUserRefApp_Extend.CheckedItems[attr].code,
                roles: RoleUserRefApp_Extend.CheckedItems[attr].roles,
                authStat: authStat,
            });
        }
        parentViewModel.getauthoritySensitiveDatas().fireEvent("filedsAdded", returnData);
        cb.route.hidePageViewPart(viewModel);
    },
    authClick: function (viewModel, args) {
        if (args.Value) {
            viewModel.getnoAuth().setValue(!args.Value);
            viewModel.getreadOnlyAuth().setValue(!args.Value);
        }
    },
    noAuthClick: function (viewModel, args) {
        if (args.Value) {
            viewModel.getauth().setValue(!args.Value);
            viewModel.getreadOnlyAuth().setValue(!args.Value);
        }
    },
    readOnlyAuthClick: function (viewModel, args) {
        if (args.Value) {
            viewModel.getnoAuth().setValue(!args.Value);
            viewModel.getauth().setValue(!args.Value);
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
    },
    CloseAction: function () {
        if (RoleUserRefApp_Extend.TempViewModel != undefined) {
            cb.route.hidePageViewPart(RoleUserRefApp_Extend.TempViewModel);
        }
    },
    TempViewModel: undefined,
    CheckedItems: {}
}