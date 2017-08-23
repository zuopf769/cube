$(document).ready(function(){
	//弹出层符号区
	$("#supper_jia").kendoButton({
		click: function(e) {
			var editor = $("#supper_expression").data("kendoEditor");
			editor.value(editor.value()+"+");
		}
	});
	$("#supper_jian").kendoButton({
		click: function(e) {
			var editor = $("#supper_expression").data("kendoEditor");
			editor.value(editor.value()+"-");
		}
	});
	$("#supper_cheng").kendoButton({
		click: function(e) {
			var editor = $("#supper_expression").data("kendoEditor");
			editor.value(editor.value()+"*");
		}
	});
	$("#supper_chu").kendoButton({
		click: function(e) {
			var editor = $("#supper_expression").data("kendoEditor");
			editor.value(editor.value()+"/");
		}
	});
	$("#supper_qu").kendoButton({
		click: function(e) {
			var editor = $("#supper_expression").data("kendoEditor");
			editor.value(editor.value()+"->");
		}
	});
	$("#supper_deng").kendoButton({
		click: function(e) {
			var editor = $("#supper_expression").data("kendoEditor");
			editor.value(editor.value()+"==");
		}
	});
	$("#supper_zuokuo").kendoButton({
		click: function(e) {
			var editor = $("#supper_expression").data("kendoEditor");
			editor.value(editor.value()+"(");
		}
	});
	$("#supper_youkuo").kendoButton({
		click: function(e) {
			var editor = $("#supper_expression").data("kendoEditor");
			editor.value(editor.value()+")");
		}
	});
	$("#supper_xiaoyu").kendoButton({
		click: function(e) {
			var editor = $("#supper_expression").data("kendoEditor");
			editor.value(editor.value()+"<");
		}
	});
	$("#supper_dayu").kendoButton({
		click: function(e) {
			var editor = $("#supper_expression").data("kendoEditor");
			editor.value(editor.value()+">");
		}
	});
	$("#supper_xiaodeng").kendoButton({
		click: function(e) {
			var editor = $("#supper_expression").data("kendoEditor");
			editor.value(editor.value()+"<=");
		}
	});
	$("#supper_dadeng").kendoButton({
		click: function(e) {
			var editor = $("#supper_expression").data("kendoEditor");
			editor.value(editor.value()+">=");
		}
	});
	$("#supper_one").kendoButton({
		click: function(e) {
			var editor = $("#supper_expression").data("kendoEditor");
			editor.value(editor.value()+"1");
		}
	});
	$("#supper_two").kendoButton({
		click: function(e) {
			var editor = $("#supper_expression").data("kendoEditor");
			editor.value(editor.value()+"2");
		}
	});
	$("#supper_three").kendoButton({
		click: function(e) {
			var editor = $("#supper_expression").data("kendoEditor");
			editor.value(editor.value()+"3");
		}
	});
	$("#supper_four").kendoButton({
		click: function(e) {
			var editor = $("#supper_expression").data("kendoEditor");
			editor.value(editor.value()+"4");
		}
	});
	$("#supper_five").kendoButton({
		click: function(e) {
			var editor = $("#supper_expression").data("kendoEditor");
			editor.value(editor.value()+"5");
		}
	});
	$("#supper_six").kendoButton({
		click: function(e) {
			var editor = $("#supper_expression").data("kendoEditor");
			editor.value(editor.value()+"6");
		}
	});
	$("#supper_seven").kendoButton({
		click: function(e) {
			var editor = $("#supper_expression").data("kendoEditor");
			editor.value(editor.value()+"7");
		}
	});
	$("#supper_eight").kendoButton({
		click: function(e) {
			var editor = $("#supper_expression").data("kendoEditor");
			editor.value(editor.value()+"8");
		}
	});
	$("#supper_nine").kendoButton({
		click: function(e) {
			var editor = $("#supper_expression").data("kendoEditor");
			editor.value(editor.value()+"9");
		}
	});
	$("#supper_zeor").kendoButton({
		click: function(e) {
			var editor = $("#supper_expression").data("kendoEditor");
			editor.value(editor.value()+"0");
		}
	});
	$("#supper_zeorzeor").kendoButton({
		click: function(e) {
			var editor = $("#supper_expression").data("kendoEditor");
			editor.value(editor.value()+"00");
		}
	});
	$("#supper_dian").kendoButton({
		click: function(e) {
			var editor = $("#supper_expression").data("kendoEditor");
			editor.value(editor.value()+".");
		}
	});
	
	//提示框
	$("#tipStr").kendoMaskedTextBox({
		mask: ""
	});

	//编辑框
	$("#supper_expression").kendoEditor({ 
		resizable: true,
		tools: [
			 "justifyLeft", "justifyCenter", "justifyRight", "justifyFull"
		]
	});
	//初始化编辑框值（编辑时）
	var supper_expressionBox=$("#supper_expression").data("kendoEditor");
	supper_expressionBox.value(supper_Component.value());
	
	//操作按钮
	$("#supper_save").kendoButton({
		click: function(e) {
			debugger;
			//先验证
			var supper_expressionBox=$("#supper_expression").data("kendoEditor");
			var flag=checkExpression(supper_expressionBox.value())
			if(flag==true){
				
			}else{
				alert("验证失败！");
				return false;
			}
			
			supper_Component.value(supper_expressionBox.value());
			//关闭本窗口
			supper_edit_Component.close();
		}
	});
	$("#supper_cancle").kendoButton({
		click: function(e) {
			//关闭本窗口
			supper_edit_Component.close();
		}
	});
	$("#supper_clear").kendoButton({
		click: function(e) {
			var supper_expressionBox=$("#supper_expression").data("kendoEditor");
			supper_expressionBox.value("");
		}
	});
	$("#supper_check").kendoButton({
		click: function(e) {
			var supper_expressionBox=$("#supper_expression").data("kendoEditor");
			
			var flag=checkExpression(supper_expressionBox.value());
			debugger;
			if(flag==true){
				alert("验证通过！");
			}else{
				alert("验证失败！");
			}
		}
	});
	
	//函数树
	$("#supper_functionTree").kendoTreeView({
		dataSource: funTreeDataSource,
		dataTextField: ["categoryName", "subCategoryName"],
		expand: function(e) {
			//展开更新请求参数
			
		},
		select: function(e) {
			var dataItem = this.dataItem(e.node);
			if(null!=dataItem.funVal){
				//普通类型函数
				var editor = $("#supper_expression").data("kendoEditor");
				editor.value(editor.value()+dataItem.funVal);
				var tipStr = $("#tipStr").data("kendoMaskedTextBox");
				tipStr.enable(false);
				tipStr.value(dataItem.tipStr);
			}
		}
	});
	
	//切换按钮区
	$("#db_button").kendoButton({
		click: function(e) {
			document.getElementById('supper_table_column_area').style.display = "";
			document.getElementById('supper_other_area').style.display = "none";
		}
	});
	$("#other_button").kendoButton({
		click: function(e) {
			document.getElementById('supper_table_column_area').style.display = "none";
			document.getElementById('supper_other_area').style.display = "";
		}
	});
	
	//表过滤
	$("#tableName").kendoMaskedTextBox({
		mask: ""
	});
	$("#tableSel_button").kendoButton({
		click: function(e) {
			var tableGrid = $("#supper_dbtableGrid").data("kendoGrid");
			tableGrid.setDataSource(returnTableGridDataSource());
		}
	});
	//表gird
	$("#supper_dbtableGrid").kendoGrid({
		dataSource: returnTableGridDataSource(),
		height: 250,
		sortable: true,
		selectable: "multiple",
		columns: [{
			field: "name",
			title: "数据表"
		}],
		change: onChange
	});
	//表column
	$("#supper_dbcolumnGrid").kendoGrid({
		dataSource: returnColumnGridDataSource(),
		height: 250,
		sortable: true,
		selectable: "multiple",
		columns: [{
			field: "name",
			title: "数据列"
		}],
		change: onChange2
	});
	
	//其他grid,一般是实体grid
	$("#supper_otherGrid").kendoGrid({
		dataSource: returnAttrGridDataSource(),
		height: 250,
		sortable: true,
		selectable: "multiple",
		columns: [{
			field: "name",
			title: "属性"
		},{
			field: "value",
			title: "--",
			hidden: true
		}],
		change: onChange3
	});
});

