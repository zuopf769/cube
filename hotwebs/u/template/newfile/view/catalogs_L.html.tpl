<html>
<head>
    <meta charset="utf-8">
    <title><%=application.view.title%></title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="./bootstrap/css/bootstrap.css" rel="Stylesheet" type="text/css" />
    <link href="./kendoui/commercial/styles/kendo.common-bootstrap.min.css" rel="Stylesheet" type="text/css" />
    <link href="./kendoui/commercial/styles/kendo.bootstrap.min.css" rel="Stylesheet" type="text/css" />
    <link href="./pc/css/MessageBox.css" rel="Stylesheet" type="text/css" />
    <link href="./pc/css/accondion.pc.css" rel="stylesheet" />
    <link href="./pad/css/menu.css" rel="stylesheet" />
    <link href="./pad/css/SearchBox.css" rel="stylesheet" type="text/css" />
    <link href="./pad/css/dropdown.css" rel="stylesheet" type="text/css" />
    <link href="./pc/css/Catalog.pc.css" rel="stylesheet" type="text/css" />
    <link href="./pc/css/Cube.Form.css" rel="stylesheet" />
    <link href="./pc/css/Cube.Control.css" rel="stylesheet" />
    <link href="./pc/css/Cube.Tab.css" rel="stylesheet" />
    <link href="./pc/css/Cube.ToolBar.css" rel="stylesheet" />
    <link href="./pc/css/Cube.Icon.css" rel="stylesheet" />
    <%=application.view.linkbuilder%>
