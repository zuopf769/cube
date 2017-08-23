/// <reference path="../Control.js" />
cb.controls.widget("TreeView", function (controlType) {
    var control = function (id, options) {
        cb.controls.Control.call(this, id, options);
    };
    control.prototype = new cb.controls.Control();
    control.prototype.controlType = controlType;

    control.prototype.setDataSource = function (dataSource) {
        this.setValue(dataSource);
    };

    control.prototype.setData = function (data) {
        var defaultOptions = {
            "cubeControl": this,
            loadOnDemand: false
        };

        var refCode = data.refCode || "code";
        var refName = data.refName || "name";

        switch (data.refShowMode) {
            case "Code":
                data.dataTextField = refCode;
                break;
            case "CodeName":
                data.template = "(#= item." + refCode + " #) #= item." + refName + " #";
                break;
            default:
                data.dataTextField = refName;
        };

        var myOptions = cb.extend(defaultOptions, data);
        this.getElement().kendoTreeView(myOptions);

        var tree = this.getElement().data("kendoTreeView");
        tree.bind("select", function (e, args) {
            var item = this.dataItem(e.node);
            var goback = transferGoBack(item);
            this.options.cubeControl.execute("click", goback);
        });
        tree.bind("expand", function (e, args) {
            var item = this.dataItem(e.node);
            var goback = transferGoBack(item);
            this.options.cubeControl.execute("expand", goback);
        });
        tree.bind("check", function (e, args) {
            var item = this.dataItem(e.node);
            if (this.options.checkboxes.checkChildren && item.childrenCount > 0) {//如果复选策略为勾选父也勾选子
                var childsCode = getChildCode(item);
                var goback = transferGoBack(item);
                goback.childsCode = childsCode;
                this.options.cubeControl.execute("check", goback);
            } else {
                var goback = transferGoBack(item);
                this.options.cubeControl.execute("check", goback);
            }

        });

        for (var attr in data) {
            var attrUpper = attr.substring(0, 1).toUpperCase() + attr.substring(1);
            if (this["set" + attrUpper]) this["set" + attrUpper](data[attr]);
        }
    };

    // 在指定节点插入叶子
    control.prototype.insertChildren = function (id, children) {
        if (id != null && children != null) {
            var tree = this.getElement().data("kendoTreeView");
            // 定义内部函数，递归实现插入孩子
            function insertChildrenById(nodes, id, children) {
                for (var i = 0; i < nodes.length; i++) {
                    if (nodes[i].id == id) {
                        for (var j = 0; j < children.length; j++) {
                            var treedata = transfer(children[j]);
                            dataFormat(treedata, children[j]);
                            nodes[i].items.push(treedata);
                        }
                    }
                    else {
                        insertChildrenById(nodes[i].children.view(), id, children);
                    }
                }
            }
            insertChildrenById(tree.dataSource.view(), id, children);
            tree.setDataSource(tree.dataSource);
        }
    };

    // 增加一个根，增加一棵树
    control.prototype.insertTree = function (newtree) {
        if (newtree != null) {
            var tree = this.getElement().data("kendoTreeView");
            var treedata = tree.dataSource.data();
            var nodes = transfer(newtree);
            dataFormat(nodes, newtree);
            treedata.push(nodes);
            tree.setDataSource(new kendo.data.HierarchicalDataSource({ data: treedata }));
        }
    };

    // 关闭两个方法
    control.prototype.collapseById = function (id) {
        if (id != null) {
            var tree = this.getElement().data("kendoTreeView");
            var bar = this.findById(id);
            if (bar != null) {
                tree.collapse(bar);
            }
        }
    };
    control.prototype.collapseByText = function (txt) {
        if (txt != null) {
            var tree = this.getElement().data("kendoTreeView");
            var bar = tree.findByText(txt);
            if (bar != null)
                tree.collapse(bar);
        }
    };

    // 扩展两个方法
    control.prototype.expandByText = function (txt) {
        if (txt != null) {
            var tree = this.getElement().data("kendoTreeView");
            var bar = tree.findByText(txt);
            if (bar != null)
                tree.expand(bar);
        }
    };
    control.prototype.expandByID = function (id) {
        if (id != null) {
            var tree = this.getElement().data("kendoTreeView");
            var bar = this.findById(id);
            if (bar != null)
                tree.expand(bar);
        }
    };

    // 得到所有树中选中单选框的节点
    control.prototype.getCheckedItems = function () {
        var treeview = this.getElement().data("kendoTreeView");
        var checkedItems = [];
        function gatherCheckedStates(nodes) {
            for (var i = 0; i < nodes.length; i++) {
                // 父亲
                if (nodes[i].checked) {
                    checkedItems.push(nodes[i]);
                }
                // 孩子
                if (nodes[i].hasChildren) {
                    gatherCheckedStates(nodes[i].children.view());
                }
            }
        }
        gatherCheckedStates(treeview.dataSource.view());
        return checkedItems;
    };

    // 设置单选框，给多个节点选中单选框
    control.prototype.setCheckedItems = function (allid) {
        // 定义数组包含函数
        Array.prototype.in_array = function (e) {
            for (i = 0; i < this.length; i++) {
                if (this[i] == e)
                    return true;
            }
            return false;
        }
        // 检查参数并处理
        if (allid && allid.length > 0) {
            var treeview = this.getElement().data("kendoTreeView");
            function changeCheckedStates(nodes, allid) {
                for (var i = 0; i < nodes.length; i++) {
                    // 设置父亲
                    if (allid.in_array(nodes[i].id))
                        nodes[i].checked = true;
                    // 设置孩子
                    if (nodes[i].hasChildren) {
                        changeCheckedStates(nodes[i].children.view(), allid);
                    }
                }
            }
            changeCheckedStates(treeview.dataSource.view(), allid);
            treeview.setDataSource(treeview.dataSource);
        }
    };

    // 设置单选框，给多个节点选中单选框
    control.prototype.setUnCheckedItems = function (allid) {
        // 定义数组包含函数
        Array.prototype.in_array = function (e) {
            for (i = 0; i < this.length; i++) {
                if (this[i] == e)
                    return true;
            }
            return false;
        }
        // 检查参数并处理
        if (allid && allid.length > 0) {
            var treeview = this.getElement().data("kendoTreeView");
            function changeCheckedStates(nodes, allid) {
                for (var i = 0; i < nodes.length; i++) {
                    // 设置父亲
                    if (allid.in_array(nodes[i].id))
                        nodes[i].checked = false;
                    // 设置孩子
                    if (nodes[i].hasChildren) {
                        changeCheckedStates(nodes[i].children.view(), allid);
                    }
                }
            }
            changeCheckedStates(treeview.dataSource.view(), allid);
            treeview.setDataSource(treeview.dataSource);
        }
    };

    // 给树赋值，把整棵森林或者一棵树给控件
    control.prototype.setValue = function (val) {
        if (val) {
            var tree = this.getElement().data("kendoTreeView");
            var nodes = [];
            var str = Object.prototype.toString.call(val);
            if (str === "[object Object]") {
                // 数据转换
                nodes[0] = transfer(val);
                dataFormat(nodes[0], val);
            }
            else {
                for (var i = 0; i < val.length; i++) {
                    // 数据转换
                    nodes[i] = transfer(val[i]);
                    dataFormat(nodes[i], val[i]);
                }
            }
            tree.setDataSource(new kendo.data.HierarchicalDataSource({ data: nodes }));
            var isExpandAll = tree.options.isExpandAll;
            if (isExpandAll !== false)
                tree.expand(".k-item");
        }
    };

    // 数据格式转换，将传过来的数据进行转换，转换成tree格式
    function transfer(data) {
        if (data != null) {
            var newData = {};
            for (var attr in data) {
                //if (attr == "name" || attr == "disPlayName" || attr == "displayName")
                //    newData["text"] = data[attr];
                if (attr == "children")
                    newData["items"] = new Array();
                else if (attr == "code") {
                    newData["code"] = data[attr];
                    // 先把ID付值为code的值
                    newData["id"] = data[attr];
                }
                else if (attr == "id") {
                    if (data[attr])
                        newData["id"] = data[attr];
                }
                else newData[attr] = data[attr];
                //newData["origData"] = data;
            }
            return newData;
        }
        return null;
    }

    // 数据格式反转，将本地数据格式转换成服务器的数据
    function transferGoBack(data) {
        if (data != null) {
            var goback = {};
            for (var attr in data) {
                if (data.hasOwnProperty(attr)) {
                    if (["_childrenOptions", "_events", "_loaded", "parent"]
            				.indexOf(attr) != -1) continue;
                    if (attr == "text") {
                        goback.name = data[attr];
                        goback.displayName = data[attr];
                        goback.disPlayName = data[attr];
                    }
                    else if (attr == "items")
                        goback.children = data[attr];
                    else
                        goback[attr] = data[attr];
                }
            }
            return goback;
        }
        return null;
    }

    // 递归实现树格式的转换，从服务器到本地树
    function dataFormat(mynode, geteddata) {
        if (geteddata.children && geteddata.children.length > 0) {
            for (var i = 0; i < geteddata.children.length; i++) {
                mynode.items[i] = transfer(geteddata.children[i]);
                dataFormat(mynode.items[i], geteddata.children[i]);
            }
        }
    }

    // 递归查找父下面的所有子
    function getChildCode(parent) {
        var childsCode = [];
        childsCode.push(parent.code);
        var childs = parent.items;
        for (var i = 0; i < childs.length; i++) {
            childsCode.push(childs[i].code);
            if (childs[i].items && childs[i].items.length > 0)
                getChildCode(childs[i]);

        }
        return childsCode;
    }

    // 删除
    control.prototype.removeByText = function (txt) {
        if (txt != null) {
            var tree = this.getElement().data("kendoTreeView");
            var bar = tree.findByText(txt);
            if (bar != null)
                tree.remove(bar);
        }
    };

    control.prototype.removeById = function (id) {
        if (id != null) {
            var tree = this.getElement().data("kendoTreeView");
            var bar = this.findById(id);
            if (bar != null)
                tree.remove(bar);
        }
    };

    control.prototype.removeNode = function (node) {
        if (node != null) {
            var tree = this.getElement().data("kendoTreeView");
            var bar = tree.findByUid(node.uid);
            if (bar != null)
                tree.remove(bar);
        }
    };

    control.prototype.getParentNode = function (node) {
        if (node != null) {
            var tree = this.getElement().data("kendoTreeView");
            var bar = tree.findByUid(node.uid);
            if (bar.length == 0) {
                bar = this.findById(node.id) || this.findById(node.code);
            }
            var parent = null;
            if (bar != null)
                parent = tree.parent(bar);
            return parent;
        }
    };

    control.prototype.setSelectNode = function (node) {
        if (node != null) {
            var tree = this.getElement().data("kendoTreeView");
            var bar = tree.findByUid(node.uid);
            if (bar.length == 0) {
                bar = this.findById(node.id) || this.findById(node.code);
            }
            if (bar != null) {
                tree.select(bar);
                tree._trigger("select", bar);

            }
        }
    };

    // 按 id 查找 item
    control.prototype.findById = function (id) {
        if (id != null) {
            var tree = this.getElement().data("kendoTreeView");
            var item = this.findbyid(tree.dataSource.view(), id);
            var bar = null;
            if (item && item.uid)
                bar = tree.findByUid(item.uid);
            return bar;
        }
        return null;
    };

    // id查找 递归函数
    control.prototype.findbyid = function (treeview, id) {
        if (treeview != null && id != null) {
            for (var j = 0; j < treeview.length; j++) {
                if (treeview[j].id === id || treeview[j].code === id) {//适配没id的情况
                    return treeview[j];
                }
                else {
                    if (treeview[j].items && treeview[j].items.length > 0) {
                        var result = this.findbyid(treeview[j].items, id);
                        if (result != null) {
                            return result;
                        }
                    }
                }
            }
        }
        return null;
    };

    // 删除node，并返回此node的item
    control.prototype.detachByText = function (txt) {
        if (txt != null) {
            var tree = this.getElement().data("kendoTreeView");
            var nodearr = tree.findByText(textkey);
            var itemarr = new Array();
            for (var i = 0; i < nodearr.length; i++) {
                tree.detach(nodearr[i]);
                itemarr.push(tree.dataItem(nodearr[i]));
            }
            return itemarr;
        }
        return null;
    };
    control.prototype.detachById = function (id) {
        if (id != null) {
            var tree = this.getElement().data("kendoTreeView");
            var nodearr = this.findById(id);
            var itemarr = new Array();
            for (var i = 0; i < nodearr.length; i++) {
                tree.detach(nodearr[i]);
                itemarr.push(tree.dataItem(nodearr[i]));
            }
            return itemarr;
        }
        return null;
    };

    // 扩展路径[id1,id2,id3]
    control.prototype.expandPath = function (idarr) {
        if (idarr != null) {
            var treeview = this.getElement().data("kendoTreeView");
            treeview.expandPath(idarr);
        }
    };

    // 扩展到指定id ，txt
    control.prototype.expandToById = function (id) {
        if (id != null) {
            var tree = this.getElement().data("kendoTreeView");
            tree.expandTo(id);
        }
    };
    control.prototype.expandToByText = function (txt) {
        if (txt != null) {
            var tree = this.getElement().data("kendoTreeView");
            var node = tree.findByText(txt);
            if (node != null) {
                var item = tree.dataItem(node);
                tree.expandTo(item);
            }
        }
    };

    // 在指定id的节点后面插入节点
    control.prototype.insertAfterById = function (id, node) {
        if (id != null && node != null) {
            var tree = this.getElement().data("kendoTreeView");
            var standedNode = this.findById(id);
            if (standedNode != null) {
                var newnode = transfer(node);
                dataFormat(newnode, node);
                tree.insertAfter(newnode, standedNode);
            }
        }
    };
    control.prototype.insertBeforeById = function (id, node) {
        if (id != null && node != null) {
            var tree = this.getElement().data("kendoTreeView");
            var standedNode = this.findById(id);
            if (standedNode != null) {
                var newnode = transfer(json.newnode);
                tree.insertBefore(newnode, standedNode);
            }
        }
    };

    // 得到指定id的父亲item
    control.prototype.getParentById = function (id) {
        if (id != null) {
            var tree = this.getElement().data("kendoTreeView");
            var node = this.findById(id);
            if (node != null) {
                var parent = tree.parent(node);
                var parentItem = tree.dataItem(parent);
                return parentItem;
            }
        }
    };

    control.prototype.appendNodes = function (dataSource) {
        var treeview = this.getElement().data("kendoTreeView");
        var nodes = [];
        var val = dataSource.data;
        var str = Object.prototype.toString.call(val);
        if (str === "[object Object]") {
            // 数据转换
            nodes[0] = transfer(val);
            dataFormat(nodes[0], val);
        }
        else {
            for (var i = 0; i < val.length; i++) {
                // 数据转换
                nodes[i] = transfer(val[i]);
                dataFormat(nodes[i], val[i]);
            }
        }
        parentNode = this.findById(dataSource.parentCode);
        treeview.append(nodes, parentNode);
    };

    control.prototype.setAllNodesEnable = function (val) {
        var treeview = this.getElement().data("kendoTreeView");
        if (val == true) {
            treeview.enable(".k-item");
        }
        else {
            treeview.enable(".k-item", false);
        }
    };

    /**
    * 修改树节点信息（code,name需要同步到树节点上，其他信息从dataSource里面去取）
    * @param {Object} oldNode
    * @param {Object} newNode
    */
    control.prototype.updateNode = function (oldNode, newNode) {
        var tree = this.getElement().data("kendoTreeView");
        var bar = tree.findByUid(oldNode.uid);
        if (bar.length == 0) {
            bar = this.findById(oldNode.id) || this.findById(oldNode.code);
        }
        var item = tree.dataItem(bar);
        item.set("code", newNode.code);
        item.set("name", newNode.name);
        item.set("imageUrl", newNode.imageUrl);
        // 处理颜色（操作DOM）
        var textSpans = bar.find("span:last-child");
        var textSpan = $(textSpans[textSpans.length - 1]);
        // 颜色
        if (newNode.color) {
            textSpan.css("color", newNode.color);
        } else {
            textSpan.css("color", "");
        }
    };

    /**
    * 重新加载孩子节点
    * @param {Object} node
    */
    control.prototype.reloadChildNode = function (node) {
        var tree = this.getElement().data("kendoTreeView");
        var item = tree.dataItem(this.findById(node.id));
        item.load();
    };

    return control;
});