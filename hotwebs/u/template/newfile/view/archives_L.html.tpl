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
        <%var cacheData={newFields:{},existFields:{}};%>
		<%application.viewDataCache=cacheData;%>

		<%var generateGridInnerFunc = function(container){%>
			<%if(!container.controls||!container.controls.length) return;%>
			<%var gridControl=null;%>
			<%for(var i=0,len=container.controls.length;i<len;i++){%>
				<%var control=container.controls[i];%>
				<%if(control.ctrlType=="DataGrid"){%>
					<%gridControl=control;%>
					<%break;%>
				<%}%>
			<%}%>
			<%include(application.view.screenSize,gridControl);%>
		<%}%>

		<%var generateGridFunc = function(container){%>
			<%var gridCount=0;%>
			<%if(container.containers&&container.containers.length){%>
				<%for(var i=0,len=container.containers.length;i<len;i++){%>
					<%var subContainer=container.containers[i];%>
					<%if(subContainer.type=="Grid"){%>
						<%gridCount++;%>
					<%}%>
				<%}%>
			<%}%>
			<%if(gridCount>1){%>
				<%var tabMenuName="tabMenu";%>
				<%var tabMenuContent={isNeedCollect:false,mode:"strip",dataSource:[]};%>
				<%cacheData.newFields[tabMenuName]=tabMenuContent;%>
				<div class="col-lg-12">
					<div class="navbar-pc-strip" data-propertyname="<%=tabMenuName%>" data-controltype="TabContent">
						<%var tabIndex=0;%>
						<%for(var i=0,len=container.containers.length;i<len;i++){%>
							<%var gridContainer=container.containers[i];%>
							<%if(gridContainer.type!="Grid") continue;%>
							<%tabIndex++;%>
							<li class="ui-text" data-content="<%=gridContainer.name%>"><%=gridContainer.title%></li>
							<%if(tabIndex==1){%>
								<%tabMenuContent.dataSource.push({"content":gridContainer.name,"isSelected":true});%>
							<%}else{%>
								<%tabMenuContent.dataSource.push({"content":gridContainer.name});%>
							<%}%>
						<%}%>
					</div>
				</div>
				<div data-related="<%=tabMenuName%>" class="col-lg-12">
					<%for(var i=0,len=container.containers.length;i<len;i++){%>
						<%var gridContainer=container.containers[i];%>
						<%if(gridContainer.type!="Grid") continue;%>
						<div class="col-lg-12" data-content="<%=gridContainer.name%>">
							<%generateGridInnerFunc(gridContainer);%>
						</div>
					<%}%>
				</div>
			<%}else if(gridCount==1){%>
				<%for(var i=0,len=container.containers.length;i<len;i++){%>
					<%var gridContainer=container.containers[i];%>
					<%if(gridContainer.type!="Grid") continue;%>
					<%generateGridInnerFunc(gridContainer);%>
				<%}%>
			<%}%>
		<%}%>

		<div class="row">
			<%var generateOtherFunc = function(container){%>
				<%for(var i=0,len=container.containers.length;i<len;i++){%>
                    <%var subContainer=container.containers[i];%>
					<%if(subContainer.type!="Grid") continue;%>
                    <%if(subContainer.hasQueryScheme=="true"){%>
						<%cacheData.newFields["queryScheme"]={"mode":"slide","fields":{"valueField":"queryschemeID","textField":"name"}};%>
						<%cacheData.newFields["addschemeAction"]=null;%>
						<%cacheData.newFields["setschemeAction"]=null;%>
						<%cacheData.newFields["expandAction"]=null;%>
						<div class="ui-head-content">
							<div class="col-lg-8" data-propertyname="queryScheme" data-controltype="TabContent">
								<div class="cube-bar-open-container"></div>
								<div class="cube-bar-close-container"></div>
							</div>
							<div class="col-lg-1" data-propertyname="addschemeAction" data-controltype="ImageButton">
								<span class="add-icon"></span>
								<span></span>
							</div>
							<div class="col-lg-1" style="padding-top:18px;" data-propertyname="setschemeAction" data-controltype="ImageButton">
								<span class="set-icon"></span>
								<span></span>
							</div>
							<div class="col-lg-2" data-propertyname="expandAction" data-controltype="ImageButton">
								<span>展开查询条件</span>
								<span class="oc-open-icon"></span>
							</div>
						</div>
						<div class="ui-query-content" style="display:none;"></div>
                    <%}%>
                <%}%>
				<div class="ui-form-content">
					<%for(var i=0,len=container.containers.length;i<len;i++){%>
						<%var subContainer=container.containers[i];%>
						<%if(subContainer.type!="Toolbar") continue;%>
						<%cacheData.newFields["leftToolbar"]=null;%>
						<%cacheData.newFields["rightToolbar"]=null;%>
						<div data-propertyname="leftToolbar" data-controltype="ToolBar" class="col-lg-8 cube-bar-modeltxt">
							<div class="cube-bar-open-container">
							<%for(var i=0,len=container.containers.length;i<len;i++){%>
								<%var subContainer=container.containers[i];%>
								<%if(subContainer.type=="Toolbar"&&subContainer.controls){%>
									<%for(var j=0,len1=subContainer.controls.length;j<len1;j++){%>
										<%var control=subContainer.controls[j];%>
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
							<%for(var i=0,len=container.containers.length;i<len;i++){%>
								<%var subContainer=container.containers[i];%>
								<%if(subContainer.type=="Toolbar"&&subContainer.controls){%>
									<%for(var j=0,len1=subContainer.controls.length;j<len1;j++){%>
									   <% var control=subContainer.controls[j];%>
										<%if(control.position=="right"){%>
											<li><%include(application.view.screenSize,control);%></li>
										<%}%>
									<%}%>
								<%}%>
							<%}%>
							</div>
							<div class="cube-bar-close-container"></div>
						</div>
					<%}%>
					<%generateGridFunc(container);%>
				</div>
			<%}%>

			<%var generateMainFunc = function(){%>
				<%var hasTreeContainer=false,treeControl=null,isCatalog=true;%>
				<%for(var i=0,len=application.view.containers.length;i<len;i++){%>
					<%var container=application.view.containers[i];%>
					<%if(container.type=="Tree"&&container.controls&&container.controls.length){%>
						<%hasTreeContainer=true;%>
						<%treeControl=container.controls[0];%>
						<%if(treeControl.isCatalog=="false"){%>
							<%isCatalog=false;%>
						<%}%>
						<%break;%>
					<%}%>
				<%}%>
				<%if(hasTreeContainer){%>
					<%if(isCatalog){%>
						<div class="archiveList">
							<div class="cube-main-left">
								<%include(application.view.screenSize,treeControl);%>
							</div>
							<div class="cube-main-right">
								<%generateOtherFunc(application.view);%>
							</div>
						</div>
						<div class="archiveDetail"></div>
					<%}else{%>
						<div class="cube-main-left">
							<%include(application.view.screenSize,treeControl);%>
						</div>
						<div class="cube-main-right">
							<div class="archiveList">
								<%generateOtherFunc(application.view);%>
							</div>
							<div class="archiveDetail"></div>
						</div>
					<%}%>
				<%}else{%>
					<div class="col-lg-12">
						<div class="archiveList">
							<%generateOtherFunc(application.view);%>
						</div>
						<div class="archiveDetail"></div>
					</div>
				<%}%>
			<%}%>

			<%generateMainFunc()%>
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
    <script src="./common/js/CommonArchives.js" type="text/javascript"></script>
    <%=application.view.scriptbuilder%>
    <script type="text/javascript">
        cb.viewbinding.create("<%=application.view.name%>");
    </script>
</body>
</html>