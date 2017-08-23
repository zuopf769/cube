var BusiConditionViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "BusiConditionViewModel");
    this.init();
};
BusiConditionViewModel.prototype = new cb.model.ContainerModel();
BusiConditionViewModel.prototype.constructor = BusiConditionViewModel;

BusiConditionViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "BusiConditionViewModel",
        BusiObjType_textbox: new cb.model.SimpleModel({ value: "业务对象类型", readOnly: true }),
        BusiObjType_combobox: new cb.model.SimpleModel({
            defaultValue: "equal",
            dataSource: [
                { text: "等于",value:"equal" }
            ]
        }),
		BusiObjType_refer: new cb.model.SimpleModel({ title: "元数据实体", refKey: "", refCode: "", refName: "", ctrlType: "Refer", refId: "" }),
		
        OperaDate_textbox: new cb.model.SimpleModel({ value: "操作日期", readOnly: true }),
		OperaDate_combobox: new cb.model.SimpleModel({
            defaultValue: "between",
            dataSource: [
				{ text: "介于", value: "between" },
                { text: "等于",value:"equal" }
            ]
        }),
        OperaDate_datebox1: new cb.model.SimpleModel({}),
		OperaDate_datebox: new cb.model.SimpleModel({}),
		
        BusiObjCode_textbox: new cb.model.SimpleModel({ value: "业务对象编码", readOnly: true }),
        BusiObjCode_combobox: new cb.model.SimpleModel({
            defaultValue: "equal",
            dataSource: [
                { text: "包含", value: "between" },
                { text: "等于", value: "equal" },
				{ text: "左包含", value: "left" },
				{ text: "右包含", value: "right" }
            ]
        }),
		BusiObjCode_textbox1: new cb.model.SimpleModel({}),
		
        ClientIP_textbox: new cb.model.SimpleModel({ value: "客户端IP", readOnly: true }),
		ClientIP_combobox: new cb.model.SimpleModel({
            defaultValue: "equal",
            dataSource: [
				{ text: "包含", value: "between" },
                { text: "等于",value:"equal" }
            ]
        }),
		ClientIP_textbox1: new cb.model.SimpleModel({}),
		
        BusiOrg_textbox: new cb.model.SimpleModel({ value: "业务对象组织", readOnly: true }),
		BusiOrg_combobox: new cb.model.SimpleModel({
            defaultValue: "equal",
            dataSource: [
                { text: "等于",value:"equal" }
            ]
        }),
		BusiOrg_refer: new cb.model.SimpleModel({ title: "业务单元", refKey: "", refCode: "", refName: "", ctrlType: "Refer", refId: "" }),
		
        OperaName_textbox: new cb.model.SimpleModel({ value: "操作名称", readOnly: true }),
		OperaName_combobox: new cb.model.SimpleModel({
            defaultValue: "between",
            dataSource: [
				{ text: "包含", value: "between" },
                { text: "等于",value:"equal" }
            ]
        }),
		OperaName_refer: new cb.model.SimpleModel({ title: "业务操作", refKey: "pk_operation", refCode: "code", refName: "operationname", ctrlType: "Refer", refId: "syslogoperate" }),
		
        cancelAction: new cb.model.SimpleModel(),
        confirmAction: new cb.model.SimpleModel(),
    };
    this.setData(fields);
    this.setDirty(false);

    //事件注册---需要整理，框架需要变动
    this.getconfirmAction().on("click", function (args) { BusiConditionViewModel_Extend.confirmAction(this.getParent(), args); });
    this.getcancelAction().on("click", function (args) { BusiConditionViewModel_Extend.cancelAction(this.getParent(), args); });
    this.getOperaDate_combobox().on("afterchange", function (args) { BusiConditionViewModel_Extend.OperaDate_combobox(this.getParent(), args); });

    var proxyConfig = {
        GetInformation: { url: "upservices/up.itf.uap.sysmng.service.ISystemManageService/UAP/getComuterLoginLogs", method: "Post" , mask:true },
    }
    this.setProxy(proxyConfig);
    this.initData();
};

BusiConditionViewModel.prototype.initData = function () {
    BusiConditionViewModel_Extend.doAction("init_Extend", this);
};
