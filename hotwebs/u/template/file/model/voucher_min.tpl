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
        bodyAction:new cb.model.SimpleModel({title:"表体",ctrlType:"Button"}),
        searchAction: new cb.model.SimpleModel(),
		prevAction:new cb.model.SimpleModel({title:"上一条",model:"no-text"}),
		nextAction:new cb.model.SimpleModel({title:"下一条",model:"no-text"}),
		toolbarContent: new cb.model.SimpleModel({ maxLength: 5 }),
        tabMenu: new cb.model.SimpleModel({
            isNeedCollect: false, mode:"strip", dataSource: [
                <#*(container:view.containers)?(name==Tab){#>
                    <#*(control:controls){#>
                        { content: "<#=name#>"<#?(isFirst==true){#>, isSelected: true<#}#> }<#?(isLast==false)#>,<#}#>

                    <#}#>
                <#}#>
            ]
        }),
		lineToolbarContent: new cb.model.SimpleModel(),
        <#@FieldBuilder#>
        
    };
    this.setData(fields);
    this.setDirty(false);

    //事件注册---需要整理，框架需要变动
    this.getcloseAction().on("click", function () {
        cb.route.hideArchiveViewPart(this.getParent());
    });
    this.getbodyAction().on("click", function (args) { <#=extendName#>.bodyAction(this.getParent(), args); });
	this.getsearchAction().on("search", function (args) { <#=extendName#>.searchAction(this.getParent(), args); });
	//this.getprevAction().on("click", function (args) { <#=extendName#>.prevAction(this.getParent(), args); });
	//this.getnextAction().on("click", function (args) { <#=extendName#>.nextAction(this.getParent(), args); });
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
    this.get<#=field#>().on("<#=eventName#>", function (data) {
                var args = {inputData:data,cancel:false};
		var viewModel = this.getParent();
		args.commonCRUD = new cb.data.commonCRUD(viewModel);
		if (<#=owner.extendName#>.<#=functionName#>)
			<#=owner.extendName#>.<#=functionName#>(viewModel, args);
		if (args.cancel) return;
		args.commonCRUD.<#=defaultImpl#>(data);
	});
	<#}#>
    <#}#>

    var model3d = this.getModel3D();
    model3d.set("mode", "archives");
    model3d.setPageSize(15);

    this.initData();
};

<#=name#>.prototype.initData = function () {
    <#=extendName#>.doAction("init_Extend", this);
};
<#}#>