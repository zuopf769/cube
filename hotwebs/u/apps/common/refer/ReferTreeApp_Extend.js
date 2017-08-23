var ReferTree_Extend = $.extend(ReferBase_Extend);

ReferTree_Extend.init_Extend = function (viewModel) {   
    this.init_paras(viewModel);
    var treeInfo = { "code": "", "pageSize": viewModel.getTreePageSize(), "pageIndex": 1 };   

    var self = this;

    this.queryData(viewModel, treeInfo, null, function (data) {
        self.setData(viewModel, data);
    });
}

ReferTree_Extend.setData = function (viewModel, data) {
    //设置树和表的数据
    if (data.tree) {
        this.init_Tree(viewModel, data.tree);
    }

    //viewModel.referData = data;
}


ReferTree_Extend.closeAction = function (viewModel) {
    cb.route.hidePageViewPart(viewModel);
}

ReferTree_Extend.submitAction = function (viewModel) {
   
    debugger;
    /*
    var data = viewModel.getCatalog().getData("selectedItem");
    if (data) {
        var keyField = this.referModel.get("keyField")|| "id";
        var codeField = this.referModel.get("codeField") ||"code" ;
        var nameField = this.referModel.get("nameField") || "name";
        var result = {}
        result[keyField] = data.id;
        result[codeField] = data.code;
        result[nameField] = data.name;
        this.setReturnData(viewModel, { data: result });
    }
    */
    cb.route.hidePageViewPart(viewModel);
}

ReferTree_Extend.cancelAction = function (viewModel) {
    this.closeAction(viewModel);
}
   

