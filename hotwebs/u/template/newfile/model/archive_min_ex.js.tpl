/// <reference path="../../common/js/Cube.js" />
/// <reference path="<%=application.viewmodel.name%>_M.js" />

cb.viewmodel.<%=application.moduleName%>_<%=application.viewmodel.extendName%> = function () {};
cb.viewmodel.<%=application.moduleName%>_<%=application.viewmodel.extendName%>.prototype.doAction = function (name, viewModel) {
    if (this[name])
        this[name](viewModel);
};
cb.viewmodel.<%=application.moduleName%>_<%=application.viewmodel.extendName%>.prototype.tabMenuClick = function (viewModel, args) {

};
<%for(var i=0,len=application.viewmodel.actions.length;i<len;i++){%>
    cb.viewmodel.<%=application.moduleName%>_<%=application.viewmodel.extendName%>.prototype.<%=application.viewmodel.actions[i].functionName%> = function (viewModel, args) {
        ///<param name="viewModel" type="<%application.viewmodel.name%>">viewModel类型为<%application.viewmodel.name%></param>
    };
<%}%>

cb.viewmodel.<%=application.moduleName%>_<%=application.viewmodel.extendName%>.prototype.callBack = function (){
    debugger;
    var commonFunc= this.commonFunc;

    //关闭页签提示保存
    if(this.isDirty()) {
    // return commonFunc.hintSave( recallBack );
      return confirm("你即将离开当前页签");
    };
};
cb.viewmodel.<%=application.moduleName%>_<%=application.viewmodel.extendName%>.prototype.initializeOneTime = function (viewModel) {

};
cb.viewmodel.<%=application.moduleName%>_<%=application.viewmodel.extendName%>.prototype.init_Extend = function (viewModel) {
    /// <param name="viewModel" type="<%=application.viewmodel.name%>">viewModel类型为<%=application.viewmodel.name%></param>
    var params = cb.route.getViewPartParams(viewModel);
    if (!params) return;
    this.symbol = viewModel.getSymbol();
    if (!this.symbol) return;
    this.mode = params.mode;
    if (!this.mode) return;

    cb.model.PropertyChange.delayPropertyChange(true);
    viewModel.clear();
    if (this.mode === "add") {

        viewModel.setState("add");
        viewModel.newRecord();
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