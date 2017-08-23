var MenuNodeUtil = {
    NodeUtil: function () {
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
    },    
}