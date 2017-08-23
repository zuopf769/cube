/// <reference path="../../common/js/Cube.js" />
/// <reference path="DeliveryApp_M.js" />
var ImportViewModel_Extend = {
    doAction: function (name, viewModel) {
        if (this[name])
            this[name](viewModel);
    },
    init_Extend: function (viewModel) {
    	debugger;
		viewModel.PathArray = [];
		var lappcode = cb.route.getViewPartParams(viewModel).appCode;
		if(lappcode != null && lappcode != ""){
			$("#DBConnInfo").hide();
			$("#DirTree").height("100%");

			viewModel.PathArray = [];
			viewModel.getProxy().GetWindowSysDirs({
				busiCenterCode:  lappcode,
				path: "root",
				queryLevel: 2,
				hasFile:true
			}, function (success,fail) {
				if (success) {
					function format(arr) {
						for (var i = 0; i < arr.length; i++) {
							arr[i].code = arr[i].bodyObj.path;
							arr[i].id = arr[i].code;
							arr[i].queryLevel = arr[i].bodyObj.queryLevel;
							arr[i].treeLevel = arr[i].bodyObj.treeLevel;
							arr[i].hasFile=arr[i].bodyObj.hasFile;
							var path = arr[i].bodyObj.path.split(":\\");
							arr[i].text = path[path.length - 2];
							if(arr[i].hasFile){
								arr[i].imageUrl = "pc/images/bak.png";
							}
							else{
								arr[i].imageUrl = "pc/images/folder.png";
							}
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
				}
			});
		}
		else{
			var emptyTree = {
				name: "数据库服务器目录",
				code: "root",
				children: null,
			}
			//viewModel.getDirTree().setDataSource(emptyTree);
			$("#DBConnInfo").show();
			viewModel.getDBSrvAddr().setValue("127.0.0.1");
			viewModel.getDBSrvPort().setValue("1433");
			viewModel.getdbuser().setValue("sa");
			$("#DirTree").height("80%");
		}
    },
	setDBPath: function(viewModel,dbpath){
		viewModel.setDBFile(dbpath);
	},
	dbpathAction: function (viewModel) {
		if(!this.checkFunction(viewModel))
			return;
		
		var addr = viewModel.getDBSrvAddr().getValue();
		var dport = viewModel.getDBSrvPort().getValue();
		var duser = viewModel.getdbuser().getValue();
        var pass = viewModel.getdbpass().getValue();
        var connectionInfo = {
				ipAddr:addr,
				port:dport,
				user:duser,
				password:pass
			};
			
		//cb.route.hidePageViewPart(viewModel,"common.sysmanager.ImportApp");
		
		cb.route.loadPageViewPart(viewModel,"common.sysmanager.ImportDBPathApp",{ 
			height: "80%", 
			width: '760px', 
			//dsName: viewModel.dsName, 
			appCode: cb.route.getViewPartParams(viewModel).appCode,
			callback: this.setDBPath,
			vModel:viewModel,
			conInfo: connectionInfo});
	},
    confirmAction: function (viewModel) {
		var dbpath = viewModel.getDBFile().getValue();
		if(dbpath == null || dbpath == ""){
			alert("请输入引入路径");
			return;
		}
		
		var addr = viewModel.getDBSrvAddr().getValue();
		var dport = viewModel.getDBSrvPort().getValue();
		var duser = viewModel.getdbuser().getValue();
        var pass = viewModel.getdbpass().getValue();
        var bak = viewModel.getBackupFile().getValue();
        if (bak != null && bak.length > 0) {
            var param = {
				busiCenterCode:cb.route.getViewPartParams(viewModel).appCode,
                path: bak,
                installPath: dbpath,　
                interactType: 0,
				connectionInfo:{
					ipAddr:addr,
					port:dport,
					user:duser,
					password:pass
				}
            };
            cb.util.loadingControl.startControl();
            viewModel.getProxy().RestoreDatabase(param, function (success,fail) {
				cb.util.loadingControl.endControl();
                if (success) {
                    if (success == "success") {
                        alert("引入成功，请重新启动中间件");
						cb.route.hidePageViewPart(viewModel);
                    }
                    else if (success == "fileExisted") {
                        if (confirm("数据库文件已存在，是否要覆盖")) {
                            param.interactType = 2;
							cb.util.loadingControl.startControl();
                            viewModel.getProxy().RestoreDatabase(param, function (success, fail) {
								cb.util.loadingControl.endControl();
                                if (success) {
                                    alert("引入成功");
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
        else{
            alert("请选择备份文件");
        }
    },
	checkFunction: function(viewModel){
		var lappcode = cb.route.getViewPartParams(viewModel).appCode;
		if(lappcode != null && lappcode != ""){
			return true;
		}
		var addr = viewModel.getDBSrvAddr().getValue();
		var dport = viewModel.getDBSrvPort().getValue();
		var duser = viewModel.getdbuser().getValue();
        var pass = viewModel.getdbpass().getValue();
		if(addr == null || addr == ""){
			alert("请输入数据库地址");
			return false;
		}
		if(dport == null || dport == ""){
			alert("请输入数据库端口");
			return false;
		}
		if(duser == null || duser == ""){
			alert("请输入用户名");
			return false;
		}
		return true;
	},
	connectAction: function (viewModel) {
		debugger;
		if(!this.checkFunction(viewModel))
			return;
		
        var addr = viewModel.getDBSrvAddr().getValue();
		var dport = viewModel.getDBSrvPort().getValue();
		var duser = viewModel.getdbuser().getValue();
        var pass = viewModel.getdbpass().getValue();
        var param = {
            path: "root",
            queryLevel: 2,
            hasFile:true,
			connectionInfo:{
				ipAddr:addr,
				port:dport,
				user:duser,
				password:pass
			}
        };
		cb.util.loadingControl.startControl();
        viewModel.getProxy().GetWindowSysDirs(param, function (success,fail) {
			cb.util.loadingControl.endControl();
            if (success) {
                function format(arr) {
					for (var i = 0; i < arr.length; i++) {
						arr[i].code = arr[i].bodyObj.path;
						arr[i].id = arr[i].code;
						arr[i].queryLevel = arr[i].bodyObj.queryLevel;
						arr[i].treeLevel = arr[i].bodyObj.treeLevel;
						arr[i].hasFile=arr[i].bodyObj.hasFile;
						var path = arr[i].bodyObj.path.split(":\\");
						arr[i].text = path[path.length - 2];
						if(arr[i].hasFile){
							arr[i].imageUrl = "pc/images/bak.png";
						}
						else{
							arr[i].imageUrl = "pc/images/folder.png";
						}
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
                viewModel.getDirTree().setDataSource(success);
				viewModel.getconnectAction().set("disable", true);
            }
            else {
                alert(fail.error);
            }
        });
    },
    cancelAction: function (viewModel) {
        viewModel.getDirTree().setDataSource([]);
        viewModel.getBackupFile().setValue();
        cb.route.hidePageViewPart(viewModel);
    },
    DirTreeExpand: function (viewModel, args) {
        if (viewModel.PathArray.some(function (item, idnex, array) {
            return (item == args.code)
        })) {}
        else {
			cb.util.loadingControl.startControl();
            viewModel.PathArray.push(args.code);
			
			var param = {
				busiCenterCode: cb.route.getViewPartParams(viewModel).appCode,
				path: args.code,
				queryLevel: 2,
				hasFile:true,
				connectionInfo:{
					ipAddr:viewModel.getDBSrvAddr().getValue(),
					port:viewModel.getDBSrvPort().getValue(),
					user:viewModel.getdbuser().getValue(),
					password:viewModel.getdbpass().getValue()
				}
			};
			
            viewModel.getProxy().GetWindowSysDirs(param, function (success, fail) {
				cb.util.loadingControl.endControl();
                if (success) {
                    function format(arr) {
                        for (var i = 0; i < arr.length; i++) {
                            arr[i].code = arr[i].bodyObj.path;
                            arr[i].id = arr[i].code;
                            arr[i].queryLevel = arr[i].bodyObj.queryLevel;
                            arr[i].treeLevel = arr[i].bodyObj.treeLevel;
							arr[i].hasFile = arr[i].bodyObj.hasFile;
                            var path = arr[i].bodyObj.path.split(":\\");
                            var path1 = path[1].split("\\");
                            arr[i].text = path1[path1.length - 1];
                            /*var suffix = arr[i].text.split(".");
                            if (suffix[suffix.length - 1] == "bak") {
                                arr[i].imageUrl = "pc/images/bak.png";
                            }
                            else {
                                arr[i].imageUrl = "pc/images/folder.png";
                            }*/
							if(arr[i].hasFile){
								arr[i].imageUrl = "pc/images/bak.png";
							}
							else{
								arr[i].imageUrl = "pc/images/folder.png";
							}
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
		if(args.hasFile)
			viewModel.getBackupFile().setValue(args.code);
    }
};