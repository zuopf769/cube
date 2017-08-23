/// <reference path="../../../common/js/Cube.js" />
/// <reference path="CodeRule_L.js" />
var CodeRuleViewModel_Extend = {
    doAction: function (name, viewModel) {
        if (this[name])
            this[name](viewModel);
    },
    addflag: false,
    dateLength: null,
    maxCodeLength: null,
    nbcrCode: null,
    
    init_Extend: function (viewModel) {
    	viewModel.setReadOnly(true);
    	this.buttonStateManager(viewModel);
    	// 加载树
        this.loadCodeRuleTree(viewModel);
        // 设置dateLength
        this.changDateLength(viewModel);
    },
    // 规则树点击事件
    codeRuleTreeAction: function (viewModel, args) {
        viewModel.clear();
        viewModel.setReadOnly(true);
    	this.buttonStateManager(viewModel);
        if (args.codetype == "REOBJECT") {// 编码对象节点清空数据
        	this.maxCodeLength = args.data.codelenth;
        	args.data = {};
        	this.nbcrCode = args.code;
        }
        viewModel.loadData(args.data);
       
        if (args.codetype == "CODERULE") {// 编码规则节点
        	var seleNode = viewModel.getcodeRuleTree().getSelectedNode();
        	var parentNode = viewModel.getcodeRuleTree().getParentNode(seleNode);
        	this.maxCodeLength = parentNode.data.codelenth;
        	this.nbcrCode = args.data.nbcrcode;
            var param = {
                "pk_rulebase": args.code
            };
            viewModel.getProxy().CodeRuleGrid(param, function (success, fail) {
                if (success) {
                	// 规则元素grid设值
                	var data = [];
                	for(var i=0; i<success.length; i++){
                		success[i].billCodeElemVO['elemname'] = success[i].elemname;
                		success[i].billCodeElemVO['pk_billcoderefelem'] = success[i].pk_billcoderefelem;
                		data.push(success[i].billCodeElemVO);
                	}
                    viewModel.getcodeRuleGrid().setData(data);
                    
                    // 编码长度和效果预览设值
                    CodeRuleViewModel_Extend.setRuleLength(viewModel);
                    CodeRuleViewModel_Extend.setPreviewValue(viewModel);
                }
                else {
                    cb.util.tipMessage(fail.error)
                }
            });
        }
    },
    // grid单元格值改变事件
    codeRuleGridAction: function (viewModel, args) {
    	var codeMode = viewModel.getcodemode().getValue();
    	var model3D = viewModel.getcodeRuleGrid();
        var gridRows = model3D.getRows();
        var currentRow = gridRows[args.index];
        // 切换前缀类型时清空当前行字段值
        if(args.field == "elemtype") {
        	model3D.updateRow(args.index,{"elemname":null});
        	model3D.updateRow(args.index,{"elemvalue":null,"isrefer":"0","elemlenth":"0"});
        }
    	// 编码方式是前编码时，时间类型要带出系统默认时间
    	if(codeMode == "pre" && args.field == "elemtype" && args.value == "2"){
    		var sysDateTime = cb.util.formatDateTime(new Date().toUTCString());
    		model3D.setCellValue(args.index,'elemvalue',sysDateTime,false);
    	}
    	// 前缀值发生变化时
    	if(args.field == "elemvalue"){
    		// 前缀类型时时间类型
    		if(model3D.getCellValue(args.index,"elemtype") == "2"){
    			if(args.value){
	    			model3D.setCellValue(args.index,'elemlenth',dateLength,false);
    			} 
    			else {//点X清空的情况
    				model3D.updateRow(args.index,{"elemname":null});
    				model3D.setCellValue(args.index,'elemlenth',0,false);
    			}
    		}
  			else if(model3D.getCellValue(args.index,"elemtype") == "0"){// 前缀类型是常量
  				model3D.setCellValue(args.index,'elemlenth',args.value.length,false);
	  		}
  			if(model3D.getCellValue(args.index,"elemtype") == "1"){
    			if(args.value){
    			} 
    			else {//点X清空的情况
    				model3D.updateRow(args.index,{"elemname":null});
    				model3D.setCellValue(args.index,'elemlenth',0,false);
    			}
  			}
  			else {// 实体类型从参照携带，常量类型自己输入
  				
  			}
    	}
    	
    	// 更新编码长度字段
    	if(args.field == "elemlenth"){
	        var ruleLength = 0;
	        gridRows.forEach(function (item, index, grids) {
	            ruleLength += parseInt(item['elemlenth']);
	        });
	        
	        if (ruleLength > this.maxCodeLength) {
	            cb.util.warningMessage('总长度不能超过'+ this.maxCodeLength);
	        }
	        viewModel.getcodeLength().setValue(ruleLength);
    	}
    	// 实时改变预览
    	this.setPreviewValue(viewModel);
    },
    // 新增
    addAction: function (viewModel, args) {
        addflag = true;
        viewModel.setReadOnly(false);
        viewModel.getcodeLength().setReadOnly(true);
        this.buttonStateManager(viewModel);
        viewModel.clear();
        // 下拉字段设置默认值
        viewModel.getformat().setValue("yyyyMMdd");
        viewModel.getcodescope().setValue("a");
        viewModel.getcodemode().setValue("after");
        // 规则元素grid添加一行流水号数据
        viewModel.getcodeRuleGrid().appendRow({"elemtype":3,"isrefer":0,"elemlenth":1});
        viewModel.getcodeLength().setValue(1);
        this.setPreviewValue(viewModel);
        
    },
    // 修改
    editAction: function (viewModel, args) {
        addflag = false;
        viewModel.setReadOnly(false);
        viewModel.getcodeLength().setReadOnly(true);
        this.buttonStateManager(viewModel);
    },
    // 保存
    saveAction: function (viewModel, args) {
    	var errorMsg = this.validateCodeRuleGrid(viewModel);
    	if(errorMsg != ""){
    		cb.util.warningMessage(errorMsg);
    		return;
    	}
    	var seleNode = viewModel.getcodeRuleTree().getSelectedNode();
        if (addflag) {// 新增保存
            var param = {
                "baseVO": {
                    "nbcrcode": this.nbcrCode,
                    "rulecode": viewModel.getrulecode().getValue(),
                    "rulename": viewModel.getrulename().getValue(),
                    "iseditable": viewModel.getiseditable().getValue(),
                    "isautofill": viewModel.getisautofill().getValue(),
                    "format": viewModel.getformat().getValue(),
                    "codescope": viewModel.getcodescope().getValue(),
                    "codeLength": viewModel.getcodeLength().getValue(),
                    "islenvar": viewModel.getislenvar().getValue(),
                    "isgetpk": viewModel.getisgetpk().getValue(),
                    "codemode": viewModel.getcodemode().getValue(),
                    "isused": true
                }
            };
            var codeRefElems = [];
			var codeRuleGridData = viewModel.getcodeRuleGrid().getData();
			for(var i=0; i<codeRuleGridData.length; i++) {
				var ele = {
					"billCodeElemVO":codeRuleGridData[i],
					"elemname":codeRuleGridData[i].elemname
				};
				codeRefElems.push(ele);
			}
			param["codeRefElems"] = codeRefElems;
			
            var vstr = viewModel.validate();
            if (vstr == true) {
                viewModel.getProxy().CodeRuleCreate(param, function (success, fail) {
                    if (success) {
                        var pkBase = success;
						var newNode = {
							 "code": pkBase,
							 "name": param.baseVO.rulecode,
							 "data": param.baseVO,
							 "codetype": "CODERULE",
							 "parentcode": seleNode.code,
						};
						viewModel.getcodeRuleTree().appendNodes({
							"parentCode": seleNode.code,
							"data": newNode
						});
                        viewModel.getcodeRuleTree().setSelectNode(newNode);
                        cb.util.tipMessage('保存成功');
                    }
                    else {
                        cb.util.tipMessage(fail.error);
                    }
                })
            }
        }
        else {// 修改
            var collectData = viewModel.collectData();
            var dirtyData = viewModel.collectData(true);
        	 // 基本信息
        	var param = {
        		"baseVO": collectData
        	};
			// 规则元素
            var codeRefElems = [];
            //var rows = viewModel.getcodeRuleGrid().getRows();
            if(dirtyData.codeRuleGrid){
	            var rows = collectData.codeRuleGrid;
	            for(var i=0;i<rows.length;i++){
	            	var ele = {};
	            	rows[i].pk_billcodebase = collectData.pk_billcodebase;
	            	ele['billCodeElemVO'] = rows[i];
	            	ele['elemname'] = rows[i].elemname;
	            	ele['pk_billcoderefelem'] = rows[i].pk_billcoderefelem;
	            	codeRefElems.push(ele);
	            }
            }
            param['codeRefElems'] = codeRefElems;
            var newNode = seleNode;
            newNode['data'] = collectData;
            if(seleNode.name.indexOf("(") == -1){
            	newNode.name = collectData.rulename;
            }else {
	            newNode.name = collectData.rulename + seleNode.name.substring(seleNode.name.indexOf("("));
            }
            var clearhis = false;
            var stxt = '该操作可能由于新旧规则不一致导致取号和回退号错误！是否重置流水号？<br/>'
                + '点击"是"将清除旧规则产生的断号和最大流水号<br/>'
            + '点击"否"保留旧规则产生的断号和最大流水号<br/>'
            + '点击"取消"则取消本次修改';
            cb.util.confirmMessage(stxt, okcallback, cancelcallback, 'qwsw2s');
            function okcallback() {
                var url = viewModel.getProxy().config.CodeRuleEdit.url;
                viewModel.getProxy().config.CodeRuleEdit.url = url.substring(0,url.indexOf("?")).concat("?clearhis=true");
                viewModel.getProxy().CodeRuleEdit(param, function (success, fail) {
                    if (success) {
                        cb.util.tipMessage('修改成功');
                        viewModel.getcodeRuleTree().updateNode(seleNode,newNode);
                        CodeRuleViewModel_Extend.buttonStateManager(viewModel);
                    }
                })
            };
            function cancelcallback() {
                var url = viewModel.getProxy().config.CodeRuleEdit.url;
                viewModel.getProxy().config.CodeRuleEdit.url = url.substring(0,url.indexOf("?")).concat("?clearhis=false");
                viewModel.getProxy().CodeRuleEdit(param, function (success, fail) {
                    if (success) {
                        cb.util.tipMessage('修改成功');
                        viewModel.getcodeRuleTree().updateNode(seleNode,newNode);
                        CodeRuleViewModel_Extend.buttonStateManager(viewModel);
                    }
                })
            };
            viewModel.setReadOnly(true);
        }; 
    },
    // 取消
    cancelAction: function (viewModel, args) {
    	var seleNode = viewModel.getcodeRuleTree().getSelectedNode();
    	viewModel.setReadOnly(true);
        this.buttonStateManager(viewModel);
        if(addflag){// 新增
	        viewModel.clear();
	        // 下拉字段设置默认值
	        viewModel.getformat().setValue("yyyyMMdd");
	        viewModel.getcodescope().setValue("a");
	        viewModel.getcodemode().setValue("after");
        } else {// 修改
        	viewModel.getcodeRuleTree().setSelectNode(seleNode);
        }
    },
    // 删除
    deleteAction: function (viewModel, args) {
    	var seleNode = viewModel.getcodeRuleTree().getSelectedNode();
        var param = {
            "pk_billcodebase": seleNode.data.pk_billcodebase
        };
        viewModel.getProxy().CodeRuleDelete(param, function (success, fail) {
            if (success) {
                viewModel.getcodeRuleTree().removeNode(seleNode);
                var parentNode = viewModel.getcodeRuleTree().getParentNode(seleNode);
                viewModel.getcodeRuleTree().setSelectNode(parentNode);
            }
            else {
                cb.util.tipMessage(fail.error)
            }
        })
    },
    // 启用
    startAction: function (viewModel, args) {
    	var seleNode = viewModel.getcodeRuleTree().getSelectedNode();
        if (seleNode.data) {
            seleNode.data["isused"] = true;
            var param = seleNode.data;
           	var newNode = seleNode;
            newNode.imageUrl = '';
            newNode.name = seleNode.name.replace("(停用)",""),
        	viewModel.getcodeRuleTree().updateNode(seleNode,newNode);
            viewModel.getProxy().UnlockBillCodeRule(param, function (success, fail) {
				if(fail){
                    cb.util.tipMessage(fail.error)
				}
            });
            this.buttonStateManager(viewModel);
        }
    },
    // 停用
    stopAction: function (viewModel, args) {
    	var seleNode = viewModel.getcodeRuleTree().getSelectedNode();
        if (seleNode.data) {
        	seleNode.data["isused"] = false;
            var param = seleNode.data;
        	var newNode = seleNode;
            newNode.imageUrl = 'pc/images/lock.png';
            newNode.name = seleNode.name + "(停用)",
        	viewModel.getcodeRuleTree().updateNode(seleNode,newNode);
            viewModel.getProxy().LockBillCodeRule(param, function (success, fail) {
				if(fail){
                    cb.util.tipMessage(fail.error)
				}
            });
            this.buttonStateManager(viewModel);
        } 
    },
   	// 设置默认规则
    isdefaultAction: function (viewModel, args) {
        var seleNode = viewModel.getcodeRuleTree().getSelectedNode();
        if(seleNode.data) {
	        if (args.Value == true) {// 设置为默认规则
		        var parentNode = viewModel.getcodeRuleTree().getParentNode(seleNode);
		        var preDefaultNode = null;
		        for(var i=0; i<parentNode.children.length; i++){
		        	var child = parentNode.children[i];
		        	if(child.data.isdefault == true){
		        		preDefaultNode = child;
		        		break;
		        	}
		        }
	            seleNode.data["isdefault"] = true;
		        viewModel.getProxy().SetDefaultBillCodeRule(seleNode.data, function (success, fail) {
		            if (fail) {
		                cb.util.tipMessage(fail.error);
		                return;
		            }
		            if(preDefaultNode != null){//处理之前的默认规则设置
			            var preDefaultNodeNew = preDefaultNode;
			            preDefaultNodeNew.data["isdefault"] = false;
			            preDefaultNodeNew.name = preDefaultNodeNew.name.replace("(设置为默认)","");
			            preDefaultNodeNew.color = "";
			            viewModel.getcodeRuleTree().updateNode(preDefaultNode,preDefaultNodeNew);
		            }
		            var newNode = seleNode;
		            newNode.name = seleNode.name + "(设置为默认)";
		            newNode.color = "red";
		            viewModel.getcodeRuleTree().updateNode(seleNode,newNode);
		            
		        });
	        }
	        else {//取消默认规则
	            seleNode.data["isdefault"] = false;
	            viewModel.getProxy().CancelDefaultBillCodeRule(seleNode.data, function (success, fail) {
		            if (fail) {
		                cb.util.tipMessage(fail.error);
		                return;
		            }
		            var newNode = seleNode;
		            newNode.name = seleNode.name.replace("(设置为默认)","");
		            newNode.color = "";
		            viewModel.getcodeRuleTree().updateNode(seleNode,newNode);
		            var parentNode = viewModel.getcodeRuleTree().getParentNode(seleNode);
		        });
	        } 
        }
    },
    //时间格式字段值改变事件
    formatAction: function (viewModel, args) {
        this.changDateLength(viewModel);
        // 更新grid中时间类型字段的长度字段值
        var model3d = viewModel.getcodeRuleGrid();
        var model3dRows = model3d.getRows();
        for(var i=0; i<model3dRows.length; i++){
        	var elemType = model3d.getCellValue(i,"elemtype");
        	if(elemType == 2) {
        		model3d.setCellValue(i,'elemlenth',dateLength,true);
        	}
        }
        //改变预览样式
        this.setPreviewValue(viewModel);
    },
    // 断码管理
    brokenCodeManage: function (viewModel, args) {
    	var collectData = viewModel.collectData();
        cb.route.loadPageViewPart(viewModel, 'common.codelevel.BrokenCodeManageApp', { width: '650px', height: "560px", baseData: collectData })
    },
    // 流水管理
    waterManageAction: function (viewModel, args) {
       var collectData = viewModel.collectData();
       cb.route.loadPageViewPart(viewModel, 'common.codelevel.WaterManageApp', { width: '800px', height: "565px", baseData:collectData });
    },
    // 分配组织
    assigneOrgAction: function(viewModel, args) {
    	var seleNode = viewModel.getcodeRuleTree().getSelectedNode();
    	cb.route.loadPageViewPart(viewModel, 'common.codelevel.AssignOrgApp', { width: '400px', height: "500px", codeRule: seleNode });
    },
    //按钮状态
    buttonStateManager: function(viewModel) {
    	var selNode = viewModel.getcodeRuleTree().getSelectedNode();
    	var codeType = selNode.codetype;
    	var isModelReadonly = viewModel.getReadOnly(); 
    	if(selNode.hasOwnProperty('code') == false || codeType == "MODULE") {
    		viewModel.getaddAction().set('disabled', true);
        	viewModel.geteditAction().set('disabled', true);
        	viewModel.getsaveAction().set('disabled', true);
        	viewModel.getcancelAction().set('disabled', true);
        	viewModel.getdeleteAction().set('disabled', true);
        	viewModel.getstartAction().set('disabled', true);
        	viewModel.getstopAction().set('disabled', true);
        	viewModel.getassigned().set('disabled', true);
        	viewModel.getbrokenCodeManage().set('disabled', true);
        	viewModel.getwaterManage().set('disabled', true);
        	viewModel.getisdefault().set('disabled', true);
    	}
    	else if(codeType == "REOBJECT") {
    		if(isModelReadonly == true) {
	    	    viewModel.getaddAction().set('disabled', false);
    		} else {
    			viewModel.getaddAction().set('disabled', true);
    		}
    		viewModel.geteditAction().set('disabled', true);
    		if(isModelReadonly == true) {
    			viewModel.getsaveAction().set('disabled', true);
    		} else {
    			viewModel.getsaveAction().set('disabled', false);
    		}
        	if(isModelReadonly == true) {
    			viewModel.getcancelAction().set('disabled', true);
    		} else {
    			viewModel.getcancelAction().set('disabled', false);
    		}
        	viewModel.getdeleteAction().set('disabled', true);
        	viewModel.getstartAction().set('disabled', true);
        	viewModel.getstopAction().set('disabled', true);
        	viewModel.getassigned().set('disabled', true);
        	viewModel.getbrokenCodeManage().set('disabled', true);
        	viewModel.getwaterManage().set('disabled', true);
        	viewModel.getisdefault().set('disabled', true);
    	}
    	else if(codeType == "CODERULE") {
    		viewModel.getaddAction().set('disabled', true);
    		if(isModelReadonly == true) {
    			viewModel.geteditAction().set('disabled', false);
    		} else {
    			viewModel.geteditAction().set('disabled', true);
    		}
        	if(isModelReadonly == true) {
    			viewModel.getsaveAction().set('disabled', true);
    		} else {
    			viewModel.getsaveAction().set('disabled', false);
    		}
        	if(isModelReadonly == true) {
    			viewModel.getcancelAction().set('disabled', true);
    		} else {
    			viewModel.getcancelAction().set('disabled', false);
    		}
    		if(isModelReadonly == true) {
        		viewModel.getdeleteAction().set('disabled', false);
    		} else {
    			viewModel.getdeleteAction().set('disabled', true);
    		}
    		if(isModelReadonly == true) {
	        	var isused = selNode.data.isused;
	        	if(isused) { //启用
	        		viewModel.getstartAction().set('disabled', true);
	        		viewModel.getstopAction().set('disabled', false);
	        	} else {
	        		viewModel.getstartAction().set('disabled', false);
	        		viewModel.getstopAction().set('disabled', true);
	        	}
	        } else {
	        	viewModel.getstartAction().set('disabled', true);
	        	viewModel.getstopAction().set('disabled', true);
	        }
	        if(isModelReadonly == true) {
        		viewModel.getassigned().set('disabled', false);
    		} else {
    			viewModel.getassigned().set('disabled', true);
    		}
    		if(isModelReadonly == true) {
        		viewModel.getbrokenCodeManage().set('disabled', false);
    		} else {
    			viewModel.getbrokenCodeManage().set('disabled', true);
    		}
    		if(isModelReadonly == true) {
        		viewModel.getwaterManage().set('disabled', false);
    		} else {
    			viewModel.getwaterManage().set('disabled', true);
    		}
    		if(isModelReadonly == true) {
        		 viewModel.getisdefault().set('disabled', false);
    		} else {
    			 viewModel.getisdefault().set('disabled', true);
    		}
    	}
    },
    // 编码规则grid校验
    validateCodeRuleGrid: function(viewModel) {
    	// 编码方式
    	var codemode = viewModel.getcodemode().getValue();
    	var codeRuleGridData = viewModel.getcodeRuleGrid().getData();
    	var validInfo = {
    		"waterCount": 0,
    		"timeCount": 0,
    		"entityCount": 0,
    		"referCount": 0,
    		"waterElemlenth": true
    	};
    	var errorMsg = "";
    	if (codeRuleGridData.length > 0) {
    		for(var i=0; i<codeRuleGridData.length; i++) {
    			var row = codeRuleGridData[i];
    			if(row["elemtype"] == "3"){
    				validInfo.waterCount += 1;
    				if(row["elemlenth"] <= 0 || row["elemlenth"] > 10) {
    					validInfo.waterElemlenth = false;
    				}
    			}
    			if(row["elemtype"] == "2"){
    				validInfo.timeCount += 1;
    			}
    			if(row["elemtype"] == "1"){
    				validInfo.entityCount += 1;
    			}
    			if(row["isrefer"] == "1"){
    				validInfo.referCount += 1;
    			}
    		}
    	}  
    	if(codemode == "pre" && validInfo.entityCount > 0){
    		errorMsg += "前编码方式不支持业务实体!</br>";
    	}
    	if(validInfo.waterCount == 0 || validInfo.waterCount>1){
    		errorMsg += "同一编码规则有且只有一个流水号!</br>";
    	}
    	if(validInfo.waterElemlenth == false){
	    	errorMsg += "流水号的长度要介于1-10!</br>";
    	}
    	if(validInfo.timeCount>1){
    		errorMsg += "同一编码规则最多包含一个时间字段！</br>";
    	}
    	if(validInfo.referCount>2){
    		errorMsg += "同一编码规则最多包含两个流水依据！</br>";
    	}
    	return errorMsg;  
    },
    // 加载左侧规则树
    loadCodeRuleTree:function(viewModel){
    	var param = {};
        viewModel.getProxy().CodeRuleTree(param, function (success, fail) {
            if (success) {
                var codeTree = function (TreeItem) {
                    TreeItem.forEach(function (item, itemIndex, trees) {
                        if (item.data && item.data.isdefault == true) {
                            item.name += '(设置为默认)';
                            item.color = "red";
                        }
                        if (item.data && item.data.isused == false) {
                            item.name += '(停用)';
                            item.imageUrl = "pc/images/lock.png"
                        }
                        if (item.children != null) {
                        	codeTree(item.children) 
                        };
                    })
                };
                codeTree(success.children);
                viewModel.getcodeRuleTree().setDataSource(success.children);
            }
            else {
                cb.util.tipMessage(fail.error)
            }
        });
    },
    //新增一行
    codeRuleGridAddLine: function(viewModel){
    	viewModel.getcodeRuleGrid().appendRow({"elemtype":3,"isrefer":0,"elemlenth":0});
    },
    //删除一行
    codeRuleGridDeleteLine: function(viewModel,args){
    	viewModel.getcodeRuleGrid().deleteRows(args);
    	this.setRuleLength(viewModel);
    	this.setPreviewValue(viewModel);
    },
    changDateLength: function(viewModel){
    	var format = viewModel.getformat().getValue();
        var date = new Date();
        var year = date.getFullYear().toString();
        var newyear = year.slice(2, 4);
        var month = date.getMonth();
        var day = date.getDate();
        if (month < 10) {
            month = '0' + (month + 1);
        }
        else { month = month + 1; };
        if (day < 10){ 
        	day = '0' + day; }
        else{ 
        	day = day; 
        }
        if (format == 'yy') {
            viewModel.getshowStyle().setValue(newyear);
            dateLength = 2;
        }
        else if (format == 'yyyy') {
            viewModel.getshowStyle().setValue(year);
            dateLength = 4;
        }
        else if (format == 'yyMM') {
            viewModel.getshowStyle().setValue(newyear + month);
            dateLength = 4;
        }
        else if (format == 'yyyyMM') {
            viewModel.getshowStyle().setValue(year + month);
            dateLength = 6;
        }
        else if (format == 'yyMMdd') {
            viewModel.getshowStyle().setValue(newyear + month + day);
            dateLength = 6;
        }
        else {
            viewModel.getshowStyle().setValue(year + month + day);
            dateLength = 8;
        }
    },
    // 效果预览
   	setPreviewValue: function(viewModel){
   		var gridRows = viewModel.getcodeRuleGrid().getRows();
        var preview = '';
        var preStr = "效果：";
        var afterStr = "(编码 = ";
        gridRows.forEach(function (item, index, grids) {
        	if (item['elemtype'] == 0) {//常量
               preStr += item['elemvalue'];
               afterStr += "常量 ";
            }
        	if (item['elemtype'] == 1) {//业务实体
               preStr += "#EntityValue#";
               afterStr += "业务实体";
            }
        	if (item['elemtype'] == 2) {//时间类型
               preStr += viewModel.getshowStyle().getValue();
               afterStr += "时间类型";
            }
            if (item['elemtype'] == 3) {//流水号
                for (var i = 1, str = ''; i < item['elemlenth']; i++) {
                    preStr += '0'
                }
                preStr += '1';
                afterStr += "流水号";
            }  
            if(index != gridRows.length-1) {
            	afterStr += " + ";
            }
        });
        preview = preStr + afterStr+")";
        viewModel.getpreview().setValue(preview);
   	},
   	// 编码长度字段
   	setRuleLength: function(viewModel){
   		var gridRows = viewModel.getcodeRuleGrid().getRows();
        var ruleLength = 0;
        gridRows.forEach(function (item, index, grids) {
            if (item['elemtype'] == 2) {
                ruleLength += dateLength;
            }
            else {
                ruleLength += parseInt(item['elemlenth']);
            }         
        });
        viewModel.getcodeLength().setValue(ruleLength);
   	}
    
};