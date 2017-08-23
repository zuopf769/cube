<html>
<head>
    <meta charset="utf-8">
    <title><%=application.view.title%></title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" />
    <link href="./bootstrap/css/bootstrap.css" rel="Stylesheet" type="text/css" />
	<link href="./kendoui/commercial/styles/kendo.common-bootstrap.min.css" rel="Stylesheet" type="text/css" />
    <link href="./kendoui/commercial/styles/kendo.bootstrap.min.css" rel="Stylesheet" type="text/css" />
    <link href="./pc/css/MessageBox.css" rel="Stylesheet" type="text/css" />
    <link href="./pc/css/Cube.Form.css" rel="stylesheet" />
    <link href="./pc/css/Cube.Control.css" rel="stylesheet" />
    <link href="./pc/css/Cube.Tab.css" rel="stylesheet" />
    <link href="./pc/css/Cube.ToolBar.css" rel="stylesheet" />
    <link href="./pc/css/Cube.Icon.css" rel="stylesheet" />
    <%=application.view.linkbuilder%>
</head>
<body>
	<div id="<%=application.view.name%>" class="container" data-title="<%=application.view.title%>" data-page="<%=application.view.appId%>" data-viewmodel="<%=application.moduleName%>_<%=application.view.viewModel%>">
        <div class="ui-head-content row">
            <div class="col-lg-8" data-propertyname="queryScheme" data-controltype="TabContent">
                <div class="cube-bar-open-container"></div>
                <div class="cube-bar-close-container"></div>
            </div>
            <div class="col-lg-1" data-propertyname="addschemeAction" data-controltype="ImageButton">
                <span class="add-icon"></span>
                <span></span>
            </div>
			<div class="col-lg-1 p-t-20" data-propertyname="setschemeAction" data-controltype="ImageButton">
                <span class="set-icon"></span>
                <span></span>
            </div>                         
            <div class="col-lg-2" data-propertyname="expandAction" data-controltype="ImageButton">
                <span>展开查询条件</span>
                <span class="oc-open-icon"></span>
            </div>
        </div>
        <div class="ui-query-content row" style="display:none;"></div>
        <div class="ui-form-content row">
            <div data-propertyname="leftToolbar" data-controltype="ToolBar" class="col-lg-8 cube-bar-modeltxt">
                 <div class="cube-bar-open-container">
				 <%for(var i=0,len=application.view.containers.length;i<len;i++){%>
                    <%var container = application.view.containers[i];%>
                    <%if(container.type=="Toolbar"){%>
                        <%for(var j=0,len1=container.controls.length;j<len1;j++){%>
                            <%var control = container.controls[j];%>
                            <%if(control.position!="right"){%>
                                <li><%include(application.view.screenSize,control);%></li>
                            <%}%>
                        <%}%>
                    <%}%>
                <%}%>
				</div>
				<div class="cube-bar-close-container"></div>
            </div>
            <div data-propertyname="rightToolbar" data-controltype="ToolBar" class="col-lg-4 cube-bar-modelicon">
                <div class="cube-bar-open-container">
				<%for(var i=0,len=application.view.containers.length;i<len;i++){%>
                    <%var container = application.view.containers[i];%>
                    <%if(container.type=="Toolbar"){%>
                        <%for(var j=0,len1=container.controls.length;j<len1;j++){%>
                            <%var control = container.controls[j];%>
                            <%if(control.position=="right"){%>
                                <li><%include(application.view.screenSize,control);%></li>
                            <%}%>
                        <%}%>
                    <%}%>
                <%}%>
				</div>
				<div class="cube-bar-close-container"></div>
            </div>
            <%for(var i=0,len=application.view.containers.length;i<len;i++){%>
                <%var container = application.view.containers[i];%>
                <%if(container.type=="Grid"){%>
                    <%for(var j=0,len1=container.controls.length;j<len1;j++){%>
                        <%var control = container.controls[j];%>
                            <%include(application.view.screenSize,control);%>
                    <%}%>
                <%}%>
            <%}%>
			<div class="col-lg-12" style="text-align: center; font-weight: 400; font-size: 20px; font-family: '', '', '应用字体'; " id="showTotalFocus"></div>
        </div>
    </div>
    <script src="./jquery/jquery-1.11.1.js" type="text/javascript"></script>
    <script src="./jquery/jquery-ui.js" type="text/javascript"></script>
    <script src="./common/js/Animation.js" type="text/javascript"></script>
    <script src="./common/js/Cube.js" type="text/javascript"></script>
	<script src="./common/js/Control.js" type="text/javascript"></script>
    <script data-config="MessageBox"></script>
    <script src="./pc/js/cube.pc.js" type="text/javascript"></script>
    <script src="./common/js/Cube.bindings.js" type="text/javascript"></script>
    <script src="./common/js/Button.js" type="text/javascript"></script>
    <script src="./common/js/ImageButton.js" type="text/javascript"></script>
    <script src="./common/js/ToolBar.js" type="text/javascript"></script>
    <script src="./pc/js/TabContent.js" type="text/javascript"></script>
    <script src="./common/js/TimeLine.js" type="text/javascript"></script>
    <script src="./common/js/CommonProxy.js" type="text/javascript"></script>
    <script src="./common/js/CommonCRUD.js" type="text/javascript"></script>
	<%=application.view.scriptbuilder%>
    <script type="text/javascript">
        cb.viewbinding.create("<%=application.view.name%>");
    </script>
</body>
</html>