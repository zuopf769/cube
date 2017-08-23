/// <reference path="../../../common/js/Cube.js" />
/// <reference path="CodeMap_L.js" />
var flag = true;
var CodeMapViewModel_Extend = {
	metaid:null,
	defaultrule:"",
    doAction: function (name, viewModel) {
        if (this[name])
            this[name](viewModel);
    },
   
    init_Extend: function (viewModel) {
    	viewModel.setReadOnly(true);
    	viewModel.geteditAction().set('disabled', true);
    	viewModel.getsaveAction().set('disabled', true);
    	viewModel.getentityRef().set('disabled', true);
    	viewModel.getcancelAction().set('disabled', true);
		viewModel.getProxy().CreateCodeMappingTree({}, function (success, fail) {
            if (success) {
                viewModel.getcodeMapTree().setDataSource(success.children);
            }
        });
    },
    
    mapTreeClick: function(viewModel,args) {
    	var recallBack = function (ok){
    		if(!ok) return;
    		viewModel.clear();
	    	viewModel.setReadOnly(true);
	    	if(args.codetype=='REOBJECT'){
	    		viewModel.geteditAction().set('disabled', false);
		    	viewModel.getsaveAction().set('disabled', true);
		    	viewModel.getcancelAction().set('disabled', true);
		    	viewModel.getentityRef().set('disabled', false);	
	    	}else{
	    		viewModel.geteditAction().set('disabled', true);
		    	viewModel.getsaveAction().set('disabled', true);
		    	viewModel.getcancelAction().set('disabled', true);
		    	viewModel.getentityRef().set('disabled', true);
	    	}
	    	if(args.codetype=='REOBJECT'){
	    		metaid=args.code;
	    		viewModel.metaid=metaid;
	    		viewModel.getProxy().QryCodeMappingInfo({"id":args.code}, function (success, fail) {
		            if (success) {
		            	if(success.entityVO!=null){
		            		for (var attr in success.entityVO) {
			            	 	if(viewModel['get'+attr]){
			            	 		var value=success.entityVO[attr];
			            	 		viewModel['get' + attr]().setValue(value);
			            	 	}
			          		  }
			            	viewModel.pk_billcodeentity=success.entityVO.pk_billcodeentity;
		            	}else{
		            		viewModel['getelength']().setValue(1);
		            		viewModel['getstyl']().setValue("0");
		            		viewModel['getsign']().setValue("@");
		            	}
		            	viewModel.getlisanDefineGrid().setData(success.reflectExtVOs);
		            	viewModel.setDirty(false);
		            }else{
		            	viewModel['getelength']().setValue(1);
		            	viewModel['getstyl']().setValue("0");
		            	viewModel['getsign']().setValue("@");
		            }
	        	});
	    	}
    	}
	  	if(viewModel.isDirty()){
            cb.util.confirmMessage("你是否丢弃当前编辑数据", function () { recallBack(true) }, function () { recallBack(false) })
        }else{
            recallBack(true);
        };
    },
    lisanDefineGridAction: function (viewModel, args) {
    	var model3d = viewModel.getlisanDefineGrid();
    	var elength = viewModel.getelength().getValue();
    	if(args.value.length > elength){
    		var newValue = args.value.substr(0, elength);
    		model3d.updateRow(args.index,{"value":newValue});
    	}
    },
    reflectAddAction:function(viewModel,args){
    	if(viewModel.getlisanDefineGrid().getReadOnly()) return;
    	if (typeof metaid != "undefined")
    	 cb.route.loadPageViewPart(viewModel, 'common.codelevel.CodeMapReflectApp', { width: '800px', height: "500px",id:metaid,callback:function(args){
    	 	viewModel.getlisanDefineGrid().setData(args.data);
    	 }})
    },
    reflectDeleteAction: function(viewModel,args){
    	var model3d = viewModel.getlisanDefineGrid();
    	if(args != 0){
    		model3d.deleteRows(args);
    	}else{
    		model3d.deleteRows(args);
    		model3d.appendRow({});
    	}
    },
    editAction:function(viewModel, args){
		viewModel.geteditAction().set('disabled', true);
		viewModel.getsaveAction().set('disabled', false);
		viewModel.getcancelAction().set('disabled', false);
		viewModel.getentityRef().set('disabled', true);
    	viewModel.setReadOnly(false);
    	if(viewModel.getlisanDefineGrid()._dataSource==undefined || viewModel.getlisanDefineGrid()._dataSource.length==0){
    		viewModel.getlisanDefineGrid().appendRow({});
    	}
    },
    saveAction:function(viewModel, args){
    	defaultrule=$("#cb_control_defaultrule_1").val();
    	var flag=true;
    	var collectData = viewModel.collectData();
    	if(collectData.elength<=0||collectData.elength>20){
    		flag=false;
    		cb.util.warningMessage("映射长度大于0小于20");
    	}
    	var vstr = viewModel.validate();
    	if(vstr&&flag){
	    	var entityVO={
	    		    "pk_billcodeentity": viewModel.pk_billcodeentity,
	                "metaid": viewModel.metaid,
	                "elength": collectData.elength,
	                "defaultrule": defaultrule,
	                "ruledesc": collectData.ruledesc,
	                "styl": collectData.styl,
	                "sign": collectData.sign,
	    	};
	        var reflects = viewModel.getlisanDefineGrid().getRows();
	        for(var i=0;i<reflects.length;i++){
	        	reflects[i].pk_billcodeentity=viewModel.pk_billcodeentity;
	        }
	    	var params={
	    		entityVO:entityVO,
	    		reflects:reflects,
	    		reflectExtVOs:reflects
	    	};
	    	var stxt = "所有引用该映射值的编码规则都将修改长度,"
	    				+ "并使用原来的流水号,请确认！"
	    	cb.util.confirmMessage(stxt, okcallback,cancelcallback);
	    	 function okcallback() {
	               viewModel.getProxy().UpdateCodeMapping(params, function (success, fail) {
		    		if(success){
		    			cb.util.tipMessage('保存成功');
		    			viewModel.setReadOnly(true);
		    			viewModel.geteditAction().set('disabled', false);
						viewModel.getsaveAction().set('disabled', true);
						viewModel.getcancelAction().set('disabled', true);
						viewModel.getentityRef().set('disabled', false);
		    		}else{
		    			var warnstr="<html>";
		    			for(var i=0;i<fail.length;i++){
		    				warnstr+="编码:"+fail[i].code+",映射实体:"+fail[i].name+"<br/>";
		    			}
		    			warnstr+="</html>";
		    			cb.util.warningMessage(warnstr);
		    		}
		    	});
            };
	    	function cancelcallback() {
	    		var seleNode = viewModel.getcodeMapTree().getSelectedNode();
	    		viewModel.getcodeMapTree().setSelectNode(seleNode);
                viewModel.geteditAction().set('disabled', false);
				viewModel.getsaveAction().set('disabled', true);
				viewModel.getcancelAction().set('disabled', true);
				viewModel.getentityRef().set('disabled', false);
            };
    	}
    	
    },
    cancelAction: function(viewModel,args){
    	var recallBack = function (ok){
    		if(!ok) return;
	    	viewModel.restore();
	        viewModel.geteditAction().set('disabled', false);
			viewModel.getsaveAction().set('disabled', true);
			viewModel.getcancelAction().set('disabled', true);
			viewModel.getentityRef().set('disabled', false);
    	}
		
		if(viewModel.isDirty()){
            cb.util.confirmMessage("你是否丢弃当前编辑数据", function () { recallBack(true) }, function () { recallBack(false) })
        }else{
            recallBack(true);
        };
    },
    entityRef:function(viewModel,args){
      // var collectData = viewModel.collectData();
       if (typeof metaid != "undefined")
        cb.route.loadPageViewPart(viewModel, 'common.codelevel.CodeMapEntityRefApp', { width: '800px', height: "500px",id:metaid})
    }
};
