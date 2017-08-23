//实体树请求参数
var pk_dir="";
var dirname;
var parentId;
var strTreeUrl = location.protocol + "//" + location.host+"/";
strTreeUrl += "classes/General/uap/GetQueryEngineDirTreeNode?token=";
strTreeUrl += token;

var strGridUrl = location.protocol + "//" + location.host+"/";
strGridUrl += "classes/General/uap/GetQueryEngineDefList?token=";
strGridUrl += token;

function returnTreeDataSource(){
	var dataSource = new kendo.data.HierarchicalDataSource({
		schema : {
			data: function(response) {
				if(response.data.success.child==null){
					return;
				}else{
					return response.data.success.child; 
				}
			  
			},
			model: {
					hasChildren: true
				}
		},
		transport : {
			read : {
				dataType : "json",
				contentType : "application/json",
				type : "POST",
				url : strTreeUrl,
				data: {
					pk_dir: pk_dir, // send  parameter
					dirname:dirname,
					parentId:parentId
				}
			},
			parameterMap : function(options) {
				//赋值实体树请求参数，从这里重新赋值datasource属性
				options.pk_dir=pk_dir;
				options.dirname=dirname;
				options.parentId=parentId;
				return JSON.stringify(options);
			}
		}
	});
	return dataSource;
}


