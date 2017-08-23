<%@ page language="java" contentType="text/html; charset=GBK"
    pageEncoding="GBK"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<%
String basePath = request.getContextPath();
%>
<meta http-equiv="Content-Type" content="text/html; charset=GBK">
<title>编辑模板</title>

<script src="<%=basePath%>/vm/jqueryui/js/jquery-1.10.2.js"></script>
<script src="<%=basePath%>/vm/jqueryui/js/jquery-ui-1.10.4.js"></script>
<link href="<%=basePath%>/vm/jqueryui/css/ui-lightness/jquery-ui-1.10.4.css" rel="stylesheet">

<script src="<%=basePath%>/vm/vm.js"></script>
<link href="<%=basePath%>/vm/vm.css" rel="stylesheet">

<script type="text/javascript">
var baseUrl = '<%=request.getContextPath()%>';
var token = '<%=request.getParameter("token")%>';
var app = '<%=request.getParameter("app")%>';

var datas = null;
var moduleName = null;
var className = null;

function initVmListPage(){
	var actions = [
	{checked: true ,'@name':'qryActionclick','@entity':'Toolbar','@field':'qryAction','@eventName':'click','@functionName':'qryAction','@defaultImpl':'//默认实现'}
	,{checked:true ,'@name':'itemClick','@entity': className+'List','@field': className+'s','@eventName':'click','@functionName':'itemClick','@defaultImpl':'//默认实现'}
	];
	initActions(actions);
	initApps(datas.vmList);
	initView(datas.vmListView,datas.vmList,app);
	
}

function initVmPage(){
	initVmApp(datas.vm);
	initVmActions(datas.vm);
}
function saveVmList(){ //保存列表配置
	var vmList = getVmListFormTab(datas);
	var vmListStr = JsonToString(vmList);
	var urls = baseUrl+'/vmList';
	var vmListView = getVmListViewFormTab(datas,className);
	var vmListViewStr = JsonToString(vmListView);
	saveVM(vmListStr,'listvm',urls,app,vmListViewStr);
}

function saveVm(){ //保存卡片配置
	var vm = getVmFormTab(datas);
	var vmStr = JsonToString(vm);
	var urls = baseUrl+'/vmList';
	saveVM(vmStr,'cardvm',urls,app);
}

function selectAll(obj){
	var tableObj = jQuery('#vmListActions');
	if(obj.checked){
		jQuery('input[name=checkboxvm]',tableObj).each(function(){
			this.checked = true;
		});
	}else{
		jQuery('input[name=checkboxvm]',tableObj).each(function(){
			this.checked = false;
		});
	}
}

jQuery(document).ready(function(){
	var apps = app.split('.');
	moduleName = apps[0];
	className = apps[1];
	datas = queryVm(baseUrl);
	initVmListPage();
	initVmPage();
	jQuery('[name="itemName"]').click(function(){
		showTab(this);
	});
});

</script>
<style type="text/css">

