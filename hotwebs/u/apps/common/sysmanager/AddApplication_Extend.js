/// <reference path="../../common/js/Cube.js" />
/// <reference path="DeliveryApp_M.js" />
var InstalledModule = [];
var NotInstalledModule = [];
var InstalledFlag = [];
var AddApplication_Extend = {
    doAction: function (name, viewModel) {
        if (this[name])
            this[name](viewModel);
    },
    init_Extend: function (viewModel) {        //得到需要升级的模块树
        function transform(arr) {
            for (var i = 0; i < arr.length; i++) {
                arr[i].code = arr[i].moduleConfig.hm.code;
                arr[i].path = arr[i].moduleConfig.configFilePath;
                arr[i].version = arr[i].moduleConfig.hm.version;
                arr[i].id = arr[i].moduleConfig.hm.code;
                arr[i].requiredmodule = arr[i].moduleConfig.hm.requiredmodule;
                delete arr[i].moduleConfig;
                if (arr[i].children.length > 0) {
                    transform(arr[i].children);
                }
            };
        };
        function filterVesion(array) {
            for (var i = 0; i < array.length; i++) {
                var arr = [];
                if (array[i].requiredmodule == "") {
                    arr = null;
                }
                else {
                    var reModule = array[i].requiredmodule.split("&");
                    for (var j = 0; j < reModule.length; j++) {
                        var json = {};
                        var temp = reModule[j].split(",");
                        var code = temp[0].slice(1);
                        var version = temp[2].slice(0, temp[2].length - 1);
                        var str = version.slice(-1);
                        if (str == "*") {
                            version = version.slice(0, version.length - 1);
                        }
                        json.version = version;
                        json.code = code;
                        arr.push(json);
                    }
                };
                array[i].reModule = arr;
            }
        };
        function getInstalledModule(arr) {
            InstalledModule =[];
            NotInstalledModule = [];
            InstalledFlag = [];
            for (var i = 0; i < arr.length; i++) {
                for (var j = 0; j < arr[i].children.length; j++) {
                    temp = {};
                    if (arr[i].children[j].canSelected == true) {
                        //未安装
                        NotInstalledModule.push(arr[i].children[j]);
                    }
                    else {
                        InstalledModule.push(arr[i].children[j]);
                        temp.i = i;
                        temp.j = j;
                        InstalledFlag.push(temp);
                    }
                }
            }
        };
            var params = {
                dataSourceName: cb.route.getViewPartParams(viewModel).dsName,
            };
            viewModel.getProxy().GetApplication(params, function (success, fail) {//服务请求成功
                if (fail) {
					if(fail.error)
						alert(fail.error);
					else
						alert(fail.msgContent);
					return;
				}
                else if (success) {
                    transform(success);
                    getInstalledModule(success);
                    for (var n= 0; n < InstalledFlag.length; n++) {
                        success[InstalledFlag[n].i].children[InstalledFlag[n].j].imageUrl = "pc/images/2.png";
                    }
                    viewModel.getApplicationModule().setDataSource(success);
                    var array = [];
                    for (var i = 0; i < InstalledModule.length; i++) {
                        array[i] =InstalledModule[i].code;
                    }
                    viewModel.getApplicationModule().setSelectedValues(array);
                    filterVesion(NotInstalledModule);
                }
            });
    },
    confirmAction: function (viewModel) {                //点击确认后将所选的应用传到后台
        var infor = viewModel.getApplicationModule().getSelectedValues();
        var path = [];
        for (var i = 0; i < infor.length; i++) {
            for(var j=0;j<NotInstalledModule.length;j++){
                if(infor[i]==NotInstalledModule[j].code){
                    path.push(NotInstalledModule[j].path);
                }
            }
        }
        if (path.length == 0) {
            alert("请选择要升级的应用");
        }
        else {
            //$("#shadow,#tip").show();
            function callback() {
				cb.util.loadingControl.startControl();
                viewModel.getProxy().GetdoInstallAcount({ dataSourceName: cb.route.getViewPartParams(viewModel).dsName, path: path }, function (success, fail) {
					if (success) {
                        if (success == "installing") {
                            setTimeout(callback, 10000);
                        }
                        else {
							cb.util.loadingControl.endControl();
                            //$("#shadow,#tip").hide();
                            alert("升级成功");
                            cb.route.hidePageViewPart(viewModel);
                        }
                    }
                    else {
                        //$("#shadow,#tip").hide();
						cb.util.loadingControl.endControl();
                        alert(fail.msgContent);
                    }
                });
            };
            callback();
        }
    },
    cancelAction: function (viewModel) {
        viewModel.getApplicationModule().setDataSource([]);
        cb.route.hidePageViewPart(viewModel);
    },
    ApplicationModule: function (viewModel, args) {
        function getRequiredModule(code) {
            for (var i = 0; i < NotInstalledModule.length; i++) {
                if (code == NotInstalledModule[i].code) {
                    return NotInstalledModule[i].requiredmodule;
                }
            }
        };
        function handleRequiredModule(requiredM) {
            if (requiredM == "") {
            }
            else {
                var arr = [];
                var reModule = requiredM.split("&");
                for (var i = 0; i < reModule.length; i++) {
                    var json = {};
                    var temp = reModule[i].split(",");
                    var code = temp[0].slice(1);
                    var version = temp[2].slice(0, temp[2].length - 1);
                    //对version进行处理 
                    var str = version.slice(-1);
                    if (str == "*") {
                        version = version.slice(0, version.length - 1);
                    }
                    json.version = version;
                    json.code = code;
                    arr.push(json);
                }
                //根据arr中的code和version去进行依赖判断；
                for (var i = 0; i < arr.length; i++) {
                    for (var j = 0; j < NotInstalledModule.length; j++) {
                        if (arr[i].code == NotInstalledModule[j].code & NotInstalledModule[j].version.slice(0, arr[i].version.length) == arr[i].version) {
                            viewModel.getApplicationModule().setSelectedValues([arr[i].code]);
                            var required = getRequiredModule(arr[i].code);
                            handleRequiredModule(required);
                        }
                    }
                }
            }
        };
        var check = args.checked;
        if (check == true) {                                 //请将依赖关系item勾选上
            handleRequiredModule(args.requiredmodule);
        }
        else if (args.children.length > 0) {  //当前反勾选的是父节点 需要判断子节点是否全部可选 对于不可选的不应该改变        
            var children = args.children;
            children = children.filter(function (item, index, array) {
                return (item.canSelected == false);
            });
            var array = [];
            for (var i = 0; i < children.length; i++) {
                array[i] = children[i].code;
            }
            viewModel.getApplicationModule().setSelectedValues(array);
        }
        else {      
            var bool = InstalledModule.some(function (item, index, array) {
                return (item.code == args.code)
            });
            if (bool == true) {           //当前选中的是已安装的
                viewModel.getApplicationModule().setSelectedValues([args.code]);
            }
            else {      //当前选中的是未安装的 就要判断谁依赖它 并经依赖他的未安装模块进行递归反勾选。。
                function handleNotCheckModule(args) {
                    var con = [];
                    for (var i = 0; i < NotInstalledModule.length; i++) {
                        if (NotInstalledModule[i].reModule == null) { }
                        else {
                            for (var j = 0; j < NotInstalledModule[i].reModule.length; j++) {
                                if (args.code == NotInstalledModule[i].reModule[j].code & args.version.slice(0, NotInstalledModule[i].reModule[j].version.length) == NotInstalledModule[i].reModule[j].version) {
                                    con.push(NotInstalledModule[i].code);
                                    handleNotCheckModule({ code: NotInstalledModule[i].code, version: NotInstalledModule[i].version})
                                }
                            }
                        }
                    }
                    viewModel.getApplicationModule().setUnSelectedValues(con);
                };
                handleNotCheckModule(args);
            }
        };
        },
};


