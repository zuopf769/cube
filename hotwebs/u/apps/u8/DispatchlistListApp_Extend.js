/// <reference path="../../common/js/Cube.js" />
/// <reference path="DispatchlistListViewModel_M.js" />

var DispatchlistListViewModel_Extend = function () {};

DispatchlistListViewModel_Extend.prototype.doAction = function (name, viewModel) {
    if (this[name])
        this[name](viewModel);
};

DispatchlistListViewModel_Extend.prototype.loadDetailView =function (viewModel, params) {
    var symbol = viewModel.getSymbol();
    if (!symbol) return;
    cb.route.loadArchiveViewPart(viewModel, symbol + "App", params);
};

DispatchlistListViewModel_Extend.prototype.loadDetailTabView= function (viewModel, params) {
    var symbol = viewModel.getSymbol();
    if (!symbol) return;
    cb.route.loadTabViewPart(viewModel, symbol + "App", params);
 };

DispatchlistListViewModel_Extend.prototype.menuItemClick = function (viewModel, params) {
     if (!args || !args.type || !args.data || !args.data.appId) return;
     var url = args.data.appId;
     if (url === "homepage") location.href = cb.route.getHomepageUrl();
     else location.href = cb.route.getPageUrl(url);
};

DispatchlistListViewModel_Extend.prototype.cardAction =  function (viewModel) {     
        this.loadDetailView(viewModel, { "mode": "add" });
};

DispatchlistListViewModel_Extend.prototype.activeRowClick =  function (viewModel) {     
    viewModel.commonCRUD.loadDetailView(args);
};

DispatchlistListViewModel_Extend.prototype.queryScheme =  function (viewModel) {     
    var symbol = viewModel.getSymbol();
    if (symbol != null) {
        viewModel.getModel3D().setDataSource(cb.data.CommonProxy(symbol), "Query", { "querySchemeID": args && args.queryschemeID });

    }
};

DispatchlistListViewModel_Extend.prototype.queryAction =  function (viewModel) {     
    cb.route.loadViewPart(viewModel, cb.route.CommonAppEnum.QueryScheme, cb.route.ViewPartType.QueryScheme);
};

DispatchlistListViewModel_Extend.prototype.expandAction =  function (viewModel) {     
    cb.route.toggleViewPart(viewModel, cb.route.CommonAppEnum.QueryScheme, cb.route.ViewPartType.QueryScheme, { animation: { mode: "toggle"} });
};

DispatchlistListViewModel_Extend.prototype.expandAction =  function (viewModel,args) {     
    
};

DispatchlistListViewModel_Extend.prototype.changePage =  function (viewModel,args) {     
    /// <param name="viewModel" type="DeliveryViewModel">viewModel类型为DeliveryViewModel</param>
	var listCard = viewModel.getModel3D();
    var querySchemeID = listCard.get("querySchemeID");        
    var pageIndex = args.pageIndex;
	var columnCode = "";	
	var filters =[];

    viewModel.commonCRUD.loadData(querySchemeID,columnCode, filters, false,"append",pageIndex); 
};


    DispatchlistListViewModel_Extend.prototype.qryAction = function (viewModel, args) {
	    /// <param name="viewModel" type="">viewModel类型为</param>
            
    };

    DispatchlistListViewModel_Extend.prototype.itemClick = function (viewModel, args) {
	    /// <param name="viewModel" type="">viewModel类型为</param>
            
    };

    DispatchlistListViewModel_Extend.prototype.activeRowClick = function (viewModel, args) {
	    /// <param name="viewModel" type="">viewModel类型为</param>
            
    };

    DispatchlistListViewModel_Extend.prototype.changePage = function (viewModel, args) {
	    /// <param name="viewModel" type="">viewModel类型为</param>
            
    };

    DispatchlistListViewModel_Extend.prototype.addAction = function (viewModel, args) {
	    /// <param name="viewModel" type="">viewModel类型为</param>
        this.loadDetailTabView(viewModel, { "mode": "add" });
    };

    DispatchlistListViewModel_Extend.prototype.submitAction = function (viewModel, args) {
	    /// <param name="viewModel" type="">viewModel类型为</param>
            
    };

    DispatchlistListViewModel_Extend.prototype.withdrawAction = function (viewModel, args) {
	    /// <param name="viewModel" type="">viewModel类型为</param>
            
    };

    DispatchlistListViewModel_Extend.prototype.approveAction = function (viewModel, args) {
	    /// <param name="viewModel" type="">viewModel类型为</param>
            
    };

    DispatchlistListViewModel_Extend.prototype.unapproveAction = function (viewModel, args) {
	    /// <param name="viewModel" type="">viewModel类型为</param>
            
    };

    DispatchlistListViewModel_Extend.prototype.closeAction = function (viewModel, args) {
	    /// <param name="viewModel" type="">viewModel类型为</param>
            
    };

    DispatchlistListViewModel_Extend.prototype.inventoryAction = function (viewModel, args) {
	    /// <param name="viewModel" type="">viewModel类型为</param>
            
    };

    DispatchlistListViewModel_Extend.prototype.deliveryAction = function (viewModel, args) {
	    /// <param name="viewModel" type="">viewModel类型为</param>
            
    };

    DispatchlistListViewModel_Extend.prototype.outboundAction = function (viewModel, args) {
	    /// <param name="viewModel" type="">viewModel类型为</param>
            
    };

    DispatchlistListViewModel_Extend.prototype.deleteAction = function (viewModel, args) {
	    /// <param name="viewModel" type="">viewModel类型为</param>
            
    };

    DispatchlistListViewModel_Extend.prototype.bizAction = function (viewModel, args) {
	    /// <param name="viewModel" type="">viewModel类型为</param>
            
    };

    DispatchlistListViewModel_Extend.prototype.printAction = function (viewModel, args) {
	    /// <param name="viewModel" type="">viewModel类型为</param>
            
    };

    DispatchlistListViewModel_Extend.prototype.outputAction = function (viewModel, args) {
	    /// <param name="viewModel" type="">viewModel类型为</param>
            
    };

    DispatchlistListViewModel_Extend.prototype.sortAction = function (viewModel, args) {
	    /// <param name="viewModel" type="">viewModel类型为</param>
            
    };

    DispatchlistListViewModel_Extend.prototype.filterAction = function (viewModel, args) {
	    /// <param name="viewModel" type="">viewModel类型为</param>
            
    };

    DispatchlistListViewModel_Extend.prototype.setAction = function (viewModel, args) {
	    /// <param name="viewModel" type="">viewModel类型为</param>
            
    };

    DispatchlistListViewModel_Extend.prototype.refreshAction = function (viewModel, args) {
	    /// <param name="viewModel" type="">viewModel类型为</param>
            
    };


DispatchlistListViewModel_Extend.prototype.init_Extend = function (viewModel) {
 /// <param name="viewModel" type="DispatchlistListViewModel">viewModel类型为DispatchlistListViewModel</param>
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


	//需要设置columnCode viewModel.set("columnCode",columnCode);
};