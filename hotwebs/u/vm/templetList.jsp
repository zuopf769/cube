<%@ page language="java" contentType="text/html; charset=GBK"
    pageEncoding="GBK"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<%
String basePath = request.getContextPath();
%>
<meta http-equiv="Content-Type" content="text/html; charset=GBK">
<title>����ģ���б�</title>

<script src="<%=basePath%>/vm/jqueryui/js/jquery-1.10.2.js"></script>
<script src="<%=basePath%>/vm/jqueryui/js/jquery-ui-1.10.4.js"></script>
<link href="<%=basePath%>/vm/jqueryui/css/ui-lightness/jquery-ui-1.10.4.css" rel="stylesheet">

<link href="<%=basePath%>/bootstrap/css/bootstrap.min.css" rel="stylesheet" />
<link href="<%=basePath%>/pc/css/SlickGridSource.css" rel="stylesheet" type="text/css"/>

<script type="text/javascript">
var baseUrl = '<%=request.getContextPath()%>';
var token = '<%=request.getParameter("token")%>';
var ReportUrl = location.protocol + "//" + location.host+"/";
var detailUrl = 'reportShow.jsp';

function queryReportList(){
	var selectObj = jQuery('#modelselectId');
	var value = selectObj.val();
	var metadataclass = jQuery("#metadataclassId").val();
	var modulecode = null;
	if(value!=null&&value!='0'){
		modulecode = value;
	}
	var datas = [];
	var urls = baseUrl+'/vmList';
	//urls +="?opt=queryBillTempleList"
	jQuery.ajax({  
	   	url: urls, async : false,type: "POST",
		//contentType: "application/json; charset=utf-8",
	   	data : {opt : "queryBillTempleList",metadataclass:metadataclass,modulecode:modulecode},
	   	success: function(response) {
	   		//alert(response);
	   		if(response!=null&&response!=''){
	   			datas = eval("("+response+")");
	   		}
	   	},
	   	error: function(e){
			alert(e);
		}
	});
	return datas;
}
function loadModuleCode(){
	var urls = baseUrl+'/vmList';
	var datas = [];
	jQuery.ajax({  
	   	url: urls, async : false,type: "POST",
		//contentType: "application/json; charset=utf-8",
	   	data : {opt:"queryModuleCode"},
	   	success: function(response) {
	   		//alert(response);
	   		if(response!=null&&response!=''){
	   			datas = eval("("+response+")");
	   		}
	   	},
	   	error: function(e){
			alert(e);
		}
	});
	var selectObj = jQuery('#modelselectId');
	var selector = selectObj[0];
	//selector.remove(0);
	for(var i = 0 ; i < datas.length ; i++){
		var data = datas[i];
		selector.options.add(new Option(data.modulecode,data.modulecode));
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
		jQuery('[name="pk"]',trObj).val(data.id);
		jQuery('[name="nodeCode"]',trObj).html(data.code);
		jQuery('[name="nodeCode"]',trObj).attr("title",data.code);
		var aObj = jQuery('[name="title"]',trObj);
		aObj.html(data.name);
		aObj.attr("title",data.name);
		//var rqTitle = encodeURI(encodeURI(data.title));
		//var href = detailUrl +'?token='+token+'&pk='+data.pk_funnode+'&title='+rqTitle+'&size=L';
		//aObj.attr("href",href);
		jQuery('[name="metadataclass"]',trObj).html(data.metadataclass);
		jQuery('[name="metadataclass"]',trObj).attr("metadataclass",data.metadataclass);
		jQuery('[name="metadataclass"]',trObj).attr("title",data.metadataclass);
		
		jQuery('[name="billdate"]',trObj).html(data.billdate);
		var liststr = data.listvm=='1'?'������':'<input type="button" onclick="makeWebTemplate(this)" webtype="list" value="����">';
		if(data.listvm=='2'){
			liststr = '��';
		}
		
		var cardstr = data.cardvm=='1'?'������':'<input type="button" onclick="makeWebTemplate(this)" webtype="card" value="����">';
		if(data.cardvm=='2'){
			cardstr = '��';
		}
		
		jQuery('[name="listvm"]',trObj).html(liststr);
		jQuery('[name="listvm"]',trObj).attr("exist",data.listvm);
		jQuery('[name="cardvm"]',trObj).html(cardstr);
		jQuery('[name="cardvm"]',trObj).attr("exist",data.cardvm);
		trObj.attr("class","");
		
		
		num++;
	}
}

function freshwebtemplate(){
	var urls = baseUrl+'/reinit';
	jQuery('#freshiframe').attr('src',urls);
	jQuery('#freshdiv').dialog();
}

