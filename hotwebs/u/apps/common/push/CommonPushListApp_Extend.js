/// <reference path="../../common/js/Cube.js" />
/// <reference path="CommonPushListApp_L.js" />

var CommonPushListViewModel_Extend = {
    doAction: function (name, viewModel) {
        if (this[name])
            this[name](viewModel);
    },
    init_Extend: function (viewModel) {
        ///<param name="viewModel' type="CommonPushListViewModel">viewModel</param>
        var params = cb.route.getViewPartParams(viewModel);
        if (!params) return;

        this.srcBillType = params.srcBillType;
        this.targetBillType = params.targetBillType;
        this.columnCode = params.columnCode;
        //this.pks = params.pks;
        this.filters = params.filters;
        this.pks = [];
        if (!this.srcBillType || !this.targetBillType) return;
        var table = viewModel.gettotaltable();
        var symbol = viewModel.getSymbol();
        var dataColumns = {};
        if (symbol != null) {
            cb.data.CommonProxy("UAP").QueryBill({
                //"billType": this.billType,
                "srcBillType": this.srcBillType,
                "targetBillType": this.targetBillType,
                'pks': this.pks,
                //"columns"
                "pageIndex": 1,
                "pageSize": 15,
                "queryType": "1",
                "haveColumn": "1",
                "filters": this.filters
            }, function (success, fail) {
                if (fail) {
                    alert("查询列表数据失败");
                    return;
                }
                if (success.columns && success.columns.length > 0) {
                    success.columns.forEach(function (col, colIndex, cols) {
                        dataColumns[col.fieldcode] = { "title": col.fieldname, "visible": col.showflag === true ? true : false };
                    });
                }
                CommonPushListViewModel_Extend.ChildParams = {};
                CommonPushListViewModel_Extend.ChildParams['fk'] = success['childForeignKey'];
                CommonPushListViewModel_Extend.ChildParams['en'] = success['childEntityName'];

                table.set('primaryKey', success.meta.pk);
                table.setColumns(dataColumns);
                table.setPageRows(success);
                //批改界面初始化数据
                viewModel.getbatchMContainer().setData('dataSource', success.columns);
            });
        }
    },
    closeAction: function (viewModel, args) {
        cb.route.hidePageViewPart(viewModel);
    },

    notationAction: function (viewModel, args) {
        ///<param name='viewModel' type='CommonPushListViewModel'></param>
        viewModel.getbatchMContainer().setData('visible', 'true');
    },
    totalchangePage: function (viewModel, args) {
        var table = viewModel.gettotaltable();
        var symbol = viewModel.getSymbol();
        if (symbol != null) {
            cb.data.CommonProxy("UAP").QueryBill({
                "billType": this.billType,
                "pageIndex": args.pageIndex,
                "pageSize": args.pageSize,
                "queryType": "1",
                "haveColumn": args.pageIndex == 1 ? "1" : "0",
                "filters": this.filters
            }, function (success, fail) {
                if (fail) {
                    alert("查询列表数据失败");
                    return;
                }
                if (args.pageIndex == 1) {
                    table.set("primaryKey", success.meta.pk);
                    table.setColumns(success.columns);
                }
                table.setPageRows(success);
            });
        }
    },

    submitAction: function (viewModel, args) {
        debugger;
        var params = cb.route.getViewPartParams(viewModel);
        var parentViewModel;
        if (!params) return;
        var symbol;
        if (params.symbol) {
            symbol = params.symbol;
        }
        else {
            parentViewModel = params.parentViewModel;
            if (!parentViewModel) return;
            symbol = parentViewModel.getSymbol();
        }
        if (symbol == null) return;
        var data = cb.biz.getInputData(parentViewModel);
        var pkName = parentViewModel.getPkName();
        var pkValue = parentViewModel.getPkValue();

        var selected = viewModel.gettotaltable().getSelectedRows();

        var datas = [];
        if (selected != null) {
            var aggVo = {};
            var childs = [];
            datas.push(aggVo);
            aggVo[pkName] = pkValue;
            aggVo['ts'] = data.ts;
            aggVo[CommonPushListViewModel_Extend.ChildParams['en']] = childs;

            for (var i = 0 ; i < selected.length ; i++) {
                var rowData = selected[i];
                childs.push(rowData);
            }
        }
        var param = datas;

        cb.data.CommonProxy(symbol).pushOrder(param, function (success, fail) {
            var msg = "";
            if (fail)
                msg = CommonPushListViewModel_Extend.getErrorMsg(fail);
            else {
                msg = "出库成功";
                cb.route.hidePageViewPart(viewModel);
            }
            alert(msg);
        });
    },

    cancelAction: function (viewModel, args) {
        cb.route.hidePageViewPart(viewModel);
    },

    batchModifyOk: function (viewModel, args) {
        ///<param name="viewModel" type="CommonPushListViewModel"></param>
        viewModel.getbatchMContainer().setData('visible', 'false');
    },
    updateData: function (viewModel, args) {
        ///<param name="viewModel" type="CommonPushListViewModel"></param>
        //alert(args);
        var table = viewModel.gettotaltable();
        if (args) {
            for (var attr in args) {

                for (var i = 0; i < table.getRows().length; i++) {
                    table.setCellValue(i, attr, args[attr]);
                }
            }
        }
        viewModel.getbatchMContainer().setData('visible', 'false');
    },
    ChildParams: undefined,
    sumDatas: {},
    getErrorMsg: function (fail) {
        var msg = '';
        if (fail) {
            fail.forEach(function (error, erroIndex, errors) {
                msg = msg + "  " + error.msgContent;
            });
        }
        return msg;
    }
};
