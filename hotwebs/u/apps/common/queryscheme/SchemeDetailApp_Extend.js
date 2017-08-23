var SchemeDetailViewModel_Extend = {
    doAction: function (name, viewModel) {
        if (this[name]) this[name](viewModel);
    },
    closeActionClick: function (viewModel) {
        cb.route.hidePageViewPart(viewModel);
    },
    submitAction: function (viewModel) {
        var params = cb.route.getViewPartParams(viewModel);
        var symbol = params.parentViewModel.getSymbol();
        var subparam = {
            appid: symbol,
            pk_queryscheme: null
        };
        if (params.hasOwnProperty('queryschemeid')) {
            subparam.pk_queryscheme = params.queryschemeid;
            subparam.appid = cb.route.getViewPartParams(params.parentViewModel).parentViewModel.getSymbol();
        }
        if (viewModel.get('ts')) {
            subparam.ts = viewModel.get('ts');
        }
        var schemeName = viewModel.getname().getValue();
        if (!schemeName) {
            cb.util.warningMessage('请输入方案名称！');
            return;
        }
        subparam.name = schemeName;
        var initData = viewModel.get('initData');
        var collectData = viewModel.collectData();
        // 把收集到的数据同步到原始数据
        initData.filterMeta.fieldName = collectData.fieldName;
        initData.operator = collectData.operators ? collectData.operators : initData.operator;
        initData.fieldValue = collectData.defaultValue ? collectData.defaultValue.fieldValue : initData.fieldValue;
        initData.filterMeta.isRequired = collectData.isRequired;
        initData.filterMeta.isDefault = collectData.isDefault;

        var allItems = viewModel.getpropertyNameList().getDataSource();
        var selectItem = [];
        for (var i = allItems.length - 1; i >= 0; i--) {
            if (allItems[i].filterMeta.fieldCode == initData.filterMeta.fieldCode) {
                allItems[i] = initData;
            }
            if (allItems[i].filterMeta.isSelected == true)
                selectItem.push(allItems[i]);
        }
        if (selectItem.length == 0) {
            cb.util.warningMessage('请选择至少一项内容进行保存！');
            return;
        }
        
        // 按照indexNum排序
        subparam.filters = selectItem.sort(function(a,b){
        	return a.index - b.index;
        });

        cb.data.CommonProxy("UAP").QuerySchemeSave(subparam, function (success, fail) {
            if (fail) {
                alert("保存失败:" + fail.error);
                return;
            }
            if (params.hasOwnProperty('queryschemeid')) {
                cb.route.getViewPartParams(params.parentViewModel).parentViewModel.initData();
            }
            else {
                params.parentViewModel.initData() ? params.parentViewModel.initData() : null;
            }
            cb.util.tipMessage("保存查询方案成功！");
            cb.route.hidePageViewPart(viewModel);
            viewModel.clear();
        });
    },
    cancelAction: function (viewModel) {
        cb.route.hidePageViewPart(viewModel);
    },
  
    operatorChange: function (viewModel, args) {
        var initData = viewModel.get('initData');

        if (!initData) return;
        var newData = cb.clone(initData);
        if (typeof args.OldValue == 'object' ? args.OldValue.value == 'between' : args.OldValue == 'between') {
            newData.operator = args.Value;
            viewModel.getdefaultValue().set("init", newData);
        }
        else {
            if (args.Value == 'between') {
                newData.operator = args.Value;
                viewModel.getdefaultValue().set("init", newData);
            }
        }
    },

    propertyClick: function (viewModel, args) {
        var initctrlData = function (val, fieldType) {
            var defaultValue = {};
            switch (fieldType) {
                case "Refer":
                    defaultValue.refId = val.filterMeta.fieldMDValue;
                    defaultValue.refCode = val.filterMeta.refCodeField;
                    defaultValue.refName = val.filterMeta.refNameField;
                    break;
                case "ComboBox":
                    var dataSource = val.filterMeta.operators;
                    var arrdatasource = new Array();
                    for (var i = 0; i < dataSource.length; i++) {
                        var attrValue = dataSource[i].split(':');
                        arrdatasource.push({ text: attrValue[1], value: attrValue[0] });
                    }
                    defaultValue.dataSource = arrdatasource;
                    defaultValue.value = val.operator;
                    break;
                default:
                    defaultValue.defaultValue = val.filterMeta.fieldMDValue;
                    break;
            }
            return defaultValue;
        };
        if (args) {
            var initdata = viewModel.getpropertyNameList().getDataSource();
            if (args.prev) {
                var collectdata = viewModel.collectData();
                for (var i = 0; i < initdata.length; i++) {
                    if (args.prev.filterMeta.fieldCode == initdata[i].filterMeta.fieldCode) {
                        initdata[i].filterMeta.fieldName = collectdata.fieldName;
                        initdata[i].operator = collectdata.operators ? collectdata.operators : initdata[i].operator;
                        initdata[i].fieldValue = collectdata.defaultValue ? collectdata.defaultValue.fieldValue : initdata[i].fieldValue;
                        initdata[i].filterMeta.isRequired = collectdata.isRequired;
                        initdata[i].filterMeta.isDefault = collectdata.isDefault;
                        break;
                    }
                }
            }

            viewModel.getfieldName().setValue(args.data.filterMeta.fieldName);
            viewModel.getoperators().setData(initctrlData(args.data, 'ComboBox'));
            viewModel.getisRequired().setData({ value: args.data.filterMeta.isRequired });
            viewModel.getisDefault().setData({ value: args.data.filterMeta.isDefault });
            viewModel.getdefaultValue().set("init", cb.clone(args.data));
            viewModel.getdefaultValue().setValue(cb.clone(args.data));
            viewModel.set("initData", args.data);
        }
    },
    init_Extend: function (viewModel) {
        var params = cb.route.getViewPartParams(viewModel);
        var symbol = params.parentViewModel.getSymbol();
        var searchparam = {};
        if (params.hasOwnProperty('queryschemeid')) {
            searchparam.queryschemeID = params.queryschemeid;
            symbol = cb.route.getViewPartParams(params.parentViewModel).parentViewModel.getSymbol();
        }
        if (symbol) {
            cb.data.CommonProxy(symbol).LoadQueryTemplate(searchparam, function (success, fail) {
                if (fail) {
                    console.error("加载查询方案模板字段出错");
                    return;
                }
                if (success.name)
                    viewModel.getname().setValue(success.name);
                if (success.ts)
                    viewModel.set("ts", success.ts);
                viewModel.getpropertyNameList().setDataSource(success.filters);
            });
        }
    }
};