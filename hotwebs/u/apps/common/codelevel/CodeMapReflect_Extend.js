/// <reference path="../../../common/js/Cube.js" />
/// <reference path="CodeLevel_L.js" />
var flag = true;
var CodeMapReflectViewModel_Extend= {
    doAction: function (name, viewModel) {
        if (this[name])
            this[name](viewModel);
    },
    level: null,
    codeLength: null,
    code: null,
    init_Extend: function (viewModel) { 
    	var param = {"id":cb.route.getViewPartParams(viewModel).id};
        viewModel.getProxy().QueryRefdataByClassID(param, function (success, fail) {
            if (success) {
            var refData=success.refData;
            var array=[];
            if(refData){
            	for(var i=0;i<refData.length;i++){
            		var obj={};
            		obj.entityvalue=refData[i][0];
            		obj.code=refData[i][1];
            		obj.name=refData[i][2];
            		if(refData[i][3]=='GLOBLE00000000000000' || refData[i][3]==null){
            			obj.pk_org='全局'
            		}else{
            			obj.pk_org=refData[i][3];
            		}
            		array.push(obj);
           		 }
            	 viewModel.getreflectGrid().setDataSource(array);
          	  }
            }
        });
    },
    CloseAction: function (viewModel, args) {
        cb.route.hidePageViewPart(viewModel);
    },
    DetermineAction: function (viewModel, args) {
    	cb.route.getViewPartParams(viewModel).callback.call(this,{
    		data:viewModel.getreflectGrid().getSelectedRows()
    	});
        this.CloseAction(viewModel)
    },
    
};