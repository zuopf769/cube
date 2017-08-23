var uuid=getUrlVar("uuid");
var pk_def;
var strUrl = location.protocol + "//" + location.host+"/";
strUrl += "classes/General/uap/ShowDesignerJoinPage?token=";
strUrl += token;

var dropDownListUrl = location.protocol + "//" + location.host+"/";
dropDownListUrl += "classes/General/uap/ShowJoinPageDropDownList?token=";
dropDownListUrl += token;
function categoryDropDownEditor(container, options) {
	//获取请求参数
	var requestPosition=options.field;
	var grid = $("#grid").data("kendoGrid");
	var row = grid.select();
	var selData = grid.dataItem(row);
	var leftTableMirrorId;
	var rightTableMirrorId;
	if(requestPosition=="leftTable"){
		
	}else{
		leftTableMirrorId=selData.leftTable.mirrorId;
		rightTableMirrorId=selData.rightTable.mirrorId;
	}
	
	//初始化下拉列表	
	$('<input name="' + options.field + '" required data-text-field="showName" data-value-field="mirrorId" data-bind="value:' + options.field + '"/>')
		.appendTo(container)
		.kendoDropDownList({
			autoBind: false,
			dataSource: new kendo.data.DataSource({
				schema : {
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
					}
				},
				transport : {
					read : {
						dataType : "json",
						contentType : "application/json",
						type : "POST",
						url : dropDownListUrl,
						data: {
							uuid: uuid, // send  parameter
							leftTableMirrorId:leftTableMirrorId,
							rightTableMirrorId:rightTableMirrorId,
							requestPosition:requestPosition
						}
					},
					parameterMap : function(options) {
						//赋值属性树请求参数
						options.uuid=uuid;
						options.leftTableMirrorId=leftTableMirrorId;
						options.rightTableMirrorId=rightTableMirrorId;
						options.requestPosition=requestPosition;
						return JSON.stringify(options);
					}
				}
			})
		});
}

function savePage(){
	//获取全部grid信息，封装返回数据
	var requestRowVOs=[];
	var grid = $("#grid").data("kendoGrid");
	var gridData=grid.dataSource.data();
	for(var i=0;i<gridData.length;i++){
		var requestRowVO={
			leftTableMirrorId:gridData[i].leftTable.mirrorId,
			joinTypeId:gridData[i].joinType.mirrorId,
			rightTableMirrorId:gridData[i].rightTable.mirrorId,
			leftFieldMirrorId:gridData[i].leftField.mirrorId,
			operatorId:gridData[i].operator.mirrorId,
			rightFieldMirrorId:gridData[i].rightField.mirrorId
		};
		requestRowVOs.push(requestRowVO);
	}
	var requestVO={
		uuid:uuid,
		joins:requestRowVOs
	};
	//ajax请求保存
	var updateUrl=location.protocol + "//" + location.host+"/";
	updateUrl += "classes/General/uap/saveJoinPage?token=";
	updateUrl += token;
	jQuery.ajax({
		url:updateUrl, async : false,type: "POST",
		data: JSON.stringify(requestVO),
		contentType:"application/json; charset=utf-8",
		success: function(response) {
			if(response.code==501){
				alert("Join信息保存异常。");
				return;
			}else if(response.data.fail!=null){
				alert(response.data.fail.msgContent);
				return;
			}else if(response.data.success=="ok"){
				return;
			}else{
				alert("Join信息保存异常。");
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

$(document).ready(function () {
	//初始化grid
	$("#grid").kendoGrid({
		dataSource: new kendo.data.DataSource({
			schema : {
				data: function(response) {
					if(response.code==501){
						alert("语义模型连接信息获取异常！");
						return [];
					}else if(response.data.fail!=null){
						alert(response.data.fail.msgContent)
						return [];
					}else if(response.data.success.returnList==null){
						return [];
					}else{
						return response.data.success.returnList; 
					}
				},
				model: {
						 fields: {
							leftTable: {defaultValue: { showName: "", mirrorId: ""}},
							joinType: {defaultValue: { showName: "", mirrorId: ""}},
							rightTable: {defaultValue: { showName: "", mirrorId: ""}},
							leftField: {defaultValue: { showName: "", mirrorId: ""}},
							operator: {defaultValue: { showName: "", mirrorId: ""}},
							rightField: {defaultValue: { showName: "", mirrorId: ""}}
						 }
					   }
			},
			transport : {
				read : {
					dataType : "json",
					contentType : "application/json",
					type : "POST",
					url : strUrl,
					data: {
						uuid: uuid // send  parameter
					}
				},
				parameterMap : function(options) {
					//赋值属性树请求参数
					options.uuid=uuid;
					return JSON.stringify(options);
				}
			}
		}),
		height: 550,
		selectable: "multiple",
		sortable: true,
		columns: [
			{ field:"leftTable",title:"左表",editor: categoryDropDownEditor,template: "#=leftTable.showName#"},
			{ field:"joinType",title:"连接", editor: categoryDropDownEditor,template: "#=joinType.showName#"},
			{ field:"rightTable",title:"右表", editor: categoryDropDownEditor,template: "#=rightTable.showName#"},
			{ field:"leftField",title:"左表字段", editor: categoryDropDownEditor,template: "#=leftField.showName#"},
			{ field:"operator",title:"关系", editor: categoryDropDownEditor,template: "#=operator.showName#"},
			{ field:"rightField",title:"右表字段", editor: categoryDropDownEditor,template: "#=rightField.showName#"},
			{ command: [{ name: "destroy", text: "删除" }], title: "删除", width: "150px" }
		],
		editable: {confirmation: "要删除该行么？"},
		toolbar: [{ name: "create", text: "增加条件" }]
	});
	
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
			//跳转
			window.location.replace("smartModelFieldsPage.html?token="+token+"&uuid="+uuid);
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
});
