var uuid=getUrlVar("uuid");
var pk_def;
var pkStr;
var strUrl = location.protocol + "//" + location.host+"/";
strUrl += "classes/General/uap/ShowDesignerFieldsPage?token=";
strUrl += token;

function savePage(){
	//获取全部grid信息，封装返回数据
	var requestVO={
		uuid:uuid
	};
	//ajax请求保存
	var updateUrl=location.protocol + "//" + location.host+"/";
	updateUrl += "classes/General/uap/SaveFieldsPage?token=";
	updateUrl += token;
	jQuery.ajax({
		url:updateUrl, async : false,type: "POST",
		data: JSON.stringify(requestVO),
		contentType:"application/json; charset=utf-8",
		success: function(response) {
			if(response.code==501){
				alert("Provider信息保存异常。");
				return;
			}else if(response.data.fail!=null){
				alert(response.data.fail.msgContent);
				return;
			}else if(response.data.success=="ok"){
				return;
			}else{
				alert("Fields信息保存异常。");
				return;
			}
		},
		error: function(e){
			//debugger;
			errobj = e;
			alert(e);
		}
	});
}

function saveSmartModel(){
	var requestVO={
		uuid:uuid,
		pk_def:pk_def
	}

	var updateUrl=location.protocol + "//" + location.host+"/";
	updateUrl += "classes/General/uap/SaveQueryEngine?token=";
	updateUrl += token;
	jQuery.ajax({
		url:updateUrl, async : false,type: "POST",
		data: JSON.stringify(requestVO),
		contentType:"application/json; charset=utf-8",
		success: function(response) {
			if(response.code==501){
				alert("语义模型保存异常。");
				return;
			}else if(response.data.fail!=null){
				alert(response.data.fail.msgContent);
				return;
			}else if(response.data.success=="ok"){
				alert("保存成功，您可以从预览页查看效果！");
				window.close();
			}else{
				alert("语义模型保存异常。");
				return;
			}
		},
		error: function(e){
			//debugger;
			errobj = e;
			alert(e);
		}
	});
}


