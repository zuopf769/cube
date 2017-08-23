/// <reference path="../../common/js/Cube.js" />
/// <reference path="<%=application.viewmodel.name%>_M.js" />

cb.viewmodel.<%=application.moduleName%>_<%=application.viewmodel.extendName%> = function () {};

cb.viewmodel.<%=application.moduleName%>_<%=application.viewmodel.extendName%>.prototype.doAction = function (name, viewModel) {
    if (this[name])
        this[name](viewModel);
};

cb.viewmodel.<%=application.moduleName%>_<%=application.viewmodel.extendName%>.prototype.loadDetailView =function (viewModel, params) {
    var symbol = viewModel.getSymbol();
    if (!symbol) return;
    cb.route.loadArchiveViewPart(viewModel, symbol + "App", params);
};

cb.viewmodel.<%=application.moduleName%>_<%=application.viewmodel.extendName%>.prototype.loadDetailTabView= function (viewModel, params) {
    var symbol = viewModel.getSymbol();
    if (!symbol) return;
    cb.route.loadTabViewPart(viewModel, symbol + "App", params);
 };

cb.viewmodel.<%=application.moduleName%>_<%=application.viewmodel.extendName%>.prototype.menuItemClick = function (viewModel, params) {
     if (!args || !args.type || !args.data || !args.data.appId) return;
     var url = args.data.appId;
     if (url === "homepage") location.href = cb.route.getHomepageUrl();
     else location.href = cb.route.getPageUrl(url);
};

cb.viewmodel.<%=application.moduleName%>_<%=application.viewmodel.extendName%>.prototype.cardAction =  function (viewModel) {     
     this.loadDetailView(viewModel, { "mode": "add" });
};

cb.viewmodel.<%=application.moduleName%>_<%=application.viewmodel.extendName%>.prototype.activeRowClick =  function (viewModel) {     
    viewModel.commonCRUD.loadDetailView(args);
};

cb.viewmodel.<%=application.moduleName%>_<%=application.viewmodel.extendName%>.prototype.queryScheme =  function (viewModel,args) {     
	viewModel.commonCRUD.queryScheme(args);
};

cb.viewmodel.<%=application.moduleName%>_<%=application.viewmodel.extendName%>.prototype.queryAction =  function (viewModel) {     
    cb.route.loadViewPart(viewModel, cb.route.CommonAppEnum.QueryScheme, cb.route.ViewPartType.QueryScheme);
};

cb.viewmodel.<%=application.moduleName%>_<%=application.viewmodel.extendName%>.prototype.addschemeAction = function (viewModel) {
    cb.route.loadPageViewPart(viewModel, "common.queryscheme.SchemeDetail", { width: "600px", height: "400px" });
};

cb.viewmodel.<%=application.moduleName%>_<%=application.viewmodel.extendName%>.prototype.setschemeAction = function (viewModel) {
    cb.route.loadPageViewPart(viewModel, "common.commonscheme.SchemeListManage", {width:"450px",height:"550px"});
};

cb.viewmodel.<%=application.moduleName%>_<%=application.viewmodel.extendName%>.prototype.expandAction =  function (viewModel) {     
	 viewModel.commonCRUD.expandScheme();
};

cb.viewmodel.<%=application.moduleName%>_<%=application.viewmodel.extendName%>.prototype.changePage =  function (viewModel,args) {     
    /// <param name="viewModel" type="<%=application.viewmodel.name%>">viewModel类型为"<%=application.viewmodel.name%>"</param>
	var listCard = viewModel.getModel3D();
    var querySchemeID = listCard.get("querySchemeID");        
    var pageIndex = args.pageIndex;
	var columnCode = "";	
	var filters =[];

    viewModel.commonCRUD.loadData(querySchemeID,columnCode, filters, false,"append",pageIndex); 
};

<%for(var i=0;i<application.viewmodel.actions.length;i++){%>
    cb.viewmodel.<%=application.moduleName%>_<%=application.viewmodel.extendName%>.prototype.<%=application.viewmodel.actions[i].functionName%> = function (viewModel, args) {
	    /// <param name="viewModel" type="<%=application.viewmodel.name%>">viewModel类型为<%=application.viewmodel.name%></param>
            
    };
<%}%>

cb.viewmodel.<%=application.moduleName%>_<%=application.viewmodel.extendName%>.prototype.init_Extend = function (viewModel) {
 /// <param name="viewModel" type="<%=application.viewmodel.name%>">viewModel类型为<%=application.viewmodel.name%></param>
    //默认实现  start
	cb.route.initViewPart(viewModel);
	 cb.route.initViewPart(viewModel);
    var params = {};
    params.detailColumnCode = "";//设置详情表格栏目
    viewModel.commonCRUD.initListViewData(params);

    var timeLine = viewModel.gettimeLine();
    timeLine.setDataSource(TimeLineData);

    if (viewModel.getbatchBusiOperateAction) {
        viewModel.getbatchBusiOperateAction().setDataSource()
    }

    var timeLine = viewModel.gettimeLine();
    timeLine.setDataSource(TimeLineData);

	if (viewModel.getsetAction) viewModel.getsetAction().setDataSource([
        { "name": "self", "value": "columnSet", "text": "栏目" }           
    ]);


	//需要设置columnCode viewModel.set("columnCode",columnCode);
};