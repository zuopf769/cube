var ColumnViewModel_Extend = {   
  
    doAction: function (name, viewModel) {
        if (this[name]) this[name](viewModel);
    },
    init_Extend: function (viewModel) {
        debugger;
        var columnSet = cb.route.getViewPartParams(viewModel);   
        // 全局变量，记录查询中选中的索引 add by maliwen
        window.clearIndex = -1;
        // 定义一个数组存储找到数据的索引
        window.searchIndexs = null;
        // 搜索框改变前的数据
        window.oldValue = null;
        var model3D = viewModel.getpk_entitycolumn_b();
        model3D.setReadOnly(false);
        if (!columnSet) return;
        this.columnCode = columnSet["columnCode"];
        if (columnSet["type"] == null) {
            this.type = "1";
        }else{
            this.type = columnSet["type"];
        }
        if (!this.columnCode) return;

        viewModel.getpk_entitycolumn_b().setColumns(viewModel.getColumns(this.type));
        viewModel.getpk_entitycolumn_b().setData({
            checks: {
                editable: function (rowIndex, field) {
                    if (field == "totalflag") {
                        var value = this.getCellValue(rowIndex, "fieldtype");
                        if (value !== "decimal") {
                            return false;
                        }
                    } 
                }
            }
        });
        this.queryData(viewModel, this.columnCode, function (success, fail) {
            if (fail) return;
            // 针对没有顺序号的数据填充顺序号
            //if (this.type == "0") {
                for (var i = 0; i < success.pk_entitycolumn_b.length; i++) {
                    success.pk_entitycolumn_b[i].showorder = (i+1).toString();
                    // 判断排序方式是否有值
                    if (success.pk_entitycolumn_b[i].filtertype == null) {
                        success.pk_entitycolumn_b[i].filtertype = "0";
                    }
                }
           // }
            viewModel.loadData(success);
        });
    },

    queryData: function (viewModel, columncode, callBack) {
        var options = { "columncode": columncode };
        viewModel.getProxy().getColumn(options, callBack);
    },
   

    cancelAction: function (viewModel) {
        try { cb.route.hidePageViewPart(viewModel); }
        catch (e) { }        
    },

    closeAction: function (viewModel) {
        try { cb.route.hidePageViewPart(viewModel); }
        catch (e) { }
    },

    submitAction: function (viewModel) {
        var data2 = viewModel.collectData();
        var that = this;
        data2.columnlevel = String(parseInt(viewModel.getcolumnlevel().getValue()) + 1);
        if (data2.columnlevel == 0 || data2.columnlevel == "0" || parseInt(data2.columnlevel) > 2) {
            data2.columnlevel = "1";
        }
        
        viewModel.getProxy().saveColumn(data2, function (sucess, fail) {
            if (fail) {
                cb.util.tipMessage("保存栏目失败。");
            }
            else {
                var columnSet = cb.route.getViewPartParams(viewModel);
                if (!columnSet) return;
                cb.route.renewApps();//update by fanjg
                columnSet.callBack(true, { columns: cb.data.commonCRUD(viewModel).convertToColumns(data2.pk_entitycolumn_b) });
                cb.util.tipMessage("保存栏目成功。");
                that.closeAction(viewModel)
                
            }
        });
        // 设定是否可编辑
        if (this.type == "1") {
            var parentModel = cb.route.getViewPartParams(viewModel).parentViewModel;
            var parentGrid = parentModel.getDispatchlistApp_List();
            for (var i = 0; i < data2.pk_entitycolumn_b.length; i++) {
                if (data2.pk_entitycolumn_b[i]["editflag"] == true) {
                    parentGrid.setReadOnly(false);
                }
            }
        } else {
            var parentModel = cb.route.getViewPartParams(viewModel).parentViewModel;
            var parentGrid = parentModel.getGrid();
            var RefreshAction = parentModel.getRefreshAction();
            RefreshAction.execute();
            // 获得grid里面的数据,进行排序
            var gridDataSort = parentGrid._dataSource;
            for (var i = 0; i < data2.pk_entitycolumn_b.length; i++) {
                if (data2.pk_entitycolumn_b[i]["editflag"] == true) {
                    parentGrid.setReadOnly(false);
                }
                // 进行排序
                /*if (data2.pk_entitycolumn_b[i]["filtertype"] == "1") {
                    gridDataSort = this.listSortBy(gridDataSort, data2.pk_entitycolumn_b[i]["fieldcode"], "asc")
                } else if (data2.pk_entitycolumn_b[i]["filtertype"] == "2") {
                    gridDataSort = this.listSortBy(gridDataSort, data2.pk_entitycolumn_b[i]["fieldcode"], "desc")
                }*/
            }
        }
    },  

    // 对数组对象按照某字段进行排序
    listSortBy:function(gridData,field,order){
        var refer = [], result = [], order = order == 'asc' ? 'asc' : 'desc', index;
        for (i = 0; i < gridData.length; i++) {
            refer[i] = gridData[i][field] + ':' + i;
        }
        refer.sort();
        if (order == 'desc') refer.reverse();
        for (i = 0; i < refer.length; i++) {
            index = refer[i].split(':')[1];
            result[i] = gridData[index];
        }
        return result;
    },
    upAction: function (viewModel) {
        // 获得模型
        var model3D = viewModel.getpk_entitycolumn_b();
        // 获取选中行的数据
        var rows = model3D.getPageSelectedRows();
        if (rows.length == 1) {
            model3D.setReadOnly(false);
            var row = rows && rows[0];
            if (row) {
                // 获得行索引
                var indexs = model3D.getPageSelectedIndexs(row);
                
                // 如果是第一行返回
                if (indexs[0] == 0) {
                    alert("已经在第一行");
                    return;
                }
                // 改变顺序号
                row["showorder"] = indexs[0];
                // 删除当前数据
                model3D.deleteRows(indexs);
                // 插入数据
                model3D.insertRow(indexs[0]-1, row);
                // 选中数据
                model3D.select([indexs[0] - 1]);

                // 获得下一行的数据 主要是为了改变顺序号
                var nextRow = model3D._getRowsByIndexs(indexs);
                nextRow[0]["showorder"] = indexs[0] + 1;
                model3D.deleteRows(indexs);
                model3D.insertRow(indexs[0] , nextRow[0]);
            }
        } else {
            alert("请选中一条数据");
            return;
        }
    },

    // 查找
    searchClick: function (viewModel, args) {
      
        // 获得搜索框的值
        var searchValue = args;
        // 判断搜索框有否有输入的值
        if (searchValue == null) {
            alert("请输入查询条件");
            return;
        }
        // 获得grid模型
        var model3D = viewModel.getpk_entitycolumn_b();
        if (window.clearIndex != -1) {
            viewModel.getModel3D().unselect(window.clearIndex);
        }
        // 说明是页面第一次加载
        if (window.oldValue == null) {
            //window.oldValue = searchValue;
        }
        // 如果搜索框里的数据与之前搜索框的数据不同
        if (searchValue != window.oldValue) {
            searchIndexs = new Array();
            // 循环查找
            for (var i = 0; i < model3D.getRows().length; i++) {
                // 获得栏目名称列的值
                cellValue = viewModel.getModel3D().getCellValue(i, "fieldname");
                if (cellValue.indexOf(searchValue) >= 0) {
                    // 将匹配行的索引放入到searchIndexs数组中
                    searchIndexs.push(i);
                }
            }
            if (searchIndexs.length > 0) {
                // 赋clearIndex值
                searchIndex = searchIndexs.shift();
                window.clearIndex = searchIndex;
                // 选中记录
                viewModel.getModel3D().select(searchIndex);
                // 把当前页的rowIndex设为焦点行
                model3D.setFocusedIndex(searchIndex);
                if (searchIndexs.length == 0) {
                    alert("符合条件的一共1条记录,顺序号为" + (parseInt(searchIndex) + 1) + "查询完毕");
                    window.oldValue = searchValue;
                    return;
                } else {
                    alert("符合条件的一共" + (parseInt(searchIndexs.length) + 1) + "条记录，请点击按钮查找下一条数据");
                    window.oldValue = searchValue;
                }
            } else {
                alert("没有符合的记录");
                return;
            }

        } else { // 如果搜索框数据没有改变就不用搜索直接用searchIndexs保存的结果

            if (searchIndexs.length > 0) {
                // 赋clearIndex值
                searchIndex = searchIndexs.shift();
                window.clearIndex = searchIndex;
                // 选中记录
                viewModel.getModel3D().select(searchIndex);
                // 把当前页的rowIndex设为焦点行
                model3D.setFocusedIndex(searchIndex);
                alert("此数据顺序号为：" + (parseInt(searchIndex) + 1) + "，请点击按钮查看下一条数据");
            } else {
                // 选中最后一条记录
                viewModel.getModel3D().select(searchIndex);
                alert("查找完毕");
            }

        }

    },
   
    downAction: function (viewModel) {
        // 获得模型
        var model3D = viewModel.getpk_entitycolumn_b();
        // 获取选中行数据
        var rows = model3D.getPageSelectedRows();
        if (rows.length == 1) {
            model3D.setReadOnly(false);
            // 先考虑第一行数据
            var row = rows && rows[0];
            if (row) {
                // 获得行索引
                var indexs = model3D.getPageSelectedIndexs(row);
                // 判断是否最后一行
                if (indexs[0] >= model3D.getTotalCount() - 1) {
                    alert("已经在最后一行");
                    return;
                }
                row["showorder"] = indexs[0] + 2;
                // 删除当前数据
                model3D.deleteRows(indexs);
                model3D.unselect(indexs);
                // 插入数据
                model3D.insertRow(indexs[0]+1, row);
                // 把当前页的rowIndex设为焦点行
                model3D.setFocusedIndex(indexs[0]+1);
                // 选中数据
                model3D.select([indexs[0]+1]);

                // 获得上一行的数据 主要是为了改变顺序号
                var nextRow = model3D._getRowsByIndexs(indexs);
                nextRow[0]["showorder"] = indexs[0]+1;
                model3D.deleteRows(indexs);
                model3D.insertRow(indexs[0], nextRow[0]);
            }
        } else {
            alert("请选中一条数据");
            return;
        }
    },

    topAction: function (viewModel) {
        // 获得模型
        var model3D = viewModel.getpk_entitycolumn_b();
        // 获取选中行数据
        var rows = model3D.getPageSelectedRows();
        if (rows.length == 1) {
            model3D.setReadOnly(false);
            // 先考虑第一行数据
            var row = rows && rows[0];
            if (row) {
                // 获得行索引
                var indexs = model3D.getPageSelectedIndexs(row);
                // 判断是否最后一行
                if (indexs[0] == 0) {
                    alert("已经在最顶端");
                    return;
                }
                model3D.unselect(indexs);
                row["showorder"] = 1;
                // 删除当前数据
                model3D.deleteRows(indexs);
                rows = model3D.getSelectedRows();
                // 插入数据到首行
                model3D.insertRow(0, row);
                // 把当前页的rowIndex设为焦点行
                model3D.setFocusedIndex(0);
                // 选中数据
                model3D.select([0]);
                // 移动最顶端与之间的数据
                // 获得要移动数据的序号
                var changeOrderArray = new Array();
                var changeOrderIndex = indexs[0];
                // 获得要移动数据的索引
                for (var i = 1; i < changeOrderIndex+1 ; i++) {
                    changeOrderArray.push(i);
                }
                // 获取移动的数据
                var changeData = model3D._getRowsByIndexs(changeOrderArray);
                // 删除数据
                model3D.deleteRows(changeOrderArray);
                for (var k = 0; k < changeData.length; k++) {
                    changeData[k]["showorder"] = changeOrderArray[k] + 1;
                    model3D.insertRow(changeOrderArray[k], changeData[k]);
                }

            }
        } else {
            alert("请选中一条数据");
            return;
        }
    },
    bottomAction: function (viewModel) {
        // 获得模型
        var model3D = viewModel.getpk_entitycolumn_b();
        // 获取选中行数据
        var rows = model3D.getPageSelectedRows();
        var rowLength = model3D.getTotalCount();
        if (rows.length == 1) {
            model3D.setReadOnly(false);
            // 先考虑第一行数据
            var row = rows && rows[0];
            if (row) {
                // 获得行索引
                var indexs = model3D.getPageSelectedIndexs(row);
                // 判断是否最后一行
                if (indexs[0] >= model3D.getRows().length - 1) {
                    alert("已经在最底端");
                    return;
                }
                row["showorder"] = rowLength;
                model3D.unselect(indexs); 
                // 删除当前数据
                model3D.deleteRows(indexs);
                // 插入最后一行数据
                model3D.insertRow(rowLength - 1, row);
                // 选中最后一行数据
                model3D.select([rowLength - 1]);
                // 移动最底端与之间的数据
                // 获得要移动数据的序号
                var changeOrderArray = new Array();
                var changeOrderIndex = indexs[0];

                // 获得要移动数据的索引
                for (var i = changeOrderIndex; i < rowLength - 1 ; i++) {
                    changeOrderArray.push(i);
                }
                var copyChangeOrderArray = changeOrderArray;
                // 获取移动的数据
                var changeData = model3D._getRowsByIndexs(changeOrderArray);
                // 删除数据
                model3D.deleteRows(changeOrderArray);
                for (var k = 0; k < changeData.length; k++) {
                    changeData[k]["showorder"] = copyChangeOrderArray[k] + 1;
                    model3D.insertRow(copyChangeOrderArray[k], changeData[k]);
                }
            }
        } else {
            alert("请选中一条数据");
            return;
        }
    },

    // 列值修改前验证
    beforeCellValueChange: function (viewModel, args) {
        // 对列序号修改前的验证
        var model3D = viewModel.getpk_entitycolumn_b();
        var re = /^[1-9]+[0-9]*]*$/;
        if (args) {
            if (args.field != "showorder") {
                return;
            } else {
                if (args.value > model3D.getTotalCount() || args.value < 0 || args.value == 0 || !re.test(args.value)) {
                    alert("所输入的行号必须为正整数且小于总行数");
                    // 获得修改前的数据
                    var beforeChangeRowContent = model3D._getRowsByIndexs([args.index]);
                    // 还原修改前的顺序号
                    beforeChangeRowContent[0]["showorder"] = args.oldValue;
                    args.value = args.oldValue;
                    // 删除数据
                    model3D.deleteRows([args.index]);
                    // 插入数据
                    model3D.insertRow(args.index, beforeChangeRowContent[0]);
                    return;
                }
            }
        }

    },
    // 修改列值
    bCellValueChange: function (viewModel, args) {
        var model3D = viewModel.getpk_entitycolumn_b();
        var re = /^[1-9]+[0-9]*]*$/;
        if (args) {
            if (args.field != "showorder") {
                return;
            } else {
                if (args.value > model3D.getTotalCount() || args.value < 0 || args.value == 0 || !re.test(args.value)) {
                    alert("所输入的行号必须为正整数且小于总行数");
                    return;
                } else {
                    if (args.value == args.oldValue) {
                        alert("顺序号没有变");
                        return;
                    } else {
                        model3D.setReadOnly(false);
                        // 获取修改序号的数据
                        var oldRowContent = model3D._getRowsByIndexs([args.index]);
                        // 删除数据
                        model3D.deleteRows([args.index]);
                        // 增加数据
                        model3D.insertRow(args.value - 1, oldRowContent[0]);
                        // 获得要移动数据的序号
                        var changeOrderArray = new Array();
                        var changeOrderIndex = args.index;
                        var changeShowOrder = args.oldValue;
                        if (args.value > args.oldValue) {
                            for (var i = 0; i < Math.abs(args.value - args.oldValue) ; i++) {
                                changeOrderArray.push(changeOrderIndex);
                                //model3D.setCellValue(changeOrderIndex, "showorder", changeShowOrder);
                                changeShowOrder++;
                                changeOrderIndex++;
                            }
                        } else {
                            for (var i = 0; i < Math.abs(args.value - args.oldValue) ; i++) {
                                changeOrderArray.push(changeOrderIndex);
                                //model3D.setCellValue(changeOrderIndex, "showorder", changeShowOrder);
                                changeShowOrder--;
                                changeOrderIndex--;
                            }
                        }

                        // 获取移动的数据
                        var changeData = model3D._getRowsByIndexs(changeOrderArray);
                        // 删除数据
                        model3D.deleteRows(changeOrderArray);
                        for (var k = 0; k < changeData.length; k++) {
                            if (args.value > args.oldValue) {
                                changeData[k]["showorder"] = changeOrderArray[k] + 1;
                                model3D.insertRow(changeOrderArray[k], changeData[k]);
                            } else {
                                changeData[k]["showorder"] = changeOrderArray[changeOrderArray.length - k - 1] + 1;
                                model3D.insertRow(changeOrderArray[changeOrderArray.length - k - 1], changeData[k]);
                            }
                        }
                    }
                }
            }
        }
    },
    
    // 调用恢复默认设置接口
     queryInitData: function (viewModel, columncode, callBack) {
        var options = { "columncode": columncode };
        viewModel.getProxy().restoreColumn(options, callBack);
     },

    // 恢复默认设置触发
    restoreAction: function (viewModel) {
       
        var columnSet = cb.route.getViewPartParams(viewModel);
        var model3D = viewModel.getpk_entitycolumn_b();
        model3D.setReadOnly(false);
        if (!columnSet) return;
        // 获得栏目code
        this.columnCode = columnSet["columnCode"];
        if (columnSet["type"] == null) {
            this.type = "1";
        } else {
            this.type = columnSet["type"];
        }
        if (!this.columnCode) return;
        viewModel.getpk_entitycolumn_b().setColumns(viewModel.getColumns(this.type));
        // 获得默认
        this.queryInitData(viewModel, this.columnCode, function (success, fail) {
            if (fail) return;
            // 针对没有顺序号的数据填充顺序号
            //if (this.type == "0") {
                for (var i = 0; i < success.pk_entitycolumn_b.length; i++) {
                    success.pk_entitycolumn_b[i].showorder = i + 1;
                }
           // }
            viewModel.loadData(success);
            alert("恢复成功");
        });
      // cb.route.loadPageViewPart(viewModel, "common.customerdetail.CustomerDetail", { width: "700px", height: "560px" });
    },
};