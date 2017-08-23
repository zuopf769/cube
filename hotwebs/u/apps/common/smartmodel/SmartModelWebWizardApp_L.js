var SmartModelWebWizardViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "SmartModelWebWizardViewModel");
    this.init();
};
SmartModelWebWizardViewModel.prototype = new cb.model.ContainerModel();
SmartModelWebWizardViewModel.prototype.constructor = SmartModelWebWizardViewModel;

SmartModelWebWizardViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "SmartModelWebWizardViewModel",
        Symbol: "common.smartmodel.SmartModelWebWizard",
        closeAction:new cb.model.SimpleModel(),
		smartMoodelWizardStep:new cb.model.SimpleModel({
			dataSource:[
			{ content: "common.smartmodel.SmartModelProviderStep", isSelected: true },
			{ content: "common.smartmodel.SmartModelJoinStep"},
			{ content: "metaDataStep"},
			{ content: "common.smartmodel.SmartModelMetaDataStep"},
			{ content: "parameterStep"},
			]			
		}),
		smartModelFootTab:new cb.model.SimpleModel({
			dataSource:[
			{content:"parametersTab",isSelected: true},
			{content:"macroVariableTab"}
			]
		}),
		smartModelProviderStep:new cb.model.SimpleModel(),
		NCMDProviderButton:new cb.model.SimpleModel(),
		metaProviderButton:new cb.model.SimpleModel(),
		sqlProviderButton:new cb.model.SimpleModel(),
		dataProcessProviderButton:new cb.model.SimpleModel(),
		businessDataButton:new cb.model.SimpleModel(),
		editProviderButton:new cb.model.SimpleModel(),
		deleteProviderButton:new cb.model.SimpleModel(),
		upProviderButton:new cb.model.SimpleModel(),
		downProviderButton:new cb.model.SimpleModel(),
		smartModelJoinStep:new cb.model.SimpleModel(),
		smartModelMetaDataStep:new cb.model.SimpleModel(),
		smartModelDescriptorStep:new cb.model.SimpleModel(),
		smartModelParameterStep:new cb.model.SimpleModel(),
		parametersTab:new cb.model.SimpleModel(),
		macroVariableTab:new cb.model.SimpleModel(),
		addParameterButton:new cb.model.SimpleModel(),
		deleteParameterButton:new cb.model.SimpleModel(),
		upParameterButton:new cb.model.SimpleModel(),
		downParameterButton:new cb.model.SimpleModel(),
		footToolbar:new cb.model.SimpleModel(),
		vaildateButton:new cb.model.SimpleModel(),
		previousButton:new cb.model.SimpleModel(),
		nextButton:new cb.model.SimpleModel(),
		saveButton:new cb.model.SimpleModel(),
		finishButton:new cb.model.SimpleModel(),
		cancelButton:new cb.model.SimpleModel(),
		addmacroVariableButton:new cb.model.SimpleModel(),
		deletemacroVariableButton:new cb.model.SimpleModel(),
		upmacroVariableButton:new cb.model.SimpleModel(),
		downmacroVariableButton:new cb.model.SimpleModel(),
		providerForm:new cb.model.Model3D({title:"选择表",ctrlType:"dataGrid",Columns:{
			code:{title:"表别名",ctrlType:"TextBox"},
			title:{title:"表显示名",ctrlType:"TextBox"}
		}}),
		parametersForm:new cb.model.Model3D({title:"查询参数",ctrlType:"dataGrid",Columns:{
			code:{title:"编码",ctrlType:"TextBox"},
			name:{title:"名称",ctrlType:"TextBox"},
			operator:{title:"操作符",ctrlType:"TextBox"},
			dataType:{title:"类型",ctrlType:"TextBox"},
			refCode:{title:"属性",ctrlType:"TextBox"},
			value:{title:"默认值",ctrlType:"TextBox"},
			required:{title:"必填",ctrlType:"CheckBox"},
			refDepend:{title:"参照依赖",ctrlType:"TextBox"},
			enablePermission:{title:"启用权限",ctrlType:"TextBox"},
			operationCode:{title:"使用场景",ctrlType:"TextBox"},
			note:{title:"备注",ctrlType:"TextBox"}
		}}),
		macroVariableForm:new cb.model.Model3D({title:"宏变量",ctrlType:"dataGrid",Columns:{
			code:{title:"编码",ctrlType:"TextBox"},
			name:{title:"名称",ctrlType:"TextBox"},
			type:{title:"类型",ctrlType:"ComBox",dataSource:[
			{text:"SQL语句",value:"1"},
			{text:"NC公式",value:"0"}
			]},
			value:{tiutle:"表达式",ctrlType:"TextBox"},
			note:{title:"备注",ctrlType:"TextBox"}
		}})
    };
	this.setData(fields);
    this.setDirty(false);
	//事件注册---需要整理，框架需要变动
}