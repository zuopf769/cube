/// <reference path="../../common/js/Cube.js" />
/// <reference path="DeliveryApp_M.js" />
var Source = [];   //存储原数据，只要保证时时更新就ok
var Add = false;
var ApplicationSystemViewModel_Extend = {
    doAction: function (name, viewModel) {
        if (this[name])
            this[name](viewModel);
    },
    init_Extend: function (viewModel) {
        debugger;
        cb.util.loadingControl.startControl();
        viewModel.getsaveAction().set("visible", false);
        viewModel.getcancleAction().set("visible", false);
		viewModel.getimportAction2().set("visible", false);
        viewModel.getProxy().GetApplicationMenus({}, function (success, error) {
            Source = success;
            //存储应用库列表和里面对应的管理员列表下的数据
            viewModel.applicationMenus = success;
            if (error) {
                alert(error.error);
            }else if (success.length > 0) {
                viewModel.getstandardmoney().set("queryData", { dsName:success[0].bcvo.dataSourceName});
                viewModel.getaccountingperiod().set("queryData", { dsName:success[0].bcvo.dataSourceName});
                $("#cube-main-right").show();
                var level = [];
                for (var attr in success[0].level) {
                    var json = {};
                    json.value = attr;
                    json.text = success[0].level[attr];
                    level.push(json);
                }
                viewModel.getusers().setColumnState("pwdlevelcode", "dataSource", level);
                var temp = [];
                for (var i = 0; i < success.length; i++) {
                    success[i].bcvo.text = success[i].bcvo.name + "  " + success[i].bcvo.code;
                    success[i].bcvo.code = success[i].bcvo.code;
                    success[i].bcvo.mutilaccount = success[i].bcvo.mutilaccount.toString();
                    for (var j= 0; j < success[i].users.length; j++) {
                        success[i].users[j].islocked = success[i].users[j].islocked.toString();
                        success[i].users[j].dealbusi = success[i].users[j].dealbusi.toString();
                        success[i].users[j].user_password1 = success[i].users[j].user_password;
                    }
                    success[i].bcvo.users = success[i].users;
                    if (i == 0) {
                        success[i].bcvo.selected = true;
                    }
                    if (success[i].bcvo.isLocked == true) {
                        success[i].bcvo.imageUrl = "pc/images/lock.png";
                    }
                    else {
                        success[i].bcvo.imageUrl = "pc/images/sys.png";
                    };
                    var lang = success[i].bcvo.langvalues.split(",");
                    if (lang.length == 1) {
                        success[i].bcvo.langvalues = lang[0];
                    }
                    if (lang.length == 2) {
                        success[i].bcvo.langvalues = lang[0];
                        success[i].bcvo.langvalues1 = lang[1];
                    }
                    if (lang.length == 3) {
                        success[i].bcvo.langvalues=lang[0];
                        success[i].bcvo.langvalues1=lang[1];
                        success[i].bcvo.langvalues2=lang[2];
                    }
                    temp.push(success[i].bcvo);
                }
                var expandSuccess = {
                    name: "应用库列表",
                    code:"Root",
                    children: temp,
                    imageUrl: "pc/images/parent.png"
                }
                viewModel.getApplicationMenus().setDataSource(expandSuccess);
                if (success[0].bcvo.isLocked == true) {
                    viewModel.getlockAction().setValue("解锁");
                }
                else {
                    viewModel.getlockAction().setValue("锁定");
                }
                viewModel.dsName = success[0].bcvo.dataSourceName;
                viewModel.appCode = success[0].bcvo.code;
                var langvo = Source[0].bcvo.langvos;
                var lang = [];
                if(langvo && langvo.length){
                    for (var j = 0; j < langvo.length; j++) {
                        var json = {};
                        json.text = langvo[j].dislpayname;
                        json.value = langvo[j].langcode;
                        lang.push(json);
                    }
                }
                viewModel.getlangvalues().setDataSource(lang);
                viewModel.getlangvalues1().setDataSource(lang);
                viewModel.getlangvalues2().setDataSource(lang);
                viewModel.loadData(Source[0].bcvo);
                viewModel.setReadOnly(true);
                cb.util.loadingControl.endControl();
            } else {
                cb.util.loadingControl.endControl();
                var expandSuccess = {
                    name: "应用库列表",
                    children: success,
                    imageUrl: "pc/images/parent.png"
                }
                viewModel.getApplicationMenus().setDataSource(expandSuccess);
                $("#rightToolbar,#information,.navbar-pc-strip").hide();
                viewModel.geteditAction().set("disabled", true);
                viewModel.getdeleteAction().set("disabled", true);
                viewModel.getlockAction().set("disabled", true);
				viewModel.getimportAction2().set("visible", true);
				viewModel.getimportAction2().set("disabled", false);
                $("#cube-main-right").show();
                viewModel.referFlag = true;
            }
        });
    },
    addAction: function (viewModel, args) {

        Add = true;
        viewModel.getProxy().GetAllLanguages({}, function (success) {
            if (success) {
                var succ1 = [];
                for (var i = 0; i < success.length; i++) {
                    var json = {};
                    json.text = success[i].displayName;
                    json.value = success[i].code;
                    succ1.push(json);
                }
                viewModel.getlangvalues().setDataSource(succ1);
                viewModel.getlangvalues1().setDataSource(succ1);
                viewModel.getlangvalues2().setDataSource(succ1);
            }
            else {
                alert("请求语种服务失败");
            }
        });
        viewModel.getProxy().GetDataSource({}, function (success) {
            if (success) {
                var succ = [];
                for (var i = 0; i < success.length; i++) {
                    var json = {};
                    json.text = success[i];
                    json.value = success[i];
                    succ.push(json);
                }
                if (Source.length == 0) {
                    viewModel.getdataSourceName().setDataSource(succ);
                    viewModel.setReadOnly(false);
                    if (viewModel.referFlag) {
                        viewModel.getstandardmoney().setReadOnly(true);
                        viewModel.getaccountingperiod().setReadOnly(true);
                    }
                    $("#action").hide();
                    viewModel.getsaveAction().set("visible", true);
                    viewModel.getcancleAction().set("visible", true);
					viewModel.getimportAction2().set("visible", false);
                    viewModel.getusers().showColumns("$commands");
                    $("#information").show();
                    viewModel.newRecord();
                    viewModel.getlangvalues().setValue(null);
                    viewModel.getlangvalues1().setValue(null);
                    viewModel.getlangvalues2().setValue(null);
                    viewModel.getdataSourceName().setValue(null);
                    viewModel.getusers().insertRow(0);
                }
                else {
                    var datasource = [];
                    for (var i = 0; i < Source.length;i++){
                    datasource.push(Source[i].bcvo.dataSourceName);
                    }
                    var succ2 = [];
                    for (var i = 0; i < succ.length; i++) {
                        if (datasource.some(function (item, index, array) {
                        return (item == succ[i].value);
                        })) { }
                        else {
                            succ2.push(succ[i]);
                        }
                    }
                    if (succ2.length == 0) {
                        alert("当前无可用数据源，无法新建应用系统");
                    }
                    else {
                        viewModel.getdataSourceName().setDataSource(succ2);
                        viewModel.setReadOnly(false);
                        if (viewModel.referFlag) {
                            viewModel.getstandardmoney().setReadOnly(true);
                            viewModel.getaccountingperiod().setReadOnly(true);
                        }
                        $("#action").hide();
                        viewModel.getsaveAction().set("visible", true);
                        viewModel.getcancleAction().set("visible", true);
						viewModel.getimportAction2().set("visible", false);
                        viewModel.getusers().showColumns("$commands");
                        $("#information").show();
                        viewModel.newRecord();
                        viewModel.getlangvalues().setValue(null);
                        viewModel.getlangvalues1().setValue(null);
                        viewModel.getlangvalues2().setValue(null);
                        viewModel.getdataSourceName().setValue(null);
                        viewModel.getusers().insertRow(0);
                    }
                }
            }
            else {
                alert("请求数据源失败");
            }
        });
        //viewModel.codeUserState = 1;
        //新增态，客户编码列可以编辑
        var model3d= viewModel.getModel3D();
        model3d.setState('checks', {editable:function (rowIndex, feild){
            if(feild == "user_code") return true;
            //if(rowIndex<2) return true;
        }})
    },
    deleteAction: function (viewModel, args) {
        if (confirm("确定删除应用库吗")) {
            params = {
                "code": viewModel.appCode
            }
            viewModel.getProxy().GetdeleteBusiCenterVO(params, function (success, fail) {
                if (success) {
                    alert("删除成功");
                    var params = {};
                    viewModel.getProxy().GetApplicationMenus(params, function (success, fail) {
                        if (fail) return;
                        else if (success.length > 0) {
                            Source = success;
                            viewModel.applicationMenus = success;
                            $("#cube-main-right").show();
                            var temp = [];
                            for (var i = 0; i < success.length; i++) {
                                success[i].bcvo.users = success[i].users;
                                if (i == 0) {
                                    success[i].bcvo.selected = true;
                                }
                                success[i].bcvo.text = success[i].bcvo.name + "  " + success[i].bcvo.code;
                                for (var j = 0; j < success[i].users.length; j++) {
                                    success[i].users[j].islocked = success[i].users[j].islocked.toString();
                                    success[i].users[j].dealbusi = success[i].users[j].dealbusi.toString();
                                    success[i].users[j].user_password1 = success[i].users[j].user_password;
                                }
                                if (success[i].bcvo.isLocked == true) {
                                    success[i].bcvo.imageUrl = "pc/images/lock.png";
                                }
                                else {
                                    success[i].bcvo.imageUrl = "pc/images/sys.png";
                                }
                                var lang = success[i].bcvo.langvalues.split(",");
                                if (lang.length == 1) {
                                    success[i].bcvo.langvalues = lang[0];
                                }
                                if (lang.length == 2) {
                                    success[i].bcvo.langvalues = lang[0];
                                    success[i].bcvo.langvalues1 = lang[1];
                                }
                                if (lang.length == 3) {
                                    success[i].bcvo.langvalues = lang[0];
                                    success[i].bcvo.langvalues1 = lang[1];
                                    success[i].bcvo.langvalues2 = lang[2];
                                }
                                temp.push(success[i].bcvo);
                            }
                            var expandSuccess = {
                                name: "应用库列表",
                                code: "Root",
                                children: temp,
                                imageUrl: "pc/images/parent.png"
                            }
                            viewModel.getApplicationMenus().setDataSource(expandSuccess);
                            viewModel.dsName = success[0].bcvo.dataSourceName;
                            viewModel.appCode = success[0].bcvo.code;
                            IsLock = success[0].bcvo.isLocked
                            if (IsLock == true) {
                                viewModel.getlockAction().setValue("解锁");
                            }
                            else {
                                viewModel.getlockAction().setValue("锁定");
                            }
                            viewModel.loadData(success[0].bcvo);
                            viewModel.getusers().setDataSource(Source[0].users);
                        }
                        else {
                            var expandSuccess = {
                                name: "应用库列表",
                                children: success,
                                imageUrl: "pc/images/parent.png"
                            }
                            viewModel.getApplicationMenus().setDataSource(expandSuccess);
                            $("#cube-main-right").show();
                            $("#rightToolbar,#information,.navbar-pc-strip").hide();
                            viewModel.geteditAction().set("disabled", true);
                            viewModel.getdeleteAction().set("disabled", true);
                            viewModel.getlockAction().set("disabled", true);
							viewModel.getimportAction2().set("visible", true);
							viewModel.getimportAction2().set("disabled", false);
                            viewModel.dsName = null;
                            viewModel.appCode = null;
                        }
                    });
                }
                else {
                    alert("删除失败");
                }
            });
        }
    },

    editAction: function (viewModel, args) {
        debugger;
        Add = false;
        viewModel.getusers().showColumns("$commands");
        //viewModel.getProxy().GetDataSource({}, function (success) {
        //    if (success) {
        //        var succ = [];
        //        for (var i = 0; i < success.length; i++) {
        //            var json = {};
        //            json.text = success[i];
        //            json.value = success[i];
        //            succ.push(json);
        //        }
        //        var datasource = [];
        //        for (var i = 0; i < Source.length; i++) {
        //            datasource.push(Source[i].bcvo.dataSourceName);
        //        }
        //        var succ2 = [];
        //        for (var i = 0; i < succ.length; i++) {
        //            if (datasource.some(function (item, index, array) {
        //            return (item == succ[i].value);
        //            })) { }
        //            else {
        //                succ2.push(succ[i]);
        //            }
        //        }
        //        viewModel.getdataSourceName().setDataSource(succ2);
        //        if (succ2.length == 0) {
        //            viewModel.getdataSourceName().setReadOnly(true);
        //        }
        //    }
        //});
        viewModel.getProxy().GetAllLanguages({}, function (success) {
            if (success) {
                var succ = [];
                for (var i = 0; i < success.length; i++) {
                    var json = {};
                    json.text = success[i].displayName;
                    json.value = success[i].code;
                    succ.push(json);
                }
                viewModel.getlangvalues().setDataSource(succ);
                viewModel.getlangvalues1().setDataSource(succ);
                viewModel.getlangvalues2().setDataSource(succ);
            }
        });
        viewModel.setReadOnly(false);
        viewModel.getdataSourceName().setReadOnly(true);
        $("#action").hide();
        viewModel.getsaveAction().set("visible", true);
        viewModel.getcancleAction().set("visible", true);
		viewModel.getimportAction2().set("visible", false);
        if (viewModel.getusers().getData().length == 0) {
            viewModel.getusers().insertRow(0);
        };
        viewModel.getcode().setReadOnly(true);
        debugger;
        //编辑态：已经存在的客户编码列不可编辑
        var model3d= viewModel.getModel3D();
        var applicationMenus = viewModel.applicationMenus;
        var code = viewModel.appCode;
        var num = 0;
        //获取不同的应用库下的管理员列表数量
        for(var i= 0; i< applicationMenus.length; i++){
            if(applicationMenus[i].bcvo.code == code){
                num = applicationMenus[i].users.length
            }
        };

        model3d.setState('checks', {editable:function (rowIndex, feild){
            if( rowIndex < num && feild == "user_code" ) return false;
        }})
    },
    saveAction: function (viewModel, args) {
        var flag = false;
        var user = viewModel.getusers().getData();
        var data = viewModel.collectData();
        delete data.users;
        if (data.code && data.code != "") {
            if (data.name && data.name != "") {
                if (data.dataSourceName && data.dataSourceName != "") {
                    if (data.langvalues) {
                        if (!data.langvalues1 && data.langvalues2) {
                            alert("请选择辅助语种一或者去除辅助语种二");
                        }
                        else {
                            if (data.langvalues2 && data.langvalues1) {
                                data.langvalues = data.langvalues + "," + data.langvalues1 + "," + data.langvalues2;
                            }
                            if (data.langvalues1 && !data.langvalues2) {
                                data.langvalues = data.langvalues + "," + data.langvalues1;
                            }
                            if (user.length == 0) {
                                alert("应用系统至少需要一个管理员");
                            }
                            else {
                                for (var i = 0; i < user.length; i++) {
                                    if (user[i].hasOwnProperty("user_code") == false) {
                                        flag = true;
                                        alert("请输入管理员编码");
                                    }
									else if(user[i].user_code.length>50){
										flag = true;
                                        alert("管理员编码长度超长");
									}
                                    else {
                                        if (user[i].hasOwnProperty("user_name") == false) {
                                            flag = true;
                                            alert("请输入管理员名称");
                                        }
                                        else if(user[i].user_name.length>50){
											flag = true;
                                            alert("管理员名称长度超长");
										}
										else {
                                            if (user[i].pwdlevelcode=="") {
                                                alert("安全策略不能为空");
                                                flag = true;
                                            }
                                            else {
                                                if (user[i].hasOwnProperty("user_password") == false) {
                                                    alert("密码不能为空");
                                                    flag = true;
                                                }
                                                else if (user[i].user_password != user[i].user_password1) {
                                                    alert("两次密码不一致");
                                                    flag = true;
                                                }
                                            };
                                        };
                                    };
                                }
                                if (flag == false) {
                                    if (Add == true) {
                                        alert("保存时会执行系统初始化，可能需要几分钟的时间");
                                    }
                                    function callBack() {
                                        viewModel.getProxy().SaveApplicationSystems({
                                            bcvo: data,
                                            users: user
                                        }, function (success, error) {
                                            if (success) {
                                                if (success == "installing") {
                                                    setTimeout(callBack, 10000);
                                                } else {
                                                    cb.util.loadingControl.endControl();
                                                    cb.util.confirmMessage("保存成功\n 请启用中间件!");
                                                    $("#rightToolbar,.navbar-pc-strip").show();
                                                    $("#action").show();
                                                    viewModel.geteditAction().set("disabled", false);
                                                    viewModel.getdeleteAction().set("disabled", false);
                                                    viewModel.getlockAction().set("disabled", false);
                                                    viewModel.getsaveAction().set("visible", false);
                                                    viewModel.getcancleAction().set("visible", false);
													viewModel.getimportAction2().set("visible", false);
                                                    viewModel.appCode = viewModel.getcode().getValue();
													viewModel.dsName = viewModel.getdataSourceName().getValue();
                                                    var params = {};
                                                    viewModel.getProxy().GetApplicationMenus(params, function (success, fail) {//服务请求成功
                                                        if (fail) return;
                                                        else if (success) {
                                                            Source = success;
                                                            viewModel.applicationMenus = success;
                                                            viewModel.getusers().hideColumns("$commands");
                                                            var temp = [];
                                                            for (var i = 0; i < success.length; i++) {
                                                                for (var j = 0; j < success[i].users.length; j++) {
                                                                    success[i].users[j].islocked = success[i].users[j].islocked.toString();
                                                                    success[i].users[j].dealbusi = success[i].users[j].dealbusi.toString();
                                                                    success[i].users[j].user_password1 = success[i].users[j].user_password;
                                                                }
                                                                success[i].bcvo.users = success[i].users;
                                                                if (success[i].bcvo.code == viewModel.appCode) {
                                                                    success[i].bcvo.selected = true;
                                                                    viewModel.getusers().setDataSource(success[i].users);
                                                                    if (success[i].bcvo.islocked == true) {
                                                                        viewModel.getlockAction().setValue("解锁");
                                                                    }
                                                                    else {
                                                                        viewModel.getlockAction().setValue("锁定");
                                                                    }
                                                                }
                                                                success[i].bcvo.text = success[i].bcvo.name + "  " + success[i].bcvo.code;
                                                                success[i].bcvo.code = success[i].bcvo.code;
                                                                if (success[i].bcvo.isLocked == true) {
                                                                    success[i].bcvo.imageUrl = "pc/images/lock.png";
                                                                }
                                                                else {
                                                                    success[i].bcvo.imageUrl = "pc/images/sys.png";
                                                                };
                                                                var lang = success[i].bcvo.langvalues.split(",");
                                                                if (lang.length == 1) {
                                                                    success[i].bcvo.langvalues = lang[0];
                                                                }
                                                                if (lang.length == 2) {
                                                                    success[i].bcvo.langvalues = lang[0];
                                                                    success[i].bcvo.langvalues1 = lang[1];
                                                                }
                                                                if (lang.length == 3) {
                                                                    success[i].bcvo.langvalues = lang[0];
                                                                    success[i].bcvo.langvalues1 = lang[1];
                                                                    success[i].bcvo.langvalues2 = lang[2];
                                                                }
                                                                temp.push(success[i].bcvo);
                                                            }
                                                            var expandSuccess = {
                                                                name: "应用库列表",
                                                                code: "Root",
                                                                children: temp,
                                                                imageUrl: "pc/images/parent.png"
                                                            }
                                                            viewModel.getApplicationMenus().setDataSource(expandSuccess);
                                                            viewModel.setReadOnly(true);
                                                        }
                                                    });
                                                }
                                            }
                                            else {
                                                cb.util.loadingControl.endControl();
                                                alert(error.error);
                                            }
                                        });
                                    };
                                    callBack();
                                    cb.util.loadingControl.startControl();
                                }
                            }
                        }
                    }
                    else {
                        alert("请选择主语种");
                    };
                }
                else {
                    alert("数据源不能为空");
                }
            }
            else {
                alert("系统名称不能为空");
            }
        }
        else {
            alert("系统编码不能为空");
        }
    },
    cancleAction: function (viewModel) {
        $("#action").show();
        viewModel.getsaveAction().set("visible", false);
        viewModel.getcancleAction().set("visible", false);
        for (var i = 0; i < Source.length; i++) {
            if (viewModel.appCode == Source[i].bcvo.code) {
                viewModel.loadData(Source[i].bcvo);
                for (var j = 0; j < Source[i].users.length; j++) {
                    Source[i].users[j].islocked = Source[i].users[j].islocked.toString();
                    Source[i].users[j].dealbusi = Source[i].users[j].dealbusi.toString();
                    Source[i].users[j].user_password1 = Source[i].users[j].user_password;
                }
                viewModel.getusers().setDataSource(Source[i].users);
            }
        }
		if(Source != null && Source.length == 0){
			viewModel.getimportAction2().set("visible", true);
		}
        viewModel.getusers().hideColumns("$commands");
        viewModel.setReadOnly(true);
    },
    appMenuClick: function (viewModel, args) {
        $("#action").show();
        viewModel.getsaveAction().set("visible", false);
        viewModel.getcancleAction().set("visible", false);
        viewModel.setReadOnly(true);
        if (args.name == "应用库列表") { }
        else {
            viewModel.getstandardmoney().set("queryData", { dsName: args.dataSourceName });
            viewModel.getaccountingperiod().set("queryData", { dsName: args.dataSourceName });
            viewModel.dsName = args.dataSourceName;
            viewModel.appCode = args.code;
            if (args.isLocked== true) {
                viewModel.getlockAction().setValue("解锁");
            }
            else {
                viewModel.getlockAction().setValue("锁定");
            }
            viewModel.loadData(args);
            viewModel.getusers().setDataSource(args.users);
        };
    },
    lockAction: function (viewModel, args) {
        viewModel.getProxy().lockAction({ code: viewModel.appCode }, function (success, fail) {
            //当应用库被他人所用时，后台返回fail表示不可锁定
            if(fail){
                cb.util.tipMessage(fail.error);
                return;
            };
            if (success) {
                var temp = [];
                for (var i = 0; i < Source.length; i++) {
                    if (Source[i].bcvo.code == viewModel.appCode) {
                        Source[i].bcvo.selected = true;
                        Source[i].bcvo.isLocked = !Source[i].bcvo.isLocked;
                        if (Source[i].bcvo.isLocked == true) {
                            viewModel.getlockAction().setValue("解锁");
                        }
                        else {
                            viewModel.getlockAction().setValue("锁定");
                        }
                    }
                    else {
                        Source[i].bcvo.selected = false;
                    }
                    Source[i].bcvo.text = Source[i].bcvo.name + "  " + Source[i].bcvo.code;
                    if (Source[i].bcvo.isLocked == true) {
                        Source[i].bcvo.imageUrl = "pc/images/lock.png";
                    }
                    else {
                        Source[i].bcvo.imageUrl = "pc/images/sys.png";
                    }
                    temp.push(Source[i].bcvo);
                }
                var expandSuccess = {
                    name: "应用库列表",
                    code: "Root",
                    children: temp,
                    imageUrl: "pc/images/parent.png"
                }
                viewModel.getApplicationMenus().setDataSource(expandSuccess);
            }
        });
    },
    langvalues1: function (viewModel) {
        var language = viewModel.getlangvalues().getValue();
        var language1 = viewModel.getlangvalues1().getValue();
        var language2= viewModel.getlangvalues2().getValue();
        if (language1 == language) {
            alert("辅助语种一不能与主语种相同");
            viewModel.getlangvalues1().setValue(null);
        }
        if (language1 == language2) {
            alert("辅助语种一不能与辅助语种二相同");
            viewModel.getlangvalues1().setValue(null);
        }
    },
    langvalues2: function (viewModel) {
        var language = viewModel.getlangvalues().getValue();
        var language1 = viewModel.getlangvalues1().getValue();
        var language2 = viewModel.getlangvalues2().getValue();
        if (language2 == language) {
            alert("辅助语种一不能与主语种相同");
            viewModel.getlangvalues2().setValue(null);
        }
        if (language1 == language2) {
            alert("辅助语种一不能与辅助语种二相同");
            viewModel.getlangvalues2().setValue(null);
        }
        if (viewModel.getlangvalues1().getValue() =="") {
            alert("请先选择辅助语种一");
            viewModel.getlangvalues2().setValue(null);
        }
    },
    updateAction: function (viewModel, args) {
        cb.route.loadPageViewPart(viewModel, "common.sysmanager.UpdateApp", { height: "580px", width: '796px', dsName: viewModel.dsName, appCode: viewModel.appCode});
    },
    addapplication: function (viewModel, args) {
        cb.route.loadPageViewPart(viewModel, "common.sysmanager.AddApplicationApp", { height: "75%", width: '810px', dsName: viewModel.dsName, appCode: viewModel.appCode });
    },
    printAction: function (viewModel) {
        cb.route.loadPageViewPart(viewModel, "common.sysmanager.PrintApp", { height: "75%", width: '796px', dsName: viewModel.dsName, appCode: viewModel.appCode });
    },
    importAction: function (viewModel) {
        cb.route.loadPageViewPart(viewModel, "common.sysmanager.ImportApp", { height: "80%", width: '796px', dsName: viewModel.dsName, appCode: viewModel.appCode });
    },
    languageExtension: function (viewModel) {
        cb.route.loadPageViewPart(viewModel, "common.sysmanager.LanguageExtensionApp", { height: "70%", width: '796px', dsName: viewModel.dsName, appCode: viewModel.appCode });
    },
    dataSourceName: function (viewModel) {
		cb.util.loadingControl.startControl();
        var code = viewModel.getcode().getValue();
        var name = viewModel.getname().getValue();
        var effectDate = viewModel.geteffectDate().getValue();
        viewModel.getProxy().GetInforByDs({ design:  viewModel.getdataSourceName().getValue()}, function (success) {
            cb.util.loadingControl.endControl();
			if (success) {
                var ds = viewModel.getdataSourceName().getValue();
				if(success.users.length>0){
					for(i=0;i<success.users.length;i++){
						success.users[i].user_password1 = success.users[i].user_password;
					}
				}
                viewModel.loadData(success);
                viewModel.getdataSourceName().setValue(ds);
                viewModel.getcode().setValue(code);
                viewModel.getname().setValue(name);
                viewModel.geteffectDate().setValue(effectDate);
                if (success.users) { }
                else {
                    viewModel.getusers().insertRow();
                }
            }
        });
    }
};