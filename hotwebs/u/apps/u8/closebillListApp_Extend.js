/// <reference path="../../common/js/Cube.js" />
/// <reference path="closebillListApp_M.js" />

var closebillListViewModel_Extend = {
    doAction: function (name, viewModel) {
        if (this[name])
            this[name](viewModel);
    },
    loadDetailView: function (viewModel, params) {
        var symbol = viewModel.getSymbol();
        if (!symbol) return;
        //viewModel.loadArchiveView(symbol + "App", params);
	cb.route.loadArchiveViewPart(viewModel, symbol + "App", params);
    },
	loadDetailTabView: function (viewModel, params) {
        var symbol = viewModel.getSymbol();
        if (!symbol) return;
        //viewModel.loadTabViewPart(symbol + "App", params);
	cb.route.loadTabViewPart(viewModel, symbol + "App", params);
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
    queryScheme: function (viewModel, args) {
        var symbol = viewModel.getSymbol();
        if (symbol != null) {
            viewModel.getModel3D().setDataSource(cb.data.CommonProxy(symbol), "Query", { "querySchemeID": args && args.queryschemeID });
        }
    },
    searchAction: function (viewModel, args) {
        alert("搜索" + args + "...");
    },
    queryAction: function (viewModel) {
        //viewModel.loadViewPart("common.queryscheme.QueryScheme", ".query-scheme");
	cb.route.loadViewPart(viewModel, cb.route.CommonAppEnum.QueryScheme, cb.route.ViewPartType.QueryScheme);
    },
	expandAction: function (viewModel) {
        //viewModel.toggleViewPart("common.queryscheme.QueryScheme", ".ui-query-content", { animation: { mode: "toggle"} });
	cb.route.toggleViewPart(viewModel, cb.route.CommonAppEnum.QueryScheme, cb.route.ViewPartType.QueryScheme, { animation: { mode: "toggle"} });
    },
    timeItemClick: function (viewModel, args) {
       if (args && args.title) alert(args.title);
    },
    qryAction: function (viewModel, args) {
        /// <param name="viewModel" type="">viewModel类型为</param>
        alert(args + "功能正在开发中...");
    },
    itemClick: function (viewModel, args) {
        /// <param name="viewModel" type="">viewModel类型为</param>
        if (!args || !args.type || !args.data) return;
        var pk = "pk_ap_closebill";
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
        /// <param name="viewModel" type="">viewModel类型为</param>
        if (!args || !args.row) return;
        var pk = viewModel.getModel3D().getPkName();
        var id = args.row[pk];
        if (id == null) {
            alert("id为空");
            return;
        }
        this.loadDetailTabView(viewModel, { "mode": "view", "id": id });
    },
    addAction: function (viewModel, args) {
        /// <param name="viewModel" type="">viewModel类型为</param>
        this.loadDetailTabView(viewModel, { "mode": "add" });
    },
    submitAction: function (viewModel, args) {
        /// <param name="viewModel" type="">viewModel类型为</param>
//        cb.data.commonCRUD(viewModel).batchSubmit();
    },
    withdrawAction: function (viewModel, args) {
        /// <param name="viewModel" type="">viewModel类型为</param>
//        cb.data.commonCRUD(viewModel).batchWithDraw();
    },
    approveAction: function (viewModel, args) {
        /// <param name="viewModel" type="">viewModel类型为</param>
//        cb.data.commonCRUD(viewModel).batchApprove();
    },
    unapproveAction: function (viewModel, args) {
        /// <param name="viewModel" type="">viewModel类型为</param>
//       cb.data.commonCRUD(viewModel).batchUnApprove();
    },
    closeAction: function (viewModel, args) {
        /// <param name="viewModel" type="">viewModel类型为</param>
        alert(args + "功能正在开发中...");
    },
    inventoryAction: function (viewModel, args) {
        /// <param name="viewModel" type="">viewModel类型为</param>
        alert(args + "功能正在开发中...");
    },
    deliveryAction: function (viewModel, args) {
        /// <param name="viewModel" type="">viewModel类型为</param>
        alert(args + "功能正在开发中...");
    },
    outboundAction: function (viewModel, args) {
        /// <param name="viewModel" type="">viewModel类型为</param>
        alert(args + "功能正在开发中...");
    },
    deleteAction: function (viewModel, args) {
        /// <param name="viewModel" type="">viewModel类型为</param>
//        cb.data.commonCRUD(viewModel).batchDelete();
    },
    bizAction: function (viewModel, args) {
        /// <param name="viewModel" type="">viewModel类型为</param>
        alert(args + "功能正在开发中...");
    },
    printAction: function (viewModel, args) {
        /// <param name="viewModel" type="">viewModel类型为</param>
        alert(args + "功能正在开发中...");
    },
    outputAction: function (viewModel, args) {
        /// <param name="viewModel" type="">viewModel类型为</param>
        alert(args + "功能正在开发中...");
    },
    sortAction: function (viewModel, args) {
        /// <param name="viewModel" type="">viewModel类型为</param>
        alert(args + "功能正在开发中...");
    },
    filterAction: function (viewModel, args) {
        /// <param name="viewModel" type="">viewModel类型为</param>
        alert(args + "功能正在开发中...");
    },
    setAction: function (viewModel, args) {
        /// <param name="viewModel" type="">viewModel类型为</param>
        alert(args + "功能正在开发中...");
    },
    init_Extend: function (viewModel) {
        /// <param name="viewModel" type="closebillListViewModel">viewModel类型为closebillListViewModel</param>
        //viewModel.initViewPart();
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
                var defaultSchemeData = success.defaultSchemeData;
                if (defaultSchemeID && defaultSchemeData) {
                    listCard.setDataSource(cb.data.CommonProxy(symbol), "Query", { "querySchemeID": defaultSchemeID }, defaultSchemeData);
                }
            });
        }

        var timeLine = viewModel.gettimeLine();
        timeLine.setDataSource(TimeLineData);
    }
};
