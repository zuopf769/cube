/// <reference path="../../../common/js/Cube.js" />
var CodeLevelViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "CodeLevelViewModel");
    this.init();
};
CodeLevelViewModel.prototype = new cb.model.ContainerModel();
CodeLevelViewModel.prototype.constructor = CodeLevelViewModel;

CodeLevelViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "CodeLevelViewModel",
        Symbol: "codelevel.CodeLevel",
        toolbar: new cb.model.SimpleModel({ title: "修改" }),
        editAction: new cb.model.SimpleModel({ title: "修改" }),
        saveAction: new cb.model.SimpleModel({ title: "保存" }),
        cancelAction: new cb.model.SimpleModel({ title: "取消" }),
        codeGrid: new cb.model.Model3D({
            readOnly: true,
            height: "500px", 
            filterable:false,
            dsMode: 'local', showCheckBox: false,
            title: "", ctrlType: "DataGrid", Columns: {
                displayname: { title: "档案项目", ctrlType: "", owner: "", width: "7%", editable: false },
                maxlevel: { title: "总级别数", ctrlType: "TextBox", owner: "", width: "5%", editable: false },
                maxlength: { title: "级别总长度", ctrlType: "TextBox", owner: "", width: "5%", editable: false },
                coderule: { title: "级别长度", ctrlType: "TextBox", owner: "", width: "20%" },
                isenabled: {
                    title: "启用", ctrlType: "ComboBox", owner: "", width: "3%", dataType: "string", dataSource: [
                        { text: "是", value: "true" },
                        { text: "否", value: "false" }
                    ]
                },
                //States: [
                //    {
                //        "state": "edit", "actions": [
                //            { "fields": "editAction", "disabled": "1" },
                //            { "fields": "saveAction", "disabled": "0" },
                //        ]
                //    },
                //    {
                //        "state": "save", "actions": [
                //            { "fields": "editAction", "disabled": "0" },
                //            { "fields": "saveAction", "disabled": "1" },
                //        ]
                //    }
                //]
            }
        })
    };
    this.setData(fields);
    this.setDirty(false);

    //事件注册---需要整理，框架需要变动
    this.geteditAction().on("click", function (args) { CodeLevelViewModel_Extend.editAction(this.getParent(), args); });
    this.getsaveAction().on("click", function (args) { CodeLevelViewModel_Extend.saveAction(this.getParent(), args); });
    this.getcodeGrid().on("afterCellChange", function (args) { CodeLevelViewModel_Extend.codeGridAction(this.getParent(), args); })
    this.getcancelAction().on("click", function (args) { CodeLevelViewModel_Extend.cancelAction(this.getParent(), args); });
    //服务代理
    var proxyConfig = {
       
        QueryAllCodeLevel: { url: "classes/General/UAP/QueryAllCodeLevel", method: "Post" },
        UpdateCodeLevel: { url: "classes/General/UAP/UpdateCodeLevel", method: "Post" },
      
	};
	this.setProxy(proxyConfig);
	this.initData();
};

CodeLevelViewModel.prototype.initData = function () {
    CodeLevelViewModel_Extend.doAction("init_Extend", this);
};
