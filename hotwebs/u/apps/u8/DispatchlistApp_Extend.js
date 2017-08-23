/// <reference path="../../common/js/Cube.js" />
/// <reference path="DispatchlistViewModel_M.js" />

var DispatchlistViewModel_Extend = function () {};
DispatchlistViewModel_Extend.prototype.doAction = function (name, viewModel) {
    if (this[name])
        this[name](viewModel);
};

DispatchlistViewModel_Extend.prototype.bodyAction =  function (viewModel, args) {
     /// <param name="viewModel" type="">viewModel类型为</param>
        cb.route.loadPageViewPart(viewModel, cb.route.CommonAppEnum.SubLine, { mode: this.mode });
};

DispatchlistViewModel_Extend.prototype.prevAction = function (viewModel, args) {
	 /// <param name="viewModel" type="">viewModel类型为</param>
        alert(args + "功能正在开发中...");
};

DispatchlistViewModel_Extend.prototype.prevAction = function (viewModel, args) {
	 /// <param name="viewModel" type="">viewModel类型为</param>
        alert(args + "功能正在开发中...");
};

DispatchlistViewModel_Extend.prototype.tabMenuClick = function (viewModel, args) {
	 
};


    DispatchlistViewModel_Extend.prototype.addAction= function (viewModel, args) {
        /// <param name="viewModel" type="">viewModel类型为</param>
        if (!args || args.inputData) return;
        switch (args.inputData) {
            case "blank":
                viewModel.commonCRUD.add();
                break;
            case "contract":
                cb.route.loadPageViewPart(viewModel, cb.route.CommonAppEnum.Pull, { srcBillType: "SOS1", targetBillType: "U817" });
                break;
        }
	};	

    DispatchlistViewModel_Extend.prototype.copyAction= function (viewModel, args) {
		/// <param name="viewModel" type="">viewModel类型为</param>
	};	

    DispatchlistViewModel_Extend.prototype.draftAction= function (viewModel, args) {
		/// <param name="viewModel" type="">viewModel类型为</param>
	};	

    DispatchlistViewModel_Extend.prototype.editAction= function (viewModel, args) {
		/// <param name="viewModel" type="">viewModel类型为</param>
	};	

    DispatchlistViewModel_Extend.prototype.submitAction= function (viewModel, args) {
		/// <param name="viewModel" type="">viewModel类型为</param>
	};	

    DispatchlistViewModel_Extend.prototype.getorderAction= function (viewModel, args) {
		/// <param name="viewModel" type="">viewModel类型为</param>
	};	

    DispatchlistViewModel_Extend.prototype.withdrawAction= function (viewModel, args) {
		/// <param name="viewModel" type="">viewModel类型为</param>
	};	

    DispatchlistViewModel_Extend.prototype.approveAction= function (viewModel, args) {
		/// <param name="viewModel" type="">viewModel类型为</param>
	};	

    DispatchlistViewModel_Extend.prototype.unapproveAction= function (viewModel, args) {
		/// <param name="viewModel" type="">viewModel类型为</param>
	};	

    DispatchlistViewModel_Extend.prototype.deleteAction= function (viewModel, args) {
		/// <param name="viewModel" type="">viewModel类型为</param>
	};	

    DispatchlistViewModel_Extend.prototype.outboundAction= function (viewModel, args) {
        /// <param name="viewModel" type="">viewModel类型为</param>
        //var data = cb.biz.getInputData(viewModel);
        //var pkName = viewModel.getPkName();
        //var pkValue = viewModel.getPkValue();  //data[pkName];
        //data['code'] = pkName;
        //data['value'] = pkValue;
        //data['en'] = 'pk_dispatchlist_b';
        //var filters = [];
        //filters.push(data);
        //var param = {
        //    "srcBillType": 'U817',
        //    "targetBillType": 'U818',
        //    "columnCode": 'u8_dispatchlistdetails',
        //    "billType": billType,
        //    "filters": filters
        //};
        //cb.route.loadPageViewPart(viewModel, cb.route.CommonAppEnum.Push, param);
        
      
	};	

    DispatchlistViewModel_Extend.prototype.relatedAction= function (viewModel, args) {
        /// <param name="viewModel" type="">viewModel类型为</param>
        /// <param name="viewModel" type="DispatchlistViewModel">viewModel类型为DispatchlistViewModel</param>
        var $part = $(".related-part");
        if (!$part.length) return;
        var pageUrl = cb.route.getPageUrl("common.related.CustomerRelated");
        $part.loadView(pageUrl, function () {
            $part.directRight2();
        });
	};	

    DispatchlistViewModel_Extend.prototype.setAction= function (viewModel, args) {
		/// <param name="viewModel" type="">viewModel类型为</param>
	};	

    DispatchlistViewModel_Extend.prototype.printAction= function (viewModel, args) {
		/// <param name="viewModel" type="">viewModel类型为</param>
	};	

    DispatchlistViewModel_Extend.prototype.outputAction= function (viewModel, args) {
		/// <param name="viewModel" type="">viewModel类型为</param>
	};	

    DispatchlistViewModel_Extend.prototype.cancelAction= function (viewModel, args) {
		/// <param name="viewModel" type="">viewModel类型为</param>
	};	

    DispatchlistViewModel_Extend.prototype.saveAction= function (viewModel, args) {
		/// <param name="viewModel" type="">viewModel类型为</param>
	};	

    DispatchlistViewModel_Extend.prototype.addLineAction= function (viewModel, args) {
		/// <param name="viewModel" type="">viewModel类型为</param>
	};	

    DispatchlistViewModel_Extend.prototype.insertLineAction= function (viewModel, args) {
		/// <param name="viewModel" type="">viewModel类型为</param>
	};	

    DispatchlistViewModel_Extend.prototype.copyLineAction= function (viewModel, args) {
        /// <param name="viewModel" type="">viewModel类型为</param>

	};	

    DispatchlistViewModel_Extend.prototype.divideLineAction= function (viewModel, args) {
		/// <param name="viewModel" type="">viewModel类型为</param>
	};	

    DispatchlistViewModel_Extend.prototype.deleteLineAction= function (viewModel, args) {
		/// <param name="viewModel" type="">viewModel类型为</param>
	};	

    DispatchlistViewModel_Extend.prototype.batchEditAction= function (viewModel, args) {
		/// <param name="viewModel" type="">viewModel类型为</param>
	};	

    DispatchlistViewModel_Extend.prototype.stockAction= function (viewModel, args) {
		/// <param name="viewModel" type="">viewModel类型为</param>
	};	

    DispatchlistViewModel_Extend.prototype.priceAction= function (viewModel, args) {
		/// <param name="viewModel" type="">viewModel类型为</param>
	};	

    DispatchlistViewModel_Extend.prototype.discountAction= function (viewModel, args) {
		/// <param name="viewModel" type="">viewModel类型为</param>
	};	

    DispatchlistViewModel_Extend.prototype.creditAction= function (viewModel, args) {
		/// <param name="viewModel" type="">viewModel类型为</param>
	};	

    DispatchlistViewModel_Extend.prototype.optionalPopAction= function (viewModel, args) {
		/// <param name="viewModel" type="">viewModel类型为</param>
	};	

    DispatchlistViewModel_Extend.prototype.setLineAction= function (viewModel, args) {
		/// <param name="viewModel" type="">viewModel类型为</param>
	};	

    DispatchlistViewModel_Extend.prototype.prevAction= function (viewModel, args) {
		/// <param name="viewModel" type="">viewModel类型为</param>
	};	

    DispatchlistViewModel_Extend.prototype.nextAction= function (viewModel, args) {
		/// <param name="viewModel" type="">viewModel类型为</param>
	};	

    DispatchlistViewModel_Extend.prototype.nextAction= function (viewModel, args) {
		/// <param name="viewModel" type="">viewModel类型为</param>
	};	

    DispatchlistViewModel_Extend.prototype.pullAction= function (viewModel, args) {
		/// <param name="viewModel" type="">viewModel类型为</param>
	};	


 DispatchlistViewModel_Extend.prototype.init_Extend = function (viewModel) {
    this.customInit(viewModel);

    /// <param name="viewModel" type="DispatchlistViewModel">viewModel类型为DispatchlistViewModel</param>

    viewModel.getModel3D().set("dsMode", "Local");

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
        { "name": "pull", "value": "contract", "text": "从销售合同生成" },
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

    viewModel.on("beforecopy", this.beforecopy);

    var appIdItems = params.appId.split(".");
    if (appIdItems.length !== 2) return;
    var data = { "moduleName": appIdItems[0], "appName": appIdItems[1], "viewModelName": viewModel.getName() };
    var config = { GetFieldPerm: { url: "classes/Login/UAP/GetFieldPerm", method: "Get" } };
    var proxy = cb.rest.DynamicProxy.create(config);
    proxy.GetFieldPerm(data, function (success, fail) {
        if (fail) {
            alert("读取字段权限数据失败");
            return;
        }
        viewModel.loadFieldPermData(success);
    });
 };

 DispatchlistViewModel_Extend.prototype.beforecopy = function (data) {
     data.billno = null;
     data.pk_dispatchlist = null;
     data.approver = null;
     data.billdate = new Date().format("yyyy-MM-dd HH:mm:ss");
     data.billcloser = null;
     data.billclosetime = null;
     data.lastprintor = null;
     data.lastprinttime = null;
     data.approvestatus = -1;
     for (var i = 0; i < data.model3d.length; i++) {
         data.model3d[i].pk_dispatchlist = null;
         data.model3d[i].pk_dispatchlistdetails = null;
         data.model3d[i].state = cb.model.DataState.Add; //新增行
     }
 };

 DispatchlistViewModel_Extend.prototype.amountRowFill = function (viewModel, success, row) {
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


 DispatchlistViewModel_Extend.prototype.afterAddNewRow = function (viewModel) {
     //	添加 报价行是否含税	取表头的是否含税		
     var row = viewModel.getModel3D().getRows().length;
     if (row >= 1) {
         viewModel.getpk_dispatchlist_b().setCellValue(row - 1, "brtax", viewModel.getbtax().getValue(), false);
     }
 };

 DispatchlistViewModel_Extend.prototype.customInit = function (viewModel) {
     //币种选择事件
     viewModel.getcexch_name().on("afterchange", function (args) { DispatchlistViewModel_Extend.cexch_nameChange(this.getParent(), args); });
     //汇率变化事件
     viewModel.getiexchrate().on("afterchange", function (args) { DispatchlistViewModel_Extend.iexchrateChange(this.getParent(), args); });
     viewModel.getpk_dispatchlist_b().on("afterCellChange",
                 function (args) {
                     //args : context
                     //var context = { Row: 0, CellName: "id", Value: value, OldValue: oldValue };
                     if (args.CellName === "iquantity" || args.CellName === "itaxunitprice" || args.CellName === "iquounitprice")
                         //if (args.CellName === "iquantity" )
                         DispatchlistViewModel_Extend.cellChange_iquantity(this.getParent(), args);
                 });

     //行增加事件，
     viewModel.getpk_dispatchlist_b().on("afterinsert", function (args) { DispatchlistViewModel_Extend.afterAddNewRow(this.getParent()); });

     var proxyConfig = {
         CheckAmount: { url: "classes/Amount/UAP/CheckAmount", method: "Post" },
         CheckAmountList: { url: "classes/Amount/UAP/CheckAmountList", method: "Post" },
         QueryForeigncurrency: { url: "classes/Amount/UAP/QueryForeigncurrency", method: "Post" },
         QueryAccinformationByCsysid: { url: "classes/Accinformation/UAP/QueryAccinformationByCsysid", method: "Post" },
     };
     viewModel.setProxy(proxyConfig);
 };