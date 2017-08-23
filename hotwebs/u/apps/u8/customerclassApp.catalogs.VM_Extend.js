/// <reference path="../../common/js/Cube.js" />
/// <reference path="customerclassAppViewModel_catalogs_M.js" />

cb.viewmodel.u8_customerclassAppViewModel_catalogs_Extend = function (){};

cb.viewmodel.u8_customerclassAppViewModel_catalogs_Extend.prototype.doAction = function (name, viewModel){
    if (this[name]){
        this[name](viewModel)
    };
};


    cb.viewmodel.u8_customerclassAppViewModel_catalogs_Extend.prototype.addAction = function (viewModel, args){
        /// <param name="viewModel" type= "customerclassAppViewModel_catalogs" > viewModel的类型为customerclassAppViewModel_catalogs</param>
    }

    cb.viewmodel.u8_customerclassAppViewModel_catalogs_Extend.prototype.editAction = function (viewModel, args){
        /// <param name="viewModel" type= "customerclassAppViewModel_catalogs" > viewModel的类型为customerclassAppViewModel_catalogs</param>
    }

    cb.viewmodel.u8_customerclassAppViewModel_catalogs_Extend.prototype.saveAction = function (viewModel, args){
        /// <param name="viewModel" type= "customerclassAppViewModel_catalogs" > viewModel的类型为customerclassAppViewModel_catalogs</param>
    }

    cb.viewmodel.u8_customerclassAppViewModel_catalogs_Extend.prototype.cancelAction = function (viewModel, args){
        /// <param name="viewModel" type= "customerclassAppViewModel_catalogs" > viewModel的类型为customerclassAppViewModel_catalogs</param>
    }

    cb.viewmodel.u8_customerclassAppViewModel_catalogs_Extend.prototype.deleteAction = function (viewModel, args){
        /// <param name="viewModel" type= "customerclassAppViewModel_catalogs" > viewModel的类型为customerclassAppViewModel_catalogs</param>
    }

    cb.viewmodel.u8_customerclassAppViewModel_catalogs_Extend.prototype.configAction = function (viewModel, args){
        /// <param name="viewModel" type= "customerclassAppViewModel_catalogs" > viewModel的类型为customerclassAppViewModel_catalogs</param>
    }

    cb.viewmodel.u8_customerclassAppViewModel_catalogs_Extend.prototype.treeBeforeExpand = function (viewModel, args){
        /// <param name="viewModel" type= "customerclassAppViewModel_catalogs" > viewModel的类型为customerclassAppViewModel_catalogs</param>
    }

    cb.viewmodel.u8_customerclassAppViewModel_catalogs_Extend.prototype.treeClick = function (viewModel, args){
        /// <param name="viewModel" type= "customerclassAppViewModel_catalogs" > viewModel的类型为customerclassAppViewModel_catalogs</param>
        /*viewModel.commonFunc.treeClick(args.inputData, function (){
            setTimeout(function (){
                alert(1)
            },2000)
        })
        args.cancel = true;*/

    }

    cb.viewmodel.u8_customerclassAppViewModel_catalogs_Extend.prototype.treeMoreClick = function (viewModel, args){
        /// <param name="viewModel" type= "customerclassAppViewModel_catalogs" > viewModel的类型为customerclassAppViewModel_catalogs</param>
    }

    cb.viewmodel.u8_customerclassAppViewModel_catalogs_Extend.prototype.copyAction = function (viewModel, args){
        /// <param name="viewModel" type= "customerclassAppViewModel_catalogs" > viewModel的类型为customerclassAppViewModel_catalogs</param>
    }


cb.viewmodel.u8_customerclassAppViewModel_catalogs_Extend.prototype.queryData = function (viewModel, nodeCode, pageSize, pageIndex, callBack){
    var symbol = viewModel.getSymbol();
    //刷新树
    var commonFunc= viewModel.commonFunc;
    commonFunc.refresh();
    //设置编码规则
    if (symbol) {
        cb.data.CommonProxy("UAP").GetCodeRuleByAppID({
            "appid": symbol
        }, function (success, fail) {
            viewModel.getcode().un("afterchange");
            viewModel.getcode().on("afterchange", function (args) {
                commonFunc.handleRule(success, args.Value);
            })
            var data = commonFunc.showRule(success);
            viewModel.getcode().set("hint", data);
            if(cb.util.isFunction(callBack))callBack();
        });
    };

};

cb.viewmodel.u8_customerclassAppViewModel_catalogs_Extend.prototype.callBack = function (){
    var commonFunc= this.commonFunc;
    //关闭页签提示保存
    if(this.isDirty()) {
        // return commonFunc.hintSave( recallBack );
        return confirm("你即将离开当前页签");
    };

};

cb.viewmodel.u8_customerclassAppViewModel_catalogs_Extend.prototype.initializeOneTime = function (viewModel) {

};
cb.viewmodel.u8_customerclassAppViewModel_catalogs_Extend.prototype.init_Extend = function (viewModel) {
    viewModel.newRecord();
    viewModel.setReadOnly(true);
    viewModel.setState("init");

    var pageIndex= 1;
    var pageSize= 15;
    var callBack = function (){
        //alert(1);
    }
    this.queryData(viewModel, "", pageSize, pageIndex, callBack);

    cb.route.unsubscribeMessage(viewModel, "beforeTabMenuClose", this.callBack);
    cb.route.subscribeMessage(viewModel, "beforeTabMenuClose", this.callBack, viewModel);

};
