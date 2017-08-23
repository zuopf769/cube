/// <reference path="../../common/js/Cube.js" />

var CommonBatchReportViewModel_Extend = {
   
    doAction: function (name, viewModel) {
        if (this[name])
            this[name](viewModel);
    },
    init_Extend: function (viewModel) {
        var params = cb.route.getViewPartParams(viewModel);
        var table = viewModel.gettotaltable();

        table.setData({ dsMode: 'Local', dataSource: params.msgDetails });
        viewModel.callBack = params.callBack;
    },
    closeAction: function (viewModel, args) {
        cb.route.hidePageViewPart(viewModel);
        var callBack = viewModel.callBack;
        if (callBack)
        {
            if (callBack("Cancel"))
            {
                //viewModel.get
            }
        }
    },

    notationAction: function (viewModel, args) {
        //alert("设置");
    },
    totalchangePage: function (viewModel, args) {
      
    },

    submitAction: function (viewModel, args) {
        cb.route.hidePageViewPart(viewModel);
        var callBack = viewModel.callBack;
        if (callBack) {
            if (callBack("Ok")) {
                //viewModel.get
            }
        }
    },

    cancelAction: function (viewModel, args) {
        cb.route.hidePageViewPart(viewModel);
        var callBack = viewModel.callBack;
        if (callBack) {
            if (callBack("Cancel")) {
                //viewModel.get
            }
        }
    }
};
