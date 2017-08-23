/// <reference path="../../common/js/Cube.js" />
/// <reference path="DispatchlistAppViewModel_vouchers_M.js" />

cb.viewmodel.u8_DispatchlistAppViewModel_vouchers_Extend = function () { };

cb.viewmodel.u8_DispatchlistAppViewModel_vouchers_Extend.prototype.doAction = function (name, viewModel) {
    if (this[name])
        this[name](viewModel);
};

cb.viewmodel.u8_DispatchlistAppViewModel_vouchers_Extend.prototype.loadDetailView = function (viewModel, params) {
    var symbol = viewModel.getSymbol();
    if (!symbol) return;
    cb.route.loadArchiveViewPart(viewModel, symbol + "App", params);
};

cb.viewmodel.u8_DispatchlistAppViewModel_vouchers_Extend.prototype.menuItemClick = function (viewModel, params) {
    if (!args || !args.type || !args.data || !args.data.appId) return;
    var url = args.data.appId;
    if (url === "homepage") location.href = cb.route.getHomepageUrl();
    else location.href = cb.route.getPageUrl(url);
};

cb.viewmodel.u8_DispatchlistAppViewModel_vouchers_Extend.prototype.cardAction = function (viewModel) {
    this.loadDetailView(viewModel, { "mode": "add" });
};

cb.viewmodel.u8_DispatchlistAppViewModel_vouchers_Extend.prototype.activeRowClick = function (viewModel) {
    viewModel.commonCRUD.loadDetailView(args);
};

cb.viewmodel.u8_DispatchlistAppViewModel_vouchers_Extend.prototype.queryScheme = function (viewModel, args) {
    viewModel.commonCRUD.queryScheme(args);
};

cb.viewmodel.u8_DispatchlistAppViewModel_vouchers_Extend.prototype.queryAction = function (viewModel) {
    cb.route.loadViewPart(viewModel, cb.route.CommonAppEnum.QueryScheme, cb.route.ViewPartType.QueryScheme);
};

cb.viewmodel.u8_DispatchlistAppViewModel_vouchers_Extend.prototype.expandAction = function (viewModel) {
    viewModel.commonCRUD.expandScheme();
};

cb.viewmodel.u8_DispatchlistAppViewModel_vouchers_Extend.prototype.addschemeAction = function (viewModel) {
    cb.route.loadPageViewPart(viewModel, "common.queryscheme.SchemeDetail", {width:"700px",height:"560px"});
};

cb.viewmodel.u8_DispatchlistAppViewModel_vouchers_Extend.prototype.setschemeAction = function (viewModel) {
    cb.route.loadPageViewPart(viewModel, "common.commonscheme.SchemeListManage", { width: "450px", height: "550px" });
};

cb.viewmodel.u8_DispatchlistAppViewModel_vouchers_Extend.prototype.changePage = function (viewModel, args) {
    /// <param name="viewModel" type="DispatchlistAppViewModel_vouchers">viewModel类型为"DispatchlistAppViewModel_vouchers"</param>
    var listCard = viewModel.getModel3D();
    var querySchemeID = listCard.get("querySchemeID");
    var pageIndex = args.pageIndex;
    var columnCode = listCard.get("columnCode");
    var filters = [];

    viewModel.commonCRUD.loadData(querySchemeID, columnCode, filters, false, "append", pageIndex);
};


cb.viewmodel.u8_DispatchlistAppViewModel_vouchers_Extend.prototype.qryAction = function (viewModel, args) {
    /// <param name="viewModel" type="">viewModel类型为</param>

};
cb.viewmodel.u8_DispatchlistAppViewModel_vouchers_Extend.prototype.itemClick = function (viewModel, args) {
    /// <param name="viewModel" type="">viewModel类型为</param>

};
cb.viewmodel.u8_DispatchlistAppViewModel_vouchers_Extend.prototype.activeRowClick = function (viewModel, args) {
    /// <param name="viewModel" type="">viewModel类型为</param>

};
cb.viewmodel.u8_DispatchlistAppViewModel_vouchers_Extend.prototype.addAction = function (viewModel, args) {
    /// <param name="viewModel" type="DispatchlistAppViewModel_vouchers">viewModel类型为DispatchlistAppViewModel_vouchers</param>
    
};

