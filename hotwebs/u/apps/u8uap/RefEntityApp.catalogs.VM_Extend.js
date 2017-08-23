/// <reference path="../../common/js/Cube.js" />
/// <reference path="RefEntityAppViewModel_catalogs_M.js" />

cb.viewmodel.u8uap_RefEntityAppViewModel_catalogs_Extend = function (name){

    //cb.model.ContainerModel.call(this, null, name || "u8uap_RefEntityAppViewModel_catalogs_Extend");
    //var _this.symbol = this.getSymbol();
    //var _this = this;
};
//cb.viewModel.u8uap_RefEntityAppViewModel_catalogs_Extend.prototype = new cb.model.ContainerModel();
cb.viewmodel.u8uap_RefEntityAppViewModel_catalogs_Extend.prototype.doAction = function (name, viewModel){
    if (this[name]){
        this[name](viewModel)
    };
};

cb.viewmodel.u8uap_RefEntityAppViewModel_catalogs_Extend.prototype.addAction = function (viewModel, args){
    /// <param name="viewModel" type= "RefEntityAppViewModel_catalogs" > viewModel的类型为RefEntityAppViewModel_catalogs</param>
    //args.cancel = true;

}

cb.viewmodel.u8uap_RefEntityAppViewModel_catalogs_Extend.prototype.editAction = function (viewModel, args){
    /// <param name="viewModel" type= "RefEntityAppViewModel_catalogs" > viewModel的类型为RefEntityAppViewModel_catalogs</param>
}

cb.viewmodel.u8uap_RefEntityAppViewModel_catalogs_Extend.prototype.saveAction = function (viewModel, args){
    /// <param name="viewModel" type= "RefEntityAppViewModel_catalogs" > viewModel的类型为RefEntityAppViewModel_catalogs</param>
    var _this = this;
    var symbol = viewModel.getSymbol();
    var data = viewModel.collectData();
    var commonFunc= viewModel.commonFunc;
    var args = commonFunc.checkArgs(args);
        args.opName = "保存";
    cb.data.CommonProxy(symbol).UpdateRefRecord(data, function (success, fail){
        /*var result = commonFunc.handleResult(success, fail, args, function (result){
            if(result.success){
                viewModel.setReadOnly(true);
                viewModel.setState("browse");
                _this.queryData(viewModel);
            }
        });*/
        if(fail){
            cb.util.confirmMessage("保存失败："+fail.error);
            return;
        }else{
            cb.util.tipMessage("保存成功！")
            viewModel.setReadOnly(true);
            viewModel.setState("browse");
            _this.queryData(viewModel);
        };

    });
    args.cancel = true;
};

cb.viewmodel.u8uap_RefEntityAppViewModel_catalogs_Extend.prototype.cancelAction = function (viewModel, args){
    /// <param name="viewModel" type= "RefEntityAppViewModel_catalogs" > viewModel的类型为RefEntityAppViewModel_catalogs</param>
}

cb.viewmodel.u8uap_RefEntityAppViewModel_catalogs_Extend.prototype.deleteAction = function (viewModel, args){
    /// <param name="viewModel" type= "RefEntityAppViewModel_catalogs" > viewModel的类型为RefEntityAppViewModel_catalogs</param>
    var _this = this;
    cb.util.confirmMessage("你确定要删除当前数据吗", function (){

        var symbol = viewModel.getSymbol();
        var commonFunc= viewModel.commonFunc;
        var data = viewModel.collectData(true);
        var params = {};
            params.pk_ref = data.pk_ref;
        var args = commonFunc.checkArgs(args);
            args.opName = "删除";

        var proxyConfig = {
            validateDel : {
                url : "classes/General/common.referdesigner/validateDel", method:"Post"
            }
        };
        viewModel.setProxy(proxyConfig);
        //确认能否删除
        viewModel.getProxy().validateDel(params, function (success, fail) {
            if(fail){
                cb.util.confirmMessage("删除失败：" + fail.error);
                return;
            };
            //删除
            cb.data.CommonProxy(symbol).DelRefRecord(params, function (success, fail){
                //args.prompt = success ? false : true;
                var result = commonFunc.handleResult(success, fail, args, function (result){
                    if(result.success){
                        viewModel.newRecord();
                        viewModel.setReadOnly(true);
                        viewModel.setState("browse");
                        _this.queryData(viewModel);
                    }
                });

            });
        })

    })

    args.cancel = true;
}

cb.viewmodel.u8uap_RefEntityAppViewModel_catalogs_Extend.prototype.configAction = function (viewModel, args){
    /// <param name="viewModel" type= "RefEntityAppViewModel_catalogs" > viewModel的类型为RefEntityAppViewModel_catalogs</param>
}