</style>
</head>
<body>
<div>
<center><h3>编辑模板</h3></center>
</div>
<div style="width: 100%;height:auto;border: 0px solid #BBBBBB;padding: 0px;">
	<!-- 页卡 -->
	<div id="tabId" style="width: auto;overflow: auto;">
		<table class="tabHead">
			<tr>
				<td  name="Tab" class="tempcss selectTab" style="">
					<div name="itemName" item="vmList" class="itemName">列表VM</div>
				</td>
				<td name="Tab" class="tempcss " style="">
					<div name="itemName" item="vmListView" class="itemName">列表View</div>
				</td>
				<td  name="Tab" class="tempcss " style="">
					<div name="itemName" item="vm" class="itemName">卡片VM</div>
				</td>
				<td name="Tab"  class="tempcss " style="">
					<div name="itemName" item="vmView" class="itemName">卡片View</div>
				</td>
			</tr>
		</table>
	</div>
	<!-- 模板显示区域 -->
	<div id="tabIframes" style="border: 1px solid #BBBBBB;width: 1000px;height :500px;margin-top: -2px;">
		<div class="vmAreacss " name="vmListArea" showType="areaIframe">
			<div name="applications">
				<input type="button" value="保存" onclick="saveVmList()">
				<div class="titlecss"> 列表页面应用</div>
				<table class="vmTablecss apptrcss" name="application" id="application0">
					<tr class="vmTrcss " style="border: 0;">
						<td class="vmtd t1">名称</td><td class="vmtd t2"><input type="text" name="@name" value=""></td>
						<td class="vmtd t1">标题</td><td class="vmtd t2"><input type="text" name="@title" value=""></td>
						<td class="vmtd t1">模块</td><td class="vmtd t2"><input type="text" name="@moduleName" value=""></td>
						<td class="vmtd t1">模版</td><td class="vmtd t2"><input type="text" name="@tplName" value="vouchers_min.tpl"></td>
					</tr>
				</table>
				
				<br>
				
				<table class="vmTablecss apptrcss" name="application" id="application1">
					<tr class="vmTrcss " style="border: 0;">
						<td class="vmtd t1">标题</td>
						<td class="vmtd t2" >
							<input type="text" name="@title" value="">
						</td>
						<td class="vmtd t1">应用ID</td>
						<td class="vmtd t2" >
							<input type="text" name="@appId" value="">
						</td>
						<td class="vmtd t1">域</td>
						<td class="vmtd t2" >
							<input type="text" name="@domainName" value="">
						</td>
					</tr>
				</table>
				<br>
				<div class="titlecss" >显示字段</div>
				<table class="vmTablecss apptrcss" name="columns" id="columns1">
					<tr class="vmTrcss " style="border: 0;">
						<td class="vmtd t1">左上</td><td class="vmtd t2" id="leftTopid"></td>
						<td class="vmtd t1">右上</td><td class="vmtd t2" id="rightTopid"></td>
					</tr>
					<tr class="vmTrcss " style="border: 0;">
						<td class="vmtd t1">左下</td><td class="vmtd t2" id="leftBottomid"></td>
						<td class="vmtd t1">右下</td><td class="vmtd t2" id="rightBottomid"></td>
					</tr>
					<tr class="vmTrcss " style="border: 0;">
						<td class="vmtd t1">状态字段</td><td class="vmtd t2">
							<select position="status" name="position">
								<option value="0">--请选择--</option>
							</select>
						</td>
					</tr>
				</table>
				
				<div class="titlecss">功能</div>
				<div>
					<table class="vmTablecss" name="actions" id="vmListActions">
						<tr name="head" class="rphead  slick-header-column">
							<td style="width: 50px;"><input type="checkbox" onclick="selectAll(this)" ></td>
							<td style="width: 50px;">序号</td>
							<td style="width: 100px;">功能</td>
							<td style="width: 100px;">实体</td>
							<td style="width: 100px;">作用域</td>
							<td style="width: 50px;">事件</td> 
							<td style="width: 100px;">功能名称</td>
							<td style="width: 100px;">默认实现方法</td>
						</tr>
						<tr class="rpTemplate" name="tmplate">
							<td>
								<div class="checkboxcss">
									<input type="checkbox" name="checkboxvm" value="">
									<input type="hidden" name="pk" value="">
								</div>
							</td>
							<td><div name="no" class="rpno">1</div></td>
							<td><input type="text" name="@name" value=""></td>
							<td><input type="text" name="@entity" value=""></td>
							<td><input type="text" name="@field" value=""></td>
							<td><input type="text" name="@eventName" value=""></td>
							<td><input type="text" name="@functionName" value=""></td>
							<td><input type="text" name="@defaultImpl" value=""></td>
						</tr>
					</table>
				</div>
				
			</div>
		</div>
		<div class="vmAreacss templateHide" name="vmListViewArea" showType="areaIframe">vm2</div>
		<div class="vmAreacss templateHide" name="vmArea" showType="areaIframe">
			<div name="applications">
				<input type="button" value="保存" onclick="saveVm()">
				<div class="titlecss">卡片页面应用</div>
				<table class="vmTablecss apptrcss" name="application" id="application2">
					<tr class="vmTrcss " style="border: 0;">
						<td class="vmtd t1">名称</td><td class="vmtd t2"><input type="text" name="@name" value=""></td>
						<td class="vmtd t1">标题</td><td class="vmtd t2"><input type="text" name="@title" value=""></td>
						<td class="vmtd t1">模块</td><td class="vmtd t2"><input type="text" name="@moduleName" value=""></td>
						<td class="vmtd t1">模版</td><td class="vmtd t2"><input type="text" name="@tplName" value="voucher_min.tpl"></td>
					</tr>
				</table>
				
				<div class="titlecss">工具条</div>
				<div>
					<table class="vmTablecss" name="actions" id="vmActions">
						<tr name="head" class="rphead  slick-header-column">
							<td style="width: 50px;"><input type="checkbox" ></td>
							<td style="width: 50px;">序号</td>
							<td style="width: 100px;">编码</td>
							<td style="width: 100px;">功能</td>
							<td style="width: 100px;">模块类型</td>
							<td style="width: 100px;">控件类型</td> 
							<td style="width: 100px;">动作</td>
						</tr>
						<tr class="rpTemplate" name="tmplate">
							<td>
								<div class="checkboxcss">
									<input type="checkbox" name="checkboxvm" value="">
									<input type="hidden" name="pk" value="">
								</div>
							</td>
							<td><div name="no" class="rpno">1</div></td>
							<td><input type="text" name="@name" value=""></td>
							<td><input type="text" name="@title" value=""></td>
							<td><input type="text" name="@modelType" value=""></td>
							<td><input type="text" name="@ctrlType" value=""></td>
							<td><input type="text" name="@powerAction" value=""></td>
						</tr>
					</table>
				</div>
				
			</div>
		</div>
		<div class="vmAreacss templateHide" name="vmViewArea" showType="areaIframe"></div>
	</div>
</div>
</body>
</html>