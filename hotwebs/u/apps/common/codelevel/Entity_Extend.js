/// <reference path="../../../common/js/Cube.js" />
/// <reference path="Entity_L.js" />
var EntityViewModel_Extend = {
    doAction: function (name, viewModel) {
        if (this[name])
            this[name](viewModel);
    },
    init_Extend: function (viewModel) {
        var data = [
            {
                mark: '',
                brokennumber: '0007',
            }
        ];
        var customer = cb.route.getViewPartParams(viewModel).queryData.nbcrcode;
        var param = { "nbcrcode": customer };
        viewModel.getProxy().EntityQuery(param, function (success, fail) {
            if (success) {
                viewModel.getEntityGrid().setData(success);
            }
        })
    },
    CloseAction: function (viewModel, args) {
        cb.route.hidePageViewPart(viewModel);
    },
    DetermineAction: function (viewModel, args) {
        var row = viewModel.getEntityGrid().getSelectedRows();
        if (row&&row.length>0) {
            var param = {
                "id": row[0].metaid
            };
            viewModel.getProxy().QryEntity(param, function (success, fail) {
                if (success) {
                    var returnStata = {
                        data: {
                            value: args.row.elemvalue,
                            "elemvalue": args.row.elemvalue,
                            "pk_billcodeentity": success.pk_billcodeentity,
                            'elemname': args.row.elemname,
                            'elength': success.elength,
                             name: args.row.elemname
                        }
                    };
                    var paras = cb.route.getViewPartParams(viewModel);
                    if (paras != null && paras.callBack != null) {
                        paras.callBack(returnStata);
                    }
                }
                else {
                    cb.util.warningMessage(fail.error)
                }
            })
        }
        
        this.CloseAction(viewModel)
    },
    onDblClickRow: function (viewModel, args) {
        var grid = viewModel.getEntityGrid();
        grid.select(args.index);
        this.DetermineAction(viewModel,args);
    },
};