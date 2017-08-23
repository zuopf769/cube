//初始化参数配置页面
function initParameterPage(){
	//初始化parameterGrid
	$("#pmGrid").kendoGrid({
		dataSource: getParameterDS(),
		sortable: true,
		selectable: "multiple",
		height:550,
		columns: [{
			field: "code",
			title: "编码",
			width: 100
		},{
			field: "name",
			title: "名称",
			width: 100
		},{
			field: "operator",
			title: "操作符",
			width: 80
		},{
			field: "datatypeStr",
			title: "数据类型",
			width: 100
		},{
			field: "refCode",
			title: "参照编码",
			width: 100
		},{
			field: "value",
			title: "默认值",
			width: 100
		},{
			field: "requiredStr",
			title: "是否必填",
			width: 100
		},{
			field: "refDepend",
			title: "参照依赖",
			width: 100
		},{
			field: "isEnablePermissionStr",
			title: "数据权限",
			width: 100
		},{
			field: "operationCode",
			title: "使用场景",
			width: 100
		},{
			field: "note",
			title: "描述",
			width: 200
		}]
	});
	//初始化按钮
	$("#pm_addButton").kendoButton({
		click: function(e) {
			$("#pm_EditType")[0].value="save";
			//弹出window
			document.getElementById('editParameterWindow').style.display = "";
			var editParameterWindow = $("#editParameterWindow").data("kendoWindow");
			if (null==editParameterWindow) {
				//初始window控件
				initPrarmeterEditWindowComponents();
				resetPrarmeterEditWindowComponents();
				//初始化window
				$("#editParameterWindow").kendoWindow({
					width: "650px",
					height: "350px",
					title: "编辑参数",
					actions: [
						"Pin",
						"Minimize",
						"Maximize",
						"Close"
					]
				});
			}else{
				resetPrarmeterEditWindowComponents();
				editParameterWindow.open();
			}
		}
	});
	$("#pm_editButton").kendoButton({
		click: function(e) {
			$("#pm_EditType")[0].value="update";
			//验证是否选择了参数grid数据
			var pmGrid = $("#pmGrid").data("kendoGrid");
			var row = pmGrid.select();
			if(row.length==0){
				alert("请选择要修改的参数！");
				return;
			}
			var dataItem = pmGrid.dataItem(row);
			//弹出window
			document.getElementById('editParameterWindow').style.display = "";
			var editParameterWindow = $("#editParameterWindow").data("kendoWindow");
			if (null==editParameterWindow) {
				//初始window控件
				initPrarmeterEditWindowComponents();
				setPrarmeterEditWindowComponents(dataItem);
				//初始化window
				$("#editParameterWindow").kendoWindow({
					width: "650px",
					height: "350px",
					title: "元数据参照",
					actions: [
						"Pin",
						"Minimize",
						"Maximize",
						"Close"
					]
				});
			}else{
				//赋值文本框
				setPrarmeterEditWindowComponents(dataItem);
				editParameterWindow.open();
			}
		}
	});
	$("#pm_delButton").kendoButton({
		click: function(e) {
			var pmGrid = $("#pmGrid").data("kendoGrid");
			var row = pmGrid.select();
			var dataItem=pmGrid.dataItem(row);
			var requestVO={
				uuid:uuid,
				oldCode:dataItem.code
			}

			var updateUrl=location.protocol + "//" + location.host+"/";
			updateUrl += "classes/General/uap/DelParameter?token=";
			updateUrl += token;
			jQuery.ajax({
				url:updateUrl, async : false,type: "POST",
				data: JSON.stringify(requestVO),
				contentType:"application/json; charset=utf-8",
				success: function(response) {
					if(response.code==501||response.code==250){
						alert("参数删除异常。");
						return;
					}else if(response.data.fail!=null){
						alert(response.data.fail.msgContent);
						return;
					}else{
						//刷新grid
						var ds=reflashParameterDS(response.data.success);
						pmGrid.setDataSource(ds);
						//关闭弹出窗口
						var editParameterWindow = $("#editParameterWindow").data("kendoWindow");
						editParameterWindow.close();
					}
				},
				error: function(e){
					//debugger;
					errobj = e;
					alert(e);
				}
			});
		}
	});
	
}

