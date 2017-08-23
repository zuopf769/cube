var LinkQueryViewModel_Extend =  {
    doAction: function (name, viewModel) {
        if (this[name]) this[name](viewModel);
    },
    init_Extend: function (viewModel) {
        var params = cb.route.getViewPartParams(viewModel);
        viewModel.getlinkQueryList().setDataSource(params.data);
        debugger;
    },

    closeAction: function (viewModel) {
        try { cb.route.hidePageViewPart(viewModel); }
        catch (e) { }
    },
    openLinkAction: function (viewModel, args) {
        var billType = args.billType;
        var id = args.id;
        if (billType) {
            cb.data.CommonProxy("UAP").QueryAppIDByBillType({ billType: billType }, function (success, fail) {
                if (success) {
                    var params = {};
                    params.linkappid = success;
                    params.id = id;
                    params.field = "";
                    cb.route.hidePageViewPart(viewModel);
                    new cb.data.commonCRUD(viewModel).openLink(params);
                }

            });
        }
        
    },
}