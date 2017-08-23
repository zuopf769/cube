<%@ page language="java" contentType="text/html; charset=GBK"
    pageEncoding="GBK"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<%
String basePath = request.getContextPath();
%>
<meta http-equiv="Content-Type" content="text/html; charset=GBK">
<title>�༭ģ��</title>

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
	{checked: true ,'@name':'qryActionclick','@entity':'Toolbar','@field':'qryAction','@eventName':'click','@functionName':'qryAction','@defaultImpl':'//Ĭ��ʵ��'}
	,{checked:true ,'@name':'itemClick','@entity': className+'List','@field': className+'s','@eventName':'click','@functionName':'itemClick','@defaultImpl':'//Ĭ��ʵ��'}
	];
	initActions(actions);
	initApps(datas.vmList);
	initView(datas.vmListView,datas.vmList,app);
	
}

function initVmPage(){
	initVmApp(datas.vm);
	initVmActions(datas.vm);
}
function saveVmList(){ //�����б�����
	var vmList = getVmListFormTab(datas);
	var vmListStr = JsonToString(vmList);
	var urls = baseUrl+'/vmList';
	var vmListView = getVmListViewFormTab(datas,className);
	var vmListViewStr = JsonToString(vmListView);
	saveVM(vmListStr,'listvm',urls,app,vmListViewStr);
}

function saveVm(){ //���濨Ƭ����
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
<center><h3>�༭ģ��</h3></center>
</div>
<div style="width: 100%;height:auto;border: 0px solid #BBBBBB;padding: 0px;">
	<!-- ҳ�� -->
	<div id="tabId" style="width: auto;overflow: auto;">
		<table class="tabHead">
			<tr>
				<td  name="Tab" class="tempcss selectTab" style="">
					<div name="itemName" item="vmList" class="itemName">�б�VM</div>
				</td>
				<td name="Tab" class="tempcss " style="">
					<div name="itemName" item="vmListView" class="itemName">�б�View</div>
				</td>
				<td  name="Tab" class="tempcss " style="">
					<div name="itemName" item="vm" class="itemName">��ƬVM</div>
				</td>
				<td name="Tab"  class="tempcss " style="">
					<div name="itemName" item="vmView" class="itemName">��ƬView</div>
				</td>
			</tr>
		</table>
	</div>
	<!-- ģ����ʾ���� -->
	<div id="tabIframes" style="border: 1px solid #BBBBBB;width: 1000px;height :500px;margin-top: -2px;">
		<div class="vmAreacss " name="vmListArea" showType="areaIframe">
			<div name="applications">
				<input type="button" value="����" onclick="saveVmList()">
				<div class="titlecss"> �б�ҳ��Ӧ��</div>
				<table class="vmTablecss apptrcss" name="application" id="application0">
					<tr class="vmTrcss " style="border: 0;">
						<td class="vmtd t1">����</td><td class="vmtd t2"><input type="text" name="@name" value=""></td>
						<td class="vmtd t1">����</td><td class="vmtd t2"><input type="text" name="@title" value=""></td>
						<td class="vmtd t1">ģ��</td><td class="vmtd t2"><input type="text" name="@moduleName" value=""></td>
						<td class="vmtd t1">ģ��</td><td class="vmtd t2"><input type="text" name="@tplName" value="vouchers_min.tpl"></td>
					</tr>
				</table>
				
				<br>
				
				<table class="vmTablecss apptrcss" name="application" id="application1">
					<tr class="vmTrcss " style="border: 0;">
						<td class="vmtd t1">����</td>
						<td class="vmtd t2" >
							<input type="text" name="@title" value="">
						</td>
						<td class="vmtd t1">Ӧ��ID</td>
						<td class="vmtd t2" >
							<input type="text" name="@appId" value="">
						</td>
						<td class="vmtd t1">��</td>
						<td class="vmtd t2" >
							<input type="text" name="@domainName" value="">
						</td>
					</tr>
				</table>
				<br>
				<div class="titlecss" >��ʾ�ֶ�</div>
				<table class="vmTablecss apptrcss" name="columns" id="columns1">
					<tr class="vmTrcss " style="border: 0;">
						<td class="vmtd t1">����</td><td class="vmtd t2" id="leftTopid"></td>
						<td class="vmtd t1">����</td><td class="vmtd t2" id="rightTopid"></td>
					</tr>
					<tr class="vmTrcss " style="border: 0;">
						<td class="vmtd t1">����</td><td class="vmtd t2" id="leftBottomid"></td>
						<td class="vmtd t1">����</td><td class="vmtd t2" id="rightBottomid"></td>
					</tr>
					<tr class="vmTrcss " style="border: 0;">
						<td class="vmtd t1">״̬�ֶ�</td><td class="vmtd t2">
							<select position="status" name="position">
								<option value="0">--��ѡ��--</option>
							</select>
						</td>
					</tr>
				</table>
				
				<div class="titlecss">����</div>
				<div>
					<table class="vmTablecss" name="actions" id="vmListActions">
						<tr name="head" class="rphead  slick-header-column">
							<td style="width: 50px;"><input type="checkbox" onclick="selectAll(this)" ></td>
							<td style="width: 50px;">���</td>
							<td style="width: 100px;">����</td>
							<td style="width: 100px;">ʵ��</td>
							<td style="width: 100px;">������</td>
							<td style="width: 50px;">�¼�</td> 
							<td style="width: 100px;">��������</td>
							<td style="width: 100px;">Ĭ��ʵ�ַ���</td>
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
				<input type="button" value="����" onclick="saveVm()">
				<div class="titlecss">��Ƭҳ��Ӧ��</div>
				<table class="vmTablecss apptrcss" name="application" id="application2">
					<tr class="vmTrcss " style="border: 0;">
						<td class="vmtd t1">����</td><td class="vmtd t2"><input type="text" name="@name" value=""></td>
						<td class="vmtd t1">����</td><td class="vmtd t2"><input type="text" name="@title" value=""></td>
						<td class="vmtd t1">ģ��</td><td class="vmtd t2"><input type="text" name="@moduleName" value=""></td>
						<td class="vmtd t1">ģ��</td><td class="vmtd t2"><input type="text" name="@tplName" value="voucher_min.tpl"></td>
					</tr>
				</table>
				
				<div class="titlecss">������</div>
				<div>
					<table class="vmTablecss" name="actions" id="vmActions">
						<tr name="head" class="rphead  slick-header-column">
							<td style="width: 50px;"><input type="checkbox" ></td>
							<td style="width: 50px;">���</td>
							<td style="width: 100px;">����</td>
							<td style="width: 100px;">����</td>
							<td style="width: 100px;">ģ������</td>
							<td style="width: 100px;">�ؼ�����</td> 
							<td style="width: 100px;">����</td>
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