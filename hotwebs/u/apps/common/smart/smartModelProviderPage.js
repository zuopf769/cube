//debugger;
var uuid=getUrlVar("uuid");
var pk_def;
var strUrl = location.protocol + "//" + location.host+"/";
strUrl += "classes/General/uap/ShowDesignerProviderPage?token=";
strUrl += token;

function savePage(){
	//获取全部grid信息，封装返回数据
	var requestRowVOs=[];
	var grid = $("#grid").data("kendoGrid");
	var gridData=grid.dataSource.data();
	for(var i=0;i<gridData.length;i++){
		var requestRowVO={
			tableAlias:gridData[i].tableAlias,
			tableName:gridData[i].tableName
		};
		requestRowVOs.push(requestRowVO);
	}
	var requestVO={
		uuid:uuid,
		providers:requestRowVOs
	};
	//ajax请求保存
	var updateUrl=location.protocol + "//" + location.host+"/";
	updateUrl += "classes/General/uap/SaveProviderPage?token=";
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
				alert("Provider信息保存异常。");
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
			if(response.code==501||response.code==250){
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
					if(response.data.fail!=null){
						alert(response.data.fail.msgContent)
						return [];
					}else if(response.data.success.providerList==null){
						return [];
					}else{
						return response.data.success.providerList; 
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
		editable: {
		    mode: "incell",
		    update: false,
			confirmation: "是否删除该实体？\n请先删除该实体对应的连接条件，字段，描述器，确保最后删除该项！！"
		},
		columns: [{
			field: "tableAlias",
			title: "表别名"
		}, {
			field: "tableName",
			title: "表显示名"
		},{ command: [{ name: "destroy", text: "删除" }], title: "删除", width: "150px" }]
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
			//alert("暂时未开发！");
			//return;
			//发请求。跳转到otherPage
			window.location.replace("supperEdit/suppertest.html?token="+token+"&uuid="+uuid);
	    }
	});
	
	//元数据配置部分
	$("#addButton").kendoButton({
		click: function(e) {
			//发请求。跳转到 元数据选择页面
			window.location.replace("metaDataPage.html?token="+token+"&uuid="+uuid);
	    }
	});
	$("#delButton").kendoButton();
	
	//向导下一步，保存部分
	$("#nextButton").kendoButton({
		click: function(e) {
			//保存本页信息
			savePage();
			//跳转
			window.location.replace("smartModelJoinPage.html?token="+token+"&uuid="+uuid);
			//debugger;
			//var $container = $(".home-tab-content [data-content='" + "apps/common/smart/smartModelProviderPage.html" + "']");
			//cb.loader.loadView($container, cb.route.getPageUrl("apps/common/smart/smartModelJoinPage.html", {token:token, uuid:uuid}));
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
});
