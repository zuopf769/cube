//var ReferTable_Extend = $.extend(ReferBase_Extend);
var ReferTable_Extend={
	doAction: function (name, viewModel) {
        if (this[name]) this[name](viewModel);
    },    
	init_Extend:function (viewModel) {
		var self = this;

		this.paras = cb.route.getViewPartParams(viewModel);
		if (this.paras.filters) {
			viewModel.getSearch().setValue(this.paras.filters);
		}
		var grid = viewModel.getGrid();
		var pageSize = 10;
		grid.setData({
			pageSize: pageSize,
			pageIndex: 0
		});
		var tableInfo = { "code": "", "pageSize": pageSize, "pageIndex": 1 };
		var options = this.getReadOptions(viewModel, null, tableInfo);

		grid.setDataSource(viewModel.getProxy(), 'load', options, null, function (data) {
		    grid.setState('columnCode', data.columnCode);
			var data = data.table;
			var columns = data.columns;
			delete data.columns;
			viewModel.getSearch().set('placeholder', data.presetFilterTips);
			grid.setColumns(cb.data.commonCRUD(viewModel).convertToColumns(columns));

			grid.setPageRows(data);
		}, function (data) {
		    return data.table;
		}, function (params,pageInfo) {
		    params.table = params.table || {};
		    params.table.pageSize = pageInfo.pageSize;
		    params.table.pageIndex = pageInfo.pageIndex;
		});

		grid.un("clickcell");
		grid.on("clickcell", function (args) {
		    new cb.data.commonCRUD(viewModel).openLink(args);
		});
	},
	//获取查询过滤信息
	getSearchFilter:function(viewModel){
		var filterValue = viewModel.getSearch().getValue();
		
		return filterValue && filterValue.length != 0?[{ "value": filterValue }]:null;
	},
	closeAction: function (viewModel) {
	    this.saveColumn(viewModel);
        cb.route.hidePageViewPart(viewModel);
		this.clearData(viewModel);
		
	},

    submitAction: function (viewModel) {
		var data = viewModel.getGrid().getSelectedRows();
		this.setReturnData(viewModel, { data: data });

		this.closeAction(viewModel);
	},

    cancelAction: function (viewModel) {
		this.closeAction(viewModel);    
	},
	//双击行时，相当于选择行后立即确定
	onDblClickRow:function(viewModel,data){
		if (!data) return;
		var grid=viewModel.getGrid()

		//双击时，选择被双击的行，该行处于活动行
		//var focusedIndex=grid.getFocusedIndex();
		grid.select(data.index);
		
		this.submitAction(viewModel);
	},
    setData:function(viewModel,data){},

    getReferCode:function(viewModel){
		return this.paras&&this.paras.refCode||new cb.QueryString(location.href).get("refCode");
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
            if (filterValue) {
                tableInfo.filters = [{ "value": filterValue }];
            }
            if (viewModel.get("selectedItem")) {
                tableInfo.code = viewModel.get("selectedItem").pk;
            }
            var queryData = this.paras.queryData;
            var options = $.extend(true, { "refCode": refCode, "requestFlag": 1 }, queryData);
            options.tree = treeInfo ? { "code": treeInfo.code, "pageIndex": treeInfo.pageIndex, "pageSize": treeInfo.pageSize } : null;
            options.table = tableInfo ? { "code": tableInfo.code, "pageIndex": tableInfo.pageIndex, "pageSize": tableInfo.pageSize, "filters": tableInfo.filters } : null;

            return options;
        }

        return null;
    },

    setGridData: function (viewModel, data, init) {
        console.log("参照设置表数据开始");
        var grid = viewModel.getGrid();    
		//当前页信息
        var pageData = {
            pageSize:data.pageSize,
            pageIndex:data.pageIndex,
            pageCount:data.pageCount,
            totalCount:data.totalCount,
            currentPageData: data.currentPageData,
        };

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
            //pageData.mode = "override";
            grid.setPageRows(pageData);
        }
        else {
            //dataSource.mode = "append";
            grid.setPageRows(pageData);
        }

        console.log("参照设置表数据结束");
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
  

    //itemClick: function (viewModel, args) {
    //    this.setReturnData(viewModel, args);
    //    this.closeAction(viewModel);
    //},


    setAction: function (viewModel, args) {
        var self = this;

          
        if (viewModel.getReadOnly() || viewModel.getDisabled()) return;
        var listCard = viewModel.getGrid();
        var columnCode = listCard.getState("columnCode");
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
            var options = this.getReadOptions(viewModel, null, tableInfo);

			grid.setDataSource(viewModel.getProxy(), 'load', options,null, function (data) {
				var data = data.table;
				var columns = data.columns;
				delete data.columns;
				grid.setColumns(cb.data.commonCRUD(viewModel).convertToColumns(columns));

				grid.setPageRows(data);
			}, function (data) {
			    return data.table;
			},function (params,pageInfo) {
			    params.table = params.table || {};
			    params.table.pageSize = pageInfo.pageSize;
			    params.table.pageIndex = pageInfo.pageIndex;
			});
        }
    },

    //搜索,不需要修改表头，只需刷新table中的数据
    searchClick: function (viewModel, args) {
        var grid = viewModel.getGrid();

        var pageInfo = grid.getPageInfo();     

        if(grid){
            var tableInfo = { "code": "", "pageIndex": 1, "pageSize": pageInfo.pageSize };//查询后显示第一页数据
            var options = this.getReadOptions(viewModel, null, tableInfo);

			grid.setDataSource(viewModel.getProxy(), 'load', options, null, function (data) {
			    grid.setPageRows(data.table);
			}, function (data) {
			    return data.table;
			},function (params,pageInfo) {
			    params.table = params.table || {};
			    params.table.pageSize = pageInfo.pageSize;
			    params.table.pageIndex = pageInfo.pageIndex;
			});
        }
    },
    //退出参照页面时，保存栏目（宽度）
    saveColumn: function (viewModel) {

        var grid = viewModel.getGrid();
        if (!grid.getState('columnResized')) return;//没有改变直接返回

        var ts = cb.util.formatDateTime(new Date());
        var colsInfo = [];

        var data = { columncode: grid.getState('columnCode'), "columntype": "0", columnlevel: '2', 'pk_entitycolumn_b': colsInfo ,ts:ts};
        
        var Update = cb.model.DataState.Update;
        
        var cols = grid.getColumns();

        for (var i=0,len = cols.length; i < len; i++) {
            var col = cols[i];
            if (typeof col.width === 'number') {
                colsInfo.push({ fieldaliascode: col.fieldName, fieldwidth: col.width, state: Update, ts: ts });
            }
        }
        if (colsInfo.length) {
            viewModel.getProxy().saveColumn(data, function (sucess, fail) {
                if (fail) {
                    cb.util.tipMessage("保存栏目失败。");
                }
            });
        }

    },
    clearData:function(viewModel){
		
        var grid = viewModel.getGrid();
        if (grid) {
            grid.setColumns({});
        }
		var filter = viewModel.getSearch();
		if(filter){
			filter.setValue("");
		}
		
    }
};
