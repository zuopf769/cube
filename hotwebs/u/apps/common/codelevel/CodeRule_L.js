/// <reference path="../../../common/js/Cube.js" />
/// <reference path="../../../pc/js/grid/DataGrid.editors.js" />
/// <reference path="../../../pc/js/grid/GridVM.js" />

var CodeRuleViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "CodeRuleViewModel");
    this.init();
};
CodeRuleViewModel.prototype = new cb.model.ContainerModel();
CodeRuleViewModel.prototype.constructor = CodeRuleViewModel;

CodeRuleViewModel.prototype.init = function () {   
    var fields = {
        ViewModelName: "CodeRuleViewModel",
        Symbol: "codelevel.CodeRule",
        codeRuleTree: new cb.model.Model2D({ title: "编码规则", isExpandAll: false,
        	template: "# if(item.data.isdefault) {#  <span style='color:red;'> #=item.name #</span> #} else {# #=item.name # #}#"
        }),
        toolbar: new cb.model.SimpleModel({ title: "工具条" }),
        addAction: new cb.model.SimpleModel({ title: "新增" }),
        editAction: new cb.model.SimpleModel({ title: "修改" }),
        saveAction: new cb.model.SimpleModel({ title: "保存" }),
        cancelAction: new cb.model.SimpleModel({ title: "取消" }),
        deleteAction: new cb.model.SimpleModel({ title: "删除" }),
        startAction: new cb.model.SimpleModel({ title: "启用", ctrlType: "Button", owner: "Toolbar 功能" }),
        stopAction: new cb.model.SimpleModel({ title: "停用", ctrlType: "Button", owner: "Toolbar 功能" }),
        assigned: new cb.model.SimpleModel({ title: "分配组织" }),
        brokenCodeManage: new cb.model.SimpleModel({ title: "断码管理" }),
        waterManage: new cb.model.SimpleModel({ title: "流水管理" }),
        isdefault: new cb.model.SimpleModel({ title: "设置为默认" }),
        preview: new cb.model.SimpleModel({ title: "预览效果" }),
        rulecode: new cb.model.SimpleModel({ title: "编码规则", isNullable: false, refShowMode: "LetterDigit", iLength: 50 }),
        rulename: new cb.model.SimpleModel({ title: "规则名称", isNullable: false }),
        iseditable: new cb.model.SimpleModel({ title: "编码是否可编辑" }),
        isautofill: new cb.model.SimpleModel({ title: "是否断码补码" }),
        format: new cb.model.SimpleModel({
            title: "时间格式", value: "yyyyMMdd", DataSource: [
                { text: "yy", value: "yy" },
                { text: "yyyy", value: "yyyy" },
                { text: "yyMM", value: "yyMM" },
                { text: "yyyyMM", value: "yyyyMM" },
                { text: "yyMMdd", value: "yyMMdd" },
                { text: "yyyyMMdd", value: "yyyyMMdd" },
            ]
        }),
        showStyle: new cb.model.SimpleModel({ title: "显示样式" }),
        codescope: new cb.model.SimpleModel({
            title: "归零依据", value: "a", DataSource: [
                { text: "全局", value: "a" },
                //{ text: "集团", value: "g" },
                { text: "组织", value: "o" }
            ]
        }),
        codeLength: new cb.model.SimpleModel({ title: "编码长度", length: 40 }),
        islenvar: new cb.model.SimpleModel({ title: "流水号补位" }),
        isgetpk: new cb.model.SimpleModel({ title: "是否产生随机码" }),
        codemode: new cb.model.SimpleModel({
            title: "编码方式", value: "pre", DataSource: [
                { text: "前编码", value: "pre" },
                { text: "后编码", value: "after" }
            ]
        }),
        codeRuleGrid: new cb.model.Model3D({
            checks: {
                editable: function (rowIndex, field) {
                    var rowData = this.getRows(rowIndex);
                    var codeMode = this.getParent().getcodemode().getValue();
                    if (field === 'elemlenth' && rowData[rowIndex]['elemtype'] !== 3) return false;
                    if (field === 'isrefer' && (rowData[rowIndex]["elemtype"] == 0 || rowData[rowIndex]["elemtype"] == 3)) return false;
                    if ((field === 'elemvalue' && rowData[rowIndex]['elemtype']== 3) 
                     		|| (field === 'elemvalue' && rowData[rowIndex]['elemtype']== 2 && codeMode == "pre"))return false;
                },
                //自定义grid
                customEditor: function (rowIndex, field) {
                    var editConfig = {};
                    var rowData = model3d.getRows();
                    var timeStyle = formatStyle.getValue();
                    //前缀类型
                    if (field == "elemtype") {
                        editConfig.ctrlType = 'ComboBox';
                        editConfig.dataSource = [
                          { text: "常量", value: 0 },
                          { text: "业务实体", value: 1 },
                          { text: "时间类型", value: 2 },
                          { text: "流水号", value: 3 },
                        ];
                    }   
                    //前缀值
                    else if (field == 'elemvalue') {
                        //业务实体
                        if (rowData[rowIndex]["elemtype"] == 1) {
                            editConfig.ctrlType = 'Refer';
                            editConfig.refPath = "common.codelevel.EntityApp";
                            editConfig.refId = "common.codelevel.EntityApp";
                            editConfig.refKey = "value";
                            editConfig.refCode = "value";
                            editConfig.refName = "name";
                            editConfig.refShowMode = "Name";
                            editConfig.refRelation = "pk_billcodeentity=pk_billcodeentity,elemvalue=elemvalue,elemname=name,elemlenth=elength";
                            editConfig.queryData = { "nbcrcode": CodeRuleViewModel_Extend.nbcrCode };
                            /*
                            editConfig.callBack = function (rgs) {
                                rowData[rowIndex][field].value = args.elemname;
                            }
                            */
                        }
                        //常量
                        else if (rowData[rowIndex]["elemtype"] == 0) {
                            editConfig.ctrlType = 'TextBox';
                        }
                        //时间类型
                        else if (rowData[rowIndex]["elemtype"] == 2) {
                            editConfig.ctrlType = 'Refer';
                            editConfig.refPath = "common.codelevel.TimeTypeApp";
                            editConfig.refId = "common.codelevel.TimeTypeApp";
                            editConfig.refKey = "value";
                            editConfig.refCode = "value";
                            editConfig.refName = "name";
                            editConfig.refShowMode = "Name";
                            editConfig.refRelation = "elemname=name,elemvalue=value";
                            editConfig.queryData = { "nbcrcode": CodeRuleViewModel_Extend.nbcrCode };
                            editConfig.popSize = {width: "400px",height: "505px"};
                            /*  
                            editConfig.callBack = function (args) {
                             	rowData[rowIndex][field].value = args.value;
                          	}
                          	*/
                        }
                        //流水号
                        else if (rowData[rowIndex]["elemtype"] == 3) {
                            editConfig.ctrlType = 'TextBox';
                        }
                        
                    }
                    //是否流水依据
                    else if (field == 'isrefer') {
                        editConfig.ctrlType = 'ComboBox';
                        var dataSource = [];
                        if (rowData[rowIndex]["elemtype"] == 2){
                        	if(timeStyle == "yy" || timeStyle == "yyyy"){
	                        	dataSource = [
	                           	 	{ text: "非流水依据", value: 0 },
	                            	{ text: "按年流水", value: 1 }
	                        	];
	                        }
	                        else if(timeStyle == "yyMM" || timeStyle == "yyyyMM"){
	                        	dataSource = [
	                           	 	{ text: "非流水依据", value: 0 },
	                            	{ text: "按年流水", value: 1 },
	                            	{ text: "按月流水", value: 2}
	                        	];
	                        }
	                        else if(timeStyle == "yyMMdd" || timeStyle == "yyyyMMdd"){
	                        	dataSource = [
	                           	 	{ text: "非流水依据", value: 0 },
	                            	{ text: "按年流水", value: 1 },
	                            	{ text: "按月流水", value: 2 },
	                            	{ text: "按日流水", value: 3 }
	                        	];
	                        }
                        }
                        else {
                        	dataSource = [
                           	 	{ text: "非流水依据", value: 0 },
                            	{ text: "流水依据", value: 1 }
	                        ];
                        }
                        editConfig.dataSource = dataSource;
                    }
                    else if (field == 'elemlenth') {
                    	editConfig.ctrlType = 'NumberBox';
                    }
                    return editConfig;
                }
            },
            readOnly: true, pageSize: -1, height: '400px',
            dsMode: 'local', showCheckBox: false, filterable:false,
            title: "", ctrlType: "DataGrid", Columns: {
                elemtype: {
                    title: "前缀类型", ctrlType: "ComboBox", width: "15%", isVisible: true,
                    dataType: "string", defaultValue: 3, isNullable: true,
                    dataSource: [
                          { text: "常量", value: 0 },
                          { text: "业务实体", value: 1 },
                          { text: "时间类型", value: 2 },
                          { text: "流水号", value: 3 },
                    ]
                },
                elemvalue: {
                    template: '#=data.elemname!=null?data.elemname:data.elemvalue||""#',
                    title: "前缀值", ctrlType: "TextBox", owner: "", width: "15%"
                },   
                isrefer: {
                    width: "15%",
                    template: "#if(data.elemtype==2){ if(data.isrefer == 0) {# #='非流水依据'# #} else if(data.isrefer == 1) {# #='按年流水'# #} else if(data.isrefer == 2) {#"
                    	+ "#='按月流水'# #}else if(data.isrefer == 3) {# #='按日流水'# #}# #} else{ if(data.isrefer == 0) {#"
                    	+ "#='非流水依据'# #} else if(data.isrefer == 1){# #='流水依据'# #}}#",
                    title: "是否流水依据", ctrlType: "ComboBox", owner: "", dataType: "string", dataSource: [
                        { text: "流水依据", value: 1 },
                        { text: "非流水依据", value: 0 }
                    ]
                },
                elemlenth: { title: "长度", ctrlType: "NumberBox", owner: "", width: "10%", isNullable: false,editable: true },
            },
            commands: {
                title: "操作",
                width: "25%",
                isVisible: true,
                cmds: [{ name: 'add', text: "<img src='pc/images/ImageButton/add.png'/>",click:function(args){CodeRuleViewModel_Extend.codeRuleGridAddLine(this.getParent(), args);}}, { name: "delete", text: "<img src='pc/images/ImageButton/del.png'/>",click:function(args){CodeRuleViewModel_Extend.codeRuleGridDeleteLine(this.getParent(), args);} }],
            }
        }),
    };
    this.setData(fields);
    this.setDirty(false);
    var model3d = this.getcodeRuleGrid();
    var formatStyle = this.getformat();
    //事件注册---需要整理，框架需要变动
    this.getaddAction().on("click", function (args) { CodeRuleViewModel_Extend.addAction(this.getParent(), args); });
    this.geteditAction().on("click", function (args) { CodeRuleViewModel_Extend.editAction(this.getParent(), args); });
    this.getsaveAction().on("click", function (args) { CodeRuleViewModel_Extend.saveAction(this.getParent(), args); });
    this.getcancelAction().on("click", function (args) { CodeRuleViewModel_Extend.cancelAction(this.getParent(), args); });
    this.getbrokenCodeManage().on("click", function (args) { CodeRuleViewModel_Extend.brokenCodeManage(this.getParent(), args); });
    this.getwaterManage().on("click", function (args) { CodeRuleViewModel_Extend.waterManageAction(this.getParent(), args); });
    this.getcodeRuleTree().on("click", function (args) { CodeRuleViewModel_Extend.codeRuleTreeAction(this.getParent(), args); });
    this.getassigned().on("click", function (args) { CodeRuleViewModel_Extend.assigneOrgAction(this.getParent(), args); });
    this.getdeleteAction().on("click", function (args) { CodeRuleViewModel_Extend.deleteAction(this.getParent(), args); });
    this.getstartAction().on("click", function (args) { CodeRuleViewModel_Extend.startAction(this.getParent(), args); });
    this.getstopAction().on("click", function (args) { CodeRuleViewModel_Extend.stopAction(this.getParent(), args); });
    this.getisdefault().on("afterChange", function (args) { CodeRuleViewModel_Extend.isdefaultAction(this.getParent(), args); });
    this.getcodeRuleGrid().on("afterCellChange", function (args) { CodeRuleViewModel_Extend.codeRuleGridAction(this.getParent(), args); });
    this.getformat().on("afterChange", function (args) { CodeRuleViewModel_Extend.formatAction(this.getParent(), args); });

    //服务代理
    var proxyConfig = {
        CodeRuleTree: { url: "classes/General/UAP/CreateCodeRuleTree", method: "Get" },
        CodeRuleGrid: { url: "classes/General/UAP/QryElemsByPkbase", method: "Get" },
        CodeRuleCreate: { url: "classes/General/UAP/InsertRule", method: "Post" },
        CodeRuleEdit: { url: "classes/General/UAP/UpdateRule?clearhis=true", method: "Post" },
        CodeRuleDelete: { url: "classes/General/UAP/DeleteRule", method: "Get" },
        UnlockBillCodeRule: { url: "classes/General/UAP/UnlockBillCodeRule", method: "Post" },
        LockBillCodeRule: { url: "classes/General/UAP/LockBillCodeRule", method: "Post" },
        CancelDefaultBillCodeRule: { url: "classes/General/uap/CancelDefaultBillCodeRule", method: "Post" },
        SetDefaultBillCodeRule: { url: "classes/General/uap/SetDefaultBillCodeRule", method: "Post" },
        
    };
    this.setProxy(proxyConfig);
    //公式
    //cb.formula.register(this, [{ "trigger": "codeRuleGrid.elemvalue", "code": "elemlenth=length(elemvalue);" }]);
    this.initData();
};

CodeRuleViewModel.prototype.initData = function () {
    CodeRuleViewModel_Extend.doAction("init_Extend", this);
};
