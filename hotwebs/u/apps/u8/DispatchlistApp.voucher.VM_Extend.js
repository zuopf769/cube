/// <reference path="../../common/js/Cube.js" />
/// <reference path="DispatchlistAppViewModel_voucher_M.js" />

cb.viewmodel.u8_DispatchlistAppViewModel_voucher_Extend = function () {};
cb.viewmodel.u8_DispatchlistAppViewModel_voucher_Extend.prototype.doAction = function (name, viewModel) {
    if (this[name])
        this[name](viewModel);
};

cb.viewmodel.u8_DispatchlistAppViewModel_voucher_Extend.prototype.bodyAction =  function (viewModel, args) {
     /// <param name="viewModel" type="DispatchlistAppViewModel_voucher">viewModel类型为DispatchlistAppViewModel_voucher</param>
        cb.route.loadPageViewPart(viewModel, cb.route.CommonAppEnum.SubLine, { mode: this.mode });
};

cb.viewmodel.u8_DispatchlistAppViewModel_voucher_Extend.prototype.prevAction = function (viewModel, args) {
	 /// <param name="viewModel" type="DispatchlistAppViewModel_voucher">viewModel类型为DispatchlistAppViewModel_voucher</param>
        alert(args + "功能正在开发中...");
};

cb.viewmodel.u8_DispatchlistAppViewModel_voucher_Extend.prototype.prevAction = function (viewModel, args) {
	 /// <param name="viewModel" type="DispatchlistAppViewModel_voucher">viewModel类型为DispatchlistAppViewModel_voucher</param>
        alert(args + "功能正在开发中...");
};

cb.viewmodel.u8_DispatchlistAppViewModel_voucher_Extend.prototype.tabMenuClick = function (viewModel, args) {
	 
};


cb.viewmodel.u8_DispatchlistAppViewModel_voucher_Extend.prototype.addAction= function (viewModel, args) {
	/// <param name="viewModel" type="DispatchlistAppViewModel_voucher">viewModel类型为DispatchlistAppViewModel_voucher</param>
   if (!args || !args.inputData) return;
   switch (args.inputData) {
        case "blank":
            viewModel.commonCRUD.add();
            break;
        case "contract":
            cb.route.loadPageViewPart(viewModel, cb.route.CommonAppEnum.Pull, { srcBillType: "SOS1", targetBillType: "U817",bd:1 });
            break;
    }
    //cb.route.loadPageViewPart(viewModel, cb.route.CommonAppEnum.Pull, { srcBillType: "SOS1", targetBillType: "U817",bd:1 });
};	

cb.viewmodel.u8_DispatchlistAppViewModel_voucher_Extend.prototype.saveAction= function (viewModel, args) {
	/// <param name="viewModel" type="DispatchlistAppViewModel_voucher">viewModel类型为DispatchlistAppViewModel_voucher</param>
};	

cb.viewmodel.u8_DispatchlistAppViewModel_voucher_Extend.prototype.editAction= function (viewModel, args) {
	/// <param name="viewModel" type="DispatchlistAppViewModel_voucher">viewModel类型为DispatchlistAppViewModel_voucher</param>
};	

cb.viewmodel.u8_DispatchlistAppViewModel_voucher_Extend.prototype.cancelAction= function (viewModel, args) {
	/// <param name="viewModel" type="DispatchlistAppViewModel_voucher">viewModel类型为DispatchlistAppViewModel_voucher</param>
};	

cb.viewmodel.u8_DispatchlistAppViewModel_voucher_Extend.prototype.copyAction= function (viewModel, args) {
	/// <param name="viewModel" type="DispatchlistAppViewModel_voucher">viewModel类型为DispatchlistAppViewModel_voucher</param>
};	

cb.viewmodel.u8_DispatchlistAppViewModel_voucher_Extend.prototype.deleteAction= function (viewModel, args) {
	/// <param name="viewModel" type="DispatchlistAppViewModel_voucher">viewModel类型为DispatchlistAppViewModel_voucher</param>
};	

