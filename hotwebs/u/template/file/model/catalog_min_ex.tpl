/// <reference path="../../common/js/Cube.js" />
/// <reference path="<#=name#>_M.js" />

<#*(viewModel:viewModels){#>
var <#=extendName#> = {
    doAction: function (name, viewModel) {
        if (this[name])
            this[name](viewModel);
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
        cb.model.PropertyChange.delayPropertyChange(true);
        viewModel.clear();
        if (this.mode === "add") {
            if (viewModel.getsaveAction) viewModel.getsaveAction().setDisabled(false);
            if (viewModel.geteditAction) viewModel.geteditAction().setDisabled(true);
            if (viewModel.getcancelAction) viewModel.getcancelAction().setDisabled(false);
            if (viewModel.getdeleteAction) viewModel.getdeleteAction().setDisabled(true);
            viewModel.setReadOnly(false);
            cb.model.PropertyChange.doPropertyChange();
        }
        else if (this.mode === "view") {
            if (viewModel.getsaveAction) viewModel.getsaveAction().setDisabled(true);
            if (viewModel.geteditAction) viewModel.geteditAction().setDisabled(false);
            if (viewModel.getcancelAction) viewModel.getcancelAction().setDisabled(true);
            if (viewModel.getdeleteAction) viewModel.getdeleteAction().setDisabled(false);
            cb.data.CommonProxy(this.symbol).QueryByCode({ code: params.code }, function (success, fail) {
                if (fail) {
                    alert("读取数据失败");
                    return;
                }
                viewModel.loadData(success);
                viewModel.setReadOnly(true);
                cb.model.PropertyChange.doPropertyChange();
            });
        }
    }
};
<#}#>