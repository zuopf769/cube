var OperatorViewModel_Extend = {
    doAction: function (name, viewModel) {
        if (this[name])
            this[name](viewModel);
    },
	init_Extend: function (viewModel) {	
        var params = cb.route.getViewPartParams(viewModel);
        var parentViewModel = params.parentViewModel;
        var applicationName = params.data.data.displayName;
        viewModel.getapplicationName().setValue(applicationName);
        viewModel.getdisplayName().setValue(' ');
    },
    submitAction:function (viewModel, args){
    	var displayName = viewModel.getdisplayName().getValue();
    	if(!displayName){
    		alert("节点名称不能为空");
    	}else{
    		var params = cb.route.getViewPartParams(viewModel);
    		if(params && params.callBack && cb.util.isFunction(params.callBack)){
    			params.callBack(displayName);
    		}
    	}
    	cb.route.hidePageViewPart(viewModel);
    },
    cancelAction: function (viewModel, args) {
        cb.route.hidePageViewPart(viewModel);      
    }
};