cb.viewmodel.u8_DispatchlistAppViewModel_voucher_Extend.prototype.outboundAction= function (viewModel, args) {
    /// <param name="viewModel" type="">viewModel类型为</param>
    var data = cb.biz.getInputData(viewModel);
    var pkName = viewModel.getPkName();
    var pkValue = viewModel.getPkValue();  //data[pkName];
    data['code'] = pkName;
    data['value'] = pkValue;
    data['en'] = 'pk_dispatchlist_b';
    var filters = [];
    filters.push(data);
    var param = {
        "srcBillType": 'U817',
        "targetBillType": 'U818',
        "columnCode": 'u8_dispatchlistdetails',
        //"billType": billType,
        "filters": filters
    };
    cb.route.loadPageViewPart(viewModel, cb.route.CommonAppEnum.Push, param);

};	
cb.viewmodel.u8_DispatchlistAppViewModel_voucher_Extend.prototype.draftAction= function (viewModel, args) {
	/// <param name="viewModel" type="DispatchlistAppViewModel_voucher">viewModel类型为DispatchlistAppViewModel_voucher</param>
    var $part = $(".related-part");
    if (!$part.length) return;
    var pageUrl = cb.route.getPageUrl("common.related.CustomerRelated");
    $part.loadView(pageUrl, function () {
        $part.directRight2();
    });
};	

cb.viewmodel.u8_DispatchlistAppViewModel_voucher_Extend.prototype.submitAction= function (viewModel, args) {
	/// <param name="viewModel" type="DispatchlistAppViewModel_voucher">viewModel类型为DispatchlistAppViewModel_voucher</param>
};	

cb.viewmodel.u8_DispatchlistAppViewModel_voucher_Extend.prototype.withDrawAction= function (viewModel, args) {
	/// <param name="viewModel" type="DispatchlistAppViewModel_voucher">viewModel类型为DispatchlistAppViewModel_voucher</param>
};	

cb.viewmodel.u8_DispatchlistAppViewModel_voucher_Extend.prototype.approveAction= function (viewModel, args) {
	/// <param name="viewModel" type="DispatchlistAppViewModel_voucher">viewModel类型为DispatchlistAppViewModel_voucher</param>
};
cb.viewmodel.u8_DispatchlistAppViewModel_voucher_Extend.prototype.linkQueryAction = function (viewModel, args) {
    //联查功能
    var srcbillid = viewModel.getsrcbillid().getValue();//获取来源单据id
    var srcbilltype = viewModel.getsrcbilltype_pk_billtypecode();//获取来源单据类型编码非id
    if (srcbillid && srcbilltype) {
        var data = {};
        data.srcBillId = srcbillid;
        data.srcBillType = srcbilltype;
        data.busiType = viewModel.getbusitype().getValue();//所属业务流id
        data.billType = viewModel.getvtrantype_pk_billtypecode();//当前单据类型编码
        data.billno = viewModel.getbillno().getValue();//单据号
        data.id = viewModel.getPkValue();//当前单据pk
        //{ "busiType":"","srcBillType":"SOS1","srcBillId":"1001T1100000000001F3",
        //"billType":"U817","billno":"U8172015052900000005","id":"1001ZZ10000000000337"}
        args.commonCRUD.linkQuery(data);
    } else {
        cb.util.tipMessage("当前单据暂无可联查单据");
    }
    args.cancel = true;
}

cb.viewmodel.u8_DispatchlistAppViewModel_voucher_Extend.prototype.deleteLineAction= function (viewModel, args) {
	/// <param name="viewModel" type="DispatchlistAppViewModel_voucher">viewModel类型为DispatchlistAppViewModel_voucher</param>
};	

cb.viewmodel.u8_DispatchlistAppViewModel_voucher_Extend.prototype.divideLineAction= function (viewModel, args) {
	/// <param name="viewModel" type="DispatchlistAppViewModel_voucher">viewModel类型为DispatchlistAppViewModel_voucher</param>
};	

