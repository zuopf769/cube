/// <reference path="../../../common/js/Cube.js" />
/// <reference path="NewWater_L.js" />
var NewWaterViewModel_Extend = {
    doAction: function (name, viewModel) {
        if (this[name])
            this[name](viewModel);
    },
    init_Extend: function (viewModel) {
    	viewModel.clear();
        var NewModel = cb.route.getViewPartParams(viewModel);
        var baseData = NewModel.baseData;

        var html = template('NewWatertpl', {data:baseData});
        $("#row").html(html);
        
    	// 组织参照
       	if(baseData.codescope && baseData.codescope=='o') {
       		var simpleModel = {};
       		simpleModel.refId = "600015";
            simpleModel.refKey = "pk_org";
            simpleModel.refCode = "code";
            simpleModel.refName = "name";
            //需要指定ctrlType为Refer
            simpleModel.ctrlType = "Refer";
            simpleModel.isNullable = false;
            viewModel.remove("pk_org");
            viewModel.add("pk_org", simpleModel);
       	}
       	
       	var codeRuleGrid = baseData.codeRuleGrid;
       	for(var i=0; i < codeRuleGrid.length; i++){
       		if(codeRuleGrid[i].isrefer!=0){
       			if(codeRuleGrid[i].elemtype==2){
       				viewModel.remove("date");
       				var simpleModel = {};
       				simpleModel.isNullable = false;
       				viewModel.add("date", simpleModel);
       			}
       			else if(codeRuleGrid[i].elemtype==1){
       				  viewModel.getProxy().QrySnEntityRef({ "pk_billcodebase":baseData.pk_billcodebase }, function (success,fail) {
				        	if (fail) {
								cb.util.warningMessage("实体类型参照错误："+fail.error);
					       	}
				        	if(success){
					       	 	 var simpleModel = {};
						       	  simpleModel.refId = success.refId;
						          simpleModel.refKey = success.refKey;
						          simpleModel.refCode = "code";
						          simpleModel.refName = "name";
						          //需要指定ctrlType为Refer
						          simpleModel.ctrlType = "Refer";
						          simpleModel.isNullable = false;
						          viewModel.remove("entity");
						          viewModel.add("entity", simpleModel);  
					         }
				        	});
       				}
       			}
     		 }
       
       	var $container = $("[data-viewmodel='" + viewModel.getModelName() + "']");
        if ($container.length)
            cb.viewbinding.update($container.attr("id"));
    },
    CloseAction: function (viewModel, args) {
        cb.route.hidePageViewPart(viewModel);
    },
    DetermineAction: function (viewModel, args) {
    	viewModel.validate();
        var NewModel = cb.route.getViewPartParams(viewModel);
        var baseData = NewModel.baseData;
		var codeRuleGrid = baseData.codeRuleGrid;
		var waterLength;
		for(var i=0; i<codeRuleGrid.length; i++){
			if(codeRuleGrid[i].elemtype == 3){
				waterLength = codeRuleGrid[i].elemlenth;
				break;
			}
		}
		var lastsnLenth = viewModel.getlastsn().getValue();
		if(lastsnLenth != null){
			if(lastsnLenth.length > parseInt(waterLength) || lastsnLenth.length < parseInt(waterLength) ){
				cb.util.warningMessage("流水号应该为长度"+ waterLength +"位");
				return;
			}
		}
        var param = {
            "pk_billcodebase": baseData.pk_billcodebase,
            "snvoKeyMap": viewModel.collectData()
        };
        viewModel.getProxy().InsertSNVO(param, function (success, fail) {
            if (success) {
                var currentModel = cb.route.getViewPartParams(viewModel).parentViewModel;
                var param = {
                    "pk_rulebase":  baseData.pk_billcodebase
                };
                currentModel.getProxy().WaterManageQuery(param, function (success, fail) {
                	if(fail){
                		cb.util.tipMessage(fail.error);
                		return;
                	}
                    if (success) {
                        var arry = [];
                        for (var i = 0; i < success.length; i++) {
                            var datas = {
                                organization: null,
                                waterbasis: null,
                                markstr: success[i].snvo.markstr,
                                lastsn: success[i].snvo.lastsn
                            };
                            if (!(success[i].flow1pkset == null || success[i].flow1pkset.length == 0)) {
                                datas.organization = success[i].flow1map[success[i].flow1pkset[0]];
                            }
                            if (!(success[i].flow2pkset == null || success[i].flow2pkset.length == 0)) {
                                datas.waterbasis = success[i].flow2map[success[i].flow2pkset[0]];
                            }
                            if (!(success[i].flow3pkset == null || success[i].flow3pkset.length == 0)) {
                                datas.waterbasis += success[i].flow3map[success[i].flow3pkset[0]];
                            }
                            arry.push(datas);
                        };
                        currentModel.getwaterManageGrid().setData(arry);
                    }

                });
            }
        })
        this.CloseAction(viewModel)
    }
};