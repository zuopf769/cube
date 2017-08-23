/// <reference path="../../common/js/Cube.js" />
/// <reference path="<#=name#>_Extend.js" />
<#*(viewModel:viewModels){#>
var <#=name#> = function (name) {
    cb.model.ContainerModel.call(this, null, name || "<#=name#>");
    this.init();
};
<#=name#>.prototype = new cb.model.ContainerModel();
<#=name#>.prototype.constructor = <#=name#>;

<#=name#>.prototype.init = function () {
    var fields = {
        ViewModelName: "<#=name#>",
        Symbol: "<#=view.owner.symbol#>",
		title:"<#=title#>",
        listMenu: new cb.model.SimpleModel(),
        cardAction: new cb.model.SimpleModel({model:"no-text"}),
        queryScheme: new cb.model.SimpleModel(),
        searchAction: new cb.model.SimpleModel(),
        queryAction: new cb.model.SimpleModel({model:"no-text"}),
        expandAction: new cb.model.SimpleModel(),
        timeLine: new cb.model.SimpleModel(),
        leftToolbar: new cb.model.SimpleModel(),
        rightToolbar: new cb.model.SimpleModel(),
        <#@FieldBuilder#>
        
    };
    this.setData(fields);
    this.setDirty(false);

    //事件注册---需要整理，框架需要变动
    this.getlistMenu().on("click", function (args) { <#=extendName#>.menuItemClick(this.getParent(), args); });
    this.getcardAction().on("click", function () { <#=extendName#>.cardAction(this.getParent()); });
    this.getqueryScheme().on("click", function (args) { <#=extendName#>.queryScheme(this.getParent(), args); });        
    this.getexpandAction().on("click", function () { <#=extendName#>.expandAction(this.getParent()); });
    this.gettimeLine().on("click", function (args) { <#=extendName#>.timeItemClick(this.getParent(), args) });



    <#*(action:actions)?(field==null){#>
    this.on("<#=eventName#>", function (args) { <#=owner.extendName#>.<#=functionName#>(this.getParent(), args); });
    <#}#>
    <#*(action:actions)?(field!=null && field.control!=null){#>
	<#?(defaultImpl==//默认实现){#>
    this.get<#=field#>().on("<#=eventName#>", function (args) {
		if (<#=owner.extendName#>.<#=functionName#>)
			<#=owner.extendName#>.<#=functionName#>(this.getParent(), args);
	});
	<#}#>
	<#?(defaultImpl!=//默认实现){#>
    this.get<#=field#>().on("<#=eventName#>", function (data) {
		var args = {inputData:data,cancel:false};
		var viewModel = this.getParent();
		args.commonCRUD = new cb.data.commonCRUD(viewModel);
		if (<#=owner.extendName#>.<#=functionName#>)
			<#=owner.extendName#>.<#=functionName#>(viewModel, args);
		if (args.cancel) return;
		if (args.commonCRUD.<#=defaultImpl#>)
			args.commonCRUD.<#=defaultImpl#>(args.inputData);
	});
	<#}#>
    <#}#>

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

<#=name#>.prototype.initData = function () {
    <#=extendName#>.doAction("init_Extend", this);
};
<#}#>