cb.viewmodel.u8_DispatchlistAppViewModel_voucher_Extend.prototype.copyLineAction= function (viewModel, args) {
	/// <param name="viewModel" type="DispatchlistAppViewModel_voucher">viewModel类型为DispatchlistAppViewModel_voucher</param>
};	

cb.viewmodel.u8_DispatchlistAppViewModel_voucher_Extend.prototype.addLineAction= function (viewModel, args) {
	/// <param name="viewModel" type="DispatchlistAppViewModel_voucher">viewModel类型为DispatchlistAppViewModel_voucher</param>
};	

cb.viewmodel.u8_DispatchlistAppViewModel_voucher_Extend.prototype.unApproveAction= function (viewModel, args) {
	/// <param name="viewModel" type="DispatchlistAppViewModel_voucher">viewModel类型为DispatchlistAppViewModel_voucher</param>
};	

cb.viewmodel.u8_DispatchlistAppViewModel_voucher_Extend.prototype.insertLineAction= function (viewModel, args) {
	/// <param name="viewModel" type="DispatchlistAppViewModel_voucher">viewModel类型为DispatchlistAppViewModel_voucher</param>
};	

cb.viewmodel.u8_DispatchlistAppViewModel_voucher_Extend.prototype.printAction= function (viewModel, args) {
	/// <param name="viewModel" type="DispatchlistAppViewModel_voucher">viewModel类型为DispatchlistAppViewModel_voucher</param>
};	

cb.viewmodel.u8_DispatchlistAppViewModel_voucher_Extend.prototype.callBack = function (){
    //var commonFunc= this.commonFunc;
    //关闭页签提示保存
    if(this.isDirty()) {
        // return commonFunc.hintSave( recallBack );
        return confirm("你即将离开当前页签");
    };

};
cb.viewmodel.u8_DispatchlistAppViewModel_voucher_Extend.prototype.init_Extend = function (viewModel) {
   // cb.data.commonCRUD(viewModel).bodyConfig();//设置表体相关内容状态
    this.customInit(viewModel);//客户化
    if (viewModel.getccuscode) {
        viewModel.getccuscode().un("clicklink");
        viewModel.getccuscode().on("clicklink", function (args) {
            new cb.data.commonCRUD(viewModel).openLink(args);
        });
    }
    /// <param name="viewModel" type="DispatchlistViewModel">viewModel类型为DispatchlistViewModel</param>

    viewModel.getModel3D('pk_dispatchlist_b').setData({"dsMode":"Local",pageSize:-1});

    if (viewModel.getapprovestatus) viewModel.getapprovestatus().setDataSource([
        { "name": "free", "value": -1, "text": "自由" },
        { "name": "obsolete", "value": 0, "text": "审批未通过" },
        { "name": "reviewed", "value": 1, "text": "审批通过" },
        { "name": "reviewing", "value": 2, "text": "审批中" },
        { "name": "commit", "value": 3, "text": "已提交" }
    ]);
    if (viewModel.getaddAction) viewModel.getaddAction().setDataSource([
        { "name": "self", "value": "blank", "text": "增加空白单据" },
        { "name": "pull", "value": "opportunity", "text": "从销售机会生成" },
        { "name": "pull", "value": "contract", "text": "从销售订单生成" },
        { "name": "pull", "value": "quotation", "text": "从销售报价生成" },
        { "name": "pull", "value": "schedule", "text": "从销售预定生成" }
    ]);
	 /// <param name="viewModel" type="DispatchlistViewModel">viewModel类型为DispatchlistViewModel</param>
	var params = cb.route.getViewPartParams(viewModel);
    if (!params) return;
    this.symbol = viewModel.getSymbol();
    if (!this.symbol) return;
    this.mode = params.mode;
    if (!this.mode) return;		        

    if (this.mode === "add") {
        viewModel.on("afteradd", function () {
            viewModel.getvtrantype().setValue("0001ZZ10000000007U5V");
            viewModel.getvtrantypecode().setValue("U817");
            viewModel.getapprovestatus().setValue("-1");
            //viewModel.getapprovedate().setValue("@SYSDATE");
            viewModel.getbilldate().setValue("@SYSDATE");
        });
		viewModel.commonCRUD.add();         
    }
    else if (this.mode === "view") {
        viewModel.on("afterbrowse", function () {
            if (viewModel.getbodyAction)
                viewModel.getbodyAction().setValue("产品(" + viewModel.getModel3D().getTotalCount() + ")");
        });
		viewModel.commonCRUD.browse(params);            
    } 
    cb.route.unsubscribeMessage(viewModel, "beforeTabMenuClose", this.callBack);
    cb.route.subscribeMessage(viewModel, "beforeTabMenuClose", this.callBack, viewModel); 
};

