cb.data.commonCatalogs = function (viewModel) {

    this.symbol = viewModel.getSymbol();

    this._interfaceFields = ["pk_group", "pk_org", "creator", "creationtime", "modifier", "modifiedtime"];
    this.loadDefaultValue = function (interfaceField) {
        if (!interfaceField) {
            cb.each(this._interfaceFields, function (item) {
                loadDefaultItemValue(item);
            });
        } else {
            loadDefaultItemValue(interfaceField);
        }
    };
    var loadDefaultItemValue = function (interfaceField) {
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

    var _this = this;

    //卡片的编辑
    this.edit = function (args) {
        if (viewModel.beforeExecute("edit")) {
            _this.setState("edit");
            viewModel.setReadOnly(false);
            this.loadDefaultValue("modifier");
            this.loadDefaultValue("modifiedtime");
            viewModel.afterExecute("edit");
        };
    };

    //卡片删除
    this.delete = function (args) {
        args = this.checkArgs(args);
        var params = {};
        var datum = viewModel.collectData(true);
        var data = cb.route.getViewPartParams(viewModel);
        var pkName = viewModel.getPkName();
        var tsName = viewModel.getTsName();
        params[pkName] = datum[pkName];
        params[tsName] = datum[tsName];
        if (!params[pkName] || !params[tsName]) return this;
        if(viewModel.beforeExecute("delete", params)){
            var confirmCallBack = function (){
                var callBack = function (success, fail) {
                    args.opName = "删除";
                    var result = _this.handleResult(success, fail, args, function (result) {
                        if (cb.util.isFunction(resultCallBack)) resultCallBack(result);
                    });
                };
                var resultCallBack = function (result) {
                    if (result.success) {
                        viewModel.newRecord();
                        viewModel.setReadOnly(true);
                        _this.setState("browse");
                        _this.refresh();
                        viewModel.setDirty(false);
                        viewModel.afterExecute("delete", result.success);
                    }
                }
                cb.data.CommonProxy(_this.symbol).Delete(params, callBack);
            };
            var msg = "你真的确定要删除吗？\n\n 请确认";
            cb.util.confirmMessage(msg, function (){
                confirmCallBack();
            }, null, _this)
        }
    };

    //卡片取消
    this.cancel = function () {
        var callBack = function (ok){
            if(!ok) return;
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

        if(viewModel.isDirty()){
            _this.hintSave(callBack)
        }else{
            callBack(true);
        }
    };

    //卡片保存
    this.save = function (args) {
        args = this.checkArgs(args);
        var inputParams = cb.route.getViewPartParams(viewModel);
        if (!viewModel.validate() || !_this.symbol || inputParams.mode) return;
        var params = viewModel.collectData(true);
        var pkName = viewModel.getPkName();
        var pk = params[pkName];
        params.state = pk ? 1 : 2;
        if(viewModel.beforeExecute("save"), params){
            var callBack = function (success, fail) {
                args.opName = "保存";
                var result = _this.handleResult(success, fail, args, function (result) {
                    if (cb.util.isFunction(resultCallBack)) resultCallBack(result);
                });
            };
            var resultCallBack = function (result) {
                if (result.success) {
                    //兼容返回结果可能出现的数组和json两中情况。
                    var data = cb.isArray(result.data) ? result.data : [result.data];
                    data = cb.extend(params , data[0] );
                    //重新刷新界面数据
                    viewModel.loadData(data);
                    _this.setState("browse");
                    viewModel.setReadOnly(true);
                    _this.refresh();
                    viewModel.afterExecute("save", data)
                };
            };
            cb.data.CommonProxy(_this.symbol).Save(params, callBack);
        };
    };

    //卡片增加
    this.add = function (args) {
        debugger;
        viewModel.cancelValidate();
        if (!_this.symbol) return;
        if (viewModel.beforeExecute("add", args)) {
            viewModel.newRecord();
            this.loadDefaultValue();
            viewModel.setReadOnly(false);
            _this.setState("add");
            viewModel.afterExecute("add", args);
        };
    };

    //公共方法：栏目设置start---------------------------
    this.config = function (args) {
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
        };
    };
    //公开方法
    //显示栏目设置界面
    //params: columnCode 栏目编码，type 0 参照， 1 档案
    //提供前后事件
    this.showColumn = function (columnCode, type, callBack) {
        //弹出参照界面
        if (viewModel.getReadOnly() || viewModel.getDisabled()) return;
        columnCode = columnCode || null;
        cb.route.loadPageViewPart(viewModel, "common.col.ColumnApp", {
            columnCode: columnCode,
            type: type,
            callBack: function (refresh, data) {
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
    this.setAutoWrap = function () {
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
    this.showSubTotal = function () {
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
    this.showCombineTotal = function () {
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
        } else if (status == '1') {

        };
        //cb.util.tipMessage("列表字号设置成功");
    };
    //刷新
    this.refresh = function (args) {
        _this.treeRefresh(args);
    };
    //公共方法：定位
    this.position = function (args) {
        cb.util.tipMessage("功能开发中。。。");
    };
    //回写传入参数映射
    this.mapping = function (args) {
        //
    };
    //复制当前信息
    this.copy = function (args){
        viewModel.cancelValidate();
        var data = viewModel.collectData();
        var pkName = viewModel.getPkName();
        data[pkName]= "";
        if(viewModel.beforeExecute("copy", args)){
            cb.model.PropertyChange.delayPropertyChange(true);
            viewModel.loadData(data);
            _this.setState("add");
            viewModel.setReadOnly(false);
            viewModel.setDataState(cb.model.DataState.Add);
            viewModel.afterExecute("copy");
            cb.model.PropertyChange.doPropertyChange();
        }
    }

    //公共方法：栏目设置end---------------------------------------
    //树点击
    //提供树点击回调方法
    this.treeClick = function (args) {
        viewModel.cancelValidate();
        if (!_this.symbol) return;
        args = _this.checkArgs(args);
        if(viewModel.beforeExecute("treeClick", args)){
            var recallBack = function (ok){
                //viewModel.clear(true);
                if(!ok) return;
                var callBack = function (success, fail) {
                    args.opName = "读取数据";
                    if (!success && !fail || success) args.prompt = false;
                    var result = _this.handleResult(success, fail, args, function (result) {
                        if (cb.util.isFunction(resultCallBack)) resultCallBack(result);
                    });
                };
                var resultCallBack = function (result) {
                    if (result.success) {
                        cb.model.PropertyChange.delayPropertyChange(true);
                        //加载卡片数据
                        viewModel.loadData(result.data);
                        _this.setState("browse")
                        viewModel.setReadOnly(true);
                        cb.model.PropertyChange.doPropertyChange();
                    };
                    viewModel.afterExecute("treeClick", result.data);
                };
                cb.data.CommonProxy(_this.symbol).QueryByPK({ id: args.id }, callBack);
            };
            if(viewModel.isDirty()){
                _this.hintSave(recallBack);
            }else{
                recallBack(true);
            };
        }

    };

    function isLastTreeNode(args){
        if(!args.children.length){
            return true;
        };
        return false;
    };

    this.treeMoreClick = function () {
        //alert("catalogMoreClick功能开发中。。。");
    };

    this.treeBeforeExpand = function () {
        //alert("catalogBeforeExpand功能开发中。。。");
    };
    //树刷新nodeCode, pageSize, pageIndex
    this.treeRefresh = function (data) {
        var treeModel = viewModel.getModel2D();
        var treeFunctionId = treeModel.get("treeFunctionId");
        var iteration = function (items) {
            cb.each(items, function (item) {
                delete item.parent;
                if (item.children.length) iteration(item.children);
            });
        };
        var callBack = function (success, fail) {
            var args = { prompt: false };
            if (fail) args.prompt = true;
            args.opName = "查询树控件";
            var result = _this.handleResult(success, fail, args, function (result) {
                if (cb.util.isFunction(resultCallBack)) resultCallBack(result);
            });
        };
        var resultCallBack = function (result) {
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
            "pageType":0
        }
        data = cb.extend(defaultParams, data);
        if (_this.symbol && treeModel && treeFunctionId) {
            cb.data.CommonProxy("UAP").QueryTree(data, callBack)
        }
    };

    //检查是否需要弹出对应的信息[默认弹出]
    this.checkArgs = function (args) {
        args = args || {};
        args.prompt = true;
        return args;
    };

    //处理后台返回结果
    this.handleResult = function (success, fail, args, callBack) {
        var opInfo = "";
        var result = { success: false };
        if (success) {
            result = { success: true, data: success };
            opInfo = "成功";
        };
        if (!fail && !success) {
            result = { success: true, data: success };
            opInfo = args.prev || args.next ? "" : "成功"
        };
        if (fail) {
            if (fail.error) {
                result = { success: false, error: fail.error };
                opInfo = "失败：" + fail.error;
            } else {
                result = { success: false, data: fail };
                opInfo = "失败";
            }
        };
        if (args && args.prompt) {
            if (fail) {
                cb.util.warningMessage(args.opName + opInfo, function () {
                    if (cb.util.isFunction(callBack)) callBack(result);
                });
            } else {
                cb.util.tipMessage(args.opName + opInfo, function () {
                    if (cb.util.isFunction(callBack)) callBack(result);
                });
            }
        } else {
            if (cb.util.isFunction(callBack)) callBack(result);
        };
        return result;
    };

    //档案列表公共方法：增行
    this.addLine = function (args, selfModel) {
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

    //公共方法:插行
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

    //-----------------------------------优美分割--------------------------------------------

    // 获取返回结果
    /*function getResult( success, fail, args){
    var opInfo= "";
    var result= null;
    if(success){
    result= {success: true, data: success};
    opInfo="成功";
    };

    if(fail){
    if(fail.error){
    result= {success: false, error: fail.error};
    opInfo= "失败"+fail.error;
    }else{
    result= {success: false, data: fail};
    opInfo= "失败";
    };
    };

    if(args && args.prompt){
    alert(args.opName+ opInfo);
    };
    return result;
    };*/

    //设置状态("add", "browse", "edit")
    this.setState = function (state) {
        viewModel.setState(state);
    }

    //提示保存
    this.hintSave = function (recallBack) {
        cb.util.confirmMessage("你是否丢弃当前编辑数据", function () { recallBack(true) }, function () { recallBack(false) })
    };

    /*
    * 公开方法：处理编码规则
    * 参数1：rule 编码规则
    * 返回值：处理后的编码规则
    */
    this.showRule = function (rule) {
        var rules = {"rule": rule}
        if (!rule || rule === true) return;
        rule = rule.split('/');
        var data = "例如: ";

        for (var i = 0; i < rule.length; i++) {
            var temp1 = "0";
            var num = rule[i] - 1;
            for (var j = 0; j < num - 1; j++) {
                temp1 += "0";
            };
            temp1 += "1"
            rule[i] = temp1;
        };

        var temp2 = rule[0];
        data += 1 + "级编码: " + temp2 + "。";
        for (var i = 1; i < rule.length; i++) {
            temp2 += rule[i];
            data += i + 1 + "级编码: " + temp2 + "。";
        };
        rules.data = data;
        return rules;
    };

    /*
    * 公开方法：1.获取客户输入编码的父节点; 2.校验客户输入编码是否符合规则;
    * 参数1：rule 编码规则
    * 参数2：code 要处理的code
    * 返回值：编码父节点
    */
    this.getParentCode = this.handleRule = function (rule, code) {
        if (!code || !rule) return;
        code = _this.trim(code);
        /*var re =/^\d+$/;
        if(!re.test(code)){
        cb.util.tipMessage("编码只能为数字，请重新输入！");
        return '';
        };*/
        rule = rule.split('/');
        var temp = '';
        var surplus = code;
        var num = 0;
        for (var i = 0; i < rule.length; i++) {
            var iLen = rule[i];
            if (surplus.length < iLen) {
                cb.util.tipMessage("你输入的规则不合法,请重新输入！");
                return '';
            } else if (surplus.length == iLen) {
                return temp;
            } else {
                temp += code.slice(num, num + parseInt(iLen));
                surplus = code.slice(num + parseInt(iLen))
                num += parseInt(iLen);
            }
        };
    };

    this.trim = function (obj) {
        return obj.replace(/^\s+|\s+$/g, '');
    };

};