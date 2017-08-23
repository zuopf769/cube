/// <reference path="../../common/js/Cube.js" />
/// <reference path="DeliveryApp_M.js" />
var PrintViewModel_Extend = {
    doAction: function (name, viewModel) {
        if (this[name])
            this[name](viewModel);
    },
    init_Extend: function (viewModel) {
        viewModel.PathArray = [];
		//cb.util.loadingControl.startControl();
        viewModel.getProxy().GetWindowSysDirs({
            busiCenterCode: cb.route.getViewPartParams(viewModel).appCode,
            path: "root",
            queryLevel: 2,
            hasFile:false
        }, function (success,fail) {
			//cb.util.loadingControl.endControl();
            if(fail){
                cb.util.tipMessage("查询目录失败: "+ fail.error);
            };
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

        });
    },
    confirmAction: function (viewModel) {
        if (viewModel.getDocumentName().getValue() == null || viewModel.getDocumentName().getValue() == "") {
            alert("请输入文件名");
        }
        else {
            if (viewModel.getPrintPath().getValue() == null || viewModel.getPrintPath().getValue() == "") {
                alert("请输入保存路径");
            }
            else {
                var param = {
                    busiCenterCode: cb.route.getViewPartParams(viewModel).appCode,
                    //path: viewModel.getPrintPath().getValue().replace(/\\/g, "\\\\") + "\\\\" + viewModel.getDocumentName().getValue(),
					path: viewModel.getPrintPath().getValue() + "\\" + viewModel.getDocumentName().getValue(),
                    interactType:0
                };
				//cb.util.loadingControl.startControl();
                debugger;
                viewModel.getProxy().BackupDatabase(param, function (success,fail) {
					//cb.util.loadingControl.endControl();
                    if (success) {
                        if (success == "success") {
                            alert("输出成功");
                            viewModel.getDirTree().setDataSource([]);
                            viewModel.getPrintPath().setValue();
                            viewModel.getDocumentName().setValue();
							cb.route.hidePageViewPart(viewModel);
                        }
                        else if (success == "fileExisted") {
                            if (confirm("文件已存在，是否要覆盖")) {
                                var param = {
                                    busiCenterCode: cb.route.getViewPartParams(viewModel).appCode,
                                    //path: viewModel.getPrintPath().getValue().replace(/\\/g, "\\\\") + "\\\\" + viewModel.getDocumentName().getValue(),
									path: viewModel.getPrintPath().getValue() + "\\" + viewModel.getDocumentName().getValue(),
                                    interactType: 2
                                };
								//cb.util.loadingControl.startControl();
                                viewModel.getProxy().BackupDatabase(param, function (success, fail) {
									//cb.util.loadingControl.endControl();
                                    if (success) {
                                        alert("输出成功");
                                        viewModel.getDirTree().setDataSource([]);
                                        viewModel.getPrintPath().setValue();
                                        viewModel.getDocumentName().setValue();
                                        cb.route.hidePageViewPart(viewModel);
                                    }
                                    else {
                                        alert(fail.error);
                                    }
                                });
                            }
                        }
                    }
                    else {
                        alert(fail.error);
                    }
                });
            }
        }
    },
    cancelAction: function (viewModel) {
        viewModel.getDirTree().setDataSource([]);
        viewModel.getDocumentName().setValue();
        viewModel.getPrintPath().setValue();
        cb.route.hidePageViewPart(viewModel);
    },
    DirTreeExpand: function (viewModel, args) {
        debugger;
        if (viewModel.PathArray.some(function (item, idnex, array) {return (item == args.code)})) {}
        else {
            debugger;
            viewModel.PathArray.push(args.code);
			cb.util.loadingControl.startControl();
            viewModel.getProxy().GetWindowSysDirs({
                busiCenterCode: cb.route.getViewPartParams(viewModel).appCode,
                //path: args.code.replace(/\\/g,"\\\\"),
				path: args.code,
                queryLevel: 2,
                hasFile: false
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