/*************************************************
 *** 当grid中数据发生变化时，触发此事件。
 *** 将数据状态修改为 state = 1;
 *** data = { index: rowIndex, field: cellName, value: value, oldValue: oldValue };
 *** 如果有主键的行数据发生改变，则认为是修改。
/*************************************************/

cb.viewmodel.u8_DispatchlistAppViewModel_voucher_Extend.prototype.afterCellChange = function (viewModel, data) {
    var row = viewModel.getpk_dispatchlist_b().getRows(data.index);
    if (row && cb.isArray(row) && row.length > 0) {
        if (row[0][viewModel.getpk_dispatchlist_b().getPkName()]) {
            row[0]["state"] = cb.model.DataState.Update;
        }
    }
}

cb.viewmodel.u8_DispatchlistAppViewModel_voucher_Extend.prototype.beforecopy = function (data) {
    data.billno = null;
    data.pk_dispatchlist = null;
    data.approver = null;
    data.billdate = new Date().format("yyyy-MM-dd HH:mm:ss");
    data.billcloser = null;
    data.billclosetime = null;
    data.lastprintor = null;
    data.lastprinttime = null;
    data.approvestatus = -1;
    for (var i = 0; i < data.pk_dispatchlist_b.length; i++) {
        data.pk_dispatchlist_b[i].pk_dispatchlist = null;
        data.pk_dispatchlist_b[i].pk_dispatchlistdetails = null;
        data.pk_dispatchlist_b[i].state = cb.model.DataState.Add; //新增行
    }
};

cb.viewmodel.u8_DispatchlistAppViewModel_voucher_Extend.prototype.amountRowFill = function (viewModel, success, row) {
    if (success != null) {
        var i = row;
        var somainLines = viewModel.getpk_dispatchlist_b();
        somainLines.setCellValue(i, "iquantity", success.iquantity, false);
        somainLines.setCellValue(i, "inum", success.inum, false);
        //somainLines.setCellValue(i,"cunitcode",success.cunitcode,false)	;
        somainLines.setCellValue(i, "iquounitprice", success.iquounitprice, false);
        //somainLines.setCellValue(i,"brtax",success.brtax,false)	;
        somainLines.setCellValue(i, "iunitprice", success.iunitprice, false);
        somainLines.setCellValue(i, "itaxunitprice", success.itaxunitprice, false);
        somainLines.setCellValue(i, "imoney", success.imoney, false);
        somainLines.setCellValue(i, "itax", success.itax, false);
        somainLines.setCellValue(i, "isum", success.isum, false);
        somainLines.setCellValue(i, "idiscountrate", success.idiscountrate, false);
        somainLines.setCellValue(i, "idiscount", success.idiscount, false);
        somainLines.setCellValue(i, "inatunitprice", success.inatunitprice, false);
        somainLines.setCellValue(i, "inattaxunitprice", success.inattaxunitprice, false);
        somainLines.setCellValue(i, "inatmoney", success.inatmoney, false);
        somainLines.setCellValue(i, "inattax", success.inattax, false);
        somainLines.setCellValue(i, "inatsum", success.inatsum, false);
        somainLines.setCellValue(i, "inatdiscount", success.inatdiscount, false);
    }
};


