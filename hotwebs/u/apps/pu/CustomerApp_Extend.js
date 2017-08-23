/// <reference path="../../common/js/Cube.js" />
/// <reference path="CustomerApp_M.js" />

var CustomerViewModel_Extend = {
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
    menuAction: function (viewModel) {
        cb.route.toggleViewPart(viewModel, cb.route.CommonAppEnum.Catalog, cb.route.ViewPartType.Catalog, { animation: { duration: 500 }, callback: this.querySchemeByCode, context: this });
    },
    cardAction: function (viewModel) {
        this.loadDetailView(viewModel, { "mode": "add" });
    },
    queryData: function (viewModel, params) {
        if (!params) return;
        var symbol = viewModel.getSymbol();
        if (symbol != null) {
            var listCard = viewModel.getModel3D();
            cb.data.CommonProxy(symbol).Query({
                "pageIndex": 1,
                "pageSize": listCard.getPageSize(),
                "querySchemeID": params.querySchemeID,
                "filters": params.filters,
                "code": params.code,
                "treeFuncode": params.treeFuncode,
                "codeOrName": params.codeOrName
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
    queryScheme: function (viewModel, args) {
        var listCard = viewModel.getModel3D();
        var querySchemeID = args && args.queryschemeID;
        listCard.set("querySchemeID", querySchemeID);
        this.queryData(viewModel, { querySchemeID: querySchemeID });
    },
    querySchemeByCode: function (viewModel, args) {
        this.queryData(viewModel, args);
    },
    searchAction: function (viewModel, args) {
        alert("搜索" + args + "...");
    },
    queryAction: function (viewModel) {
        cb.route.loadViewPart(viewModel, cb.route.CommonAppEnum.QueryScheme, cb.route.ViewPartType.QueryScheme);
    },
    timeItemClick: function (viewModel, args) {
        debugger;
    },
    itemClick: function (viewModel, args) {
        /// <param name="viewModel" type="CustomerViewModel">viewModel类型为CustomerViewModel</param>
        if (!args || !args.type || !args.data) return;
        var pk = viewModel.getModel3D().getPkName();
        var id = args.data[pk];
        if (id == null) {
            alert("id为空");
            return;
        }
        this.loadDetailView(viewModel, { "mode": "view", "id": id });
    },
    activeRowClick: function (viewModel, args) {
        /// <param name="viewModel" type="CustomerViewModel">viewModel类型为CustomerViewModel</param>
        if (!args) return;
        var pk = viewModel.getModel3D().getPkName();
        var id = args[pk];
        if (id == null) {
            alert("id为空");
            return;
        }
        this.loadDetailTabView(viewModel, { "mode": "view", "id": id });
    },
    changePage: function (viewModel) {
        /// <param name="viewModel" type="CustomerViewModel">viewModel类型为CustomerViewModel</param>
        var symbol = viewModel.getSymbol();
        if (symbol != null) {
            var listCard = viewModel.getModel3D();
            var querySchemeID = listCard.get("querySchemeID");
            var pageSize = args.pageSize;
            var pageIndex = args.pageIndex;
            cb.data.CommonProxy(symbol).Query({
                "querySchemeID": querySchemeID,
                "pageSize": pageSize,
                "pageIndex": pageIndex
            }, function (success, fail) {
                if (fail) {
                    alert("查询列表数据失败");
                    return;
                }
                success.mode = "append";
                listCard.setPageRows(success);
            });
        }
    },
    addAction: function (viewModel, args) {
        /// <param name="viewModel" type="CustomerViewModel">viewModel类型为CustomerViewModel</param>
        this.loadDetailTabView(viewModel, { "mode": "add" });
    },
    editAction: function (viewModel, args) {
        /// <param name="viewModel" type="CustomerViewModel">viewModel类型为CustomerViewModel</param>
        alert(args + "功能正在开发中...");
    },
    batchAction: function (viewModel, args) {
        /// <param name="viewModel" type="CustomerViewModel">viewModel类型为CustomerViewModel</param>
        alert(args + "功能正在开发中...");
    },
    deleteAction: function (viewModel, args) {
        /// <param name="viewModel" type="CustomerViewModel">viewModel类型为CustomerViewModel</param>
        alert(args + "功能正在开发中...");
    },
    mergeAction: function (viewModel, args) {
        /// <param name="viewModel" type="CustomerViewModel">viewModel类型为CustomerViewModel</param>
        alert(args + "功能正在开发中...");
    },
    creditAction: function (viewModel, args) {
        /// <param name="viewModel" type="CustomerViewModel">viewModel类型为CustomerViewModel</param>
        alert(args + "功能正在开发中...");
    },
    checkAction: function (viewModel, args) {
        /// <param name="viewModel" type="CustomerViewModel">viewModel类型为CustomerViewModel</param>
        alert(args + "功能正在开发中...");
    },
    printAction: function (viewModel, args) {
        /// <param name="viewModel" type="CustomerViewModel">viewModel类型为CustomerViewModel</param>
        alert(args + "功能正在开发中...");
    },
    outputAction: function (viewModel, args) {
        /// <param name="viewModel" type="CustomerViewModel">viewModel类型为CustomerViewModel</param>
        alert(args + "功能正在开发中...");
    },
    bizAction: function (viewModel, args) {
        /// <param name="viewModel" type="CustomerViewModel">viewModel类型为CustomerViewModel</param>
        alert(args + "功能正在开发中...");
    },
    filterAction: function (viewModel, args) {
        /// <param name="viewModel" type="CustomerViewModel">viewModel类型为CustomerViewModel</param>
        alert(args + "功能正在开发中...");
    },
    refreshAction: function (viewModel, args) {
        /// <param name="viewModel" type="CustomerViewModel">viewModel类型为CustomerViewModel</param>
        alert(args + "功能正在开发中...");
    },
    setAction: function (viewModel, args) {
        /// <param name="viewModel" type="CustomerViewModel">viewModel类型为CustomerViewModel</param>
        alert(args + "功能正在开发中...");
    },
    init_Extend: function (viewModel) {
        /// <param name="viewModel" type="CustomerViewModel">viewModel类型为CustomerViewModel</param>
        cb.route.loadViewPart(viewModel, cb.route.CommonAppEnum.Catalog, cb.route.ViewPartType.Catalog, { treeFunctionId: "U8100108", callback: this.querySchemeByCode, context: this });

        cb.route.initViewPart(viewModel);

        var queryScheme = viewModel.getqueryScheme();
        queryScheme.setData({
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
    }
};
