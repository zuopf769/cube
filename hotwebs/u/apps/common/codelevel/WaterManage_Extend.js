/// <reference path="../../../common/js/Cube.js" />
/// <reference path="WaterManage_L.js" />
var WaterManageViewModel_Extend = {
    doAction: function (name, viewModel) {
        if (this[name])
            this[name](viewModel);
    },
    WaterLength: null,
    init_Extend: function (viewModel) {
    	this.getWaterLength(viewModel);
        var param = {
            "pk_rulebase": cb.route.getViewPartParams(viewModel).baseData.pk_billcodebase
        };
        viewModel.getProxy().WaterManageQuery(param, function (success,fail) {
        	if (fail) {
				cb.util.warningMessage(fail.error);
				return;
	       	}
            if (success) {
                var arry = [];
                for (var i = 0; i < success.length; i++) {
                    var datas = success[i].snvo;
                    if (!(success[i].flow1pkset == null || success[i].flow1pkset.length == 0 )) {
                        datas.organization = success[i].flow1map[success[i].flow1pkset[0]];
                    }
                    if (!(success[i].flow2pkset == null || success[i].flow2pkset.length == 0)) {
                        datas.waterbasis = success[i].flow2map[success[i].flow2pkset[0]];
                    }
                    if (!(success[i].flow3pkset == null || success[i].flow3pkset.length == 0)) {
                        datas.waterbasis+=success[i].flow3map[success[i].flow3pkset[0]];
                    }
                    arry.push(datas);
                };    
                viewModel.getwaterManageGrid().setData(arry);
            }
        });
    },
    AddWaterAction: function (viewModel, args) {
        var baseData = cb.route.getViewPartParams(viewModel).baseData;
        cb.route.loadPageViewPart(viewModel, 'common.codelevel.NewWaterApp', { width: '450px', height: '215px', baseData: baseData });
    },
    CloseAction: function (viewModel, args) {
        cb.route.hidePageViewPart(viewModel);
    },
    DetermineAction: function (viewModel, args) {
    	var rows = viewModel.getwaterManageGrid().getRows();
    	viewModel.getProxy().UpdateSNVOBatch(rows, function (success,fail) {
        	if (fail) {
				cb.util.warningMessage(fail.error);
				return;
	       	}
            if (success) {
            	cb.route.hidePageViewPart(viewModel);
            }
        });
    },
    getWaterLength: function(viewModel){
    	var codeRuleGridData = cb.route.getViewPartParams(viewModel).baseData.codeRuleGrid;
    	if(codeRuleGridData !=null && codeRuleGridData.length > 0){
	    	for(var i=0; i<codeRuleGridData.length; i++){
				if(codeRuleGridData[i].elemtype == "3"){
					this.WaterLength = codeRuleGridData[i].elemlenth;
				}
	    	}
    	}
    },
    waterManageGridAction: function(viewModel, args){
    	if(args.field == "lastsn"){
    		if(args.value.length > this.WaterLength ){
    			cb.util.warningMessage("流水长度不能超过"+this.WaterLength+"位!");
	    		viewModel.getwaterManageGrid().setCellValue(args.index,"lastsn",args.oldValue);
    		}
    	}
    }
};