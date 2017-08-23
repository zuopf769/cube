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
        closeAction:new cb.model.SimpleModel({title:"关闭",model:"no-text",ctrlType:"Button"}),
        toolbarContent: new cb.model.SimpleModel(),
		tabMenu: new cb.model.SimpleModel({
            isNeedCollect: false, dataSource: [
                <#*(container:view.containers)?(name==Tab){#>
                    <#*(control:controls){#>
                        { content: "<#=name#>"<#?(isFirst==true){#>, isSelected: true<#}#> }<#?(isLast==false)#>,<#}#>

                    <#}#>
                <#}#>
            ]
        }),
        <#@FieldBuilder#>
        
    };
    this.setData(fields);
    this.setDirty(false);

    //事件注册---需要整理，框架需要变动
    this.getcloseAction().on("click", function () {
        cb.route.hideArchiveViewPart(this.getParent());
    });
    this.gettabMenu().on("click", function (args) { <#=extendName#>.tabMenuClick(this.getParent(), args); });
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
    this.get<#=field#>().on("<#=eventName#>", function (args) {
		if (args == null) args = {};
		if (typeof args !== "object") args = { inputData: args };
		args.cancel = false;
		var viewModel = this.getParent();
		args.commonCRUD = new cb.data.commonCRUD(viewModel);
		if (<#=owner.extendName#>.<#=functionName#>)
			<#=owner.extendName#>.<#=functionName#>(viewModel, args);
		if (args.cancel) return;
		args.commonCRUD.<#=defaultImpl#>();
	});
	<#}#>
    <#}#>

    this.initData();
};

<#=name#>.prototype.initData = function () {
    <#=extendName#>.doAction("init_Extend", this);
};
<#}#>