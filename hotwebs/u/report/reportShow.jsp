<%@ page language="java" contentType="text/html; charset=GBK"
    pageEncoding="GBK"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<%
String basePath = request.getContextPath();
String title = request.getParameter("title");
if(title!=null){
	title=java.net.URLDecoder.decode(title,"UTF-8");
}else{
	title="";
}
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
var pk = '<%=request.getParameter("pk")%>';
var title = '<%=title%>';
var ReportUrl = location.protocol + "//" + location.host+"/";

var reportDetailUrls = null;

//查询报表链接信息
function queryUrl(){
	var dataStr = '{ "token" : "'+token+'" ,"pk" :"'+pk+'"}';
	var urls = ReportUrl+'classes/Report/UAP/IReportUrlService?token='+token;
	jQuery.ajax({  
	   	url: urls, async : false,type: "POST",
		contentType: "application/json; charset=utf-8",
	   	data : dataStr,
	   	success: function(response) {
	   		reportDetailUrls = response.data.success;
	   	},
	   	error: function(e){ //alert(e);
	   		location.href = "/u/";
	   	}
	});
	return reportDetailUrls;
}

//显示报表页卡项
function showReport(){
	var tabHeadObj = jQuery('#tabId');
	var templateObj = jQuery('[name="template"]',tabHeadObj);
	if(reportDetailUrls!=null&&reportDetailUrls.length>0){
		for(var i = 0 ; i < reportDetailUrls.length ; i++){
			var url = reportDetailUrls[i];
			var tdObj = templateObj.clone();
			templateObj.before(tdObj);
			var itemObj = jQuery('[name="itemName"]',tdObj);
			var item = "item"+i;
			jQuery(itemObj).attr("item",item);
			jQuery(itemObj).attr("url",url[0]);
			jQuery(itemObj).html(url[1]);
			jQuery(tdObj).attr("class","tempcss");
			jQuery(tdObj).attr("title",url[1]);
			jQuery(tdObj).attr("name","Tab");
			if(i==0){
				showTab(itemObj,true);
			}
		}
	}
}

//显示报表区域
function showTab(obj,isFresh){
	var url = jQuery(obj).attr("url");
	var item = jQuery(obj).attr("item");
	var tabShowAreaObj = jQuery("#tabIframes");
	var itemObj = jQuery("#"+item,tabShowAreaObj);
	jQuery('[showType="areaIframe"]').attr("class","templateHide");
	var iframeObj = null;
	if(itemObj.length==0||isFresh==true){
		var iframeTemplateObj = jQuery('[name="template"]',tabShowAreaObj);
		iframeObj = iframeTemplateObj.clone();
		iframeTemplateObj.before(iframeObj);
		iframeObj.attr("class","showIframe");
		iframeObj.attr("name",item);
		iframeObj.attr("id",item);
		iframeObj.attr("src",url);
	}
	
	var iftabObj = jQuery(window.frames[item].document).find("iframe");
	var lineObj = jQuery(iftabObj).contents().find("[name=flowv]").children()[0];
	jQuery(lineObj).css("background-color","#FFFFFF");
	
	jQuery('#'+item).attr("class","showIframe");
	jQuery('[name="Tab"]').removeClass("selectTab")
	jQuery(obj).parent().addClass("selectTab");
	setIframeSize();
}

function setIframeSize(){
	var ifo = jQuery(".showIframe")[0] ;
	var bgTop=window.pageYOffset   || document.documentElement.scrollTop  || document.body.scrollTop || 0;  
	var bgHeight=document.documentElement.clientHeight  || document.body.clientHeight || 0; 
    var top = getAbsPoint(ifo).y;
	
	ifo.height = bgTop+bgHeight-top<500?500:bgTop+bgHeight-top-5;
}
 
/**
 * 取得html元素的距离浏览器绝对位置（不包含滚动条的长度）
 * @param e
 * @returns {___anonymous1333_1348}
 */
function getAbsPoint(e){
	  var x = e.offsetLeft;
	  var y = e.offsetTop;
	  while(e = e.offsetParent){
		x += e.offsetLeft-e.scrollLeft;
	    y += e.offsetTop-e.scrollTop;
	  }
	  return {"x": x, "y": y};
}

window.onresize = function(){
	setIframeSize();
}

//初始化页面
function initPage(){
	if(token==null||token=='null'||token==''){
		location.href = "/u/";
	}
	queryUrl();
	showReport();
	if(title!=null&&title!=''&&title!='null'){
		jQuery('#titleID').html(title);
	}
}

jQuery(document).ready(function(){
	initPage();
	jQuery('[name="itemName"]').click(function(){
		var item = jQuery(this).attr("item");
		showTab(this,false);
	});
});
</script>
<style type="text/css">
.tempcss{border: 1px solid #BBBBBB;border-bottom:0;
min-width:100px;max-width:200px;width: auto;height: 26px;
cursor: pointer;text-align: center; }
.tabHead{margin-left: 1px;}
.itemName{padding-left: 3px;padding-right: 3px;
text-overflow:ellipsis;white-space:nowrap; 
}
.templateHide{display: none;}
.selectTab{background-color: #eff0f0 ;}
.showIframe{width: 100%;border-top:0px solid #BBBBBB;border:0px solid #BBBBBB;}
</style>
</head>
<body>
<div>
<center><h3 id="titleID">自由报表</h3></center>
</div>
<div style="width: 100%;height:auto;border: 0px solid #BBBBBB;padding: 2px;">
	<!-- 页卡 -->
	<div id="tabId" style="width: auto;overflow: auto;">
		<table class="tabHead">
			<tr>
				<td name="template" class="tempcss templateHide" style="">
					<div name="itemName" item="" class="itemName"></div>
				</td>
			</tr>
		</table>
	</div>
	<!-- 报表显示区域 -->
	<div id="tabIframes" style="border: 1px solid #BBBBBB;">
		<!-- 显示区域模板 -->
		<iframe class="templateHide" showType="areaIframe" name="template" src="" frameborder="0" width="100%"
			height="100%"></iframe>
	</div>
</div>

</body>
</html>