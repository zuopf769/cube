/// <reference path="../../common/js/Cube.js" />
/// <reference path="DeliveryApp_M.js" />
var LogManageConditionViewModel_Extend = {
    doAction: function (name, viewModel) {
        if (this[name])
            this[name](viewModel);
    },
    init_Extend: function (viewModel) {
        viewModel.getManageDate_textbox().setValue("操作日期");
        viewModel.getUser_textbox().setValue("用户");
        viewModel.getButtonName_textbox().setValue("按钮名称");
        viewModel.getButtonName_textbox().setReadOnly(true);
        viewModel.getUser_textbox().setReadOnly(true);
        viewModel.getManageDate_textbox().setReadOnly(true);
    },
    cancelAction: function (viewModel) {
        cb.route.hidePageViewPart(viewModel);
    },
    confirmAction: function (viewModel) {
        var params = cb.route.getViewPartParams(viewModel).params;
        cb.util.loadingControl.startControl();
        viewModel.getProxy().GetInformation(params, function (success, fail) {
            cb.util.loadingControl.endControl();
            if (fail) {
                alert(fail.error);
            }
            else if (success) {
                if (success.length == 0) {
                    alert("当前数据为空");
                }
                cb.route.hidePageViewPart(viewModel);
                for (var i = 0; i < success.logs.length; i++) {
                    if (success.logs[i].logdate == null) { }
                    else {
                        success.logs[i].logdate = success.logs[i].logdate.split(" ")[0];
                    };
                }
                cb.route.getViewPartParams(viewModel).parentViewModel.getlogManages().setDataSource(success.logs);
            };
        });
    },
    ManageDate_combobox: function (viewModel, args) {
        if (viewModel.getManageDate_combobox().getValue() == "equal") {
            viewModel.getManageDate_datebox1().set("enabled",false);
        }
        else {
            viewModel.getManageDate_datebox1().set("enabled", true);
        }
    }
};


