/// <reference path="../../common/js/Cube.js" />
/// <reference path="DeliveryApp_M.js" />
var BusiConditionViewModel_Extend = {
    doAction: function (name, viewModel) {
        if (this[name])
            this[name](viewModel);
    },
    init_Extend: function (viewModel) {
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
                cb.route.hidePageViewPart(viewModel);
                if (success.length == 0) {
                    alert("当前数据为空");
                }
                else {
                    for (var i = 0; i < success.logs.length; i++) {
                        if (success.logs[i].logdate == null) { }
                        else {
                            success.logs[i].logdate = success.logs[i].logdate.split(" ")[0];
                        };
                    }
                }
                cb.route.getViewPartParams(viewModel).parentViewModel.getloginlogManages().setDataSource(success.logs);
            };
        });
    },
    OperaDate_combobox: function (viewModel, args) {
        if (viewModel.getOperaDate_combobox().getValue() == "equal") {
            viewModel.getOperaDate_datebox1().set("enabled", false);
        }
        else {
            viewModel.getOperaDate_datebox1().set("enabled", true);
        }
    },
};


