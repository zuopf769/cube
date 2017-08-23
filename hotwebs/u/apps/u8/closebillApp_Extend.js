/// <reference path="../../common/js/Cube.js" />
/// <reference path="closebillApp_M.js" />

var closebillViewModel_Extend = {
    doAction: function (name, viewModel) {
        if (this[name])
            this[name](viewModel);
    },
    bodyAction: function (viewModel, args) {
        /// <param name="viewModel" type="">viewModel类型为</param>
        //viewModel.loadPageView("common.voucherbody.SubLine", { mode: this.mode });
		cb.route.loadPageViewPart(viewModel, cb.route.CommonAppEnum.SubLine, { mode: this.mode });
    },
	searchAction: function (viewModel, args) {
        /// <param name="viewModel" type="">viewModel类型为</param>
        alert(args + "功能正在开发中...");
    },
	prevAction: function (viewModel, args) {
        /// <param name="viewModel" type="">viewModel类型为</param>
        alert(args + "功能正在开发中...");
    },
	nextAction: function (viewModel, args) {
        /// <param name="viewModel" type="">viewModel类型为</param>
        alert(args + "功能正在开发中...");
    },
	tabMenuClick: function (viewModel, args) {
        
    },
    addAction: function (viewModel, args) {
        /// <param name="viewModel" type="">viewModel类型为</param>
        if (!args) return;
        switch (args) {
            case "blank":
                if (viewModel.getsaveAction) viewModel.getsaveAction().set("Visible", true);
                if (viewModel.geteditAction) viewModel.geteditAction().set("Visible", false);
                if (viewModel.getcancelAction) viewModel.getcancelAction().set("Visible", true);
                if (viewModel.getaddLineAction) viewModel.getaddLineAction().set("Visible", true);
                viewModel.NewRecord();
                if (viewModel.getbodyAction) viewModel.getbodyAction().setValue("产品(0)");
                viewModel.setReadOnly(false);
                break;
            case "contract":
                //viewModel.loadDialogViewPart("common.pull.CommonPullList");
				cb.route.loadPageViewPart(viewModel, cb.route.CommonAppEnum.Pull, {detailInfo: { srcBillType: "SOS1", targetBillType: "U822"} });
                break;
	        case "somain":
	    	//viewModel.loadDialogViewPart("common.pull.CommonPullList", {detailInfo: { srcBillType: "SOS1", targetBillType: "U822"} });
	      //cb.route.loadPageViewPart(viewModel, cb.route.CommonAppEnum.Pull, {detailInfo: { srcBillType: "SOS1", targetBillType: "U822"} });
	        cb.route.loadPageViewPart(viewModel, cb.route.CommonAppEnum.Pull, { srcBillType: "SOS1", targetBillType: "U822",mainColumnCode:"uppurchaseorder",subColumnCode:"uppurchaseorderdetail",columnCode : "uppurchaseorderdetail" });
                break;
        }
    },
    copyAction: function (viewModel, args) {
        /// <param name="viewModel" type="">viewModel类型为</param>
//        alert(args + "功能正在开发中...");
    },
    draftAction: function (viewModel, args) {
        /// <param name="viewModel" type="">viewModel类型为</param>
        alert(args + "功能正在开发中...");
    },
    editAction: function (viewModel, args) {
        /// <param name="viewModel" type="">viewModel类型为</param>
//        if (viewModel.getsaveAction) viewModel.getsaveAction().set("Visible", true);
//        if (viewModel.geteditAction) viewModel.geteditAction().set("Visible", false);
//        if (viewModel.getcancelAction) viewModel.getcancelAction().set("Visible", true);
//        if (viewModel.getaddLineAction) viewModel.getaddLineAction().set("Visible", true);
//        viewModel.setReadOnly(false);
    },
    
    tabMenuClick: function (viewModel, args) {
        
    },
    submitAction: function (viewModel, args) {
        /// <param name="viewModel" type="">viewModel类型为</param>
//        if (!this.symbol) return;
//        var data = cb.biz.getInputData(viewModel);
//        cb.data.CommonProxy(this.symbol).Submit(data, function (success, fail) {
//            if (fail) {
//                alert("提交失败");
//                return;
//            }
//            alert("提交成功");
//        });
    },
    withdrawAction: function (viewModel, args) {
        /// <param name="viewModel" type="">viewModel类型为</param>
//        if (!this.symbol) return;
//        var data = cb.biz.getInputData(viewModel);
//        cb.data.CommonProxy(this.symbol).WithDraw(data, function (success, fail) {
//            if (fail) {
//                alert("收回失败");
//                return;
//            }
//            alert("收回成功");
//        });
    },
approveInner: function (viewModel, isApproveDlg) {
        if (isApproveDlg) {
            var symbol = "u8.closebill";
            //viewModel.loadDialogViewPart("common.approve.Approval", { symbol: symbol });
	    cb.route.loadPageViewPart(viewModel, cb.route.CommonAppEnum.Approval, { symbol: symbol });
        }
        else {
            var data = {};
            data.billVO = cb.biz.getInputData(viewModel);
            //data.approveInfo = null;
			//data.approveInfo = {"approveResult": "Y","approveNote": "审批通过","activityid": null};
            cb.data.CommonProxy(this.symbol).Approve(data, function (success, fail) {
                if (fail) {
                    alert("审批失败");
                    return;
                }
                alert("审批成功");
            });
        }
    },
    approveAction: function (viewModel, args) {
        /// <param name="viewModel" type="">viewModel类型为</param>
//        if (!this.symbol) return;
//        var self = this;
//        var isApproveDlg = viewModel.get("isApproveDlg");
//        if (isApproveDlg == null) {
//            var id = viewModel.getPkValue();
//            if (id == null) {
//                cb.console.error("id为空！");
//                return;
//            }
//            cb.data.CommonProxy(this.symbol).CheckApprove(id, function (success, fail) {
//                if (fail) {
//                    alert("检查审批是否需要弹窗失败");
//                    return;
//                }
//                viewModel.set("isApproveDlg", success.isApproveDlg);
//                if (success.isApproveDlg) cb.cache.set("approveHistory", success.approveHistory);
//                self.approveInner(viewModel, success.isApproveDlg);
//            });
//        }
//        else {
//            self.approveInner(viewModel, isApproveDlg);
//        }
    },
    unapproveAction: function (viewModel, args) {
        /// <param name="viewModel" type="">viewModel类型为</param>
//if (!this.symbol) return;
//        var data = cb.biz.getInputData(viewModel);
//        cb.data.CommonProxy(this.symbol).UnApprove(data, function (success, fail) {
//            if (fail) {
//                alert("弃审失败");
//                return;
//            }
//            alert("弃审成功");
//        });
    },
    deleteAction: function (viewModel, args) {
        /// <param name="viewModel" type="">viewModel类型为</param>
//        var msg = "您真的确定要删除吗？\n\n请确认！";
//        if (!confirm(msg)) return;
//        if (!this.symbol) return;
//        var data = cb.biz.getInputData(viewModel);
//        var self = this;
//        cb.data.CommonProxy(this.symbol).Delete(data, function (success, fail) {
//            if (fail) {
//                alert("删除失败");
//                return;
//            }
//            alert("删除成功");
//            self.refreshListData(viewModel);
//        });
    },
    outboundAction: function (viewModel, args) {
        /// <param name="viewModel" type="">viewModel类型为</param>
        //viewModel.loadDialogViewPart("common.push.CommonPushList");
	cb.route.loadPageViewPart(viewModel, cb.route.CommonAppEnum.Push);
    },
    relatedAction: function (viewModel, args) {
        /// <param name="viewModel" type="">viewModel类型为</param>
        var $part = $(".related-part");
        if (!$part.length) return;
        var pageUrl = cb.route.getPageUrl("common.related.CustomerRelated");
        $part.loadView(pageUrl, function () {
            $part.directRight2();
        });
    },
    setAction: function (viewModel, args) {
        /// <param name="viewModel" type="">viewModel类型为</param>
        alert(args + "功能正在开发中...");
    },
    printAction: function (viewModel, args) {
        /// <param name="viewModel" type="">viewModel类型为</param>
        alert(args + "功能正在开发中...");
    },
    outputAction: function (viewModel, args) {
        /// <param name="viewModel" type="">viewModel类型为</param>
        alert(args + "功能正在开发中...");
    },
    cancelAction: function (viewModel, args) {
        /// <param name="viewModel" type="">viewModel类型为</param>
//	cb.route.hideArchiveViewPart(viewModel);
     //   viewModel.hideViewPart();
       // $(".document-wrapper").showToRight2();
    },
    saveAction: function (viewModel, args) {
        /// <param name="viewModel" type="">viewModel类型为</param>
//        if (!viewModel.Validate() || !this.symbol || !this.mode) return;
//        var params = viewModel.collectData();
//        var self = this;
//        var callback = function (success, fail) {
//            if (fail) {
//                alert("保存失败");
//                return;
//            }
//            alert("保存成功");
//            self.refreshListData(viewModel);
//            viewModel.LoadData(success[0]);
//        };
        // UPDATED = 1;//更新
        // NEW = 2;//新增
//        if (this.mode === "add") params.state = 2
//        else if (this.mode === "view") params.state = 1;
//        cb.data.CommonProxy(this.symbol).Save(params, callback);
    },
    insertLineAction: function (viewModel, args) {
        /// <param name="viewModel" type="">viewModel类型为</param>
		//添加行的函数
        viewModel.getModel3D().appendRow();
        args.cancel = true;
    },
    copyLineAction: function (viewModel, args) {
        /// <param name="viewModel" type="">viewModel类型为</param>
		//复制行的操作
        var model3d = viewModel.getModel3D();
        var focusedRow = model3d.getFocusedRow();
        if (!focusedRow) return;
        var rowData = cb.clone(focusedRow);
        model3d.appendRow(rowData);
        args.cancel = true;
    },
    divideLineAction: function (viewModel, args) {
        /// <param name="viewModel" type="">viewModel类型为</param>
        alert(args + "功能正在开发中...");
    },
    deleteLineAction: function (viewModel, args) {
        /// <param name="viewModel" type="">viewModel类型为</param>
		//删除行的操作
        //alert(args + "功能正在开发中...");

		var model3d = viewModel.getModel3D();
		var selectedRows = model3d.getPageSelectedIndexs();
        model3d.deleteRows(selectedRows);
        args.cancel = true;
    },
    batchEditAction: function (viewModel, args) {
        /// <param name="viewModel" type="">viewModel类型为</param>
        alert(args + "功能正在开发中...");
    },
    stockAction: function (viewModel, args) {
        /// <param name="viewModel" type="">viewModel类型为</param>
        alert(args + "功能正在开发中...");
    },
    priceAction: function (viewModel, args) {
        /// <param name="viewModel" type="">viewModel类型为</param>
        alert(args + "功能正在开发中...");
    },
    discountAction: function (viewModel, args) {
        /// <param name="viewModel" type="">viewModel类型为</param>
        alert(args + "功能正在开发中...");
    },
    creditAction: function (viewModel, args) {
        /// <param name="viewModel" type="">viewModel类型为</param>
        alert(args + "功能正在开发中...");
    },
    optionalPopAction: function (viewModel, args) {
        /// <param name="viewModel" type="">viewModel类型为</param>
        alert(args + "功能正在开发中...");
    },
    setLineAction: function (viewModel, args) {
        /// <param name="viewModel" type="">viewModel类型为</param>
        alert(args + "功能正在开发中...");
    },
refreshListData: function (viewModel) {
        //var params = viewModel.getViewPartParams();
	var params = cb.route.getViewPartParams(viewModel);
        if (!params) return;
        var symbol = viewModel.getSymbol();
        if (!symbol) return;
        var model3d = params.parentViewModel.getModel3D();
        var querySchemeID = model3d.get("querySchemeID");
        var pageSize = model3d.getPageSize();
        var pageIndex = 1;
        cb.data.CommonProxy(symbol).Query({
            "querySchemeID": querySchemeID,
            "pageSize": pageSize,
            "pageIndex": pageIndex
        }, function (success, fail) {
            if (fail) {
                alert("查询列表数据失败");
                return;
            }
            success.mode = "override";
            model3d.setPageRows(success);
        });
    },
    init_Extend: function (viewModel) {
         closebillViewModel_Extend.customInit(viewModel);
        /// <param name="viewModel" type="closebillViewModel">viewModel类型为closebillViewModel</param>
        viewModel.getModel3D().set("dsMode", "Local");
        viewModel.getModel3D().set("pageSize", -1);
if (viewModel.getapprovestatus) viewModel.getapprovestatus().setDataSource([
            { "name": "free", "value": -1, "text": "自由" },
            { "name": "obsolete", "value": 0, "text": "审批未通过" },
            { "name": "reviewed", "value": 1, "text": "审批通过" },
            { "name": "reviewing", "value": 2, "text": "审批中" },
            { "name": "commit", "value": 3, "text": "已提交" }
        ]);
        if (viewModel.getaddAction) viewModel.getaddAction().setDataSource([
            { "name": "self", "value": "blank", "text": "增加空白单据" },
			{ "name": "pull", "value": "somain", "text": "从订单生成" },
            { "name": "pull", "value": "opportunity", "text": "从销售机会生成" },
            { "name": "pull", "value": "contract", "text": "从销售合同生成" },
            { "name": "pull", "value": "quotation", "text": "从销售报价生成" },
            { "name": "pull", "value": "schedule", "text": "从销售预定生成" }
        ]);
		//var params = viewModel.getViewPartParams();
		var params = cb.route.getViewPartParams(viewModel);
        if (!params) return;
        this.symbol = viewModel.getSymbol();
        if (!this.symbol) return;
        this.mode = params.mode;
        if (!this.mode) return;

        cb.model.PropertyChange.delayPropertyChange(true);

        if (this.mode === "add") {
            if (viewModel.getsaveAction) viewModel.getsaveAction().set("Visible", true);
            if (viewModel.geteditAction) viewModel.geteditAction().set("Visible", false);
            if (viewModel.getcancelAction) viewModel.getcancelAction().set("Visible", true);
            if (viewModel.getaddLineAction) viewModel.getaddLineAction().set("Visible", true);
            viewModel.newRecord();
            if (viewModel.getbodyAction) viewModel.getbodyAction().setValue("产品(0)");
            viewModel.setReadOnly(false);

            cb.model.PropertyChange.doPropertyChange();
//获取选项参数的数据，填充页面数据
            var callback = function (success, fail) {
	            if (fail) {
	                alert("请求后台服务失败");
	                return;
	            }
	            if (success.length>0)
	            {    
	            	for(var i=0;i<success[0].children[0].length;i++)
	            	{
	            		try
	            		{
	            			eval("viewModel.get"+success[0].children[0][i].code+"().setValue('"+success[0].children[0][i].cvalue+"')")
	            			eval("viewModel.get"+success[0].children[0][i].code+"().setState('readOnly',true)");
	            		}
	            		catch(e)
	            		{
	            			//错误继续循环
	            			//alert(success[0].children[0][i].code);
	            		}
	            	}
	            }
  			 };
        }
        else if (this.mode === "view") {
            if (viewModel.getsaveAction) viewModel.getsaveAction().set("Visible", false);
            if (viewModel.geteditAction) viewModel.geteditAction().set("Visible", true);
            if (viewModel.getcancelAction) viewModel.getcancelAction().set("Visible", false);
            if (viewModel.getaddLineAction) viewModel.getaddLineAction().set("Visible", false);
            cb.data.CommonProxy(this.symbol).QueryByPK(params.id, function (success, fail) {
                if (fail) {
                    alert("读取数据失败");
                    return;
                }
                viewModel.loadData(success);
if (viewModel.getapprovestatus && viewModel.geteditAction && viewModel.getapprovestatus().getValue() !== -1)
                    viewModel.geteditAction().set("Visible", false);
                if (viewModel.getbodyAction) viewModel.getbodyAction().setValue("产品(" + viewModel.getModel3D().getTotalCount() + ")");
                viewModel.setReadOnly(true);

                cb.model.PropertyChange.doPropertyChange();
            });
        }
var appIdItems = params.appId.split(".");
        if (appIdItems.length !== 2) return;
        var data = { "moduleName": appIdItems[0], "appName": appIdItems[1], "viewModelName": viewModel.getName() };
        var config = { GetFieldPerm: { url: "classes/Login/UAP/GetFieldPerm", method: "Get"} };
        var proxy = cb.rest.DynamicProxy.create(config);
        proxy.GetFieldPerm(data, function (success, fail) {
            if (fail) {
                alert("读取字段权限数据失败");
                return;
            }
            viewModel.loadFieldPermData(success);
        });
},
    //支持数组项内的扩展
    cexch_nameChange:function(viewModel, args){
		var nameModel = viewModel.getcexch_name();
		var nameValue=nameModel.getValue();
		if(!nameValue)return;
		var self = this;
		viewModel.getProxy().QueryForeigncurrency(nameValue,function(success, fail){
			 if (fail) 
				return alert("请求后台服务失败");
			var currencyInfo = success;
			if(!currencyInfo||currencyInfo.length<=0)
				return;
			var iexchrate =viewModel.getiexchrate(); 
			var oldValue = iexchrate.getValue();
			var newValue = 1;     
			if(currencyInfo[0].parent.iotherused)
				iexchrate.setReadOnly(true);
			else{
				iexchrate.setReadOnly(false);
            	var myDate = new Date();
            	var iyear=myDate.getFullYear();    	  //获取完整的年份(4位,1970-????)
				var imonth=myDate.getMonth()+1;       //获取当前月份(0-11,0代表1月)
            	for(var i=0;i<currencyInfo[0].children[0].length;i++)
            	 	if (currencyInfo[0].children[0][i].cdate==imonth && currencyInfo[0].children[0][i].iyear==iyear)
						newValue = currencyInfo[0].children[0][i].nflat;						
			}
			iexchrate.setValue(newValue);					 //本币设置汇率为1或者非本币没有找到汇率
			self.iexchrateChange(viewModel);
		});
   },
    
    
  iexchrateChange:function(viewModel){
	/// <param name="viewModel" type="closebillViewModel">viewModel类型为closebillViewModel</param>
	
		 if (viewModel.getModel3D().getRows().length==0)
			return;
		 var data = new Array(viewModel.getModel3D().getRows().length);
		 for (var i=0;i<viewModel.getModel3D().getRows().length;i++)
			 data[i]=this.amountRowParm(viewModel, "iexchrate",i);
		 viewModel.getProxy().CheckAmountList(data,function (success, fail) {
			if (fail) return;// alert("请求后台服务失败");
			for (var i=0;i<success.length;i++)
				closebillViewModel_Extend.amountRowFill(viewModel,success[i],i);
		});	
	},    
	
	cellChange_iquantity:function(viewModel, args){
		/// <param name="viewModel" type="closebillViewModel">viewModel类型为closebillViewModel</param>
        var row=args.Row;
        var selectKey=args.CellName
	  	var data= closebillViewModel_Extend.amountRowParm(viewModel, selectKey,row);
				              
		var callback = function (success, fail) {
            if (fail) {
               // alert("请求后台服务失败");
                return;
            }
          closebillViewModel_Extend.amountRowFill(viewModel,success,row);		  
        };
		viewModel.getProxy().CheckAmount(data,callback);	
	},  
	
	
	amountRowParm:function(viewModel, selectKey,rowIndex){
		var data={};
		var row =viewModel.getpk_ap_closebill_b().getRow(rowIndex)
			
		data.ckey=selectKey;
		data.cexch_name=viewModel.getcexch_name().getValue();
		data.iexchrate=viewModel.getiexchrate().getValue();
		data.itaxrate=viewModel.getitaxrate().getValue();
	
		data.iquantity=row.iquantity;
		data.inum=row.inum;
		//data.cunitcode=row.cunitcode.Value  ;
		data.iquounitprice=row.iquounitprice ;
		data.brtax=row.brtax  ;
		data.iunitprice=row.iunitprice ;
		data.itaxunitprice=	row.itaxunitprice  ;
		data.imoney=row.imoney  ;
		data.itax=row.itax;
		data.isum=row.isum ;
		data.idiscount=row.idiscount;
		data.idiscountrate=row.idiscountrate  ;
		data.iinvexchrate=row.iinvexchrate ;
		return data;		
	},
	
	amountRowFill:function(viewModel,success, row)
	{
		   if (success!=null)
		   {
		   	var i=row;
		   	var closebillLines=viewModel.getpk_ap_closebill_b();
			closebillLines.setCellValue(i,"iquantity",success.iquantity,false)	;
			closebillLines.setCellValue(i,"inum",success.inum,false)	;
			//closebillLines.setCellValue(i,"cunitcode",success.cunitcode,false)	;
			closebillLines.setCellValue(i,"iquounitprice",success.iquounitprice,false)	;
			//closebillLines.setCellValue(i,"brtax",success.brtax,false)	;
			closebillLines.setCellValue(i,"iunitprice",success.iunitprice,false);	
			closebillLines.setCellValue(i,"itaxunitprice",success.itaxunitprice,false)	;
			closebillLines.setCellValue(i,"imoney",success.imoney,false);
			closebillLines.setCellValue(i,"itax",success.itax,false)	;
			closebillLines.setCellValue(i,"isum",success.isum,false);	
			closebillLines.setCellValue(i,"idiscountrate",success.idiscountrate,false)	;
			closebillLines.setCellValue(i,"idiscount",success.idiscount,false);
			closebillLines.setCellValue(i,"inatunitprice",success.inatunitprice,false);
			closebillLines.setCellValue(i,"inattaxunitprice",success.inattaxunitprice,false);	
			closebillLines.setCellValue(i,"inatmoney",success.inatmoney,false)	;
			closebillLines.setCellValue(i,"inattax",success.inattax,false);
			closebillLines.setCellValue(i,"inatsum",success.inatsum,false);
			closebillLines.setCellValue(i,"inatdiscount",success.inatdiscount,false);
		   }
	},
	
	afterAddNewRow:function(viewModel)
	{
		   //	添加 报价行是否含税	取表头的是否含税
           //	这里是在添加行之后做的相关操作，若没有则可以什么也不做	   
           var row= viewModel.getModel3D().getRows().length;
           if( row>=1)
           {
           	//viewModel.getpk_ap_closebill_b().setCellValue(row-1,"brtax",viewModel.getbtax().getValue(),false)	;
           	//this.changeCellValue(viewModel,row-1,"pk_group");
     		//this.changeCellValue(viewModel,row-1,"pk_org");      
           }
     
	},
    changeCellValue:function(viewModel,row,cell)
	{
		
		    //viewModel.getpk_ap_closebill_b().setCellValue(row-1,"pk_group",viewModel.getpk_group().getValue(),false)	;  
			//viewModel.getpk_ap_closebill_b().setCellValue(row-1,"pk_group_code",viewModel.getpk_group()._data.refReturnData.data.data.code,false)	; 
			viewModel.getpk_ap_closebill_b().setCellValue(row,cell,eval("viewModel.get"+cell+"().getValue()"),false)	;  
			viewModel.getpk_ap_closebill_b().setCellValue(row,cell+"_code",eval("viewModel.get"+cell+"()._data.refReturnData.data.data.code"),false)	;  
  
           
	},
	synvalueChange:function(viewModel, args,key){
		/// <param name="viewModel" type="closebillViewModel">viewModel类型为closebillViewModel</param>
        var row= viewModel.getModel3D().getRows().length;
        if( row>=1)
		{
			if(confirm("是否同步修改表体"))
			{
				for(var i=0;i<=row;i++)
				{
					this.changeCellValue(viewModel,i,key);
				}
			}
		}
	},  
	
	autoFill:function(viewModel,simpleModel){
		
	    var ref = simpleModel._data;
		var data={};
		data.refCode=ref.refId;
		var filters= new Array(); 
		var filter={};
		filter.fieldName=ref.refCode;
		filter.value=simpleModel.getValue();
		filters[0]=filter;
		var table={};
		table.filters=filters;
		data.table=table;

		 viewModel.getProxy().FillInfo(data,function (success, fail) {
			if (fail) return;// alert("请求后台服务失败");
		  
		 var refRelation = ref.refRelation;
		 var relations = refRelation.split(",");
		//当没有返回数据或者返回多条数据的时候置空当前行和相关行
		if (success.length<1)
		{
			simpleModel.setValue("",false);
			for (var i = 0; i < relations.length; i++) {
            var st = relations[i].split("=");
            if (st.length != 2) continue;
            var source = st[0];
            var target = st[1];
            var targetModel = viewModel.get(source);
            if (targetModel)
               targetModel.setValue("",false);
		 }
	     return;
		}
        var refData = success[0];
        var noExists = new Array();
        for (var i = 0; i < relations.length; i++) {
            var st = relations[i].split("=");
            if (st.length != 2) continue;
            var source = st[0];
            var target = st[1];
            var targetModel = viewModel.get(source);
            if (targetModel) {
                var fieldValue = refData[target];
                if (fieldValue) {
                    targetModel.setValue(fieldValue);
                }
                else {
                    noExists.push(target);
                }
            }
		}
		
		});	
	},
	
    customInit:function(viewModel){
		/*
		if(!this._init)
			this._init=true;
		else
			return;
			*/
    	  //******************
    	  //参照根据当前值自动填充
		viewModel.getccuscode().on("aftervaluechange", function (args) { closebillViewModel_Extend.autoFill(this.getParent(), viewModel.getccuscode()); });  
	    viewModel.getcpersoncode().on("aftervaluechange", function (args) { closebillViewModel_Extend.autoFill(this.getParent(), viewModel.getcpersoncode()); });  
	   
	    //币种选择事件
	    viewModel.getcexch_name().on("afterchange", function (args) { closebillViewModel_Extend.cexch_nameChange(this.getParent(), args); });  
	    //汇率变化事件
	    viewModel.getiexchrate().on("afterchange", function (args) { closebillViewModel_Extend.iexchrateChange(this.getParent(), args); });
	    
	    viewModel.getpk_group().on("afterchange", function (args) { closebillViewModel_Extend.synvalueChange(this.getParent(), args,"pk_group"); });  
		viewModel.getpk_org().on("afterchange", function (args) { closebillViewModel_Extend.synvalueChange(this.getParent(), args,"pk_org"); });  
	      
	    viewModel.getpk_ap_closebill_b().on("afterCellChange", 
	    			function (args) {
	    				//args : context
	    				//var context = { Row: 0, CellName: "id", Value: value, OldValue: oldValue };
						if (args.CellName === "iquantity" || args.CellName === "itaxunitprice" || args.CellName === "iquounitprice")
						//if (args.CellName === "iquantity" )
							closebillViewModel_Extend.cellChange_iquantity(this.getParent(), args);                                              
	                });
	   
	   //行增加事件，
       viewModel.getpk_ap_closebill_b().on("afterinsert",function (args) {closebillViewModel_Extend.afterAddNewRow(this.getParent()); });  

	    var proxyConfig = {
	        CheckAmount: { url: "classes/Amount/UAP/CheckAmount", method: "Post" },
	        CheckAmountList: { url: "classes/Amount/UAP/CheckAmountList", method: "Post" },
	        QueryForeigncurrency: { url: "classes/Amount/UAP/QueryForeigncurrency", method: "Post" },
	        QueryAccinformationByCsysid: { url: "classes/Accinformation/UAP/QueryAccinformationByCsysid", method: "Post" },
	   	    FillInfo: { url: "classes/FillInfo/UAP/GetFillInfo", method: "Post" },
	    };
	    viewModel.setProxy(proxyConfig);
	    //****************** 
    }
};
