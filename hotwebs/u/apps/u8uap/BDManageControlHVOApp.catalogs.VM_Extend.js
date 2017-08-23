/// <reference path="../../common/js/Cube.js" />
/// <reference path="BDManageControlHVOAppViewModel_catalogs_M.js" />

cb.viewmodel.u8uap_BDManageControlHVOAppViewModel_catalogs_Extend = function (){};

cb.viewmodel.u8uap_BDManageControlHVOAppViewModel_catalogs_Extend.prototype.doAction = function (name, viewModel){
    if (this[name]){
        this[name](viewModel)
    };
};


    cb.viewmodel.u8uap_BDManageControlHVOAppViewModel_catalogs_Extend.prototype.dblclickrow = function (viewModel, args){
        /// <param name="viewModel" type= "BDManageControlHVOAppViewModel_catalogs" > viewModel的类型为BDManageControlHVOAppViewModel_catalogs</param>
    }

    cb.viewmodel.u8uap_BDManageControlHVOAppViewModel_catalogs_Extend.prototype.addAction = function (viewModel, args){
        /// <param name="viewModel" type= "BDManageControlHVOAppViewModel_catalogs" > viewModel的类型为BDManageControlHVOAppViewModel_catalogs</param>
    }

    cb.viewmodel.u8uap_BDManageControlHVOAppViewModel_catalogs_Extend.prototype.editAction = function (viewModel, args){
        /// <param name="viewModel" type= "BDManageControlHVOAppViewModel_catalogs" > viewModel的类型为BDManageControlHVOAppViewModel_catalogs</param>
    }

    cb.viewmodel.u8uap_BDManageControlHVOAppViewModel_catalogs_Extend.prototype.saveAction = function (viewModel, args){
        /// <param name="viewModel" type= "BDManageControlHVOAppViewModel_catalogs" > viewModel的类型为BDManageControlHVOAppViewModel_catalogs</param>
    }

    cb.viewmodel.u8uap_BDManageControlHVOAppViewModel_catalogs_Extend.prototype.cancelAction = function (viewModel, args){
        /// <param name="viewModel" type= "BDManageControlHVOAppViewModel_catalogs" > viewModel的类型为BDManageControlHVOAppViewModel_catalogs</param>
    }

    cb.viewmodel.u8uap_BDManageControlHVOAppViewModel_catalogs_Extend.prototype.deleteAction = function (viewModel, args){
        /// <param name="viewModel" type= "BDManageControlHVOAppViewModel_catalogs" > viewModel的类型为BDManageControlHVOAppViewModel_catalogs</param>
    }

    cb.viewmodel.u8uap_BDManageControlHVOAppViewModel_catalogs_Extend.prototype.configAction = function (viewModel, args){
        /// <param name="viewModel" type= "BDManageControlHVOAppViewModel_catalogs" > viewModel的类型为BDManageControlHVOAppViewModel_catalogs</param>
    }

    cb.viewmodel.u8uap_BDManageControlHVOAppViewModel_catalogs_Extend.prototype.treeBeforeExpand = function (viewModel, args){
        /// <param name="viewModel" type= "BDManageControlHVOAppViewModel_catalogs" > viewModel的类型为BDManageControlHVOAppViewModel_catalogs</param>
    }

    cb.viewmodel.u8uap_BDManageControlHVOAppViewModel_catalogs_Extend.prototype.treeClick = function (viewModel, args){
        /// <param name="viewModel" type= "BDManageControlHVOAppViewModel_catalogs" > viewModel的类型为BDManageControlHVOAppViewModel_catalogs</param>
    }

    cb.viewmodel.u8uap_BDManageControlHVOAppViewModel_catalogs_Extend.prototype.treeMoreClick = function (viewModel, args){
        /// <param name="viewModel" type= "BDManageControlHVOAppViewModel_catalogs" > viewModel的类型为BDManageControlHVOAppViewModel_catalogs</param>
    }


cb.viewmodel.u8uap_BDManageControlHVOAppViewModel_catalogs_Extend.prototype.queryData = function (viewModel, nodeCode, pageSize, pageIndex){
    var symbol = viewModel.getSymbol();
    //刷新树
    var commonFunc= viewModel.commonFunc;
    commonFunc.refresh();


};

cb.viewmodel.u8uap_BDManageControlHVOAppViewModel_catalogs_Extend.prototype.callBack = function (){
    var commonFunc= this.commonFunc;
    //关闭页签提示保存
    if(this.isDirty()) {
        // return commonFunc.hintSave( recallBack );
        return confirm("你即将离开当前页签");
    };

};

cb.viewmodel.u8uap_BDManageControlHVOAppViewModel_catalogs_Extend.prototype.init_Extend = function (viewModel) {
    viewModel.newRecord();
    viewModel.setState("add");
    viewModel.setReadOnly(false);

    var pageIndex= 1;
    var pageSize= 15;
    this.queryData(viewModel, "", pageSize, pageIndex);

    cb.route.unsubscribeMessage(viewModel, "beforeTabMenuClose", this.callBack);
    cb.route.subscribeMessage(viewModel, "beforeTabMenuClose", this.callBack, viewModel);

};