//获取参数数据源
function getParameterDS(){
	var URL = location.protocol + "//" + location.host+"/";
	URL += "classes/General/uap/GetParameter?token=";
	URL += token;
	var dataSource=new kendo.data.DataSource({
		schema : {
			data: function(response) {
				if(response.code==501||response.code==250){
					alert("加载参数信息异常！");
					return;
				}else if(response.data.fail!=null){
					alert(response.data.fail.msgContent)
					return [];
				}else if(response.data.success==null){
					return [];
				}else{
					return response.data.success; 
				}
			},
		},
		transport : {
			read : {
				dataType : "json",
				contentType : "application/json",
				type : "POST",
				url : URL,
				data: {
					uuid: uuid, // send  parameter
				}
			},
			parameterMap : function(options) {
				//赋值属性树请求参数
				options.uuid=uuid;
				return JSON.stringify(options);
			}
		}
	});
	return dataSource;
}

function reflashParameterDS(data){
	var dataSource=new kendo.data.DataSource({
		data:data
	});
	return dataSource;
}

//初始化参数编辑window内控件
function initPrarmeterEditWindowComponents(){
	//按钮
	$("#pm_save_Button").kendoButton({
		click: function(e) {
			//验证页面信息是否填写正确
			var pm_NameBox = $("#pm_Name").data("kendoMaskedTextBox");
			var pm_CodeBox = $("#pm_Code").data("kendoMaskedTextBox");
			var pm_OperatorBox = $("#pm_Operator").data("kendoDropDownList");
			var pm_DatatypeBox = $("#pm_Datatype").data("kendoDropDownList");
			var pm_RefCodeBox = $("#pm_RefCode").data("kendoMaskedTextBox");
			var pm_ValueBox = $("#pm_Value").data("kendoMaskedTextBox");
			var pm_RequiredBox = $("#pm_Required").data("kendoDropDownList");
			var pm_RefDependBox = $("#pm_RefDepend").data("kendoMaskedTextBox");
			var pm_IsEnablePermissionBox = $("#pm_IsEnablePermission").data("kendoDropDownList");
			var pm_OperationCodeBox = $("#pm_OperationCode").data("kendoMaskedTextBox");
			var pm_NoteBox = $("#pm_Note").data("kendoMaskedTextBox");
			if(pm_DatatypeBox.value()==-1){
				alert("请选择数据类型！");
				return;
			}
			if(pm_OperatorBox.value()==""){
				alert("请选择操作符！");
				return;
			}
			//判断操作是更新还是新增
			var type=$("#pm_EditType")[0].value;
			if(type=="save"){
				//增加操作
				
				
				//初始化请求参数
				var requestVO={
					uuid:uuid,
					pvo:{
						name:pm_NameBox.value(),
						code:pm_CodeBox.value(),
						operator:pm_OperatorBox.value(),
						datatype:pm_DatatypeBox.value(),
						datatypeStr:pm_DatatypeBox.text(),
						refCode:pm_RefCodeBox.value(),
						value:pm_ValueBox.value(),
						required:pm_RequiredBox.value(),
						requiredStr:pm_RequiredBox.text(),
						refDepend:pm_RefDependBox.value(),
						isEnablePermission:pm_IsEnablePermissionBox.value(),
						isEnablePermissionStr:pm_IsEnablePermissionBox.text(),
						operationCode:pm_OperationCodeBox.value(),
						note:pm_NoteBox.value()
					}
				}

				var updateUrl=location.protocol + "//" + location.host+"/";
				updateUrl += "classes/General/uap/AddParameter?token=";
				updateUrl += token;
				jQuery.ajax({
					url:updateUrl, async : false,type: "POST",
					data: JSON.stringify(requestVO),
					contentType:"application/json; charset=utf-8",
					success: function(response) {
						if(response.code==501||response.code==250){
							alert("参数增加异常。");
							return;
						}else if(response.data.fail!=null){
							alert(response.data.fail.msgContent);
							return;
						}else{
							//刷新grid
							var pmGrid = $("#pmGrid").data("kendoGrid");
							var ds=reflashParameterDS(response.data.success);
							pmGrid.setDataSource(ds);
							//关闭弹出窗口
							var editParameterWindow = $("#editParameterWindow").data("kendoWindow");
							editParameterWindow.close();
						}
					},
					error: function(e){
						//debugger;
						errobj = e;
						alert(e);
					}
				});
			}else{
				//更新操作
				var pmGrid = $("#pmGrid").data("kendoGrid");
				var row = pmGrid.select();
				var dataItem=pmGrid.dataItem(row);
				
				//初始化请求参数
				var requestVO={
					uuid:uuid,
					oldCode:dataItem.code,
					pvo:{
						name:pm_NameBox.value(),
						code:pm_CodeBox.value(),
						operator:pm_OperatorBox.value(),
						datatype:pm_DatatypeBox.value(),
						datatypeStr:pm_DatatypeBox.text(),
						refCode:pm_RefCodeBox.value(),
						value:pm_ValueBox.value(),
						required:pm_RequiredBox.value(),
						requiredStr:pm_RequiredBox.text(),
						refDepend:pm_RefDependBox.value(),
						isEnablePermission:pm_IsEnablePermissionBox.value(),
						isEnablePermissionStr:pm_IsEnablePermissionBox.text(),
						operationCode:pm_OperationCodeBox.value(),
						note:pm_NoteBox.value()
					}
				}

				var updateUrl=location.protocol + "//" + location.host+"/";
				updateUrl += "classes/General/uap/UpdateParameter?token=";
				updateUrl += token;
				jQuery.ajax({
					url:updateUrl, async : false,type: "POST",
					data: JSON.stringify(requestVO),
					contentType:"application/json; charset=utf-8",
					success: function(response) {
						if(response.code==501||response.code==250){
							alert("参数更新异常。");
							return;
						}else if(response.data.fail!=null){
							alert(response.data.fail.msgContent);
							return;
						}else{
							//刷新grid
							var ds=reflashParameterDS(response.data.success);
							pmGrid.setDataSource(ds);
							//关闭弹出窗口
							var editParameterWindow = $("#editParameterWindow").data("kendoWindow");
							editParameterWindow.close();
						}
					},
					error: function(e){
						//debugger;
						errobj = e;
						alert(e);
					}
				});
			}
		
			
		}
	});
	$("#pm_cancle_Button").kendoButton({
		click: function(e) {
			var editParameterWindow = $("#editParameterWindow").data("kendoWindow");
			editParameterWindow.close();
		}
	});
	//文本框
	$("#pm_Name").kendoMaskedTextBox({
		mask: ""
	});
	$("#pm_Code").kendoMaskedTextBox({
		mask: ""
	});
	//操作符
	$("#pm_Operator").kendoDropDownList({
		dataTextField: "name",
		dataValueField: "value",
		dataSource: operatorCode
	});
	$("#pm_Datatype").kendoDropDownList({
		dataTextField: "name",
		dataValueField: "value",
		dataSource: pm_operatorCode
	});
	$("#pm_RefCode").kendoMaskedTextBox({
		mask: ""
	});
	$("#pm_Value").kendoMaskedTextBox({
		mask: ""
	});
	$("#pm_Required").kendoDropDownList({
		dataTextField: "name",
		dataValueField: "value",
		dataSource: [
			{
		        name : "是",
		        value : true
		    },{
				name:"否",
				value:false
			}
		]
	});
	$("#pm_RefDepend").kendoMaskedTextBox({
		mask: ""
	});
	$("#pm_IsEnablePermission").kendoDropDownList({
		dataTextField: "name",
		dataValueField: "value",
		dataSource: [
			{
		        name : "启用",
		        value : true
		    },{
				name:"不启用",
				value:false
			}
		]
	});
	$("#pm_OperationCode").kendoMaskedTextBox({
		mask: ""
	});
	$("#pm_Note").kendoMaskedTextBox({
		mask: ""
	});
}

