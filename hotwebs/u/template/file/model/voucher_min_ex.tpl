/// <reference path="../../common/js/Cube.js" />
/// <reference path="<#=name#>_M.js" />

<#*(viewModel:viewModels){#>
var <#=extendName#> = {
    doAction: function (name, viewModel) {
        if (this[name])
            this[name](viewModel);
    },
    bodyAction: function (viewModel, args) {
        /// <param name="viewModel" type="<#=viewModel#>">viewModel类型为<#=viewModel#></param>
        cb.route.loadPageViewPart(viewModel, cb.route.CommonAppEnum.SubLine, { mode: this.mode });
    },	
	prevAction: function (viewModel, args) {
        /// <param name="viewModel" type="<#=viewModel#>">viewModel类型为<#=viewModel#></param>
        alert(args + "功能正在开发中...");
    },
	nextAction: function (viewModel, args) {
        /// <param name="viewModel" type="<#=viewModel#>">viewModel类型为<#=viewModel#></param>
        alert(args + "功能正在开发中...");
    },
	tabMenuClick: function (viewModel, args) {
        
    },
    <#*(action:actions){#>
    <#=functionName#>: function (viewModel, args) {
        /// <param name="viewModel" type="<#=viewModel#>">viewModel类型为<#=viewModel#></param>
        alert(args + "功能正在开发中...");
    },
    <#}#>
    init_Extend: function (viewModel) {
        /// <param name="viewModel" type="<#=name#>">viewModel类型为<#=name#></param>
		var params = cb.route.getViewPartParams(viewModel);
        if (!params) return;
        this.symbol = viewModel.getSymbol();
        if (!this.symbol) return;
        this.mode = params.mode;
        if (!this.mode) return;

		var crud = new cb.data.commonCRUD(viewModel);        

        if (this.mode === "add") {
			crud.add();         
        }
        else if (this.mode === "view") {
			crud.modify(params);            
        }
    }
};
<#}#>