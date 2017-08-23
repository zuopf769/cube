var MoreSchemeDetailViewModel_Extend = {
    doAction: function (name, viewModel) {
        if (this[name]) this[name](viewModel);
    },
    closeAction: function (viewModel) {
    	this.cacheData(viewModel,this.collectData2Filters(viewModel.collectData()));
        cb.route.hidePageViewPart(viewModel);
    },
    saveAction: function (viewModel) {
    	var params = cb.route.getViewPartParams(viewModel);
        var symbol = params.parentViewModel.getSymbol();
        
        var subparam = {
            appid: symbol,
            pk_queryscheme: null
        };
            
        // 方案名称不能为空
        var schemeName = viewModel.getschemaname().getValue();
        if (!schemeName) {
            cb.util.warningMessage('请输入方案名称！');
            return;
        }
        subparam.name = schemeName;
        // 收集勾选的查询条件
        var collectData = viewModel.collectData();
        var selectItems = [];
		for(var attr in collectData){
			if(attr == "ViewModelName" || attr == "schemaname" ) continue;
			if(collectData[attr].filterMeta.isSelected)
				selectItems.push(collectData[attr]);
		}
      	subparam.filters = selectItems;
      	
      	cb.data.CommonProxy("UAP").QuerySchemeSave(subparam, function (success, fail) {
            if (fail) {
                cb.util.warningMessage("保存失败:" + fail.error);
                return;
            }
            if (params.hasOwnProperty('queryschemeId')) {
                cb.route.getViewPartParams(params.parentViewModel).parentViewModel.initData();
            }
            else {
                params.parentViewModel.initData() ? params.parentViewModel.initData() : null;
            }
            cb.util.warningMessage("保存查询方案成功！");
            cb.route.hidePageViewPart(viewModel);
        });
      	
    },
    
    queryAction: function (viewModel) {
    	if (!viewModel.validate()) return;
        var collectData = viewModel.collectData();
        this.cacheData(viewModel,this.collectData2Filters(collectData));
        var params = cb.route.getViewPartParams(viewModel);
        var parentViewModel = params.parentViewModel;
        var schemeInfo = parentViewModel.getqueryScheme().getValue();
        if (!schemeInfo || !schemeInfo.queryschemeID) {
            cb.util.warningMessage("请选择一个查询方案！");
            return;
        }
        
        var symbol = parentViewModel.getSymbol();
        if (symbol) {
            var filters = null;
            if (collectData) {
            	filters = new Array();
                for (var attr in collectData) {
                    if (attr != 'ViewModelName') {
                        var attrValue = collectData[attr];
                        if(attrValue.fieldValue && attrValue.fieldValue != null)
                        	filters.push(attrValue);
                    }
                }
            }
           	if(params.callBack) {
           		params.callBack(filters);
                cb.route.hidePageViewPart(viewModel);
           	}
        }
    },
    init_Extend: function (viewModel) {
        var params = cb.route.getViewPartParams(viewModel);
        var parentViewModel = params.parentViewModel;
        var schemeInfo = parentViewModel.getqueryScheme().getValue();
        var symbol = parentViewModel.getSymbol();
        if (!schemeInfo || !schemeInfo.queryschemeID) {
            cb.util.warningMessage("请选择一个查询方案！");
            return;
        }
        var isRefreshData = params.isRefreshData;
        var conditionCached = params.conditionCached;
        // 第一次查服务
        if(isRefreshData){
        	if (symbol) {
	            cb.data.CommonProxy(symbol).LoadQueryTemplate({ queryschemeID: schemeInfo.queryschemeID }, function (success, fail) {
	                if (fail) {
	                    cb.util.warningMessage("获取查询方案获取失败");
	                    return;
	                }
	                if (success.filters.length > 0) {
	                	var mergedData = MoreSchemeDetailViewModel_Extend.mergeData(conditionCached, success.filters);
	                	MoreSchemeDetailViewModel_Extend.cacheData(viewModel,mergedData);
	               		MoreSchemeDetailViewModel_Extend.updateViewModel(viewModel,mergedData);
	                }    
	            });
	        }
        }
        else {
        		var mergedData = MoreSchemeDetailViewModel_Extend.mergeData(conditionCached, viewModel.moreConditionCached);
	            this.cacheData(viewModel,mergedData);
	            this.updateViewModel(viewModel,mergedData);
        }
    },  
    
    /**
     * 校验必输项
     * @param {Object} val
     */
    validate: function(val) {
    	var result = true;
     	var fieldValue = val.fieldValue;
     	if(!fieldValue || fieldValue.length == 0) {
     		result = false;
     	}
		else {
			for(var i = 0; i < fieldValue.length; i++) {
				if(fieldValue[i].sqlString == null || fieldValue[i].sqlString == "") {
					 result = false;
					 break;
				}
			}
		}
		return result;
    },
    
    /**
     * 合并数据
     * 
     * @param {Object} conditionCached
     * @param {Object} moreCondtion
     */
    mergeData: function(conditionCached,moreCondtionCached) {
    	if(conditionCached != null && window.conditionChanged == true){
    		for(var i = 0; i < moreCondtionCached.length; i++) {
    			for(var attr in conditionCached) {
    				if(moreCondtionCached[i].filterMeta.fieldCode == attr) 
    					moreCondtionCached[i].fieldValue = conditionCached[attr];
    			}
    		}
    	}
    	window.conditionChanged = false;
    	return moreCondtionCached;
    },
    
    /**
     * 缓存数据
     * @param {Object} viewModel
     * @param {Object} data
     */
    cacheData: function(viewModel,data) {
    	viewModel.moreConditionCached = data;
    },
    
    collectData2Filters: function(collectData) {
    	var filters = null;
        if (collectData) {
        	filters = new Array();
            for (var attr in collectData) {
                if (attr != 'ViewModelName' && attr != 'schemaname') {
                    filters.push(collectData[attr]);
                }
            }
        }
        return filters;
    },
    
    /**
     * 画页面
     * @param {Object} viewModel
     * @param {Object} filters
     */
    updateViewModel: function(viewModel,filters) {
    	//创建HTML标记
        var schemaname = "<div class=\"col-lg-12 p-0\">"
							+ "<div class=\"col-lg-1\" style=\"width:30px\"></div>"
								  +"<label class=\"col-lg-3\" title=\"方案名称\">方案名称</label>"
								  +"<div class=\"col-lg-3 p-0\">"
									 +"<input data-propertyname=\"schemaname\" data-controltype=\"TextBox\" placeholder=\"请输入方案名称...\"/>"
								   +"</div>"
							+"</div>";
        var html = schemaname + template("schemedetail", { propertyitem: filters });
        $("#container").html(html);

        for (var i = 0; i < filters.length; i++) {
            var item = filters[i];
            // 处理pk_dispatchlist_b.iquantity的情况
            var fieldCode = item.filterMeta.fieldCode.replace(/\./g,'_');
            item.hasCheck = true;
            // 先移除在添加（否则新值设值不上去）
            viewModel.remove(fieldCode);
            viewModel.add(fieldCode, { "Init": item, "title": item.filterMeta.fieldName, "isValid": MoreSchemeDetailViewModel_Extend.validate(item) });
            // 必须主动setValue才能保证collectData时取出来值
            viewModel.get(fieldCode).setValue(item);
            // 是否必输
			if(item.filterMeta.isRequired)
				viewModel.get(fieldCode).set("isNullable",!item.filterMeta.isRequired);
        }
        var $container = $("div[data-viewmodel='" + viewModel.getModelName() +"']");
        if($container.length>0)  
        	cb.viewbinding.update($container.attr("id"));
    }
};