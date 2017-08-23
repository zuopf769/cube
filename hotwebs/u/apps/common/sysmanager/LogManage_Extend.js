/// <reference path="../../common/js/Cube.js" />
/// <reference path="DeliveryApp_M.js" />

var LogManageViewModel_Extend = {
    doAction: function (name, viewModel) {
        if (this[name])
            this[name](viewModel);
    },
    init_Extend: function (viewModel) {
        viewModel.setReadOnly(true);
        viewModel.getcombobox().setReadOnly(false);
        params = {};
        viewModel.getProxy().GetApplicationMenus(params, function (success, fail) {//服务请求成功
            if (fail) {
                cb.util.warningMessage("数据源请求失败");
            }
            else if (success.length > 0) {
                for (var i = 0; i < success.length; i++) {
                    success[i].text = success[i].code;
                }
                viewModel.getcombobox().setDataSource(success);
				viewModel.getcombobox().setValue(success[0].text);
            }
            else {
                cb.util.warningMessage("数据源为空，请先创建应用库");
            };
        });
      
    },
    searchAction: function (viewModel) {
        var index = viewModel.getcombobox().getValue();
        if (index == undefined) {
            alert("请选择应用系统");
        }
        else {
            var params = {
                "busiCenterCode": index,
                "conditions": [],
                "logtype": { "type": "1" }     //日志类型： 0 为登录日志，1为功能日志
            };
            cb.route.loadPageViewPart(viewModel, "common.sysmanager.LogManageConditionApp", { height: "50%", width: '780px', params: params });
        }
    }
};
