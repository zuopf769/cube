var NCMetaDataProviderViewModel_Extend = {
	nodeUtil :function () {
        var root;

        function transNode(data) {
            data.label = data.dirname;
			data.id = data.pk_dir;
			data.code=data.pk_dir;
            data.childrenCount = data.childrenCount || (data.children==null?0:data.children.length);
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

        function buildTreeNode(pNode,dataList) {            
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
            createTreeNode:createTreeNode,
            buildTreeNode: buildTreeNode,            
        }
    }(),   
	doAction: function (name, viewModel) {
        if (this[name])
            this[name](viewModel);
    },
	closeAction:function(viewModel){
		viewModel.hideViewPart();
	},
	
	init_Extend:function(viewModel){
		//初始化模块-实体树
		var nodeUtil = this.nodeUtil;  
		cb.data.CommonProxy("UAP").GetQueryEngineDirTreeNode(function(success, fail) {
			if (fail) {
                return;
            }
			
            
            var rootNode = nodeUtil.createTreeNode(success, true);
            nodeUtil.buildTreeNode(rootNode, success.children);
            //初始化数据
            viewModel.gettreeComp().set("Rows", rootNode);
			
		});
		
		
		
	},
	
	showTreeEntity:function(viewModel,treeCompNode){
		//初始化实体-属性树
		var nodeUtil = this.nodeUtil;  
		var data={
			"pk_dir":treeCompNode.pk_dir
		};
		cb.data.CommonProxy("UAP").GetQueryEngineDefList(data,function(success, fail) {
			if (fail) {
                return;
            }
			if(success.length=0){
				return;
			}
            
            var rootNode = nodeUtil.createTreeNode(success, true);
            nodeUtil.buildTreeNode(rootNode, success.children);
            //初始化数据
            viewModel.gettreeEntity().set("Rows", rootNode);
			
		});
	},
	
	treeCompNodeAction:function(viewModel,data){
		
		//添加节点
		this.addNode(viewModel,data);
		//建立模块-属性树
		this.showTreeEntity(viewModel,data);
	},
	
	addNode: function(viewModel,data){
		//增加模块-实体树节点
		var nodeUtil = this.nodeUtil;  
		var node={
			"pk_dir":data.pk_dir,
			"dirname":data.dirname,
			"parent":data.parent.pk_dir,
			"children":data.children
		};
		cb.data.CommonProxy("UAP").GetQueryEngineDirTreeNode(node,function(success, fail) {
			if (fail) {
                return;
            }
			nodeUtil.buildTreeNode(data,success.children);
			viewModel.gettreeComp().set("Children",data);
		});
    },
	
	saveAction:function(){
		alert("saveAction");
	},
};