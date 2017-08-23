/// <reference path="../../common/js/Cube.js" />
/// <reference path="customerApp_M.js" />

var customerViewModel_Extend = function () { };
customerViewModel_Extend.prototype.doAction = function (name, viewModel) {
    if (this[name])
        this[name](viewModel);
};
customerViewModel_Extend.prototype.tabMenuClick = function (viewModel, args) {

};
customerViewModel_Extend.prototype.editAction = function (viewModel, args) {
    /// <param name="viewModel" type="CustomerDetailViewModel">viewModel类型为CustomerDetailViewModel</param>
    if (viewModel.getsaveAction) viewModel.getsaveAction().setDisabled(false);
    if (viewModel.geteditAction) viewModel.geteditAction().setDisabled(true);
    if (viewModel.getcancelAction) viewModel.getcancelAction().setDisabled(false);
    if (viewModel.getaddLineAction) viewModel.getaddLineAction().setDisabled(false);
    viewModel.setReadOnly(false);
};
customerViewModel_Extend.prototype.deleteAction = function (viewModel, args) {
    /// <param name="viewModel" type="CustomerDetailViewModel">viewModel类型为CustomerDetailViewModel</param>
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
};
customerViewModel_Extend.prototype.relatedAction = function (viewModel, args) {
    /// <param name="viewModel" type="CustomerDetailViewModel">viewModel类型为CustomerDetailViewModel</param>
    var $part = $(".related-part");
    if (!$part.length) return;
    var pageUrl = cb.route.getPageUrl("common.related.CustomerRelated");
    $part.loadView(pageUrl, function () {
        $part.directRight2();
    });
};
customerViewModel_Extend.prototype.setAction = function (viewModel, args) {
    /// <param name="viewModel" type="CustomerDetailViewModel">viewModel类型为CustomerDetailViewModel</param>
    alert(args + "功能正在开发中...");
};
customerViewModel_Extend.prototype.outputAction = function (viewModel, args) {
    /// <param name="viewModel" type="CustomerDetailViewModel">viewModel类型为CustomerDetailViewModel</param>
    alert(args + "功能正在开发中...");
};
customerViewModel_Extend.prototype.cancelAction = function (viewModel, args) {
    /// <param name="viewModel" type="CustomerDetailViewModel">viewModel类型为CustomerDetailViewModel</param>
    //alert(args + "功能正在开发中...");
    if (viewModel.getsaveAction) viewModel.getsaveAction().setDisabled(true);
    if (viewModel.geteditAction) viewModel.geteditAction().setDisabled(false);
    if (viewModel.getcancelAction) viewModel.getcancelAction().setDisabled(true);
};
customerViewModel_Extend.prototype.saveAction = function (viewModel, args) {
    /// <param name="viewModel" type="CustomerDetailViewModel">viewModel类型为CustomerDetailViewModel</param>
    if (!viewModel.validate() || !this.symbol || !this.mode) return;
    var params = viewModel.collectData();
    var callback = function (success, fail) {
        if (fail) {
            alert("保存失败");
            return;
        }
        alert("保存成功");
        if (viewModel.getsaveAction) viewModel.getsaveAction().setDisabled(true);
        if (viewModel.geteditAction) viewModel.geteditAction().setDisabled(false);
        if (viewModel.getcancelAction) viewModel.getcancelAction().setDisabled(true);
        viewModel.setReadOnly(true);
    };
    // UPDATED = 1;//更新
    // NEW = 2;//新增
    if (this.mode === "add") params.state = 2
    else if (this.mode === "view") params.state = 1;
    cb.data.CommonProxy(this.symbol).Save(params, callback);
};
customerViewModel_Extend.prototype.init_Extend = function (viewModel) {
    /// <param name="viewModel" type="customerViewModel">viewModel类型为customerViewModel</param>

    //viewModel.getModel3D().set("dsMode", "Local");
    //viewModel.getModel3D().set("pageSize", -1);


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
        if (viewModel.getaddLineAction) viewModel.getaddLineAction().setDisabled(false);
        viewModel.setReadOnly(false);
        cb.model.PropertyChange.doPropertyChange();

        var nodeInfo = params.nodeInfo;
        if (nodeInfo != null && nodeInfo.pk != null) {
            viewModel.getcscode().setValue(nodeInfo.pk)
            //viewModel.getccusmnemcode().setValue(nodeInfo.pk);
        }

    }
    else if (this.mode === "view") {
        if (viewModel.getsaveAction) viewModel.getsaveAction().setDisabled(true);
        if (viewModel.geteditAction) viewModel.geteditAction().setDisabled(false);
        if (viewModel.getcancelAction) viewModel.getcancelAction().setDisabled(true);
        if (viewModel.getaddLineAction) viewModel.getaddLineAction().setDisabled(true);

        cb.data.CommonProxy(this.symbol).QueryByPK(params.id, function (success, fail) {
            if (fail) {
                alert("读取数据失败");
                return;
            }
            viewModel.loadData(success);
            viewModel.setReadOnly(true);

            cb.model.PropertyChange.doPropertyChange();
        });
    }
};
