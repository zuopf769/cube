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
	<div id="<%=application.view.name%>" class="container" data-title="<%=application.view.title%>" data-page="<%=application.view.appId%>" data-viewmodel="<%=application.moduleName%>_<%=application.view.viewModel%>">
        <div class="row">
            <div data-propertyname="toolbarContent" data-controltype="ToolBar" class="col-lg-9 cube-bar-modeltxt">
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
            <div class="ui-content-right col-lg-3">
                <div class="cube-bar-open-container">
				<%for(var i=0,len=application.view.containers.length;i<len;i++){%>
                    <%var container = application.view.containers[i];%>
                    <%if(container.type=="Toolbar"){%>
                        <%for(var j=0,len1=container.controls.length;j<len1;j++){%>
                            <%var control = container.controls[j];%>
                            <%if(control.position=="right"){%>
                                <%include(application.view.screenSize,control);%>
                            <%}%>
                        <%}%>
                    <%}%>
                <%}%>
				</div>
				<div class="cube-bar-close-container"></div>
            </div>
        </div>
        <div class="cube-content-header row">
			<div class="content-header-center col-lg-12 p-l-0 p-r-0">
				<div class="col-lg-1 p-l-0 p-r-0">
					<span class="page-mark"></span>
					<div class="right-top"><span></span></div>
				</div>
				<div class="col-lg-10">
					<%for(var i=0,len=application.view.containers.length;i<len;i++){%>
						<%var container = application.view.containers[i];%>
						<%if(container.type=="Abstract"){%>
							<%for(var j=0,len1=container.controls.length;j<len1;j++){%>
								<%var control = container.controls[j];%>
								<%if(control.position=="top"||control.position=="bottom"){%>
									<div class="col-lg-12">
										<%include(application.view.screenSize,control);%>
									</div>
								<%}%>
							<%}%>
						<%}%>
					<%}%>
				</div>
				<div class="col-lg-1 p-l-0 p-r-0">
					<%for(var i=0,len=application.view.containers.length;i<len;i++){%>
						<%var container = application.view.containers[i];%>
						<%if(container.type=="Abstract"){%>
							<%for(var j=0,len1=container.controls.length;j<len1;j++){%>
								<%var control = container.controls[j];%>
								<%if(control.position=="status"){%>
									<%include(application.view.screenSize,control);%>
								<%}%>
							<%}%>
						<%}%>
					<%}%>
				</div>
            </div>
        </div>
        <div class="row">
			<div class="navbar-pc-strip" data-propertyname="tabMenu" data-controltype="TabContent">
				<%for(var i=0,len=application.view.containers.length;i<len;i++){%>
					<%var container = application.view.containers[i];%>
					<%if(container.type=="TabPage"){%>
							<%if(container.content==null){%>
								<li class="ui-text" data-content="<%=container.name%>"><%=container.title%></li>
							<%}else{%>
								<li class="ui-text" data-content="<%=container.content%>" data-remote="true"><%=container.title%></li>
							<%}%>
					<%}%>
				<%}%>
			</div>
        </div>
        <div data-related="tabMenu" class="row">
            <%for(var i=0,len=application.view.containers.length;i<len;i++){%>
                <%var container = application.view.containers[i];%>
                <%if(container.type=="TabPage"){%>
                    <%if(container.content==null){%>
                        <div class="col-lg-12" data-content="<%=container.name%>">
                        <%if(!container.containers){%>
							</div>
							<%continue;%>
						<%}%>
						<%for(var j=0,len1=container.containers.length;j<len1;j++){%>
                            <%var container1 = container.containers[j];%>
                            <%if(container1.name=="header"){%>
								<div>
								<%debugger;if(container1.containers){%>                                   
								   <%for(var l=0,len2=container1.containers.length;l<len2;l++){%>
								       <%var container2 =container1.containers[l];%>
								       <%debugger;if(container2.type=='Group'){%>
								       <%if(container2.css){%>
									       <div class="<%=container2.css%>"></div>
									   <%}else{%>
									       <div class="col-lg-12"></div>
									   <%}%>
									   <%if(container2.title){%>
									       <div class="row border-l-blue m-l-20 p-l-20"><%=container2.title%></div>
									   <%}%>
									    <%if(container2.controls){%>
										   <div class="row p-t-5 p-l-20">
											<%if(container2.iCols==1){%>
												<%for(var k=0,lenk=container2.controls.length;k<lenk;k++){%>
													<div class="col-lg-12">
														<%include(application.view.screenSize,container2.controls[k]);%>
													</div>
												<%}%>
											<%}else if(container2.iCols==2){%>
												<%for(var k=0,lenk=container2.controls.length;k<lenk;k++){%>
													<div class="col-lg-6">
														<%include(application.view.screenSize,container2.controls[k]);%>
													</div>
												<%}%>
											<%}else if(container2.iCols==3){%>
												<%for(var k=0,lenk=container2.controls.length;k<lenk;k++){%>
													<div class="col-lg-4">
														<%include(application.view.screenSize,container2.controls[k]);%>
													</div>
												<%}%>
											<%}else if(container2.iCols==4){%>
												<%for(var k=0,lenk=container2.controls.length;k<lenk;k++){%>
													<div class="col-lg-3">
														<%include(application.view.screenSize,container2.controls[k]);%>
													</div>
												<%}%>
											<%}else{%>
												<%for(var k=0,lenk=container2.controls.length;k<lenk;k++){%>
													<div class="col-lg-4">
														<%include(application.view.screenSize,container2.controls[k]);%>
													</div>
												<%}%>
											<%}%>
										  </div>									   
									   <%}else{%>
									       
									   <%}%>
									   
									   									  										
                                    <%}}%>
								<%}else{%>
								<div class="row p-t-5 p-l-20">
                                    <%if(container1.iCols==1){%>
                                        <%for(var k=0,len2=container1.controls.length;k<len2;k++){%>
                                            <div class="col-lg-12">
                                                <%include(application.view.screenSize,container1.controls[k]);%>
                                            </div>
                                        <%}%>
                                    <%}else if(container1.iCols==2){%>
                                        <%for(var k=0,len2=container1.controls.length;k<len2;k++){%>
                                            <div class="col-lg-6">
                                                <%include(application.view.screenSize,container1.controls[k]);%>
                                            </div>
                                        <%}%>
                                    <%}else if(container1.iCols==3){%>
                                        <%for(var k=0,len2=container1.controls.length;k<len2;k++){%>
                                            <div class="col-lg-4">
                                                <%include(application.view.screenSize,container1.controls[k]);%>
                                            </div>
                                        <%}%>
                                    <%}else if(container1.iCols==4){%>
                                        <%for(var k=0,len2=container1.controls.length;k<len2;k++){%>
                                            <div class="col-lg-3">
                                                <%include(application.view.screenSize,container1.controls[k]);%>
                                            </div>
                                        <%}%>
                                    <%}else{%>
                                        <%for(var k=0,len2=container1.controls.length;k<len2;k++){%>
                                            <div class="col-lg-4">
                                                <%include(application.view.screenSize,container1.controls[k]);%>
                                            </div>
                                        <%}%>
                                    <%}%>
                                </div>
								<%}%>
							</div>
                            <%}else if(container1.type=="Grid"){%>
                                <div class="row">
                                    <div data-propertyname="lineToolbarContent" data-controltype="ToolBar" class="col-lg-10 cube-bar-modeltxticon">
                                        <div class="cube-bar-open-container">
										<%for(var k=0,len2=container1.controls.length;k<len2;k++){%>
                                            <%var control = container1.controls[k];%>
                                            <%if(control.ctrlType!="DataGrid"){%>
                                                <%if(control.position!="right"){%>
													<li><%include(application.view.screenSize,control);%></li>
												<%}%>  
                                            <%}%>
                                        <%}%>
										</div>
										<div class="cube-bar-close-container"></div>
                                    </div>
									<div class="col-lg-2 cube-bar-modeltxticon ui-content-right">
                                        <%for(var k=0,len2=container1.controls.length;k<len2;k++){%>
                                            <%var control = container1.controls[k];%>
                                            <%if(control.ctrlType!="DataGrid"){%>
												<%if(control.position=="right"){%>
													<%include(application.view.screenSize,control);%>
												<%}%>                                                
                                            <%}%>
                                        <%}%>
                                    </div>
                                    <%for(var k=0,len2=container1.controls.length;k<len2;k++){%>
                                        <%var control = container1.controls[k];%>
                                        <%if(control.ctrlType=="DataGrid"){%>
                                            <%include(application.view.screenSize,control);%>
                                        <%}%>
                                    <%}%>
                                </div>
                            <%}else if(container1.name=="footer"){%>
								<div class="row" style="padding-top:10px;">
                                    <%if(container1.iCols==1){%>
                                        <%for(var k=0,len2=container1.controls.length;k<len2;k++){%>
                                            <div class="col-lg-12">
                                                <%include(application.view.screenSize,container1.controls[k]);%>
                                            </div>
                                        <%}%>
                                    <%}else if(container1.iCols==2){%>
                                        <%for(var k=0,len2=container1.controls.length;k<len2;k++){%>
                                            <div class="col-lg-6">
                                                <%include(application.view.screenSize,container1.controls[k]);%>
                                            </div>
                                        <%}%>
                                    <%}else if(container1.iCols==3){%>
                                        <%for(var k=0,len2=container1.controls.length;k<len2;k++){%>
                                            <div class="col-lg-4">
                                                <%include(application.view.screenSize,container1.controls[k]);%>
                                            </div>
                                        <%}%>
                                    <%}else if(container1.iCols==4){%>
                                        <%for(var k=0,len2=container1.controls.length;k<len2;k++){%>
                                            <div class="col-lg-3">
                                                <%include(application.view.screenSize,container1.controls[k]);%>
                                            </div>
                                        <%}%>
                                    <%}else{%>
                                        <%for(var k=0,len2=container1.controls.length;k<len2;k++){%>
                                            <div class="col-lg-4">
                                                <%include(application.view.screenSize,container1.controls[k]);%>
                                            </div>
                                        <%}%>
                                    <%}%>
                                </div>
							<%}else if(container1.type=="Group"&&container1.content!=null){%>
								<div class="row" data-propertyname="attachmentList" data-controltype="LoadPage" data-content="<%=container1.content%>" data-remote="true"></div>
                            <%}%>
                        <%}%>
                        </div>
                    <%}else{%>
                        <div class="col-lg-12" data-content="<%=container.content%>" data-remote="true"></div>
                    <%}%>
                <%}%>
            <%}%>
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
    <script src="./common/js/SearchBox.js" type="text/javascript"></script>
    <script src="./common/js/ToolBar.js" type="text/javascript"></script>
    <script src="./pc/js/TabContent.js" type="text/javascript"></script>
    <script src="./common/js/CommonProxy.js" type="text/javascript"></script>
    <script src="./common/js/CommonCRUD.js" type="text/javascript"></script>
	<script src="./common/js/loadpage.js" type="text/javascript"></script>
	<%=application.view.scriptbuilder%>
	<script type="text/javascript">
		cb.viewbinding.create("<%=application.view.name%>");
	</script>
</body>
</html>