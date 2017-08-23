/// <reference path="../../common/js/Cube.js" />
/// <reference path="<%=application.viewmodel.name%>_M.js" />

cb.viewmodel.<%=application.moduleName%>_<%=application.viewmodel.extendName%> = function (){};

cb.viewmodel.<%=application.moduleName%>_<%=application.viewmodel.extendName%>.prototype.doAction = function (name, viewModel){
    if (this[name]){
        this[name](viewModel)
    };
};

<%for(var i=0, len= application.viewmodel.actions.length; i<len; i++){%>
    cb.viewmodel.<%=application.moduleName%>_<%=application.viewmodel.extendName%>.prototype.<%=application.viewmodel.actions[i].functionName%> = function (viewModel, args){
        /// <param name="viewModel" type= "<%=application.viewmodel.name%>" > viewModel的类型为<%=application.viewmodel.name%></param>
    }
<%};%>

cb.viewmodel.<%=application.moduleName%>_<%=application.viewmodel.extendName%>.prototype.queryData = function (viewModel, nodeCode, pageSize, pageIndex){
    var symbol = viewModel.getSymbol();
    //刷新树
    var commonFunc= viewModel.commonFunc;
    commonFunc.refresh();


};

cb.viewmodel.<%=application.moduleName%>_<%=application.viewmodel.extendName%>.prototype.callBack = function (){
    var commonFunc= this.commonFunc;
    //关闭页签提示保存
    if(this.isDirty()) {
        // return commonFunc.hintSave( recallBack );
        return confirm("你即将离开当前页签");
    };

};

cb.viewmodel.<%=application.moduleName%>_<%=application.viewmodel.extendName%>.prototype.init_Extend = function (viewModel) {
    viewModel.newRecord();
    viewModel.setState("add");
    viewModel.setReadOnly(false);

    var pageIndex= 1;
    var pageSize= 15;
    this.queryData(viewModel, "", pageSize, pageIndex);

    cb.route.unsubscribeMessage(viewModel, "beforeTabMenuClose", this.callBack);
    cb.route.subscribeMessage(viewModel, "beforeTabMenuClose", this.callBack, viewModel);

};
