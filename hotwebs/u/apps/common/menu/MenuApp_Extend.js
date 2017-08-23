var PanoramaMenuViewModel_Extend = {
    nodeUtil: function () {
        var root;

        function transNode(data) {
            data.label = data.label || (data.name ? data.name : data.displayName);
            data.code = data.code || data.menuCode;
            data.id = data.code;
            data.childrenCount = data.childrenCount || data.children.length;
            return data;
        }

        /*
         node 格式定义如下：
          {"code": "root#customerclass",
           "name": "客户分类",
           "parent": null,
           "childrenCount": 9,
           "children": []
           "parentcode": null,
           "data": null,
           "map": null
        */
        function createTreeNode(data, isroot) {
            var node = transNode(data);

            var treeNode = new cb.model.TreeNode(node, isroot);
            if (isroot) {
                root = treeNode;
            }

            root.addTreeNodeToIndex(treeNode);

            /*
            if (data.children && $.isArray(data.children) && data.children.length > 0) {
                for (var i = 0; i < data.children.length;i++){
                    node = transNode(data.children[i]);
                    var temp = new cb.model.TreeNode(node, isroot);
                    if (temp) {
                        treeNode.addChild(temp);
                    }
                }
            }*/

            return treeNode;
        }

        function buildTreeNode(pNode, dataList) {
            for (var i = 0; i < dataList.length; i++) {
                var child = dataList[i];
                var node = createTreeNode(child, false);
                if (node) {
                    pNode.addChild(node);
                    if (child.children && child.children.length > 0) {
                        buildTreeNode(node, child.children);
                    }
                }

            }

        }

        function getRoot() {
            return root;
        }

        return {
            getRoot: getRoot,
            createTreeNode: createTreeNode,
            buildTreeNode: buildTreeNode,
        }
    }(),

    doAction: function (name, viewModel) {
        if (this[name]) this[name](viewModel);
    },

    getData: function (code, viewModel, callBack) {
        var options = {};
        options.params = { "parent": code }
        options.callback = callBack;
        //viewModel.getProxy().GetSubMenu(options);
        var queryStringParent = new cb.util.queryString(location.search);
        if (queryStringParent.get('isSys') != "true") {
            viewModel.getProxy().GetSubMenu({ "parent": code }, callBack);
        }
    },
    
    fireCommonFunctionAdd:function(viewModel,data){
    	var para= cb.route.getViewPartParams(viewModel);
        if(para.parentViewModel){
        	para.parentViewModel.fireEvent("commonFunctionAdd",data);
        }
    },
    
    imgClick:function(viewModel,data){
    	if(data.isLeaf){
			var o = {};
			o["appId"]= data.appId;
			o["funcCode"]=  data.funcCode;
			o["menuCode"]=  data.menuCode;
			o["displayName"]= data.displayName;
			o["url"]=  data.url;
			o["image"]=  data.image;
			o["bgcolor"]=  data.bgcolor;
			o["isLeaf"] = data.isLeaf;
			o["isSwing"]=  data.isSwing;
			o["type"] = '1';
			o["isExist"] = data.isExist;
			this.fireCommonFunctionAdd(viewModel,o);
//			viewModel.getPanorama().set("IconsDisplay",o);
//			this.checkIsExist(viewModel,o);
			//add data to database        
			viewModel.getProxy().GetAddFrequently(o, function(sucess,fail){
				if(sucess){
					viewModel.getPanorama().set("IconsDisplay",o);
				}
			});
		}
    },   
    beforeExpand:function (viewModel,data) {
    	var that = this;
    	if (data) {
            if (data.getLevel() >= 2) {
                if (data.loaded === undefined) {
                    //将数据设置到右边全景菜单中   
                    this.getData(data.code, viewModel, function (sucess, fail) {
                        that.nodeUtil.buildTreeNode(data, sucess.children);
                        data.loaded = true;
                          that.checkIsExist(viewModel,data);
                        viewModel.getPanorama().setData({ "DataSource": data });
                    });
                }
                else {
                    viewModel.getPanorama().setData({ "DataSource": data });
                }
            }
            else {
                //不需要做处理，因为初始化时直接设置了树状的数据源
            }
         }
    },
    
    menuTreeClick:function (viewModel,data) {
    	try {
            if (data.isLeaf) {
                var queryStringParent = new cb.util.queryString(location.search);
                if (queryStringParent.get('isSys') == "true") {
                   data.displayName = data.displayName?data.displayName:data.name;
                    if (data.appId && data.displayName ) {
                        var appParams = cb.route.getAppParamsFromMenu(data);
                        if (!appParams) {
                            appParams = { appId: data.appId };
                        }
                        if (!appParams.appId) {
                            appParams.appId = data.appId;
                        }
						//appParams.appId=data.appId;
                        cb.route.loadTabViewPart(viewModel, appParams.appId, appParams.params);
                        $(".funcslist").css("display", "none");
                    }
                } else {
                    self.callback.call(self.context, self.parentViewModel, data);
                }
            }
        }
        catch (e) {
        }
    },
    
    
    itemClick:function (viewModel,data) {
    	if(data.isLeaf){
            if (data.isSwing) {
                //需要单独写方法
                this.showSwing(viewModel, data)
            }
            else {
				var queryStringParent = new cb.util.queryString(location.search);
                if (queryStringParent.get('isSys') == "true") {
                   data.displayName = data.displayName?data.displayName:data.name;
                    if (data.appId && data.displayName ) {
                        var appParams = cb.route.getAppParamsFromMenu(data);
                        if (!appParams.appId) {
                            appParams.appId = data.url;
                        }
						appParams.appId=data.appId;
                        cb.route.loadTabViewPart(viewModel, appParams.appId, appParams.params);
                        $(".funcslist").css("display", "none");
                    }
                }else if (data.appId && data.displayName && data.url) {                            
                    var appParams = cb.route.getAppParamsFromMenu(data);
                    if (!appParams.appId) {                                
                        appParams.appId = data.url;                                
                    }
                    cb.route.loadTabViewPart(viewModel, appParams.appId, appParams.params);                          

                    $(".funcslist").css("display", "none");
                }
            }
        }
    },

    init_Extend: function (viewModel) {
        /**管理树节点*/
       var para= cb.route.getViewPartParams(viewModel);
       
        var nodeUtil = this.nodeUtil;

        /*记录所有数据翻页信息*/
        /*
        var getData = function (code,callBack) {
            var options = {};
            options.params = { "parent" : code}
            options.callback = callBack;
            //viewModel.getProxy().GetSubMenu(options);
            viewModel.getProxy().GetSubMenu({ "parent": code }, callBack);
        } */             

        function getDomainData(callBack) {
            var options = {};
            options.callback = callBack;
            viewModel.getProxy().GetDomainMenu(options);
        };
       

        //获取根节点数据,初始化界面
        getDomainData(function (data, fail) {
            if (fail) {
                alert("查询列表数据失败");
                return;
            }
            //根据约定，返回的数据有领域和模块两层数据，故此处对数据直接获取两层处理

            //初始化数据模型Tree
            var rootNode = nodeUtil.createTreeNode(data, true);
            nodeUtil.buildTreeNode(rootNode, data.children);
            //初始化数据
            viewModel.getMenuTree().set("Rows", rootNode);
        });
    },
    
    getCommonFunList :function(viewModel){
  	    var para= cb.route.getViewPartParams(viewModel);
  	    var formbutton = para.from;
  	    var list=[];
        if(para.parentViewModel){        	
        	list = para.parentViewModel.getmenuTiles()._data.dataSource; 
        } 
        var dataList = {"data":list,"type":formbutton};
        return dataList;
    },
    
    checkIsExist:function(viewModel,data){
    	var dataList = this.getCommonFunList(viewModel);
    	var menuData = dataList.data;
    	function checkExist(node){//标记常用
    		if(node.children && node.children.length >0){
    			var children=node.children;
    			for(var i=0;i<children.length;i++){
    				checkExist(children[i]);
				   	node.isExist=0;
    			}   			
    		}else if(menuData.length>0){//叶子节点 1代表是通过button点击进入并且子节点相同 2代表从左上角图标进入 3.代表没有相同的子节点
    			for(var j=0;j<menuData.length;j++){
    				if((menuData[j].menuCode==node.menuCode) && (dataList.type== 'button')){    					
    					node.isExist=1;   					
    					return;
    				}else if(menuData[j].menuCode==node.menuCode){
    					node.isExist=2;
    					return;
    				}else if(menuData[j].menuCode!=node.menuCode && dataList.type== 'button'){
    					node.isExist=3;

    				}else if(menuData[j].menuCode != node.menuCode){
    					node.isExist=4;
    			
    				}
    				
    			}
    		}else{
    			node.isExist=4;
    		}
    	}
		checkExist(data);
    },
    
	search: function (viewModel, args) {
		var nodeUtil = this.nodeUtil;
		var InputData = {"text":args};		
		viewModel.getProxy().GetSearchMenu(InputData, function(success,fail){
			if(success){	
				var dataSource ={code: "search",children:success}
				 var rootNode = nodeUtil.createTreeNode(dataSource, true);
            	nodeUtil.buildTreeNode(rootNode, dataSource.children);
				viewModel.getPanorama().setData({"DataSource":rootNode});				
			}
		});
	},
    showSwing: function (viewModel, args) {
        //
        if (args && args.funcCode && args.funcCode.length > 0) {
            var options = {};
            options.params ={ nodeId : args.funcCode};
            options.callback = function (sucess, fail) {
                if (fail) return;
                if (sucess.reqUrl) {
                    var url = cb.rest._getUrl(sucess.reqUrl);
                    cb.route.openWin(url);                    
                }
            }
            viewModel.getProxy().GetSwingInfo(options);
        }
    },



    cancelAction: function (viewModel) {

    },

    okAction: function (viewModel) {

    },

    lastOperation: function (viewModel) {
        var nodeUtil = this.nodeUtil;
        this.getData("recentlyused", viewModel, function (sucess, fail) {
            var rootNode = nodeUtil.createTreeNode(sucess, true);
            nodeUtil.buildTreeNode(rootNode, sucess.children);
            viewModel.getPanorama().setData({ "DataSource": rootNode });
        });
    },


    updateMenuStats: function (viewModel, data) {

        var update = function (code, funcCode, viewModel, callBack) {
            var options = { "menuCode": code, "funcCode": funcCode };
            viewModel.getProxy().UpdateMenuStats(options, callBack);
        };
        try {
            if (data.code && data.funcCode) {
                update(data.code, data.funcCode, viewModel, function (sucess, fail) {
                    //alert(sucess);
                });
            }
        } catch (e) {
            console.log("统计失败" + data.code + ":" + data.funcCode);
        }


    }
};