function getWindowProviderDataSource(){
	var providerGridURL = location.protocol + "//" + location.host+"/";
	providerGridURL += "classes/General/uap/GetFieldsWindowProvider?token=";
	providerGridURL += token;
	var dataSource=new kendo.data.DataSource({
		schema : {
			data: function(response) {
				if(response.code==501){
					alert("加载FieldsPage异常！");
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
				url : providerGridURL,
				data: {
					uuid: uuid, // send  parameter
					pk_def:pk_def
				}
			},
			parameterMap : function(options) {
				//赋值属性树请求参数
				options.uuid=uuid;
				options.pk_def=pk_def;
				return JSON.stringify(options);
			}
		}
	})
	return dataSource;
}

function getWindowFieldDataSource(selMirrorId){
	var fieldGridURL = location.protocol + "//" + location.host+"/";
	fieldGridURL += "classes/General/uap/GetFieldsWindowFields?token=";
	fieldGridURL += token;
	var dataSource=new kendo.data.DataSource({
		schema : {
			data: function(response) {
				if(response.code==501){
					alert("加载FieldsPage异常！");
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
				url : fieldGridURL,
				data: {
					uuid: uuid, // send  parameter
					mirrorId:selMirrorId
				}
			},
			parameterMap : function(options) {
				//赋值属性树请求参数
				options.uuid=uuid;
				options.mirrorId=selMirrorId;
				return JSON.stringify(options);
			}
		}
	});
	return dataSource;
}

function initAttGrid(selMirrorId){
	$("#attrGrid").kendoGrid({
		dataSource: getWindowFieldDataSource(selMirrorId),
		sortable: true,
		selectable: "multiple",
		columns: [{
			field: "mirrorId",
			hidden: true
		},{
			field: "field.m_multiLangText.text",
			title: "属性"
		}],
		change: onChange2
	});
}

//选择实体grid事件
function onChange(arg) {
	var selected = $.map(this.select(), function(item) {
		var entityGrid = $("#entityGrid").data("kendoGrid");
		var row = entityGrid.select();
		if(row.length==0){
			alert("请选择实体！");
			return;
		}
		var entityData = entityGrid.dataItem(row);
		
		var attrGrid = $("#attrGrid").data("kendoGrid");	
		if(null!=attrGrid){
			//重新赋值数据源，刷新grid，不用考虑初始化，因为页面加载时已经初始化grid
			attrGrid.setDataSource(getWindowFieldDataSource(entityData.mirrorId));
		}else{
			initAttGrid(entityData.mirrorId);
		}
	});
}

//选择属性grid事件
function onChange2(arg) {
	var selected = $.map(this.select(), function(item) {
		var attrGrid = $("#attrGrid").data("kendoGrid");
		var row = attrGrid.select();
		if(row.length==0){
			alert("请选择属性！");
			return;
		}
		var attrData = attrGrid.dataItem(row);
		//赋值window文本框内容
		var captionBox = $("#caption").data("kendoMaskedTextBox");
		if(null==captionBox.value()||captionBox.value()==""){
			captionBox.value(attrData.field.m_multiLangText.text);
		}
		var fldnameBox = $("#fldname").data("kendoMaskedTextBox");
		if(null==fldnameBox.value()||fldnameBox.value()==""){
			fldnameBox.value(attrData.field.m_fldname);
		}	
		var precisionBox = $("#precision").data("kendoMaskedTextBox");
		precisionBox.value(attrData.field.precision);
		var scaleBox = $("#scale").data("kendoMaskedTextBox");
		scaleBox.value(attrData.field.scale);
		var editor = $("#expression").data("kendoEditor");
		//取实体grid选择列，拼接experience
		var entityGrid = $("#entityGrid").data("kendoGrid");
		var row2 = entityGrid.select();
		if(row2.length==0){
			alert("请选择实体！");
			return;
		}
		var entityData = entityGrid.dataItem(row2);
		editor.value(editor.value()+entityData.tableCode+"."+attrData.field.m_fldname);
		//var isPKBox = $("#isPK").data("kendoDropDownList");
		//var linkStrBox = $("#linkStr").data("kendoMaskedTextBox");
		//var isEnablePermissionBox = $("#isEnablePermission").data("kendoDropDownList");
		//var resourceCodeBox = $("#resourceCode").data("kendoMaskedTextBox");
		//var operationCodeBox = $("#operationCode").data("kendoMaskedTextBox");
	});
}

$(document).ready(function () {
	//初始化grid
	$("#grid").kendoGrid({
		dataSource: new kendo.data.DataSource({
			schema : {
				data: function(response) {
					if(response.code==501){
						alert("加载FieldsPage异常！");
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
					url : strUrl,
					data: {
						uuid: uuid, // send  parameter
						pk_def:pk_def
					}
				},
				parameterMap : function(options) {
					//赋值属性树请求参数
					options.uuid=uuid;
					options.pk_def=pk_def;
					return JSON.stringify(options);
				}
			}
		}),
		height: 550,
		selectable: "multiple",
		sortable: true,
		columns: [{
			field: "mirrorId",
			hidden: true
		},{
			field: "rowNum",
			title: "行号",
			width: 55
		},{
			field: "fldname",
			title: "字段名",
			width: 150
		},{
			field: "caption",
			title: "显示名称",
			width: 150
		},{
			field: "expression",
			title: "表达式",
			width: 300
		},{
			field: "dataType",
			title: "数据类型",
			width: 100
		},{
			field: "precision",
			title: "长度",
			width: 60
		},{
			field: "scale",
			title: "精度",
			width: 60
		},{
			field: "isPK",
			title: "主键",
			width: 60
		},{
			field: "linkStr",
			title: "关联",
			width: 200
		},{
			field: "isEnablePermission",
			title: "数据权限",
			width: 100
		},{
			field: "resourceCode",
			title: "资源实体编码",
			width: 100
		},{
			field: "operationCode",
			title: "场景编码",
			width: 100
		}]
	});
	//初始化button
	$("#providerButton").kendoButton({
		click: function(e) {
			//发请求。跳转到joinPage
			window.location.replace("smartModelProviderPage.html?token="+token+"&uuid="+uuid);
	    }
	});
	$("#joinButton").kendoButton({
	    click: function(e) {
			//发请求。跳转到joinPage
			window.location.replace("smartModelJoinPage.html?token="+token+"&uuid="+uuid);
	    }
	});
	$("#fieldButton").kendoButton({
	    click: function(e) {
			//发请求。跳转到fieldPage
			window.location.replace("smartModelFieldsPage.html?token="+token+"&uuid="+uuid);
	    }
	});
	$("#descriptorButton").kendoButton({
	    click: function(e) {
			//发请求。跳转到descriptorPage
			window.location.replace("smartModelDescriptorPage.html?token="+token+"&uuid="+uuid);
	    }
	});
	$("#otherButton").kendoButton({
	    click: function(e) {
			alert("暂时未开发！");
			return;
			//发请求。跳转到otherPage
			window.location.replace(".html?token="+token+"&uuid="+uuid);
	    }
	});
	
	//元数据配置部分
	$("#addButton").kendoButton({
		click: function(e) {
			$("#editType")[0].value="save";
			//弹出window
			document.getElementById('editWindow').style.display = "";
			var editWindow = $("#editWindow").data("kendoWindow");
			if (null==editWindow) {
				$("#editWindow").kendoWindow({
					width: "910px",
					height: "750px",
					title: "编辑字段信息",
					actions: [
						"Pin",
						"Minimize",
						"Maximize",
						"Close"
					]
				});
			}else{
				editWindow.open();
			}
			//初始化grid页面
			var fldnameBox = $("#fldname").data("kendoMaskedTextBox");
			fldnameBox.value("");
			var captionBox = $("#caption").data("kendoMaskedTextBox");
			captionBox.value("");
			var precisionBox = $("#precision").data("kendoMaskedTextBox");
			precisionBox.value("");
			var scaleBox = $("#scale").data("kendoMaskedTextBox");
			scaleBox.value("");
			var isPKBox = $("#isPK").data("kendoDropDownList");
			isPKBox.select(1);
			var linkStrBox = $("#linkStr").data("kendoMaskedTextBox");
			linkStrBox.enable(false);
			var isEnablePermissionBox = $("#isEnablePermission").data("kendoDropDownList");
			isEnablePermissionBox.select(1);
			var resourceCodeBox = $("#resourceCode").data("kendoMaskedTextBox");
			resourceCodeBox.enable(false);
			var operationCodeBox = $("#operationCode").data("kendoMaskedTextBox");
			operationCodeBox.enable(false);
			var editor = $("#expression").data("kendoEditor");
			editor.value("");
	    }
	});
	$("#editButton").kendoButton({
		click: function(e) {
			$("#editType")[0].value="edit";
			//读取选中grid的Field
			var grid = $("#grid").data("kendoGrid");
			var row = grid.select();
			if(row.length==0){
				alert("请选择要修改的属性！");
				return;
			}
			var gridData = grid.dataItem(row);
			//弹出window
			document.getElementById('editWindow').style.display = "";
			var editWindow = $("#editWindow").data("kendoWindow");
			if (null==editWindow) {
				$("#editWindow").kendoWindow({
					width: "910px",
					height: "750px",
					title: "编辑字段信息",
					actions: [
						"Pin",
						"Minimize",
						"Maximize",
						"Close"
					]
				});
			}else{
				editWindow.open();
			}
			//初始化grid页面
			var fldnameBox = $("#fldname").data("kendoMaskedTextBox");
			fldnameBox.value(gridData.fldname);
			var captionBox = $("#caption").data("kendoMaskedTextBox");
			captionBox.value(gridData.caption);
			var precisionBox = $("#precision").data("kendoMaskedTextBox");
			precisionBox.value(gridData.precision);
			var scaleBox = $("#scale").data("kendoMaskedTextBox");
			scaleBox.value(gridData.scale);
			var isPKBox = $("#isPK").data("kendoDropDownList");
			if(gridData.isPK=="是"){
				isPKBox.select(0);
			}else{
				isPKBox.select(1);
			}
			var linkStrBox = $("#linkStr").data("kendoMaskedTextBox");
			linkStrBox.value(gridData.linkStr);
			linkStrBox.enable(false);
			var isEnablePermissionBox = $("#isEnablePermission").data("kendoDropDownList");
			if(gridData.isEnablePermission=="启用"){
				isEnablePermissionBox.select(0);
			}else{
				isEnablePermissionBox.select(1);
			}
			var resourceCodeBox = $("#resourceCode").data("kendoMaskedTextBox");
			resourceCodeBox.value(gridData.resourceCode);
			resourceCodeBox.enable(false);
			var operationCodeBox = $("#operationCode").data("kendoMaskedTextBox");
			operationCodeBox.value(gridData.operationCode);
			operationCodeBox.enable(false);
			var editor = $("#expression").data("kendoEditor");
			editor.value(gridData.expression);
	    }
	});
	$("#delButton").kendoButton({
		click: function(e) {
			//删除操作
			//ajax请求
			//获取grid选择行
			var grid = $("#grid").data("kendoGrid");
			var row = grid.select();
			if(row.length==0){
				alert("请选择要删除的属性！");
				return;
			}
			var gridData = grid.dataItem(row);
			requestVO={
				uuid:uuid,
				mirrorId:gridData.mirrorId
			}
			var Url=location.protocol + "//" + location.host+"/";
			Url += "classes/General/uap/DelField?token=";
			Url += token;
			jQuery.ajax({
				url:Url, async : false,type: "POST",
				data: JSON.stringify(requestVO),
				contentType:"application/json; charset=utf-8",
				success: function(response) {
					if(response.code==501){
						alert("删除Field异常。");
						return;
					}else if(response.data.fail!=null){
						alert(response.data.fail.msgContent);
						return;
					}else{
						//刷新grid
						grid.setDataSource(snycDataSourceFromCache());
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
	$("#fkButton").kendoButton({
		click: function(e) {
			openMetaDB();
		}
	});
	$("#upButton").kendoButton({
		click: function(e) {
			//上移操作
			//ajax请求
			//获取grid选择行
			var grid = $("#grid").data("kendoGrid");
			var row = grid.select();
			if(row.length==0){
				alert("请选择要移动的属性！");
				return;
			}
			var gridData = grid.dataItem(row);
			requestVO={
				uuid:uuid,
				mirrorId:gridData.mirrorId
			}
			var Url=location.protocol + "//" + location.host+"/";
			Url += "classes/General/uap/upField?token=";
			Url += token;
			jQuery.ajax({
				url:Url, async : false,type: "POST",
				data: JSON.stringify(requestVO),
				contentType:"application/json; charset=utf-8",
				success: function(response) {
					if(response.code==501){
					alert("上移Field异常。");
						return;
					}else if(response.data.fail!=null){
						alert(response.data.fail.msgContent);
						return;
					}else{
						//刷新grid
						grid.setDataSource(snycDataSourceFromCache());
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
	$("#downButton").kendoButton({
		click: function(e) {
			//下移操作
			//ajax请求
			//获取grid选择行
			var grid = $("#grid").data("kendoGrid");
			var row = grid.select();
			if(row.length==0){
				alert("请选择要移动的属性！");
				return;
			}
			var gridData = grid.dataItem(row);
			requestVO={
				uuid:uuid,
				mirrorId:gridData.mirrorId
			}
			var Url=location.protocol + "//" + location.host+"/";
			Url += "classes/General/uap/downField?token=";
			Url += token;
			jQuery.ajax({
				url:Url, async : false,type: "POST",
				data: JSON.stringify(requestVO),
				contentType:"application/json; charset=utf-8",
				success: function(response) {
					if(response.code==501){
						alert("下移Field异常。");
						return;
					}else if(response.data.fail!=null){
						alert(response.data.fail.msgContent);
						return;
					}else{
						//刷新grid
						grid.setDataSource(snycDataSourceFromCache());
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
	
	//向导下一步，保存部分
	$("#nextButton").kendoButton({
		click: function(e) {
			//保存本页信息
			savePage();
			//跳转
			window.location.replace("smartModelDescriptorPage.html?token="+token+"&uuid="+uuid);
		}
	});
	$("#saveButton").kendoButton({
		click: function(e) {
			//保存本页信息
			savePage();
		}
	});
	$("#cancleButton").kendoButton({
		click: function(e) {
			window.close();
		}
		
	});
	$("#finishButton").kendoButton({
		//保存本页信息，将缓存数据入库，并关闭本页面
		click: function(e) {
			//保存本页信息
			savePage();
			//缓存数据入库
			saveSmartModel();
            hideDialog();
		}
	});
	
	//弹出层部分
	$("#fldname").kendoMaskedTextBox({
		mask: ""
	});

	$("#caption").kendoMaskedTextBox({
		mask: ""
	});
	
	$("#precision").kendoMaskedTextBox({
		mask: "99",
		unmaskOnPost: true
	});
	
	$("#scale").kendoMaskedTextBox({
		mask: "0"
	});
	
	var isPkData = [
		{ text: "是", value: "true" },
		{ text: "否", value: "false" }
	];
	$("#isPK").kendoDropDownList({
		dataTextField: "text",
		dataValueField: "value",
		dataSource: isPkData
	});
	
	$("#linkStr").kendoMaskedTextBox({
		mask: ""
	});
	
	var isEnablePermissionData = [
		{ text: "启用", value: "true" },
		{ text: "不启用", value: "false" }
	];
	$("#isEnablePermission").kendoDropDownList({
		dataTextField: "text",
		dataValueField: "value",
		dataSource: isEnablePermissionData,
		select: function(e) {
		    var item = this.dataItem(e.item);
		    if(item.value=="true"){
				var resourceCodeBox = $("#resourceCode").data("kendoMaskedTextBox");
				resourceCodeBox.enable(true);
			}else if(item.value=="false"){
				var resourceCodeBox = $("#resourceCode").data("kendoMaskedTextBox");
				resourceCodeBox.value("");
				resourceCodeBox.enable(false);
				var operationCodeBox = $("#operationCode").data("kendoMaskedTextBox");
				operationCodeBox.value("");
				operationCodeBox.enable(false);
			}
		    
		}
	});
	
	$("#resourceCode").kendoMaskedTextBox({
		mask: ""
	});
	
	$("#operationCode").kendoMaskedTextBox({
		mask: ""
	});
	
	//弹出层符号区
	$("#jia").kendoButton({
		click: function(e) {
			var editor = $("#expression").data("kendoEditor");
			editor.value(editor.value()+"+");
		}
	});
	$("#jian").kendoButton({
		click: function(e) {
			var editor = $("#expression").data("kendoEditor");
			editor.value(editor.value()+"-");
		}
	});
	$("#cheng").kendoButton({
		click: function(e) {
			var editor = $("#expression").data("kendoEditor");
			editor.value(editor.value()+"*");
		}
	});
	$("#chu").kendoButton({
		click: function(e) {
			var editor = $("#expression").data("kendoEditor");
			editor.value(editor.value()+"/");
		}
	});
	$("#zuokuo").kendoButton({
		click: function(e) {
			var editor = $("#expression").data("kendoEditor");
			editor.value(editor.value()+"(");
		}
	});
	$("#youkuo").kendoButton({
		click: function(e) {
			var editor = $("#expression").data("kendoEditor");
			editor.value(editor.value()+")");
		}
	});
	$("#huo").kendoButton({
		click: function(e) {
			var editor = $("#expression").data("kendoEditor");
			editor.value(editor.value()+"||");
		}
	});
	$("#shangDan").kendoButton({
		click: function(e) {
			var editor = $("#expression").data("kendoEditor");
			editor.value(editor.value()+"'");
		}
	});
	$("#xiaDan").kendoButton({
		click: function(e) {
			var editor = $("#expression").data("kendoEditor");
			editor.value(editor.value()+",");
		}
	});
	$("#one").kendoButton({
		click: function(e) {
			var editor = $("#expression").data("kendoEditor");
			editor.value(editor.value()+"1");
		}
	});
	$("#two").kendoButton({
		click: function(e) {
			var editor = $("#expression").data("kendoEditor");
			editor.value(editor.value()+"2");
		}
	});
	$("#three").kendoButton({
		click: function(e) {
			var editor = $("#expression").data("kendoEditor");
			editor.value(editor.value()+"3");
		}
	});
	$("#four").kendoButton({
		click: function(e) {
			var editor = $("#expression").data("kendoEditor");
			editor.value(editor.value()+"4");
		}
	});
	$("#five").kendoButton({
		click: function(e) {
			var editor = $("#expression").data("kendoEditor");
			editor.value(editor.value()+"5");
		}
	});
	$("#six").kendoButton({
		click: function(e) {
			var editor = $("#expression").data("kendoEditor");
			editor.value(editor.value()+"6");
		}
	});
	$("#seven").kendoButton({
		click: function(e) {
			var editor = $("#expression").data("kendoEditor");
			editor.value(editor.value()+"7");
		}
	});
	$("#eight").kendoButton({
		click: function(e) {
			var editor = $("#expression").data("kendoEditor");
			editor.value(editor.value()+"8");
		}
	});
	$("#nine").kendoButton({
		click: function(e) {
			var editor = $("#expression").data("kendoEditor");
			editor.value(editor.value()+"9");
		}
	});
	$("#zeor").kendoButton({
		click: function(e) {
			var editor = $("#expression").data("kendoEditor");
			editor.value(editor.value()+"0");
		}
	});
	$("#dian").kendoButton({
		click: function(e) {
			var editor = $("#expression").data("kendoEditor");
			editor.value(editor.value()+".");
		}
	});
	$("#ling").kendoButton({
		click: function(e) {
			var editor = $("#expression").data("kendoEditor");
			editor.value(editor.value()+"NULL");
		}
	});
	
	$("#expression").kendoEditor({ 
		resizable: true,
		tools: [
		     "justifyLeft", "justifyCenter", "justifyRight", "justifyFull"
		]
	});
	
	//初始化grid,tree
	$("#entityGrid").kendoGrid({
		dataSource: getWindowProviderDataSource(),
		sortable: true,
		selectable: "multiple",
		columns: [{
			field: "mirrorId",
			hidden: true
		},{
			field: "displayProviderName",
			title: "实体"
		}],
		change: onChange
	});
	$("#functionTree").kendoTreeView({
		dataSource: funTreeDataSource,
		dataTextField: ["categoryName", "subCategoryName"],
		expand: function(e) {
			//展开更新请求参数
			
		},
		select: function(e) {
		    var dataItem = this.dataItem(e.node);
			if(null!=dataItem.funVal&&dataItem.subCategoryName=="parameter"){
				//弹出参数window
				document.getElementById('parameterWindow').style.display = "";
				var parameterWindow = $("#parameterWindow").data("kendoWindow");
				if (null==parameterWindow) {
					//初始window控件
					pmSaveFlag=2;
					initParameterWindowComponents();
					//初始化window
					$("#parameterWindow").kendoWindow({
						width: "600px",
						height: "500px",
						title: "参数",
						actions: [
							"Pin",
							"Minimize",
							"Maximize",
							"Close"
						]
					});
				}else{
					var parameterGrid = $("#parameterGrid").data("kendoGrid");
					parameterGrid.setDataSource(getParameterDS());
					pmSaveFlag=2;
					parameterWindow.open();
				}
			}if(null!=dataItem.funVal&&dataItem.subCategoryName=="macro"){
				//弹出window
				document.getElementById('macroWindow').style.display = "";
				var macroWindow = $("#macroWindow").data("kendoWindow");
				if (null==macroWindow) {
					//初始window控件
					macroSaveFlag=2;
					initMacroWindowComponents();
					//初始化window
					$("#macroWindow").kendoWindow({
						width: "600px",
						height: "500px",
						title: "宏",
						actions: [
							"Pin",
							"Minimize",
							"Maximize",
							"Close"
						]
					});
				}else{
					var macroGrid = $("#macroGrid").data("kendoGrid");
					macroGrid.setDataSource(getMacroDS());
					macroSaveFlag=2;
					macroWindow.open();
				}
			}if(null!=dataItem.funVal&&dataItem.subCategoryName=="meta"){
				//弹出window
				document.getElementById('metaWindow').style.display = "";
				var metaWindow = $("#metaWindow").data("kendoWindow");
				if (null==metaWindow) {
					//初始window控件
					initMetaWindowComponents();
					//初始化window
					$("#metaWindow").kendoWindow({
						width: "600px",
						height: "500px",
						title: "元定义",
						actions: [
							"Pin",
							"Minimize",
							"Maximize",
							"Close"
						]
					});
				}else{
					
					metaWindow.open();
				}
				
			}else if(null!=dataItem.funVal){
				var editor = $("#expression").data("kendoEditor");
				editor.value(editor.value()+dataItem.funVal);
			}
		}
	});
	
	//window保存，取消
	$("#editWindowSaveButton").kendoButton({
		click: function(e) {	
			var editType=$("#editType")[0].value;
			if(editType=="save"){
				//新增操作，构建请求参数
				var attrGrid = $("#attrGrid").data("kendoGrid");
				var row = attrGrid.select();
				if(row.length==0){
					alert("请选择属性！");
					return;
				}
				var attrData = attrGrid.dataItem(row);
				var entityGrid = $("#entityGrid").data("kendoGrid");
				var row2 = entityGrid.select();
				if(row2.length==0){
					alert("请选择实体！");
					return;
				}
				var entityData = entityGrid.dataItem(row2);

				var captionBox = $("#caption").data("kendoMaskedTextBox");
				var fldnameBox = $("#fldname").data("kendoMaskedTextBox");
				var precisionBox = $("#precision").data("kendoMaskedTextBox");
				var scaleBox = $("#scale").data("kendoMaskedTextBox");
				var editor = $("#expression").data("kendoEditor");
				var isPKBox = $("#isPK").data("kendoDropDownList");
				var linkStrBox = $("#linkStr").data("kendoMaskedTextBox");
				var isEnablePermissionBox = $("#isEnablePermission").data("kendoDropDownList");
				var resourceCodeBox = $("#resourceCode").data("kendoMaskedTextBox");
				var operationCodeBox = $("#operationCode").data("kendoMaskedTextBox");
				//先更新pkStr信息
				if(isPKBox.value()=="true"){
					pkStr=fldnameBox.value();
				}
				
				var requestVO={
					uuid:uuid,
					saveMirrorIdA:entityData.mirrorId,
					saveMirrorIdB:attrData.mirrorId,
					fldname:fldnameBox.value(),
					caption:captionBox.value(),
					expression:editor.value(),
					precision:precisionBox.value(),
					scale:scaleBox.value(),
					isPK:isPKBox.value(),
					isEnablePermission:isEnablePermissionBox.value(),
					resourceCode:resourceCodeBox.value(),
					operationCode:operationCodeBox.value()
				}
				//增加ajax请求
				var saveURL=location.protocol + "//" + location.host+"/";
				saveURL += "classes/General/uap/saveFieldfromWindow?token=";
				saveURL += token;
				jQuery.ajax({
					url:saveURL, async : false,type: "POST",
					data: JSON.stringify(requestVO),
					contentType:"application/json; charset=utf-8",
					success: function(response) {
						if(response.code==501){
							alert("语义模型分类删除异常。");
							return;
						}else if(null!=response.data.fail){
							alert(response.data.fail.msgContent);
						}else{
							var grid = $("#grid").data("kendoGrid");
							grid.setDataSource(snycDataSourceFromCache());
							//关闭弹出层
							var editDirWindow = $("#editWindow").data("kendoWindow");
							editDirWindow.close();
						}
					},
					error: function(e){
						//debugger;
						errobj = e;
						alert(e);
					}
				});
			}else if(editType=="edit"){
				//更新操作，构建请求参数
				var grid = $("#grid").data("kendoGrid");
				var row = grid.select();
				if(row.length==0){
					alert("请选择属性！");
					return;
				}
				var gridData = grid.dataItem(row);

				var captionBox = $("#caption").data("kendoMaskedTextBox");
				var fldnameBox = $("#fldname").data("kendoMaskedTextBox");
				var precisionBox = $("#precision").data("kendoMaskedTextBox");
				var scaleBox = $("#scale").data("kendoMaskedTextBox");
				var editor = $("#expression").data("kendoEditor");
				var isPKBox = $("#isPK").data("kendoDropDownList");
				var linkStrBox = $("#linkStr").data("kendoMaskedTextBox");
				var isEnablePermissionBox = $("#isEnablePermission").data("kendoDropDownList");
				var resourceCodeBox = $("#resourceCode").data("kendoMaskedTextBox");
				var operationCodeBox = $("#operationCode").data("kendoMaskedTextBox");
				//先更新pkStr信息
				if(isPKBox.value()=="true"){
					pkStr=fldnameBox.value();
				}else{
					//当已有主键值和当前值相同，说明取消主键
					if(pkStr==fldnameBox.value()){
						pkStr="";
					}
				}
				var requestVO={
					uuid:uuid,
					updateMirrorId:gridData.mirrorId,
					fldname:fldnameBox.value(),
					caption:captionBox.value(),
					expression:editor.value(),
					precision:precisionBox.value(),
					scale:scaleBox.value(),
					isPK:isPKBox.value(),
					isEnablePermission:isEnablePermissionBox.value(),
					resourceCode:resourceCodeBox.value(),
					operationCode:operationCodeBox.value()
				}
				//增加ajax请求
				var updateURL=location.protocol + "//" + location.host+"/";
				updateURL += "classes/General/uap/updateFieldfromWindow?token=";
				updateURL += token;
				jQuery.ajax({
					url:updateURL, async : false,type: "POST",
					data: JSON.stringify(requestVO),
					contentType:"application/json; charset=utf-8",
					success: function(response) {
						if(response.code==501){
							alert("语义模型分类删除异常。");
							return;
						}else if(null!=response.data.fail){
							alert(response.data.fail.msgContent);
						}else{
							var grid = $("#grid").data("kendoGrid");
							grid.setDataSource(snycDataSourceFromCache());
							//关闭弹出层
							var editDirWindow = $("#editWindow").data("kendoWindow");
							editDirWindow.close();
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
	$("#editWindowCancleButton").kendoButton({
		click: function(e) {
			var editDirWindow = $("#editWindow").data("kendoWindow");
			editDirWindow.close();
		}
	});
});

function snycDataSourceFromCache(){
	var snycURL=location.protocol + "//" + location.host+"/";
	snycURL += "classes/General/uap/SyncCacheToGrid?token=";
	snycURL += token;
	var dataSource=new kendo.data.DataSource({
		schema : {
			data: function(response) {
				if(response.code==501){
					alert("加载FieldsPage异常！");
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
				url : snycURL,
				data: {
					uuid: uuid, // send  parameter
					pkStr:pkStr
				}
			},
			parameterMap : function(options) {
				//赋值属性树请求参数
				options.uuid=uuid;
				options.pkStr=pkStr;
				return JSON.stringify(options);
			}
		}
	})
	return dataSource;
}

function openMetaDB(){
	//验证是否选择了待修改的grid记录
	var grid = $("#grid").data("kendoGrid");
	var row = grid.select();
	if(row.length==0){
		alert("请选择要修改的属性！");
		return;
	}
	//弹出window
	document.getElementById('metaDBWindow').style.display = "";
	var metaDBWindow = $("#metaDBWindow").data("kendoWindow");
	if (null==metaDBWindow) {
		//初始化window内组件
		initMetaDBWindow();
		//初始化window
		$("#metaDBWindow").kendoWindow({
			width: "600px",
			height: "400px",
			title: "选择关联",
			actions: [
				"Pin",
				"Minimize",
				"Maximize",
				"Close"
			]
		});
	}else{
		metaDBWindow.open();
	}
}
function initMetaDBWindow(){
	//初始化按钮
	$("#clearLink").kendoButton({
		click: function(e) {
			//清除关联按钮
			var grid = $("#grid").data("kendoGrid");
			var srcRow = grid.select();
			var srcData=grid.dataItem(srcRow);
			//封装请求参数
			var requestVO={
				uuid:uuid,
				srcMirrorId:srcData.mirrorId
			};
			//ajax请求保存
			var updateUrl=location.protocol + "//" + location.host+"/";
			updateUrl += "classes/General/uap/ClearMetaLink?token=";
			updateUrl += token;
			jQuery.ajax({
				url:updateUrl, async : false,type: "POST",
				data: JSON.stringify(requestVO),
				contentType:"application/json; charset=utf-8",
				success: function(response) {
					if(response.code==501){
						alert("Provider信息保存异常。");
						return;
					}else if(response.data.fail!=null){
						alert(response.data.fail.msgContent);
						return;
					}else if(response.data.success=="ok"){
						//关闭当前窗口，刷新grid
						grid.setDataSource(snycDataSourceFromCache());
						var metaDBWindow = $("#metaDBWindow").data("kendoWindow");
						metaDBWindow.close();
					}else{
						alert("清除关联信息异常！");
						return;
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
	$("#metaDBSave").kendoButton({
		click: function(e) {
			//关联窗口保存按钮
			//验证，判断是否选择了数据字典内容，之判断grid就可以了，以为有grid必然有tree内容
			var metaDBGrid = $("#metaDBGrid").data("kendoGrid");
			if(null==metaDBGrid){
				alert("请选择关联项！");
			}
			var row = metaDBGrid.select();
			if(row.length==0){
				alert("请选择关联项！");
				return;
			}
			var metaDBGridData=metaDBGrid.dataItem(row);
			var metaDBTree = $("#metaDBTree").data("kendoTreeView");
			var node=metaDBTree.select();
			var metaDBTreeData = metaDBTree.dataItem(node);
			var grid = $("#grid").data("kendoGrid");
			var srcRow = grid.select();
			var srcData=grid.dataItem(srcRow);
			//封装请求参数
			var requestVO={
				uuid:uuid,
				srcMirrorId:srcData.mirrorId,
				metaDBTreeMirrorId:metaDBTreeData.mirrorId,
				metaDBGridMirrorId:metaDBGridData.mirrorId
			};
			//ajax请求保存
			var updateUrl=location.protocol + "//" + location.host+"/";
			updateUrl += "classes/General/uap/SaveMetaLink?token=";
			updateUrl += token;
			jQuery.ajax({
				url:updateUrl, async : false,type: "POST",
				data: JSON.stringify(requestVO),
				contentType:"application/json; charset=utf-8",
				success: function(response) {
					if(response.code==501){
						alert("Provider信息保存异常。");
						return;
					}else if(response.data.fail!=null){
						alert(response.data.fail.msgContent);
						return;
					}else if(response.data.success=="ok"){
						//关闭当前窗口，刷新grid
						grid.setDataSource(snycDataSourceFromCache());
						var metaDBWindow = $("#metaDBWindow").data("kendoWindow");
						metaDBWindow.close();
					}else{
						alert("关联信息更新异常！");
						return;
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
	$("#metaDBCancle").kendoButton({
		click: function(e) {
			//关联窗口取消按钮
			var metaDBWindow = $("#metaDBWindow").data("kendoWindow");
			metaDBWindow.close();
		}
	});
	
	//初始化左树,判断公式编辑页面的元定义树是否初始化了，两个公用一个数据源
	var metaTree = $("#metaTree").data("kendoTreeView");
	var metaDS;
	if(null!=metaTree){
		metaDS=metaTree.dataSource;
	}else{
		metaDS=initMetaDBTreeDataSource();
	}
	
	$("#metaDBTree").kendoTreeView({
		dataSource: metaDS,
		dataTextField: "dispalyName",
		expand: function(e) {
			//展开实体树是，更新请求参数
			var dataItem = this.dataItem(e.node);
			selectMetaDBTreeMirrorId=dataItem.mirrorId;
		},
		select: function(e) {
			//选择节点是，更新属性树请求参数
			var dataItem = this.dataItem(e.node);
			//末级节点，显示grid
			if(dataItem.canExpand==false){
				selectMetaDBTreeMirrorId=dataItem.mirrorId;
				var metaDBGrid = $("#metaDBGrid").data("kendoGrid");
				if(null!=metaDBGrid){
					//初始化
					metaDBGrid.setDataSource(initMetaDBGridDataSource());
				}else{
					//已经初始化过，就更新datasource
					iniMetaDBGrid();
				}	
			}
			//非末级节点，清空grid
			if(dataItem.canExpand==true){
				var metaDBGrid = $("#metaDBGrid").data("kendoGrid");
				if(null!=metaDBGrid){
					//已经初始化过，就更新datasource
					metaDBGrid.setDataSource(
						new kendo.data.DataSource({
							data: []
						})
					);
				}
			}
			
		}
	});
	
}
function iniMetaDBGrid(){
	//初始化右表
	$("#metaDBGrid").kendoGrid({
		dataSource: initMetaDBGridDataSource(),
		sortable: true,
		selectable: "multiple",
		columns: [{
			field: "displayName",
			title: "属性"
		}]
	});
}



function initMetaDBGridDataSource(){
	var URL=location.protocol + "//" + location.host+"/";
	URL += "classes/General/uap/GetMetaDBGrid?token=";
	URL += token;
	var metaDBGridDS=new kendo.data.DataSource({
		schema : {
			data: function(response) {
				if(response.code==501){
					alert("加载FieldsPage异常！");
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
					mirrorId:selectMetaDBTreeMirrorId
				}
			},
			parameterMap : function(options) {
				//赋值属性树请求参数
				options.uuid=uuid;
				options.mirrorId=selectMetaDBTreeMirrorId;
				return JSON.stringify(options);
			}
		}
	})
	return metaDBGridDS;
}
function openPermissionResourceRef(){
	//弹出window
	document.getElementById('refWindow').style.display = "";
	var refWindow = $("#refWindow").data("kendoWindow");
	if (null==refWindow) {
		//初始化window内组件
		initRefWindow();
		//初始化window
		$("#refWindow").kendoWindow({
			width: "400px",
			height: "400px",
			title: "选择资源实体",
			actions: [
				"Pin",
				"Minimize",
				"Maximize",
				"Close"
			]
		});
	}else{
		refWindow.open();
	}
}
function initRefWindow(){
	//初始化左树
	$("#refTree").kendoTreeView({
		dataSource: initRefDataSource(),
		dataTextField: "displayName"
	});
	//初始化按钮
	$("#refSave").kendoButton({
		click: function(e) {
			//将refTree值赋值文本框
			var refTree = $("#refTree").data("kendoTreeView");
			var node=refTree.select();
			var refTreeData = refTree.dataItem(node);
			var resourceCodeBox = $("#resourceCode").data("kendoMaskedTextBox");
			resourceCodeBox.value(refTreeData.value);
			var operationCodeBox = $("#operationCode").data("kendoMaskedTextBox");
			operationCodeBox.value("");
			operationCodeBox.enable(true);
			var refWindow = $("#refWindow").data("kendoWindow");
			refWindow.close();
		}
	});
	$("#refCancle").kendoButton({
		click: function(e) {
			var refWindow = $("#refWindow").data("kendoWindow");
			refWindow.close();
		}
	});
}

function initRefDataSource(){
	var datasource;
	//ajax请求数据源
	requestVO={
		uuid:uuid
	}
	var Url=location.protocol + "//" + location.host+"/";
	Url += "classes/General/uap/GetPermissionResourceRef?token=";
	Url += token;
	jQuery.ajax({
		url:Url, async : false,type: "POST",
		data: JSON.stringify(requestVO),
		contentType:"application/json; charset=utf-8",
		success: function(response) {
			if(response.code==501){
				alert("Provider信息保存异常。");
				return;
			}else if(response.data.fail!=null){
				alert(response.data.fail.msgContent);
				return;
			}else{
				//关闭当前窗口，刷新grid
				var refer=response.data.success;
				datasource = new kendo.data.HierarchicalDataSource({
					data: refer,
					schema: {
					    model: {
					      children: "subNode",
						  hasChildren: "canExpand"
					    }
					}
				});
			}
		},
		error: function(e){
			//debugger;
			errobj = e;
			alert(e);
		}
	});
	return datasource;
}

function openOperationCodeRef(){
	//弹出window
	document.getElementById('operationCodeWindow').style.display = "";
	var operationCodeWindow = $("#operationCodeWindow").data("kendoWindow");
	if (null==operationCodeWindow) {
		//初始化window内组件
		initOperationCodeWindow();
		//初始化window
		$("#operationCodeWindow").kendoWindow({
			width: "400px",
			height: "400px",
			title: "选择使用场景",
			actions: [
				"Pin",
				"Minimize",
				"Maximize",
				"Close"
			]
		});
	}else{
		//重新加载OperationCodegrid数据源，显示window
		var datasource=getOperationcodeDataSource();
		var operationCodeGrid = $("#operationCodeGrid").data("kendoGrid");
		operationCodeGrid.setDataSource(datasource);
		operationCodeWindow.open();
	}
}

function initOperationCodeWindow(){
	//初始化左树
	$("#operationCodeGrid").kendoGrid({
		dataSource:getOperationcodeDataSource(),
		selectable: "multiple",
		columns: [{
			field: "displayName",
			title: "使用场景"
		},{
			field: "value",
			title: "使用场景编码"
		}]
	});
	//初始化按钮
	$("#operationCodeSave").kendoButton({
		click: function(e) {
			//将refTree值赋值文本框
			var operationCodeGrid = $("#operationCodeGrid").data("kendoGrid");
			var row=operationCodeGrid.select();
			var operationCodeData = operationCodeGrid.dataItem(row);
			var operationCodeBox = $("#operationCode").data("kendoMaskedTextBox");
			operationCodeBox.value(operationCodeData.value);
			var operationCodeWindow = $("#operationCodeWindow").data("kendoWindow");
			operationCodeWindow.close();
		}
	});
	$("#operationCodeCancle").kendoButton({
		click: function(e) {
			var operationCodeWindow = $("#operationCodeWindow").data("kendoWindow");
			operationCodeWindow.close();
		}
	});
}

function getOperationcodeDataSource(){
	var providerGridURL = location.protocol + "//" + location.host+"/";
	providerGridURL += "classes/General/uap/GetOperationcode?token=";
	providerGridURL += token;
	var dataSource=new kendo.data.DataSource({
		schema : {
			data: function(response) {
				if(response.code==501){
					alert("加载使用场景异常！");
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
				url : providerGridURL,
				data: {
					resourceCode: "" // send  parameter
				}
			},
			parameterMap : function(options) {
				//赋值属性树请求参数
				var resourceCodeBox = $("#resourceCode").data("kendoMaskedTextBox");
				options.resourceCode=resourceCodeBox.value();
				return JSON.stringify(options);
			}
		}
	})
	return dataSource;
}

var pmSaveFlag;
function initParameterWindowComponents(){
	$("#parameterGrid").kendoGrid({
		dataSource: getParameterDS(),
		sortable: true,
		selectable: "multiple",
		columns: [{
			field: "name",
			title: "名称"
		},{
			field: "code",
			title: "编码"
		}]
	});
	//初始化button
	$("#parameter_saveButton").kendoButton({
		click: function(e) {
			//取树节点值
			var parameterGrid = $("#parameterGrid").data("kendoGrid");
			var row=parameterGrid.select();
			if(row.length==0){
				alert("请选择参数！");
				return;
			}
			var dataItem = parameterGrid.dataItem(row);
			//赋值文本框
			if(pmSaveFlag==1){
				//编辑过滤时，值类型选择参数，将值赋值给“值”文本框
				var valueBox = $("#value").data("kendoMaskedTextBox");
				valueBox.value(dataItem.code);
			}else{
				//编辑过了时，值类型选择表达式，然后函数树选择参数，将值赋值给editWindow的文本框
				var expressionBox = $("#expression").data("kendoEditor");
				expressionBox.value(expressionBox.value()+"parameter('"+dataItem.code+"')");
			}
			
			
			//关闭窗口
			var parameterWindow = $("#parameterWindow").data("kendoWindow");	
			parameterWindow.close();	
		}
	});
	$("#parameter_cancleButton").kendoButton({
		click: function(e) {
			var parameterWindow = $("#parameterWindow").data("kendoWindow");	
			parameterWindow.close();	
		}
	});
}
var macroSaveFlag;
function initMacroWindowComponents(){
	$("#macroGrid").kendoGrid({
		dataSource: getMacroDS(),
		sortable: true,
		selectable: "multiple",
		columns: [{
			field: "name",
			title: "名称"
		},{
			field: "code",
			title: "编码"
		}]
	});
	//初始化button
	$("#macro_saveButton").kendoButton({
		click: function(e) {
			//取树节点值
			var macroGrid = $("#macroGrid").data("kendoGrid");
			var row=macroGrid.select();
			if(row.length==0){
				alert("请选择宏！");
				return;
			}
			var dataItem = macroGrid.dataItem(row);
			//赋值文本框
			if(macroSaveFlag==1){
				//过滤条件，值类型选择宏变量是，值文本框赋值
				var valueBox = $("#value").data("kendoMaskedTextBox");
				valueBox.value(dataItem.name);
			}else{
				//编辑过了时，值类型选择表达式，然后函数树选择宏，将值赋值给editWindow的文本框
				var expressionBox = $("#expression").data("kendoEditor");
				expressionBox.value(expressionBox.value()+"macro('"+dataItem.code+"')");
			}
			
			//关闭窗口
			var macroWindow = $("#macroWindow").data("kendoWindow");	
			macroWindow.close();	
		}
	});
	$("#macro_cancleButton").kendoButton({
		click: function(e) {
			var macroWindow = $("#macroWindow").data("kendoWindow");	
			macroWindow.close();	
		}
	});
}
function getMacroDS(){
	var URL = location.protocol + "//" + location.host+"/";
	URL += "classes/General/uap/GetMacro?token=";
	URL += token;
	var dataSource=new kendo.data.DataSource({
		schema : {
			data: function(response) {
				if(response.code==501||response.code==250){
					alert("加载宏信息异常！");
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
