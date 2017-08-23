/// <reference path="../../../common/js/Cube.js" />
/// <reference path="Collrelation_L.js" />
var ParameterSettingViewModel_Extend = {

    doAction: function (name,viewModel) {
        if (this[name]) {
            this[name](viewModel);
        }
    },
    init_Extend: function () {

},
    closeAction:function(viewModel){
        cb.route.hidePageViewPart(viewModel);
    },
    determineAction:function(viewModel){

        this.closeAction(viewModel);
    }
};