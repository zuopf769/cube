/// <reference path="../../common/js/Cube.js" />
/// <reference path="customerAppViewModel_archives_M.js" />

cb.viewmodel.u8_customerAppViewModel_archives_Extend = function () {};
cb.viewmodel.u8_customerAppViewModel_archives_Extend.prototype.doAction = function (name, viewModel) {
    if (this[name])
        this[name](viewModel);
};
cb.viewmodel.u8_customerAppViewModel_archives_Extend.prototype.loadDetailView = function (viewModel, params) {
    var symbol = viewModel.getSymbol();
    if (!symbol) return;
    cb.route.loadArchiveViewPart(viewModel, symbol + "DetailApp", params);
};
cb.viewmodel.u8_customerAppViewModel_archives_Extend.prototype.loadDetailTabView = function (viewModel, params) {
    var symbol = viewModel.getSymbol();
    if (!symbol) return;
    cb.route.loadTabViewPart(viewModel, symbol + "DetailApp", params);
};
cb.viewmodel.u8_customerAppViewModel_archives_Extend.prototype.menuItemClick = function (viewModel, args) {
    if (!args || !args.type || !args.data || !args.data.appId) return;
    var url = args.data.appId;
    if (url === "homepage") location.href = cb.route.getHomepageUrl();
    else location.href = cb.route.getPageUrl(url);
};
cb.viewmodel.u8_customerAppViewModel_archives_Extend.prototype.menuAction = function (viewModel) {
    cb.route.toggleViewPart(viewModel, cb.route.CommonAppEnum.Catalog, cb.route.ViewPartType.Catalog, { animation: { duration: 500 }, callback: this.querySchemeByCode, context: this });
};
cb.viewmodel.u8_customerAppViewModel_archives_Extend.prototype.cardAction = function (viewModel) {
    this.loadDetailView(viewModel, { "mode": "add" });
};
cb.viewmodel.u8_customerAppViewModel_archives_Extend.prototype.queryData = function (viewModel, params) {

};
cb.viewmodel.u8_customerAppViewModel_archives_Extend.prototype.queryScheme = function (viewModel, args) {
    var listCard = viewModel.getModel3D();
    var querySchemeID = args && args.queryschemeID;
    listCard.set("querySchemeID", querySchemeID);
    this.queryData(viewModel, { querySchemeID: querySchemeID });
};
cb.viewmodel.u8_customerAppViewModel_archives_Extend.prototype.querySchemeByCode = function (viewModel, args) {
    this.queryData(viewModel, args);
};
cb.viewmodel.u8_customerAppViewModel_archives_Extend.prototype.searchAction = function (viewModel, args) {
    alert("搜索" + args + "...");
};
cb.viewmodel.u8_customerAppViewModel_archives_Extend.prototype.queryAction = function (viewModel) {
    cb.route.loadViewPart(viewModel, cb.route.CommonAppEnum.QueryScheme, cb.route.ViewPartType.QueryScheme);
};
cb.viewmodel.u8_customerAppViewModel_archives_Extend.prototype.timeItemClick = function (viewModel, args) {
    //debugger;
};
cb.viewmodel.u8_customerAppViewModel_archives_Extend.prototype.expandAction = function (viewModel) {
     cb.route.toggleViewPart(viewModel, cb.route.CommonAppEnum.QueryScheme, cb.route.ViewPartType.QueryScheme, { animation: { mode: "toggle" } });
}

    cb.viewmodel.u8_customerAppViewModel_archives_Extend.prototype.addAction = function (viewModel, args) {
        ///<param name="viewModel" type="customerAppViewModel_archives">viewModel类型为</param>
    };

    cb.viewmodel.u8_customerAppViewModel_archives_Extend.prototype.editAction = function (viewModel, args) {
        ///<param name="viewModel" type="customerAppViewModel_archives">viewModel类型为</param>
    };

    cb.viewmodel.u8_customerAppViewModel_archives_Extend.prototype.batchDeleteAction = function (viewModel, args) {
        ///<param name="viewModel" type="customerAppViewModel_archives">viewModel类型为</param>
    };

    cb.viewmodel.u8_customerAppViewModel_archives_Extend.prototype.configAction = function (viewModel, args) {
        ///<param name="viewModel" type="customerAppViewModel_archives">viewModel类型为</param>
    };

    cb.viewmodel.u8_customerAppViewModel_archives_Extend.prototype.dblClickRow = function (viewModel, args) {
        ///<param name="viewModel" type="customerAppViewModel_archives">viewModel类型为</param>
    };

    cb.viewmodel.u8_customerAppViewModel_archives_Extend.prototype.treeBeforeExpand = function (viewModel, args) {
        ///<param name="viewModel" type="customerAppViewModel_archives">viewModel类型为</param>
    };

    cb.viewmodel.u8_customerAppViewModel_archives_Extend.prototype.treeClick = function (viewModel, args) {
        ///<param name="viewModel" type="customerAppViewModel_archives">viewModel类型为</param>
        /*var commonFunc= viewModel.commonFunc;
        commonFunc.treeClick(args.inputData);
        args.cancel = true;*/
    };

    cb.viewmodel.u8_customerAppViewModel_archives_Extend.prototype.treeMoreClick = function (viewModel, args) {
        ///<param name="viewModel" type="customerAppViewModel_archives">viewModel类型为</param>
    };

