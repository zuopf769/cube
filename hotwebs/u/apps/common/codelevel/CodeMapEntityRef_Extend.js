/// <reference path="../../../common/js/Cube.js" />
/// <reference path="CodeLevel_L.js" />
var flag = true;
var CodeMapEntityRefViewModel_Extend= {
    doAction: function (name, viewModel) {
        if (this[name])
            this[name](viewModel);
    },
    level: null,
    codeLength: null,
    code: null,
    init_Extend: function (viewModel) { 
    	var param = {"id":cb.route.getViewPartParams(viewModel).id};
        viewModel.getProxy().GetCodeMapEntityRef(param, function (success, fail) {
            if (success) {
             viewModel.getentityRefGrid().setDataSource(success);
            }
        });
    }
};