cb.viewmodel.u8uap_RefEntityAppViewModel_catalogs_Extend.prototype.treeBeforeExpand = function (viewModel, args){
    /// <param name="viewModel" type= "RefEntityAppViewModel_catalogs" > viewModel的类型为RefEntityAppViewModel_catalogs</param>
}

cb.viewmodel.u8uap_RefEntityAppViewModel_catalogs_Extend.prototype.treeClick = function (viewModel, args){
    /// <param name="viewModel" type= "RefEntityAppViewModel_catalogs" > viewModel的类型为RefEntityAppViewModel_catalogs</param>
    debugger;
    var symbol = viewModel.getSymbol();
    var params = {};
        params.pk_ref = args.inputData.pk_ref;
    var commonFunc= viewModel.commonFunc;
    var args = commonFunc.checkArgs(args);
        args.opName = "查询树控件";
    cb.data.CommonProxy(symbol).QueryRefRecord(params, function (success, fail){
        args.prompt = success ? false : true;
        var result = commonFunc.handleResult(success, fail, args, function (result){
            if(result.success){
                viewModel.loadData(result.data);
                if(result.data.pk_columns && result.data.pk_columns.length){
                    var data1 = {
                          "currentPageData":result.data.pk_columns,
                          "pageCount": 1,
                          "pageIndex": 1,
                          "pageSize": 15,
                          "totalCount": result.data.pk_columns.length,
                          "totalColumnData": null
                    };
                    viewModel.getModel3D("pk_columns").setPageRows(data1);
                };
                if(result.data.pk_treesmarts && result.data.pk_treesmarts.length){
                    debugger;
                    var data2 = {
                          "currentPageData":result.data.pk_treesmarts,
                          "pageCount": 1,
                          "pageIndex": 1,
                          "pageSize": 15,
                          "totalCount": result.data.pk_treesmarts.length,
                          "totalColumnData": null
                    };
                    viewModel.getModel3D("pk_treesmarts").setPageRows(data2);
                }

                viewModel.setState("browse");
                viewModel.setReadOnly(true);
            }
        });

    });
    args.cancel = true;
};

cb.viewmodel.u8uap_RefEntityAppViewModel_catalogs_Extend.prototype.treeMoreClick = function (viewModel, args){
    /// <param name="viewModel" type= "RefEntityAppViewModel_catalogs" > viewModel的类型为RefEntityAppViewModel_catalogs</param>
}

cb.viewmodel.u8uap_RefEntityAppViewModel_catalogs_Extend.prototype.addLineAction = function (viewModel, args){
    /// <param name="viewModel" type= "RefEntityAppViewModel_catalogs" > viewModel的类型为RefEntityAppViewModel_catalogs</param>
    viewModel.selfModel = args.selfModel;
    var info = viewModel.getshowmode().getValue();
    if(args.selfModel._name == "treeAddAction" && info == 1){
        cb.util.tipMessage("展示方式必须为“树表”时设计");
        return;
    };
    var symbol = viewModel.getSymbol();
    var commonFunc= viewModel.commonFunc;
        args = commonFunc.checkArgs(args);
    var params = viewModel.collectData();
    var showDesignerPage = function (args){
        params = viewModel.collectData();
        //确定用什么id去请求页面
        args = viewModel.selfModel._name == "columnAddAction" ? params.pk_smart : params.pk_smart_tree;
        var token=cb.rest.ApplicationContext.Token;
        cb.data.CommonProxy('uap').ShowDesignerPage({"pk_def":args}, function (success, fail){
            var uuid=success.uuid;
            //弹出页面
            cb.route.loadPageViewPart(viewModel, "apps/common/smart/smartModelProviderPage.html?token="+token+"&uuid="+uuid, {title:"语义模型设计向导",iframe:true});
        });
    };
    var smartRecordPK = function (){
        cb.data.CommonProxy(symbol).SmartRecordPK({}, function (success, fail){
            if(viewModel.selfModel._name == "columnAddAction"){
                params.pk_smart=success.id
            }else{
                params.pk_smart_tree=success.id
            };
            //首次获取id后塞入卡片,存放id信息;
            viewModel.loadData(params);
            var treeModel = viewModel.getModel2D();
                args.opName = "查询参照语义模型PK";
                args.prompt = success ? false : true;
            var result = commonFunc.handleResult(success, fail, args, function (result){
                if(result.success){
                    showDesignerPage()
                };
            });
        });
    }

    if(!params.pk_smart && args.selfModel._name == "columnAddAction"  || !params.pk_smart_tree && args.selfModel._name == "treeAddAction"  ){
        //首次点击增行，请求id;
        smartRecordPK();
    }else{
        //重复点击增行，不在请求id;
        showDesignerPage();
    };

    args.cancel = true;
}

