var QuerySchemeViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "QuerySchemeViewModel");
    this.init();
};
QuerySchemeViewModel.prototype = new cb.model.ContainerModel();
QuerySchemeViewModel.prototype.constructor = QuerySchemeViewModel;

QuerySchemeViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "QuerySchemeViewModel",
        queryAction: new cb.model.SimpleModel(),
        moreAction: new cb.model.SimpleModel()
    };
    this.setData(fields);
    this.setDirty(false);

    this.getqueryAction().on("click", function () { QuerySchemeViewModel_Extend.queryAction(this.getParent()); });
    this.getmoreAction().on("click", function () { QuerySchemeViewModel_Extend.moreAction(this.getParent()); });
    // 给父viewModel加事件afterTabContentClick
    var oThis = this;
    cb.route.getViewPartParams(this).parentViewModel.on("afterTabContentClick", function () { oThis.initData() });
    // 上次页面添加的viewModel
    this.preAddedViewModel = [];
    this.initData();
};

QuerySchemeViewModel.prototype.initData = function () {
    // 本页面添加的viewModel
    this.thisAddedViewModel = [];
    // 查询条件缓存
    this.conditionCached = null;
    this.moreClickTime = 0;
    QuerySchemeViewModel_Extend.doAction("init_Extend", this);
};

