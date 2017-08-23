/// <reference path="../../common/js/Cube.js" />
/// <reference path="CustomerCatalogDetailApp_M.js" />

var CustomerCatalogDetailViewModel_Extend = {
    doAction: function (name, viewModel) {
        if (this[name])
            this[name](viewModel);
    },
    tabMenuClick: function (viewModel, args) {

    },
    addAction: function (viewModel, args) {
        /// <param name="viewModel" type="CustomerCatalogDetailViewModel">viewModel类型为CustomerCatalogDetailViewModel</param>
        this.editAction(viewModel, args);
    },
    editAction: function (viewModel, args) {
        /// <param name="viewModel" type="CustomerCatalogDetailViewModel">viewModel类型为CustomerCatalogDetailViewModel</param>
        if (viewModel.getsaveAction) viewModel.getsaveAction().setDisabled(false);
        if (viewModel.geteditAction) viewModel.geteditAction().setDisabled(true);
        if (viewModel.getcancelAction) viewModel.getcancelAction().setDisabled(false);
        if (viewModel.getdeleteAction) viewModel.getdeleteAction().setDisabled(true);
        viewModel.setReadOnly(false);
    },
    deleteAction: function (viewModel, args) {
        /// <param name="viewModel" type="CustomerCatalogDetailViewModel">viewModel类型为CustomerCatalogDetailViewModel</param>
        var msg = "您真的确定要删除吗？\n\n请确认！";
        if (!confirm(msg)) return;
        if (!this.symbol) return;
        var data = cb.biz.getInputData(viewModel);
        cb.data.CommonProxy(this.symbol).Delete(data, function (success, fail) {
            if (fail) {
                alert("删除失败");
                return;
            }
            alert("删除成功");
        });
    },
    cancelAction: function (viewModel, args) {
        /// <param name="viewModel" type="CustomerCatalogDetailViewModel">viewModel类型为CustomerCatalogDetailViewModel</param>
        alert(args + "功能正在开发中...");
    },
    saveAction: function (viewModel, args) {
        /// <param name="viewModel" type="CustomerCatalogDetailViewModel">viewModel类型为CustomerCatalogDetailViewModel</param>
        debugger;
        if (!viewModel.validate() || !this.symbol || !this.mode) return;
        var params = viewModel.collectData();
        var callback = function (success, fail) {
            if (fail) {
                alert("保存失败");
                return;
            }
            alert("保存成功");
        };
        // UPDATED = 1;//更新
        // NEW = 2;//新增
        if (this.mode === "add") params.state = 2
        else if (this.mode === "view") params.state = 1;
        cb.data.CommonProxy(this.symbol).Save(params, callback);
    },
    init_Extend: function (viewModel) {
        /// <param name="viewModel" type="CustomerCatalogDetailViewModel">viewModel类型为CustomerCatalogDetailViewModel</param>
        var params = cb.route.getViewPartParams(viewModel);
        if (!params) return;
        this.symbol = viewModel.getSymbol();
        if (!this.symbol) return;
        this.mode = params.mode;
        if (!this.mode) return;
        cb.model.PropertyChange.delayPropertyChange(true);
        viewModel.clear();
        if (this.mode === "add") {
            if (viewModel.getsaveAction) viewModel.getsaveAction().setDisabled(false);
            if (viewModel.geteditAction) viewModel.geteditAction().setDisabled(true);
            if (viewModel.getcancelAction) viewModel.getcancelAction().setDisabled(false);
            if (viewModel.getdeleteAction) viewModel.getdeleteAction().setDisabled(true);
            viewModel.setReadOnly(false);
            cb.model.PropertyChange.doPropertyChange();
        }
        else if (this.mode === "view") {
            if (viewModel.getsaveAction) viewModel.getsaveAction().setDisabled(true);
            if (viewModel.geteditAction) viewModel.geteditAction().setDisabled(false);
            if (viewModel.getcancelAction) viewModel.getcancelAction().setDisabled(true);
            if (viewModel.getdeleteAction) viewModel.getdeleteAction().setDisabled(false);
            cb.data.CommonProxy(this.symbol).QueryByCode(params.code, function (success, fail) {
                if (fail) {
                    alert("读取数据失败");
                    return;
                }
                viewModel.loadData(success);
                viewModel.setReadOnly(true);
                cb.model.PropertyChange.doPropertyChange();
            });
        }
    }
};