cb.viewmodel.u8uap_RefEntityAppViewModel_catalogs_Extend.prototype.refreshAction = function (viewModel, args){
    viewModel.clear();
    viewModel.setState("init");
    args.cancel = true;
}

cb.viewmodel.u8uap_RefEntityAppViewModel_catalogs_Extend.prototype.positionAction = function (viewModel, args){
    viewModel.selfModel = args.selfModel;
    cb.route.loadPageViewPart(viewModel, "common.position.RefPosition", {title:"定位",iframe:false, width:350, height:200, modal: false});
    args.cancel = true;
};

cb.viewmodel.u8uap_RefEntityAppViewModel_catalogs_Extend.prototype.deleteLineAction = function (viewModel, args){
    /// <param name="viewModel" type= "RefEntityAppViewModel_catalogs" > viewModel的类型为RefEntityAppViewModel_catalogs</param>
}

cb.viewmodel.u8uap_RefEntityAppViewModel_catalogs_Extend.prototype.insertLineAction = function (viewModel, args){
    /// <param name="viewModel" type= "RefEntityAppViewModel_catalogs" > viewModel的类型为RefEntityAppViewModel_catalogs</param>
}

cb.viewmodel.u8uap_RefEntityAppViewModel_catalogs_Extend.prototype.copyLineAction = function (viewModel, args){
    /// <param name="viewModel" type= "RefEntityAppViewModel_catalogs" > viewModel的类型为RefEntityAppViewModel_catalogs</param>
}

cb.viewmodel.u8uap_RefEntityAppViewModel_catalogs_Extend.prototype.queryData = function (viewModel, nodeCode, pageSize, pageIndex){
    var symbol = viewModel.getSymbol();
    var commonFunc= viewModel.commonFunc;
    //刷新树
    cb.data.CommonProxy(symbol).AllSimpleRefRecord({}, function (success, fail){
        viewModel.TreeList = success;
        var treeModel = viewModel.getModel2D();
        var args = {};
            args.opName = "查询树控件";
            args.prompt = success ? false : true;
        var result = commonFunc.handleResult(success, fail, args, function (result){
            if(result.success) treeModel.setDataSource(result.data);
        });
    });

};

cb.viewmodel.u8uap_RefEntityAppViewModel_catalogs_Extend.prototype.callBack = function (){
    var commonFunc= this.commonFunc;
    //关闭页签提示保存
    if(this.isDirty()) {
        // return commonFunc.hintSave( recallBack );
        return confirm("你即将离开当前页签");
    };

};

cb.viewmodel.u8uap_RefEntityAppViewModel_catalogs_Extend.prototype.initializeOneTime = function (viewModel) {
    viewModel.on("afterHidePageViewPart", function(){
        //设置列表数据
        var symbol = viewModel.getSymbol();
        var refModel3DField =  viewModel.selfModel && viewModel.selfModel.get("refModel3DField")
        var listCard = viewModel.getModel3D(refModel3DField);
        listCard.setData({dsMode:'Local'});
        var data = viewModel.collectData();
        var params;
        if(refModel3DField == "pk_columns"){
            params = data.pk_smart;
        }else{
            params = data.pk_smart_tree;
        }
        cb.data.CommonProxy(symbol).SmartRecordInfo({"id":params}, function (success, fail){
            if(success){
                listCard.setPageRows(success);
            };
        });

        /*listCard.setDataSource(cb.data.CommonProxy(symbol),"SmartRecordInfo", {"id":viewModel.id}, null,  function (success, fail){
            debugger;
                    if(success){
                        var data = {
                              "currentPageData":success.fields,
                              "pageCount": 1,
                              "pageIndex": 1,
                              "pageSize": 15,
                              "totalCount": success.fields.length,
                              "totalColumnData": null
                        };
                        viewModel.getModel3D().setPageRows(data);
                    }
        } );*/

    });
};

cb.viewmodel.u8uap_RefEntityAppViewModel_catalogs_Extend.prototype.init_Extend = function (viewModel) {
    viewModel.newRecord();
    viewModel.setState("init");
    viewModel.setReadOnly(false);
    this.queryData(viewModel);

    cb.route.unsubscribeMessage(viewModel, "beforeTabMenuClose", this.callBack);
    cb.route.subscribeMessage(viewModel, "beforeTabMenuClose", this.callBack, viewModel);

    //加载模块名称
    viewModel.getvmodelname().set("dataTextField","name"); //设置默认文本信息;
    viewModel.setProxy({ModuleFldSelector:{url:"classes/General/common.referdesigner/ModuleFldSelector", method:"Post"}});
    viewModel.getProxy().ModuleFldSelector({}, function (success, fail){
        if(fail){
            cb.util.tipMessage("获取模块名称失败："+ fail.error);
            return;
        };
        viewModel.getvmodelname().setDataSource(success);
    });
};
