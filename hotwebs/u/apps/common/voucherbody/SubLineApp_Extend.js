/// <reference path="../../common/js/Cube.js" />
/// <reference path="SubLineApp_M.js" />

var SubLineViewModel_Extend = {
    doAction: function (name, viewModel) {
        if (this[name])
            this[name](viewModel);
    },
    loadLineItem: function (viewModel, params) {
        cb.route.loadPageViewPart(viewModel, "common.voucherbody.LineItemApp", params);
    },
    returnAction: function (viewModel) {
        /// <param name="viewModel" type="SubLineViewModel">viewModel类型为SubLineViewModel</param>
        if (this.parentViewModel.getbodyAction)
            this.parentViewModel.getbodyAction().setValue("产品(" + this.model3d.getRows().length + ")");
        cb.route.hidePageViewPart(viewModel);
    },
    addAction: function (viewModel) {
        this.loadLineItem(viewModel, { "mode": "add", "model3d": this.model3d });
    },
    itemClick: function (viewModel, args) {
        /// <param name="viewModel" type="SubLineViewModel">viewModel类型为SubLineViewModel</param>
        this.loadLineItem(viewModel, { "mode": "view", "model3d": this.model3d });
    },
    changePage: function (viewModel, args) {
        /// <param name="viewModel" type="SubLineViewModel">viewModel类型为SubLineViewModel</param>
        debugger;
    },
    init_Extend: function (viewModel) {
        /// <param name="viewModel" type="SubLineViewModel">viewModel类型为SubLineViewModel</param>
        var params = cb.route.getViewPartParams(viewModel);
        this.parentViewModel = params.parentViewModel;
        this.model3d = this.parentViewModel.getModel3D();
        this.mode = params.mode;
        if (this.mode === "view" && this.model3d.get("readOnly") === true)
            viewModel.getaddAction().set("Visible", false);
        else
            viewModel.getaddAction().set("Visible", true);
    }
};