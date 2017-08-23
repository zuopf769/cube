/// <reference path="../../common/js/Cube.js" />
/// <reference path="CustomerCatalogApp_M.js" />

var CustomerCatalogViewModel_Extend = {
	doAction: function (name, viewModel) {
        if (this[name])
            this[name](viewModel);
    },
    catalogBeforeExpand: function (viewModel, args) {
        /// <param name="viewModel" type="">viewModel类型为</param>
        
    },
    catalogClick: function (viewModel, args) {
        /// <param name="viewModel" type="">viewModel类型为</param>
        
    },
    catalogMoreClick: function (viewModel, args) {
        /// <param name="viewModel" type="">viewModel类型为</param>
        
    },
    addAction: function (viewModel, args) {
        /// <param name="viewModel" type="">viewModel类型为</param>
        
    },
    editAction: function (viewModel, args) {
        /// <param name="viewModel" type="">viewModel类型为</param>
        
    },
    deleteAction: function (viewModel, args) {
        /// <param name="viewModel" type="">viewModel类型为</param>
        
    },
    cancelAction: function (viewModel, args) {
        /// <param name="viewModel" type="">viewModel类型为</param>
        
    },
    saveAction: function (viewModel, args) {
        /// <param name="viewModel" type="">viewModel类型为</param>
        
    },
	queryData: function (viewModel, nodeCode, pageSize, pageIndex, callBack) {
		var symbol = viewModel.getSymbol();
        if (symbol != null) {
            cb.data.CommonProxy(symbol).QueryTree({
                "treeFunctionId": "U8100108",
                "querySchemeID": "",
                "nodeCode": nodeCode,
                "pageSize": pageSize,
                "pageIndex": pageIndex,
                "maxLevel": 3
            }, callBack);
        }
    },
    init_Extend: function (viewModel) {
        /// <param name="viewModel" type="CustomerCatalogViewModel">viewModel类型为CustomerCatalogViewModel</param>
		this.ch = new cb.util.CatalogHelper(viewModel.getcustomerCatalog(), 10);
		this.ch.init("", viewModel, this.queryData);
    }
};
