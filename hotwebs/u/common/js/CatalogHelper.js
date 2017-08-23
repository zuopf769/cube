cb.util.CatalogHelper = function(catalog,pageSize){
    this.catalog = catalog;
    this.catalog.setData("Options", { pageSize: pageSize });
    this.pageSize = pageSize || 15;
};

cb.util.CatalogHelper.prototype ={
    
    beforeExpand: function (data, viewModel, queryData, context) {
        var pageInfo = this.pageManager.getPageInfo(data.code, this.pageSize, 1);
        var self = this;

        queryData.call(context,viewModel,pageInfo.nodeCode, pageInfo.pageSize, pageInfo.pageIndex, function (result) {
            try {         

                if(result.children && result.children.length>0){

                    var node = self.nodeUtil.addChildren( result.code, result.children);
                    if (node) {
                        self.catalog.set("Children", node);
                    }
                }
            }
            catch (e) {

            }
        });
    },

    catalogMoreClick: function (data, viewModel, queryData, context) {

        var self = this;
        var pageInfo = this.pageManager.getPageInfo(data.code);
        queryData.call(context, viewModel,pageInfo.nodeCode, pageInfo.pageSize, pageInfo.pageIndex + 1, function (result) {
            try {              

                pageInfo.pageIndex++;
                //获得数据后，更新数据模型

                var nodes = self.nodeUtil.createTreeNodes(result.children);
                var pNode = self.nodeUtil.getNode(result.code);
                self.nodeUtil.append(pNode, nodes);

                var temp = self.nodeUtil.cloneNode(pNode,nodes);                

                var node = self.nodeUtil.addChildren(result.code, result.children);
                if (node) {
                    self.catalog.set("More", temp);
                }
            }
            catch (e) {

            }
        });

    },

    initCatalog :function(data){
        var rootPage = this.pageManager.getPageInfo(data.code, this.pageSize, 1);
        //初始化数据模型Tree
        var rootNode = this.nodeUtil.createTreeNode(data, true);
        this.nodeUtil.addChildren(rootNode.code, data.children);
        //初始化数据
        this.catalog.set("Rows", rootNode);
    },

    init: function (code,viewModel,queryData,context) {
        var self = this;
        var pageIndex = 1;       

        if($.isFunction(queryData)){
            queryData(viewModel, "", this.pageSize, pageIndex, function (data) {                
                self.initCatalog(data);
            });
        }
        else {
            self.initCatalog(queryData);
        }

        /*
        * 初始化分类
        */
        var dataSource = [
            { "text": "按行业", "value": "0" },
            { "text": "按类型", "value": "1" },
            { "text": "按地区", "value": "2" },
        ];

        this.catalog.setData({ "DropDownDataSource": dataSource });
    },

    nodeUtil: (function () {
        var root;

        function transNode(data) {
            var node = {}
            node.label = data.name;
            node.code = data.code;
            node.id =  data.code;
            node.childrenCount = data.childrenCount;
            node.pk = data.id ? data.id : data.code;

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

        function getNode(code) {
            return root.getTreeNodeById(code);
        }

        function cloneNode(srcNode,children) {
            var node = {}
            node.label = srcNode.label;
            node.code = srcNode.code;
            node.id = srcNode.id;
            node.childrenCount = srcNode.childrenCount;
            node.children = children;
            node.pk = srcNode.pk;
            return node;
        }

        function append(pNode, children) {
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                if(!getNode(child.code)){
                    pNode.addChild(child);
                }
            }
        }

        return {
            getRoot: getRoot,
            createTreeNode: createTreeNode,
            addChildren: addChildren,
            createTreeNodes: getTreeNodeList,
            getNode: getNode,
            cloneNode: cloneNode,
            append: append
        }
    })(),

    pageManager: (function () {
        function PageInfo(nodeCode, pageSize, pageIndex) {
            this.nodeCode = nodeCode;
            this.pageSize = pageSize;
            this.pageIndex = pageIndex;
        }
        function createPageInfo(nodeCode, pageSize, pageIndex) {
            return new PageInfo(nodeCode, pageSize, pageIndex);
        }

        var pageInfos = {};

        function getPageInfo(key, pageSize, pageIndex) {
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
            getPageInfos: getPageInfos
        }
    })(),

    getFakeData: function (result) {
        var data = {
            "code": "0101",
            "name": "北京客户",
            "parent": null,
            "childrenCount": 0,
            "children": [
              {
                  "code": "010101",
                  "name": "水泥客户",
                  "parent": null,
                  "childrenCount": 0,
                  "children": [],
                  "parentcode": "0105",
                  "data": null,
                  "map": null
              },
              {
                  "code": "010102",
                  "name": "地产客户",
                  "parent": null,
                  "childrenCount": 0,
                  "children": [],
                  "parentcode": "0105",
                  "data": null,
                  "map": null
              },
              {
                  "code": "010103",
                  "name": "电商客户",
                  "parent": null,
                  "childrenCount": 0,
                  "children": [],
                  "parentcode": "0105",
                  "data": null,
                  "map": null
              },
              {
                  "code": "010104",
                  "name": "中央客户",
                  "parent": null,
                  "childrenCount": 0,
                  "children": [],
                  "parentcode": "0105",
                  "data": null,
                  "map": null
              }
            ]
        };

        data.code = result.code;
        for (var i = 0; i < data.children.length; i++) {
            data.children[i].code = data.children[i].code + Date.now().toString();
            data.children[i].name = data.children[i].name + data.children[i].code
            result.children.push(data.children[i]);
        }

    }
}