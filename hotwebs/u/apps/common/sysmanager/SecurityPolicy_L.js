
var SecurityPolicyViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "SecurityPolicyViewModel");
    this.init();
};
SecurityPolicyViewModel.prototype = new cb.model.ContainerModel();
SecurityPolicyViewModel.prototype.constructor = SecurityPolicyViewModel;

SecurityPolicyViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "SecurityPolicyViewModel",
		Symbol: "sysmanager.SecurityPolicy",
		SecurityPolicy: new cb.model.Model3D({
		    height: 500,
		    readOnly:false,
		    title: "安全策略", ctrlType: "KendoGrid", Columns: {
			code:{title:"编码",ctrlType:"TextBox",owner:"SecurityPolicyDetail 安全策略",isNullable:false, refShowMode: "LetterDigit", iLength: 20 },
			name:{title:"名称",ctrlType:"TextBox",owner:"SecurityPolicyDetail 安全策略",isNullable:false},
			complexity: {
                title: "密码强度", ctrlType: "ComboBox", owner: "SecurityPolicyDetail 安全策略",width:"200px",
                dataSource: [
                        { text: "数字和字母混合", value: "nc.vo.uap.rbac.userpassword.CharDigitPassVerifier" },
                        { text: "数字、字母和!@#$%^&*?混合", value: "nc.vo.uap.rbac.userpassword.CharDigitSignPassVerifier" }
                ], isNullable: false, defaultValue: "nc.vo.uap.rbac.userpassword.CharDigitPassVerifier"
                },
			minimumLength: { title: "最小长度", ctrlType: "NumberBox", dataType: "number", defaultValue: 6, min: 0, max: 100, decimals:0, iScale:0  },
			errorloginThreshold: { title: "错误允许次数", ctrlType: "NumberBox", dataType: "number", width: 140, min: 0, max: 100, decimals:0, iScale:0 },
			starttime: { title: "初始密码生效日期", ctrlType: "DateBox",dataType:"date",width:160 },
			validateDays: { title: "密码有效天数", ctrlType: "NumberBox", owner: "SecurityPolicyDetail 安全策略", dataType: "number", width: 140, min: 0, max: 10000 },
			alertDays: { title: "密码有效期提示天数", ctrlType: "NumberBox", owner: "SecurityPolicyDetail 安全策略", dataType: "number", width: 170, min: 0, max: 100 },
			rememberCount: { title: "旧密码记忆数", ctrlType: "NumberBox", owner: "SecurityPolicyDetail 安全策略", dataType: "number", width: 140, min: 0, max: 100 },
			similarityDegree: { title: "相似度(%)", ctrlType: "NumberBox", dataType: "number", min: 0, max: 100 },
			isautolock:{
			    title:"是否自动解锁",ctrlType:"ComboBox",owner:"SecurityPolicyDetail 安全策略",
			    dataSource: [
                        { text: "是", value: "true" },
                        { text: "否", value: "false"}
			    ], isNullable: false, width: 140, dataType: "string", defaultValue:"false"
			},
			unlocktime: { title: "自动解锁间隔/小时", ctrlType: "NumberBox", owner: "SecurityPolicyDetail 安全策略", dataType: "number", width: 165, defaultValue: 1, min: 1, max: 10000 }
		    },
		    commands: {
		        isVisible: false,
		        width: 60,
		        pos:-1,
		        cmds: [{ name: 'add', text: "<img src='apps/common/sysmanager/image/add.png'/>" }, { name: "delete", text: "<img src='apps/common/sysmanager/image/delete.png'/>" }],
		    }
		}),
		editAction:new cb.model.SimpleModel({title:"编辑",ctrlType:"Button",owner:"Toolbar 功能"}),
		saveAction:new cb.model.SimpleModel({title:"保存",ctrlType:"Button",owner:"Toolbar 功能"}),
		deleteAction: new cb.model.SimpleModel({ title: "删除", ctrlType: "Button", owner: "Toolbar 功能" }),
		cancleAction: new cb.model.SimpleModel({ title: "取消", ctrlType: "Button", owner: "Toolbar 功能" }),
    };
    this.setData(fields);
    this.setDirty(false);

    //事件注册---需要整理，框架需要变动
	this.geteditAction().on("click", function (args) { SecurityPolicyViewModel_Extend.editAction(this.getParent(), args); });
	this.getsaveAction().on("click", function (args) { SecurityPolicyViewModel_Extend.saveAction(this.getParent(), args); });
	this.getdeleteAction().on("click", function (args) { SecurityPolicyViewModel_Extend.deleteAction(this.getParent(), args); });
	this.getcancleAction().on("click", function (args) { SecurityPolicyViewModel_Extend.cancleAction(this.getParent(), args); });

	var proxyConfig = {
		GetMenu: { url: "upservices/up.itf.uap.sysmng.service.ISystemManageService/UAP/getPasswordSecurityConfigs", method: "Post", mask:true },
		BatchOperate: { url: "upservices/up.itf.uap.sysmng.service.ISystemManageService/UAP/batchOperatePasswordSecurityConfigsNew", method: "Post", mask:true }
	};
	this.setProxy(proxyConfig);

	this.initData();
};

SecurityPolicyViewModel.prototype.initData = function () {
	SecurityPolicyViewModel_Extend.doAction("init_Extend", this);
};
