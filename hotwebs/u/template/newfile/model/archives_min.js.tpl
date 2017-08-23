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
        listMenu: new cb.model.SimpleModel(),
        menuAction: new cb.model.SimpleModel({model:"no-text"}),
        cardAction: new cb.model.SimpleModel({model:"no-text"}),
        searchAction: new cb.model.SimpleModel(),
        queryAction: new cb.model.SimpleModel({model:"no-text"}),
        timeLine: new cb.model.SimpleModel(),
        <%for(var i=0;i<application.viewmodel.fields.length;i++){%>
            <%var field = application.viewmodel.fields[i];%>
            <%=field.name%>:<%=field.value%>
        <%}%>
    };
    this.setData(fields);
    this.setDirty(false);

	this.commonFunc = this.commonFunc || new cb.data.commonArchives(this);
	this.extendFunc = this.extendFunc || new cb.viewmodel.<%=application.moduleName%>_<%=application.viewmodel.extendName%>();

    //事件注册---需要整理，框架需要变动
    this.getlistMenu().on("click", function (args) {
		var viewModel = this.getParent();
		if (viewModel.extendFunc.menuItemClick)
			viewModel.extendFunc.menuItemClick(viewModel, args);
	});
    this.getmenuAction().on("click", function (args) {
		var viewModel = this.getParent();
		if (viewModel.extendFunc.menuAction)
			viewModel.extendFunc.menuAction(viewModel, args);
	});
    this.getcardAction().on("click", function (args) {
		var viewModel = this.getParent();
		if (viewModel.extendFunc.cardAction)
			viewModel.extendFunc.cardAction(viewModel, args);
	});
    this.getsearchAction().on("search", function (args) {
		var viewModel = this.getParent();
		if (viewModel.extendFunc.searchAction)
			viewModel.extendFunc.searchAction(viewModel, args);
	});
    this.getqueryAction().on("click", function (args) {
		var viewModel = this.getParent();
		if (viewModel.extendFunc.queryAction)
			viewModel.extendFunc.queryAction(viewModel, args);
	});
    this.gettimeLine().on("click", function (args) {
		var viewModel = this.getParent();
		if (viewModel.extendFunc.timeItemClick)
			viewModel.extendFunc.timeItemClick(viewModel, args);
	});
	if (this.getaddschemeAction) {
		this.getaddschemeAction().on("click", function () {
			this.getParent().commonFunc.addScheme();
		});
	}
	if (this.getsetschemeAction) {
		this.getsetschemeAction().on("click", function () {
			this.getParent().commonFunc.setScheme();
		});
	}
	if (this.getexpandAction) {
		this.getexpandAction().on("click", function () {
			this.getParent().commonFunc.expandScheme();
		});
	}

   <%for(var i=0;i<application.viewmodel.actions.length;i++){%>
        <%var action = application.viewmodel.actions[i];%>
        <%if(action.defaultImpl==null){%>
            this.get<%=action.field%>().on("<%=action.eventName%>", function (args) {
                var viewModel = this.getParent();
				if (viewModel.extendFunc.<%=action.functionName%>)
                    viewModel.extendFunc.<%=action.functionName%>(viewModel, args);
            });
        <%}else{%>
            this.get<%=action.field%>().on("<%=action.eventName%>", function (data) {
                var viewModel = this.getParent();
                var args = { inputData: data, cancel: false };
                if (viewModel.extendFunc.<%=action.functionName%>)
                    viewModel.extendFunc.<%=action.functionName%>(viewModel, args);
                if (args.cancel) return;
                viewModel.commonFunc.<%=action.defaultImpl%>(data);
            });
        <%}%>
    <%}%>

    if (this.extendFunc.initializeOneTime)
        this.extendFunc.initializeOneTime(this);

    this.initData();
};

cb.viewmodel.<%=application.moduleName%>_<%=application.viewmodel.name%>.prototype.initData = function () {
    if (this.extendFunc.doAction)
		this.extendFunc.doAction("init_Extend", this);
};