cb.viewmodel.u8_customerAppViewModel_archives_Extend.prototype.callBack= function (){

    var commonFunc= this.commonFunc;

    //关闭页签提示保存
    if(this.isDirty()) {
    // return commonFunc.hintSave( recallBack );
      return confirm("你即将离开当前页签");
    };
}
cb.viewmodel.u8_customerAppViewModel_archives_Extend.prototype.initializeOneTime = function (viewModel) {
    //debugger;
    /*viewModel.on("afterTreeClick", function (){
            setTimeout(function (){
                alert(1)
            },2000)
        })*/
};
cb.viewmodel.u8_customerAppViewModel_archives_Extend.prototype.init_Extend = function (viewModel) {
    /// <param name="viewModel" type="customerAppViewModel_archives">viewModel类型为</param>
    cb.route.initViewPart(viewModel);

    var listCard = viewModel.getModel3D();
    listCard.setPageSize(15);
    //初始化刷新树和列表
	var commonFunc= viewModel.commonFunc;
    commonFunc.listRefresh();
    commonFunc.treeRefresh();
    //添加设置下拉框

    if (viewModel.getconfigAction) viewModel.getconfigAction().setDataSource([
        { "name": "self", "category": "columnSet", "default": "", "value": "columnSet", "type": "popPageBtn", "text": "栏目" },
        {
            "name": "autoWrap", "category": "autoWrap", "default": true, "value": "autoWrap", "type": "checkBoxBtn",
            "text": "自动换行"
        },
        {
            "name": "subTotal", "category": "total", "default": false, "value": "subTotal", "type": "checkBoxBtn",
            "text": "显示小计"
        },
        {
            "name": "combineTotal", "category": "total", "default": false, "value": "combineTotal", "type": "checkBoxBtn",
            "text": "显示合计"
        },
        {
            "name": "fontSet", "id":"fontSet", "default":false, "type": "menuBtn", "value": [
              { "name": "fontSet-smaller", "type": "checkBoxBtn", "default": false, "value": "fontSet-smaller", "text": "小号字体" },
              { "name": "fontSet-normal", "type": "checkBoxBtn", "default": true, "value": "fontSet-normal", "text": "正常字体" },
              { "name": "fontSet-big", "type": "checkBoxBtn", "default": false, "value": "fontSet-big", "text": "大号字体" }
            ], "text": "列表字号"
        }
    ]);
    if (viewModel.getbatchBusiOperateAction) {
        viewModel.getbatchBusiOperateAction().setDataSource()
    }
    //页签关闭提示
    cb.route.unsubscribeMessage(viewModel, "beforeTabMenuClose", this.callBack);
    cb.route.subscribeMessage(viewModel, "beforeTabMenuClose", this.callBack, viewModel);
};