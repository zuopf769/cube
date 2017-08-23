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
    <link href="./pc/css/Cube.Icon.css" rel="stylesheet" />
    <link href="./pc/css/Cube.Control.css" rel="stylesheet" />
    <link href="./pc/css/Cube.Tab.css" rel="stylesheet" />
    <link href="./pc/css/Cube.ToolBar.css" rel="stylesheet" /> 
    <%=application.view.linkbuilder%>
</head>
<body>
	<div id="<%=application.view.name%>" class="container" style="width:100%;" data-title="<%=application.view.title%>" data-page="<%=application.view.appId%>" data-viewmodel="<%=application.moduleName%>_<%=application.view.viewModel%>">
        <%var newIds={};%>
		<%var cacheData={newFields:{},existFields:{}};%>
		<%application.viewDataCache=cacheData;%>
		<%var getNewIdFunc = function(prefix){%>
			<%var number = (newIds[prefix]||0)+1;%>
			<%newIds[prefix]=number;%>
			<%return prefix+"_"+number;%>
		<%}%>

		<%for(var i=0,len=application.view.containers.length;i<len;i++){%>
			<%var container=application.view.containers[i];%>
			<%if(container.type!="Toolbar") continue;%>
			<div class="row">
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
			</div>
		<%}%>

		<%for(var i=0,len=application.view.containers.length;i<len;i++){%>
			<%var container=application.view.containers[i];%>
			<%if(container.type!="Abstract") continue;%>
			<div class="cube-content-header row">
				<div class="content-header-center col-lg-12 p-l-0 p-r-0">
					<div class="col-lg-1 p-l-0 p-r-0">
						<span class="page-mark"></span>
						<div class="right-top"><span></span></div>
					</div>
					<div class="col-lg-11">
						<%for(var j=0,len1=container.controls.length;j<len1;j++){%>
							<%var control = container.controls[j];%>
							<%if(control.position=="top"||control.position=="bottom"){%>
								<div class="col-lg-12">
									<%include(application.view.screenSize,control);%>
								</div>
							<%}%>
						<%}%>
					</div>
				</div>
			</div>
		<%}%>

		<%var generateControlFunc = function(container, groupName){%>
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
				<%}else if(container.iCols==2){%>
					<div class="col-lg-6">
				<%}else if(container.iCols==4){%>
					<div class="col-lg-3">
				<%}else{%>
					<div class="col-lg-4">
				<%}%>
					<%if(control.field&&groupName){%>
						<%cacheData.existFields[control.field]={groupField:groupName};%>
					<%}%>
					<%include(application.view.screenSize,control);%>
				</div>
			<%}%>
		<%}%>

		<%var generateGridFunc = function(container, groupName){%>
			<%if(!container.controls) return;%>
			<%var gridControl=null,model3dField=null;%>
			<%for(var i=0,len=container.controls.length;i<len;i++){%>
				<%var control=container.controls[i];%>
				<%if(control.ctrlType=="DataGrid"){%>
					<%gridControl=control;%>
					<%model3DField=control.field;%>
					<%if(model3DField&&groupName){%>
						<%cacheData.existFields[model3DField]={groupField:groupName};%>
					<%}%>
					<%break;%>
				<%}%>
			<%}%>
			<%if(groupName){%>
				<div class="row" data-propertyname=<%=groupName%> data-controltype="CollapsibleGroup">
			<%}else{%>
				<div class="row">
			<%}%>
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
				<div class="grid-wrapper col-lg-12" style="height:500px;">
					<%include(application.view.screenSize,gridControl);%>
				</div>
			</div>
		<%}%>

		<%var generateNonGroupFunc = function(container){%>
			<%var gridCount=0,hasNonGridContainer=false;%>
			<%if(container.containers&&container.containers.length){%>
				<%for(var i=0,len=container.containers.length;i<len;i++){%>
					<%var subContainer=container.containers[i];%>
					<%if(subContainer.type=="Toolbar"||subContainer.type=="Abstract"||subContainer.type=="Group") continue;%>
					<%if(subContainer.type=="Grid"){%>
						<%gridCount++;%>
					<%}else{%>
						<%hasNonGridContainer=true;%>
					<%}%>
				<%}%>
			<%}%>
			<%if(hasNonGridContainer){%>
				<%for(var i=0,len=container.containers.length;i<len;i++){%>
					<%var otherContainer=container.containers[i];%>
					<%if(otherContainer.type=="Toolbar"||otherContainer.type=="Abstract"||otherContainer.type=="Group"||otherContainer.type=="Grid") continue;%>
					<%generateControlFunc(otherContainer);%>
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
					<%var groupName=getNewIdFunc("group");%>
					<%cacheData.newFields[groupName]=null;%>
					<%generateGridFunc(gridContainer, groupName);%>
				<%}%>
			<%}%>
		<%}%>

		<%var generateGroupFunc = function(container){%>
			<%var hasGroupContainer=false,imageContainer=null,imageSlideControl=null,imageListControl=null,attachmentContainer=null,hasNonGroupContainer=false;%>
			<%if(container.containers&&container.containers.length){%>
				<%for(var i=0,len=container.containers.length;i<len;i++){%>
					<%var subContainer=container.containers[i];%>
					<%if(subContainer.type=="Toolbar"||subContainer.type=="Abstract") continue;%>
					<%if(subContainer.type=="Group"){%>
						<%hasGroupContainer=true;%>
					<%}else if(subContainer.type=="Image"&&subContainer.controls&&subContainer.controls.length){%>
						<%imageContainer=subContainer;%>
						<%for(var j=0,len1=imageContainer.controls.length;j<len1;j++){%>
							<%var control=imageContainer.controls[j];%>
							<%if(control.ctrlType=="ImageSlide"){%>
								<%imageSlideControl=control;%>
							<%}else if(control.ctrlType=="ImageList"){%>
								<%imageListControl=control;%>
							<%}%>
						<%}%>
					<%}else if(subContainer.type=="Attachment"&&subContainer.content){%>
						<%attachmentContainer=subContainer;%>
					<%}else{%>
						<%hasNonGroupContainer=true;%>
					<%}%>
				<%}%>
			<%}%>
			<%if(hasGroupContainer){%>
				<%if(imageSlideControl){%>
					<div class="col-lg-4">
						<%include(application.view.screenSize,imageSlideControl);%>
					</div>
					<%for(var i=0,len=container.containers.length;i<len;i++){%>
						<%var groupContainer=container.containers[i];%>
						<%if(groupContainer.type!="Group") continue;%>
						<%if(i==0){%>
							<%groupContainer.iCols="2";%>
							<div class="col-lg-8">
						<%}else{%>
							<div class="col-lg-12">
						<%}%>
						<%if(groupContainer.title){%>
							<div class="row border-l-blue m-l-20 p-l-20"><%=groupContainer.title%></div>
						<%}%>
						<div class="row col-lg-12">
							<%generateControlFunc(groupContainer);%>
						</div>
						</div>
					<%}%>
				<%}else{%>
					<%for(var i=0,len=container.containers.length;i<len;i++){%>
						<%var groupContainer=container.containers[i];%>
						<%if(groupContainer.type!="Group") continue;%>
						<%var groupName=getNewIdFunc("group");%>
						<%cacheData.newFields[groupName]=null;%>
						<div class="col-lg-12" data-propertyName="<%=groupName%>" data-controltype="CollapsibleGroup">
							<%if(groupContainer.title){%>
								<div class="row border-l-blue m-l-20 p-l-20"><%=groupContainer.title%></div>
							<%}%>
							<div class="row col-lg-12">
								<%generateControlFunc(groupContainer, groupName);%>
							</div>
						</div>
					<%}%>
				<%}%>
			<%}%>
			<%if(hasNonGroupContainer){%>
				<%generateNonGroupFunc(container);%>
			<%}%>
			<%if(container.controls&&container.controls.length){%>
				<%if(imageSlideControl){%>
					<div class="col-lg-4">
						<%include(application.view.screenSize,imageSlideControl);%>
					</div>
					<%container.iCols="2";%>
					<div class="col-lg-8">
						<%generateControlFunc(container);%>
					</div>
				<%}else{%>
					<div class="col-lg-12">
						<%generateControlFunc(container);%>
					</div>
				<%}%>
			<%}%>
			<%if(imageListControl){%>
				<div class="col-lg-12">
					<%if(imageContainer.title){%>
						<div class="row border-l-blue m-l-20 p-l-20"><%=imageContainer.title%></div>
					<%}%>
					<div class="row col-lg-12">
						<%include(application.view.screenSize,imageListControl);%>
					</div>
				</div>
			<%}%>
			<%if(attachmentContainer){%>
				<div class="col-lg-12">
					<div data-propertyname="<%=attachmentContainer.name%>" data-controltype="LoadPage" data-content="<%=attachmentContainer.content%>" data-remote="true"></div>
				</div>
			<%}%>
		<%}%>

		<%var generateTabFunc = function(){%>
			<%var hasTabContainer=false;%>
			<%for(var i=0,len=application.view.containers.length;i<len;i++){%>
				<%if(application.view.containers[i].type=="TabPage"){%>
					<%hasTabContainer=true;%>
					<%break;%>
				<%}%>
			<%}%>
			<%if(hasTabContainer){%>
				<%var tabMenuName=getNewIdFunc("tabMenu");%>
				<%var tabMenuContent={isNeedCollect:false,mode:"strip",dataSource:[]};%>
				<%cacheData.newFields[tabMenuName]=tabMenuContent;%>
				<div class="row">
					<div class="navbar-pc-strip" data-propertyname="<%=tabMenuName%>" data-controltype="TabContent">
						<%var tabIndex=0;%>
						<%for(var i=0,len=application.view.containers.length;i<len;i++){%>
							<%var tabContainer=application.view.containers[i];%>
							<%if(tabContainer.type!="TabPage") continue;%>
							<%tabIndex++;%>
							<%if(tabContainer.content==null){%>
								<li class="ui-text" data-content="<%=tabContainer.name%>"><%=tabContainer.title%></li>
								<%if(tabIndex==1){%>
									<%tabMenuContent.dataSource.push({"content":tabContainer.name,"isSelected":true});%>
								<%}else{%>
									<%tabMenuContent.dataSource.push({"content":tabContainer.name});%>
								<%}%>
							<%}else{%>
								<li class="ui-text" data-content="<%=tabContainer.content%>" data-remote="true"><%=tabContainer.title%></li>
								<%if(tabIndex==1){%>
									<%tabMenuContent.dataSource.push({"content":tabContainer.content,"isSelected":true});%>
								<%}else{%>
									<%tabMenuContent.dataSource.push({"content":tabContainer.content});%>
								<%}%>
							<%}%>
						<%}%>
					</div>
				</div>
				<div data-related="<%=tabMenuName%>" class="row">
					<%for(var i=0,len=application.view.containers.length;i<len;i++){%>
						<%var tabContainer=application.view.containers[i];%>
						<%if(tabContainer.type!="TabPage") continue;%>
						<%if(tabContainer.content==null){%>
							<div class="col-lg-12" data-content="<%=tabContainer.name%>">
								<%generateGroupFunc(tabContainer);%>
							</div>
						<%}else{%>
							<div class="col-lg-12" data-content="<%=tabContainer.content%>" data-remote="true"></div>
						<%}%>
					<%}%>
				</div>
			<%}else{%>
				<div class="row">
					<%generateGroupFunc(application.view);%>
				</div>
			<%}%>
		<%}%>

		<%generateTabFunc()%>
	</div>
    <script src="./jquery/jquery-1.11.1.js" type="text/javascript"></script>
    <script src="./jquery/jquery-ui.js" type="text/javascript"></script>
    <script src="./common/js/Animation.js" type="text/javascript"></script>
    <script src="./common/js/Cube.js" type="text/javascript"></script>
    <script src="./common/js/Control.js" type="text/javascript"></script>
    <script data-config="MessageBox"></script>
    <script src="./pc/js/cube.pc.js" type="text/javascript"></script>
    <script src="./common/js/Cube.bindings.js" type="text/javascript"></script>
    <script src="./common/js/SearchBox.js" type="text/javascript"></script>
    <script src="./common/js/ToolBar.js" type="text/javascript"></script>
    <script src="./pc/js/TabContent.js" type="text/javascript"></script>
	<script src="./pc/js/CollapsibleGroup.js" type="text/javascript"></script>
    <script src="./common/js/CommonProxy.js" type="text/javascript"></script>
    <script src="./common/js/CommonArchives.js" type="text/javascript"></script>
	<script src="./common/js/loadpage.js" type="text/javascript"></script>
    <%=application.view.scriptbuilder%>
	<script type="text/javascript">
        cb.viewbinding.create("<%=application.view.name%>");
    </script>
</body>
</html>