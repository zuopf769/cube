var SchemeListManageViewModel_Extend = {
    doAction: function (name, viewModel) {
        if (this[name]) this[name](viewModel);
    },
    closeAction: function (viewModel) {
        cb.route.hidePageViewPart(viewModel);
    },
    init_Extend: function (viewModel) {
        var params = cb.route.getViewPartParams(viewModel);
        var parentViewModel = params.parentViewModel;
        var schemeList = parentViewModel.getqueryScheme().getDataSource();

        if (!schemeList || schemeList.length <= 0) {
            cb.console.error("获取查询方案列表失败");
            return;
        }
        viewModel.getschemelist().setDataSource(schemeList);
    },
    itemClick: function (viewModel, args) {
        var params = cb.route.getViewPartParams(viewModel);
        var parentViewModel = params.parentViewModel;
        switch (args.action) {
            case "changeAction":
                cb.data.CommonProxy('UAP').SetQuerySchemePubOrPrivate({ id: args.queryschemeid, isPrivate: !args.isprivate }, function (success, fail) {
                    if (fail) {
                        alert("更改查询方案属性出错！");
                        return;
                    }
                    var symbol = parentViewModel.getSymbol();
                    var listCard = parentViewModel.getModel3D();
                    var param = { "loadDefaultData": true, "pageSize": listCard.getPageSize() };
                    cb.data.CommonProxy(symbol).LoadSchemeList(params, function (success, fail) {
                        if (fail) {
                            alert("获取查询方案列表失败");
                            return;
                        }
                        var schemeList = success.schemeList;
                        viewModel.getschemelist().setDataSource(schemeList);
                        parentViewModel.initData();
                    });
                });
                break;
            case "editAction":
                cb.route.loadPageViewPart(viewModel, "common.queryscheme.SchemeDetail", { width: "800px", height: "600px", queryschemeid: args.queryschemeid, mode: "edit" });
                break;
            case "deleteAction":
                cb.data.CommonProxy("UAP").QuerySchemeDelete({ id: args.queryschemeid }, function (success, fail) {
                    if (fail != null) {
                        alert("删除查询方案失败");
                        return;
                    }
                    var symbol = parentViewModel.getSymbol();
                    cb.data.CommonProxy(symbol).LoadSchemeList({}, function (data) {
                        var schemeList = data.schemeList;
                        if (schemeList) {
                            parentViewModel.getqueryScheme().setDataSource(schemeList);
                            viewModel.getschemelist().setDataSource(schemeList);

                            var querySchemeIds = [];
                            for (var i = 0, len = schemeList.length; i < len; i++) {
                                querySchemeIds.push(schemeList[i].queryschemeID);
                            }
                            cb.data.CommonProxy(symbol).LoadSchemeDataCount(querySchemeIds, function (success, fail) {
                                if (fail) {
                                    alert("获取查询方案数据记录数失败");
                                    return;
                                }
                                parentViewModel.getqueryScheme().set("dataCount", success);
                            });
                        }
                        else{
                        	parentViewModel.getqueryScheme().setDataSource([]);
                            viewModel.getschemelist().setDataSource([]);

                        }
                    });
                });
                break;
        }
    }
};