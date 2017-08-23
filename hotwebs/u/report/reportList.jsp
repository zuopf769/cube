<%@ page language="java" contentType="text/html; charset=GBK"
    pageEncoding="GBK"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<%
String basePath = request.getContextPath();
%>
<meta http-equiv="Content-Type" content="text/html; charset=GBK">
<title>报表</title>
<script type="text/javascript" src="<%=basePath%>/jquery/jquery-1.11.1.js"></script>
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<link href="<%=basePath%>/bootstrap/css/bootstrap.min.css" rel="stylesheet" />
<link href="<%=basePath%>/pc/css/panel.css" rel="stylesheet" />
<link href="<%=basePath%>/pc/css/panel-responsive.css" rel="stylesheet" />
<link href="<%=basePath%>/pc/css/layout.css" rel="Stylesheet" />
<link href="<%=basePath%>/pc/css/NumberBox.css" rel="Stylesheet" />
<link href="<%=basePath%>/pc/css/ToolBar.css" rel="Stylesheet" />
<link href="<%=basePath%>/pc/css/SlickGridSource.css" rel="stylesheet" type="text/css"/>

<script type="text/javascript">
var baseUrl = '<%=request.getContextPath()%>';
var token = '<%=request.getParameter("token")%>';
var ReportUrl = location.protocol + "//" + location.host+"/";
var detailUrl = 'reportShow.jsp';

function queryReportList(){
	var dataStr = '{ "token" : "'+token+'" }';
	var datas = [];
	var urls = ReportUrl+'classes/Report/UAP/IReportMenuService?token='+token;
	jQuery.ajax({  
	   	url: urls, async : false,type: "POST",
		contentType: "application/json; charset=utf-8",
	   	data : dataStr,
	   	success: function(response) {
	   		if (!response.data) {
				alert(response.error);
				return;
			}
			datas = response.data.success;
	   	},
	   	error: function(e){
			alert(e.status + ":" + e.statusText);
		}
	});
	return datas;
}

function query(){
	var datas = null;
	datas = queryReportList();
	if(datas!=null){
		loadDatas(datas);
	}
}
function clear(){
	var tableObj =jQuery("#rpId");
	var trs = jQuery("tr[name*='tr']",tableObj);
	trs.remove();
}

function loadDatas(datas){
	if(datas ==null){return ;}
	var htmls = '';
	var tableObj =jQuery("#rpId");
	var templateTr = jQuery("tr[name='tmplate']",tableObj);
	clear();
	var trs = jQuery("tr[name*='tr']",tableObj);
	var num = trs.length+1;
	for(var i = 0 ; i < datas.length ; i++){
		var data = datas[i];
		var trObj = templateTr.clone();
		templateTr.before(trObj);
		trObj.attr("name","tr"+num);
		jQuery('[name="no"]',trObj).html(num);
		jQuery('[name="pk"]',trObj).val(data.pk_funnode);
		jQuery('[name="nodeCode"]',trObj).html(data.pk_funnode);
		var aObj = jQuery('[name="title"]',trObj);
		aObj.html(data.title);
		var rqTitle = encodeURI(encodeURI(data.title));
		var href = detailUrl +'?token='+token+'&pk='+data.pk_funnode+'&title='+rqTitle+'&size=L';
		aObj.attr("href",href);
		jQuery('[name="group"]',trObj).html(data.group);
		jQuery('[name="rpDesc"]',trObj).html(data.rpDesc);
		trObj.attr("class","");
		num++;
	}
}

function queryUrl(obj){
	var trObj = jQuery(obj).parents("tr")[0];
	var pkObj = jQuery("[name='pk']",trObj);
	var pk = pkObj.val();
	var dataStr = '{ "token" : "'+token+'" ,"pk" :"'+pk+'"}';
	var url = detailUrl+'?token='+token+'&pk='+pk+'&size=L';
	location.href = url;
}

function initPage(){
	if(token==null||token=='null'||token==''){
		location.href = baseUrl;
	}
	query();
	
}

jQuery(document).ready(function(){
	initPage();
});
</script>
<style type="text/css">
.rpTable{width: 600px;height: auto;border: 1px solid #BBBBBB;border-collapse:collapse;}
.rpTable tr{height: 24px;width:auto;border: 1px solid #BBBBBB;}
.rpTable tr td{width: 50px;height: auto;border: 1px solid #BBBBBB;}
.rphead{text-align: center;font-weight: bold;font-family: "Helvetica Neue",Helvetica,Arial,sans-serif; }
.rpno{text-align: center;}
.rpText{padding-left:3px; }
.rpTemplate{display: none;}
.areport{cursor: pointer;}
</style>
</head>
<body>
<div>
<center><h3>自由报表列表</h3></center>
</div>


<div style="width: 100%;height:400px;border: 0px solid #BBBBBB;">
<table style="width: 100%;">
<tr>
<td width="50%"></td>
<td>
	<!-- 列表区域 -->
	<table id="rpId" class="rpTable">
		<!-- 表头区域  -->
		<tr name="head" class="rphead  slick-header-column">
			<td style="width: 50px;">序号</td>
			<td style="width: 100px;">功能编码</td>
			<td style="width: 100px;">功能名称</td>
			<td style="width: 100px;">所属组织</td>
			<td style="width: auto;">描述</td> 
		</tr>
		<!-- 表体模板 -->
		<tr name="tmplate" class="rpTemplate">
			<td><div name="no" class="rpno">1</div><input type="hidden" name="pk" nodeCode="111101A4" value=""></td>
			<td><div name="nodeCode" class="rpText">111101A4</div></td>
			<td><div class="rpText"><a class="areport" name="title" rowType="reportDetail"></a></div></td>
			<td><div name="group" class="rpText"></div></td>
			<td><div name="rpDesc" class="rpText"></div></td>
		</tr>
	</table>
</td>
<td width="50%"></td>
</tr>
</table>

</div>
</body>
</html>