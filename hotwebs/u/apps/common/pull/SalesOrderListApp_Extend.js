/// <reference path="../../common/js/Cube.js" />
/// <reference path="SalesOrderListApp_M.js" />

var SalesOrderListViewModel_Extend = {
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
    addAction: function (viewModel) {
        // this.loadLineItem(viewModel, { "mode": "add", "model3d": this.model3d });
    },
    itemClick: function (viewModel, args) {
        /// <param name="viewModel" type="DeliveryViewModel">viewModel类型为DeliveryViewModel</param>
        debugger;
        var listCard = viewModel.getModel3D();
        var pk = listCard.get("primaryKey");
        var value = listCard.getSelectedRows().length == 0 ? null : listCard.getSelectedRows()[0][pk];

        var param = { "code": pk, "name": null, "value": value };

        cb.route.loadPageViewPart(viewModel, "common.pull.SalesOrderTableApp", { "filters": param });
    },
    changePage: function (viewModel, args) {
        /// <param name="viewModel" type="DeliveryViewModel">viewModel类型为DeliveryViewModel</param>
        var symbol = viewModel.getSymbol();
        if (symbol != null) {
            var listCard = viewModel.getModel3D();
            var pageSize = args.pageSize;
            var pageIndex = args.pageIndex;
            cb.data.CommonProxy(symbol).QueryBill({
                "billType": "XXXX",
                "pageSize": pageSize,
                "pageIndex": pageIndex,
                "filters": null
            }, function (success, fail) {
                if (fail) {
                    alert("查询列表数据失败");
                    return;
                }
                success.mode = "append";
                listCard.setPageRows(success)
            });
        }
    },
    init_Extend: function (viewModel) {
        /// <param name="viewModel" type="DeliveryViewModel">viewModel类型为DeliveryViewModel</param>
        var listCard = viewModel.getModel3D();
        var symbol = viewModel.getSymbol();
        if (symbol != null) {
            cb.data.CommonProxy(symbol).QueryBill({
                "billType": "XXXX",
                "pageIndex": 1,
                "pageSize": 15,
                "filters": null
            }, function (success, fail) {
                if (fail) {
                    alert("查询列表数据失败");
                    return;
                }
                success.mode = "override";
                listCard.set("primaryKey", success.meta.pk);
                var columns = { "mode": "archives", "fields": success.meta };
                listCard.setData(columns);
                listCard.setPageRows(success)
            });
        }
    }
};