</head>
<body>
	<div id="<%=application.view.name%>" class="container" data-title="<%=application.view.title%>" data-page="<%=application.view.appId%>" data-viewmodel="<%=application.moduleName%>_<%=application.view.viewModel%>">
        <%var newIds={};%>
		<%var cacheData={newFields:{},existFields:{}};%>
		<%application.viewDataCache=cacheData;%>
		<%var getNewIdFunc = function(prefix){%>
			<%var number = (newIds[prefix]||0)+1;%>
			<%newIds[prefix]=number;%>
			<%return prefix+"_"+number;%>
		<%}%>

		<%var generateControlFunc = function(container){%>
			<%if(!container.controls||!container.controls.length) return;%>
			<%for(var i=0,len=container.controls.length;i<len;i++){%>
				<%var control=container.controls[i];%>
				<%if(control.ctrlType=="LoadPage"){%>
					<%cacheData.newFields[control.name]=null;%>
				<%}else if(control.ctrlType=="TextArea"){%>
					<%container.iCols=1;%>
					<%control.rows=control.rows||3;%>
				<%}%>
				<%if(container.iCols==1){%>
					<div class="col-lg-12">
				<%}else if(container.iCols==3){%>
					<div class="col-lg-4">
				<%}else if(container.iCols==4){%>
					<div class="col-lg-3">
				<%}else{%>
					<div class="col-lg-6">
				<%}%>
					<%include(application.view.screenSize,control);%>
				</div>
			<%}%>
		<%}%>

		<%var generateGridFunc = function(container){%>
			<%if(!container.controls) return;%>
			<%var gridControl=null,model3dField=null,hasToolbar=false;%>
			<%for(var i=0,len=container.controls.length;i<len;i++){%>
				<%var control=container.controls[i];%>
				<%if(control.ctrlType=="DataGrid"){%>
					<%gridControl=control;%>
					<%model3DField=control.field;%>
				<%}else{%>
					<%hasToolbar=true;%>
				<%}%>
			<%}%>
			<div class="row">
				<%if(hasToolbar){%>
					<%var leftToolbarName=getNewIdFunc("leftToolbar");%>
					<%cacheData.newFields[leftToolbarName]=null;%>
					<div data-propertyname="<%=leftToolbarName%>" data-controltype="ToolBar" class="col-lg-10 cube-bar-modeltxt">
						<div class="cube-bar-open-container">
							<%for(var i=0,len=container.controls.length;i<len;i++){%>
								<%var control=container.controls[i];%>
								<%if(control.ctrlType!="DataGrid"&&control.position!="right"){%>
									<li><%include(application.view.screenSize,control);%></li>
									<%cacheData.existFields[control.field]={refModel3DField:model3DField};%>
								<%}%>
							<%}%>
						</div>
						<div class="cube-bar-close-container"></div>
					</div>
					<%var rightToolbarName=getNewIdFunc("rightToolbar");%>
					<%cacheData.newFields[rightToolbarName]=null;%>
					<div data-propertyname="<%=rightToolbarName%>" data-controltype="ToolBar" class="ui-content-right col-lg-2">
						<div class="cube-bar-open-container">
							<%for(var i=0,len=container.controls.length;i<len;i++){%>
								<%var control=container.controls[i];%>
								<%if(control.ctrlType!="DataGrid"&&control.position=="right"){%>
									<%include(application.view.screenSize,control);%>
									<%cacheData.existFields[control.field]={refModel3DField:model3DField};%>
								<%}%>
							<%}%>
						</div>
						<div class="cube-bar-close-container"></div>
					</div>
				<%}%>
				<div class="grid-wrapper col-lg-12" style="height:500px; padding:0;">
					<%include(application.view.screenSize,gridControl);%>
				</div>
			</div>
		<%}%>

		<%var generateNonCardFunc = function(container){%>
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
				<%var tabMenuName=getNewIdFunc("tabMenu");%>
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
							<%generateGridFunc(gridContainer);%>
						</div>
					<%}%>
				</div>
			<%}else if(gridCount==1){%>
				<%for(var i=0,len=container.containers.length;i<len;i++){%>
					<%var gridContainer=container.containers[i];%>
					<%if(gridContainer.type!="Grid") continue;%>
					<%generateGridFunc(gridContainer);%>
				<%}%>
			<%}%>
		<%}%>

		<div class="row">
            <div class="cube-main-left">
                <%for(var i=0,len=application.view.containers.length;i<len;i++){%>
                    <%var container=application.view.containers[i];%>
                    <%if(container.type=="Tree"&&container.controls&&container.controls.length){%>
                        <%include(application.view.screenSize,container.controls[0]);%>
                    <%}%>
                <%}%>
            </div>
            <div class="cube-main-right">
				<%for(var i=0,len=application.view.containers.length;i<len;i++){%>
					<%var container=application.view.containers[i];%>
					<%if(container.type!="Toolbar"||!container.controls||!container.controls.length) continue;%>
					<%var leftToolbarName=getNewIdFunc("leftToolbar");%>
					<%cacheData.newFields[leftToolbarName]=null;%>
					<div data-propertyname="<%=leftToolbarName%>" data-controltype="ToolBar" class="col-lg-10 cube-bar-modeltxt">
						<div class="cube-bar-open-container">
							<%for(var j=0,len1=container.controls.length;j<len1;j++){%>
								<%var control=container.controls[j];%>
								<%if(control.position!="right"){%>
									<li><%include(application.view.screenSize,control);%></li>
								<%}%>
							<%}%>
						</div>
						<div class="cube-bar-close-container"></div>
					</div>
					<%var rightToolbarName=getNewIdFunc("rightToolbar");%>
					<%cacheData.newFields[rightToolbarName]=null;%>
					<div data-propertyname="<%=rightToolbarName%>" data-controltype="ToolBar" class="ui-content-right col-lg-2">
						<div class="cube-bar-open-container">
							<%for(var j=0,len1=container.controls.length;j<len1;j++){%>
								<%var control=container.controls[j];%>
								<%if(control.position=="right"){%>
									<%include(application.view.screenSize,control);%>
								<%}%>
							<%}%>
						</div>
						<div class="cube-bar-close-container"></div>
					</div>
				<%}%>
                <%for(var i=0,len=application.view.containers.length;i<len;i++){%>
                    <%var container=application.view.containers[i];%>
                    <%if(container.type!="Card"||!container.controls||!container.controls.length) continue;%>
                    <div class="col-lg-12">
						<%generateControlFunc(container);%>
					</div>
                <%}%>
				<%generateNonCardFunc(application.view);%>
            </div>
        </div>
	</div>
    <script src="./jquery/jquery-1.11.1.js" type="text/javascript"></script>
    <script src="./common/js/Animation.js" type="text/javascript"></script>
    <script src="./common/js/Cube.js" type="text/javascript"></script>
    <script src="./common/js/Control.js" type="text/javascript"></script>
    <script data-config="MessageBox"></script>
    <script src="./pc/js/cube.pc.js" type="text/javascript"></script>
    <script src="./common/js/Cube.bindings.js" type="text/javascript"></script>
    <script src="./common/js/Button.js" type="text/javascript"></script>
    <script src="./common/js/ImageButton.js" type="text/javascript"></script>
    <script src="./common/js/ToolBar.js" type="text/javascript"></script>
    <script data-config="TextBox"></script>
    <script src="./common/js/accondion.js" type="text/javascript"></script>
    <script src="./common/js/SearchBox.js" type="text/javascript"></script>
    <script src="./common/js/dropDown.js" type="text/javascript"></script>
    <script src="./common/js/Catalog.js" type="text/javascript"></script>
    <script src="./pc/js/Catalog.pc.js" type="text/javascript"></script>
    <script src="./common/js/CatalogHelper.js" type="text/javascript"></script>
    <script src="./common/js/CommonProxy.js" type="text/javascript"></script>
    <script src="./common/js/CommonCatalogs.js" type="text/javascript"></script>
	<%=application.view.scriptbuilder%>
    <script type="text/javascript">
        cb.viewbinding.create("<%=application.view.name%>");
    </script>
</body>
</html>