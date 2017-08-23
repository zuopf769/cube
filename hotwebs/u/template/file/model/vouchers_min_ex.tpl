/// <reference path="../../common/js/Cube.js" />
/// <reference path="<#=name#>_M.js" />

<#*(viewModel:viewModels){#>
var <#=extendName#> = {
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
	
	activeRowClick: function (viewModel, args) {
		cb.data.commonCRUD(viewModel).loadDetailView(args);
	},

    queryScheme: function (viewModel, args) {
        var listCard = viewModel.getModel3D();
        var querySchemeID = args && args.queryschemeID;
        listCard.set("querySchemeID", querySchemeID);
		var columnCode = "";
		var filters =[];
		var crud = new cb.data.commonCRUD(viewModel);

        crud.loadData(querySchemeID,columnCode, filters, false,"override",1);   

        this.queryData(viewModel, listCard.getPageSize(), 1, querySchemeID,
            null, false, "override");        
    },   
    queryAction: function (viewModel) {
        cb.route.loadViewPart(viewModel, cb.route.CommonAppEnum.QueryScheme, cb.route.ViewPartType.QueryScheme);
    },
	expandAction: function (viewModel) {
        cb.route.toggleViewPart(viewModel, cb.route.CommonAppEnum.QueryScheme, cb.route.ViewPartType.QueryScheme, { animation: { mode: "toggle"} });
    },
    timeItemClick: function (viewModel, args) {
        debugger;
    },
	
	changePage: function (viewModel, args) {
        /// <param name="viewModel" type="DeliveryViewModel">viewModel类型为DeliveryViewModel</param>

        var listCard = viewModel.getModel3D();
        var querySchemeID = listCard.get("querySchemeID");        
        var pageIndex = args.pageIndex;
		var columnCode = "";
		var crud = new cb.data.commonCRUD(viewModel);
		var filters =[];

        crud.loadData(querySchemeID,columnCode, filters, false,"append",pageIndex);               
    }, 

    <#*(action:actions){#>
    <#=functionName#>: function (viewModel, args) {
        /// <param name="viewModel" type="<#=viewModel#>">viewModel类型为<#=viewModel#></param>
        
    },
    <#}#>
    init_Extend: function (viewModel) {
        /// <param name="viewModel" type="<#=name#>">viewModel类型为<#=name#></param>
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
    }
};
<#}#>