/// <reference path="../../common/js/Cube.js" />
/// <reference path="customerListApp_M.js" />

var customerListViewModel_Extend = function () {};
customerListViewModel_Extend.prototype.doAction = function (name, viewModel) {
    if (this[name])
        this[name](viewModel);
};
customerListViewModel_Extend.prototype.loadDetailView = function (viewModel, params) {
    var symbol = viewModel.getSymbol();
    if (!symbol) return;
    //viewModel.loadArchiveView(symbol + "App" , params);
	cb.route.loadArchiveViewPart(viewModel, symbol + "App", params);
		
	
};
customerListViewModel_Extend.prototype.loadDetailTabView = function (viewModel, params) {
    var symbol = viewModel.getSymbol();
    if (!symbol) return;
    cb.route.loadTabViewPart(viewModel,symbol + "App", params);
};
customerListViewModel_Extend.prototype.menuItemClick = function (viewModel, args) {
    if (!args || !args.type || !args.data || !args.data.appId) return;
    var url = args.data.appId;
    if (url === "homepage") location.href = cb.route.getHomepageUrl();
    else location.href = cb.route.getPageUrl(url);
};
customerListViewModel_Extend.prototype.menuAction = function (viewModel) {
    //cb.route.toggleViewPart("common.catalog.Catalog", ".class-part", { animation: { duration: 500 }, callback: this.querySchemeByCode, context: this });
		
	cb.route.toggleViewPart(viewModel, cb.route.CommonAppEnum.Catalog, cb.route.ViewPartType.Catalog, { animation: { duration: 500 }, callback: this.querySchemeByCode, context: this });
    
};
customerListViewModel_Extend.prototype.cardAction = function (viewModel) {
    this.loadDetailView(viewModel, { "mode": "add" });
};
customerListViewModel_Extend.prototype.queryData = function (viewModel, params) {
    if (!params) return;
    var symbol = viewModel.getSymbol();
	params.treeFuncode = 'U8100108';
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
};
customerListViewModel_Extend.prototype.queryScheme = function (viewModel, args) {
    var listCard = viewModel.getModel3D();
    var querySchemeID = args && args.queryschemeID;
    listCard.set("querySchemeID", querySchemeID);
    this.queryData(viewModel, { querySchemeID: querySchemeID });
};
customerListViewModel_Extend.prototype.querySchemeByCode = function (viewModel, args) {
    this.queryData(viewModel, args);
	viewModel.currentSelectNodeInfo = args;
};
customerListViewModel_Extend.prototype.searchAction = function (viewModel, args) {
    alert("搜索" + args + "...");
};
customerListViewModel_Extend.prototype.queryAction = function (viewModel) {
    //viewModel.loadViewPart("common.queryscheme.QueryScheme", ".query-scheme");
	cb.route.loadViewPart(viewModel, cb.route.CommonAppEnum.QueryScheme, cb.route.ViewPartType.QueryScheme);
    
};
customerListViewModel_Extend.prototype.timeItemClick = function (viewModel, args) {
    debugger;
};
customerListViewModel_Extend.prototype.itemClick = function (viewModel, args) {
    /// <param name="viewModel" type="customerListViewModel">viewModel类型为customerListViewModel</param>
    if (!args || !args.type || !args.data) return;
    var pk = viewModel.getPkName();
    var id = args.data[pk];
    if (id == null) {
        alert("id为空");
        return;
    }
    this.loadDetailView(viewModel, { "mode": "view", "id": id });
};
customerListViewModel_Extend.prototype.activeRowClick = function (viewModel, args) {
    /// <param name="viewModel" type="customerListViewModel">viewModel类型为customerListViewModel</param>
	if (!args) return;
    var pk = viewModel.getPkName();
    var id = args[pk];
    if (id == null) {
        alert("id为空");
        return;
    }
    this.loadDetailTabView(viewModel, { "mode": "view", "id": id });
};
customerListViewModel_Extend.prototype.changePage = function (viewModel) {
    /// <param name="viewModel" type="customerListViewModel">viewModel类型为customerListViewModel</param>
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
};
customerListViewModel_Extend.prototype.addAction = function (viewModel, args) {
    /// <param name="viewModel" type="customerListViewModel">viewModel类型为customerListViewModel</param>
    this.loadDetailTabView(viewModel, { "mode": "add" ,nodeInfo : viewModel.currentSelectNodeInfo});
};
customerListViewModel_Extend.prototype.editAction = function (viewModel, args) {
    /// <param name="viewModel" type="customerListViewModel">viewModel类型为customerListViewModel</param>
    alert(args + "功能正在开发中...");
};
customerListViewModel_Extend.prototype.batchAction = function (viewModel, args) {
    /// <param name="viewModel" type="customerListViewModel">viewModel类型为customerListViewModel</param>
    alert(args + "功能正在开发中...");
};
customerListViewModel_Extend.prototype.deleteAction = function (viewModel, args) {
    /// <param name="viewModel" type="customerListViewModel">viewModel类型为customerListViewModel</param>
    //alert(args + "功能正在开发中...");
	//cb.data.commonCRUD(viewModel).batchDelete();
};
customerListViewModel_Extend.prototype.mergeAction = function (viewModel, args) {
    /// <param name="viewModel" type="customerListViewModel">viewModel类型为customerListViewModel</param>
    alert(args + "功能正在开发中...");
};
customerListViewModel_Extend.prototype.creditAction = function (viewModel, args) {
    /// <param name="viewModel" type="customerListViewModel">viewModel类型为customerListViewModel</param>
    alert(args + "功能正在开发中...");
};
customerListViewModel_Extend.prototype.checkAction = function (viewModel, args) {
    /// <param name="viewModel" type="customerListViewModel">viewModel类型为customerListViewModel</param>
    alert(args + "功能正在开发中...");
};
customerListViewModel_Extend.prototype.printAction = function (viewModel, args) {
    /// <param name="viewModel" type="customerListViewModel">viewModel类型为customerListViewModel</param>
    alert(args + "功能正在开发中...");
};
customerListViewModel_Extend.prototype.outputAction = function (viewModel, args) {
    /// <param name="viewModel" type="customerListViewModel">viewModel类型为customerListViewModel</param>
    alert(args + "功能正在开发中...");
};
customerListViewModel_Extend.prototype.bizAction = function (viewModel, args) {
    /// <param name="viewModel" type="customerListViewModel">viewModel类型为customerListViewModel</param>
    alert(args + "功能正在开发中...");
};
customerListViewModel_Extend.prototype.filterAction = function (viewModel, args) {
    /// <param name="viewModel" type="customerListViewModel">viewModel类型为customerListViewModel</param>
    alert(args + "功能正在开发中...");
};
customerListViewModel_Extend.prototype.refreshAction = function (viewModel, args) {
    /// <param name="viewModel" type="customerListViewModel">viewModel类型为customerListViewModel</param>
    alert(args + "功能正在开发中...");
};
customerListViewModel_Extend.prototype.setAction = function (viewModel, args) {
    /// <param name="viewModel" type="customerListViewModel">viewModel类型为customerListViewModel</param>
    alert(args + "功能正在开发中...");
};
customerListViewModel_Extend.prototype.init_Extend = function (viewModel) {
    /// <param name="viewModel" type="customerListViewModel">viewModel类型为customerListViewModel</param>
    //viewModel.loadViewPart("common.catalog.CatalogApp", ".cube-main-left", { callback: this.querySchemeByCode, context: this, treeFunctionId: "U8100108" });

    //viewModel.initViewPart();
		
	cb.route.loadViewPart(viewModel, cb.route.CommonAppEnum.Catalog, cb.route.ViewPartType.Catalog, {treeFunctionId: "U8100108", callback: this.querySchemeByCode, context: this });

    cb.route.initViewPart(viewModel);
		
	viewModel.currentSelectNodeInfo = null;
	viewModel._primaryKey = 'ccuscode_pk';
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
            var defaultSchemeData = success.defaultSchemeData;
            if (defaultSchemeData) {
                listCard.setDataSource(cb.data.CommonProxy(symbol), "Query", { "querySchemeID": defaultSchemeID }, defaultSchemeData);
            }
        });
    }

    var timeLine = viewModel.gettimeLine();
    timeLine.setDataSource(TimeLineData);
};