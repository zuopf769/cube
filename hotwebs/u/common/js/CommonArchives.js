cb.data.commonArchives = function(viewModel) {
    this.options = {
        //注册操作成功回调函数
        setSuccessCallback: function(callback) {
            if (callback) _this.options._successCallback = callback;
            return _this.options;
        },
        getSuccessCallback: function(callback) {
            return _this.options._successCallback;
        },
        //设置失败后回调函数
        setFailCallback: function(callback) {
            if (callback) _this.options._failCallback = callback;
            return _this.options;
        },
        getFailCallback: function() {
            return _this.options._failCallback;
        },
        //设置确认窗口
        setConfirm: function(confirmFun) {
            if (confirmFun) _this.options._confirmFun = confirmFun;
            return _this.options;
        },
        getConfirm: function() {
            return _this.options._confirmFun;
        },
        //设置操作描述
        setOperateDesc: function(desc) {
            if (desc) _this.options._OperateDesc = desc;
            return _this.options;
        },
        getOperateDesc: function(desc) {
            return _this.options._OperateDesc;
        },
        //处理数据收集参数
        setBeforeCollectData: function(func) {
            if (func) _this.options._collectData = func;
            return _this.options;
        },
        getBeforeCollectData: function(func) {
            return _this.options._collectData;
        },
        //处理操作函数参数
        setOperateFuncParam: function(func) {
            if (func) _this.options._OperateFuncParam = func;
            return _this.options;
        },
        getOperateFuncParam: function(func) {
            return _this.options._OperateFuncParam;
        }
    };
    var _this = this;
    this.symbol = viewModel.getSymbol();
    this._interfaceFields = ["pk_group", "pk_org", "creator", "creationtime", "modifier", "modifiedtime"];
    this.loadDefaultValue = function(interfaceField) {
        if (!interfaceField) {
            cb.each(this._interfaceFields, function(item) {
                loadDefaultItemValue(item);
            });
        } else {
            loadDefaultItemValue(interfaceField);
        }
    };
    var loadDefaultItemValue = function(interfaceField) {
        if (!interfaceField) return;
        var fieldModel = viewModel.getFieldModelFromInterfaceField(interfaceField);
        if (!fieldModel) return;
        switch (interfaceField) {
            case "pk_group":
                fieldModel.setValue(cb.rest.ApplicationContext.groupID);
                break;
            case "pk_org":
                //fieldModel.setValue("GLOBLE00000000000000");
                fieldModel.setValue(cb.rest.ApplicationContext.orgId);
                break;
            case "creator":
            case "modifier":
                fieldModel.setValue(cb.rest.ApplicationContext.userID);
                break;
            case "creationtime":
            case "modifiedtime":
                fieldModel.setValue("@SYSDATE");
                break;
        }
    };
    this.addScheme = function() {
        cb.route.loadPageViewPart(viewModel, "common.queryscheme.SchemeDetailApp", {
            width: 700,
            height: 560
        });
    };
    this.setScheme = function() {
        cb.route.loadPageViewPart(viewModel, "common.commonscheme.SchemeListManageApp", {
            width: 450,
            height: 550
        });
    };
    this.expandScheme = function() {
        cb.route.toggleViewPart(viewModel, cb.route.CommonAppEnum.QueryScheme, cb.route.ViewPartType.QueryScheme, {
            animation: {
                mode: "toggle"
            },
            refreshData: false,
            callBack: function(filters) {
                if (filters) _this.listRefresh();
            }
        });
    };
    //公共方法--------------------------档案列表-----------------------------------------------------
    //档案列表页公共方法: 面初始化--------------
    this.init = function() {
        cb.route.initViewPart(viewModel); //待续......
        viewModel.currentSlectNodeInfo = null;
        viewModel._primaryKey = 'ccuscode_pk';
        var queryScheme = viewModel.getqueryScheme();
        queryScheme.setData({
            "fields": {
                "valueField": "queryschemeID",
                "textField": "name"
            }
        });
        var symbol = _this.symbol;
        if (symbol != null) {
            var listCard = viewModel.getModel3D();
            var pageSize = listCard.getPageSize();
            var params = {
                "loadDefaultData": true,
                "pageSize": pageSize
            };
            cb.data.CommonProxy(symbol).LoadSchemeList(params, function(success, fail) {
                if (fail) {
                    cb.util.tipMessage("获取查询方案列表失败");
                    return;
                }
                var schemeList = success.schemeList;
                if (schemeList) {
                    queryScheme.setDataSource(schemeList);
                    var querySchemeIds = [];
                    for (var i = 0, len = schemeList.length; i < len; i++) {
                        querySchemeIds.push(schemeList[i].queryschemeID);
                    };
                    cb.data.CommonProxy(symbol).LoadSchemeDataCount(querySchemeIds, function(success, fail) {
                        if (fail) {
                            cb.util.tipMessage("获取查询方案数据记录数失败");
                            return;
                        }
                        queryScheme.set("dataCount", success);
                    })
                }
                var defaultSchemeID = success.defaultSchemeID;
                var defaultSchemeData = success.defaultSchemeData;
                if (defaultSchemeData) {
                    listCard.setDataSource(cb.data.CommonProxy(symbol), "Query", {
                        "querySchemeID": defaultSchemeID
                    }, defaultSchemeData);
                };
            });
        }
        var timeLine = viewModel.gettimeLine();
        timeLine.setDataSource(TimeLineData);
    };
    //档案列表页公共方法: 执行操作
    this.doAction = function(name, viewModel) {
        if (this[name]) {
            this[name](viewModel)
        }
    };
    //档案列表页公共方法：增加档案数据
    this.listAdd = function(args) {
        if (viewModel.beforeExecute("listAdd", args)) {
            var nodeInfo = null;
            var model2d = viewModel.getModel2D();
            if (model2d) nodeInfo = viewModel.getModel2D().getSelectedNode();
            innerLoadDetailView(viewModel, {
                "mode": "add",
                "nodeInfo": nodeInfo,
                "refreshCallback": this.refresh
            });
            viewModel.afterExecute("listAdd");
        };
    };
    //档案列表页公共方法：编辑客户档案
    this.listEdit = function(args) {
        if (viewModel.beforeExecute("listEdit", args)) {
            var callBack = function() {
                //暂时不提供回调方法
                viewModel.afterExecute("listEdit");
            };
            var nodeInfo = null;
            var model2d = viewModel.getModel2D();
            if (model2d) nodeInfo = viewModel.getModel2D().getSelectedNode();
            this.loadDetailEditView({
                "nodeInfo": nodeInfo
            }, callBack);
        };
    };
    //档案列表页公共方法：删除客户档案
    this.batchDelete = function(processRowData, action) {
        var nodeInfo = null;
        var code = null;
        var model2d = viewModel.getModel2D();
        if (model2d) {
            nodeInfo = viewModel.getModel2D().getSelectedNode();
            code = nodeInfo.code;
        };
        if (viewModel.beforeExecute("batchDelete")) {
            var resultCallBack = function(result) {
                viewModel.afterExecute("batchDelete", result.success);
                //删除后的刷新操作
                _this.listRefresh({
                    "code": code
                });
            };
            if (!action) action = cb.data.CommonProxy(_this.symbol).BatchDelete;
            batchOpFun(processRowData, resultCallBack);
        }
    };
    //档案列表页公共方法: 双击行事件进入档案详情
    this.dblClickRow = function(args) {
        if (viewModel.beforeExecute("dblClickRow", args)) {
            var callBack = function() {
                viewModel.afterExecute("dblClickRow");
            };
            //暂时没有提供回调的方法
            var nodeInfo = null;
            var model2d = viewModel.getModel2D();
            if (model2d) nodeInfo = viewModel.getModel2D().getSelectedNode();
            args.nodeInfo = nodeInfo;
            this.loadDetailView(args, callBack);
        };
    };
    //档案列表公共方法: 树控件的点击加载列表事件
    //提供树点击参数传递
    //提供树点击回调方法
    /*this.treeClick = function (args, data, treeClickCallBack) {
    //判断是否是分类树
    debugger;
    var model2d = viewModel.getModel2D();
    if (!model2d) return;
    var isCatalog = null;
    if (model2d) isCatalog = viewModel.getModel2D().get("isCatalog");
    var recallBack = function (ok){
    if(!ok) return;
    //取消验证
    viewModel.cancelValidate();
    debugger;
    var defaultParams = {
    "pageIndex":1,
    "pageSize":15,
    "querySchemeID":args.querySchemeID,
    "filters":args.filters,
    "code":args.code,
    "treeFuncode":args.treeFunCode,
    "codeOrName":args.codeOrName
    };
    args = cb.extend( defaultParams, data);
    var callBack = function (success, fail) {
    //如果不是分类树，而且为末节点则直接调到卡片
    if (isCatalog == false && success.totalCount && success.totalCount == 1) {
    _this.loadDetailView(success.currentPageData[0]);

    } else {
    //如果为分类树，加载列表。
    //if(isCatalog == false)_this.return(viewModel);
    //如果不是分类树，而且不是末节点则跳到列表页
    debugger;
    if(isCatalog == false){
    $('.archiveList').show();
    $('.archiveDetail').hide();
    };
    var params = cb.route.getViewPartParams(viewModel);
    var param = viewModel.collectData();
    var listCard = viewModel.getModel3D();
    listCard.setPageRows(success);
    };
    //树点击回调
    if(cb.util.isFunction(treeClickCallBack)) treeClickCallBack();
    };
    cb.data.CommonProxy(_this.symbol).Query(args, callBack);
    };
    //树卡表结构：如果不是分类树则提示保存，是分类树则不提示保存
    if(isCatalog === undefined || isCatalog == false){
    recallBack(true);
    }else{
    //编辑态提示保存
    if (viewModel.isDirty()) _this.hintSave(recallBack);
    };
};*/
    this.treeClick = function(args) {
        //取消验证
        viewModel.cancelValidate();
        var model2d = viewModel.getModel2D();
        var listCard = viewModel.getModel3D();
        if (!model2d) return;
        var isCatalog = null;
        if (model2d) isCatalog = viewModel.getModel2D().get("isCatalog");
        var columnCode = listCard.get("columnCode");
        var defaultParams = {
            "pageSize": 15,
            "pageIndex": 1,
            "columnCode": columnCode,
            "reloadColumn": true,
            "isLeaf": false
        };
        args = cb.extend(defaultParams, args);
        if (viewModel.beforeExecute("treeClick", args)) {
            var recallBack = function(ok) {
                if (!ok) return;
                var callBack = function(success, fail) {
                    //如果不是分类树，而且为末节点则直接调到卡片
                    if (fail) {
                        cb.util.warningMessage("查询列表失败: " + fail.error);
                        return;
                    };
                    if (success && success.currentPageData && success.currentPageData.length && !success.currentPageData[0]) {
                        cb.util.tipMessage("后台无数据返回！");
                        return;
                    };
                    if (isCatalog == false && success.totalCount && success.totalCount == 1) {
                        _this.loadDetailView(success.currentPageData[0]);
                    } else {
                        //如果为分类树，加载列表。
                        //if(isCatalog == false)_this.return(viewModel);
                        //如果不是分类树，而且不是末节点则跳到列表页
                        if (isCatalog == false) {
                            $('.archiveList').show();
                            $('.archiveDetail').hide();
                        };
                        var params = cb.route.getViewPartParams(viewModel);
                        var param = viewModel.collectData();
                        var listCard = viewModel.getModel3D();
                        listCard.setPageRows(success);
                    };
                    viewModel.afterExecute("treeClick", success);
                };
                cb.data.CommonProxy(_this.symbol).Query(args, callBack);
            };
            //树卡表结构：如果不是分类树则提示保存，是分类树则不提示保存
            if (isCatalog === undefined || isCatalog == false) {
                recallBack(true);
            } else {
                //编辑态提示保存
                if (viewModel.isDirty()) _this.hintSave(recallBack);
            };
        }
    };
    //档案列表公共方法：查询方案
    this.queryScheme = function(args) {
        //
    };
    //档案列表公共方法: 树控件的点击事件
    this.treeBeforeExpand = function(args) {
        //alert("已经到公共逻辑");
    };
    //档案列表公共方法: 树控件的点击事件
    this.treeMoreClick = function(args) {
        //alert("已经到公共逻辑");
    };
    //档案列表公共方法: 设置按钮
    this.config = function(args) {
        if (!args) return;
        if (viewModel.beforeExecute("config", args)) {
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
            };
        }
    };
    //公开方法
    //显示栏目设置界面
    //params: columnCode 栏目编码，type 0 参照， 1 档案
    //提供前后事件
    this.showColumn = function(columnCode, type, callBack) {
        //弹出参照界面
        if (viewModel.getReadOnly() || viewModel.getDisabled()) return;
        columnCode = columnCode || null;
        cb.route.loadPageViewPart(viewModel, "common.col.ColumnApp", {
            columnCode: columnCode,
            type: type,
            callBack: function(refresh, data) {
                if (refresh) innerUpdataColumn(data);
            }
        })
    };

    function innerUpdataColumn(data) {
        //把data信息在展现出来
        var self = this;
        if (_this.symbol) {
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
            this.innerRefresh();
        }
    };
    //设置自动换行
    this.setAutoWrap = function() {
        var status = $("#autoWrap").attr('status');
        if (status == '0') {
            $("#autoWrap").attr("src", "./pc/images/set-select.png");
            $("#autoWrap").attr("status", "1");
            viewModel.getModel3D().setState("autoWrap", true);
        } else if (status == '1') {
            $("#autoWrap").attr("src", "./pc/images/set-unselect.png");
            $("#autoWrap").attr("status", "0");
            viewModel.getModel3D().setState("autoWrap", false);
        }
    };
    //公开方法：显示列表小计
    this.showSubTotal = function() {
        cb.util.tipMessage("显示小计");
        var status = $("#subTotal").attr('status');
        if (status == '0') {
            $("#subTotal").attr("src", "./pc/images/set-select.png");
            $("#subTotal").attr("status", "1");
        } else if (status == '1') {
            $("#subTotal").attr("src", "./pc/images/set-unselect.png");
            $("#subTotal").attr("status", "0")
        };
    };
    //公开方法：显示列表合计
    this.showCombineTotal = function() {
        cb.util.tipMessage("显示合计");
        var status = $("#combineTotal").attr('status');
        if (status == '0') {
            $("#combineTotal").attr("src", "./pc/images/set-select.png");
            $("#combineTotal").attr("status", "1");
        } else if (status == '1') {
            $("#combineTotal").attr("src", "./pc/images/set-unselect.png");
            $("#combineTotal").attr("status", "0");
        }
    };
    //公开方法：设置字体大小
    this.setFontType = function(fontType) {
        var selectImg = $("#" + fontType);
        var status = selectImg.attr('status');
        var fontTypes = ["fontSet-smaller", "fontSet-normal", "fontSet-big"];
        if (status == '0') {
            selectImg.attr("src", "./pc/images/set-select.png");
            selectImg.attr("status", "1");
            for (var i = 0, j = fontTypes.length; i < j; i++) {
                if (fontType != fontTypes[i]) {
                    $("#" + fontTypes[i]).attr("src", "./pc/images/set-unselect.png");
                    $("#" + fontTypes[i]).attr("status", "0")
                }
            };
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
        } else if (status == '1') {};
        //cb.util.tipMessage("列表字号设置成功");
    }
    //----------------------------分隔符-------------档案详情-------------------------------------------------
    // 从编辑详情返回列表
    this.
    return = function() {
        var callBack = function(ok) {
            if (!ok) return;
            cb.route.hideArchiveCurrentViewPart(viewModel);
        }
        if (viewModel.isDirty()) {
            _this.hintSave(callBack)
        } else {
            callBack(true);
        };
    };
    //档案详情页公共方法：保存客户档案
    this.save = function(args) {
        args = checkArgs(args);
        var inputParams = cb.route.getViewPartParams(viewModel);
        //var querySchemeID = inputParams.id;
        var code = inputParams.nodeInfo && inputParams.nodeInfo.code;
        var querySchemeID = null;
        if (!viewModel.validate() || !_this.symbol || !inputParams.mode) return;
        var newParams = viewModel.collectData();
        var difParams = viewModel.collectData(true);
        var pkName = viewModel.getPkName();
        var pk = difParams[pkName];
        //新增保存为2，编辑保存为1；
        difParams.state = pk ? 1 : 2;
        if (viewModel.beforeExecute("save", difParams)) {
            //弹框显示处理返回结果
            var callback = function(success, fail) {
                args.opName = "保存";
                var result = _this.handleResult(success, fail, args, function(result) {
                    if (cb.util.isFunction(resultCallBack)) {
                        resultCallBack(result)
                    };
                });
            };
            //加载页面处理返回结果
            var resultCallBack = function(result) {
                if (result.success) {
                    //兼容返回结果可能出现的数组和json两中情况。
                    var data = cb.isArray(result.data) ? result.data : [result.data];
                    data = cb.extend(newParams, data[0])
                    //重新刷新界面数据
                    viewModel.loadData(data);
                    _this.setState("browse");
                    viewModel.setReadOnly(true);
                    viewModel.afterExecute("save", data);
                    //保存后，对应列表页刷新
                    if (inputParams.refreshCallback) inputParams.refreshCallback.call(this, {
                        "querySchemeID": querySchemeID,
                        "code": code
                    });
                };
            };
            cb.data.CommonProxy(_this.symbol).Save(difParams, callback);
        };
    };
    //档案详情页公共方法: 编辑卡片
    this.edit = function(args) {
        if (viewModel.beforeExecute("edit", args)) {
            //cb.model.PropertyChange.delayPropertyChange(true);
            _this.setState("edit");
            viewModel.setReadOnly(false);
            //cb.model.PropertyChange.delayPropertyChange();
            viewModel.afterExecute("edit", args);
        };
    };
    //档案详情页公共方法：取消要新增或者编辑的客户档案
    this.cancel = function(args) {
        var callBack = function(ok) {
            if (!ok) return;
            viewModel.cancelValidate();
            var hasLoadData = viewModel.hasLoadData();
            if (hasLoadData) {
                //编辑态的取消
                var data = viewModel.getOriginalData();
                if (viewModel.beforeExecute("cancel", data)) {
                    viewModel.restore();
                    viewModel.setReadOnly(true);
                    //浏览态
                    _this.setState("browse");
                    viewModel.afterExecute("cancel", data);
                }
            } else {
                //新增态的取消
                if (viewModel.beforeExecute("cancel")) {
                    viewModel.clear();
                    viewModel.setReadOnly(false);
                    //浏览态
                    _this.setState("browse");
                    viewModel.afterExecute("cancel");
                }
            }
        };
        if (viewModel.isDirty()) {
            _this.hintSave(callBack)
        } else {
            callBack(true);
        }
    };
    //档案详情页公共方法：删除卡片
    this.delete = function(args) {
        args = checkArgs(args);
        var params = {};
        var inputParams = cb.route.getViewPartParams(viewModel);
        var querySchemeID = inputParams.id;
        var pas = viewModel.collectData(true);
        var pkValue = viewModel.getPkValue();
        var tsValue = viewModel.getTsValue();
        var pkName = viewModel.getPkName();
        var tsName = viewModel.getTsName();
        params[pkName] = pas[pkName];
        params[tsName] = pas[tsName];
        if (pkValue && !tsValue) return;
        if (viewModel.beforeExecute("delete", params)) {
            var resultCallBack = function(result) {
                if (result.success) {
                    //如果删除成功，则查询下一条数据
                    var data = getDetailParams();
                    if (data && _this.symbol) {
                        cb.data.CommonProxy(_this.symbol).QueryNext(data, function(success, fail) {
                            args.opName = "查询下一条";
                            if (success) {
                                success = cb.isArray(success) && success.length > 0 ? success[0] : success;
                                viewModel.loadData(success);
                                viewModel.afterExecute("delete", success);
                            };
                            if (fail || !success && !fail) {
                                //如果是最后一条数据， 则跳转到前一条数据
                                cb.data.CommonProxy(_this.symbol).QueryPrevious(data, function(success, fail) {
                                    if (success) {
                                        success = cb.isArray(success) && success.length > 0 ? success[0] : success;
                                        viewModel.loadData(success);
                                    };
                                    //如果上一条下一条都没有数据，则处于浏览态
                                    if (fail || !success && !fail) {
                                        viewModel.newRecord();
                                        _this.setState("browse");
                                    }
                                    viewModel.afterExecute("delete", success);
                                })
                            }
                        })
                    }
                    if (inputParams.refreshCallback) inputParams.refreshCallback.call(this, {
                        "querySchemeID": querySchemeID
                    });
                } else {
                    //if(result.error) cb.util.tipMessage( "删除失败："+result.error);
                    viewModel.afterExecute("delete", result);
                }
            };
            var msg = "您真的确定要删除吗？\n\n请确认";
            cb.util.confirmMessage(msg, function() {
                innerDelete(params, args, resultCallBack)
            }, null, _this);
        }
    };

    function innerDelete(params, args, resultCallBack) {
        var callBack = function(success, fail) {
            args.opName = "删除";
            var result = _this.handleResult(success, fail, args, function(result) {
                if (cb.util.isFunction(resultCallBack)) resultCallBack(result);
            });
        };
        cb.data.CommonProxy(_this.symbol).Delete(params, callBack);
    };
    //档案详情页公共方法：上一条
    this.print = function(args) {
        cb.util.tipMessage("功能开发中...")
    }
    //档案详情页公共方法：上一条
    this.prev = function(args) {
        var recallBack = function(ok) {
            if (!ok) return;
            args = checkArgs(args);
            if (!_this.symbol) return;
            var data = getDetailParams(args);
            var datum = cb.route.getViewPartParams(viewModel);
            if (!data) return;
            if (viewModel.beforeExecute("prev", data)) {
                var callBack = function(success, fail) {
                    args.opName = "查询上一条";
                    //对上一条和下一条的特殊处理
                    if (success) args.prompt = false;
                    if (!fail && !success) {
                        args.prev = true;
                        args.opName = "已经是第一条或者上一条没有数据"
                    };
                    var result = _this.handleResult(success, fail, args, function(result) {
                        if (cb.util.isFunction(resultCallBack)) resultCallBack(result);
                    });
                };
                var resultCallBack = function(result) {
                    if (result.success) {
                        if (result.data) viewModel.loadData(result.data[0]);
                        viewModel.afterExecute("prev", result);
                    };
                };
            };
            cb.data.CommonProxy(_this.symbol).QueryPrevious(data, callBack)
        };
        //编辑态提示保存
        if (viewModel.isDirty()) _this.hintSave(recallBack);
    };
    //档案详情页公共方法：下一条
    this.next = function(args) {
        var recallBack = function(ok) {
            if (!ok) return;
            args = checkArgs(args);
            if (!_this.symbol) return;
            var data = getDetailParams(args);
            var datum = cb.route.getViewPartParams(viewModel);
            if (!data) return;
            if (viewModel.beforeExecute("next", data)) {
                var callBack = function(success, fail) {
                    args.opName = "查询下一条";
                    //对上一条和下一条的特殊处理
                    if (success) args.prompt = false;
                    if (!fail && !success) {
                        args.next = true;
                        args.opName = "已经是最后一条或者下一条没有数据";
                    };
                    var result = _this.handleResult(success, fail, args, function(result) {
                        if (cb.util.isFunction(resultCallBack)) resultCallBack(result);
                    })
                };
                var resultCallBack = function(result) {
                    if (result.success) {
                        if (result.data) viewModel.loadData(result.data[0]);
                        viewModel.afterExecute("next", result)
                    }
                }
                cb.data.CommonProxy(_this.symbol).QueryNext(data, callBack)
            };
        };
        //编辑态提示保存
        if (viewModel.isDirty()) _this.hintSave(recallBack);
    };
    //档案详情页公共方法：设置卡片
    this.set = function() {
        cb.util.tipMessage("功能正在开发中。。。")
    }
    //档案详情页公共方法：增加用户
    this.add = function() {
        viewModel.cancelValidate();
        if (viewModel.beforeExecute("add")) {
            //cb.model.PropertyChange.delayPropertyChange(true);
            viewModel.newRecord();
            this.loadDefaultValue();
            _this.setState("add");
            viewModel.setReadOnly(false);
            viewModel.afterExecute("add");
            //cb.model.PropertyChange.delayPropertyChange();
        };
    };
    //档案详情页公共方法：复制当前信息
    this.copy = function(args) {
        viewModel.cancelValidate();
        var data = viewModel.collectData();
        var pkName = viewModel.getPkName();
        data[pkName] = "";
        if (viewModel.beforeExecute("copy", args)) {
            cb.model.PropertyChange.delayPropertyChange(true);
            viewModel.loadData(data);
            _this.setState("add");
            viewModel.setReadOnly(false);
            viewModel.setDataState(cb.model.DataState.Add);
            viewModel.afterExecute("copy");
            cb.model.PropertyChange.doPropertyChange();
        }
    }
    //档案列表公共方法：增行
    this.addLine = function(args, selfModel) {
        var model3d = viewModel.getModel3D(selfModel && selfModel.get("refModel3DField"));
        if (model3d.beforeExecute("addLine", args)) {
            var callBack = function(row) {
                model3d.afterExecute("addLine", row);
            };
            innerAddLine(args, callBack, model3d);
        }
    };
    //增行的具体实现
    function innerAddLine(args, callBack, model3d) {
        var newRow = args || {};
        var rowno = model3d.getFieldNameFromInterfaceField("rowno");
        if (rowno && !newRow[rowno]) {
            var rows = model3d.getCurrentPageRows();
            var lastRow = rows[rows.length - 1];
            var lastRowNo = lastRow == null ? 0 : lastRow[rowno];
            newRow[rowno] = parseFloat(lastRowNo) + 10;
        };
        model3d.appendRow(newRow);
        if (cb.util.isFunction(callBack)) callBack(newRow);
    };
    //公共方法：插行
    this.insertLine = function(args, selfModel) {
        var model3d = viewModel.getModel3D(selfModel && selfModel.get("refModel3DField"));
        if (model3d.beforeExecute("insertLine", args)) {
            var callBack = function(row) {
                model3d.afterExecute("insertLine", row);
            };
            innerInsertLine(args, callBack, model3d);
        }
    };
    //插行的具体实现
    function innerInsertLine(args, callBack, model3d) {
        var focusedRow = model3d.getFocusedRow();
        var focusedRow2 = model3d.getPageSelectedIndexs();
        var rowData = args || {};
        var rowno = model3d.getFieldNameFromInterfaceField("rowno");
        var focusedRowIndex = model3d.getFocusedIndex();
        if (!focusedRow) {
            if (rowno && !rowData[rowno]) {
                var rows = model3d.getCurrentPageRows();
                var lastRow = rows[rows.length - 1];
                var lastRowNo = lastRow == null ? 0 : lastRow[rowno];
                rowData[rowno] = parseFloat(lastRowNo) + 10;
            };
            model3d.appendRow(rowData);
        } else {
            if (rowno && !rowData[rowno]) {
                var focusedRowNo = focusedRow[rowno];
                var preRowIndex = 0;
                var preRowno = 0;
                if (focusedRowIndex != 0) {
                    preRowIndex = focusedRowIndex - 1;
                    var preRow = model3d.getRow(preRowIndex, false);
                    preRowno = preRow[rowno];
                };
                var newRowno = (parseFloat(focusedRowNo) + parseFloat(preRowno)) / 2;
                rowData[rowno] = newRowno;
            }
            model3d.insertRow(focusedRowIndex, rowData);
        };
        if (cb.util.isFunction(callBack)) callBack(rowData);
    }
    //公共方法：删行
    this.deleteLine = function(args, selfModel) {
        var model3d = viewModel.getModel3D(selfModel && selfModel.get("refModel3DField"));
        var selectedRows = model3d.getPageSelectedIndexs();
        if (model3d.beforeExecute("deleteLine", selectedRows)) {
            var callBack = function() {
                model3d.afterExecute("deleteLine", selectedRows)
            };
            innerDeleteLine(selectedRows, model3d, callBack);
        }
    };
    //删除行的具体实现
    function innerDeleteLine(selectedRows, model3d, callBack) {
        model3d.deleteRows(selectedRows);
        if (cb.util.isFunction(callBack)) callBack();
    };
    //公共方法：复制行
    this.copyLine = function(args, selfModel) {
        var model3d = viewModel.getModel3D(selfModel && selfModel.get("refModel3DField"));
        var focusedRow = model3d.getFocusedRow();
        if (!focusedRow) {
            cb.util.tipMessage("请选择一行进行复制");
            return;
        };
        if (model3d.beforeExecute("copyLine", focusedRow)) {
            var callBack = function(row) {
                model3d.afterExecute("copyLine", focusedRow);
            };
            innerCopyLine(focusedRow, model3d, callBack);
        }
    };
    //复制行的具体实现
    function innerCopyLine(focusedRow, model3d, callBack) {
        if (focusedRow) {
            var rowData = cb.clone(focusedRow);
            var rowno = model3d.getFieldNameFromInterfaceField("rowno");
            if (rowno) {
                var rows = model3d.getCurrentPageRows();
                var lastRow = rows[rows.length - 1];
                var lastRowno = lastRow == null ? 0 : lastRow[rowno];
                rowData[rowno] = parseFloat(lastRowno) + 10;
            };
            model3d.appendRow(rowData);
            if (cb.util.isFunction(callBack)) callBack();
        }
    };
    //档案详情页公共方法: 更新页面列表
    this.refresh = function(args) {
        if (viewModel.beforeExecute("refresh")) {
            var callBack = function(args) {
                viewModel.afterExecute("refresh", args);
            };
            //刷新列表
            _this.listRefresh(args);
            //判断是否是分类树
            var model2d = viewModel.getModel2D();
            var isCatalog = null;
            if (model2d) isCatalog = viewModel.getModel2D().get("isCatalog");
            //if(isCatalog === false || isCatalog === undefined) _this.treeRefresh();
            if (isCatalog === false) _this.treeRefresh();
            //_this.treeRefresh();
        };
    };
    /*this.listRefresh = function(args) {
        //var params = cb.route.getViewPartParams(viewModel);
        //if (!params) return;
        debugger;
        var listCard = viewModel.getModel3D();
        var querySchemeId = listCard.get("querySchemeId");
        var columnCode = listCard.get("columnCode");
        var filters = [];
        var pageIndex = 1;
        var callBack = function() {
            viewModel.afterExecute("listRefresh")
        };

        _this.loadData(querySchemeId, columnCode, filters, true, "override", pageIndex, callBack);
    };*/
    this.listRefresh = function(args) {
        var symbol = _this.symbol;
        if (!symbol) return;
        var listCard = viewModel.getModel3D();
        var callBack = function() {
            viewModel.afterExecute("listRefresh")
        };
        var queryScheme = viewModel.get("queryScheme");
        if (queryScheme) {
            _this.LoadQueryScheme(queryScheme);
        }
        var querySchemeID = args && args.querySchemeID || null;
        if (!querySchemeID) querySchemeID = listCard.get("querySchemeID");
        var columnCode = args && args.columnCode || listCard.get("columnCode");
        var filters = args && args.filters || [];
        var reloadColumn = args && args.reloadColumn || true;
        var pageInfo = listCard.getPageInfo();
        var pageSize = args && args.pageSize || 15;
        var pageIndex = args && args.pageIndex || 1;
        var mode = args && args.mode || "override";
        var code = args && args.code || null;
        var params = {
            "querySchemeID": querySchemeID,
            "pageSize": pageSize,
            "pageIndex": pageIndex,
            "filters": filters,
            "columnCode": columnCode,
            "reloadColumn": reloadColumn,
            "code": code
        };
        //var inputParams = cb.route.getViewPartParams(viewModel);
        listCard.setDataSource(cb.data.CommonProxy(symbol), "Query", params);
    };
    this.LoadQueryScheme = function(queryScheme) {
        queryScheme.setData({
            "mode": "slide",
            "fields": {
                "valueField": "queryschemeID",
                "textField": "name"
            }
        });
        if (_this.symbol != null) {
            var listCard = viewModel.getModel3D();
            var pageSize = listCard.getPageSize();
            var columnCode = listCard.get("columnCode");
            var params = {
                "loadDefaultData": true,
                "columnCode": columnCode,
                "type": "0",
                "pageSize": pageSize
            };
            cb.data.CommonProxy(_this.symbol).LoadSchemeList(params, function(success, fail) {
                if (fail) {
                    cb.util.warningMessage("获取查询方案列表失败!");
                    return;
                };
                var schemeList = success.schemeList;
                if (schemeList) {
                    //设置默认查询方案
                    var defaultSchemeID = success.defaultSchemeID;
                    for (var i = 0, iLen = defaultSchemeID.length; i < iLen; i++) {
                        if (schemeList[i].queryschemeID == defaultSchemeID) {
                            schemeList[i].isSelected = true;
                            break;
                        };
                    };
                    queryScheme.setDataSource(schemeList);
                    //
                    var querySchemeIDs = [];
                    for (var i = 0, iLen = schemeList.length; i < iLen; i++) {
                        querySchemeIDs.push(schemeList[i].queryschemeID);
                    };
                    cb.data.CommonProxy(_this.symbol).LoadSchemeDataCount(querySchemeIDs, function(success, fail) {
                        if (fail) {
                            cb.util.tipMessage("获取查询方案记录数失败");
                            return;
                        };
                        queryScheme.set("dataCount", success);
                    });
                };
                var defaultSchemeID = success.defaultSchemeID;
                if (defaultSchemeID) defaultSchemeID = listCard.set("querySchemeID", defaultSchemeID);
                var defaultSchemeData = success.defaultSchemeData;
                if (defaultSchemeData) {
                    defaultSchemeData.mode = "override";
                    listCard.setPageRows(defaultSchemeData);
                }
            })
        }
    };
    /*
    刷新列表数据
    querySchemeID 查询方案ID
    columnCode 栏目编码
    filters 高级查询方案
    reloadColumn 是否重新加载栏目，只有用户修改栏目设置后，此值为true
    mode 数据加载方式 首次加载override，翻页append
    pageIndex, 翻页时，不用传此值
    */
    this.loadData123 = function(querySchemeID, columnCode, filters, reloadColumn, mode, pageIndex, pageSize, callBack) {
        reloadColumn = reloadColumn || false;
        mode = mode || "override";
        filters = filters || null;
        columnCode = columnCode || null;
        var symbol = _this.symbol;
        if (!symbol) return;
        var listCard = viewModel.getModel3D();
        if (!querySchemeID) querySchemeID = listCard.get("querySchemeID");
        var pageInfo = listCard.getPageInfo();
        var pageSize = pageInfo.pageSize;
        pageIndex = pageIndex || pageInfo.pageIndex;
        var resultCallBack = function(result) {
            if (result.success) {
                if (result.data) {
                    result.data.mode = mode;
                    listCard.setPageRows(result.data); // Model3D.setPageRows()设置请求回来的信息
                    if (cb.util.isFunction(callBack)) callBack(result);
                }
            }
        };
        cb.data.CommonProxy(symbol).Query({
            "querySchemeID": querySchemeID,
            "pageSize": 15,
            "pageIndex": pageIndex,
            "filters": filters,
            "columnCode": columnCode,
            "reloadColumn": reloadColumn
        }, function(success, fail) {
            var args = {}
            args.prompt = success ? false : true;
            args.opName = "查询列表数据";
            var result = _this.handleResult(success, fail, args, function(result) {
                if (cb.util.isFunction(resultCallBack)) resultCallBack(result);
            });
        })
        var symbol = _this.symbol;
        listCard.setDataSource(cb.data.CommonProxy(symbol), "Query", {
            "querySchemeID": querySchemeID,
            "pageSize": pageSize,
            "pageIndex": pageIndex,
            "filters": filters,
            "columnCode": columnCode,
            "reloadColumn": reloadColumn
        }, callBack);
    };
    this.treeRefresh = function(args) {
        var treeModel = viewModel.getModel2D();
        if (!treeModel) return;
        var treeFunctionId = treeModel.get("treeFunctionId");
        if (!treeFunctionId) return;
        var iteration = function(items) {
            cb.each(items, function(item) {
                delete item.parent;
                if (item.children.length) iteration(item.children);
            });
        };
        var callBack = function(success, fail) {
            args = {};
            if (success) {
                args.prompt = false;
            } else if (fail) {
                args.prompt = true;
            }
            args.opName = "查询树控件";
            var result = _this.handleResult(success, fail, args, function(result) {
                if (cb.util.isFunction(resultCallBack)) resultCallBack(result);
            });
        };
        var resultCallBack = function(result) {
            if (result.success) {
                if (result.data) {
                    delete result.data.parent;
                    iteration(result.data.children);
                    treeModel.setDataSource(result.data);
                }
            }
        }
        var defaultParams = {
            "treeFunctionId": treeFunctionId,
            "querySchemeID": "",
            "nodeCode": "",
            "pageSize": 15,
            "pageIndex": 1,
            "maxLevel": 10,
            "pageType": 0
        }
        args = cb.extend(defaultParams, args);
        if (_this.symbol && treeModel && treeFunctionId) {
            cb.data.CommonProxy("UAP").QueryTree(args, callBack);
        };
    };
    //------------------------------优美的分割线-----------------------------------------------------
    //------------------------------优美的分割线-----------------------------------------------------
    //加载到编辑详情页
    this.loadDetailEditView = function(args, callBack) {
        //if(!args) return;
        var model3d = viewModel.getModel3D();
        var selectedRows = model3d.getSelectedRows();
        if (!selectedRows.length) {
            cb.util.warningMessage("请选择要编辑的单据!")
            return _this;
        };
        var pk = model3d.getPkName();
        var id = selectedRows[0][pk];
        if (id == null) {
            cb.util.tipMessage("id为空了");
            return;
        };
        innerLoadDetailView(viewModel, {
            "mode": "edit",
            "id": id,
            "pk": pk,
            "refreshCallback": _this.refresh,
            "nodeInfo": args.nodeInfo
        });
        if (cb.util.isFunction(callBack)) callBack();
    };
    //批量操作主函数
    function batchOpFun(processRowData, resultCallBack) {
        if (!_this.symbol) return;
        var result = {};
        var args = {
            prompt: true,
            opName: "删除"
        };
        var model3d = viewModel.getModel3D();
        var param = getBatchOpPara(model3d, args.opName, processRowData);
        if (param && param.length == 0) return _this;
        var callBack = function(ok) {
            if (!ok) return;
            //根据业务要求，当只操作一条数据时，就不显示批量报告界面
            if (param.length == 1) {
                cb.data.CommonProxy(_this.symbol).BatchDelete(param, function(success, fail) {
                    args.opName = "删除";
                    result = _this.handleResult(success, fail, args, function(result) {
                        if (cb.util.isFunction(resultCallBack)) resultCallBack(result);
                    });
                });
            } else {
                //当操作数据有两条及以上,显示批量报告界面
                cb.data.CommonProxy(_this.symbol).BatchDelete(param, function(success, fail) {
                    args.opName = "批量删除";
                    result = _this.handleResult(success, fail, args, function(result) {
                        if (result.success) {
                            //此页面只用来显示结果，并没有做任何业务处理
                            if (cb.util.isFunction(resultCallBack)) resultCallBack(result);
                            /*cb.route.loadPageViewPart(viewModel, "common.batch.BatchReportApp", {
                            msg: args.opName + "成功报告",
                            callBack: function (resultType){
                            if(cb.util.isFunction(resultCallBack)) resultCallBack(result);
                            },
                            msgDetails: result.data
                        });*/
                        }
                    })
                })
            }
        }
        checkBatchOp(model3d, args.opName, callBack)
    };
    this.loadDetailView = function(args, callBack) {
        if (!args) return;
        var pk = viewModel.getModel3D().getPkName();
        var id = args.id || args[pk] || args.row[pk];
        if (id == null) {
            cb.util.tipMessage("id为空了");
            return;
        };
        innerLoadDetailView(viewModel, {
            "mode": "view",
            "id": id,
            "pk": pk,
            "refreshCallback": this.refresh,
            "nodeInfo": args["nodeInfo"]
        });
        if (cb.util.isFunction(callBack)) callBack();
    };
    //加载到档案详情页
    function innerLoadDetailView(viewModel, params) {
        var symbol = viewModel.getSymbol();
        if (!symbol) return;
        cb.route.loadArchiveCurrentViewPart(viewModel, symbol + "App", params);
    };

    function getDetailParams(args) {
        var data, params;
        if (args && args.id) {
            data = {
                "id": args.id,
                "whereSql": " 1=1"
            }; //参数
        } else {
            params = cb.route.getViewPartParams(viewModel);
            if (!params) return;
            if (params.pk && viewModel.get(params.pk)) {
                data = {
                    "id": viewModel.get(params.pk).getValue(),
                    "whereSql": "1=1"
                };
            }
        };
        return data;
    };
    //验证用户在弹出框点击的是确定还是取消按钮
    function checkBatchOp(model3d, fun, callBack) {
        if (!model3d) {
            cb.console.error("modelsd无效！");
            return;
        };
        var selectedRows = model3d.getSelectedRows();
        if (!selectedRows.length) {
            cb.util.tipMessage("请选择要" + fun + "的单据");
            callBack(false);
        };
        //if(!confirm("确实要"+fun+"选中的 "+selectedRows.length+" 条单据吗？"))valid=false;
        cb.util.confirmMessage("确实要" + fun + "选中的 " + selectedRows.length + " 条单据吗？", function() {
            if (cb.util.isFunction(callBack)) callBack(true);
        }, function() {
            if (cb.util.isFunction(callBack)) callBack(false);
        });
    };
    //获取到用户要操作的数据 [ccuscode_pk:..., ts:...]
    function getBatchOpPara(model3d, fun, processRowData) {
        var ids = [];
        var selectedRows = model3d.getSelectedRows();
        var pk = model3d.getPkName();
        for (var i = 0; i < selectedRows.length; i++) {
            var row = selectedRows[i];
            if (processRowData) {
                processRowData(ids, row);
            } else {
                var id = row[pk];
                var ts = row.ts;
                var data = {};
                data[pk] = id;
                data['ts'] = ts;
                if (id && ts) ids.push(data);
            }
        }
        if (!ids.length) {
            cb.util.warningMessage("请选择要" + fun + "的有效单据！")
            return [];
        }
        var param = _this.options.getOperateFuncParam() ? _this.options.getOperateFuncParam()(ids) : ids;
        return param;
    };
    //状态设置
    this.setState = function(state) {
        viewModel.setState(state);
    };
    //处理结果
    this.handleResult = function(success, fail, args, callBack) {
        var opInfo = "";
        var result = {
            success: false
        };
        if (success) {
            result = {
                success: true,
                data: success
            };
            opInfo = "成功";
        };
        if (!fail && !success) {
            result = {
                success: true,
                data: success
            };
            opInfo = args.prev || args.next ? "" : "成功"
        };
        if (fail) {
            if (fail.error) {
                result = {
                    success: false,
                    error: fail.error
                };
                opInfo = "失败: " + fail.error;
            } else if (cb.isArray(fail) && fail[0].msgContent) {
                result = {
                    success: false,
                    error: fail[0].msgContent
                };
                opInfo = "失败: " + fail[0].msgContent;
            } else {
                result = {
                    success: false,
                    data: fail
                };
                opInfo = "失败: ";
            }
        };
        if (args && args.prompt) {
            if (fail) {
                cb.util.warningMessage(args.opName + opInfo, function() {
                    if (cb.util.isFunction(callBack)) callBack(result);
                });
            } else {
                cb.util.tipMessage(args.opName + opInfo, function() {
                    if (cb.util.isFunction(callBack)) callBack(result);
                });
            }
        } else {
            if (cb.util.isFunction(callBack)) callBack(result);
        };
        return result;
    };
    //传入参数默认值处理[默认有提示信息]
    function checkArgs(args) {
        args = args || {};
        args.prompt = args.prompt || true;
        return args;
    };
    //提示保存
    this.hintSave = function(recallBack) {
        cb.util.confirmMessage("你是否丢弃当前编辑数据", function() {
            recallBack(true)
        }, function() {
            recallBack(false)
        })
    };
    //获取结果
    function getResult(success, fail, args) {
        var opInfo = "";
        var result = null;
        if (success) {
            result = {
                success: true,
                data: success
            };
            opInfo = "成功";
        };
        if (fail) {
            if (fail.error) {
                result = {
                    success: false,
                    error: fail.error
                };
                opInfo = "失败" + fail.error;
            } else {
                result = {
                    success: false,
                    data: fail
                };
                opInfo = "失败";
            }
        };
        if (!fail && !success) {
            result = {
                success: true,
                data: success
            };
            opInfo = "成功"
        };
        if (args && args.prompt) {
            cb.util.tipMessage(args.opName + opInfo);
        }
        return result;
    };
};