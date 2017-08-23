

var ReferBase_Extend = {
    doAction: function (name, viewModel) {
        if (this[name]) this[name](viewModel);
    },    

    init_Extend: function (viewModel) { },

    closeAction: function (viewModel) { },

    submitAction: function (viewModel) { },

    cancelAction: function (viewModel) { },

    setData:function(viewModel,data){},

    getReferCode:function(viewModel){
        var refCode = null;        
        if (this.paras) {            
            if (this.paras.refCode) {
                refCode = this.paras.refCode;
            }

        }
        else {
            var query = new cb.QueryString(location.href);
            refCode = query.get("refCode");
        }

        return refCode;
    },

    init_paras :function(viewModel){
        this.paras = cb.route.getViewPartParams(viewModel);
        if(this.paras.filters){
            viewModel.getSearch().setValue(this.paras.filters);
        }
    },

    getReadOptions: function (viewModel, treeInfo, tableInfo) {

        var refCode = this.getReferCode(viewModel);        

        if (refCode) {
            var filterValue = viewModel.getSearch().getValue();
            if (filterValue && filterValue.length != 0) {
                tableInfo.filters = [{ "value": filterValue }];
            }
            else {
                tableInfo.filters = null;
            }

            var options = { "refCode":refCode, "requestFlag": 1 };
            options.tree = treeInfo ? { "code": treeInfo.code, "pageIndex": treeInfo.pageIndex, "pageSize": treeInfo.pageSize } : null;
            options.table = tableInfo ? { "code": tableInfo.code, "pageIndex": tableInfo.pageIndex, "pageSize": tableInfo.pageSize, "filters": tableInfo.filters } : null;
            //options.refCode = "cd_treetable";
            return options;
        }

        return null;
    },

    queryData: function (viewModel, treeInfo, tableInfo, callBack) {
        console.log("参照开始到服务端读取数据");
        var options = this.getReadOptions(viewModel, treeInfo, tableInfo);

        if(options){
            var that = this;      
            viewModel.getProxy().load(options,
                function (data, fail) {
                    if (fail) {
                        alert("获取参照失败");
                        return;
                    }
                    console.log("参照获取到数据");
                    callBack(data);              
                }
            );
        }
    },

    queryTreeData: function (viewModel, nodeCode, pageSize, pageIndex, callBack) {
        
        var treeInfo = { "code": nodeCode, "pageIndex": pageIndex, "pageSize": pageSize };

        this.queryData(viewModel, treeInfo, null, function (data) {
            callBack(data.tree);
        });         
    },


    changePage: function (viewModel, args) {

        var tableInfo = { "code": "", "pageIndex": args.pageIndex, "pageSize": args.pageSize, "filters": null };
        if (viewModel.get("selectedItem")) {
            tableInfo.code = viewModel.get("selectedItem").pk;
        }       

        /*翻页不算初始化*/
        var self =this, init = false;
        this.queryData(viewModel, null, tableInfo, function (data) {
            self.setGridData(viewModel, data.table, init);
        });
    },
   

    setGridData: function (viewModel, data, init) {
        console.log("参照设置表数据开始");
        var grid = viewModel.getGrid();    

        var dataSource = {
            pageSize:data.pageSize,
            pageIndex:data.pageIndex,
            pageCount:data.pageCount,
            totalCount:data.totalCount,
            currentPageData: data.currentPageData,
        }

        if (init) {            
            grid.setData({                
                fields: {
                    "leftTopField": data.columns[0],
                    "rightTopField": data.columns[1],
                    "leftBottomField": data.columns[2],
                    "rightBottomField": data.columns[3]
                }
            });

            grid.setColumns(cb.data.commonCRUD(viewModel).convertToColumns(data.columns));
            dataSource.mode = "override";
            grid.setPageRows(dataSource);
        }
        else {
            dataSource.mode = "append";
            grid.setPageRows(dataSource);
        }

        console.log("参照设置表数据结束");
    },   

    init_Grid: function (viewModel, data) {
        var grid = viewModel.getGrid();
        grid.setData({ mode: "archives" });
       
        this.setGridData(viewModel, data, 1);
    },

    init_Tree : function(viewModel,data){
        var self = this;
        var catalog = viewModel.get("Catalog");
        if (catalog) {
            console.log("参照初始化树数据开始");            
            this.ch = this.ch ? this.ch: new cb.util.CatalogHelper(viewModel.getCatalog(), viewModel.getTreePageSize());
            this.ch.init("", viewModel, data);
            console.log("参照初始化树数据结束");
        }
    },

    beforeExpand: function (viewModel, data) {
        this.ch.beforeExpand(data, viewModel, this.queryTreeData, this);
    },

    catalogMoreClick: function (viewModel, data) {
        this.ch.catalogMoreClick(data, viewModel, this.queryTreeData, this);
    },

    setReturnData: function (viewModel, args) {
        //debugger;
        if (!args) return;

        if (!args.data) return;

        var paras = cb.route.getViewPartParams(viewModel);

        if (paras != null && paras.callBack != null) {
            paras.callBack(args);
        }       
    },
  

    itemClick: function (viewModel, args) {
        this.setReturnData(viewModel, args);
        this.closeAction(viewModel);
    },

    catalogClick: function (viewModel, data) { },

    setAction: function (viewModel, args) {
        var self = this;

          
        if (viewModel.getReadOnly() || viewModel.getDisabled()) return;
        var columnCode = viewModel.get("columnCode");
        if (!columnCode) return;                             

        cb.route.loadPageViewPart(viewModel,cb.route.CommonAppEnum.Column, {
            columnCode: columnCode, type: "0", callBack: function (refresh,data) {
                if(refresh){
                    self.updateColumn(viewModel,data);
                }
            }});
    },

    updateColumn:function(viewModel,data){
        //更新栏目data中包含了栏目信息，即更新列表的列信息
        //第一步：更新栏目

        var self = this;
        var listCard = viewModel.getGrid();
        if (listCard) {

            listCard.setData({
                fields: {
                    "leftTopField": data.columns[0],
                    "rightTopField": data.columns[1],
                    "leftBottomField": data.columns[2],
                    "rightBottomField": data.columns[3]
                }
            });

            listCard.setColumns(data.columns);

            //第二步：刷新数据
            this.refreshAction(viewModel);
        }
    },

    refreshAction: function (viewModel) {
        var grid = viewModel.getGrid();

        var pageInfo = grid.getPageInfo();     

        if(grid){
            var tableInfo = { "code": "", "pageIndex": pageInfo.pageIndex, "pageSize": pageInfo.pageSize };
            if (viewModel.get("selectedItem")) {
                tableInfo.code = viewModel.get("selectedItem").pk;
            }

            /*刷新，包括数据和栏目*/
            var self = this, init = true;
            this.queryData(viewModel, null, tableInfo, function (data) {
                self.setGridData(viewModel, data.table, init);
            });
        }
    },

    //搜索
    searchClick: function (viewModel, args) {
        this.refreshAction(viewModel);
    },


    clearData:function(viewModel){
        var grid = viewModel.getGrid();
        if (grid) {
            grid.setColumns(new Object());
            grid.setColumns([]);
        }
		var filter = viewModel.getSearch();
		if(filter){
			filter.setValue("");
		}
    },

    //双击选中行，相当于选中某行，然后确定
    activeRowClick:function(viewModel, args){
        if (this.submitAction) {
            this.submitAction(viewModel);
        }
    }
}

