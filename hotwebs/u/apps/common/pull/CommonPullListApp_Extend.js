/// <reference path="../../../common/js/Cube.js" />
/// <reference path="CommonPullListApp_L.js" />

var CommonPullListViewModel_Extend = {
    doAction: function (name, viewModel) {
        if (this[name])
            this[name](viewModel);
    },
    getViewModelParams: function (viewModel) {
        ///<param name='viewModel' type='CommonPullListViewModel'></param>
        var params;
        if (viewModel) {
            params = cb.route.getViewPartParams(viewModel);
        }
        return params;
    },
    init_Extend: function (viewModel) {
        var params = this.getViewModelParams(viewModel);
        if (params) {
	    if(params.queryString){
	        params.bd=params.queryString.bd;
	    }
            if (params.bd) {
                CommonPullListViewModel_Extend.bShowDialog = true;
                if (params.bd == '0') {
                    CommonPullListViewModel_Extend.bShowDialog = false;
                } else {
                    CommonPullListViewModel_Extend.bShowDialog = true;
                }
            }
        }
        var totaltable = viewModel.gettotaltable();
        var partbodytable = viewModel.getpartbodytable();
        var unSelectArray = new Array();
        for (var i = 0; i < totaltable.getTotalCount() ; i++) {
            unSelectArray.push(i);
        }
        //totaltable.unselect(unSelectArray);
        this.tableSwitch(viewModel, "partTable")
        partbodytable.setDataSource([]);
        // 加载查询方案
        /*cb.route.initViewPart(viewModel);
        var queryScheme = viewModel.getqueryScheme();
        queryScheme.setData({
            "mode": "slide",
            "fields": {
                "valueField": "queryschemeID",
                "textField": "name"
            }
        });
        var symbol = "u8.Dispatchlist";
        if (symbol != null) {
            var listCard = viewModel.getModel3D();
            var pageSize = listCard.getPageSize();
            var that = this;
            var params = { "loadDefaultData": true, "pageSize": pageSize };
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
                if (defaultSchemeID) listCard.set("querySchemeID", defaultSchemeID);
                var defaultSchemeData = success.defaultSchemeData;
                if (defaultSchemeData) {
                    defaultSchemeData.mode = "override";
                    listCard.setPageRows(defaultSchemeData);
                }
            });
        }*/

    },
    closeAction: function (viewModel, args) {
        cb.route.hidePageViewPart(viewModel);
    },
    queryScheme: function (viewModel, args) {
        // alert("页签事件"); modified by maliwen
       /* var symbol = viewModel.getSymbol();
        var params = this.getViewModelParams(viewModel);
        if (params.detailInfo) {
            params.srcBillType = params.detailInfo.srcBillType;
            params.targetBillType = params.detailInfo.targetBillType;
        }
        if (symbol != null) {
            if (args == 'schememanage') {
                cb.route.loadPageViewPart(viewModel, "common.commonscheme.SchemeListManage", { width: "450px", height: "550px" });
            }
            else {
                viewModel.execute("afterTabContentClick");
                var listCard = viewModel.getModel3D();
                listCard.set("querySchemeID", args.queryschemeID);//设置当前查询方案
                viewModel.getModel3D().setDataSource(cb.data.CommonProxy(symbol), "Query", { "querySchemeID": args && args.queryschemeID });
                // 根据查询方案查询
                if (window.typeFlag == "totalTable") { // 如果是拍平
                    var pks = [];
                    var dataColumns = {};
                    var table = viewModel.gettotaltable();

                    table.set("Fixed", true);
                    var symbol = viewModel.getSymbol();
                    if (symbol != null && params) {
                        cb.data.CommonProxy("UAP").QueryBill({
                            //"billType": "SA02",
                            "srcBillType": params.srcBillType,
                            "targetBillType": params.targetBillType,
                            "pks": pks,
                            "filters": params.filters,
                            "pageIndex": 1,
                            "pageSize": 10000,
                            "queryType": "2",
                            "haveColumn": "1",
                            "filters": null
                        }, function (success, fail) {
                            if (fail) {
                                alert("查询列表数据失败");
                                return;
                            }

                            CommonPullListViewModel_Extend.ChildParams = {};
                            CommonPullListViewModel_Extend.ChildParams.en = success['childEntityName'];
                            CommonPullListViewModel_Extend.ChildParams.fk = success['childForeignKey'];
                            CommonPullListViewModel_Extend.ColumnCode = success['columnCode'];
                            success.columns.forEach(function (col, colIndex, cols) {
                                dataColumns[col.fieldcode] = { "title": col.fieldname, "isVisible": col.showflag === true ? true : false };
                            });

                            table.set('primaryKey', success.meta.pk);
                            table.setColumns(dataColumns);
                            table.setDataSource(success.currentPageData);
                            CommonPullListViewModel_Extend.initSumData(viewModel, success.sumData);

                        });
                    } else {  // 主子表按方案查询
                        var table = viewModel.getpartheadtable();
                        var pks = [];
                        var dataColumns = {};
                        var symbol = viewModel.getSymbol();
                        if (symbol != null) {
                            cb.data.CommonProxy("UAP").QueryBill({
                                "srcBillType": params.srcBillType,
                                "targetBillType": params.targetBillType,
                                "pks": pks,
                                "pageIndex": 1,
                                "pageSize": 15,
                                "queryType": "1",
                                "haveColumn": "1",
                                "filters": null
                            }, function (success, fail) {
                                if (fail) {
                                    alert("查询列表数据失败");
                                    return;
                                }

                                success.columns.forEach(function (col, colIndex, cols) {
                                    dataColumns[col.fieldcode] = { "title": col.fieldname, "isVisible": col.showflag === true ? true : false };

                                });
                                CommonPullListViewModel_Extend.ColumnCode = success['columnCode'];
                                table.set('primaryKey', success.meta.pk);
                                table.setColumns(dataColumns);
                                table.setDataSource(success.currentPageData);

                            });
                        }
                    }
                }
            }
        }*/
    },

    // 展开查询条件
    /*expandAction: function (viewModel, args) {
        // alert("展开查询条件"); modified by maliwen
        cb.route.toggleViewPart(viewModel, cb.route.CommonAppEnum.QueryScheme, cb.route.ViewPartType.QueryScheme, { animation: { mode: "toggle" } });
    },*/

    // +触发事件
   /* addschemeAction: function (viewModel, args) {
        cb.route.loadPageViewPart(viewModel, "common.queryscheme.SchemeDetail", {width:"700px",height:"560px"});
    },*/

    tableSwitch: function (viewModel, args) {

        var params = this.getViewModelParams(viewModel);
        if (params.detailInfo) {
            params.srcBillType = params.detailInfo.srcBillType;
            params.targetBillType = params.detailInfo.targetBillType;
        }
	if (params.queryString) {
            params.srcBillType = params.queryString.srcBillType;
            params.targetBillType = params.queryString.targetBillType;
        }
        // 是拍平还是主子表
        window.typeFlag = args;
        if (args == "totalTable") {
            var pks = [];
            var dataColumns = {};
            var table = viewModel.gettotaltable();

            table.set("Fixed", true);
            var symbol = viewModel.getSymbol();
            if (symbol != null && params) {
                cb.data.CommonProxy("UAP").QueryBill({
                    //"billType": "SA02",
                    "srcBillType": params.srcBillType,
                    "targetBillType": params.targetBillType,
                    "pks": pks,
                    "filters": params.filters,
                    "pageIndex": 1,
                    "pageSize": 10000,
                    "queryType": "2",
                    "haveColumn": "1",
                    "filters": null
                }, function (success, fail) {
                    if (fail) {
                        alert("查询列表数据失败");
                        return;
                    }

                    CommonPullListViewModel_Extend.ChildParams = {};
                    CommonPullListViewModel_Extend.ChildParams.en = success['childEntityName'];
                    CommonPullListViewModel_Extend.ChildParams.fk = success['childForeignKey'];
                    CommonPullListViewModel_Extend.ColumnCode = success['columnCode'];
                    var readOnly = true;
                    table.setColumns(cb.data.commonCRUD(viewModel).convertToColumns(success.columns));
                    success.columns.forEach(function (col, colIndex, cols) {
                        if (col.editflag == true) {  // 如果是数量列和件数列可编辑
                            readOnly = false;
                           // dataColumns[col.fieldcode] = { "title": col.fieldname, "isVisible": col.showflag === true ? true : false, ReadOnly: false, editable: true };
                        } else {
                          //  dataColumns[col.fieldcode] = { "title": col.fieldname, "isVisible": col.showflag === true ? true : false, ReadOnly: true, editable: false };
                        }
                        
                    });

                    table.set('primaryKey', success.meta.pk);
                    //table.setColumns(dataColumns);
                    table.setDataSource(success.currentPageData);
                   // if (!readOnly) {
                        table.setReadOnly(false);
                   // }
                    CommonPullListViewModel_Extend.initSumData(viewModel, success.sumData);
                    
                });
            }
        }
        else {
            var table = viewModel.getpartheadtable();
            var pks = [];
            // 子表清空数据
            var partbodytable = viewModel.getpartbodytable();
            partbodytable.setDataSource([]);
            var dataColumns = {};
            var symbol = viewModel.getSymbol();
            if (symbol != null) {
                cb.data.CommonProxy("UAP").QueryBill({
                    "srcBillType": params.srcBillType,
                    "targetBillType": params.targetBillType,
                    "pks": pks,
                    "pageIndex": 1,
                    "pageSize": 15,
                    "queryType": "1",
                    "haveColumn": "1",
                    "filters": null
                }, function (success, fail) {
                    if (fail) {
                        alert("查询列表数据失败");
                        return;
                    }
                    // 用通用函数转换列属性
                    table.setColumns(cb.data.commonCRUD(viewModel).convertToColumns(success.columns));
                   /* success.columns.forEach(function (col, colIndex, cols) {
                        dataColumns[col.fieldcode] = { "title": col.fieldname, "isVisible": col.showflag === true ? true : false };

                    });*/
                    CommonPullListViewModel_Extend.ColumnCode = success['columnCode'];
                    table.set('primaryKey', success.meta.pk);
                   // table.setColumns(dataColumns);
                    table.setDataSource(success.currentPageData);
                    
                });
            }
        }
    },

    // 表体全选
    hitemAllClick: function (viewModel, args) {
         /// <param name="viewModel" type="CommonPullListViewModel">viewModel类型为CommonPullListViewModel</param>
        var params = this.getViewModelParams(viewModel);
        if (!params) { return alert("params is null"); }
        var pks = [];
        var head = viewModel.getpartheadtable();
        var hSelectedRows = head.getSelectedRows();

        if (!hSelectedRows || hSelectedRows.length <= 0) {
            viewModel.getpartbodytable().removeAll(); //viewModel.getpartbodytable().setPageRows([]);
            return;
        }
        var codelist = [];
        var pk = head.get("primaryKey");
        for (var i = 0; i < hSelectedRows.length; i++) {
            codelist.push({ code: pk, name: null, value: hSelectedRows[i][pk] });
        }

        var body = viewModel.getpartbodytable();
        var dataColumns = {};

        var symbol = viewModel.getSymbol();
        if (!symbol)
            return;
        var param = {
            "srcBillType": params.srcBillType,
            "targetBillType": params.targetBillType,
            "pks": pks,
            "pageIndex": 1,
            "pageSize": 15,
            "queryType": "1",
            "haveColumn": "1",
            "filters": codelist
        };
        cb.data.CommonProxy("UAP").QueryBill(param, function (success, fail) {
            if (fail) {
                return alert("查询列表数据失败");
            }
            CommonPullListViewModel_Extend.ChildParams = {};
            CommonPullListViewModel_Extend.ChildParams.en = success['childEntityName'];
            CommonPullListViewModel_Extend.ChildParams.fk = success['childForeignKey'];
            CommonPullListViewModel_Extend.ColumnCode = success['columnCode'];
            var readOnly = true;
            // 用通用函数转换列属性
            body.setColumns(cb.data.commonCRUD(viewModel).convertToColumns(success.columns));
            success.columns.forEach(function (col, colIndex, cols) {
                if (col.editflag == true) {  // 如果是数量列和件数列可编辑
                    readOnly = false;
                   // dataColumns[col.fieldcode] = { "title": col.fieldname, "isVisible": col.showflag === true ? true : false, ReadOnly: false, editable: true };
                } else {
                   // dataColumns[col.fieldcode] = { "title": col.fieldname, "isVisible": col.showflag === true ? true : false, ReadOnly: true, editable: false };
                }
                if (col.totalflag === true) {
                    CommonPullListViewModel_Extend.sumDatas[col.fieldcode] = { 'value': 0, 'columnVO': col };
                }
            });

            // body.setColumns(dataColumns);
            //if (!readOnly) {
                body.setReadOnly(false);
           // }
            body.setDataSource(success.currentPageData);

            // modified by maliwen
            CommonPullListViewModel_Extend.initSumData(viewModel, CommonPullListViewModel_Extend.sumDatas);
            for (var attr in success.sumData) {
                var value = parseInt(success.sumData[attr].value).toFixed(0);
                success.sumData[attr].value = value;
                viewModel.getsumList().set('itemData', success.sumData[attr]);
            }
        });
    },
    // 表体全不选
    unHitemAllClick: function (viewModel, args) {
        var partbodytable = viewModel.getpartbodytable();
        partbodytable.setDataSource([]);
    },
    hitemClick: function (viewModel, args) {
        /// <param name="viewModel" type="CommonPullListViewModel">viewModel类型为CommonPullListViewModel</param>
        var params = this.getViewModelParams(viewModel);
        if (!params) { return alert("params is null"); }
        var pks = [];
        var head = viewModel.getpartheadtable();
        var hSelectedRows = head.getSelectedRows();

        if (!hSelectedRows || hSelectedRows.length <= 0) {
            viewModel.getpartbodytable().removeAll(); //viewModel.getpartbodytable().setPageRows([]);
            return;
        }
        var codelist = [];
        var pk = head.get("primaryKey");
        for (var i = 0; i < hSelectedRows.length; i++) {
            codelist.push({ code: pk, name: null, value: hSelectedRows[i][pk] });
        }
        var body = viewModel.getpartbodytable();
        var dataColumns = {};

        var symbol = viewModel.getSymbol();
        if (!symbol)
            return;
        var param = {
            "srcBillType": params.srcBillType,
            "targetBillType": params.targetBillType,
            "pks": pks,
            "pageIndex": 1,
            "pageSize": 15,
            "queryType": "1",
            "haveColumn": "1",
            "filters": codelist
        };
        cb.data.CommonProxy("UAP").QueryBill(param, function (success, fail) {
            if (fail) {
                return alert("查询列表数据失败");
            }
            CommonPullListViewModel_Extend.ChildParams = {};
            CommonPullListViewModel_Extend.ChildParams.en = success['childEntityName'];
            CommonPullListViewModel_Extend.ChildParams.fk = success['childForeignKey'];
            CommonPullListViewModel_Extend.ColumnCode = success['columnCode'];
            var readOnly = true;
            // 用通用函数转换列属性
            body.setColumns(cb.data.commonCRUD(viewModel).convertToColumns(success.columns));
            success.columns.forEach(function (col, colIndex, cols) {
                if (col.editflag == true) {  // 如果是数量列和件数列可编辑
                    readOnly = false;
                   // dataColumns[col.fieldcode] = { "title": col.fieldname, "isVisible": col.showflag === true ? true : false, ReadOnly: false, editable: true };
                } else {
                  //  dataColumns[col.fieldcode] = { "title": col.fieldname, "isVisible": col.showflag === true ? true : false, ReadOnly: true, editable: false };
                }
                if (col.totalflag === true) {
                  CommonPullListViewModel_Extend.sumDatas[col.fieldcode] = { 'value': 0, 'columnVO': col };
                }
            });

           // body.setColumns(dataColumns);
           // if (!readOnly) {
                body.setReadOnly(false);
           // }
            body.setDataSource(success.currentPageData);

            // modified by maliwen
            CommonPullListViewModel_Extend.initSumData(viewModel, CommonPullListViewModel_Extend.sumDatas);
            for (var attr in success.sumData) {
                var value = parseInt(success.sumData[attr].value).toFixed(0);
                success.sumData[attr].value = value;
                viewModel.getsumList().set('itemData', success.sumData[attr]);
            }
        });
    },

    // cancel click getpartheadtable
    unHitemClick: function (viewModel, args) {

        var params = this.getViewModelParams(viewModel);
        if (!params) { return alert("params is null"); }
        var pks = [];
        var head = viewModel.getpartheadtable();
        var body = viewModel.getpartbodytable();
        var hSelectedRows = head.getSelectedRows();
        if (!hSelectedRows || hSelectedRows.length <= 0) {
            // calear bodygrid
            body.setDataSource([]);
            // reset
            for (var attr in CommonPullListViewModel_Extend.sumDatas) {
                viewModel.getsumList().set('itemData', CommonPullListViewModel_Extend.sumDatas[attr]);
            }
            return;
        }
        var codelist = [];
        var pk = head.get("primaryKey");
        for (var i = 0; i < hSelectedRows.length; i++) {
            codelist.push({ code: pk, name: null, value: hSelectedRows[i][pk] });
        }

        var dataColumns = {};
        var symbol = viewModel.getSymbol();
        if (!symbol)
            return;
        var param = {
            "srcBillType": params.srcBillType,
            "targetBillType": params.targetBillType,
            "pks": pks,
            "pageIndex": 1,
            "pageSize": 15,
            "queryType": "1",
            "haveColumn": "1",
            "filters": codelist
        };
        cb.data.CommonProxy("UAP").QueryBill(param, function (success, fail) {
            if (fail) {
                return alert("查询列表数据失败");
            }
            CommonPullListViewModel_Extend.ChildParams = {};
            CommonPullListViewModel_Extend.ChildParams.en = success['childEntityName'];
            CommonPullListViewModel_Extend.ChildParams.fk = success['childForeignKey'];
            CommonPullListViewModel_Extend.ColumnCode = success['columnCode'];
            var readOnly = true;
            // 用通用函数转换列属性
            body.setColumns(cb.data.commonCRUD(viewModel).convertToColumns(success.columns));
            success.columns.forEach(function (col, colIndex, cols) {
                if (col.editflag == true) {  // 如果是数量列和件数列可编辑
                    readOnly = false;
                   // dataColumns[col.fieldcode] = { "title": col.fieldname,dataType:'string', "isVisible": col.showflag === true ? true : false,ReadOnly: false, editable: true };
                } else {
                    dataColumns[col.fieldcode] = { "title": col.fieldname, dataType: 'string', "isVisible": col.showflag === true ? true : false, ReadOnly: true,editable: false };
                }
                if (col.totalflag === true) {
                  //  CommonPullListViewModel_Extend.sumDatas[col.fieldcode] = { 'value': 0, 'columnVO': col };
                }
            });

            body.set('primaryKey', success.meta.pk);
            body.set('pageable', true);
            body.set('pageSize', 30);
           // body.setColumns(dataColumns);
            //if (!readOnly) {
                body.setReadOnly(false);
           // }
            body.setDataSource(success.currentPageData);

            // modified by maliwen
            CommonPullListViewModel_Extend.initSumData(viewModel, CommonPullListViewModel_Extend.sumDatas);
            for (var attr in success.sumData) {
                var value = parseInt(success.sumData[attr].value).toFixed(0);
                success.sumData[attr].value = value;
                viewModel.getsumList().set('itemData', success.sumData[attr]);
            }
        });
    },

    bitemClick: function (viewModel, args) {

        // 获得表格数据
        var bodyHead = viewModel.getpartbodytable();

        // 获得选中行数据
        var bodySelectedRows = bodyHead.getSelectedRows();

        // 件数和
        var inumSum = 0;
        // 数量和
        var iQuntitySum = 0;

        // 获得选中行的件数和数量的总和
        for (var i = 0; i < bodySelectedRows.length; i++) {
            if (isNaN(bodySelectedRows[i]["inum"])) {
                inumSum = inumSum + 0;
            } else {
                inumSum = inumSum + parseInt(bodySelectedRows[i]["inum"]);
            }
            if (isNaN(bodySelectedRows[i]["iquantity"])) {
                iQuntitySum = iQuntitySum + 0;

            } else {
                iQuntitySum = iQuntitySum + parseInt(bodySelectedRows[i]["iquantity"]);
            }

        }

        // 给model赋值
        CommonPullListViewModel_Extend.initSumData(viewModel, CommonPullListViewModel_Extend.sumDatas);
        for (var attr in CommonPullListViewModel_Extend.sumDatas) {
            if (attr == "inum") {
                CommonPullListViewModel_Extend.sumDatas[attr].value = inumSum
            }
            else {
                CommonPullListViewModel_Extend.sumDatas[attr].value = iQuntitySum
            }

            viewModel.getsumList().set('itemData', CommonPullListViewModel_Extend.sumDatas[attr]);
        }

    },

    // cancel click getpartbodytable
    unBitemClick: function (viewModel, args) {

        // 获得表格数据
        var bodyHead = viewModel.getpartbodytable();

        // 获得选中行数据
        var bodySelectedRows = bodyHead.getSelectedRows();

        // 件数和
        var inumSum = 0;
        // 数量和
        var iQuntitySum = 0;

        // 获得选中行的件数和数量的总和
        for (var i = 0; i < bodySelectedRows.length; i++) {
            if (isNaN(bodySelectedRows[i]["inum"])) {

            } else {
                inumSum = inumSum + parseInt(bodySelectedRows[i]["inum"]);
            }
            if (isNaN(bodySelectedRows[i]["iquantity"])) {

            } else {
                iQuntitySum = iQuntitySum + parseInt(bodySelectedRows[i]["iquantity"]);
            }

        }

        // 给model赋值
        CommonPullListViewModel_Extend.initSumData(viewModel, CommonPullListViewModel_Extend.sumDatas);
        for (var attr in CommonPullListViewModel_Extend.sumDatas) {
            if (attr == "inum") {

                CommonPullListViewModel_Extend.sumDatas[attr].value = inumSum
            }
            else {
                CommonPullListViewModel_Extend.sumDatas[attr].value = iQuntitySum
            }

            viewModel.getsumList().set('itemData', CommonPullListViewModel_Extend.sumDatas[attr]);
        }

    },
  
    totalchangePage: function (viewModel, args) {
        var params = this.getViewModelParams();
        if (!params) { return alert("params is null"); }
        var table = viewModel.gettotaltable();
        var symbol = viewModel.getSymbol();
        if (symbol != null) {
            cb.data.CommonProxy("UAP").QueryBill({
                "srcBillType": params.srcBillType,
                "targetBillType": params.targetBillType,
                "pageIndex": args.pageIndex,
                "pageSize": args.pageSize,
                "filters": null
            }, function (success, fail) {
                if (fail) {
                    alert("查询列表数据失败");
                    return;
                }
                table.setPageRows(success);
            });
        }
    },
    partheadchangePage: function (viewModel, args) {
        var params = this.getViewModelParams(viewModel);
        if (!params) { return alert("params is null"); }
        var table = viewModel.getpartheadtable();
        var symbol = viewModel.getSymbol();
        if (symbol != null) {
            cb.data.CommonProxy("UAP").QueryBill({
                "srcBillType": params.srcBillType,
                "targetBillType": params.targetBillType,
                "pageIndex": args.pageIndex,
                "pageSize": args.pageSize,
                "queryType": "1",
                "haveColumn": args.pageIndex == 1 ? "1" : "0",
                "filters": null
            }, function (success, fail) {
                if (fail) {
                    alert("查询列表数据失败");
                    return;
                }
                //if (args.pageIndex == 1)
                //table.setColumns(success.columns);
                table.setPageRows(success);
            });
        }
    },
    /*partbodychangePage: function (viewModel, args) {
        var params = this.getViewModelParams(viewModel);
        if (!params) { return alert("params is null"); }
        var table = viewModel.getpartheadtable();
        var selectedRows = table.getSelectedRows();
        if (selectedRows.length > 0) {
            var codelist = new Array(selectedRows.length);
            var pk = table.get("primaryKey");
            for (var i = 0; i < selectedRows.length; i++) {
                var o = {};
                o.code = pk
                o.name = null;
                o.value = selectedRows[i][pk];
                codelist.push(o);
            }

            var symbol = viewModel.getSymbol();
            if (symbol != null) {
                var param = {
                    "srcBillType": params.srcBillType,
                    "targetBillType": params.targetBillType,
                    "pageIndex": args.pageIndex,
                    "pageSize": args.pageSize,
                    "queryType": "1",
                    "haveColumn": args.pageIndex == 1 ? "1" : "0",
                    "filters": codelist
                };

                cb.data.CommonProxy("UAP").QueryBill(param, function (success, fail) {
                    if (fail) {
                        alert("查询列表数据失败");
                        return;
                    }
                    //if (args.pageIndex == 1)
                    //    table.setColumns(success.columns);
                    table.setPageRows(success);
                });
            }
        }
    },*/
    setAction: function (viewModel, args) {
        cb.route.loadPageViewPart(viewModel, "common.commonscheme.SchemeListManage", { width: "450px", height: "550px" });
    },

    submitAction: function (viewModel, args) {

        var symbol = viewModel.getSymbol();
        if (symbol == null) return;

        var tableValue = viewModel.gettableSwitch().getValue();
        var param = {};
        // 拍平
        if (tableValue == "totalTable") {
            var selectedhtItem = viewModel.gettotaltable().getSelectedRows();
            param.columnCode = CommonPullListViewModel_Extend.ColumnCode;
            param.columnlevel = "0";
            param.srcChildTablePrimaryKey = CommonPullListViewModel_Extend.ChildParams['fk'];
            param.srcEntityChildPrimaryKey = CommonPullListViewModel_Extend.ChildParams['en'];
        }
        else {
            // 主子表
            var selectedhtItem = viewModel.getpartheadtable().getSelectedRows();
            var selectedbtItem = viewModel.getpartbodytable().getSelectedRows();
            for (var i = 0; i < selectedhtItem.length; i++) {
                var items = [];
                var id = selectedhtItem[i][viewModel.getpartheadtable().get('primaryKey')];
                selectedbtItem.each(function (item, i) {

                    if (CommonPullListViewModel_Extend.ChildParams) {
                        if (item[CommonPullListViewModel_Extend.ChildParams.fk] == id) {
                            items.push(item);
                        }
                    }
                });
                if (!items.length) {
                    alert('未选择表体数据！');
                    return;
                }
                if (CommonPullListViewModel_Extend.ChildParams)
                    selectedhtItem[i][CommonPullListViewModel_Extend.ChildParams.en] = items;
            }
        }
        param.srcBillVOs = selectedhtItem;
        param.srcBillType = cb.route.getViewPartParams(viewModel).srcBillType;
        param.targetBillType = cb.route.getViewPartParams(viewModel).targetBillType;

        // 是否卡片
        if (CommonPullListViewModel_Extend.bShowDialog) {

            // 卡片拍平
            if (tableValue == "totalTable") {
                viewModel.getProxy().BuildVOAndPull(param, function (success, fail) {
                    var str = '';
                    if (fail) {
                        alert("failed_totalTable");
                        str = CommonPullListViewModel_Extend.getErrorMsg(fail);
                        alert(str);
                        return;
                    }
                    // 对success进行处理
                    var obj = success;
                    var datas = new Array();
                    var deliveryDetail = cb.route.getViewPartParams(viewModel).parentViewModel;
                    var bodyName = deliveryDetail.getModel3D().getModelName();
                    // 将数据存储在数组里 先考虑一条数据
                    datas.push(obj[0][bodyName]);
                    // 删除数据
                    delete obj[0][bodyName];
                    var model3D = deliveryDetail.getModel3D();
                    // 先考虑一条数据
                    deliveryDetail.loadData(obj[0]);
                    // 清空原有数据
                    model3D.setDataSource([]);
                    // 填充grid
                    //TODO 未来要将此段代码重构出来
                    var lastrowno = 0;
                    for (var i = 0; i < datas[0].length; i++) {
                        var data = datas[0][i];
                        if (data.crowno) {
                            lastrowno = lastrowno + 10;
                            data.crowno = lastrowno;
                        }
                        model3D.insertRow(i, datas[0][i]);
                    }
                    cb.route.hidePageViewPart(viewModel);
                });
            }
            else {
                // 卡片主子表
                cb.data.CommonProxy(symbol).pullOrder(param, function (success, fail) {
                    var str = '';
                    if (fail) {
                        str = CommonPullListViewModel_Extend.getErrorMsg(fail);
                        alert(str);
                        return;
                    }

                    // 对success进行处理
                    var obj = success;
                    var datas = new Array();
                    var deliveryDetail = cb.route.getViewPartParams(viewModel).parentViewModel;
                    var bodyName = deliveryDetail.getModel3D().getModelName();
                    // 将数据存储在数组里 先考虑一条数据
                    datas.push(obj[0][bodyName]);
                    // 删除数据
                    delete obj[0][bodyName];
                    //var deliveryDetail = cb.route.getViewPartParams(viewModel).parentViewModel;
                    var model3D = deliveryDetail.getModel3D();
                    // 先考虑一条数据
                    deliveryDetail.loadData(obj[0]);
                    // 清空原有数据
                    model3D.setDataSource([]);
                    // 填充grid
                    //TODO 未来要将此段代码重构出来
                    var lastrowno = 0;
                    for (var i = 0; i < datas[0].length; i++) {
                        var data = datas[0][i];
                        if (data.crowno) {
                            lastrowno = lastrowno + 10;
                            data.crowno = lastrowno;
                        }
                        model3D.insertRow(i, datas[0][i]);
                    }
                    cb.route.hidePageViewPart(viewModel);
                });
            }


        }
        // d单独页面
        else {

            if (tableValue == "totalTable") {
                viewModel.getProxy().BuildVOPushSave(param, function (success, fail) {
                    var msg = '';
                    if (fail) {
                        msg = CommonPullListViewModel_Extend.getErrorMsg(fail);
                        alert(msg);
                        return;
                    } else {
                        alert("操作成功");
                    }
                });
            }
            else {
                viewModel.getProxy().PushSave(param, function (success, fail) {
                    var msg = '';
                    if (fail) {
                        msg = CommonPullListViewModel_Extend.getErrorMsg(fail);
                        alert(msg);
                        return;
                    } else {
                        alert("操作成功");
                    }
                });
            }
        }
    },
    cancelAction: function (viewModel, args) {
        cb.route.hidePageViewPart(viewModel);
    },
    ChildParams: undefined,
    ColumnCode: '',
    bShowDialog: true,
    initSumData: function (viewModel, args) {
        viewModel.getsumList().set('dataSource', args);
    },
    sumDatas: {},

    getErrorMsg: function (fail) {
        var msg = '';
        if (fail) {
            fail.forEach(function (error, errorIndex, errors) {
                msg = msg + "  " + error.msgContent;
            });
        }
        return msg;
    }
};
