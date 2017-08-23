/// <reference path="../../common/js/Cube.js" />
/// <reference path="OrganizationManage_L.js" />
var firstFlag = false;
var addFlag = false;
var OrganizationManageViewModel_Extend = {
    doAction: function (name, viewModel) {
        if (this[name])
            this[name](viewModel);
    },

    init_Extend: function (viewModel) {
        viewModel.setReadOnly(true);
        this.buttonStateManager(viewModel);
        //左侧组织架构树
        var params = {};
      	viewModel.getProxy().GetOrgTree(params, function (success, fail) {
           if (fail) {
           	  	cb.util.tipMessage(fail.error);
           		return;
           }
           if (success) {
	           viewModel.getOrganizationMenus().setDataSource(success.children);
           }
       });
        //左侧标题
        var param = {};
        viewModel.getProxy().GetTitle(param, function (success, fail) {
        	if (fail) {
           	  	cb.util.tipMessage(fail.error);
           		return;
            }
            if (success && success.length > 0) {
                viewModel.getOrganizationTitle().setValue(success[0].companyName);
            }
        });
        //业务期初区间表格数据
        var param = {};
        viewModel.getProxy().GetApplicationGrid(param, function (success, fail) {
        	if (fail) {
           	  	cb.util.tipMessage(fail.error);
           		return;
            }
            if (success && success.length > 0) {
                viewModel.getApplicationGrid().setData(success);
            }
        });
        // 组织功能
        viewModel.getProxy().OrganizationFunction(param, function (success, fail) {
            if (success) {
                viewModel.getorgBox().setDataSource(success);
                viewModel.getorgBox().setState('ReadOnly',true);
            }
        });
    },
    treeItemClick: function (viewModel, args) {
        if (args.id) {
            OrganizationManageViewModel_Extend.orgID = args.id;
            var params = {
                "orgId": OrganizationManageViewModel_Extend.orgID
            };
            viewModel.getProxy().GetOrg(params, function (success, fail) {//服务请求成功
                if (fail) return;
                OrganizationManageViewModel_Extend.orgTS = success.orgVO.ts;
                OrganizationManageViewModel_Extend.corpTS = success.corpVO.ts;
                var param = {};
                viewModel.getProxy().OrganizationFunction(param, function (success1, fail) {
                    if (success1) {
                        success1.forEach(function (data, dataIndex, datas) {
                            if (success.orgVO.hasOwnProperty(data.fieldname))
                                data.value = success.orgVO[data.fieldname];
                        });
                        //viewModel.getorgBox().setDataSource(success1);
                        viewModel.getorgBox().setValue(success1);
                        viewModel.getorgBox().setState('ReadOnly',true);
                        //viewModel.getorgBox().setReadOnly(true);
                    }
                });
                for (var attr in success.orgVO) {
                    var value = success.orgVO[attr];
                        if (viewModel['get' + attr]) {
                            if (attr === 'enablestate')
                                //    value = data[attr] ? '启用' : '停用';
                                //viewModel['get' + attr]().setValue(value, false, true);
                            {
                                if (value == '1') {
                                    viewModel['get' + attr]().setValue('未启用');
                                }
                                else if (value == '2') {
                                    viewModel['get' + attr]().setValue('已启用');
                                }
                                else {
                                    viewModel['get' + attr]().setValue('已停用');
                                }
                               OrganizationManageViewModel_Extend.enablestate = value;
                            }
                            else {
                                viewModel['get' + attr]().setValue(value);
                            }
                            
                    }
                }
                for (var attr in success.corpVO) {
                    var value1=success.corpVO[attr];
                    if (viewModel['get' + attr]) {
                        viewModel['get' + attr]().setValue(value1);
                    }

                }
                OrganizationManageViewModel_Extend.orgID = success.orgVO.id;
                OrganizationManageViewModel_Extend.corpID = success.corpVO.id;
                viewModel.setReadOnly(true);
           		OrganizationManageViewModel_Extend.buttonStateManager(viewModel);
                
            });
        }
    },

    tabMenuClick: function (viewModel, args) {
        switch (args) {
            case "baseinfo":   //业务单元
               
               
                //flag = 0;
                //var params = {"orgid": args.id};
                //viewmodel.getproxy().getorg(params, function (success, fail) {//服务请求成功
                //    if (success) {
                //        viewmodel.loaddata(success);
                //    }
                //});
                break;
            case "addApplication":   //业务期初区间
                viewModel.setReadOnly(false);
                var data = [{
                    app_num: 1,
                    app_businessunit: 'a',
                    app_orgfunction: 'b',
                    app_modalnum: 'c',
                    app_accountperiod: 'd'
                }];
                viewModel.getApplicationGrid().setDataSource(data);
                break;
        }
    },
    // 新增
    addAction: function (viewModel, args) {
        addFlag = true;
        viewModel.clear();
        viewModel.setReadOnly(false);
        this.buttonStateManager(viewModel);
        OrganizationManageViewModel_Extend.orgID = null;
        OrganizationManageViewModel_Extend.corpID = null;
        //清除组织职能控件
        var param = {};
        viewModel.getProxy().OrganizationFunction(param, function (success1, fail) {
            if (success1) {
                viewModel.getorgBox().setDataSource(success1);
		        viewModel.getorgBox().setState('ReadOnly', false);
            }
        });
        
    },
    getnameAction: function (viewModel, args) {
        var s = viewModel.getname().getValue();
        viewModel.getshortname().setValue(s.substr(0, 6));
    },
    entitytypeAction: function (viewModel, args) {
        var entity = viewModel.get('entitytype_content').getValue();
        if (entity == '工厂') {
            viewModel.getorgtype2().setValue(true);
            viewModel.getfactoryorganization().setValue(true);
        }
        else if (entity == '公司') {
            viewModel.getorgtype2().setValue(true);
            viewModel.getfactoryorganization().setValue(false);
        }
        else {
            viewModel.getorgtype2().setValue(false);
            viewModel.getfactoryorganization().setValue(false);
            viewModel.getowncorp().set('isNullable', false);
        }
       
    },
    deleteAction: function (viewModel, args) {
        var enable=viewModel.getenablestate().getValue();
        var enableValue='';
        if(enable=="已启用"){
            enableValue='2';
        }
        else if(enable=="已启用"){
            enableValue='3';
        }
        else{
            enableValue='3';
        }
        var param = {
            orgVO: {
                "id": OrganizationManageViewModel_Extend.orgID,
                "code": viewModel.getcode().getValue(),
                "name": viewModel.getname().getValue(),
                "type": viewModel.gettype().getValue(),
                "shortname": viewModel.getshortname().getValue(),
                "entitytype": viewModel.getentitytype().getValue(),
                "orgtype2": viewModel.getorgtype2().getValue(),
                "purchasingorganization": viewModel.getpurchasingorganization().getValue(),
                "salesorganization": viewModel.getsalesorganization().getValue(),
                "financialorganization": viewModel.getfinancialorganization().getValue(),
                "inventoryorganization": viewModel.getinventoryorganization().getValue(),
                "factoryorganization": viewModel.getfactoryorganization().getValue(),
                "workcalendar": viewModel.getworkcalendar().getValue(),
                "enablestate": enableValue,
                "enabledate": viewModel.getenabledate().getValue(),
                "disabledate": viewModel.getdisabledate().getValue(),
                "owncorp": viewModel.getowncorp().getValue(),
                "fatherorg": viewModel.getfatherorg().getValue(),
                "multiaccountingrecords": viewModel.getmultiaccountingrecords().getValue(),
                "accperiodscheme": viewModel.getaccperiodscheme().getValue(),
                "currencytype": viewModel.getcurrencytype().getValue(),
                "ts": OrganizationManageViewModel_Extend.orgTS
            },
            corpVO: {
                "id": OrganizationManageViewModel_Extend.corpID,
                "ownorg": viewModel.getownorg().getValue(),
                "createdate": viewModel.getcreatedate().getValue(),
                "legalbodycode": viewModel.getlegalbodycode().getValue(),
                "postaddr": viewModel.getpostaddr().getValue(),
                "zipcode": viewModel.getzipcode().getValue(),
                "linkman": viewModel.getlinkman().getValue(),
                "phone": viewModel.getphone().getValue(),
                "fax": viewModel.getfax().getValue(),
                "url": viewModel.geturl().getValue(),
                "ts": OrganizationManageViewModel_Extend.corpTS
            }
        };
        var orgtypes = viewModel.getorgBox().getValue();

        for (var orgtype in orgtypes) {
            param.orgVO[orgtype] = orgtypes[orgtype];
        }
            viewModel.getProxy().DeleteOrg(param, function (success, fail) {
                if (success) {
               cb.util.tipMessage("删除成功！");
               viewModel.newRecord();
               viewModel.clear();
               viewModel.setReadOnly(false);
               var params = {};
               viewModel.getProxy().GetOrgTree(params, function (data) {
                   if (!data) return;
                   viewModel.getOrganizationMenus().setDataSource(data.children)
               })
            }
            else {
               cb.util.tipMessage(fail.error);

           }
           viewModel.clear();
        })
    },
    // 修改
    editAction: function (viewModel, args) {
        addFlag = false;
        viewModel.setReadOnly(false);
        this.buttonStateManager(viewModel);
        viewModel.getenabledate().setState('readOnly', true);
    },
    // 保存
    saveAction: function (viewModel, args) {
        var param = {
            orgVO: {
                "id": OrganizationManageViewModel_Extend.orgID,
                "code": viewModel.getcode().getValue(),
                "name": viewModel.getname().getValue(),
                "type": viewModel.gettype().getValue(),
                "shortname": viewModel.getshortname().getValue(),
                "entitytype": viewModel.getentitytype().getValue(),
                "orgtype2": viewModel.getorgtype2().getValue(),
                "purchasingorganization": viewModel.getpurchasingorganization().getValue(),
                "salesorganization": viewModel.getsalesorganization().getValue(),
                "financialorganization": viewModel.getfinancialorganization().getValue(),
                "inventoryorganization": viewModel.getinventoryorganization().getValue(),
                "factoryorganization": viewModel.getfactoryorganization().getValue(),
                "workcalendar": viewModel.getworkcalendar().getValue(),
                "enablestate": '1',
                "enabledate": viewModel.getenabledate().getValue(),
                "disabledate": viewModel.getdisabledate().getValue(),
                "owncorp": viewModel.getowncorp().getValue(),
                "fatherorg": viewModel.getfatherorg().getValue(),
                "multiaccountingrecords": viewModel.getmultiaccountingrecords().getValue(),
                "accperiodscheme": viewModel.getaccperiodscheme().getValue(),
                "currencytype": viewModel.getcurrencytype().getValue(),
                "ts": OrganizationManageViewModel_Extend.orgTS
            },
            corpVO: {
                "id": OrganizationManageViewModel_Extend.corpID,
                "ownorg": viewModel.getownorg().getValue(),
                "createdate": viewModel.getcreatedate().getValue(),
                "legalbodycode": viewModel.getlegalbodycode().getValue(),
                "postaddr": viewModel.getpostaddr().getValue(),
                "zipcode": viewModel.getzipcode().getValue(),
                "linkman": viewModel.getlinkman().getValue(),
                "phone": viewModel.getphone().getValue(),
                "fax": viewModel.getfax().getValue(),
                "url": viewModel.geturl().getValue(),
                "ts": OrganizationManageViewModel_Extend.corpTS
            }
        };

        var orgtypes = viewModel.getorgBox().getValue();

        for (var orgtype in orgtypes) {
            param.orgVO[orgtype] = orgtypes[orgtype];
        }

        var coporation = viewModel.getorgtype2().getValue();
        if (coporation == false) {
            viewModel.getowncorp().set('isNullable', false);
        }
        else {
            viewModel.getowncorp().set('isNullable', true);
        }
        var restr = viewModel.validate();
        
        if (restr == true) {
            if (addFlag == true) {
                viewModel.getProxy().GetCreateOrg(param, function (success, fail) {
                    if (success) {
                        cb.util.tipMessage("保存成功！");
                        viewModel.setReadOnly(true);
                        var orgVoId = success.orgVO.id;
                        var corpVoId = success.corpVO.id;
                        OrganizationManageViewModel_Extend.orgID = orgVoId;
                        OrganizationManageViewModel_Extend.corpID = corpVoId;
                        OrganizationManageViewModel_Extend.orgTS = success.orgVO.ts;
                        OrganizationManageViewModel_Extend.corpTS = success.corpVO.ts;
                      	var newTreeNode = {
                      		"id": orgVoId,
                      		"code": viewModel.getcode().getValue(),
                      		"name": viewModel.getname().getValue()
                      	};
                      	viewModel.getOrganizationMenus().appendNodes({
                      		"parentCode": null,
							"data": newTreeNode
                      	});
                        viewModel.getOrganizationMenus().setSelectNode(newTreeNode);
                    }
                    else {
                        cb.util.tipMessage(fail.error);
                        return;
                    }
                });
            }
            else {//修改
                viewModel.getProxy().UpdateOrg(param, function (success, fail) {
                    if (success) {
                        cb.util.tipMessage("保存成功！");
                        viewModel.setReadOnly(true);
                        var saveId = success.orgVO.id;
                        OrganizationManageViewModel_Extend.orgTS = success.orgVO.ts;
                        OrganizationManageViewModel_Extend.corpTS = success.corpVO.ts
                        debugger;
                   		var seleNode = viewModel.getOrganizationMenus().getSelectedNode();
                   		var newTreeNode = seleNode;
                   		newTreeNode.code = viewModel.getcode().getValue();
                   		newTreeNode.name = viewModel.getname().getValue();
                   		viewModel.getOrganizationMenus().updateNode(seleNode,newTreeNode);
                    }
                    else {
                        cb.util.tipMessage(fail.error);
                        return;
                    }
                });

            }
        }
        else {
            viewModel.setReadOnly(false);
        }

    },
    startAction: function (viewModel, args) {
            var params = {
                "orgId": OrganizationManageViewModel_Extend.orgID
            };
            viewModel.getProxy().EnableOrg(params, function (success, fail) {
                if (success) {
                    if(success.orgVO.enablestate==2)
                    viewModel.getenablestate().setValue('已启用');
                    OrganizationManageViewModel_Extend.enablestate = success.orgVO.enablestate;
                    viewModel.getenabledate().setValue(success.orgVO.enabledate);
                    OrganizationManageViewModel_Extend.buttonStateManager(viewModel);
                }
            })
    },
    stopAction: function (viewModel, args) {
            var params = {
                "orgId": OrganizationManageViewModel_Extend.orgID
            };
            viewModel.getProxy().DisableOrg(params, function (success, fail) {
                if (success) {
                    if(success.orgVO.enablestate == 3)
                    viewModel.getenablestate().setValue('已停用');
                    viewModel.getenabledate().setValue(success.orgVO.disabledate);
                    OrganizationManageViewModel_Extend.enablestate = success.orgVO.enablestate;
                    OrganizationManageViewModel_Extend.buttonStateManager(viewModel);
                }
            })
    },
    changeAction: function (viewModel, args) {
    	alert('开发中');
    },
    cancelAction: function (viewModel, args) {
    	var seleNode = viewModel.getOrganizationMenus().getSelectedNode();
    	viewModel.setReadOnly(true);
        this.buttonStateManager(viewModel);
        viewModel.getOrganizationMenus().setSelectNode(seleNode);
    },
    appMenuClick: function (viewModel, args) {

    },
    applicationGridAction: function (viewModel, args) {

    },
    appSaveAction: function (viewModel, args) {
        alert('开发中');
    },
    orgID:null,
    corpID: null,
    corpTS: null,
    orgTS:null,
    buttonStateManager: function(viewModel){
    	var seleNode = viewModel.getOrganizationMenus().getSelectedNode();
    	// 启用停用状态
    	var enableState = viewModel.getenablestate().getValue();
    	var modelReadonly = viewModel.getReadOnly();
    	if(seleNode.hasOwnProperty('code') == false && modelReadonly == true){
    		viewModel.getaddAction().set('disabled', false);
        	viewModel.geteditAction().set('disabled', true);
        	viewModel.getsaveAction().set('disabled', true);
        	viewModel.getcancelAction().set('disabled', true);
        	viewModel.getdeleteAction().set('disabled', true);
        	viewModel.getstartAction().set('disabled', true);
        	viewModel.getstopAction().set('disabled', true);
        	viewModel.getchangeAction().set('disabled', true);
    	}
    	else {
    		if(modelReadonly == true){
    			viewModel.getaddAction().set('disabled', false);
    		} else{
    			viewModel.getaddAction().set('disabled', true);
    		}
    		if(modelReadonly == true){
	        	viewModel.geteditAction().set('disabled', false);
    		} else{
    			viewModel.geteditAction().set('disabled', true);
    		}
    		if(modelReadonly == true){
	        	viewModel.getcancelAction().set('disabled', true);
    		} else{
				viewModel.getcancelAction().set('disabled', false);
    		}
    		if(modelReadonly == true){
	        	viewModel.getsaveAction().set('disabled', true);
    		} else{
				viewModel.getsaveAction().set('disabled', false);
    		}
    		if(modelReadonly == true){
	        	viewModel.getdeleteAction().set('disabled', false);
    		} else{
    			viewModel.getdeleteAction().set('disabled', true);
    		}
    		if(modelReadonly == true){
	        	if(this.enablestate == 2){//启用
		        	viewModel.getstartAction().set('disabled', true);
		        	viewModel.getstopAction().set('disabled', false);
	        	} else {
	        		viewModel.getstartAction().set('disabled', false);
		        	viewModel.getstopAction().set('disabled', true);
	        	}
    		}else{
    			viewModel.getstartAction().set('disabled', true);
		        viewModel.getstopAction().set('disabled', true);
    		}
    		if(modelReadonly == true){
    			viewModel.getchangeAction().set('disabled', false);
    		} else{
    			viewModel.getchangeAction().set('disabled', true);
    		}
    	}
    	
    }
};
