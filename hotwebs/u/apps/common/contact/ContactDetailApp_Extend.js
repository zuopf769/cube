/// <reference path="../../common/js/Cube.js" />
/// <reference path="ContactDetailApp_M.js" />

var ContactDetailViewModel_Extend = {
    doAction: function (name, viewModel) {
        if (this[name])
            this[name](viewModel);
    },
    returnAction: function (viewModel) {
        /// <param name="viewModel" type="ContactDetailViewModel">viewModel类型为ContactDetailViewModel</param>
        cb.route.hidePageViewPart(viewModel);
    },
    contactClick: function (viewModel, args) {
        alert("contactClick");
    },
    init_Extend: function (viewModel) {
        /// <param name="viewModel" type="ContactDetailViewModel">viewModel类型为ContactDetailViewModel</param>

        var data = {
            name: "王大为",
            position: "销售经理",
            tel: "010-43249088",
            phone: "13613337876"
        };

        viewModel.setData(data);
    }
};