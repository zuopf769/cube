//实体树请求参数
var treelevel="0";
var keyOne="";
var keyTwo="";
var strUrl = location.protocol + "//" + location.host+"/";
strUrl += "classes/General/uap/GetModuleEntityTree?token=";
strUrl += token;
var dataSource = new kendo.data.HierarchicalDataSource({
	schema : {
		data: function(response) {
			if(response.data.fail!=null){
				alert(response.data.fail.msgContent);
			}else if(response.data.success==null||response.data.success.child==null){
				return []; 
			}else{
				return response.data.success.child; 
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
			url : strUrl,
			data: {
				treelevel: treelevel, // send  parameter
				keyOne:keyOne,
				keyTwo:keyTwo
			}
		},
		parameterMap : function(options) {
			//赋值实体树请求参数，从这里重新赋值datasource属性
			options.treelevel=treelevel;
			options.keyOne=keyOne;
			options.keyTwo=keyTwo;
			return JSON.stringify(options);
		}
	}
});

//属性树请求参数
var attrTreelevel;
var attrKeyOne;
var attrKeyTwo;
var attrIsEntityTreeNodel;
var attrMirrorKey;
var uuid;
var attrDisplayName;
// 选择属性节点
var selectNodes=[];

var attrStrUrl = location.protocol + "//" + location.host+"/";
attrStrUrl += "classes/General/uap/GetAttrTree?token=";
attrStrUrl += token;
//初始化属性树
function initAttrTree(){
	$("#attrTree").kendoTreeView({
		dataSource: returnAttrTreeDataSource(),
		dataTextField: "displayName",
		checkboxes: {
                checkChildren: true
            },
		expand: function(e) {
			//展开实体树是，更新请求参数
			var dataItem = this.dataItem(e.node);
			attrTreelevel=dataItem.treelevel;
			attrKeyOne=dataItem.keyOne;
			attrKeyTwo=dataItem.keyTwo;
			attrIsEntityTreeNodel=dataItem.isEntityTreeNodel;
			attrMirrorKey=dataItem.mirrorKey;
			attrDisplayName=dataItem.displayName;
		},
		/*
		check: function(e) {
			var dataItem = this.dataItem(e.node);
			selectNode={
				treelevel:dataItem.treelevel,
				keyOne:dataItem.keyOne,
				keyTwo:dataItem.keyTwo,
				isEntityTreeNodel:dataItem.isEntityTreeNodel,
				mirrorKey:dataItem.mirrorKey
			}
		}
		*/
	});
};

//构建属性树数据源，每次新构建，为了点击实体节点时，刷新属性树
function returnAttrTreeDataSource(){
	var attrdataSource = new kendo.data.HierarchicalDataSource({
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
				url : attrStrUrl,
				data: {
					treelevel: attrTreelevel, // send  parameter
					keyOne:attrKeyOne,
					keyTwo:attrKeyTwo,
					uuid:uuid,
					isEntityTreeNodel:attrIsEntityTreeNodel,
					mirrorKey:attrMirrorKey,
					displayName:attrDisplayName
				}
			},
			parameterMap : function(options) {
				//赋值属性树请求参数
				options.treelevel=attrTreelevel;
				options.keyOne=attrKeyOne;
				options.keyTwo=attrKeyTwo;
				options.isEntityTreeNodel=attrIsEntityTreeNodel;
				options.mirrorKey=attrMirrorKey;
				options.displayName=attrDisplayName;
				return JSON.stringify(options);
			}
		}
	});
	return attrdataSource;
	
}

function checkedNodes(nodes,selectNodes){
	for (var i = 0; i < nodes.length; i++) {
		if (nodes[i].checked&&nodes[i].treelevel>0) {
			var selectNode={
				displayName:nodes[i].displayName,
				treelevel:nodes[i].treelevel,
				keyOne:nodes[i].keyOne,
				keyTwo:nodes[i].keyTwo,
				isEntityTreeNodel:nodes[i].isEntityTreeNodel,
				mirrorKey:nodes[i].mirrorKey,
				uuid:nodes[i].uuid
			}
			selectNodes.push(selectNode);
		}
		if (nodes[i].hasChildren) {
			checkedNodes(nodes[i].children.view(),selectNodes);
		}
	}
}

//页面全部加载完成后，初始实体树
$(document).ready(function(){
	uuid=getUrlVar("uuid");
	$("#saveButton").kendoButton({
	    click: function(e) {
			selectNodes=[];//每次重新初始化
	        var attrTree = $("#attrTree").data("kendoTreeView");
			var nodes=attrTree.dataSource.view();
			checkedNodes(nodes,selectNodes);
			var requestSaveMsg={
				selNodes:selectNodes,
				uuid:selectNodes[0].uuid
			}
			//发ajax请求。保存元数据作为metaProvider，并初始化语义模型
			var saveUrl=location.protocol + "//" + location.host+"/";
			saveUrl += "classes/General/uap/SaveMetaProvider?token=";
			saveUrl += token;
			jQuery.ajax({
				url:saveUrl, async : false,type: "POST",
				//data:{'selNodes':selectNodes,'uuid':selectNodes[0].uuid},
				data: JSON.stringify(requestSaveMsg),
				contentType:"application/json; charset=utf-8",
				success: function(response) {
					if(response.code==501||response.code==520||response.code==250){
						alert("请求异常。");
						return;
					}else if(response.data.fail!=null){
						alert(response.data.fail.msgContent);
						return;
					}else if(response.data.success.successMsg=="OK"){
						var uuid=response.data.success.uuid;
						window.location.replace("smartModelProviderPage.html?token="+token+"&uuid="+uuid);
					}else{
						alert('请求失败！')
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
	$("#cancleButton").kendoButton({
		click: function(e) {
			window.location.replace("smartModelProviderPage.html?token="+token+"&uuid="+uuid);
		}
	});
	
	$("#entityModelTree").kendoTreeView({
		dataSource: dataSource,
		dataTextField: "displayName",
		select: function(e) {
			//选择节点是，更新属性树请求参数
			var dataItem = this.dataItem(e.node);
			//debugger;
			var rootVO=[{
				treelevel:dataItem.treelevel,
				keyOne:dataItem.keyOne,
				keyTwo:dataItem.keyTwo,
				isEntityTreeNodel:dataItem.isEntityTreeNodel,
				displayName:dataItem.displayName,
				canExpand:true
			}];
			
			//一级节点不初始化属性树
			if(dataItem.treelevel==2){
				attrTreelevel=dataItem.treelevel;
				attrKeyOne=dataItem.keyOne;
				attrKeyTwo=dataItem.keyTwo;
				attrIsEntityTreeNodel=dataItem.isEntityTreeNodel;
				attrDisplayName="request_attr_root_wufeng";
				var attrTree = $("#attrTree").data("kendoTreeView");
				if(null!=attrTree){
					//已经初始化过，就更新datasource
					attrTree.setDataSource(returnAttrTreeDataSource());
				}else{
					//初始化
					initAttrTree();
				}	
			}
			//如果选择的是模块信息，清除属性树
			if(dataItem.treelevel==1){
				var attrTree = $("#attrTree").data("kendoTreeView");
				if(null!=attrTree){
					//已经初始化过，就更新datasource
					attrTree.setDataSource([]);
				}
			}
			
		},
		expand: function(e) {
			//展开更新请求参数
			var dataItem = this.dataItem(e.node);
			treelevel=dataItem.treelevel;
			keyOne=dataItem.keyOne;
			keyTwo=dataItem.keyTwo;
		}
	});
});

//保存属性树选择
function save(){
	
}