var CatalogViewModel_Extend = {

    doAction: function (name, viewModel) {
        if (this[name]) this[name](viewModel);
    },

    beforeExpand: function (viewModel, data) {
        this.ch.beforeExpand(data, viewModel, this.queryData, this)
    },

    catalogClick: function (viewModel, data) {
        try {
            this.callback.call(this.context, this.parentViewModel, data);
        }
        catch (e) {
        }
    },

    catalogMoreClick: function (viewModel, data) {
        this.ch.catalogMoreClick(data, viewModel, this.queryData, this)
    },

    queryData: function (viewModel, nodeCode, pageSize, pageIndex, callBack) {
        var symbol = viewModel.getSymbol();
        if (symbol != null) {
            var params = cb.route.getViewPartParams(viewModel);
            if (params && params.treeFunctionId) {
                cb.data.CommonProxy(symbol).QueryTree({
                    "treeFunctionId": params.treeFunctionId,
                    "querySchemeID": "",
                    "nodeCode": nodeCode,
                    "pageSize": pageSize,
                    "pageIndex": pageIndex,
                    "maxLevel": 3
                }, callBack);
            }
        }
    },

    init_Extend: function (viewModel) {
        try {
            var params = cb.route.getViewPartParams(viewModel);
            if (!params) return;
            this.parentViewModel = params.parentViewModel;
            this.callback = params.callback;
            this.context = params.context;

            if (!this.parentViewModel || !this.callback || !this.context) return;
        }
        catch (e) {
            //无参数
        }

        this.ch = new cb.util.CatalogHelper(viewModel.getCatalog(), viewModel.getPageSize());
        this.ch.init("", viewModel, this.queryData);

    },

    cancelAction: function (viewModel) {

    },

    okAction: function (viewModel) {

    }


};