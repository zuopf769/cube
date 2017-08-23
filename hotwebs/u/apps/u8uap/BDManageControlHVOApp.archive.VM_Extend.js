/// <reference path="../../common/js/Cube.js" />
/// <reference path="BDManageControlHVOAppViewModel_archive_M.js" />

cb.viewmodel.u8uap_BDManageControlHVOAppViewModel_archive_Extend = function () {};
cb.viewmodel.u8uap_BDManageControlHVOAppViewModel_archive_Extend.prototype.doAction = function (name, viewModel) {
    if (this[name])
        this[name](viewModel);
};
cb.viewmodel.u8uap_BDManageControlHVOAppViewModel_archive_Extend.prototype.tabMenuClick = function (viewModel, args) {
debugger;
};

    cb.viewmodel.u8uap_BDManageControlHVOAppViewModel_archive_Extend.prototype.returnAction = function (viewModel, args) {
        ///<param name="viewModel" type="">viewModel类型为</param>
    };

    cb.viewmodel.u8uap_BDManageControlHVOAppViewModel_archive_Extend.prototype.addAction = function (viewModel, args) {
        ///<param name="viewModel" type="">viewModel类型为</param>
    };

    cb.viewmodel.u8uap_BDManageControlHVOAppViewModel_archive_Extend.prototype.saveAction = function (viewModel, args) {
        ///<param name="viewModel" type="">viewModel类型为</param>
    };

    cb.viewmodel.u8uap_BDManageControlHVOAppViewModel_archive_Extend.prototype.editAction = function (viewModel, args) {
        ///<param name="viewModel" type="">viewModel类型为</param>
    };

    cb.viewmodel.u8uap_BDManageControlHVOAppViewModel_archive_Extend.prototype.deleteAction = function (viewModel, args) {
        ///<param name="viewModel" type="">viewModel类型为</param>
    };

    cb.viewmodel.u8uap_BDManageControlHVOAppViewModel_archive_Extend.prototype.cancelAction = function (viewModel, args) {
        ///<param name="viewModel" type="">viewModel类型为</param>
    };

    cb.viewmodel.u8uap_BDManageControlHVOAppViewModel_archive_Extend.prototype.nextAction = function (viewModel, args) {
        ///<param name="viewModel" type="">viewModel类型为</param>
    };

    cb.viewmodel.u8uap_BDManageControlHVOAppViewModel_archive_Extend.prototype.prevAction = function (viewModel, args) {
        ///<param name="viewModel" type="">viewModel类型为</param>
    };

    cb.viewmodel.u8uap_BDManageControlHVOAppViewModel_archive_Extend.prototype.printAction = function (viewModel, args) {
        ///<param name="viewModel" type="">viewModel类型为</param>
    };
    cb.viewmodel.u8uap_BDManageControlHVOAppViewModel_archive_Extend.prototype.addLineAction = function (viewModel, args) {
        var rowData = {};
        rowData.mdclassid = viewModel.getmdclassid().getValue();
        rowData.mdname = viewModel.getmdname().getValue();
        rowData.editflag = true;

        args.cancel = true;
        viewModel.commonFunc.addLine(rowData);
    };
    cb.viewmodel.u8uap_BDManageControlHVOAppViewModel_archive_Extend.prototype.insertLineAction = function (viewModel, args) {
        var rowData = {};
        rowData.mdclassid = viewModel.getmdclassid().getValue();
        rowData.mdname = viewModel.getmdname().getValue();
        rowData.editflag = true;

        args.cancel = true;
        viewModel.commonFunc.insertLine(rowData);
    };
    cb.viewmodel.u8uap_BDManageControlHVOAppViewModel_archive_Extend.prototype.copyLineAction = function (viewModel, args) {
        ///<param name="viewModel" type="">viewModel类型为</param>
    };
    cb.viewmodel.u8uap_BDManageControlHVOAppViewModel_archive_Extend.prototype.deleteLineAction = function (viewModel, args) {
        ///<param name="viewModel" type="">viewModel类型为</param>
    };



