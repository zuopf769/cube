/// <reference path="../../common/js/Cube.js" />
/// <reference path="customerAppViewModel_archive_M.js" />

cb.viewmodel.u8_customerAppViewModel_archive_Extend = function () {};
cb.viewmodel.u8_customerAppViewModel_archive_Extend.prototype.doAction = function (name, viewModel) {
    if (this[name])
        this[name](viewModel);
};
cb.viewmodel.u8_customerAppViewModel_archive_Extend.prototype.tabMenuClick = function (viewModel, args) {

};

    cb.viewmodel.u8_customerAppViewModel_archive_Extend.prototype.returnAction = function (viewModel, args) {
        ///<param name="viewModel" type="">viewModel类型为</param>
    };

    cb.viewmodel.u8_customerAppViewModel_archive_Extend.prototype.copyAction = function (viewModel, args) {
        ///<param name="viewModel" type="">viewModel类型为</param>
    };

    cb.viewmodel.u8_customerAppViewModel_archive_Extend.prototype.addAction = function (viewModel, args) {
        ///<param name="viewModel" type="">viewModel类型为</param>
    };

    cb.viewmodel.u8_customerAppViewModel_archive_Extend.prototype.saveAction = function (viewModel, args) {
        ///<param name="viewModel" type="">viewModel类型为</param>
    };

    cb.viewmodel.u8_customerAppViewModel_archive_Extend.prototype.editAction = function (viewModel, args) {
        ///<param name="viewModel" type="">viewModel类型为</param>
    };

    cb.viewmodel.u8_customerAppViewModel_archive_Extend.prototype.deleteAction = function (viewModel, args) {
        ///<param name="viewModel" type="">viewModel类型为</param>
    };

    cb.viewmodel.u8_customerAppViewModel_archive_Extend.prototype.cancelAction = function (viewModel, args) {
        ///<param name="viewModel" type="">viewModel类型为</param>
    };

    cb.viewmodel.u8_customerAppViewModel_archive_Extend.prototype.nextAction = function (viewModel, args) {
        ///<param name="viewModel" type="">viewModel类型为</param>
    };

    cb.viewmodel.u8_customerAppViewModel_archive_Extend.prototype.prevAction = function (viewModel, args) {
        ///<param name="viewModel" type="">viewModel类型为</param>
    };

    cb.viewmodel.u8_customerAppViewModel_archive_Extend.prototype.printAction = function (viewModel, args) {
        ///<param name="viewModel" type="">viewModel类型为</param>
    };


cb.viewmodel.u8_customerAppViewModel_archive_Extend.prototype.callBack = function (){
    debugger;
    var commonFunc= this.commonFunc;

    //关闭页签提示保存
    if(this.isDirty()) {
    // return commonFunc.hintSave( recallBack );
      return confirm("你即将离开当前页签");
    };
};
cb.viewmodel.u8_customerAppViewModel_archive_Extend.prototype.initializeOneTime = function (viewModel) {

};
cb.viewmodel.u8_customerAppViewModel_archive_Extend.prototype.init_Extend = function (viewModel) {
    /// <param name="viewModel" type="customerAppViewModel_archive">viewModel类型为customerAppViewModel_archive</param>
    var params = cb.route.getViewPartParams(viewModel);
    if (!params) return;
    this.symbol = viewModel.getSymbol();
    if (!this.symbol) return;
    this.mode = params.mode;
    if (!this.mode) return;

    cb.model.PropertyChange.delayPropertyChange(true);

    if (this.mode === "add") {

        viewModel.setState("add");
        viewModel.newRecord();
        //带入客户分类编码
        var id = params.nodeInfo && params.nodeInfo.id || null;
        viewModel.getcscode().setValue(id);

        viewModel.commonFunc.loadDefaultValue();
        viewModel.setReadOnly(false);
        cb.model.PropertyChange.doPropertyChange();
    } else if (this.mode === "view") {

        viewModel.setState("browse");
        cb.data.CommonProxy(this.symbol).QueryByPK({ id: params.id }, function (success, fail) {
            if (fail) {
                cb.util.warningMessage("查询卡片数据失败");
                return;
            }
            viewModel.loadData(success);
            viewModel.setReadOnly(true);

            cb.model.PropertyChange.doPropertyChange();
        });
    } else if (this.mode === "edit") {

        viewModel.setState("edit");
        cb.data.CommonProxy(this.symbol).QueryByPK({ id: params.id }, function (success, fail) {
            if (fail) {
                cb.util.warningMessage("查询卡片数据失败");
                return;
            };
            viewModel.loadData(success);
            viewModel.setReadOnly(false);
            cb.model.PropertyChange.doPropertyChange();
        });
    };

    cb.route.unsubscribeMessage(params.parentViewModel, "beforeTabMenuClose", this.callBack);
    cb.route.subscribeMessage(params.parentViewModel, "beforeTabMenuClose", this.callBack, viewModel);
};