
var LogManageConditionViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "LogManageConditionViewModel");
    this.init();
};
LogManageConditionViewModel.prototype = new cb.model.ContainerModel();
LogManageConditionViewModel.prototype.constructor = LogManageConditionViewModel;

LogManageConditionViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "LogManageConditionViewModel",
        ManageDate_textbox: new cb.model.SimpleModel({ value: "操作日期" }),
        ManageDate_combobox: new cb.model.SimpleModel({
            defaultValue: "equal",
            dataSource: [
                { text: "介于",value:"between" },
                { text: "等于",value:"equal" },
            ]
        }),
        ManageDate_datebox: new cb.model.SimpleModel({}),
        ManageDate_datebox1: new cb.model.SimpleModel({}),
        User_textbox: new cb.model.SimpleModel({}),
        User_combobox: new cb.model.SimpleModel({
            dataSource: [
                { text: "包含" },
                { text: "等于" },
            ]
        }),
        User_refer: new cb.model.SimpleModel({ title: "用户", refKey: "cuserid", refCode: "user_code", refName: "user_name", ctrlType: "Refer", refId: "sysloguser" }),
        ButtonName_textbox: new cb.model.SimpleModel({}),
        ButtonName_combobox: new cb.model.SimpleModel({
            dataSource: [
                { text: "包含" },
                { text: "等于" },
            ]
        }),
        ButtonName_textbox1: new cb.model.SimpleModel({}),
        cancelAction: new cb.model.SimpleModel(),
        confirmAction: new cb.model.SimpleModel(),
    };
    this.setData(fields);
    this.setDirty(false);

    //事件注册---需要整理，框架需要变动
    this.getconfirmAction().on("click", function (args) { LogManageConditionViewModel_Extend.confirmAction(this.getParent(), args); });
    this.getcancelAction().on("click", function (args) { LogManageConditionViewModel_Extend.cancelAction(this.getParent(), args); });
    this.getManageDate_combobox().on("afterchange", function (args) { LogManageConditionViewModel_Extend.ManageDate_combobox(this.getParent(), args); });

    var proxyConfig = {
        GetInformation: { url: "upservices/up.itf.uap.sysmng.service.ISystemManageService/UAP/getComuterLoginLogs", method: "Post" },
    }
    this.setProxy(proxyConfig);
    this.initData();
};

LogManageConditionViewModel.prototype.initData = function () {
    LogManageConditionViewModel_Extend.doAction("init_Extend", this);
};
