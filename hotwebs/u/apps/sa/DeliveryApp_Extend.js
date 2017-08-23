/// <reference path="../../common/js/Cube.js" />
/// <reference path="DeliveryApp_M.js" />

var DeliveryViewModel_Extend = {
    doAction: function (name, viewModel) {
        if (this[name])
            this[name](viewModel);
    },
    loadDetailView: function (viewModel, params) {
        var symbol = viewModel.getSymbol();
        if (!symbol) return;
        cb.route.loadArchiveViewPart(viewModel, symbol + "DetailApp", params);
    },
    loadDetailTabView: function (viewModel, params) {
        var symbol = viewModel.getSymbol();
        if (!symbol) return;
        cb.route.loadTabViewPart(viewModel, symbol + "DetailApp", params);
    },
    menuItemClick: function (viewModel, args) {
        if (!args || !args.type || !args.data || !args.data.appId) return;
        var url = args.data.appId;
        if (url === "homepage") location.href = cb.route.getHomepageUrl();
        else location.href = cb.route.getPageUrl(url);
    },
    cardAction: function (viewModel) {
        this.loadDetailView(viewModel, { "mode": "add" });
    },

    //pageIndex":"1","pageSize":"15","querySchemeID":"1001ZZ10000000003LMR","filters":null,"SA02","reloadColumn":"Y"
    queryData: function (viewModel, pageSize, pageIndex, querySchemeID, filters, reloadColumn, mode) {
        var symbol = viewModel.getSymbol();
        if (null != symbol) {
            var listCard = viewModel.getModel3D();
            var columnCode = viewModel.get("columnCode") || "SA02"

            cb.data.CommonProxy(symbol).Query({
                "querySchemeID": querySchemeID,
                "pageSize": pageSize,
                "pageIndex": pageIndex,
                "filters": filters,
                "columnCode": columnCode,
                "reloadColumn": reloadColumn
            }, function (success, fail) {
                if (fail) {
                    alert("查询列表数据失败");
                    return;
                }
                success.mode = mode;
                listCard.setPageRows(success);
            });
        }
    },

    queryScheme: function (viewModel, args) {
        if (typeof args != 'object') {
            cb.route.loadPageViewPart(viewModel, "common.commonscheme.SchemeListManage", {width:"500px",height:"600px"});
            return;
        }
        var symbol = viewModel.getSymbol();
        if (symbol != null) {
            var listCard = viewModel.getModel3D();
            var querySchemeID = args && args.queryschemeID;
            listCard.set("querySchemeID", querySchemeID);
            var pageSize = listCard.getPageSize();
            var pageIndex = 1;
            cb.data.CommonProxy(symbol).Query({
                "querySchemeID": querySchemeID,
                "pageSize": pageSize,
                "pageIndex": pageIndex
            }, function (success, fail) {
                if (fail) {
                    alert("查询列表数据失败");
                    return;
                }
                success.mode = "override";
                listCard.setPageRows(success);
            });
            if(viewModel.querySchemeModel)
            {
                viewModel.querySchemeModel.initData();
            }
        }
    },
    searchAction: function (viewModel, args) {
        alert("搜索" + args + "...");
    },
    queryAction: function (viewModel) {
        viewModel.loadViewPart("common.commonscheme.CommonSchemeApp_L", ".query-scheme");
    },
    expandAction: function (viewModel) {
         cb.route.toggleViewPart(viewModel, cb.route.CommonAppEnum.QueryScheme, cb.route.ViewPartType.QueryScheme, { animation: { mode: "toggle"} });
                //cb.route.loadPageViewPart(viewModel, "common.commonScheme.CommonScheme");
    },
    timeItemClick: function (viewModel, args) {
        if (args && args.title) alert(args.title);
    },
    itemClick: function (viewModel, args) {
        /// <param name="viewModel" type="DeliveryViewModel">viewModel类型为DeliveryViewModel</param>
        if (!args || !args.type || !args.data) return;
        var pk = viewModel.getModel3D().getPkName();
        var id = args.data[pk];
        if (id == null) {
            alert("id为空");
            return;
        }
        switch (args.type) {
            case "submit":
                alert("提交" + id);
                break;
            case "interest":
                alert("关注" + id);
                break;
            case "copy":
                alert("复制" + id);
                break;
            case "edit":
                alert("修改" + id);
                break;
            case "delete":
                alert("删除" + id);
                break;
            default:
                this.loadDetailView(viewModel, { "mode": "view", "id": id });
                break;
        }
    },
    activeRowClick: function (viewModel, args) {
        /// <param name="viewModel" type="DeliveryViewModel">viewModel类型为DeliveryViewModel</param>
        if (!args) return;
        var pk = viewModel.getModel3D().getPkName();
        var id = args[pk];
        if (id == null) {
            alert("id为空");
            return;
        }
        this.loadDetailTabView(viewModel, { "mode": "view", "id": id });
    },

    changePage: function (viewModel, args) {
        /// <param name="viewModel" type="DeliveryViewModel">viewModel类型为DeliveryViewModel</param>

        var listCard = viewModel.getModel3D();
        var querySchemeID = listCard.get("querySchemeID");
        var pageSize = args.pageSize;
        var pageIndex = args.pageIndex;

        this.queryData(viewModel, pageSize, pageIndex, querySchemeID, null, false, "append");
    },

    addAction: function (viewModel, args) {
        /// <param name="viewModel" type="DeliveryViewModel">viewModel类型为DeliveryViewModel</param>
        this.loadDetailTabView(viewModel, { "mode": "add" });
    },
    submitAction: function (viewModel, args) {
        /// <param name="viewModel" type="DeliveryViewModel">viewModel类型为DeliveryViewModel</param>

    },
    withdrawAction: function (viewModel, args) {
        /// <param name="viewModel" type="DeliveryViewModel">viewModel类型为DeliveryViewModel</param>

    },
    approveAction: function (viewModel, args) {
        /// <param name="viewModel" type="DeliveryViewModel">viewModel类型为DeliveryViewModel</param>

    },
    unapproveAction: function (viewModel, args) {
        /// <param name="viewModel" type="DeliveryViewModel">viewModel类型为DeliveryViewModel</param>

    },
    closeAction: function (viewModel, args) {
        /// <param name="viewModel" type="DeliveryViewModel">viewModel类型为DeliveryViewModel</param>
        alert(args + "功能正在开发中...");
    },
    inventoryAction: function (viewModel, args) {
        /// <param name="viewModel" type="DeliveryViewModel">viewModel类型为DeliveryViewModel</param>
        alert(args + "功能正在开发中...");
    },
    deliveryAction: function (viewModel, args) {
        /// <param name="viewModel" type="DeliveryViewModel">viewModel类型为DeliveryViewModel</param>
        alert(args + "功能正在开发中...");
    },
    outboundAction: function (viewModel, args) {
        /// <param name="viewModel" type="DeliveryViewModel">viewModel类型为DeliveryViewModel</param>
        alert(args + "功能正在开发中...");
    },
    deleteAction: function (viewModel, args) {
        /// <param name="viewModel" type="DeliveryViewModel">viewModel类型为DeliveryViewModel</param>

    },
    bizAction: function (viewModel, args) {
        /// <param name="viewModel" type="DeliveryViewModel">viewModel类型为DeliveryViewModel</param>
        alert(args + "功能正在开发中...");
    },
    printAction: function (viewModel, args) {
        /// <param name="viewModel" type="DeliveryViewModel">viewModel类型为DeliveryViewModel</param>
        alert(args + "功能正在开发中...");
    },
    outputAction: function (viewModel, args) {
        /// <param name="viewModel" type="DeliveryViewModel">viewModel类型为DeliveryViewModel</param>
        alert(args + "功能正在开发中...");
    },
    sortAction: function (viewModel, args) {
        /// <param name="viewModel" type="DeliveryViewModel">viewModel类型为DeliveryViewModel</param>
        alert(args + "功能正在开发中...");
    },
    filterAction: function (viewModel, args) {
        /// <param name="viewModel" type="DeliveryViewModel">viewModel类型为DeliveryViewModel</param>
        alert(args + "功能正在开发中...");
    },
    setAction: function (viewModel, args) {
        /// <param name="viewModel" type="DeliveryViewModel">viewModel类型为DeliveryViewModel</param>
        if (!args) return;
        switch (args) {
            case "columnSet":
                this.showColumn(viewModel);
                break;
            default:
                break;
        }
    },
    showColumn: function (viewModel) {
        //弹出参照界面
        if (viewModel.getReadOnly() || viewModel.getDisabled()) return;
        var columnCode = viewModel.get("columnCode") || "SA02";
        if (!columnCode) return;

        var self = this;


        cb.route.loadPageViewPart(viewModel, "common.col.ColumnApp", {
            columnCode: columnCode, type: "1", callBack: function (refresh, data) {
                if (refresh) {
                    //更新栏目
                    self.updateColumn(viewModel, data);
                }
            }
        });

    },

    updateColumn: function (viewModel, data) {
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
            self.refreshAction(viewModel);
        }


    },

    refreshAction: function (viewModel, args) {
        //刷新数据
        var listCard = viewModel.getModel3D();
        var querySchemeID = listCard.get("querySchemeID");
        var pageSize = listCard.getPageSize();
        var pageIndex = 1;

        this.queryData(viewModel, pageSize, pageIndex, querySchemeID, null, args, "override");
    },

    reloadScheme:function(viewModel,filter){
    
        var symbol = viewModel.getSymbol();
        if (symbol != null) {
            var listCard = viewModel.getModel3D();
            var querySchemeID = viewModel.getqueryScheme().getValue().queryschemeID;
            listCard.set("querySchemeID", querySchemeID);
            var pageSize = listCard.getPageSize();
            var pageIndex = 1;
            cb.data.CommonProxy(symbol).Query({
                "querySchemeID": querySchemeID,
                "pageSize": pageSize,
                "pageIndex": 1,
                "filters":filter
            }, function (success, fail) {
                if (fail) {
                    alert("查询列表数据失败");
                    return;
                }
                success.mode = "override";
                listCard.setPageRows(success);
            });
        }

    },

    init_Extend: function (viewModel) {
        /// <param name="viewModel" type="DeliveryViewModel">viewModel类型为DeliveryViewModel</param>
        cb.route.initViewPart(viewModel);

        var queryScheme = viewModel.getqueryScheme();
        queryScheme.setData({
            "mode": "slide",
            "fields": {
                "valueField": "queryschemeID",
                "textField": "name"
            }
        });
        var symbol = viewModel.getSymbol();
        if (symbol != null) {
            var listCard = viewModel.getModel3D();
            var pageSize = listCard.getPageSize();
            var params = { "loadDefaultData": true, "pageSize": pageSize };
            cb.data.CommonProxy(symbol).LoadSchemeList(params, function (success, fail) {
                if (fail) {
                    alert("获取查询方案列表失败");
                    return;
                }
                var schemeList = success.schemeList;
                if (schemeList) {
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
        }

        var timeLine = viewModel.gettimeLine();
        timeLine.setDataSource(TimeLineData);
        if (viewModel.getsetAction) viewModel.getsetAction().setDataSource([
           { "name": "self", "value": "columnSet", "text": "栏目" }
        ]);
    }
};
