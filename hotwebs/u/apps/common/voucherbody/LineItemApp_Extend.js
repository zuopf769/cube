/// <reference path="../../common/js/Cube.js" />
/// <reference path="LineItemApp_M.js" />

var LineItemViewModel_Extend = {
    doAction: function (name, viewModel) {
        if (this[name])
            this[name](viewModel);
    },
    returnAction: function (viewModel) {
        /// <param name="viewModel" type="LineItemViewModel">viewModel类型为LineItemViewModel</param>
        cb.route.hidePageViewPart(viewModel);
    },
    editAction: function (viewModel) {
        this.model3d.set("readOnly", false);
    },
    cancelAction: function (viewModel) {
        cb.route.hidePageViewPart(viewModel);
    },
    saveAction: function (viewModel) {
        cb.route.hidePageViewPart(viewModel);
    },
    init_Extend: function (viewModel) {
        /// <param name="viewModel" type="LineItemViewModel">viewModel类型为LineItemViewModel</param>
        var params = cb.route.getViewPartParams(viewModel);
        this.model3d = params.model3d;
        this.mode = params.mode;
        if (this.mode === "view" && this.model3d.get("readOnly") === true) {
            viewModel.geteditAction().set("Visible", false);
            viewModel.getcancelAction().set("Visible", false);
            viewModel.getsaveAction().set("Visible", false);
        }
        else {
            viewModel.geteditAction().set("Visible", false);
            viewModel.getcancelAction().set("Visible", true);
            viewModel.getsaveAction().set("Visible", true);
        }
        if (this.mode === "add") {
            var index = this.model3d.getRows().length;
            this.model3d.insert(index);
            this.model3d.onSelect(index);
        }
    }
};