CodeMapViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "CodeLevelViewModel");
    this.init();
};
CodeMapViewModel.prototype = new cb.model.ContainerModel();
CodeMapViewModel.prototype.constructor =CodeMapViewModel;

CodeMapViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "CodeMapView",
        Symbol: "codelevel.CodeLevel",
        toolbar: new cb.model.SimpleModel({ title: "修改" }),
        editAction: new cb.model.SimpleModel({ title: "修改" }),
        cancelAction: new cb.model.SimpleModel({ title: "取消" }),
        saveAction: new cb.model.SimpleModel({ title: "保存" }),
        entityRef:   new cb.model.SimpleModel({ title:"实体引用" }),
        codeMapTree: new cb.model.Model2D({isExpandAll:false}),
        elength: new cb.model.SimpleModel({ title: "映射值长度",minValue:1,maxValue:20,iScale:0}),
        styl: new cb.model.SimpleModel({ title: "补位方式", isNullable: false ,DataSource: [
        	 { text: "右补位", value: "0" },
             { text: "左补位", value: "1" },
             { text: "不补位", value: "2" }
        ]}),
        sign: new cb.model.SimpleModel({ title: "补位符号" ,isNullable: false }),
        defaultrule: new cb.model.SimpleModel({ title: "默认规则定义" }),
        ruledesc: new cb.model.SimpleModel({ title: "默认规则描述" }),
        /*codeTabMenu: new cb.model.SimpleModel({
            isNeedCollect: false, mode: "strip", dataSource: [
				{ content: "lisanDefine", isSelected: true },
                { content: "entityRef" }
            ]
        }),*/
        lisanDefineGrid: new cb.model.Model3D({
            readOnly: true,
            height: "500px", 
            filterable:false,
            dsMode: 'local', pageSize: -1, showCheckBox: false,
            commands: {
	                title: "操作",
	                width: "20%",
	                isVisible: true,
	               	cmds: [{ name: 'add', text: "<img src='pc/images/ImageButton/add.png'/>",click:function(args){CodeMapViewModel_Extend.reflectAddAction(this.getParent(), args);}}, { name: "delete", text: "<img src='pc/images/ImageButton/del.png'/>",click:function(args){CodeMapViewModel_Extend.reflectDeleteAction(this.getParent(), args);} }],
	           },
            title: "", ctrlType: "DataGrid", Columns: {
                code: { title: "编码", ctrlType: "TextBox", owner: "", width: "20%",readOnly:true},
                name: { title: "名称", ctrlType: "TextBox", owner: "", width: "20%" ,readOnly:true},
                value: { title: "映射值", ctrlType: "TextBox", owner: "", width: "20%",isNullable: false },
                pk_org: { title: "组织", ctrlType: "TextBox", owner: "", width: "20%" ,readOnly:true,},
	            
            }
            
        })
        /*entityRefGrid: new cb.model.Model3D({
            readOnly: true,
            height: "500px", 
            dsMode: 'local', pageSize: -1, showCheckBox: false,
            title: "", ctrlType: "DataGrid", Columns: {
                grp_name: { title: "集团", ctrlType: "TextBox", owner: "", width: "20%"},
                billtypecode: { title: "编码对象编码", ctrlType: "TextBox", owner: "", width: "20%" },
                billtypename: { title: "编码对象名称", ctrlType: "TextBox", owner: "", width: "20%" },
                rulecode: { title: "规则编码", ctrlType: "TextBox", owner: "", width: "20%" },
                rulename: { title: "编码名称", ctrlType: "TextBox", owner: "", width: "20%" }
            }
        })*/
    };
    this.setData(fields);
    this.setDirty(false);

    //事件注册---需要整理，框架需要变动
    this.geteditAction().on("click", function (args) {CodeMapViewModel_Extend.editAction(this.getParent(), args); });
    this.getsaveAction().on("click", function (args) {CodeMapViewModel_Extend.saveAction(this.getParent(), args); });
    this.getcancelAction().on("click", function (args) {CodeMapViewModel_Extend.cancelAction(this.getParent(), args); });
    this.getcodeMapTree().on("click",function (args) {CodeMapViewModel_Extend.mapTreeClick(this.getParent(), args); })
   	this.getlisanDefineGrid().on("afterCellChange", function (args) { CodeMapViewModel_Extend.lisanDefineGridAction(this.getParent(), args); });
  	this.getentityRef().on("click", function (args) {CodeMapViewModel_Extend.entityRef(this.getParent(), args); });
  //服务代理
    var proxyConfig = {
    	 CreateCodeMappingTree: { url: "classes/General/UAP/CreateCodeMappingTree", method: "POST" },
    	 QryCodeMappingInfo: { url: "classes/General/UAP/QryCodeMappingInfo", method: "GET" },
	     UpdateCodeMapping:{url: "classes/General/UAP/UpdateCodeMapping", method: "POST"}
    };
	this.setProxy(proxyConfig);
	this.initData();
};

CodeMapViewModel.prototype.initData = function () {
   CodeMapViewModel_Extend.doAction("init_Extend", this);
};
