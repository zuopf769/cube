/// <reference path="../../../common/js/Cube.js" />
/// <reference path="TimeType_L.js" />
var AssignOrg_Extend = {
    doAction: function (name, viewModel) {
        if (this[name])
            this[name](viewModel);
    },
    init_Extend: function (viewModel) {
    	 viewModel.getorgTree().setDataSource([]);
    	 var param = cb.route.getViewPartParams(viewModel);
    	 viewModel.getProxy().CreateOrgTree(param.codeRule.data, function (success, fail) {
            if (fail) {
            	cb.util.warningMessage(fail.error);
            	return;
            }
            if (success) {
            	viewModel.getorgTree().setDataSource(success);
            	var checkedOrgs = [];
            	for(var i=0; i<success.children.length; i++) {
            		if(success.children[i].isChecked) {
            			checkedOrgs.push(success.children[i].code);
            		}
            	}
            	viewModel.getorgTree().setSelectedValues(checkedOrgs);
            }
        })
    },
    cancelAction: function (viewModel, args) {
        cb.route.hidePageViewPart(viewModel);
    },
    determineAction: function (viewModel, args) {
    	var param = cb.route.getViewPartParams(viewModel);
    	var checkedOrgs = viewModel.getorgTree().getSelectedValues();
    	var dataSource = viewModel.getorgTree().getDataSource();
	    	var pk_orgs = [];
	    	if(checkedOrgs.length > 0){
	    		function getCheckedOrgPKs(dataSource) {
	    		if(checkedOrgs.indexOf(dataSource.code) != "-1") {
	    			pk_orgs.push(dataSource.data.pk_org);
	    		}
	    		if(dataSource.children && dataSource.children.length > 0) {
	    			for(var i=0; i<dataSource.children.length; i++) {
	    				getCheckedOrgPKs(dataSource.children[i]);
	    			}
	    		}
	    	}
	    		getCheckedOrgPKs(dataSource);
	    	}
	    	var Params = {
	    		"pk_orgs": pk_orgs,
	    		"pk_billcodebase": param.codeRule.data.pk_billcodebase
	    	};
    		
    		viewModel.getProxy().BatchProcessRORelaVO(Params, function (success, fail) {
	            if (fail) {
	            	cb.util.warningMessage(fail.error);
	            	return;
	            }
	            if (success) {
	            	cb.route.hidePageViewPart(viewModel);
	            }
        });
    }
};