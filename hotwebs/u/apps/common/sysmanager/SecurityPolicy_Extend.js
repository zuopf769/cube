/// <reference path="../../common/js/Cube.js" />
/// <reference path="DeliveryApp_M.js" />
var SecurityPolicyViewModel_Extend = {
    doAction: function (name, viewModel) {
        if (this[name])
            this[name](viewModel);
    },

    init_Extend: function (viewModel) {
    viewModel.getSecurityPolicy().setData({ dsMode: 'Local' });
    viewModel.getProxy().GetMenu(function(success,fail){
        if (fail) {
            alert(fail);
        }
        else if (success) {
            for (var i = 0; i < success.config.passwordlevel.length; i++) {
                success.config.passwordlevel[i].isautolock = success.config.passwordlevel[i].isautolock.toString();
            }
            viewModel.getSecurityPolicy().setDataSource(success.config.passwordlevel);
            viewModel.getSecurityPolicy().setReadOnly(true);
        }
        else {
            alert(error.error);
        }
    });
    },

    editAction: function (viewModel) {
        viewModel.getSecurityPolicy().setReadOnly(false);
        viewModel.getSecurityPolicy().showColumns("$commands");
        viewModel.geteditAction().set("visible", false);
        viewModel.getdeleteAction().set("visible", false);
        viewModel.getcancleAction().set("visible", true);
        viewModel.getsaveAction().set("visible", true);
    },

    saveAction: function (viewModel, args) {
        var data = viewModel.getSecurityPolicy().getData();
        var flag=true;
        for(var i=0;i<data.length;i++){
            if(data[i].code){
                if(data[i].name){}
                else{
                    flag=false;
                    alert("第" + (i+1) + "行名称为空，请填写");
                    break;
                }
            }
            else{
                flag=false;
                alert("第" + (i+1) + "行编码为空，请填写");
                break;
            }
        }

        if (flag) {
            cb.util.loadingControl.startControl();
                viewModel.getProxy().BatchOperate(data, function (success, fail) {
                    if (success) {
                        viewModel.geteditAction().set("visible", true);
                        viewModel.getdeleteAction().set("visible", true);
                        viewModel.getcancleAction().set("visible", false);
                        viewModel.getsaveAction().set("visible", false);
                        viewModel.getSecurityPolicy().hideColumns("$commands");
                        viewModel.getSecurityPolicy().setData({ dsMode: 'Local' });
                        viewModel.getProxy().GetMenu(function (success, fail) {
                            if (fail) {
                                cb.util.loadingControl.endControl();
                                alert(fail.error);
                            }
                            else if (success) {
                                cb.util.loadingControl.endControl();
                                for (var i = 0; i < success.config.passwordlevel.length; i++) {
                                    success.config.passwordlevel[i].isautolock = success.config.passwordlevel[i].isautolock.toString();
                                }
                                viewModel.getSecurityPolicy().setDataSource(success.config.passwordlevel);
                            }
                        });
                        viewModel.getSecurityPolicy().setReadOnly(true);
                    }
                    else {
                        cb.util.loadingControl.endControl();
                        alert(fail.error);
                    }
                });
            }
    },
    deleteAction: function (viewModel, args) {
        var index = viewModel.getSecurityPolicy().getPageSelectedIndexs();
        if (index.length == 0) {
            alert("请勾选要删除的数据");
        }
        else {
			if (confirm("确定删除选定的安全策略吗")) {
				var data = viewModel.getSecurityPolicy().getData();
				for (var i = 0; i < index.length; i++) {
					delete data[index[i]];
				}
				for (var i = 0; i < data.length; i++) {
					if (data[i]) { }
					else {
						data.remove(i);
						i--;
					}
				};
				cb.util.loadingControl.startControl();
				viewModel.getProxy().BatchOperate(data, function (success, fail) {
					cb.util.loadingControl.endControl();
					if (success) {
						viewModel.getSecurityPolicy().setData({ dsMode: 'Local' });
						viewModel.getProxy().GetMenu({}, function (success, fail) {
							if (fail) {
								alert(fail.error);
							}
							else if (success) {
								viewModel.getSecurityPolicy().setDataSource(success.config.passwordlevel);
							}
						});
						viewModel.getSecurityPolicy().setReadOnly(true);
					}
					else {
						alert(fail.error);
					}
				});
			}
        }
    },
    cancleAction: function (viewModel) {
        viewModel.geteditAction().set("visible", true);
        viewModel.getdeleteAction().set("visible", true);
        viewModel.getcancleAction().set("visible", false);
        viewModel.getsaveAction().set("visible", false);
        viewModel.getSecurityPolicy().hideColumns("$commands");
        viewModel.getSecurityPolicy().setData({ dsMode: 'Local' });
        viewModel.getProxy().GetMenu(function (success, fail) {
            if (fail) {
                alert(fail);
            }
            else if (success) {
                for (var i = 0; i < success.config.passwordlevel.length; i++) {
                    success.config.passwordlevel[i].isautolock = success.config.passwordlevel[i].isautolock.toString();
                }
                viewModel.getSecurityPolicy().setDataSource(success.config.passwordlevel);
                viewModel.getSecurityPolicy().setReadOnly(true);
            }
            else {
                alert(error.error);
            }
        });
    }
};
