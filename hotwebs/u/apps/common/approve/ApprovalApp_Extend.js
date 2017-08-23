/// <reference path="../../common/js/Cube.js" />
/// <reference path="ApprovalApp_L.js" />
var ApprovalViewModel_Extend = {
    doAction: function (name, viewModel) {
        if (this[name])
            this[name](viewModel);
    },
    init_Extend: function (viewModel) {

        var params = cb.route.getViewPartParams(viewModel);
        var parentViewModel = params.parentViewModel;
        var symbol = parentViewModel.getSymbol();
        var data = {};
        //data.id = parentViewModel.getPkName();
        data = parentViewModel.getPkValue();

        var billTypeModel = parentViewModel.getFieldModelFromInterfaceField("billtype");
        var billType;
        if (billTypeModel) {
            var refName = billTypeModel.get("refName");
            var refData = billTypeModel.get("refData");
            billType = refName && refData && refData[refName];
        }

        var billNoModel = parentViewModel.getFieldModelFromInterfaceField("billno");
        var billNo = billNoModel && billNoModel.getValue();

        var creatorModel = parentViewModel.getFieldModelFromInterfaceField("creator");
        var creator;
        if (creatorModel) {
            var refName = creatorModel.get("refName");
            var refData = creatorModel.get("refData");
            creator = refName && refData && refData[refName];
        }

        if (billType && billNo && creator) {
            cb.route.setPageViewPartTitle(viewModel, null, billType + " " + billNo + " 提交人" + creator);
        }

        if (!symbol) {
            //if (false) {
            cb.console.error("ApprovalViewModel_Extend.submitAction: symbol为空");
            return;
        }

        cb.data.CommonProxy(symbol).LinkApproveInfo({ id: data }, function (success, fail) {
            //cb.data.CommonProxy('sa.Delivery').LinkApproveInfo('1001ZZ1000000000SLG2', function (success, fail) {
            if (fail) {
                cb.util.tipMessage("取审批数据错误");
            }
            else {
                var refdata = {};
                refdata.billno = "test";
                refdata.dataSource = success;
                refdata.creater = "test1";

                viewModel.getprocessbar().set("Data", refdata);
            }
        });
    },
    closeAction: function (viewModel, args) {
        cb.route.hidePageViewPart(viewModel);
    },
    submitAction: function (viewModel, args) {

        var params = cb.route.getViewPartParams(viewModel);
        if (!params) {
            cb.console.error("ApprovalViewModel_Extend.submitAction: getViewPartParams为空");
            return;
        }
        var parentViewModel = params.parentViewModel;
        var symbol = parentViewModel.getSymbol();
        var data = {};
        data.billVO = cb.biz.getInputData(parentViewModel);

        var approveResult = "Y";
        var approveNote = "同意";

        switch (viewModel.getapprovalview().getValue()) {
            case "0":
                approveResult = "Y";
                approveNote = "同意";
                break;
            case "1":
                approveResult = "N";
                approveNote = "不同意";
                break;
            case "2":
                approveResult = "R";
                approveNote = "驳回";
                break;
        }

        data.approveInfo =
            {
                "approveResult": approveResult,
                "checkNote": viewModel.getapprovalcomments().getValue() || approveNote,
                "activityId": viewModel.getrejectCombo().getValue()
            };
        if (!symbol) {
            //if (false) {
            cb.console.error("ApprovalViewModel_Extend.submitAction: symbol为空");
            return;
        }
        cb.data.CommonProxy(symbol).Approve(data, function (success, fail) {
            //cb.data.CommonProxy('sa.Delivery').Approve(data, function (success, fail) {
            if (fail) {
                cb.util.tipMessage("审批失败");
                return;
            }
            cb.util.tipMessage("审批成功");
            var params = cb.route.getViewPartParams(viewModel);
            if (params.callBack) {
                params.callBack(success);
            }

        });
        cb.route.hidePageViewPart(viewModel);
    },
    processbarClick: function (viewModel, args) {
        cb.route.loadView(args.container, "common.contact.ContactDetail", { "personNo": args.data });
    },
    approvalViewClick: function (viewModel, args) {
        ///<param name="viewModel" type="ApprovalViewModel">viewModel</param>
        if (args) {
            if (args.getValue() == '2') {
                viewModel.getrejectCombo().set('visible', true);
                //viewModel.getrejectCombo().set('data',
                var params = cb.route.getViewPartParams(viewModel);
                var parentViewModel = params.parentViewModel;
                var symbol = parentViewModel.getSymbol();
                if (!params) {
                    cb.console.error("ApprovalViewModel_Extend.submitAction: getViewPartParams为空");
                    return;
                }
                var data = parentViewModel.getPkValue();
                //data = '1001ZZ1000000000SLG2';
                cb.data.CommonProxy(symbol).OverRule({ id: data }, function (success, fail) {
                    ///<param name='success' type='Array'>success</param>
                    if (fail) {
                        cb.util.tipMessage("驳回列表错误");
                    }
                    else {

                        if (success && success.length > 0) {
                            success.forEach(function (data, dataIndex, datas) {
                                data['image'] = 'pc/images/menu/u32.png',
                                data['value'] = data['id'],
                                data['text'] = data['name']
                            });
                        }
                        viewModel.getrejectCombo().set('dataSource', success);
                    }
                });
            }
            else
                viewModel.getrejectCombo().set('visible', false);
        }
    }
};
