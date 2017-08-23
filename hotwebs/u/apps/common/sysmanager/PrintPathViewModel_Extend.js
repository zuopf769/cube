/// <reference path="../../common/js/Cube.js" />
/// <reference path="DeliveryApp_M.js" />
var PrintPathViewModel_Extend = {
    doAction: function (name, viewModel) {
        if (this[name])
            this[name](viewModel);
    },
    init_Extend: function (viewModel) {
        viewModel.PathArray = [];
        viewModel.getProxy().GetWindowSysDirs({
            busiCenterCode: cb.route.getViewPartParams(viewModel).param.busiCenterCode,
            path: "root",
            queryLevel: 2,
            hasFile:false
        }, function (success,fail) {
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
                viewModel.getDocumentName().setValue("db.bak");
            }
            else {
                alert(fail.error);
            }
        });
    },
    confirmAction: function (viewModel) {
        if (viewModel.getPrintPath().getValue() == null || viewModel.getPrintPath().getValue() == "") {
            alert("请选择输入路径");
        }
        else {
            var params = cb.route.getViewPartParams(viewModel).param
            params.installPath = viewModel.getPrintPath().getValue().replace(/\\/g, "\\\\");
            viewModel.getProxy().RestoreDatabase(params, function (success, fail) {
                if (success) {
                    alert("chenggong");
                    viewModel.getDirTree().setDataSource([]);
                    viewModel.getPrintPath().setValue();
                    cb.route.hidePageViewPart(viewModel);
                }
                else {
                    alert(fail.error);
                }
            });
        }
    },
    cancelAction: function (viewModel) {
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
            viewModel.getProxy().GetWindowSysDirs({
                busiCenterCode: cb.route.getViewPartParams(viewModel).param.busiCenterCode,
                path: args.code.replace(/\\/g,"\\\\"),
                queryLevel: 2,
                hasFile: false
            }, function (success, fail) {
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