//赋值window控件值
function setPrarmeterEditWindowComponents(selectData){
	//赋值文本框
	var pm_NameBox = $("#pm_Name").data("kendoMaskedTextBox");
	pm_NameBox.value(selectData.name);
	var pm_CodeBox = $("#pm_Code").data("kendoMaskedTextBox");
	pm_CodeBox.value(selectData.code);
	var pm_OperatorBox = $("#pm_Operator").data("kendoDropDownList");
	pm_OperatorBox.select(function(dataItem) {
		return dataItem.value === selectData.operator;
	});
	var pm_DatatypeBox = $("#pm_Datatype").data("kendoDropDownList");
	pm_DatatypeBox.select(function(dataItem) {
		return dataItem.value === selectData.datatype;
	});
	var pm_RefCodeBox = $("#pm_RefCode").data("kendoMaskedTextBox");
	pm_RefCodeBox.value(selectData.refCode);
	var pm_ValueBox = $("#pm_Value").data("kendoMaskedTextBox");
	pm_ValueBox.value(selectData.value);
	var pm_RequiredBox = $("#pm_Required").data("kendoDropDownList");
	pm_RequiredBox.select(function(dataItem) {
		return dataItem.value === selectData.required;
	});
	var pm_RefDependBox = $("#pm_RefDepend").data("kendoMaskedTextBox");
	pm_RefDependBox.value(selectData.refDepend);
	var pm_IsEnablePermissionBox = $("#pm_IsEnablePermission").data("kendoDropDownList");
	pm_IsEnablePermissionBox.select(function(dataItem) {
		return dataItem.value === selectData.isEnablePermission;
	});
	var pm_OperationCodeBox = $("#pm_OperationCode").data("kendoMaskedTextBox");
	pm_OperationCodeBox.value(selectData.operationCode);
	var pm_NoteBox = $("#pm_Note").data("kendoMaskedTextBox");
	pm_NoteBox.value(selectData.note);
}

