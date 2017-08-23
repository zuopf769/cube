/// <reference path="../../common/js/Cube.js" />
/// <reference path="DeliveryApp_M.js" />
var UpgradeViewModel_Extend = {
    doAction: function (name, viewModel) {
        if (this[name])
            this[name](viewModel);
    },
    init_Extend: function (viewModel) {        //得到需要升级的模块树
        var param = {
            dataSourceName: cb.route.getViewPartParams(viewModel).dsName      //数据源
        };
        viewModel.getProxy().GetUpdateAcount(param, function (success, fail) {
            function recursion(arr) {
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].canSelected == false) {
                        arr.remove(i);
                        i--;
                    }
                    else {
                        if (arr[i].children.length > 0) {
                            recursion(arr[i].children);
                        }
                    }
                }
            }
            if (success) {
                recursion(success);
                var succ = success.filter(function (item, index, Array) {
                    return (item.children.length != 0);
                });
                if (succ.length == 0) {
                    cb.util.warningMessage("系统是最新版本，无需升级","", okCall);
                    function okCall() {
                        cb.route.hidePageViewPart(viewModel);
                    };
                }
                else {
                    viewModel.getupgradeData().setDataSource(succ);
                };
            }
            else {
                cb.util.warningMessage("加载失败","", okCall);
                function okCall() {
                    viewModel.getupgradeData().setDataSource([]);
                    cb.route.hidePageViewPart(viewModel);
                };
            }
        });
    },
    confirmAction: function (viewModel) {
        //$("#shadow").show();
		cb.util.loadingControl.startControl();
        var params = {
            dataSourceName: cb.route.getViewPartParams(viewModel).dsName
        };
        var pathArray = viewModel.getupgradeData().getDataSource();
        var path = [];
        for (var i = 0; i < pathArray.length; i++) {
            for (var j = 0; j < pathArray[i].children.length; j++) {
                path.push(pathArray[i].children[j].moduleConfig.configFilePath);
            }
        };
        params.path = path;
        function callback() {
            viewModel.getProxy().GetdoInstallAcount(params, function (success, fail) {
                if (success) {
                    if (success == "installing") {
                        setTimeout(callback(), 3000);
                    }
                    else {
                        //$("#shadow").hide();
						cb.util.loadingControl.endControl();
                        viewModel.getupgradeData().setDataSource([]);
                        cb.route.hidePageViewPart(viewModel);
                        alert("升级成功, 请重新启用中间件!");
                    }
                }
                else {
                    //$("#shadow").hide();
					cb.util.loadingControl.endControl();
					if(fail.error)
						alert(fail.error);
					else
						alert(fail.msgContent);
                };
            });
        };
        callback();
    },
    cancelAction: function (viewModel) {
        viewModel.getupgradeData().setDataSource([]);
        cb.route.hidePageViewPart(viewModel);
    },
};