/**
 * ˢ��ģ��
 */
function freshweb(){
	var checkboxs = jQuery('input[name=checkboxvm]:checked');
	if(checkboxs.length==0){
		//alert("��ѡ��һ����¼��");
		$( "#dialog" ).html("������ѡ��һ����¼��");
		$( "#dialog" ).dialog();
	}else{
		var successApp = [];
		checkboxs.each(function(){
			var obj = this;
			var trObj = jQuery(obj).parents("tr")[0];
			var metadataclass = jQuery("[name='metadataclass']",trObj);
			var app = metadataclass.attr("metadataclass")+"App";
			var urlapp = baseUrl+"/refresh?app="+ app+"&size=M";
			
			jQuery.ajax({  
				url: urlapp, async : false,type: "GET",data : {},
				success: function(response) {
						if(/^[a-zA-Z0-9.]*Exception/.test(response)==false){
							successApp.push(app);
						}
				},
				error: function(e){alert(e);}
			});
			
			var urlapp = baseUrl+"/refresh?app="+ app+"&size=L";
			
			jQuery.ajax({  
				url: urlapp, async : false,type: "GET",data : {},
				success: function(response) {
						if(/^[a-zA-Z0-9.]*Exception/.test(response)==false){
							//successApp.push(app);
						}
				},
				error: function(e){alert(e);}
			});
			
			var appList = metadataclass.attr("metadataclass")+"ListApp";
			var urlapplist = baseUrl+"/refresh?app="+ appList+"&size=M";
			jQuery.ajax({  
				url: urlapplist, async : false,type: "GET",data : {},
				success: function(response) {
						if(/^[a-zA-Z0-9.]*Exception/.test(response)==false){
							successApp.push(appList);
						}
				},
				error: function(e){alert(e);}
			});
			
			var urlapplist = baseUrl+"/refresh?app="+ appList+"&size=L";
			jQuery.ajax({  
				url: urlapplist, async : false,type: "GET",data : {},
				success: function(response) {
						if(/^[a-zA-Z0-9.]*Exception/.test(response)==false){
							//successApp.push(appList);
						}
				},
				error: function(e){alert(e);}
			});
			
		});
		if(successApp.length>0){
		 var showinfos = "ҳ��"+successApp.join(",")+"ˢ�³ɹ���";
		 	$( "#dialog" ).html(showinfos);
			$( "#dialog" ).dialog();
		}else{
			$( "#dialog" ).html("ҳ��ˢ��ʧ�ܣ�");
			$( "#dialog" ).dialog();
		}
		
	}
}

/**
 * �༭ģ��
 */
function editVM(){
	var checkboxs = jQuery('input[name=checkboxvm]:checked');
	if(checkboxs.length==0){
		//alert("��ѡ��һ����¼��");
		$( "#dialog" ).html("��ѡ��һ����¼��");
		$( "#dialog" ).dialog();
	}else if(checkboxs.length>1){
		$( "#dialog" ).html("ֻ��ѡ��һ����¼��");
		$( "#dialog" ).dialog();
	}else{
		var successApp = [];
		var obj = checkboxs[0];
		var trObj = jQuery(obj).parents("tr")[0];
		var metadataclass = jQuery("[name='metadataclass']",trObj).attr("metadataclass");
		var listExist = jQuery('[name="listvm"]',trObj).attr("exist");
		var cardExist = jQuery('[name="cardvm"]',trObj).attr("exist");
		if(listExist=="1"||cardExist=='1'){
			location.href =baseUrl+ "/vm/webtemplate.jsp?app="+metadataclass;
		}else{
			$( "#dialog" ).html("��������ҳ��ģ�壡");
			$( "#dialog" ).dialog();
		}
		
		
	}
}
			

function query(){
	
	var datas = null;
	datas = queryReportList();
	if(datas!=null){
		loadDatas(datas);
	}
}

function initPage(){
	loadModuleCode();
	query();
	
}

function makeWebTemplate(obj){
	var trObj = jQuery(obj).parents("tr")[0];
	var metadataclass = jQuery("[name='metadataclass']",trObj);
	var webtype = jQuery(obj).attr("webtype");
	var app = null;
	if(webtype=='list'){
		app = metadataclass.attr("metadataclass")+"ListApp";
	}else if(webtype=='card'){
		app = metadataclass.attr("metadataclass")+"App";
	}else{
		return ;
	}
	
	var url = baseUrl + "/transfer2?app="+app+"&screenSize=M"+"&tplName="+"voucher_M"+"&vmTplName="+"voucher_min";
	var htmlobj=$.ajax({url:url,async:false});
	$( "#dialog" ).html(htmlobj.responseText);
	$( "#dialog" ).dialog();
	if(htmlobj.responseText=='ת���ɹ�'){
		jQuery(obj).parent().attr("exist","1");
		jQuery(obj).parent().html("������");
	}
}

