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
        cardAction: new cb.model.SimpleModel(),
		closeAction:new cb.model.SimpleModel({title:"关闭",model:"no-text",ctrlType:"Button"}),
		<%for(var i=0;i<application.viewmodel.fields.length;i++){%>
			<%var field=application.viewmodel.fields[i];%>
			<%=field.name%>:<%=field.value%>
		<%}%>
    };

    this.setData(fields);
    this.setDirty(false);

    this.commonFunc = this.commonFunc || new cb.data.commonCatalogs(this);
    this.extendFunc = this.extendFunc || new cb.viewmodel.<%=application.moduleName%>_<%=application.viewmodel.extendName%>();

    //事件注册---需要整理，框架需要变动

    this.getlistMenu().on("click", function (args){
        var viewModel = this.getParent();
        if(viewModel.extendFunc.menuItemClick){
            viewModel.extendFunc.menuItemClick(viewModel, args);
        };
    });

    this.getcardAction().on("click", function (args){
        var viewModel = this.getParent();
        if(viewModel.extendFunc.cardAction){
            viewModel.extendFunc.cardAction(viewModel, args);
        };
    });

    this.getcloseAction().on("click", function (args){
        var viewModel = this.getParent();
        cb.route.hideArchiveViewPart(viewModel);
    });

    <%for(var i=0; i<application.viewmodel.actions.length; i++){%>
        <%var action = application.viewmodel.actions[i];%>
        <%if(action.defaultImpl==null){%>
            this.get<%=action.field%>().on("<%=action.eventName%>", function (args) {
                var viewModel= this.getParent();
                if(viewModel.extendFunc.<%=action.functionName%>)
                    viewModel.extendFunc.<%=action.functionName%>(viewModel, args);
            });
        <%}else{%>
            this.get<%=action.field%>().on("<%=action.eventName%>", function (data) {
                var viewModel = this.getParent();
                var args = { inputData: data, cancel: false, selfModel: this };
                if(viewModel.extendFunc.<%=action.functionName%>)
                    viewModel.extendFunc.<%=action.functionName%>(viewModel, args);
                if (args.cancel) return;
                viewModel.commonFunc.<%=action.defaultImpl%>(data, this);
            });
        <%}%>
    <%}%>

    var proxyConfig = {
        GetMenu: { url: "u8services/classes/UAP/com.yonyou.u8.framework.server.service.base.MenuService?method=GetMenu", method: "Get" }
    };
    this.setProxy(proxyConfig);

	if (this.extendFunc.initializeOneTime)
		this.extendFunc.initializeOneTime(this);
    
	this.initData();
};

cb.viewmodel.<%=application.moduleName%>_<%=application.viewmodel.name%>.prototype.initData = function () {
    if(this.extendFunc.doAction){
        this.extendFunc.doAction("init_Extend", this);
    };
};
