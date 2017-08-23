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
		title:"<%=application.viewmodel.title%>",
        listMenu: new cb.model.SimpleModel(),
        cardAction: new cb.model.SimpleModel({model:"no-text"}),
        queryScheme: new cb.model.SimpleModel(),
        searchAction: new cb.model.SimpleModel(),
        queryAction: new cb.model.SimpleModel({model:"no-text"}),
        expandAction: new cb.model.SimpleModel(),
        timeLine: new cb.model.SimpleModel(),
        leftToolbar: new cb.model.SimpleModel(),
        rightToolbar: new cb.model.SimpleModel(),		
		addschemeAction:new cb.model.SimpleModel(),
		setschemeAction:new cb.model.SimpleModel(),
        <%for(var i=0;i<application.viewmodel.fields.length;i++){%>
            <%var field=application.viewmodel.fields[i];%>
            <%=field.name%>:<%=field.value%>
        <%}%>        
    };
    this.setData(fields);
    this.setDirty(false);	

	this.commonCRUD = new cb.data.commonCRUD(this);
	this.extendFunc = new cb.viewmodel.<%=application.moduleName%>_<%=application.viewmodel.extendName%>();	

    //事件注册---需要整理，框架需要变动
    this.getlistMenu().on("click", function (args) { this.getParent().extendFunc.menuItemClick(this.getParent(), args); });
    this.getcardAction().on("click", function () { this.getParent().extendFunc.cardAction(this.getParent()); });
    this.getqueryScheme().on("click", function (args) { this.getParent().extendFunc.queryScheme(this.getParent(), args); });        
    this.getexpandAction().on("click", function () { this.getParent().extendFunc.expandAction(this.getParent()); });
    this.gettimeLine().on("click", function (args) { this.getParent().extendFunc.timeItemClick(this.getParent(), args) });
	this.getaddschemeAction().on('click', function () { this.getParent().extendFunc.addschemeAction(this.getParent());});
	this.getsetschemeAction().on('click', function () { this.getParent().extendFunc.setschemeAction(this.getParent());});
    
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

    var proxyConfig = {
        GetMenu: { url: "u8services/classes/UAP/com.yonyou.u8.framework.server.service.base.MenuService?method=GetMenu", method: "Get" }
    };
    this.setProxy(proxyConfig);

    var model3d = this.getModel3D();
    model3d.set("Mode", "Remote");
    model3d.set("ReadOnly", true);
    model3d.set("mode", "vouchers");
    model3d.setPageSize(15);

    this.initData();
};

cb.viewmodel.<%=application.moduleName%>_<%=application.viewmodel.name%>.prototype.initData = function () {
    if (this.extendFunc.doAction)
		this.extendFunc.doAction("init_Extend", this); 
};