/// <reference path="../../common/js/Cube.js" />
/// <reference path="<#=name#>_M.js" />

<#*(viewModel:viewModels){#>
var <#=extendName#> = {
	doAction: function (name, viewModel) {
        if (this[name])
            this[name](viewModel);
    },
    <#*(action:actions){#>
    <#=functionName#>: function (viewModel, args) {
        /// <param name="viewModel" type="<#=viewModel#>">viewModel类型为<#=viewModel#></param>
        
    },
    <#}#>
	queryData: function (viewModel, nodeCode, pageSize, pageIndex, callBack) {
        <#*(entity:entities)?(isMain==true){#>
		<#*(field:fields)?(ctrlType==Tree){#>
		var symbol = viewModel.getSymbol();
        if (symbol != null) {
            cb.data.CommonProxy("UAP").QueryTree({
                "treeFunctionId": "<#=treeFunctionId#>",
                "querySchemeID": "",
                "nodeCode": nodeCode,
                "pageSize": pageSize,
                "pageIndex": pageIndex,
                "maxLevel": 3
            }, callBack);
        }
		<#}#>
		<#}#>
    },
    init_Extend: function (viewModel) {
        /// <param name="viewModel" type="<#=name#>">viewModel类型为<#=name#></param>
		<#*(entity:entities)?(isMain==true){#>
		<#*(field:fields)?(ctrlType==Tree){#>
		this.ch = new cb.util.CatalogHelper(viewModel.get<#=name#>(), 10);
		this.ch.init("", viewModel, this.queryData);
		<#}#>
		<#}#>
    }
};
<#}#>