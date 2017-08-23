var SmartModelListViewModel_Extend = {
	nodeUtil: function() {
		var root;

		function transNode(data) {
			data.label = data.dirname;
			data.id = data.pk_dir;
			data.code = data.pk_dir;
			data.childrenCount = data.childrenCount || (data.children == null ? 0 : data.children.length);
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
	} (),
	doAction: function(name, viewModel) {
		if (this[name]) this[name](viewModel);
	},
	closeAction: function(viewModel) {
		cb.route.hideArchiveViewPart(viewModel);
	},

	init_Extend: function(viewModel) {
		//初始化模块-实体树
		var nodeUtil = this.nodeUtil;
		cb.data.CommonProxy("UAP").GetQueryEngineDirTreeNode(function(success, fail) {
			if (fail) {
				return;
			}

			var rootNode = nodeUtil.createTreeNode(success, true);
			nodeUtil.buildTreeNode(rootNode, success.children);
			//初始化数据
			viewModel.getsmartModelTree().set("Rows", rootNode);

		});
	},

	
	fillForm:function(viewModel,data){
		finalData={
			"pk_dir":data.pk_dir,
		}
		cb.data.CommonProxy("UAP").GetQueryEngineDefList(finalData,function(success,fail){
			if(fail){
				return;
			}
			/* 
			TODO 由于此处后台服务传来的数据格式有误,在这里将服务传来数据包装成:
			currentPageData: Array[14]
			pageCount: 1
			pageIndex: 1
			pageSize: 15
			totalColumnData: null
			totalCount: 14 */
			finalData={
				"currentPageData":success,
				"pageCount":"1",
				"pageIndex":"1",
				"pageSize":"30",
				"totalColumnData":null,
				"totalCount":success.length,
			}
			viewModel.getsmartModelForm().setPageRows(finalData);
		});
	},
	
	openNode: function(viewModel, data) {
		//增加模块-实体树节点
		var nodeUtil = this.nodeUtil;
		var node = {
			"pk_dir": data.pk_dir,
			"dirname": data.dirname,
			"parent": data.parent.pk_dir,
			"children": data.children
		};
		cb.data.CommonProxy("UAP").GetQueryEngineDirTreeNode(node,
		function(success, fail) {
			if (fail) {
				return;
			}
			nodeUtil.buildTreeNode(data, success.children);
			viewModel.getsmartModelTree().set("Children", data);
		});
	},
	
	addNodeButton:function(viewModel){
		var node=viewModel.getsmartModelTree().get("selectedItem");
		cb.route.loadPageViewPart(viewModel,"common.smartmodel.AddSmartModelKind", {
            "node": node?node:"root", type: "add"});
	},
	
	updateNodeButton:function(viewModel){
		var node=viewModel.getsmartModelTree().get("selectedItem");
		cb.route.loadPageViewPart(viewModel,"common.smartmodel.AddSmartModelKind", {
            "node": node?node:"root", type: "update"});
	},
	
	saveAction: function() {
		alert("saveAction");
	},
};