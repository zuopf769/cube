/// <reference path="../../common/js/Cube.js" />
/// <reference path="DeliveryApp_M.js" />
var UseSystemViewModel_Extend = {
    doAction: function (name, viewModel) {
        if (this[name])
            this[name](viewModel);
    },
    init_Extend: function (viewModel) {
        viewModel.getsaveAction().set("visible", false);
        viewModel.getcancelAction().set("visible", false);
        viewModel.geteditAction().set("disabled", true);
        viewModel.getcreatecalendar().set("Noinput", true);
		var date = new Date().format("yyyy-MM-dd");
        viewModel.getcreatecalendar().setValue(date);
		viewModel.createcalendar = viewModel.getcreatecalendar().getValue();
        viewModel.getProxy().GetGroupTree({}, function (success, fail) {
            if (success) {
                function aaa(arr) {
                    for (var i = 0; i < arr.length; i++) {
                        arr[i].name = arr[i].bodyObj.name;
                        arr[i].code = arr[i].bodyObj.code;
                        arr[i].imageUrl = "pc/images/group.png";
                        if (arr[i].children.length > 0) {
                            aaa(arr[i].children);
                        }
                    };
                };
                aaa(success);
                viewModel.getGroupTree().setDataSource(success);
            }
            else {
                alert(fail.error);
            }
        });
    },
    GroupTree: function (viewModel, args) {
        viewModel.getsaveAction().set("visible", false);
        viewModel.getcancelAction().set("visible", false);
        viewModel.geteditAction().set("visible", true);
        viewModel.groupId = args.bodyObj.pk_group;
        var param = {
            "pk_org": viewModel.groupId         //集团id
        };
        viewModel.PK_ORG = args.bodyObj.pk_group;
        viewModel.getProxy().GetInitModuleTree(param, function (success, fail) {
            if (success) {
                function transfer(arr) {
                    for (var i = 0; i < arr.length; i++) {
                        arr[i].name = arr[i].bodyObj.multiStr;
                        arr[i].code = arr[i].bodyObj.funccode;
                        arr[i].id = arr[i].bodyObj.funccode;
                        arr[i].createcalendar = arr[i].bodyObj.createcalendar;
                        if (arr[i].hasSelected == true) {
                            arr[i].imageUrl = "pc/images/group.png";
                        }
                        delete arr[i].bodyObj;
                        if (arr[i].children.length == 0) {
                            delete arr[i].children;
                        }
                        else if (arr[i].children.length > 0) {
                            transfer(arr[i].children);
                        };
                    };
                };
                viewModel.NotUsedModule = [];
                viewModel.UsedModule = [];
                function getNotUsedModule(arr) {
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i].children) {
                            getNotUsedModule(arr[i].children);
                        }
                        else {
                            if (arr[i].hasSelected == true) {
                                viewModel.UsedModule.push(arr[i].code);
                            } else {
                                viewModel.NotUsedModule.push(arr[i].code);
                            }
                        }
                    }
                };
                transfer(success);
                getNotUsedModule(success);
                viewModel.geteditAction().set("disabled", false);
                //viewModel.getModuleTree().set("AllNodesEnable", true);
                viewModel.getModuleTree().setDataSource(success);
                viewModel.getModuleTree().setSelectedValues(viewModel.UsedModule);
                //viewModel.getModuleTree().set("AllNodesEnable", false);
            }
        });
    },
    ModuleTree: function (viewModel, args) {
        if (args.checked == true) {
            if (!args.children) {   //不存在是子节点
            }
            else {
                var arr = [];
				var arr1 = [];
				for (var i = 0; i < args.children.length; i++) {
					if (args.children[i].hasSelected == false||args.children[i].hasSelected == null) {
						arr.push(args.children[i].code);
					}
					else{
						arr1.push(args.children[i].code);
					}
				}
				setTimeout(function () {
						viewModel.getModuleTree().setSelectedValues(arr);
						//viewModel.getModuleTree().setUnSelectedValues(arr);
				}, 20);
            }
        }
        else {
            if (args.children) {   //反勾选的是父节点 应该把子节点中已安装的勾选上 
                if (args.children.some(function (item) {
                    return (item.hasSelected == true)
                })) {
                    viewModel.getModuleTree().setSelectedValues([args.code]);
                }
                var children = args.children;
                var array = [];
                for (var i = 0; i < children.length; i++) {
                    if (children[i].hasSelected == true) {
                        array[i] = children[i].code;
                    }
                };
                viewModel.getModuleTree().setSelectedValues(array);
            }
            else {
                if (args.hasSelected == true) {
                    viewModel.getModuleTree().setSelectedValues([args.code]);
                }
            }
        }
    },
    ModuleTreeExpand: function (viewModel, args) {
        var arr = [];
        var arr1 = [];
        for (var i = 0; i < args.children.length; i++) {
            arr1[i] = args.children[i].code;
            if (args.children[i].hasSelected == false||args.children[i].hasSelected == null) {
                arr.push(args.children[i].code);
            }
        }
        setTimeout(function () {
                viewModel.getModuleTree().setSelectedValues(arr1);
                viewModel.getModuleTree().setUnSelectedValues(arr);
        }, 20);

        
    },
    ModuleTreeClick: function (viewModel, args) {
        viewModel.flag = null;
        if (viewModel.NotUsedModule.some(function (item, index, array) {
            return (item == args.code)
        })) {
            viewModel.flag = true;
            var date = new Date();
            viewModel.getcreatecalendar().setValue(date);
        }
        else {
            viewModel.flag = false;
            var date =new Date(args.createcalendar).format("yyyy-MM-dd");
            viewModel.getcreatecalendar().setValue(date);
        }
    },
    saveAction: function (viewModel) {
        var infor = viewModel.getModuleTree().getSelectedValues();
        var code = [];
        for (var i = 0; i < infor.length; i++) {
            for (var j = 0; j < viewModel.NotUsedModule.length; j++) {
                if (infor[i] == viewModel.NotUsedModule[j]) {
                    var json = {};
                    json.funccode = viewModel.NotUsedModule[j]
                    code.push(json);
                }
            }
        }
        if (code.length == 0) {
            alert("请选择要启用的模块");
        }
        else {
            if (viewModel.createcalendar == null || viewModel.createcalendar == "" || !viewModel.createcalendar) {
                alert("请设置启用日期");
				return ;
            }
            var data= viewModel.collectData();
			cb.util.loadingControl.startControl();
                viewModel.getProxy().innitModule({
                    pk_org: viewModel.PK_ORG,          //集团主键
                    codetocodes: code,
                    createcalendar: data.createcalendar
                }, function (success, fail) {
					cb.util.loadingControl.endControl();
                    if (success) {
                        alert("升级成功");
                        viewModel.getsaveAction().set("visible", false);
                        viewModel.getcancelAction().set("visible", false);
                        viewModel.geteditAction().set("visible", true);
                        var param = {
                            "pk_org": viewModel.groupId         //集团id
                        };
                        viewModel.getProxy().GetInitModuleTree(param, function (success, fail) {
                            if (success) {
                                function transfer(arr) {
                                    for (var i = 0; i < arr.length; i++) {
                                        arr[i].name = arr[i].bodyObj.multiStr;
                                        arr[i].code = arr[i].bodyObj.funccode;
                                        arr[i].id = arr[i].bodyObj.funccode;
                                        arr[i].createcalendar = arr[i].bodyObj.createcalendar;
                                        if (arr[i].hasSelected == true) {
                                            arr[i].imageUrl = "pc/images/group.png";
                                        }
                                        delete arr[i].bodyObj;
                                        if (arr[i].children.length == 0) {
                                            delete arr[i].children;
                                        }
                                        else if (arr[i].children.length > 0) {
                                            transfer(arr[i].children);
                                        };
                                    };
                                };
                                viewModel.NotUsedModule = [];
                                viewModel.UsedModule = [];
                                function getNotUsedModule(arr) {
                                    for (var i = 0; i < arr.length; i++) {
                                        if (arr[i].children) {
                                            getNotUsedModule(arr[i].children);
                                        }
                                        else {
                                            if (arr[i].hasSelected == true) {
                                                viewModel.UsedModule.push(arr[i].code);
                                            } else {
                                                viewModel.NotUsedModule.push(arr[i].code);
                                            }
                                        }
                                    }
                                };
                                transfer(success);
                                getNotUsedModule(success);
                                viewModel.geteditAction().set("disabled", false);
                                viewModel.getModuleTree().setDataSource(success);
                                viewModel.getModuleTree().setSelectedValues(viewModel.UsedModule);
                            }
                        });

                    }
                    else {
                        alert(fail.error);
                    }
                });
        };
    },
    editAction: function (viewModel) {
        viewModel.geteditAction().set("visible", false);
        viewModel.getsaveAction().set("visible", true);
        viewModel.getcancelAction().set("visible", true);
        //viewModel.getModuleTree().set("AllNodesEnable", true);
    },
    cancelAction: function (viewModel) {
        viewModel.geteditAction().set("visible", true);
        viewModel.getsaveAction().set("visible", false);
        viewModel.getcancelAction().set("visible", false);
        //viewModel.getModuleTree().set("AllNodesEnable", false);
        var date = new Date();
        viewModel.getcreatecalendar().setValue(date);
    },
    createcalendar: function (viewModel, args) {
        debugger;
        //f (viewModel.flag == true) {
            viewModel.createcalendar = viewModel.getcreatecalendar().getValue().format("yyyy-MM-dd");;
        //}
    }
};


