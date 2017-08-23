/// <reference path="../../common/js/Cube.js" />
/// <reference path="DeliveryApp_M.js" />
var ImportDBPathViewModel_Extend = {
    doAction: function (name, viewModel) {
        if (this[name])
            this[name](viewModel);
    },
    init_Extend: function (viewModel) {
        debugger;
        viewModel.PathArray = [];
		cb.util.loadingControl.startControl();
		var param = {
			busiCenterCode: cb.route.getViewPartParams(viewModel).appCode,
            path: "root",
            queryLevel: 2,
            hasFile:false,
			connectionInfo: cb.route.getViewPartParams(viewModel).conInfo
        };
		
        viewModel.getProxy().GetWindowSysDirs(param, function (success,fail) {
			cb.util.loadingControl.endControl();
            if (success) {
                function format(arr) {
                    for (var i = 0; i < arr.length; i++) {
                        arr[i].code = arr[i].bodyObj.path;
                        arr[i].id = arr[i].code;
                        arr[i].imageUrl = "pc/images/folder.png";
                        arr[i].queryLevel = arr[i].bodyObj.queryLevel;
                        arr[i].treeLevel = arr[i].bodyObj.treeLevel;
                        var path = arr[i].bodyObj.path.split(":\\");
                        arr[i].text = path[path.length - 2];
                        delete arr[i].bodyObj;
                        if (arr[i].children == null) {
                            arr[i].children = [];
                        }
                        if (arr[i].children) {
                            format(arr[i].children);
                        };
                    }
                }
                format(success);
                /*for (var i = 0; i < success.length; i++) {
                    if (success[i].children.length > 0) {
                        success[i].children = [];
                    }
                    else {
                        delete success[i].children;
                    }

                }*/
                viewModel.getDirTree().setDataSource(success);
            }
            else {
                alert(fail.error);
				//cb.route.hidePageViewPart(viewModel,"common.sysmanager.ImportDBPathApp");
            }
        });
    },
    confirmAction: function (viewModel) {
        debugger;
        if (viewModel.getPrintPath().getValue() == null || viewModel.getPrintPath().getValue() == "") {
            alert("请选择数据库路径");
        }
        else {
			var callback = cb.route.getViewPartParams(viewModel).callback;
			var viewmodel = cb.route.getViewPartParams(viewModel).vModel;
            if(callback)
				callback(viewmodel,viewModel.getPrintPath().getValue());
			cb.route.hidePageViewPart(viewModel);
        }
    },
    cancelAction: function (viewModel) {
        debugger;
        viewModel.getDirTree().setDataSource([]);
        viewModel.getPrintPath().setValue();
        cb.route.hidePageViewPart(viewModel);
    },
    DirTreeExpand: function (viewModel, args) {
        if (viewModel.PathArray.some(function (item, idnex, array) {
            return (item == args.code)
        })) {}
        else {
            viewModel.PathArray.push(args.code);
			cb.util.loadingControl.startControl();
            viewModel.getProxy().GetWindowSysDirs({
                busiCenterCode: cb.route.getViewPartParams(viewModel).appCode,
                path: args.code,
                queryLevel: 2,
                hasFile: false,
				connectionInfo: cb.route.getViewPartParams(viewModel).conInfo
            }, function (success, fail) {
				cb.util.loadingControl.endControl();
                if (success) {
                    function format(arr) {
                        for (var i = 0; i < arr.length; i++) {
                            arr[i].code = arr[i].bodyObj.path;
                            arr[i].id = arr[i].code;
                            arr[i].queryLevel = arr[i].bodyObj.queryLevel;
                            arr[i].treeLevel = arr[i].bodyObj.treeLevel;
                            var path = arr[i].bodyObj.path.split(":\\");
                            var path1 = path[1].split("\\");
                            arr[i].imageUrl = "pc/images/folder.png";
                            arr[i].text = path1[path1.length - 1];
                            delete arr[i].bodyObj;
                            if (arr[i].children == null) {
                                arr[i].children = [];
                            }
                            if (arr[i].children) {
                                format(arr[i].children);
                            };
                        }
                    }
                    format(success);
                    for (var i = 0; i < success.length; i++) {
                        if (success[i].children.length > 0) {
                            success[i].children = [];
                        }
                        else {
                            delete success[i].children;
                        }
                    }
                    var datasource = {
                        parentCode: args.code,
                        data: success
                    }
                    viewModel.getDirTree().appendNodes(datasource);
                }
            });
        }
    },
    DirTreeSelect: function (viewModel, args) {
        viewModel.getPrintPath().setValue(args.code);
    }
};