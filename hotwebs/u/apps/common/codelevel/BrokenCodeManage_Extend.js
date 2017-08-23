/// <reference path="../../../common/js/Cube.js" />
/// <reference path="BrokenCodeManage_L.js" />
var BrokenCodeManageViewModel_Extend = {
    doAction: function (name, viewModel) {
        if (this[name])
            this[name](viewModel);
    },
    init_Extend: function (viewModel) {
        var param = {"pk_rulebase":cb.route.getViewPartParams(viewModel).baseData.pk_billcodebase};
        viewModel.getProxy().BrokenCodeManageQuery(param, function (success, fail) {
            if (success) {
                viewModel.getBrokenCodeManageGrid().setData(success);
            }
        })
    },
    CloseAction: function (viewModel, args) {
        cb.route.hidePageViewPart(viewModel);
    },
    DetermineAction: function (viewModel, args) {
        this.CloseAction(viewModel)
    },
    BrokenCodeGridAction: function (viewModel, args) {
    },
};
