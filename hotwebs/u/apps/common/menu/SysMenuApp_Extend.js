var SysPanoramaMenuViewModel_Extend = {
    nodeUtil: MenuNodeUtil.NodeUtil(),

    doAction: function (name, viewModel) {
        if (this[name]) this[name](viewModel);
    },   

    init_Extend: function (viewModel) {

        debugger;
        
        var that = this;
        var registEvent = function () {

            //注册点击事件
            viewModel.getMenuTree().on("click", function (data) {
                try {                   
                    if (data.appId && data.name && data.isLeaf) {
                        cb.route.loadTabViewPart(viewModel, data.appId, { "title": data.name });
                        $(".funcslist").css("display", "none");
                    }
                }
                catch (e) {
                }
            });           
        };


        function getDomainData(callBack) {
            var options = {};
            options.callback = callBack;
            viewModel.getProxy().GetMenu(options);
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
            var rootNode = that.nodeUtil.createTreeNode(data, true);
            that.nodeUtil.buildTreeNode(rootNode, data.children);
            //初始化数据
            viewModel.getMenuTree().set("Rows", rootNode);
        });
    }      
};