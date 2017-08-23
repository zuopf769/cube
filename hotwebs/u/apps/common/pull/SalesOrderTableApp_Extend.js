/// <reference path="../../common/js/Cube.js" />
/// <reference path="SalesOrderTableApp_M.js" />

var SalesOrderTableViewModel_Extend = {
    doAction: function (name, viewModel) {
        if (this[name])
            this[name](viewModel);
    },
    loadLineItem: function (viewModel, params) {
        
    },
    returnAction: function (viewModel) {
        /// <param name="viewModel" type="ContactDetailViewModel">viewModel类型为ContactDetailViewModel</param>
        cb.route.hidePageViewPart(viewModel);
    },
    cancelAction: function (viewModel) {
        // this.loadLineItem(viewModel, { "mode": "add", "model3d": this.model3d });
        cb.route.hidePageViewPart(viewModel);
    },
    pullAction: function (viewModel) {
        // this.loadLineItem(viewModel, { "mode": "add", "model3d": this.model3d });        
        debugger;
        var parentVM = cb.route.getViewPartParams(viewModel).parentViewModel;
        var selectedTable = viewModel.getModel3D().getSelectedRows();
        if (selectedTable.length == 0) {
            alert("请选择要添加的表体信息！");
            return;
        }
        var selectedptItem = parentVM.getModel3D().getSelectedRows();
        selectedptItem[0].orderdetails = selectedTable;

        var symbol = viewModel.getSymbol();
        if (symbol != null) {
            var param = new Object();
            param.srcBillType = cb.route.getViewPartParams(parentVM).detailInfo.srcBillType;
            param.targetBillType = cb.route.getViewPartParams(parentVM).detailInfo.targetBillType;
            param.srcBillVOs = selectedptItem;   

            cb.data.CommonProxy(symbol).pullOrder(param, function (success, fail) {
                if (fail) {
                    alert("查询列表数据失败");
                    return;
                }

                var deliveryDetail = cb.route.getViewPartParams(parentVM).parentViewModel;
                deliveryDetail.loadData(success[0]);
                if (deliveryDetail.getbodyAction)
                    deliveryDetail.getbodyAction().setValue("产品(" + deliveryDetail.getModel3D().getRows().length + ")");

                cb.route.hidePageViewPart(parentVM);
                cb.route.hidePageViewPart(viewModel);
            });
        }
    },
    itemClick: function (viewModel, args) {
        /// <param name="viewModel" type="DeliveryViewModel">viewModel类型为DeliveryViewModel</param>

    },
    changePage: function (viewModel, args) {
        /// <param name="viewModel" type="DeliveryViewModel">viewModel类型为DeliveryViewModel</param>
        var symbol = viewModel.getSymbol();
        var param_filters = cb.route.getViewPartParams(viewModel).filters;
        if (symbol != null) {
            var listCard = viewModel.getModel3D();
            var pageSize = args.pageSize;
            var pageIndex = args.pageIndex;
            var param = {
                "billType": "XXXX",
                "pageIndex": pageIndex,
                "pageSize": pageSize,
                "filters": [
                    param_filters
                ]
            };
            cb.data.CommonProxy(symbol).QueryBill(param, function (success, fail) {
                if (fail) {
                    alert("查询列表数据失败");
                    return;
                }
                success.mode = "override";
                var columns = { "mode": "archives", "fields": success.meta };
                listCard.setData(columns);
                listCard.setPageRows(success)
            });
        }
    },
    init_Extend: function (viewModel) {
        /// <param name="viewModel" type="DeliveryViewModel">viewModel类型为DeliveryViewModel</param>
        debugger;
        var param_filters = cb.route.getViewPartParams(viewModel).filters;

        var listCard = viewModel.getModel3D();
        var symbol = viewModel.getSymbol();
        if (symbol != null) {

            var param = {
                "billType": "XXXX",
                "pageIndex": 1,
                "pageSize": 15,
                "filters": [
                    param_filters
                ]
            };

            cb.data.CommonProxy(symbol).QueryBill(param, function (success, fail) {
                if (fail) {
                    alert("查询列表数据失败");
                    return;
                }
                debugger;
                success.mode = "override";
                var columns = { "mode": "archives", "fields": success.meta };
                listCard.setData(columns);
                listCard.setPageRows(success)
            });
        }
    }
};
