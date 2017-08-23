/// <reference path="../../../common/js/Cube.js" />
/// <reference path="Collrelation_L.js" />
var AccountingPeriodViewModel_Extend ={

    doAction: function (name,viewModel) {
        if (this[name]) {
            this[name](viewModel);
        }
    },
    init_Extend: function (viewModel) {
        var data=[{
            app_num:1,
            app_month:'3',
            app_startTime:'2015-3-1',
            app_endTime:'2015-5-7'
        }];
        viewModel.getAccountGrid().setDataSource(data);

},

    closeAction:function(viewModel){
        cb.route.hidePageViewPart( viewModel)
    },
    cancelAction:function(viewModel){
        cb.route.hidePageViewPart( viewModel)
    },
    determineAction:function(viewModel){
        cb.route.hidePageViewPart( viewModel)
    }
};