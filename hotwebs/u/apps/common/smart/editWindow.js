function initEditWindowComponents(targetComponent){
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
			
			//当选择的是参数时
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
				//普通类型函数
				var editor = $("#expression").data("kendoEditor");
				editor.value(editor.value()+dataItem.funVal);
			}
		}
	});
	//按钮
	$("#editWindowSaveButton").kendoButton({
		click: function(e) {
			//初始化参数targetComponent指的是赋值对象，将值存入赋值对象
			var editor = $("#expression").data("kendoEditor");
			targetComponent.value(editor.value());
			//关闭当前弹出窗口
			var editDirWindow = $("#editWindow").data("kendoWindow");
			editDirWindow.close();
		}
	});
	
	$("#editWindowCancleButton").kendoButton({
		click: function(e) {
			var editDirWindow = $("#editWindow").data("kendoWindow");
			editDirWindow.close();
		}
	});
	
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
			//取实体grid选择列，拼接experience
			var editor = $("#expression").data("kendoEditor");
			var entityGrid = $("#entityGrid").data("kendoGrid");
			var row2 = entityGrid.select();
			if(row2.length==0){
				alert("请选择实体！");
				return;
			}
			var entityData = entityGrid.dataItem(row2);
			editor.value(editor.value()+entityData.tableCode+"."+attrData.field.m_fldname);
		});
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
};

function resetEditWindowComponents(){
	//赋值window文本框内容
	//取实体grid选择列，拼接experience
	var editor = $("#expression").data("kendoEditor");
	editor.value("");
}