//重新创建grid数据源
function returnGridDataSource(){
	var griddataSource = new kendo.data.DataSource({
		schema : {
			data: function(response) {
				if(pk_dir==""){
					//首次请求不反回数据
					return;
				}else if(response.data.success==null){
					//如果没有数据，也直接返回
					return;
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
				url : strGridUrl,
				data: {
					pk_dir:pk_dir
				}
			},
			parameterMap : function(options) {
				//赋值属性树请求参数
				options.pk_dir=pk_dir;
				return JSON.stringify(options);
			}
		}
	});
	//debugger;
	return griddataSource;
}

function initDefGrid(){
	//初始化grid
	$("#defGrid").kendoGrid({
		dataSource: returnGridDataSource(),
		height: 550,
		sortable: true,
		selectable: "multiple",
		columns: [{
			field: "pk_def",
			title: "主键",
			hidden: true
		}, {
			field: "defcode",
			title: "语义模型编码"
		}, {
			field: "defname",
			title: "语义模型名称"
		}, {
			field: "creationtime",
			title: "创建时间"
		}, {
			field: "modifiedtime",
			title: "修改时间"
		}, {
			field: "sysinit",
			title: "是否系统预置"
		}]
	});
}

function initViewGrid(jobj){
	//初始化grid
	$("#viewGrid").kendoGrid({
		dataSource: jobj
	});
}

//页面全部加载完成后，初始实体树
$(document).ready(function(){
	//debugger;
	$("#addDirButton").kendoButton({
		click:function(e){
			//初始化文本框
			var parentIdBox = $("#parentId").data("kendoMaskedTextBox");
			parentIdBox.enable(false);
			var pk_dirBox = $("#pk_dir").data("kendoMaskedTextBox");
			pk_dirBox.enable(false);
			var dirNameBox = $("#dirName").data("kendoMaskedTextBox");
			dirNameBox.value("");
			var seqnumberBox = $("#seqnumber").data("kendoMaskedTextBox");
			seqnumberBox.value("");
			var dirClearButtonBox = $("#dirClearButton").data("kendoButton");
			dirClearButtonBox.enable(true);
			$("#editType")[0].value="save";
			
			//拿到树节点
			var dirTree = $("#dirTree").data("kendoTreeView");
			var node=dirTree.select();
			var dataItem = dirTree.dataItem(node);
			if(null==dataItem){
				parentIdBox.value("");
			}else{
				parentIdBox.value(dataItem.pk_dir);
			}
			//弹出window
			document.getElementById('editDirWindow').style.display = "";
			var editDirWindow = $("#editDirWindow").data("kendoWindow");
			if (null==editDirWindow) {
				$("#editDirWindow").kendoWindow({
					width: "500px",
					title: "编辑语义模型分类",
					actions: [
						"Pin",
						"Minimize",
						"Maximize",
						"Close"
					]
				});
			}else{
				editDirWindow.open();
			}
		}
	});
	$("#editDirButton").kendoButton({
		click:function(e){
			//初始化文本框
			var parentIdBox = $("#parentId").data("kendoMaskedTextBox");
			parentIdBox.enable(false);
			var pk_dirBox = $("#pk_dir").data("kendoMaskedTextBox");
			pk_dirBox.enable(false);
			var dirNameBox = $("#dirName").data("kendoMaskedTextBox");
			var seqnumberBox = $("#seqnumber").data("kendoMaskedTextBox");
			var dirClearButtonBox = $("#dirClearButton").data("kendoButton");
			dirClearButtonBox.enable(false);
			$("#editType")[0].value="update";
			//拿到树节点
			var dirTree = $("#dirTree").data("kendoTreeView");
			var node=dirTree.select();
			var dataItem = dirTree.dataItem(node);
			if(null==dataItem){
				alert("请选择要修改的节点！");
				return;
			}else{
				parentIdBox.value(dataItem.parentId);
				pk_dirBox.value(dataItem.pk_dir);
				dirNameBox.value(dataItem.dirname);
				seqnumberBox.value(dataItem.seqnumber);
			}
			//弹出window
			document.getElementById('editDirWindow').style.display = "";
			var editDirWindow = $("#editDirWindow").data("kendoWindow");
			if (null==editDirWindow) {
				$("#editDirWindow").kendoWindow({
					width: "500px",
					title: "编辑语义模型分类",
					actions: [
						"Pin",
						"Minimize",
						"Maximize",
						"Close"
					]
				});
			}else{
				editDirWindow.open();
			}
		}
	});
	$("#delDirButton").kendoButton({
		click:function(e){
			//拿到树节点
			var dirTree = $("#dirTree").data("kendoTreeView");
			var node=dirTree.select();
			var dataItem = dirTree.dataItem(node);
			if(null==dataItem){
				alert("请选择要修改的节点！");
				return;
			}
			var requestVO={
				pk_dir:dataItem.pk_dir
			}
			//删除ajax请求
			var delUrl=location.protocol + "//" + location.host+"/";
			delUrl += "classes/General/uap/DelQueryEngineDir?token=";
			delUrl += token;
			jQuery.ajax({
				url:delUrl, async : false,type: "POST",
				data: JSON.stringify(requestVO),
				contentType:"application/json; charset=utf-8",
				success: function(response) {
					if(response.code==501){
						alert("语义模型分类删除异常。");
						return;
					}else if(null!=response.data.fail){
						alert(response.data.fail.msgContent);
					}else{
						alert("删除成功。");
						var dirTree = $("#dirTree").data("kendoTreeView");
						pk_dir="";
						dirname="";
						parentId="";
						dirTree.setDataSource(returnTreeDataSource());
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
	$("#designDefButton").kendoButton({
		click:function(e){
			//拿到grid节点
			var defGrid = $("#defGrid").data("kendoGrid");
			var row = defGrid.select();
			if(row.length==0){
				alert("请选择要设计的语义模型数据");
				return;
			}
			var defData = defGrid.dataItem(row);
			var requestVO={
				pk_def:defData.pk_def
			}
			var designUrl=location.protocol + "//" + location.host+"/";
			designUrl += "classes/General/uap/ShowDesignerPage?token=";
			designUrl += token;
			jQuery.ajax({
				url:designUrl, async : false,type: "POST",
				data: JSON.stringify(requestVO),
				contentType:"application/json; charset=utf-8",
				success: function(response) {
					if(response.code==501){
						alert("初始化设计页面失败！");
						return;
					}else if(null!=response.data.fail){
						alert(response.data.fail.msgContent);
						return;
					}else{
						//跳转至设计页面，只需要uuid，pkdef已经放入缓存
						var uuid=response.data.success.uuid;
						//window.open("smartModelProviderPage.html?token="+token+"&uuid="+uuid);
						//debugger;
						cb.route.loadTabViewPart(cb.cache.get("PortalViewModel"), "apps/common/smart/smartModelProviderPage.html?token="+token+"&uuid="+uuid, {title:"语义模型设计向导",isNeedToken:false});
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
	$("#addDefButton").kendoButton({
		click:function(e){
			//初始化文本框
			var pk_defBox = $("#pk_def").data("kendoMaskedTextBox");
			pk_defBox.enable(false);
			var sspk_dirBox = $("#sspk_dir").data("kendoMaskedTextBox");
			sspk_dirBox.enable(false);
			var defcodeBox = $("#defcode").data("kendoMaskedTextBox");
			defcodeBox.value("");
			var defnameBox = $("#defname").data("kendoMaskedTextBox");
			defnameBox.value("");
			$("#defEditType")[0].value="save";
			
			//拿到树节点
			var dirTree = $("#dirTree").data("kendoTreeView");
			var node=dirTree.select();
			var dataItem = dirTree.dataItem(node);
			if(null==dataItem){
				alert("请选择语义模型分类节点！");
			}else{
				sspk_dirBox.value(dataItem.pk_dir);
			}
			//弹出window
			document.getElementById('editDefWindow').style.display = "";
			var editDefWindow = $("#editDefWindow").data("kendoWindow");
			if (null==editDefWindow) {
				$("#editDefWindow").kendoWindow({
					width: "500px",
					title: "编辑语义模型",
					actions: [
						"Pin",
						"Minimize",
						"Maximize",
						"Close"
					]
				});
			}else{
				editDefWindow.open();
			}
		}
	});
	$("#editDefButton").kendoButton({
		click:function(e){
			//初始化文本框
			var pk_defBox = $("#pk_def").data("kendoMaskedTextBox");
			pk_defBox.enable(false);
			var sspk_dirBox = $("#sspk_dir").data("kendoMaskedTextBox");
			sspk_dirBox.enable(false);
			var defcodeBox = $("#defcode").data("kendoMaskedTextBox");
			var defnameBox = $("#defname").data("kendoMaskedTextBox");
			$("#defEditType")[0].value="update";
			//拿到grid节点
			var defGrid = $("#defGrid").data("kendoGrid");
			var row = defGrid.select();
			if(row.length==0){
				alert("请选择要编辑的语义模型数据");
				return;
			}
			var defData = defGrid.dataItem(row);
			pk_defBox.value(defData.pk_def);
			sspk_dirBox.value(defData.pk_dir);
			defcodeBox.value(defData.defcode);
			defnameBox.value(defData.defname);
			//弹出window
			document.getElementById('editDefWindow').style.display = "";
			var editDefWindow = $("#editDefWindow").data("kendoWindow");
			if (null==editDefWindow) {
				$("#editDefWindow").kendoWindow({
					width: "500px",
					title: "编辑语义模型",
					actions: [
						"Pin",
						"Minimize",
						"Maximize",
						"Close"
					]
				});
			}else{
				editDefWindow.open();
			}
		}
	});
	$("#delDefButton").kendoButton({
		click:function(e){
			//拿到grid节点
			var defGrid = $("#defGrid").data("kendoGrid");
			var row = defGrid.select();
			if(row.length==0){
				alert("请选择要编辑的语义模型数据");
				return;
			}
			var defData = defGrid.dataItem(row);
			var requestVO={
				pk_def:defData.pk_def
			}
			//删除ajax请求
			var delUrl=location.protocol + "//" + location.host+"/";
			delUrl += "classes/General/uap/DelQueryEngineDef?token=";
			delUrl += token;
			jQuery.ajax({
				url:delUrl, async : false,type: "POST",
				data: JSON.stringify(requestVO),
				contentType:"application/json; charset=utf-8",
				success: function(response) {
					if(response.code==501){
						alert("语义模型删除异常。");
						return;
					}else if(null!=response.data.fail){
						alert(response.data.fail.msgContent);
					}else{
						alert("删除成功。");
						pk_dir=defData.pk_dir;
						defGrid.setDataSource(returnGridDataSource());
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
	//预览按钮，获取选中的def行，然后调用查询
	$("#viewButton").kendoButton({
		click:function(e){
			var defGrid = $("#defGrid").data("kendoGrid");
			var row = defGrid.select();
			if(row.length==0){
				alert("请选择要预览的语义模型数据");
				return;
			}
			var defData = defGrid.dataItem(row);
			var requestParamMsg={pk_def:defData.pk_def};
			
			//第一次发ajax请求，判断给语义模型有无参数信息，如果有填入参数信息之后再请求预览，否则直接预览
			var params=getParameterMsg(requestParamMsg)
			if(params=="error"){
				return;
			}
			if(null==params){
				//直接请求
				var requestViewMsg={pk_def:defData.pk_def};
				viewModelMsg(requestViewMsg);
			}else{
				//弹出参数填写window
				document.getElementById('paramWindow').style.display = "";
				var paramWindow = $("#paramWindow").data("kendoWindow");
				if (null==paramWindow) {
					initParamInputWindow(params);
					$("#paramWindow").kendoWindow({
						width: "550px",
						height:"350px",
						title: "请录入参数",
						actions: [
							"Pin",
							"Minimize",
							"Maximize",
							"Close"
						]
					});
				}else{
					//重新初始化参数录入页面
					initParamInputWindow(params);
					paramWindow.open();
				}
			}
			
		}
	});
	
	$("#dirTree").kendoTreeView({
		dataSource: returnTreeDataSource(),
		dataTextField: "dirname",
		select: function(e) {
			//选择节点是，更新属性树请求参数
			var dataItem = this.dataItem(e.node);
			pk_dir=dataItem.pk_dir;
			var defGrid = $("#defGrid").data("kendoGrid");
			
			if(null!=defGrid){
				//重新赋值数据源，刷新grid，不用考虑初始化，因为页面加载时已经初始化grid
				defGrid.setDataSource(returnGridDataSource());
			}else{
				initDefGrid();
			}
		},
		expand: function(e) {
			//展开更新请求参数
			var dataItem = this.dataItem(e.node);
			pk_dir=dataItem.pk_dir;
			dirname=dataItem.dirname;
			parentId=dataItem.parentId;	
		}
	});
	
	//语义模型定义目录弹出层
	$("#dirName").kendoMaskedTextBox({
		mask: ""
	});

	$("#seqnumber").kendoMaskedTextBox({
		mask: "00"
	});
	
	$("#pk_dir").kendoMaskedTextBox({
		mask: ""
	});

	$("#parentId").kendoMaskedTextBox({
		mask: ""
	});
	
	$("#dirSaveButton").kendoButton({
		click:function(e){
			var editType=$("#editType")[0].value;
			if(editType=="save"){
				var dirNameBox = $("#dirName").data("kendoMaskedTextBox");
				var parentIdBox = $("#parentId").data("kendoMaskedTextBox");
				var pk_dirBox = $("#pk_dir").data("kendoMaskedTextBox");
				var seqnumberBox = $("#seqnumber").data("kendoMaskedTextBox");
				//保存
				if(dirNameBox.value()==''){
					alert("请填写语义模型分类名称");
				}else{
					var requestVO={
						dirname:dirNameBox.value(),
						pk_parent:parentIdBox.value(),
						seqnumber:seqnumberBox.value()
					}
				
					var saveUrl=location.protocol + "//" + location.host+"/";
					saveUrl += "classes/General/uap/AddQueryEngineDir?token=";
					saveUrl += token;
					jQuery.ajax({
						url:saveUrl, async : false,type: "POST",
						data: JSON.stringify(requestVO),
						contentType:"application/json; charset=utf-8",
						success: function(response) {
							if(response.code==501){
								alert("语义模型分类保存异常。");
								return;
							}else if(response.data.fail!=null){
								alert(response.data.fail.msgContent);
								return;
							}else{
								alert("保存成功。");
								var editDirWindow = $("#editDirWindow").data("kendoWindow");
								editDirWindow.close();
								var dirTree = $("#dirTree").data("kendoTreeView");
								pk_dir="";
								dirname="";
								parentId="";
								dirTree.setDataSource(returnTreeDataSource());
							}
						},
						error: function(e){
							//debugger;
							errobj = e;
							alert(e);
						}
					});
				}
			}else{
				//更新
				var dirNameBox = $("#dirName").data("kendoMaskedTextBox");
				var parentIdBox = $("#parentId").data("kendoMaskedTextBox");
				var pk_dirBox = $("#pk_dir").data("kendoMaskedTextBox");
				var seqnumberBox = $("#seqnumber").data("kendoMaskedTextBox");
				//保存
				if(dirNameBox.value()==''){
					alert("请填写语义模型分类名称");
				}else{
					var requestVO={
						pk_dir:pk_dirBox.value(),
						dirname:dirNameBox.value(),
						pk_parent:parentIdBox.value(),
						seqnumber:seqnumberBox.value()
					}
				
					var updateUrl=location.protocol + "//" + location.host+"/";
					updateUrl += "classes/General/uap/UpdateQueryEngineDir?token=";
					updateUrl += token;
					jQuery.ajax({
						url:updateUrl, async : false,type: "POST",
						data: JSON.stringify(requestVO),
						contentType:"application/json; charset=utf-8",
						success: function(response) {
							if(response.code==501){
								alert("语义模型分类保存异常。");
								return;
							}else if(response.data.fail!=null){
								alert(response.data.fail.msgContent);
								return;
							}else{
								alert("保存成功。");
								var editDirWindow = $("#editDirWindow").data("kendoWindow");
								editDirWindow.close();
								var dirTree = $("#dirTree").data("kendoTreeView");
								pk_dir="";
								dirname="";
								parentId="";
								dirTree.setDataSource(returnTreeDataSource());
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
			
		}
	});
	$("#dirCancleButton").kendoButton({
		click:function(e){
			var editDirWindow = $("#editDirWindow").data("kendoWindow");
			editDirWindow.close();
		}
	});
	
	$("#dirClearButton").kendoButton({
		click:function(e){
			//清除文本框内容，主要用于增加根级节点
			var parentIdBox = $("#parentId").data("kendoMaskedTextBox");
			parentIdBox.value("");
		}
	});
	
	//语义模型定义弹出层
	$("#defcode").kendoMaskedTextBox({
		mask: ""
	});

	$("#defname").kendoMaskedTextBox({
		mask: ""
	});
	
	$("#sspk_dir").kendoMaskedTextBox({
		mask: ""
	});

	$("#pk_def").kendoMaskedTextBox({
		mask: ""
	});
	
	$("#defSaveButton").kendoButton({
		click:function(e){
			var editType=$("#defEditType")[0].value;
			if(editType=="save"){
				var defcodeBox = $("#defcode").data("kendoMaskedTextBox");
				var defnameBox = $("#defname").data("kendoMaskedTextBox");
				var sspk_dirBox = $("#sspk_dir").data("kendoMaskedTextBox");
				var pk_defBox = $("#pk_def").data("kendoMaskedTextBox");
				//保存
				if(defcodeBox.value()==''||defnameBox.value()==''){
					alert("请填写语义模型编码和名称");
				}else if(sspk_dirBox.value()==''){
					alert("所属语义模型定义为空，请检查是选择了左树节点。");
				}else{
					var requestVO={
						defcode:defcodeBox.value(),
						defname:defnameBox.value(),
						pk_dir:sspk_dirBox.value(),
						pk_def:pk_defBox.value()
					}
				
					var saveUrl=location.protocol + "//" + location.host+"/";
					saveUrl += "classes/General/uap/AddQueryEngineDef?token=";
					saveUrl += token;
					jQuery.ajax({
						url:saveUrl, async : false,type: "POST",
						data: JSON.stringify(requestVO),
						contentType:"application/json; charset=utf-8",
						success: function(response) {
							if(response.code==501){
								alert("语义模型保存异常。");
								return;
							}else if(response.data.fail!=null){
								alert(response.data.fail.msgContent);
								return;
							}else{
								alert("保存成功。");
								var editDefWindow = $("#editDefWindow").data("kendoWindow");
								editDefWindow.close();
								//刷新grid
								var defGrid = $("#defGrid").data("kendoGrid");
								pk_dir=sspk_dirBox.value();
								defGrid.setDataSource(returnGridDataSource());
							}
						},
						error: function(e){
							//debugger;
							errobj = e;
							alert(e);
						}
					});
				}
			}else{
				//更新
				var defcodeBox = $("#defcode").data("kendoMaskedTextBox");
				var defnameBox = $("#defname").data("kendoMaskedTextBox");
				var sspk_dirBox = $("#sspk_dir").data("kendoMaskedTextBox");
				var pk_defBox = $("#pk_def").data("kendoMaskedTextBox");
				//保存
				if(defcodeBox.value()==''||defnameBox.value()==''){
					alert("请填写语义模型编码和名称");
				}else if(sspk_dirBox.value()==''){
					alert("所属语义模型定义为空，请检查是选择了左树节点。");
				}else{
					var requestVO={
						defcode:defcodeBox.value(),
						defname:defnameBox.value(),
						pk_dir:sspk_dirBox.value(),
						pk_def:pk_defBox.value()
					}
				
					var updateUrl=location.protocol + "//" + location.host+"/";
					updateUrl += "classes/General/uap/UpdateQueryEngineDef?token=";
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
							}else{
								alert("保存成功。");
								var editDefWindow = $("#editDefWindow").data("kendoWindow");
								editDefWindow.close();
								//刷新grid
								var defGrid = $("#defGrid").data("kendoGrid");
								pk_dir=sspk_dirBox.value();
								defGrid.setDataSource(returnGridDataSource());
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
			
		}
	});
	$("#defCancleButton").kendoButton({
		click:function(e){
			var editDefWindow = $("#editDefWindow").data("kendoWindow");
			editDefWindow.close();
		}
	});
});

function getParameterMsg(requestParamMsg){
	//发ajax请求。保存元数据作为metaProvider，并初始化语义模型
	var params;
	var viewUrl=location.protocol + "//" + location.host+"/";
	viewUrl += "classes/General/uap/GetModelParameters?token=";
	viewUrl += token;
	jQuery.ajax({
		url:viewUrl, async : false,type: "POST",
		data: JSON.stringify(requestParamMsg),
		contentType:"application/json; charset=utf-8",
		success: function(response) {
			if(response.code==501||response.code==250){
				alert("获取语义模型参数异常。");
				return;
			}else if(response.data.fail!=null){
				alert(response.data.fail.msgContent);
				return;
			}
			params=response.data.success;
		},
		error: function(e){
			//debugger;
			errobj = e;
			alert(e);
		}
	});
	return params;
}

//预览语义模型信息
function viewModelMsg(requestViewMsg){

	//发ajax请求。保存元数据作为metaProvider，并初始化语义模型
	var viewUrl=location.protocol + "//" + location.host+"/";
	viewUrl += "classes/General/uap/ViewData?token=";
	viewUrl += token;
	jQuery.ajax({
		url:viewUrl, async : false,type: "POST",
		data: JSON.stringify(requestViewMsg),
		contentType:"application/json; charset=utf-8",
		success: function(response) {
			if(response.code==501){
				alert("语义模型预览异常。");
				return "error";
			}else if(response.data.fail!=null){
				alert(response.data.fail.msgContent);
				return "error";
			}
			var returnJstr=response.data.success;
			jstr=returnJstr[0].replace(/'/g, '"');
			jColumnstr=returnJstr[1].replace(/'/g, '"');
			//var jstr='[{ "name": "cxh", "sex": "man" },{ "name": "cxh", "sex": "man" }]';
			var jobj = JSON.parse(jstr);
			var jColumnobj = JSON.parse(jColumnstr);
			var cloumnSize=jColumnobj.length;
			document.getElementById('viewGrid').style.width = cloumnSize*150 + 'px';
			var viewGrid = $("#viewGrid").data("kendoGrid");
			if(null!=viewGrid){
				
				viewGrid.setOptions({
				  columns:jColumnobj
				});
				initViewGrid(jobj);
			}else{
				initViewGrid(jobj);
			}
			
			//弹出window
			var window = $("#window")
			if (!window.data("kendoWindow")) {
				window.kendoWindow({
					width: "1000px",
					height:"600",
					title: "预览数据",
					actions: [
						"Pin",
						"Minimize",
						"Maximize",
						"Close"
					]
				});
			}else{
				window.data("kendoWindow").open();
			}
			
		},
		error: function(e){
			//debugger;
			errobj = e;
			alert(e);
		}
	});
}

function initParamInputWindow(params){
	var pmInputGrid = $("#pmInputGrid").data("kendoGrid");
	if(null==pmInputGrid){
		$("#pmInputGrid").kendoGrid({
			dataSource: new kendo.data.DataSource({
				data:params
			}),
			height: 250,
			sortable: true,
			selectable: "multiple",
			columns: [{
				field: "name",
				title: "名称"
			}, {
				field: "code",
				title: "编码"
			}, {
				field: "required",
				title: "必填否"
			}, {
				field: "value",
				title: "值"
			}],
			editable: true,
		});
	}else{
		var ds=new kendo.data.DataSource({
				data:params
			});
		pmInputGrid.setDataSource(ds);
	}
	//初始化按钮
	$("#pmInputSaveButton").kendoButton({
		click:function(e){
			//构建请求参数
			var defGrid = $("#defGrid").data("kendoGrid");
			var row = defGrid.select();
			if(row.length==0){
				alert("请选择要预览的语义模型数据");
				return;
			}
			var defData = defGrid.dataItem(row);
			
			var pmInputGrid = $("#pmInputGrid").data("kendoGrid");
			var gridData=pmInputGrid.dataSource.data();
			var ps=[];
			for(var i=0;i<gridData.length;i++){
				//验证必填
				if(gridData[i].required=="是"){
					if(gridData[i].value==null||gridData[i].value==""){
						alert(gridData[i].name+":是必填参数!");
						return;
					}
				}
				var p={
					name:gridData[i].name,
					code:gridData[i].code,
					value:gridData[i].value
				};
				ps.push(p);
			}
			var requestViewMsg={
				pk_def:defData.pk_def,
				ps:ps
			}
			viewModelMsg(requestViewMsg);
			//关闭本窗口
			var paramWindow = $("#paramWindow").data("kendoWindow");
			paramWindow.close();
		}
	});
	$("#pmInputCancleButton").kendoButton({
		click:function(e){
			var paramWindow = $("#paramWindow").data("kendoWindow");
			paramWindow.close();
		}
	});
}
