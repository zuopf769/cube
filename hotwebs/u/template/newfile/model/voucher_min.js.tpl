/// <reference path="../../common/js/Cube.js" />
/// <reference path="<%=application.viewmodel.extendName%>.js" />

cb.viewmodel.<%=application.moduleName%>_<%=application.viewmodel.name%> = function (name) {
    cb.model.ContainerModel.call(this, null, name || "<%=application.moduleName%>_<%=application.viewmodel.name%>");
    this.init();
};
cb.viewmodel.<%=application.moduleName%>_<%=application.viewmodel.name%>.prototype = new cb.model.ContainerModel();
cb.viewmodel.<%=application.moduleName%>_<%=application.viewmodel.name%>.prototype.constructor = cb.viewmodel.<%=application.moduleName%>_<%=application.viewmodel.name%>;

cb.viewmodel.<%=application.moduleName%>_<%=application.viewmodel.name%>.prototype.init = function () {
    var fields = {
        ViewModelName: "<%=application.moduleName%>_<%=application.viewmodel.name%>",
		Symbol: "<%=application.symbol%>",
		closeAction:new cb.model.SimpleModel({title:"关闭",model:"no-text",ctrlType:"Button"}),
        bodyAction:new cb.model.SimpleModel({title:"表体",ctrlType:"Button"}),
        searchAction: new cb.model.SimpleModel(),
		toolbarContent: new cb.model.SimpleModel({ maxLength: 5 }),
        tabMenu: new cb.model.SimpleModel({isNeedCollect:false,mode:"strip",dataSource:[]}),
		lineToolbarContent: new cb.model.SimpleModel(),		
		attachmentList: new cb.model.SimpleModel(),
		<%for(var i=0;i<application.viewmodel.fields.length;i++){%>
			<%var field = application.viewmodel.fields[i];%>
			<%=field.name%>:<%=field.value%>
		<%}%>
    };
    this.setData(fields);
    this.setDirty(false);

	this.commonCRUD = new cb.data.commonCRUD(this);
	this.extendFunc = new cb.viewmodel.<%=application.moduleName%>_<%=application.viewmodel.extendName%>();	

    //事件注册---需要整理，框架需要变动
    this.getcloseAction().on("click", function () {
        cb.route.hideArchiveViewPart(this.getParent());
    });
    this.getbodyAction().on("click", function (args) { this.getParent().extendFunc.bodyAction(this.getParent(), args); });	
	this.gettabMenu().on("click", function (args) { this.getParent().extendFunc.tabMenuClick(this.getParent(), args); });
	<%for(var i=0;i<application.viewmodel.actions.length;i++){%>
		<%var action = application.viewmodel.actions[i];%>
		<%if(action.defaultImpl==null){%>
			this.get<%=action.field%>().on("<%=action.eventName%>", function (args) {
				if(this.getParent().extendFunc.<%=action.functionName%>)
					this.getParent().extendFunc.<%=action.functionName%>(this.getParent(), args);
			});
		<%}else{%>
			this.get<%=action.field%>().on("<%=action.eventName%>", function (data) {
				var viewModel = this.getParent();
				var args = { inputData: data, cancel: false, commonCRUD: viewModel.commonCRUD };
				if(viewModel.extendFunc.<%=action.functionName%>)
					viewModel.extendFunc.<%=action.functionName%>(viewModel, args);
				if (args.cancel) return;
				args.commonCRUD.<%=action.defaultImpl%>(data);
			});
		<%}%>
    <%}%>

	<%if(application.viewmodel.formulas){%>
        var formulas=<%=application.viewmodel.formulas%>
		//公式
	    cb.formula.register(this,formulas);
    <%}%>


	
    this.initData();
};

cb.viewmodel.<%=application.moduleName%>_<%=application.viewmodel.name%>.prototype.initData = function () {
	if (this.extendFunc.doAction)
		this.extendFunc.doAction("init_Extend", this);   
};