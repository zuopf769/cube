var SysHomeViewModel_Extend = {
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
    },

    doAction: function (name, viewModel) {
        if (this[name]) this[name](viewModel);
    },
    controlTreeAction: function (viewModel) {
        var tree = $('.nav');
        var content = $('.super-content');
        tree.toggleClass('col-lg-3');
        if (!tree.hasClass("col-lg-3")) {
            tree.css({ display: "none" })
        } else {
            tree.css({ display: "block" })
        }
        content.toggleClass('col-lg-9');
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

    init_Extend: function (viewModel) {
        //cb.route.loadViewPart(viewModel, appId, '[data-related]> [data-content="baseinfo"]');



        /**管理树节点*/
        var nodeUtil = this.nodeUtil();


        /*记录所有数据翻页信息*/
        /*
        var getData = function (code,callBack) {
            var options = {};
            options.params = { "parent" : code}
            options.callback = callBack;
            //viewModel.getProxy().GetSubMenu(options);
            viewModel.getProxy().GetSubMenu({ "parent": code }, callBack);
        } */

        var that = this;

        var registEvent = function () {

            //注册展开事件
            viewModel.getMenuTree().on("beforeExpand", function (data) {
                if (data) {
                    if (data.getLevel() >= 2) {
                        if (data.loaded === undefined) {
                            //将数据设置到右边全景菜单中   
                            that.getData(data.code, viewModel, function (sucess, fail) {
                                nodeUtil.buildTreeNode(data, sucess.children);
                                data.loaded = true;
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
            });
            //注册点击事件
            viewModel.getMenuTree().on("click", function (data) {
                
                    if (data.isLeaf) {
                        var queryStringParent = new cb.util.queryString(location.search);
                        if (queryStringParent.get('isSys') == "true") {
                           data.displayName = data.displayName?data.displayName:data.name;
                            if (data.appId && data.displayName ) {
                                var appParams = cb.route.getAppParamsFromMenu(data);
                                if (!appParams.appId) {
                                    appParams.appId = data.url;
                                }
                                appParams.appId = data.appId;
                                
                                //$(".super-content").children().css({ display: "none" });

                                //if ($(".super-content").children('[data-relate="' + appParams.appId + '"]').length > 0) {
                                //    $(".super-content").children('[data-relate="' + appParams.appId + '"]').css({ display: "block" });
                                //} else {

                                //    var ele = $('<div data-relate="' + appParams.appId + '"></div>').appendTo($(".super-content"))
                                //   // cb.route.loadViewPart(viewModel, appParams.appId, ele);
                                //}
                                //appParams.params.tabName = 'tabMenu1';
                                cb.route.loadTabViewPart(viewModel, appParams.appId, { tabName: 'tabMenu1', title: data.displayName });
                                //$(".funcslist").css("display", "none");
                            }
                        } else {
                            self.callback.call(self.context, self.parentViewModel, data);
                        }
                    }
            
            });

			$('[data-propertyname="tabMenu"]').parent().css("display",'none');
			/*
			$('nav').mouseover(function(){
				$('[data-propertyname="controlTreeAction"]').css("display","block");
			});
			$('nav').mouseout(function(){
				$('[data-propertyname="controlTreeAction"]').css("display","none");
			});
			*/
			$('.content').css('width',"100%");
        };


        function getDomainData(callBack) {
            var options = {};
            options.callback = callBack;
            viewModel.getProxy().GetDomainMenu(options);
        };


        //注册事件
        registEvent();

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
        var nodeUtil = this.nodeUtil();

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