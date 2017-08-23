var uuid=getUrlVar("uuid");
var pk_def;
//当前编辑也签信息：A，B，C，D
var editPageFlag;

//保存过滤条件页面信息至缓存
function savePageA(){
	//获取全部grid信息，封装返回数据
	var requestVO={
		uuid:uuid
	};
	//ajax请求保存
	var updateUrl=location.protocol + "//" + location.host+"/";
	updateUrl += "classes/General/uap/SaveFilterToCache?token=";
	updateUrl += token;
	jQuery.ajax({
		url:updateUrl, async : false,type: "POST",
		data: JSON.stringify(requestVO),
		contentType:"application/json; charset=utf-8",
		success: function(response) {
			if(response.code==501||response.code==250){
				alert("Filter信息保存异常。");
				return;
			}else if(response.data.fail!=null){
				alert(response.data.fail.msgContent);
				return;
			}else if(response.data.success=="ok"){
				return;
			}else{
				alert("Filter信息保存异常。");
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

//保存排序信息至缓存
function savePageB(){
	//封装请求参数
	var requestVO={
		uuid:uuid
	};
	//ajax请求保存
	var updateUrl=location.protocol + "//" + location.host+"/";
	updateUrl += "classes/General/uap/SaveSortDescriptor?token=";
	updateUrl += token;
	jQuery.ajax({
		url:updateUrl, async : false,type: "POST",
		data: JSON.stringify(requestVO),
		contentType:"application/json; charset=utf-8",
		success: function(response) {
			if(response.code==501||response.code==250||response.code==520){
				alert("SortDescriptor信息保存异常。");
				return;
			}else if(response.data.fail!=null){
				alert(response.data.fail.msgContent);
				return;
			}else{
				//保存成功
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
//保存distinctct信息至缓存
function savePageC(){
	//获取distinct页面控件信息
	var distinctCodeBox= $("#distinctCode").data("kendoDropDownList");
	
	//封装请求参数
	var requestVO={
		uuid:uuid,
		openFlag:distinctCodeBox.value()
	};
	//ajax请求保存
	var updateUrl=location.protocol + "//" + location.host+"/";
	updateUrl += "classes/General/uap/UpdateDistinct?token=";
	updateUrl += token;
	jQuery.ajax({
		url:updateUrl, async : false,type: "POST",
		data: JSON.stringify(requestVO),
		contentType:"application/json; charset=utf-8",
		success: function(response) {
			if(response.code==501||response.code==250){
				alert("Distinct信息保存异常。");
				return;
			}else if(response.data.fail!=null){
				alert(response.data.fail.msgContent);
				return;
			}else{
				distinctCodeBox.select(function(dataItem) {
					return dataItem.value === response.data.success;
				});
			}
		},
		error: function(e){
			//debugger;
			errobj = e;
			alert(e);
		}
	});
}
//保存参数信息至缓存
function savePageD(){
	//封装请求参数
	var requestVO={
		uuid:uuid
	};
	//ajax请求保存
	var updateUrl=location.protocol + "//" + location.host+"/";
	updateUrl += "classes/General/uap/SaveParameter?token=";
	updateUrl += token;
	jQuery.ajax({
		url:updateUrl, async : false,type: "POST",
		data: JSON.stringify(requestVO),
		contentType:"application/json; charset=utf-8",
		success: function(response) {
			if(response.code==501||response.code==250){
				alert("参数信息保存异常。");
				return;
			}else if(response.data.fail!=null){
				alert(response.data.fail.msgContent);
				return;
			}else if(response.data.success=="ok"){
				return;
			}else{
				alert("参数信息保存异常。");
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

//保存宏信息至缓存
function savePageE(){
	
}

function savePage(){
	if(editPageFlag=="A"){
		savePageA();
	}else if(editPageFlag=="B"){
		savePageB();
	}else if(editPageFlag=="C"){
		savePageC();
	}else if(editPageFlag=="D"){
		savePageD();
	}else if(editPageFlag=="E"){
		savePageE();
	}else{
		alert("当前编辑页签不明确，无法保存！");
	}
}


function saveSmartModel(){
	var requestVO={
		uuid:uuid,
		pk_def:pk_def
	}
	//ajax请求
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

$(document).ready(function () {
	//初始化button
	$("#providerButton").kendoButton({
		click: function(e) {
			//发请求。跳转到providerPage
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
	
	//向导下一步，保存部分
	$("#nextButton").kendoButton({
		//保存本页信息，并跳转下一页
		click: function(e) {
			//保存本页信息
			savePage();
			alert("下一页暂时未开发，到此为止，请点击完成按钮！");
			return;
			//跳转
			//window.location.replace(".html?token="+token+"&uuid="+uuid);
		}
	});
	$("#saveButton").kendoButton({
		//保存本页信息
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
	

	//本页内部导航按钮
	$("#A").kendoButton({
		click: function(e) {
			document.getElementById('filterCenter').style.display = "";
			document.getElementById('sortCenter').style.display = "none";
			document.getElementById('distinctCenter').style.display = "none";
			document.getElementById('parameterCenter').style.display = "none";
			document.getElementById('macroCenter').style.display = "none";
			//赋值当前编辑也签信息
			editPageFlag="A";
		}
	});
	$("#B").kendoButton({
		click: function(e) {
			document.getElementById('filterCenter').style.display = "none";
			document.getElementById('sortCenter').style.display = "";
			document.getElementById('distinctCenter').style.display = "none";
			document.getElementById('parameterCenter').style.display = "none";
			document.getElementById('macroCenter').style.display = "none";
			//初始化sortCenter页面
			initSortPage();
			//赋值当前编辑也签信息
			editPageFlag="B";
			
		}
	});
	$("#C").kendoButton({
		click: function(e) {
			document.getElementById('filterCenter').style.display = "none";
			document.getElementById('sortCenter').style.display = "none";
			document.getElementById('distinctCenter').style.display = "";
			document.getElementById('parameterCenter').style.display = "none";
			document.getElementById('macroCenter').style.display = "none";
			//初始化distinctCenter页面
			initDistinctPage();
			//赋值当前编辑也签信息
			editPageFlag="C";
		}
	});
	$("#D").kendoButton({
		click: function(e) {
			document.getElementById('filterCenter').style.display = "none";
			document.getElementById('sortCenter').style.display = "none";
			document.getElementById('distinctCenter').style.display = "none";
			document.getElementById('parameterCenter').style.display = "";
			document.getElementById('macroCenter').style.display = "none";
			//初始化parameter页面
			initParameterPage();
			//赋值当前编辑也签信息
			editPageFlag="D";
		}
	});
	$("#E").kendoButton({
		click: function(e) {
			alert("暂时未开发！");
			return;
			document.getElementById('filterCenter').style.display = "none";
			document.getElementById('sortCenter').style.display = "none";
			document.getElementById('distinctCenter').style.display = "none";
			document.getElementById('parameterCenter').style.display = "none";
			document.getElementById('macroCenter').style.display = "";
			//赋值当前编辑也签信息
			editPageFlag="E";
		}
	});
	
	$("#filter_addButton").kendoButton({
		click: function(e) {
			var filterTreelist = $("#filterTreelist").data("kendoTreeList");
			var id;
			if(null!=filterTreelist){
				var node = filterTreelist.select();
				if(null!=node){
					var nodeData = filterTreelist.dataItem(node);
					if(null!=nodeData){
						id=nodeData.id;
					}else{
						alert("请先选择条件。");
						return;
					}
				}	
			}
			
			var requestVO={
				uuid:uuid,
				index:id
			}

			var updateUrl=location.protocol + "//" + location.host+"/";
			updateUrl += "classes/General/uap/AddFilter?token=";
			updateUrl += token;
			jQuery.ajax({
				url:updateUrl, async : false,type: "POST",
				data: JSON.stringify(requestVO),
				contentType:"application/json; charset=utf-8",
				success: function(response) {
					if(response.code==501||response.code==250){
						alert("增加条件异常。");
						return;
					}else if(response.data.fail!=null){
						alert(response.data.fail.msgContent);
						return;
					}else{
						//刷新前台treeGrid
						var datasource=getFilterGridDS(response.data.success);
						filterTreelist.setDataSource(datasource);
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
	
	$("#filter_addSubButton").kendoButton({
		click: function(e) {
			var filterTreelist = $("#filterTreelist").data("kendoTreeList");
			var id;
			if(null!=filterTreelist){
				var node = filterTreelist.select();
				if(null!=node){
					var nodeData = filterTreelist.dataItem(node);
					if(null!=nodeData){
						id=nodeData.id;
					}else{
						alert("请先选择条件。");
						return;
					}					
				}
			}
			
			var requestVO={
				uuid:uuid,
				index:id
			}

			var updateUrl=location.protocol + "//" + location.host+"/";
			updateUrl += "classes/General/uap/AddSubFilter?token=";
			updateUrl += token;
			jQuery.ajax({
				url:updateUrl, async : false,type: "POST",
				data: JSON.stringify(requestVO),
				contentType:"application/json; charset=utf-8",
				success: function(response) {
					if(response.code==501||response.code==250){
						alert("增加子条件异常。");
						return;
					}else if(response.data.fail!=null){
						alert(response.data.fail.msgContent);
						return;
					}else{
						//刷新前台treeGrid
						var datasource=getFilterGridDS(response.data.success);
						filterTreelist.setDataSource(datasource);
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
	
	$("#filter_editButton").kendoButton({
		click:function(){
			//初始化页面控件值
			//组织请求参数
			var filterTreelist = $("#filterTreelist").data("kendoTreeList");
			if(null!=filterTreelist){
				var node = filterTreelist.select();
				if(null!=node){
					var nodeData = filterTreelist.dataItem(node);
					if(null==nodeData){
						alert("请先选择要修改的内容！");
					}
				}	
			}
			
			//where语句不让编辑
			if(nodeData.logicCode.value=="where"){
				alert("where条件不可编辑，请编辑where子条件！");
				return;
			}
			
			var logicCodeBox = $("#logicCode").data("kendoDropDownList");
			logicCodeBox.select(function(dataItem) {
			    return dataItem.value === nodeData.logicCode.value;
			});
			var operatorCodeBox = $("#operatorCode").data("kendoDropDownList");
			operatorCodeBox.select(function(dataItem) {
			    return dataItem.value === nodeData.operatorCode.value;
			});
			var valueTypeBox = $("#valueType").data("kendoDropDownList");
			valueTypeBox.select(function(dataItem) {
			    return dataItem.value === nodeData.valueType.value;
			});
			var fieldNameBox = $("#fieldName").data("kendoMaskedTextBox");
			fieldNameBox.value(nodeData.fieldName);
			var valueBox = $("#value").data("kendoMaskedTextBox");
			valueBox.value(nodeData.value);
			$("#dataType")[0].value=nodeData.dataType;
			
			//弹出window
			document.getElementById('editFilterWindow').style.display = "";
			var editFilterWindow = $("#editFilterWindow").data("kendoWindow");
			if (null==editFilterWindow) {
				$("#editFilterWindow").kendoWindow({
					width: "600px",
					height: "300px",
					title: "编辑过滤信息",
					actions: [
						"Pin",
						"Minimize",
						"Maximize",
						"Close"
					]
				});
			}else{
				editFilterWindow.open();
			}
		}
	});
	
	$("#filter_delButton").kendoButton({
		click:function(){
			var filterTreelist = $("#filterTreelist").data("kendoTreeList");
			var id;
			if(null!=filterTreelist){
				var node = filterTreelist.select();
				if(null!=node){
					var nodeData = filterTreelist.dataItem(node);
					if(null!=nodeData){
						id=nodeData.id;
					}else{
						alert("请先选择条件。");
						return;
					}					
				}
			}
			
			var requestVO={
				uuid:uuid,
				index:id
			}

			var updateUrl=location.protocol + "//" + location.host+"/";
			updateUrl += "classes/General/uap/DelFilter?token=";
			updateUrl += token;
			jQuery.ajax({
				url:updateUrl, async : false,type: "POST",
				data: JSON.stringify(requestVO),
				contentType:"application/json; charset=utf-8",
				success: function(response) {
					if(response.code==501||response.code==250){
						alert("删除条件异常。");
						return;
					}else if(response.data.fail!=null){
						alert(response.data.fail.msgContent);
						return;
					}else{
						//刷新前台treeGrid
						var datasource=getFilterGridDS(response.data.success);
						filterTreelist.setDataSource(datasource);
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
	
	//初始化editFilterWindow的Button和显示控件
	//逻辑符
	$("#logicCode").kendoDropDownList({
		dataTextField: "name",
		dataValueField: "value",
		dataSource: logicCode
	});
	//字段
	$("#fieldName").kendoMaskedTextBox({
		mask: ""
	});
	//操作符
	$("#operatorCode").kendoDropDownList({
		dataTextField: "name",
		dataValueField: "value",
		dataSource: operatorCode
	});
	//值类型
	$("#valueType").kendoDropDownList({
		dataTextField: "name",
		dataValueField: "value",
		dataSource: valueType
	});
	//值
	$("#value").kendoMaskedTextBox({
		mask: ""
	});
	
	$("#update_filterButton").kendoButton({
		//更新操作
		click: function(e) {
			//组织请求参数
			var filterTreelist = $("#filterTreelist").data("kendoTreeList");
			if(null!=filterTreelist){
				var node = filterTreelist.select();
				if(null!=node){
					var nodeData = filterTreelist.dataItem(node);
					if(null==nodeData){
						alert("请先选择要修改的内容！");
					}
				}	
			}
			
			var logicCodeBox = $("#logicCode").data("kendoDropDownList");
			var fieldNameBox = $("#fieldName").data("kendoMaskedTextBox");
			var operatorCodeBox = $("#operatorCode").data("kendoDropDownList");
			var valueTypeBox = $("#valueType").data("kendoDropDownList");
			var valueBox = $("#value").data("kendoMaskedTextBox");
			var dataTypeBox=$("#dataType")[0].value;
			
			var upFilterItem={
				//父ID
				parentId:nodeData.parentId,
				//当前Id，即List中的索引
				id:nodeData.id,
				//逻辑符
				logicCode:{
					name:logicCodeBox.text(),
					value:logicCodeBox.value()
				},
				//比较符
				operatorCode:{
					name:operatorCodeBox.text(),
					value:operatorCodeBox.value()
				},
				//值类型
				valueType:{
					name:valueTypeBox.text(),
					value:valueTypeBox.value()
				},
				//字段名称
				fieldName:fieldNameBox.value(),
				//字段类型
				dataType:dataTypeBox,
				//表达式，暂时不赋值
				//expression:
				//值
				value:valueBox.value()
			}
			
			var requestVO={
				uuid:uuid,
				upFilterItem:upFilterItem
			}

			var updateUrl=location.protocol + "//" + location.host+"/";
			updateUrl += "classes/General/uap/UpdateFilter?token=";
			updateUrl += token;
			jQuery.ajax({
				url:updateUrl, async : false,type: "POST",
				data: JSON.stringify(requestVO),
				contentType:"application/json; charset=utf-8",
				success: function(response) {
					if(response.code==501||response.code==250){
						alert("更新条件异常！");
						return;
					}else if(response.data.fail!=null){
						alert(response.data.fail.msgContent);
						return;
					}else{
						//刷新前台treeGrid
						var datasource=getFilterGridDS(response.data.success);
						filterTreelist.setDataSource(datasource);
						//关闭窗口
						var editFilterWindow = $("#editFilterWindow").data("kendoWindow");
						editFilterWindow.close();
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
	$("#update_cancle_filterButton").kendoButton({
		click: function(e) {
			var editFilterWindow = $("#editFilterWindow").data("kendoWindow");
			editFilterWindow.close();
		}
	});
	
	//初始化filterGrid
	$("#filterTreelist").kendoTreeList({
		dataSource: getFistFilterGridDS(),
		selectable: "multiple",
		height: 550,
		columns: [
			{ field:"logicCode",title:"逻辑符", expandable: true,template: "#=logicCode.name#"},
			{ field:"fieldName",title:"字段"},
			{ field:"operatorCode",title:"操作符",template: "#=operatorCode.name#"},
			{ field:"valueType",title:"值类型",template: "#=valueType.name#"},
			{ field:"value",title:"值"}
		]
	});

});

function initDistinctPage(){
	
	//ajax请求，看是否有distinct
	var havDistinct;
	//获取全部grid信息，封装返回数据
	var requestVO={
		uuid:uuid
	};
	//ajax请求
	var updateUrl=location.protocol + "//" + location.host+"/";
	updateUrl += "classes/General/uap/GetHaveDistinct?token=";
	updateUrl += token;
	jQuery.ajax({
		url:updateUrl, async : false,type: "POST",
		data: JSON.stringify(requestVO),
		contentType:"application/json; charset=utf-8",
		success: function(response) {
			if(response.code==501||response.code==250){
				alert("获取dintinct信息异常。");
				return;
			}else if(response.data.fail!=null){
				alert(response.data.fail.msgContent);
				return;
			}else{
				havDistinct=response.data.success;
			}
		},
		error: function(e){
			//debugger;
			errobj = e;
			alert(e);
		}
	});
	var distinctCodeBox= $("#distinctCode").data("kendoDropDownList");
	if(null==distinctCodeBox){
		//初始化Distinct也签的控件
		//操作符
		$("#distinctCode").kendoDropDownList({
			dataTextField: "name",
			dataValueField: "value",
			dataSource: [{name:"不启用",value:-1},{name:"启用",value:1}]
		});
		//赋值
		distinctCodeBox= $("#distinctCode").data("kendoDropDownList");
		distinctCodeBox.select(function(dataItem) {
			return dataItem.value === havDistinct;
		});
	}else{
		//设置distinctCode下拉框值
		distinctCodeBox.select(function(dataItem) {
			return dataItem.value === havDistinct;
		});
	}
	
}

function getFistFilterGridDS(){
	var URL = location.protocol + "//" + location.host+"/";
	URL += "classes/General/uap/ShowDesignerFilterPage?token=";
	URL += token;
	var dataSource=new kendo.data.TreeListDataSource({
		transport : {
			read : {
				dataType : "json",
				contentType : "application/json",
				type : "POST",
				url : URL,
				data: {
					uuid: uuid // send  parameter
				}
			},
			parameterMap : function(options) {
				//赋值属性树请求参数
				options.uuid=uuid;
				return JSON.stringify(options);
			}
		},
		schema: {
			data: function(response) {
				if(response.code==501){
					alert("获取下拉框信息异常！");
					return [];
				}else if(response.data.fail!=null){
					alert(response.data.fail.msgContent)
					return [];
				}else if(response.data.success==null){
					return [];
				}else{
					return response.data.success; 
				}
			},
			model: {
				id: "id",
				fields: {
					parentId: { field: "parentId", nullable: true }
				}
			}
		}
	});

	return dataSource;
}

function getFilterGridDS(data){
	var dataSource=new kendo.data.TreeListDataSource({
		data:data,
		schema: {
			model: {
				id: "id",
				fields: {
					parentId: { field: "parentId", nullable: true }
				}
			}
		}
	});
	return dataSource;
}

var logicCode=[
	{
        name : "-请选择-",
        value : ""
    },{
		name : "并且",
        value : "AND"
    },{
		name : "或者",
        value : "OR"
    }
]

var operatorCode=[
	{
        name : "-请选择-",
        value : ""
    },{ 
		name:"=",
		value:"="
	},{ 
		name:">",
		value:">"
	},{ 
		name:">=",
		value:">="
	},{ 
		name:"<",
		value:"<"
	},{ 
		name:"<=",
		value:"<="
	},{ 
		name:"<>",
		value:"<>"
	},{ 
		name:"like",
		value:"like"
	},{ 
		name:"in",
		value:"in"
	},{ 
		name:"not like",
		value:"not like"
	},{ 
		name:"not in",
		value:"not in"
	},{ 
		name:"is",
		value:"is"
	}
]

var valueType=[
	{
        name : "-请选择-",
        value : ""
    },{
		name:"常量",
		value:"1"
	},{
		name:"字段",
		value:"2"
	},{
		name:"表达式",
		value:"3"
	},{
		name:"参数",
		value:"4"
	},{
		name:"宏变量",
		value:"5"
	}
]

//改全局值用于标记是哪个地方打开的语义模型元数据树，不同来源保存值存至不同地方
var openSmartMetaTreeFlag;
//filter选择Field字段，弹出samrtMeteTree
function openSmartMetaTree(){
	openSmartMetaTreeFlag="fieldText";
	//弹出window
	document.getElementById('smartMetaTreeWindow').style.display = "";
	var smartMetaTreeWindow = $("#smartMetaTreeWindow").data("kendoWindow");
	if (null==smartMetaTreeWindow) {
		//初始window控件
		initSamrtMeteTreeWindowComponents();
		//初始化window
		$("#smartMetaTreeWindow").kendoWindow({
			width: "600px",
			height: "500px",
			title: "元数据参照",
			actions: [
				"Pin",
				"Minimize",
				"Maximize",
				"Close"
			]
		});
	}else{
		smartMetaTreeWindow.open();
	}
}

var selectSmartMeteTreeMirrorId="";
function initSamrtMeteTreeWindowComponents(){
	
	//初始化samrtMeteTree
	$("#smartMetaTree").kendoTreeView({
		dataSource: initSamrtMeteTreeDS(),
		dataTextField: "dispalyName",
		expand: function(e) {
			//展开实体树是，更新请求参数
			var dataItem = this.dataItem(e.node);
			selectSmartMeteTreeMirrorId=dataItem.mirrorId;
		}
	})
	//初始化button
	$("#smartMetaTree_saveButton").kendoButton({
		click: function(e) {
			//取树节点值
			var smartMetaTree = $("#smartMetaTree").data("kendoTreeView");
			var node=smartMetaTree.select();
			var dataItem = smartMetaTree.dataItem(node);
			if(null==dataItem.expression||dataItem.expression==""){
				alert("该类型节点不可选择，请选择其下子节点。");
			}
			//赋值弹出窗信息，根据弹出窗口来源不同，赋值不同文本框
			if(openSmartMetaTreeFlag=="fieldText"){
				var fieldNameBox = $("#fieldName").data("kendoMaskedTextBox");
				fieldNameBox.value(dataItem.expression);
				$("#dataType")[0].value=dataItem.dataType;
			}else if(openSmartMetaTreeFlag=="valueText"){
				var valueBox = $("#value").data("kendoMaskedTextBox");
				valueBox.value(dataItem.expression);
			}else if(openSmartMetaTreeFlag=="sort_field"){
				var valueBox = $("#sort_fieldExpression").data("kendoMaskedTextBox");
				valueBox.value(dataItem.expression);
			}
			
			//关闭窗口
			var smartMetaTreeWindow = $("#smartMetaTreeWindow").data("kendoWindow");	
			smartMetaTreeWindow.close();	
		}
	});
	$("#smartMetaTree_cancleButton").kendoButton({
		click: function(e) {
			var smartMetaTreeWindow = $("#smartMetaTreeWindow").data("kendoWindow");	
			smartMetaTreeWindow.close();	
		}
	});
};

function initSamrtMeteTreeDS(){
	var URL=location.protocol + "//" + location.host+"/";
	URL += "classes/General/uap/GetSmartModelMetaTree?token=";
	URL += token;
	var SamrtMeteTreeDS = new kendo.data.HierarchicalDataSource({
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
				mirrorId:selectSmartMeteTreeMirrorId
			}
		},
		parameterMap : function(options) {
			//赋值实体树请求参数，从这里重新赋值datasource属性
			options.uuid=uuid;
			options.mirrorId=selectSmartMeteTreeMirrorId;
			return JSON.stringify(options);
		}
	}
	});
	return SamrtMeteTreeDS;
};

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

//点击值文本框，弹出值编辑窗口，根据值类型不同，弹出不同窗口
function openValue(){
	openSmartMetaTreeFlag="valueText";
	var valueTypeBox = $("#valueType").data("kendoDropDownList");
	
	//根据场景，弹出不同window
	if(valueTypeBox.value()=="1"){
		
	}else if(valueTypeBox.value()=="2"){
		//弹出window
		document.getElementById('smartMetaTreeWindow').style.display = "";
		var smartMetaTreeWindow = $("#smartMetaTreeWindow").data("kendoWindow");
		if (null==smartMetaTreeWindow) {
			//初始window控件
			initSamrtMeteTreeWindowComponents();
			//初始化window
			$("#smartMetaTreeWindow").kendoWindow({
				width: "600px",
				height: "500px",
				title: "元数据参照",
				actions: [
					"Pin",
					"Minimize",
					"Maximize",
					"Close"
				]
			});
		}else{
			smartMetaTreeWindow.open();
		}
	}else if(valueTypeBox.value()=="3"){
		//弹出window
		document.getElementById('editWindow').style.display = "";
		var editWindow = $("#editWindow").data("kendoWindow");
		if (null==editWindow) {
			//初始化editWindow组件
			//目标待赋值文本框
			var valueBox = $("#value").data("kendoMaskedTextBox");
			initEditWindowComponents(valueBox);
			//初始化window
			$("#editWindow").kendoWindow({
				width: "890px",
				height: "630px",
				title: "编辑字段信息",
				actions: [
					"Pin",
					"Minimize",
					"Maximize",
					"Close"
				]
			});
		}else{
			//重置editWindow组件
			resetEditWindowComponents();
			editWindow.open();
		}
	}else if(valueTypeBox.value()=="4"){
		//弹出window
		document.getElementById('parameterWindow').style.display = "";
		var parameterWindow = $("#parameterWindow").data("kendoWindow");
		if (null==parameterWindow) {
			//初始window控件
			pmSaveFlag=1;
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
			pmSaveFlag=1;
			parameterWindow.open();
		}
	}else if(valueTypeBox.value()=="5"){
		//弹出window
		document.getElementById('macroWindow').style.display = "";
		var macroWindow = $("#macroWindow").data("kendoWindow");
		if (null==macroWindow) {
			//初始window控件
			macroSaveFlag=1;
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
			macroSaveFlag=1;
			macroWindow.open();
		}
	}
}