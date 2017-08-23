/// <reference path="../../common/js/Cube.js" />
/// <reference path="<%=application.viewmodel.name%>_M.js" />

cb.viewmodel.<%=application.moduleName%>_<%=application.viewmodel.extendName%> = function () {};
cb.viewmodel.<%=application.moduleName%>_<%=application.viewmodel.extendName%>.prototype.doAction = function (name, viewModel) {
    if (this[name])
        this[name](viewModel);
};

cb.viewmodel.<%=application.moduleName%>_<%=application.viewmodel.extendName%>.prototype.bodyAction =  function (viewModel, args) {
     /// <param name="viewModel" type="<%=application.viewmodel.name%>">viewModel类型为<%=application.viewmodel.name%></param>
        cb.route.loadPageViewPart(viewModel, cb.route.CommonAppEnum.SubLine, { mode: this.mode });
};

cb.viewmodel.<%=application.moduleName%>_<%=application.viewmodel.extendName%>.prototype.prevAction = function (viewModel, args) {
	 /// <param name="viewModel" type="<%=application.viewmodel.name%>">viewModel类型为<%=application.viewmodel.name%></param>
        alert(args + "功能正在开发中...");
};

cb.viewmodel.<%=application.moduleName%>_<%=application.viewmodel.extendName%>.prototype.prevAction = function (viewModel, args) {
	 /// <param name="viewModel" type="<%=application.viewmodel.name%>">viewModel类型为<%=application.viewmodel.name%></param>
        alert(args + "功能正在开发中...");
};

cb.viewmodel.<%=application.moduleName%>_<%=application.viewmodel.extendName%>.prototype.tabMenuClick = function (viewModel, args) {
	 
};

<%for(var i=0;i<application.viewmodel.actions.length;i++){%>
    cb.viewmodel.<%=application.moduleName%>_<%=application.viewmodel.extendName%>.prototype.<%=application.viewmodel.actions[i].functionName%>= function (viewModel, args) {
		/// <param name="viewModel" type="<%=application.viewmodel.name%>">viewModel类型为<%=application.viewmodel.name%></param>
	};	
<%}%>

cb.viewmodel.<%=application.moduleName%>_<%=application.viewmodel.extendName%>.prototype.init_Extend = function (viewModel) {
	 /// <param name="viewModel" type="<%=application.viewmodel.name%>">viewModel类型为<%=application.viewmodel.name%></param>
	var params = cb.route.getViewPartParams(viewModel);
    if (!params) return;
    this.symbol = viewModel.getSymbol();
    if (!this.symbol) return;
    this.mode = params.mode;
    if (!this.mode) return;		        

    if (this.mode === "add") {
		viewModel.commonCRUD.add();         
    }
    else if (this.mode === "view") {
		viewModel.commonCRUD.browse(params);            
    }   
};