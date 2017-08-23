/// <reference path="../../../common/js/Cube.js" />
/// <reference path="TimeType_L.js" />
var TimeTypeViewModel_Extend = {
    doAction: function (name, viewModel) {
        if (this[name])
            this[name](viewModel);
    },
    init_Extend: function (viewModel) {
        var customer = cb.route.getViewPartParams(viewModel).queryData.nbcrcode;
        var param = { "nbcrcode": customer };
        viewModel.gettimeType().setValue("0");
        viewModel.getProxy().TimeTypeQuery(param, function (success, fail) {
            if (success) {
            	viewModel.getcodeEntityTree().setDataSource(success);
            	viewModel.getcodeEntityTree().setAllNodesEnable(false);
    			setTimeout(function(){viewModel.getcodeEntityTree().expandByID("root");},500);
            }
        })
    },
    CloseAction: function (viewModel, args) {
        cb.route.hidePageViewPart(viewModel);
    },
    DetermineAction: function (viewModel, args) {
    	var timeType = viewModel.gettimeType().getValue();
    	var returnStata = {};
    	if(timeType == "0"){
    		var sysTime = cb.util.formatDateTime(new Date().toUTCString());
    		returnStata = {
	            data: {
	                value: sysTime,
	                name: sysTime
	            }
	        };
    	} 
    	else if(timeType == "1") {
	    	var seleRow = viewModel.getcodeEntityTree().getSelectedNode();
	    	if(seleRow.cansel == false){
	    		cb.util.warningMessage("请选择可用的属性(字体为红色)作为编码属性");
	    		return;
	    	}
	    	returnStata = {
	            data: {
	                value: seleRow.value,
	                name: seleRow.displayname
	            }
	        };
    	}
        var paras = cb.route.getViewPartParams(viewModel);
        if (paras != null && paras.callBack != null) {
            paras.callBack(returnStata);
        }
        this.CloseAction(viewModel)
    },
    timeTypeRadioAction: function (viewModel, args) {
    	var timeType = viewModel.gettimeType().getValue();
    	if(timeType == 0) {
    		viewModel.getcodeEntityTree().setAllNodesEnable(false);
    		setTimeout(function(){viewModel.getcodeEntityTree().expandByID("root");},500);
    	}else{
    		viewModel.getcodeEntityTree().setAllNodesEnable(true);
    	}
    	
    },
    codeEntityTreeClickAction: function(viewModel, args){
    	if(args.cansel) return;
    	 viewModel.getProxy().ActionTreeQuery(args, function (success, fail) {
            if (success) {
            	var dataSource = {};
            	dataSource.parentCode = success.code;
            	dataSource.data = success.children;
            	viewModel.getcodeEntityTree().appendNodes(dataSource);
            }
        })
    }
};