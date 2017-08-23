/// <reference path="../../common/js/Cube.js" />
/// <reference path="DeliveryApp_M.js" />
var RefPositionViewModel_Extend = {
    doAction: function (name, viewModel) {
        if (this[name])
            this[name](viewModel);
    },
    init_Extend: function (viewModel) {
        viewModel.num = 0;
        viewModel.succLength = 0;
        viewModel.getselectContent().setValue("");
        viewModel.getselectAttr().setValue("");
        viewModel.getpartMatch().setValue("");
        viewModel.getcaseMatch().setValue("");
        viewModel.getProxy().AllSimpleRefRecord({}, function (success, fail) {
            if(fail) return;
            if (success) {
                /*$("#popup_selectContent").html("");
                var _arr = [];
                for(var i=0, len = success.length; i<len; i++){
                   _arr.push('<option value="'+success[i].code+'">'+success[i].name+'</option>') ;
                };
                $("#popup_selectContent").html(_arr.join(""));*/
                viewModel.getselectContent().setDataSource(success);
                viewModel.getselectAttr().setDataSource([{"name":"名称", "attr":"name"}, {"name":"编码", "attr":"code"}])
            }
        });
    },
    closeAction: function (viewModel) {
        cb.route.hidePageViewPart(viewModel);
    },
    searchNextAction: function (viewModel) {
        var parentViewModel = cb.route.getViewPartParams(viewModel).parentViewModel;
        var params = viewModel.collectData();
        var param = {
                "info": params.selectContent,      //查询的定位信息
                "field": params.selectAttr,        //查询属性 （值只能为：name | code）
                "caseMatch": params.caseMatch,     //是否匹配大小写
                "fullInfoMatch": params.partMatch  //全值搜索| 部分值搜索
            };
        var loadInfo = function (i){
            //加载卡片的信息;
            parentViewModel.loadData(viewModel.success[i]);
            //加载列表信息
            if(viewModel.success[i].pk_columns && viewModel.success[i].pk_columns.length){
                var data1 = {
                      "currentPageData":viewModel.success[i].pk_columns,
                      "pageCount": 1,
                      "pageIndex": 1,
                      "pageSize": 15,
                      "totalCount": viewModel.success[i].pk_columns.length,
                      "totalColumnData": null
                };
                parentViewModel.getModel3D("pk_columns").setPageRows(data1);
            };
            if(viewModel.success[i].pk_treesmarts && viewModel.success[i].pk_treesmarts.length){
                var data2 = {
                      "currentPageData":viewModel.success[i].pk_treesmarts,
                      "pageCount": 1,
                      "pageIndex": 1,
                      "pageSize": 15,
                      "totalCount": viewModel.success[i].pk_treesmarts.length,
                      "totalColumnData": null
                };
                parentViewModel.getModel3D("pk_treesmarts").setPageRows(data2);
            }
        }
        var queryInfo = function (){
            viewModel.getProxy().QueryRefPosition( param, function (success, fail){
                if(fail){
                    cb.util.tipMessage("查找失败: "+ fail.error);
                    return;
                };
                viewModel.succLength = success.length;
                viewModel.success = success;
                //加载返回的信息
                loadInfo(viewModel.num)

                parentViewModel.setState("browse");
                parentViewModel.setReadOnly(true);
            });
        }
        if(viewModel.succLength && viewModel.succLength - 1 > viewModel.num){
            loadInfo(++viewModel.num)
        }else if(!viewModel.succLength){
            queryInfo()
        }else if(viewModel.succLength - 1 ==  viewModel.num){
            cb.route.hidePageViewPart(viewModel);
        };
        var doClear = function (){
            viewModel.num = 0;
            viewModel.succLength = 0;
        };
        viewModel.getselectContent().un("afterchange");
        viewModel.getselectAttr().un("afterchange");
        viewModel.getpartMatch().un("afterchange");
        viewModel.getcaseMatch().un("afterchange");
        viewModel.getselectContent().on("afterchange", doClear)
        viewModel.getselectAttr().on("afterchange", doClear)
        viewModel.getpartMatch().on("afterchange", doClear)
        viewModel.getcaseMatch().on("afterchange", doClear)

    }
};