function resetPrarmeterEditWindowComponents(){
	var pm_NameBox = $("#pm_Name").data("kendoMaskedTextBox");
	pm_NameBox.value("参数");
	var pm_CodeBox = $("#pm_Code").data("kendoMaskedTextBox");
	pm_CodeBox.value("param");
	var pm_OperatorBox = $("#pm_Operator").data("kendoDropDownList");
	pm_OperatorBox.select(function(dataItem) {
		return dataItem.value === "=";
	});
	var pm_DatatypeBox = $("#pm_Datatype").data("kendoDropDownList");
	pm_DatatypeBox.select(function(dataItem) {
		return dataItem.value === 0;
	});
	var pm_RefCodeBox = $("#pm_RefCode").data("kendoMaskedTextBox");
	pm_RefCodeBox.value("");
	var pm_ValueBox = $("#pm_Value").data("kendoMaskedTextBox");
	pm_ValueBox.value("");
	var pm_RequiredBox = $("#pm_Required").data("kendoDropDownList");
	pm_RequiredBox.select(function(dataItem) {
		return dataItem.value === false;
	});
	var pm_RefDependBox = $("#pm_RefDepend").data("kendoMaskedTextBox");
	pm_RefDependBox.value("");
	var pm_IsEnablePermissionBox = $("#pm_IsEnablePermission").data("kendoDropDownList");
	pm_IsEnablePermissionBox.select(function(dataItem) {
		return dataItem.value === false;
	});
	var pm_OperationCodeBox = $("#pm_OperationCode").data("kendoMaskedTextBox");
	pm_OperationCodeBox.value("");
	var pm_NoteBox = $("#pm_Note").data("kendoMaskedTextBox");
	pm_NoteBox.value("");
}

var pm_operatorCode=[
	{
        name : "-请选择-",
        value : -1
    },{
		name:"字符",
		value:0
	},{
		name:"数值",
		value:1
	},{
		name:"字符枚举",
		value:2
	},{
		name:"数值枚举",
		value:3
	},{
		name:"主键参照",
		value:4
	},{
		name:"编码参照",
		value:5
	},{
		name:"名称参照",
		value:6
	}
]


function openReferInfoWindow(){
	
	//判断，根据数据类型，判断该文本框是参照类型
	var pm_DatatypeBox = $("#pm_Datatype").data("kendoDropDownList");
	if(pm_DatatypeBox.value()==4||pm_DatatypeBox.value()==5||pm_DatatypeBox.value()==6){
		//弹出window
		document.getElementById('refinfoWindow').style.display = "";
		var refinfoWindow = $("#refinfoWindow").data("kendoWindow");
		if (null==refinfoWindow) {
			//初始window控件
			initReferInfoGrid();
			//初始化window
			$("#refinfoWindow").kendoWindow({
				width: "550px",
				height: "500px",
				title: "参照列表",
				actions: [
					"Pin",
					"Minimize",
					"Maximize",
					"Close"
				]
			});
		}else{
			refinfoWindow.open();
		}
	}else{
		//不出里，文本框
	}

	
}