function reback(){
	location.href =  baseUrl +"/homePad.html?token="+token+"&size=M";
}

function freshselect(){
	query();
}

jQuery(document).ready(function(){
	initPage();
	
	 jQuery("#metadataclassId").autocomplete({
	    minLength : 0,
	    source : function(request,response){
			//var repos_name = this.bindings[0].value;
			query();
	    }
     });
		 
});
</script>
<style type="text/css">
.rpTable{border: 1px solid #BBBBBB;border-collapse:collapse;}
.rpTable tr{height: 24px;width:auto;border: 1px solid #BBBBBB;}
.rpTable tr td{width: 50px;height: auto;border: 1px solid #BBBBBB;}
.rphead{text-align: center;font-weight: bold;font-family: "Helvetica Neue",Helvetica,Arial,sans-serif; }
.rpno{text-align: center;}
.rpText{padding-left:3px; }
.rpTemplate{display: none;}
.areport{cursor: pointer;}
.itemName{padding-left: 3px;padding-right: 3px;
text-overflow:ellipsis;white-space:nowrap; 
}
.modelcss{width: 200px;height: 30px;}
.checkboxcss{text-align:center;}
.showinfocss{width:100%;height:100%;}
.showlimit{text-overflow:ellipsis; white-space:nowrap; overflow:hidden;}
</style>
</head>
<body>
<div>
<center><h3>����ģ���б�</h3></center>
</div>


<div style="width: 100%;height:400px;border: 0px solid #BBBBBB;">
<table style="width: 100%;">
<tr>
<td width="50%"></td>
<td>
	<!-- ��ѯ���� -->
	<div style="">
		ģ����룺
		<select class="modelcss" id="modelselectId" onchange="freshselect()">
			<option value="0">--��ѡ��--</option>
		</select>
		&nbsp;&nbsp;&nbsp;&nbsp;
		Ԫ�������ͣ�
		<input type="text" value="" id="metadataclassId" name="metadataclass">
		&nbsp;&nbsp;&nbsp;&nbsp;
		<input type="button" value="��ѯ" onclick="query()">
	</div>
	
	<!-- �˵����� -->
	<div style="margin-top:10px">
		<input type="button" value="ˢ��ҳ��" onclick="freshweb()">
		<input type="button" value="ˢ��webģ��" onclick="freshwebtemplate()">
		<input type="button" value="����ģ��ģ��" onclick="">
		<input type="button" value="�༭ģ��ģ��" onclick="editVM()">
		<input type="button" value="����" onclick="reback()">
	</div>
	
	<!-- �б����� -->
	<table id="rpId" class="rpTable" style="width: 800px;height: auto;margin-top: 10px;">
		<!-- ��ͷ����  -->
		<tr name="head" class="rphead  slick-header-column">
			<td style="width: 50px;"><input type="checkbox"></td>
			<td style="width: 50px;">���</td>
			<td style="width: 100px;">ģ�����</td>
			<td style="width: 100px;">ģ������</td>
			<td style="width: 100px;">Ԫ��������</td>
			<td style="width: 100px;">����</td> 
			<td style="width: 100px;">�б�</td>
			<td style="width: 100px;">��Ƭ</td>
		</tr>
		<!-- ����ģ�� -->
		<tr name="tmplate" class="rpTemplate">
			<td>
				<div class="checkboxcss">
					<input type="checkbox" name="checkboxvm" value="">
					<input type="hidden" name="pk" value="">
				</div>
			</td>
			<td><div name="no" class="rpno">1</div></td>
			<td><div name="nodeCode" class="rpText showlimit" style="width:80px;">111101A4</div></td>
			<td><div class="rpText itemName showlimit" style="width:100px;"><a class="areport" name="title" rowType="reportDetail"></a></div></td>
			<td><div name="metadataclass" metadataclass="" class="rpText itemName showlimit" style="width:150px;"></div></td>
			<td><div name="billdate" class="rpText itemName"></div></td>
			<td>
				<div name="listvm" style="text-align: center;">
					
				</div>
			</td>
			<td>
				<div name="cardvm" style="text-align: center;">
					
				</div>
			</td>
		</tr>
	</table>
</td>
<td width="50%"></td>
</tr>
</table>

</div>
<div id="dialog" title="��ʾ��Ϣ">
</div>
<div id="freshdiv" title="��ʾ��Ϣ" style="display:none;">
<iframe id="freshiframe" src="" border=0></iframe>
</div>

</body>
</html>