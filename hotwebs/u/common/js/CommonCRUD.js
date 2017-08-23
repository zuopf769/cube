cb.data.commonCRUD = function (viewModel) {

    var batOp = this;
    this.options = {        
        //设置确认窗口
        setConfirm: function (confirmFun) {
            if (confirmFun) batOp.options._confirmFun = confirmFun
            return batOp.options;
        },
        getConfirm: function () {
            return batOp.options._confirmFun;
        },
        //设置操作描述
        setOperateDesc: function (desc) {
            if (desc) batOp.options._OperateDesc = desc;
            return batOp.options;
        },
        getOperateDesc: function (desc) {
            return batOp.options._OperateDesc;
        },
        //处理操作函数参数
        setOpreateFuncParam: function (func) {
            batOp.options._OpreateFuncParam = func;
            return batOp.options;
        },
        getOpreateFuncParam: function (func) {
            return batOp.options._OpreateFuncParam;
        },
        //处理操作函数参数
        setBeforeCollectData: function (func) {
            if (func) batOp.options._OpreateFuncParam = func;
            return batOp.options;
        },
        getBeforeCollectData: function (func) {
            return batOp.options._OpreateFuncParam;
        }
    };
    this.symbol = viewModel.getSymbol();

	/***********************************
    * 公开方法：单据列表增加
    * 单据列表界面，跳转到单据界面
    */
    this.linkOpen = function () {
        //viewModel, { "mode": "add" }
		innerLoadDetailView(viewModel, { "mode": "add"});
    };

    /**
    * 公共方法：初始化界面数据
    * 
    */
    this.initListViewData = function (params) {
        var listCard = viewModel.getModel3D();
        var symbol = viewModel.getSymbol();
        var that = this;
        this.setAddButton();
        this.setConfigButton();//设置按钮配置
        //列表界面超链接  start
        listCard.un("clickcell");
        listCard.on("clickcell", function (args) {
            that.openLink(args);
        });//end
        if (!symbol) return;
        //加载子表栏目：
        if (params.detailColumnCode) {
            cb.data.CommonProxy(symbol).GetColumnByColCode({ "columncode":params.detailColumnCode}, function (success, fail) {
                if (success) {
                    var subColumns = cb.util.convertToColumns(success.children[0]);
                    listCard.setData({
                        "detailInit": {
                            "columns": subColumns, "query": function (args, callback) {
                                var pkName = listCard.getPkName();
                                var pk = args[pkName];
                                cb.data.CommonProxy(symbol).QueryByPK({ id: pk }, function (success, fail) {
                                    if (success) {
                                        if (callback) {
                                            callback(success.pk_dispatchlist_b);
                                        }
                                    }

                                });
                            }
                        }
                    });//设置详情列表
                }
            });//
        }
        //初始化查询方案
        var queryScheme = viewModel.getqueryScheme();
        queryScheme.setData({
            "mode": "slide",
            "fields": {
                "valueField": "queryschemeID",
                "textField": "name"
            }
        });
        var columnCode = listCard.get("columnCode");
        var pageSize = listCard.getPageSize();
        var params = { "loadDefaultData": true, "columnCode": columnCode, "type": "0", "pageSize": pageSize };
        cb.data.CommonProxy(symbol).LoadSchemeList(params, function (success, fail) {
            if (fail) {
                alert("获取查询方案列表失败");
                return;
            }
            var schemeList = success.schemeList;
            if (schemeList) {
                var defaultSchemeID = success.defaultSchemeID;
                for (var i = 0, j = schemeList.length; i < j; i++) {
                    //设置默认查询方案
                    if (schemeList[i].queryschemeID == defaultSchemeID) {
                        schemeList[i].isSelected = true;
                        break;
                    }
                }
                queryScheme.setDataSource(schemeList);
                var querySchemeIds = [];
                for (var i = 0, len = schemeList.length; i < len; i++) {
                    querySchemeIds.push(schemeList[i].queryschemeID);
                }
                cb.data.CommonProxy(symbol).LoadSchemeDataCount(querySchemeIds, function (success, fail) {
                    if (fail) {
                        alert("获取查询方案数据记录数失败");
                        return;
                    }
                    queryScheme.set("dataCount", success);
                });
            }
            var defaultSchemeID = success.defaultSchemeID;
            if (defaultSchemeID) {
                listCard.set("querySchemeID", defaultSchemeID);
                var defaultSchemeData = success.defaultSchemeData;
                if (defaultSchemeData) {
                    listCard.setDataSource(cb.data.CommonProxy(symbol), "Query", { "querySchemeID": defaultSchemeID }, defaultSchemeData);
                }
            }
        });
    };
    /*  审批状态影响以下按钮可用不可用: 审批，提交，收回，弃审，删除，编辑 
        自由       -1, [{field:"approveAction",disable:"1"},{field:"submitAction",disable:"0"},{field:"withdrawAction",disable:"1"},{field:"unApproveAction",disable:"1"},{field:"deleteAction",disable:"0"},{field:"editAction",disable:"0"}]
        审批未通过  0, [{field:"approveAction",disable:"1"},{field:"submitAction",disable:"1"},{field:"withdrawAction",disable:"1"},{field:"unApproveAction",disable:"1"},{field:"deleteAction",disable:"0"},{field:"editAction",disable:"0"}]
        审批通过    1, [{field:"approveAction",disable:"1"},{field:"submitAction",disable:"1"},{field:"withdrawAction",disable:"1"},{field:"unApproveAction",disable:"1"},{field:"deleteAction",disable:"1"},{field:"editAction",disable:"1"}]
        审批中      2, [{field:"approveAction",disable:"0"},{field:"submitAction",disable:"1"},{field:"withdrawAction",disable:"1"},{field:"unApproveAction",disable:"0"},{field:"deleteAction",disable:"1"},{field:"editAction",disable:"1"}]
        已提交      3, [{field:"approveAction",disable:"0"},{field:"submitAction",disable:"1"},{field:"withdrawAction",disable:"0"},{field:"unApproveAction",disable:"1"},{field:"deleteAction",disable:"1"},{field:"editAction",disable:"1"}]
    */
    this.updateApproveStatus = function () {
        if (viewModel) {
            if (viewModel.getapprovestatus) {                
                var approvestatus = viewModel.getapprovestatus().getValue();
                approvestatus = (approvestatus == undefined || approvestatus==null)?-1:approvestatus;                
                switch (approvestatus) {
                    case -1:
                        viewModel.setActionState([{ field: "approveAction", disable: "1" }, { field: "submitAction", disable: "0" }, { field: "withdrawAction", disable: "1" }, { field: "unApproveAction", disable: "1" }, { field: "deleteAction", disable: "0" }, { field: "editAction", disable: "0" }]);                        
                        break;
                    case 0:
                        viewModel.setActionState([{ field: "approveAction", disable: "1" }, { field: "submitAction", disable: "1" }, { field: "withdrawAction", disable: "1" }, { field: "unApproveAction", disable: "1" }, { field: "deleteAction", disable: "0" }, { field: "editAction", disable: "0" }]);
                        break;
                    case 1:
                        viewModel.setActionState([{ field: "approveAction", disable: "1" }, { field: "submitAction", disable: "1" }, { field: "withdrawAction", disable: "1" }, { field: "unApproveAction", disable: "1" }, { field: "deleteAction", disable: "1" }, { field: "editAction", disable: "1" }]);
                        break;
                    case 2:
                        viewModel.setActionState([{ field: "approveAction", disable: "0" }, { field: "submitAction", disable: "1" }, { field: "withdrawAction", disable: "1" }, { field: "unApproveAction", disable: "0" }, { field: "deleteAction", disable: "1" }, { field: "editAction", disable: "1" }]);
                        break;
                    case 3:
                        viewModel.setActionState([{ field: "approveAction", disable: "0" }, { field: "submitAction", disable: "1" }, { field: "withdrawAction", disable: "0" }, { field: "unApproveAction", disable: "1" }, { field: "deleteAction", disable: "1" }, { field: "editAction", disable: "1" }]);
                        break;
                }

            }
        }
    };

    this.setState = function (state) {
        viewModel.setState(state);
        if(state.toLocaleLowerCase()==="browse"){
            this.updateApproveStatus();
        }
    };

	
    /***********************************
    * 公开方法
    * 新增单据，置位单据状态为新增，并调用前后置事件
    */
    this.add = function () {
        cb.model.PropertyChange.delayPropertyChange(true); //延迟触发属性(值等)变化
        if (viewModel.beforeExecute("add")) {
            viewModel.clear(true);
            batOp.setState("add");
            viewModel.setReadOnly(false);
            if (viewModel.getattachmentList) {
                viewModel.getattachmentList().set("loadPage", {"mode":"add","PK":"main"});//加载附件
            }
            viewModel.afterExecute("add")
        }
        cb.model.PropertyChange.doPropertyChange(); //恢复值变化(PropertyChange)等
    };

    /***********************************
   * 公开方法：联查单据
   * 编辑单据，置位单据状态为编辑，并调用前后置事件
   * 此方法用于，从单据列表进入
   * 与edit方法的区别是，本方法负责取数据，并设置状态
   * 而edit仅仅用来置位状态。
   */
    this.browse = function (args) {        
        if (viewModel.beforeExecute("browse"),args) {
            cb.data.CommonProxy(this.symbol).QueryByPK({ id: args.id }, function (success, fail) {
                args = args || {};
                args.opName ="读取数据";                
                var callBack = function (result) {
                    cb.model.PropertyChange.delayPropertyChange(true); //延迟触发属性(值等)变化
                    if (result.success) {
                        if (result.data) {                            
                            viewModel.loadData(result.data);
                            if (viewModel.getattachmentList) {
                                viewModel.getattachmentList().set("loadPage", {"attachrelateid":result.data.attachrelateid,"PK":"main"});//加载附件
                            }
                            if (viewModel.getpagination)
                                viewModel.getpagination().setValue({ "billIndex": args.billIndex, "billCount": args.billCount });
                        }                                             
                        viewModel.setReadOnly(true);
                        batOp.setState("browse");
                    }
                    cb.model.PropertyChange.doPropertyChange();
                    if (cb.util.isFunction(args.callback)) {
                        args.callback(result);
                    }
                    viewModel.afterExecute("browse", result);
                };

                handleResult(success, fail, args, callBack);
            });            
        }        
    };

    /**************************************
    * 公开方法
    * 删除单据，具体操作，删除后跳转到下一条单据
    * 如果当前是最后一条，则跳转到上一条单据
    */
    this.delete = function (args) {
        if (!batOp.symbol) return;
        var data = cb.biz.getInputData(viewModel);
        if (!data) return;
        args = checkArgs(args);

        if (viewModel.beforeExecute("delete", data)) {
            var msg = "您真的确定要删除吗？\n\n请确认！";
            var callBack = function (result) {
                if (result.success) {
                    var data = getDetailParams();
                    if (data && batOp.symbol) {
                        if (viewModel.getpagination()) {
                            var toPage = viewModel.getpagination().getValue().billIndex;
                            var args = getPaginationParams(toPage, viewModel);
                            //删除后跳转到下一条数据
                            cb.data.CommonProxy(batOp.symbol).QueryNextPreBill(args, function (success, fail) {
                                if (success) {
                                    if (success.currentBillData) {
                                        viewModel.loadData(success.currentBillData);
                                        if (viewModel.getpagination)
                                            viewModel.getpagination().setValue({ "billIndex": success.billIndex, "billCount": success.billCount });
                                        batOp.setState("browse");
                                    }
                                    else {
                                        //删除后跳转到上一条数据
                                        toPage -= 1;
                                        var args = getPaginationParams(toPage, viewModel);

                                        cb.data.CommonProxy(batOp.symbol).QueryNextPreBill(args, function (success, fail) {
                                            if (success) {
                                                if (success.currentBillData) {
                                                    viewModel.loadData(success.currentBillData);
                                                    if (viewModel.getpagination)
                                                        viewModel.getpagination().setValue({ "billIndex": success.billIndex, "billCount": success.billCount });
                                                    batOp.setState("browse");
                                                }
                                            }
                                            else {
                                                //下一条，上一条都为空，
                                                viewModel.clear();
                                                //设置空白单据状态（浏览态？），非新增；
                                                batOp.setState("browse");
                                            }
                                        });
                                    }
                                }
                                else {
                                    //找不到数据，或者服务错误
                                    viewModel.clear();
                                }
                            });
                        }// if viewModel.getpagination()
                    }
                } else {
                    //删除失败后，该如何处理
                    if (result.error) {
                        cb.util.tipMessage(result.error);
                    }
                    viewModel.afterExecute("delete", result);
                }
            };
            cb.util.confirmMessage(msg, function () {
                innerDelete(data, args, callBack);
            },null,batOp);           
        }      
    };

    /**************************************
    * 公开方法
    * 编辑单据，将单据状态改为编辑状态。
    * 
    */
    this.edit = function (args) {        
        if (viewModel.beforeExecute("edit", args)) {
            cb.model.PropertyChange.delayPropertyChange(true);
			viewModel.setReadOnly(false);
			batOp.setState("edit");
			cb.model.PropertyChange.doPropertyChange();
			viewModel.afterExecute("edit", args);           			              
        }        
    }

    /**************************************
   * 公开方法
   * 复制单据，将单据状态改为新增状态。
   * 这个方法需要丰富，提供哪些字段复制，哪些字段不复制
   */
    this.copy = function (args) {
        var data = viewModel.collectData();

        if (viewModel.beforeExecute("copy", data)) {

            cb.model.PropertyChange.delayPropertyChange(true); //延迟触发属性(值等)变化
            viewModel.loadData(data);
            viewModel.setReadOnly(false);
            viewModel.setDataState(cb.model.DataState.Add);

            batOp.setState("add");
            viewModel.afterExecute("copy", data);
            cb.model.PropertyChange.doPropertyChange(); //延迟触发属性(值等)变化
        }
    }


    /**************************************
   * 公开方法
   * 取消修改单据，将单据状态改为浏览状态。
   * 
   */
        this.cancel = function () {
        cb.util.confirmMessage("确定要放弃当前的操作吗？", function () {
            var hasLoadData = viewModel.hasLoadData();
            if (hasLoadData) { //有数据，说明是编辑
                var data = viewModel.getOriginalData();
                if (viewModel.beforeExecute("cancel", data)) {

                    viewModel.restore();
                    viewModel.setReadOnly(true);
                    //浏览态
                    batOp.setState("browse");

                    viewModel.afterExecute("cancel", data);
                }
            }
            else { //新增状态放弃，则清空
                if (viewModel.beforeExecute("cancel")) {
                    viewModel.clear();
                    viewModel.setReadOnly(false);
                    //浏览态
                    batOp.setState("browse");
                    viewModel.afterExecute("cancel");
                }
            }
        });
    }

   /**************************************
   * 公开方法
   * 保存单据，将单据状态改为浏览状态。
   * 提供前后事件，并提供保存成功，失败回调方法；
   */
    this.save = function (args) {
        args = checkArgs(args);

        if (!viewModel.validate() || !batOp.symbol) return;
        var viewPartParams = cb.route.getViewPartParams(viewModel);
        if (!viewPartParams || !viewPartParams.mode) return;
        //var params = viewModel.collectData(true);
        //先不做差异化数据
        var params = viewModel.collectData(true);

        if (viewModel.beforeExecute("save", params)) {
            var callBack = function (arg) {
                if (arg.success) {
                    //queryBillPagination()
                    queryBillPagination(arg.data[0][viewModel.getPkName()], function (success,fail) {
                        if (success) {
                            if (viewModel.getpagination)
                                viewModel.getpagination().setValue({ "billIndex": success.data.billIndex, "billCount": success.data.billCount });
                        }
                    });
                    //保存后修改为浏览态
                    viewModel.loadData(copyArrayData(arg.data[0], params));
                    viewModel.setReadOnly(true);
                    batOp.setState("browse");
                }                
				
                viewModel.afterExecute("save", arg);
            }

            innerSave(params,args,callBack);            
        }
    }
    
   /**************************************
   * 公开方法：批量提交
   * 批量提交单据。
   * 提供前后事件，并提供提交成功、失败回调方法；
   */
    this.batchSubmit = function (processRowData, action) {
        if (viewModel.beforeExecute("batchsubmit")) {
           
            batOp.options.setOperateDesc("提交");
            if (!action) action = cb.data.CommonProxy(batOp.symbol).BatchSubmit;

            var callBack = function (args) {
                if (args.success) {
                   //操作成功
                }
                viewModel.afterExecute("batchsubmit", args);
                if (args.refresh) {                    
                    batOp.refresh();
                }
				
		    };

            return batchOpFun(action, processRowData, callBack);
        }
    }

   /**************************************
   * 公开方法：批量收回
   * 批量收回单据。
   * 提供前后事件，并提供收回成功、失败回调方法；
   */
    this.batchWithdraw = function (processRowData, action) {
        if (viewModel.beforeExecute("batchWithdraw")) {
            batOp.options.setOperateDesc("收回");
            if (!action) action = cb.data.CommonProxy(batOp.symbol).BatchWithDraw;

            var callBack = function (args) {
                if (args.success) {
                    //操作成功
                }
                viewModel.afterExecute("batchWithdraw", args);
                if (args.refresh) {
                    batOp.refresh();
                }               	
		    };
            return batchOpFun(action, processRowData,callBack);
        }
    }
    this.setAddButton = function(){
        if (viewModel.getaddAction) {
            viewModel.getaddAction().setDataSource([
                { "name": "self", "value": "blank", "text": "增加空白单据" },
                { "name": "pull", "value": "opportunity", "text": "从销售机会生成" },
                { "name": "pull", "value": "contract", "text": "从销售订单生成" },
                { "name": "pull", "value": "quotation", "text": "从销售报价生成" },
                { "name": "pull", "value": "schedule", "text": "从销售预定生成" }
            ]);
        }
    };
    /**
    * 公共方法：设置按钮配置
    *
    */
    this.setConfigButton = function () {
        if (viewModel.getconfigAction) viewModel.getconfigAction().setDataSource([
        { "name": "self", "category": "columnSet", "default": "", "value": "columnSet", "type": "popPageBtn", "text": "栏目" },
        {
            "name": "autoWrap", "category": "autoWrap", "default": true, "value": "autoWrap", "type": "checkBoxBtn",
            "text": "自动换行"
        },
        {
            "name": "subTotal", "category": "total", "default": false, "value": "subTotal", "type": "checkBoxBtn",
            "text": "显示小计"
        },
        {
            "name": "combineTotal", "category": "total", "default": false, "value": "combineTotal", "type": "checkBoxBtn",
            "text": "显示合计"
        },
        {
            "name": "fontSet", "id": "fontSet", "default": false, "type": "menuBtn", "value": [
              { "name": "fontSet-smaller", "type": "checkBoxBtn", "default": false, "value": "fontSet-smaller", "text": "小号字体" },
              { "name": "fontSet-normal", "type": "checkBoxBtn", "default": true, "value": "fontSet-normal", "text": "正常字体" },
              { "name": "fontSet-big", "type": "checkBoxBtn", "default": false, "value": "fontSet-big", "text": "大号字体" }
            ], "text": "列表字号"
        }
        ]);
    };
    /**************************************
    * 公开方法：批量审核
    * 批量审核单据。
    * 提供前后事件，并提供审核成功、失败回调方法；
    */
    this.batchApprove = function (processRowData, action) {
        if (viewModel.beforeExecute("batchApprove")) {
            batOp.options.setOperateDesc("审核");
            var opreateFuncParam = batOp.options.getOpreateFuncParam();
            if (!opreateFuncParam) {
                opreateFuncParam = function (ids) {
                    return { billVO: ids, approveInfo: { "approveResult": "Y", "approveNote": "审批通过", "activityid": null } };
                }
                batOp.options.setOpreateFuncParam(opreateFuncParam);
            }
            if (!action) { action = cb.data.CommonProxy(batOp.symbol).BatchApprove; }

            var callBack = function (args) {
                batOp.options.setOpreateFuncParam(null);
                if (args.success) {
                    //操作成功
                } else {
                    var data = args.data;
                    var message = "";
                    for (var i = 0, j = data.length; i < j; i++) {
                        message += "单据号：" + data[i].msgID + "," + data[i].msgContent + "<br/>";
                    }
                    cb.util.warningMessage("消息", message);
                }
                viewModel.afterExecute("batchApprove", args);
                if (args.refresh) {
                    batOp.refresh();
                }
		    };
            return batchOpFun(action, processRowData, callBack);
        }
    };

    /**************************************
    * 公开方法：批量弃审
    * 批量弃审单据。
    * 提供前后事件，并提供审核成功、失败回调方法；
    */
    this.batchUnApprove = function (processRowData, action) {
        if (viewModel.beforeExecute("batchUnApprove")) {
            var callBack = function (args) {
                if (args.success) {
                    //操作成功
                }
                viewModel.afterExecute("batchUnApprove", args);
                if (args.refresh) {
                    batOp.refresh();
                }              
		    };
            batOp.options.setOperateDesc("弃审");
            if (!action) action = cb.data.CommonProxy(batOp.symbol).BatchUnApprove;
            return batchOpFun(action, processRowData,callBack);
        }       
    };
    this.showApproveHistory = function (args) {
        if (!batOp.symbol) return;
       // var data = cb.biz.getInputData(viewModel);
        if (viewModel.beforeExecute("showApproveHistory", args)) {
            var callBack = function (arg) {
                viewModel.afterExecute("showApproveHistory", arg);
            }
            innerShowApproveHistory(args, callBack);
        }
    };
   /**************************************
   * 公开方法：批量删除
   * 批量弃审单据。
   * 提供前后事件，并提供审核成功、失败回调方法；
   */
    this.batchDelete = function (processRowData, action) {
		var that = this;
        if (viewModel.beforeExecute("batchDelete")) {
            var callBack = function (args) {
                if (args.success) {
                    cb.util.tipMessage("单据删除成功！");
                } else {
                    cb.util.tipMessage("当前单据无法删除！");
                }
                viewModel.afterExecute("batchDelete", args);
                if (args.refresh) {
                    batOp.refresh();
                }             
		    };
     		batOp.options.setOperateDesc("删除");
            if (!action) action = cb.data.CommonProxy(batOp.symbol).BatchDelete;
            return batchOpFun(action, processRowData, callBack);
        }
    };


    /**************************************
    * 公开方法：提交
    * 提交单据，将单据状态改为已审批状态。
    * 提供前后事件，并提供审核成功、失败回调方法；
    */
    this.submit = function (args) {        
        if (!batOp.symbol) return;
        args = checkArgs(args);
        var data = cb.biz.getInputData(viewModel);
        if (viewModel.beforeExecute("submit",data)) {
            var callBack = function (arg) {
                if(arg.success){
                    if (cb.isArray(arg.data)) {
                        viewModel.loadData(arg.data[0]);
                    }
				    else{
                        viewModel.loadData(arg.data);
				    }
                    batOp.setState("browse");
                }
                viewModel.afterExecute("submit", arg);
            }
            innerSubmit(data,args,callBack);
        }
    };

    /**************************************
    * 公开方法：收回
    * 收回单据，将单据状态改为浏览状态。
    * 提供前后事件，并提供收回成功、失败回调方法；
    */
    this.withdraw = function (args) {
        if (!batOp.symbol) return;
       args = checkArgs(args);
        var data = cb.biz.getInputData(viewModel);
        if (viewModel.beforeExecute("withdraw",data)) {
            var callBack = function (arg) {
                if(arg.success){
                    if (cb.isArray(arg.data)) {
                        viewModel.loadData(arg.data[0]);
                    }
                    else {
                        viewModel.loadData(arg.data);
                    }
                    batOp.setState("browse");
                }
                viewModel.afterExecute("withdraw", arg);
            }
            innerWithdraw(data,args,callBack);
        }
    }


    /**************************************
    * 公开方法：审核
    * 审核单据，将单据状态改为已审批状态。
    * 提供前后事件，并提供收回成功、失败回调方法；
    */
    this.approve = function (args) {
        if (!batOp.symbol) return;
       args = checkArgs(args);
        var id = viewModel.getPkValue();
        if (id == null) {
            cb.console.error("id为空！");
            return;
        }

        if (viewModel.beforeExecute("approve",id)) {
            var callBack = function (args) {
                if (args.success) {
                    if (cb.isArray(args.data)) {
                        viewModel.loadData(args.data[0]);
                    }
                    else {
                        viewModel.loadData(args.data);
                    }
                    batOp.setState("browse");
                }
                else {
                    //操作失败
                }
                //操作成功还是失败，都将结果传递给业务开发
                viewModel.afterExecute("approve", args);
            };
            innerApprove(id,args,callBack);
        }
    }
	
	/**************************************
    * 公开方法：弃审
    * 审核单据，将单据状态改为浏览。
    * 提供前后事件，并提供弃审成功、失败回调方法；
    */
    this.unApprove = function (args) {
        if (!batOp.symbol) return;
       args = checkArgs(args);
        var data = cb.biz.getInputData(viewModel);

        if (viewModel.beforeExecute("unApprove", data)) {
            var callBack = function (arg) {
                if (arg.success) {
                    if (cb.isArray(arg.data)) {
                        viewModel.loadData(arg.data[0]);
                    }
                    else {
                        viewModel.loadData(arg.data);
                    }
                    batOp.setState("browse");
                }                
                viewModel.afterExecute("unApprove", arg);
            }
            innerUnApprove(data, args, callBack);
        }
    }
    
    /**
    * 公开方法：查询方案    
    * 提供前后事件；
    */
    this.queryScheme = function (args) {
        if (viewModel.beforeExecute("queryScheme")) {
            var callBack = function (data) {
                viewModel.afterExecute("queryScheme", data);
            }
            var symbol = viewModel.getSymbol();
            if (symbol != null) {
                if (args == 'schememanage') {
                    cb.route.loadPageViewPart(viewModel, "common.commonscheme.SchemeListManage", { width: "450px", height: "550px" });
                }
                else {
                    viewModel.execute("afterTabContentClick");
                    var listCard = viewModel.getModel3D();
                    listCard.set("querySchemeID", args.queryschemeID);//设置当前查询方案
                    var columnCode = listCard.get("columnCode");
                    var filters = []; //高级查询
                    var pageIndex = 1;
                    this.loadData(args.queryschemeID, columnCode, filters, "N", "override", pageIndex,callBack);
                }
            }
        }
    };
    /**
    * 公开方法：展开查询条件
    * 提供前后事件
    */
    this.expandScheme = function () {
        var that = this;
        var listCard = viewModel.getModel3D();
        cb.route.toggleViewPart(viewModel, cb.route.CommonAppEnum.QueryScheme, cb.route.ViewPartType.QueryScheme, {
            animation: { mode: "toggle" }, refreshData: false, callBack: function (filters) {
                if (filters) {
                    var columnCode = listCard.get("columnCode");
                    var querySchemeID = listCard.get("querySchemeID");
                    var commoncrud = new cb.data.commonCRUD(viewModel);
                    commoncrud.loadData(querySchemeID, columnCode, filters, "N", "override", 1, null);
                }
            }
        });
    };
    /**************************************
    * 公开方法：刷新数据    
    * 提供前后事件；
    */
    this.refresh = function () {
        if (viewModel.beforeExecute("refresh")) {
            var callBack = function (args) {
                viewModel.afterExecute("refresh",args);
            }
            innerRefresh(callBack);
        }        
    };
    /**************************************
   * 公开方法：显示列表小计    
   * 参数1：columnCode 栏目编码
   * 参数2：type 0：参照，1 列表,档案
   * 提供前后事件；
   */
    this.showSubTotal = function () {
        cb.util.tipMessage("显示小计");
        var status = $("#subTotal").attr('status');
        if (status == '0') {
            $("#subTotal").attr("src", "./pc/images/set-select.png");
            $("#subTotal").attr("status", "1");
        } else if (status == '1') {
            $("#subTotal").attr("src", "./pc/images/set-unselect.png");
            $("#subTotal").attr("status", "0");
        }
        debugger;
    };
    /**************************************
    * 公开方法：显示列表合计    
    * 提供前后事件；
    */
    this.showCombineTotal = function () {
        //cb.util.tipMessage("显示合计");
        var status = $("#combineTotal").attr('status');
        if (status == '0') {
            $("#combineTotal").attr("src", "./pc/images/set-select.png");
            $("#combineTotal").attr("status", "1");
            viewModel.getModel3D().setState("showAggregates", true);
            //aggregates = "sum,average,max"
        } else if (status == '1') {
            $("#combineTotal").attr("src", "./pc/images/set-unselect.png");
            $("#combineTotal").attr("status", "0");
            viewModel.getModel3D().setState("showAggregates", false);
        }
        debugger;
    };
    /**************************************
    * 公开方法：显示栏目设置界面    
    * 参数1：columnCode 栏目编码
    * 参数2：type 0：参照，1 列表,档案
    * 提供前后事件；
    */
    this.showColumn = function (columnCode, type, callBack) {
        //弹出参照界面
        if (viewModel.getReadOnly() || viewModel.getDisabled()) return;
        columnCode = columnCode || null; // 栏目编码

        var self = this;
        cb.route.loadPageViewPart(viewModel, "common.col.ColumnApp", {
            columnCode: columnCode, type: type, callBack: function (refresh, data) {
                if (refresh) {
                    //更新栏目
                    innerUpdateColumn(data);
                }
            }
        });
    };
    /**************************************
    * 公开方法：设置自动换行    
    * 提供前后事件；
    */
    this.setAutoWrap = function () {
        var status = $("#autoWrap").attr('status');
        if (status == '0') {
            $("#autoWrap").attr("src", "./pc/images/set-select.png");
            $("#autoWrap").attr("status", "1");
            viewModel.getModel3D().setState("autoWrap",true);
        } else if (status == '1') {
            $("#autoWrap").attr("src", "./pc/images/set-unselect.png");
            $("#autoWrap").attr("status", "0");
            viewModel.getModel3D().setState("autoWrap", false);
        }
        debugger;
    };
    /**************************************
    * 公开方法：设置字体大小    
    * 提供前后事件；
    */
    this.setFontType = function (fontType) {
        var selectImg = $("#" + fontType);
        var status = selectImg.attr('status');
        var fontTypes = ["fontSet-smaller", "fontSet-normal", "fontSet-big"];
        if (status == '0') {
            selectImg.attr("src", "./pc/images/set-select.png");
            selectImg.attr("status", "1");
            for (var i = 0, j = fontTypes.length; i < j; i++) {
                if (fontType != fontTypes[i]) {
                    $("#" + fontTypes[i]).attr("src", "./pc/images/set-unselect.png");
                    $("#" + fontTypes[i]).attr("status", "0");
                }
            }
            switch (fontType) {
                case "fontSet-smaller":
                    viewModel.getModel3D().setState("fontSize", "small");
                    break;
                case "fontSet-normal":
                    viewModel.getModel3D().setState("fontSize", "medium");
                    break;
                case "fontSet-big":
                    viewModel.getModel3D().setState("fontSize", "large");
                    break;
            }
        } else if (status == '1') {
            
        }
        debugger;
    };

    /**************************************
    * 公开方法：新增行    
    * 行号规则待定
    * 提供前后事件；
    */
    this.addLine = function (args) {
        if (viewModel.beforeExecute("addLine",args)) {
            var callBack = function (row) {
                viewModel.afterExecute("addLine", row);
            }
            innerAddLine(args,callBack);
        }
    };

    /**************************************
    * 公开方法：插入行    
    * 行号规则待定
    * 提供前后事件；
    */
    this.insertLine = function (args) {
        if (viewModel.beforeExecute("inserLine", args)) {
            var callBack = function (row) {
                viewModel.afterExecute("insertLine", row);
            }
            innerInsertLine(args,callBack);
        }
    };

    /**************************************
    * 公开方法：复制行    
    * 行号规则待定
    * 提供前后事件；
    */
    this.copyLine = function () {
        var model3d = viewModel.getModel3D();
        var selectedRows = model3d.getSelectedRows();
        if (!selectedRows || selectedRows.length < 1) {
            cb.util.tipMessage("请选择一行数据进行复制");
            return;
        }

        if (viewModel.beforeExecute("copyLine", selectedRows)) {
            var callBack = function (row) {
                viewModel.afterExecute("copyLine", row);
            }
            innerCopyLine(selectedRows, callBack);
        }
    }


    /**************************************
    * 公开方法：删除行    
    * 行号规则待定
    * 提供前后事件；
    */
    this.deleteLine = function () {
        var model3d = viewModel.getModel3D();
        var selectedRows = model3d.getPageSelectedIndexs();
        if (viewModel.beforeExecute("deleteLine", selectedRows)) {
            var callBack = function () {
                viewModel.afterExecute("deleteLine", selectedRows);
            }
            innerDeleteLine(selectedRows,callBack);
        }
    }

    /**************************************
   * 公开方法：活动航单击       
   * 提供前后事件；
   */
    this.activeRow = function (args) {
        if (viewModel.beforeExecute("activeRow", args)) {
            var callBack = function () {
                viewModel.afterExecute("activeRow");
            }
            //暂不提供回调方法
            this.loadDetailView(args);
        }        
    };

    /**************************************
    * 公开方法：加载具体单据       
    * 提供前后事件；?
    */    
    this.loadDetailView = function (args) {
        if (!args) return;
        var pk = viewModel.getModel3D().getPkName();
		//zhangxub
        var id = args.row[pk];
        //此处需要多传两个参数，billCount,billIndex 
        //分别选中的单据在当前查询方案下，是几条，总共有几条
        if (id == null) {
            cb.util.tipMessage("id为空");
            return;
        }

        var listCard = viewModel.getModel3D();
        var pageInfo = listCard.getPageInfo();
        var querySchemeID = listCard.get("querySchemeID");

        var billIndex = pageInfo.pageIndex * 15 + args.index + 1;
        var billCount = pageInfo.totalCount;

        innerLoadDetailView(viewModel, { "mode": "view", "id": id, "pk": pk, "billIndex": billIndex, "billCount": billCount, "querySchemeID": querySchemeID });
    };

    /**************************************
    * 公开方法：附件操作       
    * 提供前后事件
    */
    this.attach = function (args) {
        if (viewModel.beforeExecute("attach")) {
            var callBack = function () {
                viewModel.afterExecute("attach");
            }
            innerAttach(args, callBack);
        }
    }

    /**************************************
    * 公开方法：表体最大化       
    * 提供前后事件
    */
    this.fullScreen = function (args) {
        if (viewModel.beforeExecute("fullScreen")) {
            var callBack = function () {
                viewModel.afterExecute("fullScreen");
            }

            innerFullScreen(callBack);
        }
    }

    /**************************************
    * 公开方法：查询前一条数据       
    * 提供前后事件
    */
    this.prev = function (args) {       
        if (!batOp.symbol) return;
        var data = getDetailParams(args);
        if (!data) return;
        if (viewModel.beforeExecute("prev")) {
            var callBack = function (result) {
                if (!result.success) {
                    if (result.error) {
                        cb.util.tipMessage(result.error, function () {
                            viewModel.afterExecute("prev", result);
                        });
                    }
                }
                else {
                    if (result.data) {
                        var temp = (cb.Array(result.data) && result.length > 0) ? result.data[0] : result.data;
                        viewModel.loadData(temp);
                        viewModel.afterExecute("prev", result);
                    }
                    else {
                        cb.util.tipMessage("当前记录为第一条", function () {
                            viewModel.afterExecute("prev", result);
                        });
                    }
                }                
            }

            innerQueryPrevious(data,callBack);
        }
    }

   /**************************************
   * 公开方法：查询后一条数据       
   * 提供前后事件
   */
    this.next = function (args) {        
        if (!batOp.symbol) return;
        var data = getDetailParams(args);
        if (!data) return;
        if (viewModel.beforeExecute("next", data)) {
            var callBack = function (result) {

                if (!result.success) {
                    if (result.error) {
                        cb.util.tipMessage(result.error, function () {
                            viewModel.afterExecute("next", result);
                        });
                    }
                }
                else {
                    if (result.data) {
                        var temp = (cb.Array(result.data) && result.length > 0) ? result.data[0] : result.data;
                        viewModel.loadData(temp);
                        viewModel.afterExecute("next", result);
                    }
                    else {
                        cb.util.tipMessage("当前记录为最后一条", function () {
                            viewModel.afterExecute("next", result);
                        });
                    }
                }                
            }

            innerQueryNext(data,callBack);
        }
    }

   /**************************************
   * 公开方法：拆分行       
   * 提供前后事件
   */
    this.divideLine = function (data) {
        if (viewModel.beforeExecute("divideLine")) {
            var callBack = function () {
                viewModel.afterExecute("divideLine");
            }

            innerDivideLine(data,callBack);
        }
    }

    /**************************************
   * 公开方法：打开超链接      
   * 提供前后事件
   */
    this.openLink = function (data) {
        if (viewModel.beforeExecute("openLink")) {
            var callBack = function () {
                viewModel.afterExecute("openLink");
            }
            innerOpenLink(data, callBack);
        }
    }
    /*************************************
    * 公开方法：联查单据
    * 提供前后事件
    */
    this.linkQuery = function (data) {
        if (viewModel.beforeExecute("linkQuery")) {
            var callBack = function () {
                viewModel.afterExecute("linkQuery");
            }
            innerlinkQuery(data, callBack);
        }
    }
    /*************************************
    * 公开方法：批改
    * 提供前后事件
    */
    this.batchEdit = function (data) {
        if (viewModel.beforeExecute("batchEdit")) {
            var callBack = function () {
                viewModel.afterExecute("batchEdit");
            }
            innerBatchEdit(data, callBack);
        }
    }

    /**************************************
    * 公开方法: 翻页
    * 参数：{ "data-flag": flag, "data-value": toPage };
    * falg = first|previous|next|last
    */

    this.pagination = function (data) {
        if (data) {
            var toPage = data["data-value"];
            if (viewModel.beforeExecute("pagination")) {
                var args = getPaginationParams(toPage, viewModel);

                var callBack = function (result) {
                    if (result.success) {
                        if (result.data.currentBillData) {
                            viewModel.loadData(result.data.currentBillData);
                            if (viewModel.getpagination)
                                viewModel.getpagination().setValue({ "billIndex": result.data.billIndex, "billCount": result.data.billCount });
                            batOp.setState("browse");
                        }
                    }
                    viewModel.afterExecute("pagination", args);
                };
                queryBill(args, callBack);
            }
        }
    }

    function getPaginationParams(toPage, viewModel) {
        var params = cb.route.getViewPartParams(viewModel);
        
        //当用于在单据界面搜索过后，则以后不在根据查询方案进行数据过滤
        //只对搜索过滤，如果没有输入条件，则默认取所有单据，然后进行翻页
        if (viewModel.whereSql) {
            var args = { "querySchemeID": null, "filters": null, "whereSql": viewModel.whereSql, "billIndex": toPage };
        }
        else {
            var args = { "querySchemeID": params.querySchemeID || null, "filters": null, "whereSql": null, "billIndex": toPage };
        }

        return args;
    }
    
    this.search = function (args) {
        if (args && args.length > 0) {
            var callBack = function (result) {
                if (result.success) {
                    if (result.data.currentBillData) {
                        viewModel.loadData(result.data.currentBillData);
                        if (viewModel.getpagination)
                            viewModel.getpagination().setValue({ "billIndex": result.data.billIndex, "billCount": result.data.billCount });
                        viewModel.whereSql = result.data.whereSql;
                    }
                }
            }

            queryBillPaginationByBillNo(args, callBack);
        }
    }

    /****************************************************************
     *   以下方法是私有方法，不对外提供
     *   参数：{"querySchemeID":"","filters":null,"whereSql":null,"billIndex":1}
     *
    *****************************************************************/

    function queryBillPaginationByBillNo(args, callBack) {

        var data = { "billno": args };

        cb.data.CommonProxy(batOp.symbol).QueryBillPaginationByBillNo(data, function (success, fail) {

            var result = handleResult(success, fail, null, function (result) {
                if (cb.util.isFunction(callBack)) {
                    callBack(result);
                }
            });
        });
    }


    //单据界面分页查询首上下末条数据，
    //返回当前第几条，总共有几条，
    //如果单据上搜索过，则不再按方案翻页
    function queryBillPagination(args, callBack) {

        var data = {"id":args};

        cb.data.CommonProxy(batOp.symbol).QueryBillPagination(data, function (success, fail) {

            var result = handleResult(success, fail, null, function (result) {
                if (cb.util.isFunction(callBack)) {
                    callBack(result);
                }
            });
        });
    }


    function queryBill(args,callBack) {
        cb.data.CommonProxy(batOp.symbol).QueryNextPreBill(args, function (success, fail) {

            var result = handleResult(success, fail, null, function (result) {
                if (cb.util.isFunction(callBack)) {
                    callBack(result);
                }
            });
        });
    }


    function checkArgs(args) {
        args = args || {};
        if (args.prompt == undefined) {
            //默认提示
            args.prompt = true;
        }
        return args;
    }
    //显示历史
    function innerShowApproveHistory(args, callback) {
        var reqData = {};
        var model3d = viewModel.getModel3D();
        var selectedRows = model3d.getSelectedRows();
        if (!cb.isArray(selectedRows) || selectedRows.length < 1) {
            cb.util.tipMessage("请选择一条单据！");
        } else {
            var pkName = model3d.getPkName();
            reqData.billPkValue = selectedRows[0][pkName];
            cb.route.loadPageViewPart(viewModel, cb.route.CommonAppEnum.ApprovalHistory, reqData);
        }
    }
    //打开超链接
    function innerOpenLink(args, callback) {
        var linkURL = args.linkappid;
        var value = args.value;
        var field = args.field;
        if (linkURL && value) {
            var params = {};
            params.id = value;
            params.pk = field;
            params.mode = "view"
            cb.route.loadArchiveViewPart(viewModel, linkURL + "App", params);
        }
    }
    //联查
    function innerlinkQuery(args, callBack) {
        //var srcbillid = args.srcbillid;
        //var srcbilltype = args.srcbilltype;
        var symbol = viewModel.getSymbol();
        //var params = {};
      
        //cb.data.CommonProxy(symbol).QueryAppIDByBillType(srcbilltype, function (success, fail) {
        //    if (success)
        //    {
        //        var params = {};
        //        params.id = srcbillid;
        //        params.mode = "view";
        //        cb.route.loadTabViewPart(viewModel, success, params);
        //    } else {
        //        cb.util.warningMessage("消息",fail);
        //    }
        //});
        cb.data.CommonProxy(symbol).LinkQueryBillList(args, function (success, fail) {
            if (success) {
                cb.route.loadPageViewPart(viewModel, "common.linkquery.LinkQueryApp", { data: success, weidth: "600px", height: "400px" });
            } else {
                cb.util.warningMessage("消息",fail);
            }
        });
    }
     //附件操作
    function innerAttach(args,callBack) {
        var proxy = viewModel.getProxy();
        var requestType = args.type;
        var options = {};
        //获取当前单据的主键
        var itemID = viewModel.getPkValue();
        //var itemID = "fffff123";
        //获取助记符，TODO 封装成空间之后需要动态获取，目前先写成定值sa.Delivery
        var symbol = viewModel.getSymbol();
        //获取当前页面的token
        var token = new cb.util.queryString(location.search).get("token");
        //获取当前页面访问主机
        var host = window.location.host;
        options.callback = function (data) {
            if (cb.isArray(data)) {
                viewModel.getattachmentList().setDataSource(data);
            } else {
                alert(data);
            }
        }
        if (requestType == "upload") {
            //alert("上传");
            var datas = args.data;
            if (cb.isArray(datas))
            {
                for(var i = 0;i<datas.length;i++)
                {
                    var data = datas[i];
                    datas[i].appID = symbol;
                    datas[i].itemID = itemID;
                }
            }
            options.params = datas;
            proxy.upload(options);
        } else if (requestType == "download") {
            //单条下载
            var datas = args.data;
            var pathID = datas[0].attachPathID;
            var href = 'http://';
            href += host;
            href += '/classes/General/UAP/AttachDownload?token=';
            href += token;
            href += '&appID=';
            href += symbol;
            href += '&attachPathID=';
            href += pathID;
            window.open(href);
            debugger;
        } else if (requestType == "delete") {
            var datas = args.data;
            if (cb.isArray(datas))
            for (var j = 0; j < datas.length; j++)
            {
                var data = datas[j];
                data.appID = symbol;
                data.itemID = itemID;
            }
            options.params = datas;
            proxy.deleteAttach(options);
        } else if (requestType == "batchDownload") {
            var href = 'http://';
            href += host;
            href += '/classes/General/UAP/AttachBatchDownload?token=';
            href += token;
            href += '&appID=';
            href += symbol;
            href += '&itemID=';
            href += itemID;
            window.open(href);
        }
    };
    

    function checkBatchOp(model3d, fun,callBack) {      
        
        if (!model3d) {
            cb.console.error("model3d无效！");
            return;
        }
        var selectedRows = model3d.getSelectedRows();
        if (!selectedRows.length) {
            cb.util.tipMessage("请选择要" + fun + "的单据！", function () {
                callBack(false);
            });            
        }
        else{
            if (batOp.options.getConfirm()) {
                var cfm = batOp.options.getConfirm();
                cfm(function () { callBack(true) }, function () { callBack(false) });
            }
            else {
                cb.util.confirmMessage("确实要" + fun + "选中的单据吗？", function () { callBack(true) }, function () { callBack(false)});
            }
        }        
    }

    function getBatchOpPara(model3d, fun, processRowData) {
        var ids = [];
        var selectedRows = model3d.getSelectedRows();
        var pk = viewModel.getModel3D().getPkName();
        for (var i = 0; i < selectedRows.length; i++) {
            var row = selectedRows[i];
            if (processRowData) processRowData(ids, row);
            else {
                var id = row[pk];
                var ts = row.ts;
                var data = {};
                data[pk] = id;
                data['ts'] = ts;
                if (id && ts) ids.push(data);
            }
        }

        return ids;

        //var param = batOp.options.getOpreateFuncParam() ? batOp.options.getOpreateFuncParam()(ids) : ids;
        //return param;
    }

    function execOpFun(action, ids, callBack, fun) {

        var param = batOp.options.getOpreateFuncParam() ? batOp.options.getOpreateFuncParam()(ids) : ids;
        var newAction = $.proxy(action, cb.data.CommonProxy(batOp.symbol));
        var result = {};
        //根据业务要求，如果只有一条数据，则不显示批量报告界面
        if (ids.length == 1) {
            newAction(param, function (success, fail) {
                result = handleResult(success, fail);
                result.refresh = true;
                if (cb.util.isFunction(callBack)) {
                    callBack(result);
                }
            });
        }
        else { //显示批量报告界面
            newAction(param, function (success, fail) {
                result = handleResult(success, fail);
                result.refresh = true;
                if (!result.success) {
                    if (result.error) {
                        cb.util.tipMessage(result.error, function () {
                            //错误后返回回调
                            if (cb.util.isFunction(callBack)) {
                                callBack(result);
                            }
                        });                        
                    }
                    else {
                        //此界面只用来显示结果，并没有做任何业务处理
                        cb.route.loadPageViewPart(viewModel, "common.batch.BatchReportApp", {
                            msg: fun + "成功报告",
                            callBack: function (resultType) {
                                if (cb.util.isFunction(callBack)) {
                                    callBack(result);
                                }
                            },
                            msgDetails: result.data
                        })
                    }
                }
                else {
                    //成功后直接回调
                    if (cb.util.isFunction(callBack)) {
                        callBack(result);
                    }
                }
            });
        }
        return batOp;
    }

    //批量操作主函数
    function batchOpFun(action, processRowData,callBack) {
        if (!batOp.symbol) return;
        var fun = batOp.options.getOperateDesc() || "批量操作";
        var model3d = viewModel.getModel3D();

        var checkBack = function (valid) {
            if (valid) {
                var ids = getBatchOpPara(model3d, fun, processRowData);               

                return execOpFun(action, ids, callBack, fun);
            }
            else {
                return batOp;
            }
        };

        checkBatchOp(model3d, fun, checkBack);
    }
	
    
    
    /*******************************
    * 刷新列表数据
    * querySchemeID 查询方案ID
    * columnCode 栏目编码
    * filters 高级查询数组
    * reloadColumn 是否重新加载栏目，只有用户修改栏目设置后，此值为true
    * mode 数据加载方式，首次加载override,翻页append
    * pageIndex, 翻页时，不用传此值
    */
    this.loadData = function (querySchemeID, columnCode, filters, reloadColumn, mode, pageIndex,callBack) {

        reloadColumn = reloadColumn || false;
        mode = mode || "override";
        filters = filters || null;
        columnCode = columnCode || null;

        var symbol = batOp.symbol;
        if (symbol != null) {
            var listCard = viewModel.getModel3D();
            if (!querySchemeID) querySchemeID = listCard.get("querySchemeID");
            var pageInfo = listCard.getPageInfo();
            var pageSize = pageInfo.pageSize;
            pageIndex = pageIndex || pageInfo.pageIndex;
            cb.data.CommonProxy(symbol).Query({
                "querySchemeID": querySchemeID,
                "pageSize": pageSize,
                "pageIndex": pageIndex,
                "filters": filters,
                "columnCode": columnCode,
                "reloadColumn": reloadColumn
            }, function (success, fail) {
                var result=null;
                if (fail) {
                    cb.util.tipMessage("查询列表数据失败", function () {
                        result = { success: false, data: fail };
                        if (cb.util.isFunction(callBack)) {
                            callBack(result);
                        }
                    });
                    			
                }
                else{
                    if (success) {
                        success.mode = mode;
                        listCard.setPageRows(success);
                        result = {success:true,data:success};		
                        //设置突出显示合计
                        highlightShowTotal(success.totalColumnData);
                    }
                    if (cb.util.isFunction(callBack)) {
                        callBack(result);
                    }
                }
            });
        }
    };
    /**
    * 公开方法：突出显示
    *
    */
    function highlightShowTotal (args) {
        //设置突出显示合计
        var listCard = viewModel.getModel3D();
        var totalColumnData = args;
        var columns = listCard.getColumns();
        var focusTotalColumns = [];
        for (var i = 0, j = columns.length; i < j; i++) {
            if (columns[i].totalflag == true && columns[i].totalfocusflag == true) {
                focusTotalColumns.push(columns[i]);
            }
        }
        var $showTotalFocusDiv = $("#showTotalFocus");
        $showTotalFocusDiv.empty();
        for (var i = 0, j = focusTotalColumns.length; i < j; i++) {
            var title = focusTotalColumns[i].title;
            var fieldcode = focusTotalColumns[i].fieldcode;
            var totalValue = totalColumnData[fieldcode];
            if (totalValue) {
                $("<span>" + title + "合计：</span><span style='color: #FF6600;'>￥" + totalValue + "</span>").appendTo($showTotalFocusDiv);
            } else {
                $("<span>" + title + "合计：</span><span></span>").appendTo($showTotalFocusDiv);
            }
        }
    };
    function handleResult(success, fail, args,callBack) {
        var opInfo = "";
        var result = {success:false};
        if (success) {
            result = { success: true, data: success };
            opInfo = "成功。";
        }
        if (fail) {            
            if (fail.error) {
                result = { success: false, error: fail.error };
                opInfo = "失败:" + fail.error + "。";
            } else {
                result = { success: false, data: fail };
                opInfo = "失败。";
            }
        }
        if(args && args.prompt) {
            cb.util.tipMessage(args.opName + opInfo, function () {
                if (cb.util.isFunction(callBack)) {
                    callBack(result);
                }
            });
        }
        else
        {
            if (cb.util.isFunction(callBack)) {
                callBack(result);
            }
        }
        return result;
    }
	
	
    //保存方法
    function innerSave(params,args,callBack) {       
        var pk = viewModel.getPkName();
        args = args || {};
        args.opName = "保存";
        var saveCallback = function (success, fail) {            
            var result = handleResult(success, fail, args, function (result) {
                if (cb.util.isFunction(callBack)) {
                    callBack(result);
                }
            });                   
                       
        };
        // UPDATED = 1;//更新
        // NEW = 2;//新增
        if (!params[pk]) params.state = 2
        else params.state = 1;
        cb.data.CommonProxy(batOp.symbol).Save(params, saveCallback);
    };

    //提交
    function innerSubmit (data,args,callBack) {
        
        cb.data.CommonProxy(batOp.symbol).Submit(data, function (success, fail) {
            args.opName = "提交";
            handleResult(success, fail, args, function (result) {
                if (cb.util.isFunction(callBack)) {
                    callBack(result);
                }
            });       
        });
    };
    //收回
    function innerWithdraw(data,args, callBack) {        
        cb.data.CommonProxy(batOp.symbol).WithDraw(data, function (success, fail) {
            args.opName = "收回";
            handleResult(success, fail, args, function (result) {
                if (cb.util.isFunction(callBack)) {
                    callBack(result);
                }
            });
        });
    };
    //审核
    function innerApprove (id,args,callBack) {        		
		cb.data.CommonProxy(viewModel.getSymbol()).CheckApprove({ id: id }, function (success, fail) {
		    var result = handleResult(success, fail);
		    if (!result.success) {
		        if (fail.error) {
		            cb.util.tipMessage(fail.error, function () {
		                callBack(result);
		            });
		        }		        
		    }
		    else {
		        if (result.data.isApproveDlg){
		            cb.route.loadPageViewPart(viewModel, cb.route.CommonAppEnum.Approval, { callBack: callBack });
		        }		            
		        else {
		            var data = {};
		            data.billVO = cb.biz.getInputData(viewModel);
		            data.approveInfo = null;
		            cb.data.CommonProxy(batOp.symbol).Approve(data, function (success, fail) {
		                args.opName = "审批";
		                handleResult(success, fail, args, function (result) {
		                    if (cb.util.isFunction(callBack)) {
		                        callBack(result);
		                    }
		                });
		            });
		        }
		    }
		});		
    };
    //弃审
    function innerUnApprove(data,args,callBack) {      
        cb.data.CommonProxy(batOp.symbol).UnApprove(data, function (success, fail) {
            args.opName = "弃审";
            handleResult(success, fail, args, function (result) {
                if (cb.util.isFunction(callBack)) {
                    callBack(result);
                }
            });
        });
    };
    //删除
    function innerDelete(data, args, callBack) {
        args.opName = "删除";
        cb.data.CommonProxy(batOp.symbol).Delete(data, function (success, fail) {
            handleResult(success, fail, args, function (result) {
                if (cb.util.isFunction(callBack)) {
                    callBack(result);
                }
            });
        });
    };  
   
    /* 表体数据状态值
      0:不变
      1：修改
      2：新增
      3：删除
    */
    //新增行
    function innerAddLine (args,callBack) {
        var model3d = viewModel.getModel3D();
        var newRow = args || {};
        var rowno = model3d.getFieldNameFromInterfaceField("rowno");
        if (rowno  && !newRow[rowno]) {
            var rows = model3d.getCurrentPageRows();
            var lastRow = rows[rows.length - 1];
            var lastRowno = lastRow == null ? 0 : lastRow[rowno];
            newRow[rowno] = parseFloat(lastRowno) + 10;
        }
        viewModel.getModel3D().appendRow(newRow);
        if (cb.util.isFunction(callBack)) {
            callBack(newRow);
        }
    };

    //插行
    function innerInsertLine (args,callBack) {
        var model3d = viewModel.getModel3D();
        var focusedRow = model3d.getFocusedRow();
        var rowData = args || {};
        var rowno = model3d.getFieldNameFromInterfaceField("rowno");
        var focusedRowIndex = model3d.getFocusedIndex();
        //如果没有选中行，则插入的行将插入到列表的最后一个行
        //这里面定义了“行号” 字段名称为"crowno"   后续将统一字段名称为"rowno"
        if (!focusedRow) {
            if (rowno && !rowData[rowno]) {
                var rows = model3d.getCurrentPageRows();
                var lastRow = rows[rows.length - 1];
                var lastRowno = lastRow == null ? 0 : lastRow[rowno];
                rowData[rowno] = parseFloat(lastRowno) + 10;
            }
            viewModel.getModel3D().appendRow(rowData);

        } else {
            if (rowno && !rowData[rowno]) {
                var focusedRowNo = focusedRow[rowno];
                var preRowIndex = 0;
                var preRowno = 0;
                if (focusedRowIndex != 0) {
                    preRowIndex = focusedRowIndex - 1;
                    var preRow = model3d.getRow(preRowIndex, false);
                    preRowno = preRow[rowno];
                }
                var newRowno = (parseFloat(focusedRowNo) + parseFloat(preRowno)) / 2;
                rowData[rowno] = newRowno;
            }
            model3d.insertRow(focusedRowIndex, rowData);
            debugger;
        }
        if (cb.util.isFunction(callBack)) {
            callBack(rowData);
        }
    };
    //复制行
    function innerCopyLine(selectedRows, callBack) {
        var model3d = viewModel.getModel3D();
        var rowno = model3d.getFieldNameFromInterfaceField("rowno");
        //计算行号
        for (var i = 0, j = selectedRows.length; i < j; i++) {
            
            var rowData = cb.clone(selectedRows[i]);
            if (rowno) {
                var rows = model3d.getCurrentPageRows();
                var lastRow = rows[rows.length - 1];
                var lastRowno = lastRow == null ? 0 : lastRow[rowno];
                rowData[rowno] = parseFloat(lastRowno) + 10;
            }
            var pkName = model3d.getPkName();
            rowData[pkName] = "";
            rowData.state = cb.model.DataState.Add;
            model3d.appendRow(rowData);
            if (cb.util.isFunction(callBack)) {
                callBack(rowData);
            }
        }
    };
    //删行
    function innerDeleteLine(selectedRows, callBack) {
        var model3d = viewModel.getModel3D();
        selectedRows.state = cb.model.DataState.Delete;
        model3d.deleteRows(selectedRows);
        if (cb.util.isFunction(callBack)) {
            callBack();
        }
    };
    
    //全屏
    function innerFullScreen (callBack) {
        var model3d = viewModel.getModel3D();
        var currentState = model3d.get("fullScreen");
        currentState = !currentState;
        if (currentState) {
            viewModel.getfullScreenAction().setData("Icon", "unfullScreen-icon");
        } else {
            viewModel.getfullScreenAction().setData("Icon", "fullScreen-icon")
        }
        model3d.set("fullScreen", currentState);
        if (cb.util.isFunction(callBack)) {
            callBack();
        }
    };
    
    //批改   data数据格式为 {modifyColumns:[{},{}] ,callBack:function(returnData)}
    function innerBatchEdit(data, callBack) {
        var model3d = viewModel.getModel3D();
        var pageSelectIndexs = model3d.getPageSelectedIndexs();
        if (pageSelectIndexs == null || pageSelectIndexs.length < 1) {
            cb.util.tipMessage("请选择要批改的行");
        } else {
            var reqData = { modifyColumns: [] };
            var columns = viewModel.getModel3D().getColumns();
            for (var i = 0, j = columns.length; i < j; i++) {
                var isVisible = columns[i].isVisible;
                var isReadOnly = columns[i].isReadOnly;
                if (isVisible&&!isReadOnly) {
                    reqData.modifyColumns.push(columns[i]);
                }
            }
            if (reqData.modifyColumns == null || reqData.modifyColumns.length < 1) {
                cb.util.tipMessage("暂无需要批改的数据");
            } else {
                cb.route.loadPageViewPart(viewModel, 'common.batch.BatchModifyApp', {
                    width: "640px", data: reqData, callback: function (refresh, args) {
                        if (refresh) {
                            //返回的数据格式：args={fieldName:value,fieldName:value}
                            for (var i = 0, j = pageSelectIndexs.length ; i < j; i++) {
                                var updateRow = {};
                                for (var fieldName in args) {
                                    var value = args[fieldName];
                                    if (value != "unchanged") {
                                        updateRow[fieldName] = value;
                                    }
                                }
                                model3d.updateRow(pageSelectIndexs[i], updateRow);
                            }//end for
                        }//end if
                        if (cb.util.isFunction(callBack)) {
                            callBack();
                        }//end if
                    }//end callback
                });//end loadPage
            }
        }
    };//end function

    //获取拆分行列信息 
    function getDivideLineData(){
        var data ={divideCol:[]};
        var columns = viewModel.getModel3D().getColumns();
        for(var i=0,j=columns.length;i<j;i++){
            if(columns[i].isSplit){
                data.divideCol.push({columnName:columns[i].fieldName,text:columns[i].title});
            }
        }

        return data;
    }
    //拆分行
    function innerDivideLine(data, callBack) {

        data = data || getDivideLineData();
        var model3d = viewModel.getModel3D();
        var rowno = model3d.getFieldNameFromInterfaceField("rowno");
        var selectRows = model3d.getSelectedRows();
        var selectRowIndexs = model3d.getPageSelectedIndexs();
        if (!cb.isArray(selectRows)||selectRows.length<1) {
            cb.util.tipMessage("请选择要拆分的数据行");
        } else {
            var focusedRow = selectRows[0];
            var focusedIndex = selectRowIndexs[0];
            var pkName = model3d.getPkName();
            cb.route.loadPageViewPart(viewModel, "common.dividedLine.DividedLineApp", {
                model3d: model3d, detailInfo: data, callBack: function (refresh, args) {
                    var divideType = args.returnData.divideType;
                    var divideCol = args.returnData.divideCol;
                    var divide = args.returnData.data;
                    var divideColValue = focusedRow[divideCol];
                    var row = 0; //将要拆分的行数
                    var perRowColValue = 0; //每行拆分得到的数
                    if (divideType == "numberType") {
                        /**按值拆分
                        *   用户输入一个数值，每一行都将按照这个值进行拆分，如果拆分用户输入的数值比当前列的值大则提示错误
                        *   否则对当前列进行拆分，直到当前列剩余的数值小于用户输入的数值时插入最后一行
                        *   按值拆分不考虑取整的问题
                        */
                        row = parseInt(divideColValue / divide);
                        perRowColValue = divide;

                    } else if (divideType == "lineType") {
                        /**按行拆分规则
                        * 当拆分列所对应的值按行的拆分结果不是整数时
                        *  做如下处理：perRowColValue 都向下取整，拆分的最后一行perRowColValue = 原始列值（divideColValue） - 前面所有拆分行列值之和
                        **/
                        divideColValue = parseFloat(divideColValue);
                        //计算每行拆得的数值
                        perRowColValue = parseInt(divideColValue / divide);
                        row = divide;
                    }//else divideType == "lineType"
                    var isAppend = (focusedIndex == model3d.getCurrentPageRows().length - 1);
                    //计算得到所有行号
                    var rowNOs = calculateRowNo(model3d, focusedIndex, focusedRow, row);
                    for (var i = 0; i < row - 1; i++) {
                        var obj = cb.clone(focusedRow);
                        obj[divideCol] = Math.floor(perRowColValue);
                        obj.state = cb.model.DataState.Add;
                        obj.isSelected = false;
                        obj[pkName] = "";
                        rowNOs[i] ? (obj[rowno] = rowNOs[i]) : "";
                        isAppend ? model3d.appendRow(obj) : model3d.insertRow(focusedIndex + i + 1, obj);
                        divideColValue = divideColValue - obj[divideCol];
                    }
                    var updateData = {};
                    updateData[divideCol] = divideColValue;
                    updateData.isSelected = false;
                    model3d.updateRow(focusedIndex, updateData);
                    cb.util.tipMessage("拆分成功！", function () {
                        if (cb.util.isFunction(callBack)) {
                            callBack();
                        }
                    });                    
                }//callback
            });//loadPage
        }//if
    };

    function calculateRowNo(model3d, focusedIndex, focusedRow, rowCount) {
        var rowNOs = [];
        var rowno = model3d.getFieldNameFromInterfaceField("rowno");
        if (rowno) {
            var focusedRowNo = parseFloat(focusedRow[rowno]);
            var currentPageRows = model3d.getCurrentPageRows();
            var lastRowIndex = currentPageRows.length - 1;
            //如果被拆分行就是最后一样，则将所有拆出来的行，按行号规则加10
            var averageNo = 10;
            if (focusedIndex != lastRowIndex) {
                //否则，取下一行的行号+当前行号, 再除以rowCount-1，然后平均分配给新拆分出来的行。
                var nextRow = model3d.getRow(focusedIndex + 1);
                if (rowCount === 2) {
                    averageNo = Math.floor((parseFloat(nextRow[rowno]) - focusedRowNo - 1) / 2);
                }
                else{
                    averageNo = Math.floor((parseFloat(nextRow[rowno]) - focusedRowNo-1) / (rowCount - 1));
                }
            }
            for (var i = 0; i < rowCount - 1; i++) {
                rowNOs.push(focusedRowNo + (averageNo * (i + 1)));
            }
        }
        return rowNOs;
    }

    

    function innerLoadDetailView(viewModel, params) {
        var symbol = viewModel.getSymbol();
        if (!symbol) return;
        cb.route.loadArchiveViewPart(viewModel, symbol + "App", params);
    };

    function getDetailParams (args) {
        var data;
        if (args && args.id) {
            data = { "id": args.id, "whereSql": "1=1" };
        }
        else {            
            data = { "id": viewModel.getPkValue(), "whereSql": "1=1" };            
        }
        return data;
    }

    //上一条单据
    function innerQueryPrevious(data, callBack) {

        cb.data.CommonProxy(this.symbol).QueryPrevious(data, function (success, fail) {            

            var result = handleResult(success, fail, null, function (result) {
                if (cb.util.isFunction(callBack)) {
                    callBack(result);
                }
            });
        });
    };

    //下一条单据
    function innerQueryNext(data,callBack) {     

        cb.data.CommonProxy(this.symbol).QueryNext(data, function (success, fail) {
            var result = handleResult(success, fail, null, function (result) {
                if (cb.util.isFunction(callBack)) {
                    callBack(result);
                }
            });
        });
    };



    this.config = function (args) {
        /// <param name="viewModel" type="DeliveryViewModel">viewModel类型为DeliveryViewModel</param>
        if (!args) return;
        switch (args) {
            case "columnSet":
                this.showColumn(viewModel.getModel3D().get("columnCode"));
                break;
            case "autoWrap":
                this.setAutoWrap();
                break;
            case "subTotal":
                this.showSubTotal();
                break;
            case "combineTotal":
                this.showCombineTotal();
                break;
            case "fontSet-smaller":
            case "fontSet-normal":
            case "fontSet-big":
                this.setFontType(args);
                break;
            default:
                break;
        }
    };
   


    ///转换枚举类型数据源
    //source:"0:左对齐,1:居中,2:审批进行中,2:右对齐"
    //target: [{ text: "左对齐", value: "0" }, { text: "居中", value: "1" }, { text: "右对齐", value: "2" }]    
    this._convertoDataSource= function (source) {        
        var result = [];
        var dataSource = source.split(",");
        if ($.isArray(dataSource)) {
            for (var i = 0, j = dataSource.length; i < j; i++) {
                var temp = dataSource[i].split(":");
                if (temp && temp.length == 2) {
                    result.push({ text: temp[1], value: temp[0] });
                }
            }
        }

        return result;
    };

    this.convertToColumns = cb.util.convertToColumns;    

    function innerUpdateColumn (data) {
        //更新栏目 data 中已经包含了修改后的栏目信息
        debugger;
        var self = this;
        var symbol = viewModel.getSymbol();
        if (symbol != null) {
            var listCard = viewModel.getModel3D();
            listCard.setData({
                fields: {
                    "leftTopField": data.columns[0],
                    "rightTopField": data.columns[1],
                    "leftBottomField": data.columns[2],
                    "rightBottomField": data.columns[3]
                }
            });

            listCard.setColumns(data.columns);

            //更新数据
            innerRefresh();
        }
    };
	
	

    function innerRefresh (callBack) {
        //刷新数据
        var listCard = viewModel.getModel3D();
        var querySchemeID = listCard.get("querySchemeID");
        var symbol = viewModel.getSymbol();
        cb.data.CommonProxy(symbol).LoadSchemeDataCount([querySchemeID], function (success, fail) {
            if (fail) {
                alert("获取查询方案数据记录数失败");
                return;
            }
            var queryScheme = viewModel.getqueryScheme();
            queryScheme.set("dataCount", success);
        });
        var columnCode = listCard.get("columnCode");
        var filters = []; //高级查询
        var pageIndex = 1;
        batOp.loadData(querySchemeID, columnCode, filters, "Y", "override", pageIndex, callBack);
    };

    //复制两个数组的数据并返回新数据
    function copyArrayData(from, to) {
        if (!from || typeof from != 'object') return;

        var src, target;

        if (from instanceof Array) {
            to = to instanceof Array ? to : [];
        }
        for (var i in from) {
            src = from[i];
            target = to[i];
            if (src && typeof src == 'object') {
                if (typeof target != 'object') target = {};
                to[i] = copyArrayData(src, target);
            } else if (src != null) {
                to[i] = src;
            }
        }
        return to;
    }    
    return batOp;
};