cb.viewmodel.u8uap_BDManageControlHVOAppViewModel_archive_Extend.prototype.callBack = function (){
    debugger;
    var commonFunc= this.commonFunc;

    //关闭页签提示保存
    if(this.isDirty()) {
    // return commonFunc.hintSave( recallBack );
      return confirm("你即将离开当前页签");
    };
};
cb.viewmodel.u8uap_BDManageControlHVOAppViewModel_archive_Extend.prototype.initializeOneTime = function (viewModel) {

    //共享模式监听事件注册
	viewModel.getsharemode().on("afterchange", function () {
		var val = this.getValue();
        var model = this;
        var viewModel = this.getParent();
		var viewModelName = this.getParent().getModelName();
		var $view = $("[data-viewmodel='" + viewModelName + "']");
		if (val == "SHARE"){
			$view.children().last().children().children().first().siblings().hide();
        }else{
            $view.children().last().children().children().first().siblings().show();
        }
	});
};
cb.viewmodel.u8uap_BDManageControlHVOAppViewModel_archive_Extend.prototype.init_Extend = function (viewModel) {
    /// <param name="viewModel" type="BDManageControlHVOAppViewModel_archive">viewModel类型为BDManageControlHVOAppViewModel_archive</param>
    var params = cb.route.getViewPartParams(viewModel);
    viewModel.getModel3D().setData({dsMode:'Local'});

    //隐藏分配相关字段
    var hideAssignFields = function(viewModel){
        var shareNode = viewModel.getsharemode().getValue();
        var viewModelName = viewModel.getsharemode().getParent().getModelName();
        var $view = $("[data-viewmodel='" + viewModelName + "']");
        if (shareNode == "SHARE") {
            $view.children().last().children().children().first().siblings().hide();
        } else {
            $view.children().last().children().children().first().siblings().show();
        }
    }

        //取档案实体属性
        var getMDProperty = function(viewModel) {
            var callBack = function(success, fail) {
            args = {};
                if (success) {
                    args.prompt = false;
                } else if (fail) {
                    args.prompt = true;
                }
                args.opName = "查询档案实体属性";
                var result = viewModel.commonFunc.handleResult(success, fail, args, function(result) {
                    if (cb.util.isFunction(resultCallBack)) resultCallBack(result);
                });
            };
            var resultCallBack = function(result) {
                if (result.success) {
                    if (result.data && cb.isArray(result.data)) {
                        var fieldcodeDataSource = [];
                        cb.each(result.data, function(item){
                            var row = {};
                            row.text = item.fieldname;
                            row.value = item.fieldcode;
                            fieldcodeDataSource.push(row);
                        });
                        viewModel.getModel3D().setColumnState("fieldcode","dataSource",fieldcodeDataSource);
                    }
                }
            }
            var proxyConfig = {
                QueryUPMDProperty: { url: "classes/General/UAP/QueryUPMDProperty", method: "Get", mask: true }
            };
            viewModel.setProxy(proxyConfig);
            var params = { id : viewModel.getmdclassid().getValue() };
            viewModel.getProxy().QueryUPMDProperty(params, callBack);
        };
       

    if (!params) return;
    this.symbol = viewModel.getSymbol();
    if (!this.symbol) return;
    this.mode = params.mode;
    if (!this.mode) return;

    cb.model.PropertyChange.delayPropertyChange(true);
    viewModel.clear();

    //取档案实体属性
    var id = params.nodeInfo && params.nodeInfo.id || null;
    viewModel.getmdclassid().setValue(id);
    getMDProperty(viewModel);

    if (this.mode === "add") {

        viewModel.setState("add");
        viewModel.newRecord();
        debugger;
        //带入分类档案信息
        var id = params.nodeInfo && params.nodeInfo.id || null;
        viewModel.getmdclassid().setValue(id);
        var name = params.nodeInfo && params.nodeInfo.name || null;
        viewModel.getmdname().setValue(name);

        //隐藏分配相关字段
        hideAssignFields(viewModel);
        
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
            //隐藏分配相关字段
            hideAssignFields(viewModel);
        });

    } else if (this.mode === "edit") {
    
        viewModel.setState("edit");
        cb.data.CommonProxy(this.symbol).QueryByPK(params.id, function (success, fail) {
            if (fail) {
                cb.util.warningMessage("查询卡片数据失败");
                return;
            };
            viewModel.loadData(success);
            viewModel.setReadOnly(false);
            cb.model.PropertyChange.doPropertyChange();
            //隐藏分配相关字段
            hideAssignFields(viewModel);
        });
    };

    cb.route.unsubscribeMessage(params.parentViewModel, "beforeTabMenuClose", this.callBack);
    cb.route.subscribeMessage(params.parentViewModel, "beforeTabMenuClose", this.callBack, viewModel);
};