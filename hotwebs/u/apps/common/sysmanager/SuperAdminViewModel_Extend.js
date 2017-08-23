var SuperAdminViewModel_extend = {
    doAction: function (name, viewModel) {
        if (this[name])
            this[name](viewModel);
    },
    init_Extend: function (viewModel) {
        var param = {};
        viewModel.getadminVos().setData({dsMode:'Local'});
        viewModel.getProxy().LoadData(param,function (success, fail) {
            if (success) {
                if (success.adminVos.length == 0) {
                    viewModel.getadminVos().insertRow(0);
                    viewModel.getadminVos().setReadOnly(true);
                }
                else {
                    for (var i = 0; i < success.adminVos.length; i++) {
                        var temp = success.adminVos[i];
                        temp.pwdinuse = temp.password;
                        temp.isLocked = temp.isLocked.toString();
                    };
                    viewModel.getadminVos().setDataSource(success.adminVos);
                    viewModel.getadminVos().setReadOnly(true);
                }
            };
            });

    },

    deleteAction: function (viewModel, args) {
        var index = viewModel.getadminVos().getPageSelectedIndexs();
        if (index.length == 0) {
            alert("请勾选要删除的数据");
        }
        else {
			if (confirm("确定删除选定的超级管理员吗")) {
				var data = viewModel.getadminVos().getData();
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
				viewModel.getProxy().UpdateAdmin(data, function (success, error) {
					cb.util.loadingControl.endControl();
					if (success) {
						viewModel.getProxy().LoadData({}, function (success, fail) {
							if (success) {
								for (var i = 0; i < success.adminVos.length; i++) {
									var temp = success.adminVos[i];
									temp.pwdinuse = temp.password;
									temp.isLocked = temp.isLocked.toString();
								};
								viewModel.getadminVos().setDataSource(success.adminVos);
								viewModel.getadminVos().setReadOnly(true);
							}
						});
					}
					else {
						alert(error.error);
					}
				});
			}
        }
        },
    editAction: function (viewModel, args) {
        viewModel.getadminVos().setReadOnly(false);
        viewModel.getadminVos().showColumns("$commands");
        viewModel.geteditAction().set("visible", false);
        viewModel.getdeleteAction().set("visible", false);
        viewModel.getcancleAction().set("visible", true);
        viewModel.getsaveAction().set("visible", true);
},

    saveAction: function (viewModel, args) {
        var flag = false;
        var user = viewModel.getadminVos().getData();
        for (var i = 0; i < user.length; i++) {
            if (user[i].admCode) {
                if (user[i].admName) {
                    if (user[i].password) {
                        if (user[i].password != user[i].pwdinuse) {
                            alert("第"+(i+1)+"行两次密码不一致");
                            flag = true;
                            break;
                        }
                    }
                    else {
                        flag = true;
                        alert("第"+(i+1)+"行密码不能为空");
                        break;
                    }
                }
                else {
                    alert("第"+(i+1)+"行管理员名称不能为空");
                    flag = true;
                    break;
                };
            }
            else {
                alert("第" + (i + 1) + "行管理员编码不能为空");
                flag = true;
                break;
            };
        };
        if (flag == false) {
            cb.util.loadingControl.startControl();
            viewModel.getProxy().UpdateAdmin(user, function (success, fail) {
				cb.util.loadingControl.endControl();
                if (success) {
                    viewModel.getadminVos().hideColumns("$commands");
                    viewModel.geteditAction().set("visible", true);
                    viewModel.getdeleteAction().set("visible", true);
                    viewModel.getcancleAction().set("visible", false);
                    viewModel.getsaveAction().set("visible", false);
                    var params = {};
                    viewModel.getadminVos().setData({ dsMode: 'Local' });
                    viewModel.getProxy().LoadData(params, function (success, fail) {
                        if (success) {
                            for (var i = 0; i < success.adminVos.length; i++) {
                                var temp = success.adminVos[i];
                                temp.pwdinuse = temp.password;
                                temp.isLocked = temp.isLocked.toString();
                            };
                            viewModel.getadminVos().setDataSource(success.adminVos);
                            viewModel.getadminVos().setReadOnly(true);
                        }
                        else {
                            alert("请求数据失败");
                        }
                    });
                }
                else {
                    alert(fail.error);
                }
            });
        }
    },
    cancleAction: function (viewModel) {
        var param = {};
        viewModel.getadminVos().setData({ dsMode: 'Local' });
        viewModel.geteditAction().set("visible", true);
        viewModel.getdeleteAction().set("visible",true );
        viewModel.getcancleAction().set("visible", false);
        viewModel.getsaveAction().set("visible", false);
        viewModel.getadminVos().hideColumns("$commands");
        viewModel.getProxy().LoadData(param, function (success, fail) {
            if (success) {
                for (var i = 0; i < success.adminVos.length; i++) {
                    var temp = success.adminVos[i];
                    temp.pwdinuse = temp.password;
                    temp.isLocked = temp.isLocked.toString();
                };
                viewModel.getadminVos().setDataSource(success.adminVos);
                viewModel.getadminVos().setReadOnly(true);
            };
        });
  }
};
