var sortEditType;
function initSortPage(){
	//初始化grid
	$("#sortGrid").kendoGrid({
		dataSource: getSortDS(),
		selectable: "multiple",
		height:550,
		columns: [{
			field: "fieldExpression",
			title: "字段"
		},{
			field: "descString",
			title: "排列顺序"
		}]
	});
	
	//初始化按钮
	$("#sort_addButton").kendoButton({
		click: function(e) {
			sortEditType="add";
			//弹出window
			document.getElementById('sortEditWindow').style.display = "";
			var sortEditWindow = $("#sortEditWindow").data("kendoWindow");
			if (null==sortEditWindow) {
				//初始化window内组件
				initSortEditWindowComponents();
				initSortEditWindowComponentsValue("add");
				$("#sortEditWindow").kendoWindow({
					width: "380px",
					height: "200px",
					title: "编辑排序信息",
					actions: [
						"Pin",
						"Minimize",
						"Maximize",
						"Close"
					]
				});
			}else{
				//打开窗口
				initSortEditWindowComponentsValue("add");
				sortEditWindow.open();
			}
		}
	});
	$("#sort_updateButton").kendoButton({
		click: function(e) {
			sortEditType="update";
			//弹出window
			document.getElementById('sortEditWindow').style.display = "";
			var sortEditWindow = $("#sortEditWindow").data("kendoWindow");
			if (null==sortEditWindow) {
				//初始化window内组件
				initSortEditWindowComponents();
				initSortEditWindowComponentsValue("update");
				$("#sortEditWindow").kendoWindow({
					width: "380px",
					height: "200px",
					title: "编辑排序信息",
					actions: [
						"Pin",
						"Minimize",
						"Maximize",
						"Close"
					]
				});
			}else{
				//打开窗口
				initSortEditWindowComponentsValue("update");
				sortEditWindow.open();
			}
		}
	});
	$("#sort_delButton").kendoButton({
		click: function(e) {
			var r=confirm("确定要删除么？");
			if (r==true){
				//删除
				var sortGrid = $("#sortGrid").data("kendoGrid");
				var row=sortGrid.select();
				if(row.length==0){
					alert("请选择排序项！");
					return;
				}
				var selItem = sortGrid.dataItem(row);
				var sort_descendingBox = $("#sort_descending").data("kendoDropDownList");
				var sort_fieldExpressionBox = $("#sort_fieldExpression").data("kendoMaskedTextBox");
				var requestVO={
					uuid:uuid,
					mirrorId:selItem.mirrorId
				};
				//ajax请求保存
				var updateUrl=location.protocol + "//" + location.host+"/";
				updateUrl += "classes/General/uap/DelSortItem?token=";
				updateUrl += token;
				jQuery.ajax({
					url:updateUrl, async : false,type: "POST",
					data: JSON.stringify(requestVO),
					contentType:"application/json; charset=utf-8",
					success: function(response) {
						if(response.code==501||response.code==250||response.code==520){
							alert("SortItem信息删除异常。");
							return;
						}else if(response.data.fail!=null){
							alert(response.data.fail.msgContent);
							return;
						}else{
							//重新刷新grid
							sortGrid.setDataSource(getSortDS2(response.data.success));
							var sortEditWindow = $("#sortEditWindow").data("kendoWindow");
							sortEditWindow.close();
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
		}
	});
	$("#sort_upButton").kendoButton({
		click: function(e) {
			//上移
			var sortGrid = $("#sortGrid").data("kendoGrid");
			var row=sortGrid.select();
			if(row.length==0){
				alert("请选择排序项！");
				return;
			}
			var selItem = sortGrid.dataItem(row);
			var sort_descendingBox = $("#sort_descending").data("kendoDropDownList");
			var sort_fieldExpressionBox = $("#sort_fieldExpression").data("kendoMaskedTextBox");
			var requestVO={
				uuid:uuid,
				mirrorId:selItem.mirrorId
			};
			//ajax请求保存
			var updateUrl=location.protocol + "//" + location.host+"/";
			updateUrl += "classes/General/uap/UPSortItem?token=";
			updateUrl += token;
			jQuery.ajax({
				url:updateUrl, async : false,type: "POST",
				data: JSON.stringify(requestVO),
				contentType:"application/json; charset=utf-8",
				success: function(response) {
					if(response.code==501||response.code==250||response.code==520){
					alert("SortItem信息上移异常。");
						return;
					}else if(response.data.fail!=null){
						alert(response.data.fail.msgContent);
						return;
					}else{
						//重新刷新grid
						sortGrid.setDataSource(getSortDS2(response.data.success));
						var sortEditWindow = $("#sortEditWindow").data("kendoWindow");
						sortEditWindow.close();
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
	$("#sort_downButton").kendoButton({
		click: function(e) {
			//下移
			var sortGrid = $("#sortGrid").data("kendoGrid");
			var row=sortGrid.select();
			if(row.length==0){
				alert("请选择排序项！");
				return;
			}
			var selItem = sortGrid.dataItem(row);
			var sort_descendingBox = $("#sort_descending").data("kendoDropDownList");
			var sort_fieldExpressionBox = $("#sort_fieldExpression").data("kendoMaskedTextBox");
			var requestVO={
				uuid:uuid,
				mirrorId:selItem.mirrorId
			};
			//ajax请求保存
			var updateUrl=location.protocol + "//" + location.host+"/";
			updateUrl += "classes/General/uap/DownSortItem?token=";
			updateUrl += token;
			jQuery.ajax({
				url:updateUrl, async : false,type: "POST",
				data: JSON.stringify(requestVO),
				contentType:"application/json; charset=utf-8",
				success: function(response) {
					if(response.code==501||response.code==250||response.code==520){
					alert("SortItem信息下移异常。");
						return;
					}else if(response.data.fail!=null){
						alert(response.data.fail.msgContent);
						return;
					}else{
						//重新刷新grid
						sortGrid.setDataSource(getSortDS2(response.data.success));
						var sortEditWindow = $("#sortEditWindow").data("kendoWindow");
						sortEditWindow.close();
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
}

function getSortDS(){
	var URL = location.protocol + "//" + location.host+"/";
	URL += "classes/General/uap/GetSortList?token=";
	URL += token;
	var dataSource=new kendo.data.DataSource({
		schema : {
			data: function(response) {
				if(response.code==501||response.code==250||response.code==520){
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

function getSortDS2(msg){
	var dataSource=new kendo.data.DataSource({
		data:msg
	});
	return dataSource;
}

var sortDesc=[
	{
        name : "降序",
        value : true
    },
	{
        name : "升序",
        value : false
    }
]

function initSortEditWindowComponents(){
	//字段
	$("#sort_fieldExpression").kendoMaskedTextBox({
		mask: ""
	});
	//排列顺序
	$("#sort_descending").kendoDropDownList({
		dataTextField: "name",
		dataValueField: "value",
		dataSource: sortDesc
	});
	
	$("#sort_save_Button").kendoButton({
		click: function(e) {
			if(sortEditType=="add"){
				//增加
				var sortGrid = $("#sortGrid").data("kendoGrid");
				var sort_descendingBox = $("#sort_descending").data("kendoDropDownList");
				var sort_fieldExpressionBox = $("#sort_fieldExpression").data("kendoMaskedTextBox");
				var requestVO={
					uuid:uuid,
					fieldExpression:sort_fieldExpressionBox.value(),
					descending:sort_descendingBox.value()
				};
				//ajax请求保存
				var updateUrl=location.protocol + "//" + location.host+"/";
				updateUrl += "classes/General/uap/AddSortItem?token=";
				updateUrl += token;
				jQuery.ajax({
					url:updateUrl, async : false,type: "POST",
					data: JSON.stringify(requestVO),
					contentType:"application/json; charset=utf-8",
					success: function(response) {
						if(response.code==501||response.code==250||response.code==520){
							alert("SortItem信息保存异常。");
							return;
						}else if(response.data.fail!=null){
							alert(response.data.fail.msgContent);
							return;
						}else{
							//重新刷新grid
							sortGrid.setDataSource(getSortDS2(response.data.success));
							var sortEditWindow = $("#sortEditWindow").data("kendoWindow");
							sortEditWindow.close();
							return;
						}
					},
					error: function(e){
						//debugger;
						errobj = e;
						alert(e);
					}
				});
			}else{
				//更新
				var sortGrid = $("#sortGrid").data("kendoGrid");
				var row=sortGrid.select();
				if(row.length==0){
					alert("请选择排序项！");
					return;
				}
				var selItem = sortGrid.dataItem(row);
				var sort_descendingBox = $("#sort_descending").data("kendoDropDownList");
				var sort_fieldExpressionBox = $("#sort_fieldExpression").data("kendoMaskedTextBox");
				var requestVO={
					uuid:uuid,
					mirrorId:selItem.mirrorId,
					fieldExpression:sort_fieldExpressionBox.value(),
					descending:sort_descendingBox.value()
				};
				//ajax请求保存
				var updateUrl=location.protocol + "//" + location.host+"/";
				updateUrl += "classes/General/uap/UpdateSortItem?token=";
				updateUrl += token;
				jQuery.ajax({
					url:updateUrl, async : false,type: "POST",
					data: JSON.stringify(requestVO),
					contentType:"application/json; charset=utf-8",
					success: function(response) {
						if(response.code==501||response.code==250||response.code==520){
							alert("SortItem信息更新异常。");
							return;
						}else if(response.data.fail!=null){
							alert(response.data.fail.msgContent);
							return;
						}else{
							//重新刷新grid
							sortGrid.setDataSource(getSortDS2(response.data.success));
							var sortEditWindow = $("#sortEditWindow").data("kendoWindow");
							sortEditWindow.close();
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
		}
	});
	$("#sort_cancle_Button").kendoButton({
		click: function(e) {
			var sortEditWindow = $("#sortEditWindow").data("kendoWindow");
			sortEditWindow.close();
		}
	});
}

function initSortEditWindowComponentsValue(type){
	if(type=="add"){
		//清除弹出框数据
		var sort_descendingBox = $("#sort_descending").data("kendoDropDownList");
		sort_descendingBox.select(function(dataItem) {
			return dataItem.value === false;
		});
		var sort_fieldExpressionBox = $("#sort_fieldExpression").data("kendoMaskedTextBox");
		sort_fieldExpressionBox.value("");
	}else{
		//获取grid内容
		var sortGrid = $("#sortGrid").data("kendoGrid");
		var row=sortGrid.select();
		if(row.length==0){
			alert("请选择排序项！");
			return;
		}
		var selItem = sortGrid.dataItem(row);
		//赋值弹出框数据
		var sort_descendingBox = $("#sort_descending").data("kendoDropDownList");
		sort_descendingBox.select(function(dataItem) {
			return dataItem.value === selItem.descending;
		});
		var sort_fieldExpressionBox = $("#sort_fieldExpression").data("kendoMaskedTextBox");
		sort_fieldExpressionBox.value(selItem.fieldExpression);
	}
}


function openSmartMetaTree2(){
	openSmartMetaTreeFlag="sort_field";
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