cb.viewmodel.u8_DispatchlistAppViewModel_vouchers_Extend.prototype.batchDeleteAction = function (viewModel, args) {
    /// <param name="viewModel" type="DispatchlistAppViewModel_vouchers">viewModel类型为DispatchlistAppViewModel_vouchers</param>

};

cb.viewmodel.u8_DispatchlistAppViewModel_vouchers_Extend.prototype.batchSubmitAction = function (viewModel, args) {
    /// <param name="viewModel" type="DispatchlistAppViewModel_vouchers">viewModel类型为DispatchlistAppViewModel_vouchers</param>

};

cb.viewmodel.u8_DispatchlistAppViewModel_vouchers_Extend.prototype.batchWithDrawAction = function (viewModel, args) {
    /// <param name="viewModel" type="DispatchlistAppViewModel_vouchers">viewModel类型为DispatchlistAppViewModel_vouchers</param>

};

cb.viewmodel.u8_DispatchlistAppViewModel_vouchers_Extend.prototype.batchApproveAction = function (viewModel, args) {
    /// <param name="viewModel" type="DispatchlistAppViewModel_vouchers">viewModel类型为DispatchlistAppViewModel_vouchers</param>

};

cb.viewmodel.u8_DispatchlistAppViewModel_vouchers_Extend.prototype.inventoryAction = function (viewModel, args) {
    /// <param name="viewModel" type="">viewModel类型为</param>

};
cb.viewmodel.u8_DispatchlistAppViewModel_vouchers_Extend.prototype.deliveryAction = function (viewModel, args) {
    /// <param name="viewModel" type="">viewModel类型为</param>

};
cb.viewmodel.u8_DispatchlistAppViewModel_vouchers_Extend.prototype.batchUnApproveAction = function (viewModel, args) {
    /// <param name="viewModel" type="DispatchlistAppViewModel_vouchers">viewModel类型为DispatchlistAppViewModel_vouchers</param>

};

cb.viewmodel.u8_DispatchlistAppViewModel_vouchers_Extend.prototype.configAction = function (viewModel, args) {
    /// <param name="viewModel" type="DispatchlistAppViewModel_vouchers">viewModel类型为DispatchlistAppViewModel_vouchers</param>

};
/** 查看审批历史 */
cb.viewmodel.u8_DispatchlistAppViewModel_vouchers_Extend.prototype.historyAction = function (viewModel, args) {
};
cb.viewmodel.u8_DispatchlistAppViewModel_vouchers_Extend.prototype.callBack = function () {
    //var commonFunc= this.commonFunc;
    //关闭页签提示保存
    if (this.isDirty()) {
        // return commonFunc.hintSave( recallBack );
        return confirm("你即将离开当前页签");
    };

};
cb.viewmodel.u8_DispatchlistAppViewModel_vouchers_Extend.prototype.init_Extend = function (viewModel) {
    /// <param name="viewModel" type="DispatchlistAppViewModel_vouchers">viewModel类型为DispatchlistAppViewModel_vouchers</param>
    cb.route.initViewPart(viewModel);
    var params = {};
    params.detailColumnCode = "u8_dispatchlistdetails"; //设置详情表格栏目
    viewModel.commonCRUD.initListViewData(params);

    var timeLine = viewModel.gettimeLine();
    timeLine.setDataSource(TimeLineData);

    if (viewModel.getbatchBusiOperateAction) {
        viewModel.getbatchBusiOperateAction().setDataSource()
    }

    cb.route.unsubscribeMessage(viewModel, "beforeTabMenuClose", this.callBack);
    cb.route.subscribeMessage(viewModel, "beforeTabMenuClose", this.callBack, viewModel);
    //需要设置columnCode viewModel.set("columnCode",columnCode);
};
