var LoginConditionViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "LoginConditionViewModel");
    this.init();
};
LoginConditionViewModel.prototype = new cb.model.ContainerModel();
LoginConditionViewModel.prototype.constructor = LoginConditionViewModel;

LoginConditionViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "LoginConditionViewModel",
        LoginDate_textbox: new cb.model.SimpleModel({ value: "登录日期", readOnly: true }),
        LoginDate_combobox: new cb.model.SimpleModel({
            defaultValue: "equal",
            dataSource: [
                { text: "介于",value:"between" },
                { text: "等于",value:"equal" },
            ]
        }),
        LoginDate_datebox: new cb.model.SimpleModel({}),
        LoginDate_datebox1: new cb.model.SimpleModel({}),
        LogoutDate_textbox: new cb.model.SimpleModel({ value: "注销日期", readOnly: true }),
        LogoutDate_combobox: new cb.model.SimpleModel({
            defaultValue: "equal",
            dataSource: [
                { text: "介于", value: "between" },
                { text: "等于", value: "equal" },
            ]
        }),
        LogoutDate_datebox: new cb.model.SimpleModel({}),
        LogoutDate_datebox1: new cb.model.SimpleModel({}),
        User_textbox: new cb.model.SimpleModel({ value: "用户", readOnly: true }),
        User_combobox: new cb.model.SimpleModel({
            dataSource: [
                { text: "包含",value:"contain" },
                { text: "等于" ,value:"equal"},
            ]
        }),
        User_refer: new cb.model.SimpleModel({ title: "用户", refKey: "cuserid", refCode: "user_code", refName: "user_name", ctrlType: "Refer", refId: "sysloguser" }),
        ButtonName_textbox: new cb.model.SimpleModel({ value: "客户端IP", readOnly: true }),
        ButtonName_combobox: new cb.model.SimpleModel({
            dataSource: [
                { text: "包含", value: "contain" },
                { text: "等于", value: "equal" },
            ]
        }),
        ButtonName_textbox1: new cb.model.SimpleModel({}),
        RealName_textbox:new cb.model.SimpleModel({title:"真实姓名",value:"真实姓名",readOnly:true}),
        RealName_combobox: new cb.model.SimpleModel({
            dataSource: [
                { text: "包含", value: "contain" },
                { text: "等于", value: "equal" },
            ]
        }),
        RealName_refer: new cb.model.SimpleModel({ title: "人员", refKey: "pk_psndoc", refCode: "code", refName: "name", ctrlType: "Refer", refId: "syslogperson" }),
        cancelAction: new cb.model.SimpleModel(),
        confirmAction: new cb.model.SimpleModel(),
    };
    this.setData(fields);
    this.setDirty(false);

    //事件注册---需要整理，框架需要变动
    this.getconfirmAction().on("click", function (args) { LoginConditionViewModel_Extend.confirmAction(this.getParent(), args); });
    this.getcancelAction().on("click", function (args) { LoginConditionViewModel_Extend.cancelAction(this.getParent(), args); });
    this.getLoginDate_combobox().on("afterchange", function (args) { LoginConditionViewModel_Extend.LoginDate_combobox(this.getParent(), args); });
    this.getLogoutDate_combobox().on("afterchange", function (args) { LoginConditionViewModel_Extend.LogoutDate_combobox(this.getParent(), args); });

    var proxyConfig = {
        GetInformation: { url: "upservices/up.itf.uap.sysmng.service.ISystemManageService/UAP/getComuterLoginLogs", method: "Post" , mask:true },
    }
    this.setProxy(proxyConfig);
    this.initData();
};

LoginConditionViewModel.prototype.initData = function () {
    LoginConditionViewModel_Extend.doAction("init_Extend", this);
};
