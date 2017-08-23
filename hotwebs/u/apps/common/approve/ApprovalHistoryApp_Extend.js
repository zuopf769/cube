/// <reference path="../../common/js/Cube.js" />
/// <reference path="ApprovalApp_L.js" />
var ApprovalHistoryViewModel_Extend = {
    doAction: function (name, viewModel) {
        if (this[name])
            this[name](viewModel);
    },
    init_Extend: function (viewModel) {
        var params = cb.route.getViewPartParams(viewModel);
        var parentViewModel = params.parentViewModel;
        var billPkValue = params.billPkValue;
        var symbol = parentViewModel.getSymbol();
        cb.data.CommonProxy(symbol).LinkApproveInfo({ id: billPkValue }, function (success, fail) {
            //cb.data.CommonProxy('sa.Delivery').LinkApproveInfo('1001ZZ1000000000SLG2', function (success, fail) {
            if (fail) {
                cb.util.tipMessage("取审批数据错误");
            }
            else {
                var refdata = {};
                refdata.dataSource = success;
                viewModel.getprocessbar().set("Data", refdata);
            }
        });
    },
    closeAction: function (viewModel, args) {
        cb.route.hidePageViewPart(viewModel);
    },
    //processbarClick: function (viewModel, args) {
    //    debugger;
    //    cb.route.loadView(args.container, "common.contact.ContactDetail", { "personNo": args.data });
    //},
    
};