cb.viewmodel.u8_DispatchlistAppViewModel_voucher_Extend.prototype.afterAddNewRow = function (viewModel) {
    //	添加 报价行是否含税	取表头的是否含税		
    var row = viewModel.getModel3D().getRows().length;
    if (row >= 1) {
        viewModel.getpk_dispatchlist_b().setCellValue(row - 1, "brtax", viewModel.getbtax().getValue(), false);
    }
};

cb.viewmodel.u8_DispatchlistAppViewModel_voucher_Extend.prototype.cexch_nameChange = function (viewModel, args) {

};

cb.viewmodel.u8_DispatchlistAppViewModel_voucher_Extend.prototype.iexchrateChange = function (viewModel, args) {

};

cb.viewmodel.u8_DispatchlistAppViewModel_voucher_Extend.prototype.cellChange_iquantity = function (viewModel, args) {

};

cb.viewmodel.u8_DispatchlistAppViewModel_voucher_Extend.prototype.setAttachColumn = function (viewModel) {
    //设置表体附件信息
    var model3d = viewModel.getModel3D();
    var columns = viewModel.getModel3D().getAllColumns();
    model3d.setData({
        commands: {
            title: "操作",
            width: "25%",
            isVisible:true,
            cmds: [{
                name: 'attachmentOpt', text: '<img src="pc/images/ImageButton/attachment.png" width="9px" height="17px" /><span>&nbsp;附件</span>', click: function (args) {
                    var queryData = { rowIndex: args, fieldname: "attachrelateid", mode: "bodyAttach" };
                    cb.route.loadPageViewPart(this.getParent(), 'common.attachment.AttachmentListApp', {
                        width: "700px", height: 300, queryData: queryData
                    })

                }
            }]
        }
    });
    debugger;
};


cb.viewmodel.u8_DispatchlistAppViewModel_voucher_Extend.prototype.customInit = function (viewModel) {
    var that = this;
    //币种选择事件
    viewModel.getcexch_name().on("afterchange", function (args) { that.cexch_nameChange(this.getParent(), args); });
    //汇率变化事件
    viewModel.getiexchrate().on("afterchange", function (args) { that.iexchrateChange(this.getParent(), args); });
    viewModel.getpk_dispatchlist_b().on("afterCellChange",
                function (args) {
                    //args : context
                    //var context = { Row: 0, CellName: "id", Value: value, OldValue: oldValue };
                    if (args.CellName === "iquantity" || args.CellName === "itaxunitprice" || args.CellName === "iquounitprice")
                        //if (args.CellName === "iquantity" )
                        that.cellChange_iquantity(this.getParent(), args);
                });

    //行增加事件，
    viewModel.getpk_dispatchlist_b().on("afterinsert", function (args) { that.afterAddNewRow(this.getParent()); });

    if (viewModel.getpk_dispatchlist_b()) {
        viewModel.getpk_dispatchlist_b().on("afterCellChange", function (data) { that.afterCellChange(viewModel, data); });
    }

    viewModel.on("beforecopy", this.beforecopy);

    var proxyConfig = {
        CheckAmount: { url: "classes/Amount/UAP/CheckAmount", method: "Post" },
        CheckAmountList: { url: "classes/Amount/UAP/CheckAmountList", method: "Post" },
        QueryForeigncurrency: { url: "classes/Amount/UAP/QueryForeigncurrency", method: "Post" },
        QueryAccinformationByCsysid: { url: "classes/Accinformation/UAP/QueryAccinformationByCsysid", method: "Post" },
    };
    viewModel.setProxy(proxyConfig);
    //设置表体附件
    this.setAttachColumn(viewModel);
};