function returnTableGridDataSource(){
	//取得过滤框值
	var tableNameBox = $("#tableName").data("kendoMaskedTextBox");
	var filterTable="";
	if(null!=tableNameBox){
		filterTable=tableNameBox.value();
	}	
	
	var getAllTableURL = location.protocol + "//" + location.host+"/";
	getAllTableURL += "classes/General/uap/GetAllTable?token=";
	getAllTableURL += token;
	var griddataSource = new kendo.data.DataSource({
		schema : {
			data: function(response) {
				if(response.code==501||response.code==520||response.code==250){
					alert("请求异常！");
					return [];
				}else if(null!=response.data.fail){
					alert(response.data.fail.msgContent);
					return [];
				}else if(response.data.success==null){
					//如果没有数据，也直接返回
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
				url : getAllTableURL,
				data: {
					name:filterTable
				}
			},
			parameterMap : function(options) {
				//赋值属性树请求参数
				options.name=filterTable;
				return JSON.stringify(options);
			}
		}
	});
	
	//debugger;
	return griddataSource;
}

function returnColumnGridDataSource(){
	var selTable=null;
	//取得过滤框值
	var tableGrid = $("#supper_dbtableGrid").data("kendoGrid");
	if(null!=tableGrid){
		var row = tableGrid.select();
		if(row.length==0){
			selTable=null;
		}else{
			var tableData = tableGrid.dataItem(row);
			selTable=tableData.name;
		}
	}	
	
	var getAllColumnURL = location.protocol + "//" + location.host+"/";
	getAllColumnURL += "classes/General/uap/GetAllColumn?token=";
	getAllColumnURL += token;
	var griddataSource = new kendo.data.DataSource({
		schema : {
			data: function(response) {
				if(response.code==501||response.code==520||response.code==250){
					alert("请求异常！");
					return [];
				}else if(null!=response.data.fail){
					alert(response.data.fail.msgContent);
					return [];
				}else if(response.data.success==null){
					//如果没有数据，也直接返回
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
				url : getAllColumnURL,
				data: {
					name:selTable
				}
			},
			parameterMap : function(options) {
				//赋值属性树请求参数
				options.name=selTable;
				return JSON.stringify(options);
			}
		}
	});
	
	//debugger;
	return griddataSource;
}

function returnAttrGridDataSource(){
	debugger;
	//获取调用页全局信息（请求信息）
	//supper_fullClassName,supper_beanId,supper_nameSpace,supper_entityName
	var fullClassName=null;
	var beanId=null;
	var nameSpace=null;
	var entityName=null;
	if (typeof(supper_fullClassName) != "undefined"){  
	    fullClassName=supper_fullClassName;
	}
	if (typeof(supper_beanId) != "undefined"){  
	    beanId=supper_beanId;
	}
	if (typeof(supper_nameSpace) != "undefined"){  
	    nameSpace=supper_nameSpace;
	}
	if (typeof(supper_entityName) != "undefined"){  
	    entityName=supper_entityName;
	}
	
	var getAllColumnURL = location.protocol + "//" + location.host+"/";
	getAllColumnURL += "classes/General/uap/GetMetaAttrList?token=";
	getAllColumnURL += token;
	var griddataSource = new kendo.data.DataSource({
		schema : {
			data: function(response) {
				if(response.code==501||response.code==520||response.code==250){
					alert("请求异常！");
					return [];
				}else if(null!=response.data.fail){
					alert(response.data.fail.msgContent);
					return [];
				}else if(response.data.success==null){
					//如果没有数据，也直接返回
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
				url : getAllColumnURL,
				data: {
					fullClassName:fullClassName,
					beanId:beanId,
					nameSpace:nameSpace,
					entityName:entityName
				}
			},
			parameterMap : function(options) {
				//赋值属性树请求参数
				options.fullClassName=fullClassName;
				options.beanId=beanId;
				options.nameSpace=nameSpace;
				options.entityName=entityName;
				return JSON.stringify(options);
			}
		}
	});
	
	//debugger;
	return griddataSource;
}


//选择表grid事件
function onChange(arg) {
	var selected = $.map(this.select(), function(item) {
		var tableGrid = $("#supper_dbtableGrid").data("kendoGrid");
		var row = tableGrid.select();
		var tableData = tableGrid.dataItem(row);
		
		var columnGrid = $("#supper_dbcolumnGrid").data("kendoGrid");	
		if(null!=columnGrid){
			//重新赋值数据源，刷新grid，不用考虑初始化，因为页面加载时已经初始化grid
			columnGrid.setDataSource(returnColumnGridDataSource());
		}
	});
}

//选择列grid事件
function onChange2(arg) {
	var selected = $.map(this.select(), function(item) {
		var columnGrid = $("#supper_dbcolumnGrid").data("kendoGrid");
		var row = columnGrid.select();
		var columnData = columnGrid.dataItem(row);
		
		var editor = $("#supper_expression").data("kendoEditor");
		editor.value(editor.value()+columnData.value);
	});
}

//选择实体属性grid事件
function onChange3(arg) {
	var selected = $.map(this.select(), function(item) {
		var attrGrid = $("#supper_otherGrid").data("kendoGrid");
		var row = attrGrid.select();
		var attrData = attrGrid.dataItem(row);
		
		var editor = $("#supper_expression").data("kendoEditor");
		editor.value(editor.value()+attrData.value);
	});
}

function checkExpression(str){
	var requestVO={
		expression:str
	}
	var flag;
	//ajax请求验证
	var checkUrl=location.protocol + "//" + location.host+"/";
	checkUrl += "classes/General/uap/CheckSupperExpress?token=";
	checkUrl += token;
	jQuery.ajax({
		url:checkUrl, async : false,type: "POST",
		data: JSON.stringify(requestVO),
		contentType:"application/json; charset=utf-8",
		success: function(response) {
			debugger;
			if(response.code==501||response.code==520||response.code==250){
				alert("请求异常。");
				flag=false;
			}else if(null!=response.data.fail){
				alert(response.data.fail.msgContent);
				flag=false;
			}else{
				flag=response.data.success.checkFlag;
			}
		},
		error: function(e){
			//debugger;
			errobj = e;
			alert(e);
		}
	});
	return flag;
}