function initReferInfoGrid(){
	$("#refInfoGrid").kendoGrid({
		dataSource: getReferInfoDS(),
		sortable: true,
		selectable: "multiple",
		columns: [{
			field: "code",
			title: "编码",
			width: 100
		},{
			field: "name",
			title: "名称",
			width: 100
		}]
	});
	//初始化按钮
	$("#refInfo_save_Button").kendoButton({
		click: function(e) {
			var refInfoGrid=$("#refInfoGrid").data("kendoGrid");
			var row = refInfoGrid.select();
			var dataItem=refInfoGrid.dataItem(row);
			var pm_RefCodeBox = $("#pm_RefCode").data("kendoMaskedTextBox");
			pm_RefCodeBox.value(dataItem.name);
			//关闭窗口
			var refinfoWindow = $("#refinfoWindow").data("kendoWindow");
			refinfoWindow.close();
		}
	});
	$("#refInfo_cancle_Button").kendoButton({
		click: function(e) {
			var refinfoWindow = $("#refinfoWindow").data("kendoWindow");
			refinfoWindow.close();
		}
	});
}

function getReferInfoDS(){
	var URL = location.protocol + "//" + location.host+"/";
	URL += "classes/General/uap/GetRefInfoList?token=";
	URL += token;
	var dataSource=new kendo.data.DataSource({
		schema : {
			data: function(response) {
				if(response.code==501||response.code==250){
					alert("加载参照列表信息异常！");
					return;
				}else if(response.data.fail!=null){
					alert(response.data.fail.msgContent)
					return [];
				}else if(response.data.success==null){
					return [];
				}else{
					return response.data.success; 
				}
			},
		},
		transport : {
			read : {
				dataType : "json",
				contentType : "application/json",
				type : "POST",
				url : URL,
				data: {
					uuid: uuid, // send  parameter
				}
			},
			parameterMap : function(options) {
				//赋值属性树请求参数
				options.uuid=uuid;
				return JSON.stringify(options);
			}
		}
	});
	return dataSource;
}


function initMetaWindowComponents(){
	//初始化meta树
	var metaDBTree = $("#metaDBTree").data("kendoTreeView");
	var metaDBDS;
	if(null!=metaDBTree){
		metaDBDS=metaDBTree.dataSource;
	}else{
		metaDBDS=initMetaDBTreeDataSource();
	}
	$("#metaTree").kendoTreeView({
		dataSource: metaDBDS,
		dataTextField: "dispalyName",
		expand: function(e) {
			//展开实体树是，更新请求参数
			var dataItem = this.dataItem(e.node);
			selectMetaDBTreeMirrorId=dataItem.mirrorId;
		}
	});
	
	
	//初始化按钮
	$("#meta_saveButton").kendoButton({
		click: function(e) {
			//取树节点值
			var metaTree = $("#metaTree").data("kendoTreeView");
			var node=metaTree.select();
			var dataItem = metaTree.dataItem(node);
			//赋值文本框
			if(dataItem.canExpand==false){
				//当选择的是最末级节点时，可以赋值
				var expressionBox = $("#expression").data("kendoEditor");
				expressionBox.value(expressionBox.value()+"meta('"+dataItem.metaGuid+"')");
			}else{
				//不可编辑
				alert("请选择元定义末级节点!");
				return;
			}
			
			//关闭窗口
			var metaWindow = $("#metaWindow").data("kendoWindow");	
			metaWindow.close();	
		}
	});
	$("#meta_cancleButton").kendoButton({
		click: function(e) {
			var metaWindow = $("#metaWindow").data("kendoWindow");	
			metaWindow.close();	
		}
	});
}

var selectMetaDBTreeMirrorId;
function initMetaDBTreeDataSource(){
	var URL=location.protocol + "//" + location.host+"/";
	URL += "classes/General/uap/GetMetaDBTree?token=";
	URL += token;
	var MetaDBTreeDS = new kendo.data.HierarchicalDataSource({
		schema : {
			data: function(response) {
				if(response.data.fail!=null){
					alert(response.data.fail.msgContent);
				}else if(response.data.success==null){
					return []; 
				}else{
					return response.data.success; 
				}
			},
			model: {
				hasChildren: "canExpand"
			}
		},
		transport : {
			read : {
				dataType : "json",
				contentType : "application/json",
				type : "POST",
				url : URL,
				data: {
					uuid: uuid, // send  parameter
					mirrorId:selectMetaDBTreeMirrorId
				}
			},
			parameterMap : function(options) {
				//赋值实体树请求参数，从这里重新赋值datasource属性
				options.uuid=uuid;
				options.mirrorId=selectMetaDBTreeMirrorId;
				return JSON.stringify(options);
			}
		}
	});
	return MetaDBTreeDS;
}