var QuerySchemeViewModel_Extend = {
    doAction: function (name, viewModel) {
        if (this[name]) this[name](viewModel);
    },
    queryAction: function (viewModel) {
    	if (!viewModel.validate()) return;
        var params = cb.route.getViewPartParams(viewModel);
        var parentViewModel = params.parentViewModel;
        var schemeInfo = parentViewModel.getqueryScheme().getValue();
        if (!schemeInfo || !schemeInfo.queryschemeID) {
            cb.util.warningMessage("请选择一个查询方案！");
            return;
        }   
       	this.cacheCondition(viewModel);
        var collectData = viewModel.collectData();
        var symbol = parentViewModel.getSymbol();
        if (symbol) {
            var filters = null;
            if (collectData) {
            	filters = new Array();
                for (var attr in collectData) {
                    if (viewModel.thisAddedViewModel.indexOf(attr) == -1)
                        continue;
                    if (attr != 'ViewModelName') {
                        var attrValue = collectData[attr];
                        if (typeof attrValue != 'object') {
                            filters.push({
                                filterMeta: { fieldCode: attr },
                                fieldValue: [{ sqlString: attrValue }]
                            });
                        }
                        else
                            filters.push(attrValue);
                    }
                }
            }
           
        	if(params.callBack){
        		params.callBack(filters);
        	}
        }
    },
    moreAction: function (viewModel) {
        var params = cb.route.getViewPartParams(viewModel);
        var parentViewModel = params.parentViewModel;
        var schemeInfo = parentViewModel.getqueryScheme().getValue();
        if (!schemeInfo || !schemeInfo.queryschemeID) {
            cb.util.warningMessage("请选择一个查询方案！");
            return;
        }
        var isRefreshData = ++viewModel.moreClickTime == 1 ? true : false;
        cb.route.loadPageViewPart(parentViewModel, "common.commonscheme.MoreSchemeItem", { width: "610px", height: "560px", 
        			queryschemeID: schemeInfo.queryschemeID,isRefreshData: isRefreshData,
        			conditionCached: viewModel.conditionCached, callBack: params.callBack});
    },
    cacheCondition: function(viewModel){
    	 var conditionCached = {};
    	 window.conditionChanged = true;
    	 var thisAddedViewModel = viewModel.thisAddedViewModel;
    	 for(var i = 0; i < thisAddedViewModel.length; i++ ){
    	 	var fieldValue = [];
    	 	var attr = thisAddedViewModel[i];
    	 	if(attr == "ViewModelName") continue;
    	 	var prop = viewModel.get(attr);
    	 	var controlType = prop.get && (prop.get("controlType") || prop.get("ctrlType"));
	 		var value = {};
	 		switch(controlType){
	 			case "CheckTextBox":
	 				conditionCached[attr] = prop.getValue().fieldValue;
	 				break;
	 			case "Refer":
	 				value.showString = (prop.get("refData")&&prop.get("refData")["name"]) || "";
	 				value.sqlString = prop.getValue();
	 				value.expression = null;
	 				fieldValue.push(value);
	 				conditionCached[attr] = fieldValue;
	 				break;
	 			case "ComboBox":
	 				value.showString = prop.get("title") || "";
	 				value.sqlString = prop.getValue();
	 				value.expression = null;
	 				fieldValue.push(value);
	 				conditionCached[attr] = fieldValue;
	 				break;
	 			default:
	 				value.showString = prop.getValue && prop.getValue();
	 				value.sqlString = prop.getValue && prop.getValue();
	 				value.expression = null;
	 				fieldValue.push(value);
    	 			conditionCached[attr] = fieldValue;
	 		}
    	 	
    	 }
    	 viewModel.conditionCached = conditionCached;
    },
    dealSuccess: function (success, fail, viewModel) {
		// 必须放在最前面
        viewModel.clear();
        // remove掉切换前页面添加的字段
        var preAddedViewModels = viewModel.preAddedViewModel;
        if(preAddedViewModels.length > 0){
	        for(var i = 0; i < preAddedViewModels.length; i++ ) {
				viewModel.remove(preAddedViewModels[i]);     	
	        }
	        viewModel.preAddedViewModel = [];
        }
        
        var result = {};
        result.propertyitem = success;
        var html = template("queryschememanage", result);
        $("#searchItem").html(html);

        var count = 0;
        for (var i = 0; i < success.length; i++) {
            var item = success[i];
            // 只显示快捷条件
            if (!item.filterMeta.isDefault) {
                continue;
            }
            // 最多6个查询条件
            if (count++ > 5) break;
            // 先清空上次的viewModel再添加新的
            viewModel.remove(item.filterMeta.fieldCode);
            var filterMeta = {};
            // 是否必输
            if(item.filterMeta.isRequired)
            	filterMeta.isNullable = !item.filterMeta.isRequired;
            filterMeta.title = item.filterMeta.fieldName;
            var fieldCode = item.filterMeta.fieldCode.replace(/\./g,'_');
            if (item.operator != "between") {
                switch (item.filterMeta.fieldType) {
                    case "Refer":
                        filterMeta.refId = item.filterMeta.fieldMDValue;
                        filterMeta.refKey = item.filterMeta.refPkField;
                        filterMeta.refCode = item.filterMeta.refCodeField;
                        filterMeta.refName = item.filterMeta.refNameField;
                        if (item.fieldValue && item.fieldValue.length) {
                            filterMeta.value = item.fieldValue[0].sqlString;
                            filterMeta.name = item.fieldValue[0].showString;
                        }
                        //需要指定ctrlType为Refer
                        filterMeta.ctrlType = "Refer";
                        // 移除参照另外加的两个字段
                        viewModel.remove(fieldCode+"_code");
                        viewModel.remove(fieldCode+"_name");
                        viewModel.add(fieldCode, filterMeta);
                        break;
                    case "ComboBox":
                        filterMeta.dataSource = {};
                        var enumValues = item.filterMeta.fieldMDValue.split(",");
                        var dataSource = [];
                        for (var j = 0; j < enumValues.length; j++) {
                            var keyValue = enumValues[j].split(":");
                            dataSource.push({ value: keyValue[0], text: keyValue[1] });
                        }
                        filterMeta.dataSource = dataSource;
                        if (item.fieldValue && item.fieldValue.length)
                            filterMeta.value = item.fieldValue[0].sqlString;
                        filterMeta.ctrlType = "ComboBox";
                        viewModel.add(fieldCode, filterMeta);
                        break;
                    default:
                        if (item.fieldValue && item.fieldValue.length)
                            filterMeta.value = item.fieldValue[0].sqlString;
                        viewModel.add(fieldCode, filterMeta);
                        break;
                }
            }
            else {
                filterMeta = item;
                viewModel.add(fieldCode, { "Init": filterMeta, "title": item.filterMeta.fieldName, "isValid": this.validate(item)});
                viewModel.get(fieldCode).setValue(filterMeta);
                viewModel.get(fieldCode).set("isNullable",!filterMeta.filterMeta.isRequired);
            }
            // 记录本页面添加的viewModel
            viewModel.thisAddedViewModel.push(fieldCode);
            viewModel.preAddedViewModel.push(fieldCode);
            
        }
        var $container = $("[data-viewmodel='" + viewModel.getModelName() + "']");
        if ($container.length)
            cb.viewbinding.update($container.attr("id"));
    },
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
    init_Extend: function (viewModel) {
        var params = cb.route.getViewPartParams(viewModel);
        var parentViewModel = params.parentViewModel;
        var schemeInfo = parentViewModel.getqueryScheme().getValue();
        if (!schemeInfo || !schemeInfo.queryschemeID) {
            cb.util.warningMessage("请选择一个查询方案!");
            return;
        }  

        var symbol = parentViewModel.getSymbol();
        if (symbol) {
            cb.data.CommonProxy(symbol).LoadSchemeDetail({ queryschemeID: schemeInfo.queryschemeID }, function (success, fail) {
                if (fail) {
                    cb.util.warningMessage("获取查询方案获取失败!");
                    return;
                }
                if (!success) {
                    cb.util.warningMessage("当前查询方案无任何查询项!");
                    return;
                }
                QuerySchemeViewModel_Extend.dealSuccess(success, fail, viewModel);
            });
        }
    }
};