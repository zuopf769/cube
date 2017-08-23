/// <reference path="../../common/js/Cube.js" />
/// <reference path="DeliveryDetailApp_M.js" />

var DeliveryDetailViewModel_Extend = {
    doAction: function (name, viewModel) {
        if (this[name])
            this[name](viewModel);
    },
    bodyAction: function (viewModel, args) {
        /// <param name="viewModel" type="DeliveryDetailViewModel">viewModel类型为DeliveryDetailViewModel</param>
        cb.route.loadPageViewPart(viewModel, cb.route.CommonAppEnum.SubLine, { mode: this.mode });
    },
    searchAction: function (viewModel, args) {
        /// <param name="viewModel" type="DeliveryDetailViewModel">viewModel类型为DeliveryDetailViewModel</param>
        alert(args + "功能正在开发中...");
    },
    prevAction: function (viewModel, args) {
        /// <param name="viewModel" type="DeliveryDetailViewModel">viewModel类型为DeliveryDetailViewModel</param>
        alert(args + "功能正在开发中...");
    },
    nextAction: function (viewModel, args) {
        /// <param name="viewModel" type="DeliveryDetailViewModel">viewModel类型为DeliveryDetailViewModel</param>
        alert(args + "功能正在开发中...");
    },
    tabMenuClick: function (viewModel, args) {

    },
    addAction: function (viewModel, args) {
        /// <param name="viewModel" type="DeliveryDetailViewModel">viewModel类型为DeliveryDetailViewModel</param>
        if (!args) return;
        switch (args) {
            case "blank":
                if (viewModel.getsaveAction) viewModel.getsaveAction().setDisabled(false);
                if (viewModel.geteditAction) viewModel.geteditAction().setDisabled(true);
                if (viewModel.getcancelAction) viewModel.getcancelAction().setDisabled(false);
                if (viewModel.getaddLineAction) viewModel.getaddLineAction().setDisabled(false);
                viewModel.newRecord();
                if (viewModel.getbodyAction) viewModel.getbodyAction().setValue("产品(0)");
                viewModel.setReadOnly(false);
                break;
            case "contract":
                var filters = [{ "code": "id", "value": viewModel.getPkValue()}];
                cb.route.loadPageViewPart(viewModel, cb.route.CommonAppEnum.Pull,
                    {
                        //'srcBillType': "SA02",
                        //'targetBillType': "TA01",
                        //'mainColumnCode': '',
                        //'subColumnCode': '',
                        //'columnCode': '',
                        //'filters': filters

                        'srcBillType': "SA01",
                        'targetBillType': "SA02",
                        'mainColumnCode': 'SA01',
                        'subColumnCode': 'SADetail01',
                        'columnCode': '',
                        'filters': filters
                    });
                break;
        }
    },
    copyAction: function (viewModel, args) {
        /// <param name="viewModel" type="DeliveryDetailViewModel">viewModel类型为DeliveryDetailViewModel</param>

    },
    draftAction: function (viewModel, args) {
        /// <param name="viewModel" type="DeliveryDetailViewModel">viewModel类型为DeliveryDetailViewModel</param>
        alert(args + "功能正在开发中...");
    },
    editAction: function (viewModel, args) {
        /// <param name="viewModel" type="DeliveryDetailViewModel">viewModel类型为DeliveryDetailViewModel</param>
        if (viewModel.getsaveAction) viewModel.getsaveAction().setDisabled(false);
        if (viewModel.geteditAction) viewModel.geteditAction().setDisabled(true);
        if (viewModel.getcancelAction) viewModel.getcancelAction().setDisabled(false);
        if (viewModel.getaddLineAction) viewModel.getaddLineAction().setDisabled(false);
        viewModel.setReadOnly(false);
    },
    submitAction: function (viewModel, args) {
        /// <param name="viewModel" type="DeliveryDetailViewModel">viewModel类型为DeliveryDetailViewModel</param>

    },
    withdrawAction: function (viewModel, args) {
        /// <param name="viewModel" type="DeliveryDetailViewModel">viewModel类型为DeliveryDetailViewModel</param>

    },
    approveAction: function (viewModel, args) {
        /// <param name="viewModel" type="DeliveryDetailViewModel">viewModel类型为DeliveryDetailViewModel</param>

    },
    unapproveAction: function (viewModel, args) {
        /// <param name="viewModel" type="DeliveryDetailViewModel">viewModel类型为DeliveryDetailViewModel</param>

    },
    deleteAction: function (viewModel, args) {
        /// <param name="viewModel" type="DeliveryDetailViewModel">viewModel类型为DeliveryDetailViewModel</param>

    },
    outboundAction: function (viewModel, args) {
        /// <param name="viewModel" type="DeliveryDetailViewModel">viewModel类型为DeliveryDetailViewModel</param>
        var billType = "SA02";
        var filters = [{ "code": "id", "value": viewModel.getPkValue()}];
        cb.route.loadPageViewPart(viewModel, cb.route.CommonAppEnum.Push, {
            "srcBillType": 'SA02',
            "targetBillType": 'TA01',
            "columnCode": 'SA02',
            //"billType": billType,
            "filters": filters
        });
    },
    relatedAction: function (viewModel, args) {
        /// <param name="viewModel" type="DeliveryDetailViewModel">viewModel类型为DeliveryDetailViewModel</param>
        var $part = $(".related-part");
        if (!$part.length) return;
        var pageUrl = cb.route.getPageUrl("common.related.CustomerRelated");
        $part.loadView(pageUrl, function () {
            $part.directRight2();
        });
    },
    setAction: function (viewModel, args) {
        /// <param name="viewModel" type="DeliveryDetailViewModel">viewModel类型为DeliveryDetailViewModel</param>
        alert(args + "功能正在开发中...");
    },
    printAction: function (viewModel, args) {
        /// <param name="viewModel" type="DeliveryDetailViewModel">viewModel类型为DeliveryDetailViewModel</param>
        alert(args + "功能正在开发中...");
    },
    outputAction: function (viewModel, args) {
        /// <param name="viewModel" type="DeliveryDetailViewModel">viewModel类型为DeliveryDetailViewModel</param>
        alert(args + "功能正在开发中...");
    },
    getorderAction: function (viewModel, args) {
        /// <param name="viewModel" type="DeliveryDetailViewModel">viewModel类型为DeliveryDetailViewModel</param>
        cb.route.loadPageViewPart(viewModel, cb.route.CommonAppEnum.Pull, { model3d: viewModel.getModel3D(), detailInfo: { srcBillType: "SA01", targetBillType: "SA02"} });
    },
    cancelAction: function (viewModel, args) {
        /// <param name="viewModel" type="DeliveryDetailViewModel">viewModel类型为DeliveryDetailViewModel</param>
        if (viewModel.getsaveAction) viewModel.getsaveAction().setDisabled(true);
        if (viewModel.geteditAction) viewModel.geteditAction().setDisabled(false);
        if (viewModel.getcancelAction) viewModel.getcancelAction().setDisabled(true);
        if (viewModel.getaddLineAction) viewModel.getaddLineAction().setDisabled(true);
    },
    saveAction: function (viewModel, args) {
        /// <param name="viewModel" type="DeliveryDetailViewModel">viewModel类型为DeliveryDetailViewModel</param>

    },
    insertLineAction: function (viewModel, args) {
        /// <param name="viewModel" type="DeliveryDetailViewModel">viewModel类型为DeliveryDetailViewModel</param>

    },
    copyLineAction: function (viewModel, args) {
        /// <param name="viewModel" type="DeliveryDetailViewModel">viewModel类型为DeliveryDetailViewModel</param>

    },
    divideLineAction: function (viewModel, args) {
        /// <param name="viewModel" type="DeliveryDetailViewModel">viewModel类型为DeliveryDetailViewModel</param>
        alert(args + "功能正在开发中...");
    },
    deleteLineAction: function (viewModel, args) {
        /// <param name="viewModel" type="DeliveryDetailViewModel">viewModel类型为DeliveryDetailViewModel</param>

    },
    batchEditAction: function (viewModel, args) {
        /// <param name="viewModel" type="DeliveryDetailViewModel">viewModel类型为DeliveryDetailViewModel</param>
        alert(args + "功能正在开发中...");
    },
    stockAction: function (viewModel, args) {
        /// <param name="viewModel" type="DeliveryDetailViewModel">viewModel类型为DeliveryDetailViewModel</param>
        alert(args + "功能正在开发中...");
    },
    priceAction: function (viewModel, args) {
        /// <param name="viewModel" type="DeliveryDetailViewModel">viewModel类型为DeliveryDetailViewModel</param>
        alert(args + "功能正在开发中...");
    },
    discountAction: function (viewModel, args) {
        /// <param name="viewModel" type="DeliveryDetailViewModel">viewModel类型为DeliveryDetailViewModel</param>
        alert(args + "功能正在开发中...");
    },
    creditAction: function (viewModel, args) {
        /// <param name="viewModel" type="DeliveryDetailViewModel">viewModel类型为DeliveryDetailViewModel</param>
        alert(args + "功能正在开发中...");
    },
    optionalPopAction: function (viewModel, args) {
        /// <param name="viewModel" type="DeliveryDetailViewModel">viewModel类型为DeliveryDetailViewModel</param>
        alert(args + "功能正在开发中...");
    },
    setLineAction: function (viewModel, args) {
        /// <param name="viewModel" type="DeliveryDetailViewModel">viewModel类型为DeliveryDetailViewModel</param>
        alert(args + "功能正在开发中...");
    },
    init_Extend: function (viewModel) {
        /// <param name="viewModel" type="DeliveryDetailViewModel">viewModel类型为DeliveryDetailViewModel</param>
        if (viewModel.getapprovestatus) viewModel.getapprovestatus().setDataSource([
            { "name": "free", "value": -1, "text": "自由" },
            { "name": "obsolete", "value": 0, "text": "审批未通过" },
            { "name": "reviewed", "value": 1, "text": "审批通过" },
            { "name": "reviewing", "value": 2, "text": "审批中" },
            { "name": "commit", "value": 3, "text": "已提交" }
        ]);
        if (viewModel.getaddAction) viewModel.getaddAction().setDataSource([
            { "name": "self", "value": "blank", "text": "增加空白单据" },
            { "name": "pull", "value": "opportunity", "text": "从销售机会生成" },
            { "name": "pull", "value": "contract", "text": "从销售合同生成" },
            { "name": "pull", "value": "quotation", "text": "从销售报价生成" },
            { "name": "pull", "value": "schedule", "text": "从销售预定生成" }
        ]);

        var params = cb.route.getViewPartParams(viewModel);
        if (!params) return;
        this.symbol = viewModel.getSymbol();
        if (!this.symbol) return;
        this.mode = params.mode;
        if (!this.mode) return;

        cb.model.PropertyChange.delayPropertyChange(true);

        if (this.mode === "add") {
            if (viewModel.getsaveAction) viewModel.getsaveAction().setDisabled(false);
            if (viewModel.geteditAction) viewModel.geteditAction().setDisabled(true);
            if (viewModel.getcancelAction) viewModel.getcancelAction().setDisabled(false);
            if (viewModel.getaddLineAction) viewModel.getaddLineAction().setDisabled(false);
            if (viewModel.getoutboundAction) viewModel.getoutboundAction().setDisabled(true);
            viewModel.newRecord();
            if (viewModel.getbodyAction) viewModel.getbodyAction().setValue("产品(0)");
            viewModel.setReadOnly(false);

            cb.model.PropertyChange.doPropertyChange();
        }
        else if (this.mode === "view") {
            if (viewModel.getsaveAction) viewModel.getsaveAction().setDisabled(true);
            if (viewModel.geteditAction) viewModel.geteditAction().setDisabled(false);
            if (viewModel.getcancelAction) viewModel.getcancelAction().setDisabled(true);
            if (viewModel.getaddLineAction) viewModel.getaddLineAction().setDisabled(true);
            if (viewModel.getoutboundAction) viewModel.getoutboundAction().setDisabled(false);
            cb.data.CommonProxy(this.symbol).QueryByPK(params.id, function (success, fail) {
                if (fail) {
                    alert("读取数据失败");
                    return;
                }
                viewModel.loadData(success);
                if (viewModel.getapprovestatus && viewModel.geteditAction && viewModel.getapprovestatus().getValue() !== -1)
                    viewModel.geteditAction().setDisabled(true);
                if (viewModel.getapprovestatus && viewModel.getoutboundAction && viewModel.getapprovestatus().getValue() !== 1)
                    viewModel.getoutboundAction().setDisabled(true);
                if (viewModel.getbodyAction)
                    viewModel.getbodyAction().setValue("产品(" + viewModel.getModel3D().getRows().length + ")");
                viewModel.setReadOnly(true);

                cb.model.PropertyChange.doPropertyChange();
            });
        }

        var appIdItems = params.appId.split(".");
        if (appIdItems.length !== 2) return;
        var data = { "moduleName": appIdItems[0], "appName": appIdItems[1], "viewModelName": viewModel.getName() };
        var config = { GetFieldPerm: { url: "classes/Login/UAP/GetFieldPerm", method: "Get"} };
        var proxy = cb.rest.DynamicProxy.create(config);
        proxy.GetFieldPerm(data, function (success, fail) {
            if (fail) {
                alert("读取字段权限数据失败");
                return;
            }
            viewModel.loadFieldPermData(success);
        });
    }
};
