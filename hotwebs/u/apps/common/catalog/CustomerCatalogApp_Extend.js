var CustomerCatalogViewModel_Extend = {
    nodeUtil :(function () {
        var root;

        function transNode(data) {
            var node = {}
            node.label = data.name;
            node.code = data.code;
            node.id = data.code;
            node.childrenCount = data.childrenCount;

            return node;
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

        function getTreeNodeList(dataList) {
            var nodeList = [], node;
            for (var i = 0; i < dataList.length; i++) {
                node = createTreeNode(dataList[i], false);
                if (node) {
                    nodeList.push(node);
                }
            }

            return nodeList;
        }

        function addChildren(code, dataList) {
            var targetNode = root.getTreeNodeById(code);
            if (targetNode) {
                var nodes = getTreeNodeList(dataList);

                for (var i = 0; i < nodes.length; i++) {
                    targetNode.addChild(nodes[i]);
                }
                return targetNode;
            }
        }

        function getRoot() {
            return root;
        }      

        return {            
            getRoot: getRoot,
            createTreeNode: createTreeNode,
            addChildren:addChildren
        }
    })(),

    pageManager:(function () {
        function PageInfo(nodeCode, pageSize, pageIndex) {
            this.nodeCode = nodeCode;
            this.pageSize = pageSize;
            this.pageIndex = pageIndex;
        }
        function createPageInfo(nodeCode, pageSize, pageIndex) {
            return new PageInfo(nodeCode, pageSize, pageIndex);
        }

        var pageInfos = {};

        function getPageInfo(key,pageSize,pageIndex) {
            var pageInfo = null;
            if (!pageInfos[key]) {
                pageInfo = createPageInfo(key, pageSize, pageIndex);
                pageInfos[key] = pageInfo;
            }
            else {
                pageInfo = pageInfos[key];
            }

            return pageInfo;
        }

        function getPageInfos() {
            return pageInfos;
        }

        return {            
            getPageInfo: getPageInfo,
            getPageInfos:getPageInfos
        }
    })(),

    doAction: function (name, viewModel) {
        if (this[name]) this[name](viewModel);
    },

    beforeExpand:function(viewModel,data){
        this.ch.beforeExpand(data, viewModel, this.queryData)
    },

    catalogClick: function (viewModel, data) {
        try {
            this.callback.call(this.context, this.parentViewModel, data);
        }
        catch (e) {
        }
    },

    catalogMoreClick: function (viewModel, data) {
        this.ch.catalogMoreClick(data,viewModel, this.queryData)
    },

    queryData: function (viewModel, nodeCode, pageSize, pageIndex, callBack) {
        var params = cb.route.getViewPartParams(viewModel);
		if (!params) return;
		var treeFunctionId = params.treeFunctionId;
		var symbol = viewModel.getSymbol();
        if (symbol != null) {
            cb.data.CommonProxy(symbol).QueryTree({
                "treeFunctionId": treeFunctionId,
                "querySchemeID": "",
                "nodeCode": nodeCode,
                "pageSize": pageSize,
                "pageIndex": pageIndex,
                "maxLevel": 3
            }, callBack);
        }
    },

    init_Extend: function (viewModel) {

        var params = cb.route.getViewPartParams(viewModel);
        if (!params) return;
        this.parentViewModel = params.parentViewModel;
        this.callback = params.callback;
        this.context = params.context;
       
        if (!this.parentViewModel || !this.callback || !this.context) return;
                              
        debugger;

        this.viewModel = viewModel;
        this.ch = new cb.util.CatalogHelper(viewModel.getCustomerCatalog(), viewModel.getPageSize());
        this.ch.init("",viewModel,this.queryData);

    },  

    cancelAction: function (viewModel) {
        
    },

    okAction: function (viewModel) {

    }

    
};