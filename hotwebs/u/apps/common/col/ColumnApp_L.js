var ColumnViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "ColumnViewModel");
    this.init();
};
ColumnViewModel.prototype = new cb.model.ContainerModel();
ColumnViewModel.prototype.constructor = ColumnViewModel;

ColumnViewModel.prototype.init = function () {

    //对其方式
    var alginDataSource = [{ text: "左对齐", value: "0" }, { text: "居中", value: "1" }, { text: "右对齐", value: "2" }]

    //排序方式
    var orderDataSource = [{ text: "不排序", value: "0" }, { text: "升序", value: "1" }, { text: "降序", value: "2" }]
    

    var columns = {
        showflag: { title: "显示",ReadOnly: false, editable: true, ctrlType: "CheckBox", width: 82, priority: 0, align: 1 },
        fieldname: { title: "栏目默认名称", ReadOnly: true, editable: false, ctrlType: "TextBox", width: 137, priority: 0, align: 1 },
        fieldshowname: { title: "栏目显示名称", ReadOnly: false, editable: true, ctrlType: "TextBox", width: 137, priority: 0, align: 1 },
        showorder: { title: "顺序", ReadOnly: false, editable: true, ctrlType: "TextBox",  width: 82, priority: 0, align: 1 },
        editflag: { title: "可编辑", ReadOnly: false, editable: true, ctrlType: "CheckBox", width: 96, priority: 0, align: 1 },
        filtertype: { title: "排序方式", ReadOnly: false, editable: true, ctrlType: "ComboBox", width: 110, priority: 0, align: 1, dataSource: orderDataSource },
        //mustselflag: { title: "可空", ReadOnly: false, editable: true, ctrlType: "CheckBox", width: 110, priority: 0, align: 1 },
        nullflag: { title: "可空", ReadOnly: false, editable: true, ctrlType: "CheckBox", width: 110, priority: 0, align: 1 },
        fixedflag: { title: "冻结列", ReadOnly: false, editable: true, ctrlType: "CheckBox", width: 96, priority: 0, align: 1 },
        fieldalign: { title: "对齐方式", ReadOnly: false, editable: true, ctrlType: "ComboBox", width: 110, priority: 0, align: 1, dataSource: alginDataSource },
        totalflag: { title: "显示合计", ReadOnly: false, editable: true, ctrlType: "CheckBox", width: 110, priority: 0, align: 1 },
        fieldwidth: { title: "宽度", ReadOnly: false, editable: true, ctrlType: "TextBox", width: 82, priority: 0, align: 1 },
        fielddigit: { title: "精度", ReadOnly: false, editable: true, ctrlType: "TextBox",  width: 82, priority: 0, align: 1 },
        fieldtype: { title: "数据类型", ReadOnly: false, editable: true, ctrlType: "TextBox", width: 110, priority: 0, align: 1 },
        pk_entitycolumn_b: { title: "主键", ReadOnly: true, editable: false, ctrlType: "TextBox",width: 200, priority: 0, align: 1 },
    }

    
    
    // 单据列表,参照,档案显示项
    var listColumn = ["showflag", "fieldname", "fieldshowname", "showorder", "filtertype", "totalflag", "fieldalign", "fixedflag"];
    // 生单界面显示项
    var voucherColumn = ["showflag", "fieldname", "fieldshowname", "showorder", "filtertype", "fixedflag", "totalflag", "editflag", "nullflag","fieldalign"];

    this.getColumns = function (type) {

        var filterColumn = function (filter) {
            var result = {};
            for (var i = 0, len = filter.length; i < len; i++) {
                var columnName = filter[i];
                result[columnName] = columns[columnName];
            }
            return result;
        }

        if (type == "0") { //type=="0" 表示参照栏目
            return filterColumn(listColumn);
        }
        else {   //type=="1" voucherColumn
            return filterColumn(voucherColumn);
        }
    };
    var fields = {
        ViewModelName: "ColumnViewModel",
        AppId: "col.Column",
        searchAction: new cb.model.SimpleModel({ isNeedCollect: false, bindingMode: "OneTime" }),// 查找按钮
        closeAction: new cb.model.SimpleModel({ isNeedCollect: false, bindingMode: "OneTime" }), //关闭按钮
        cancelAction: new cb.model.SimpleModel({ isNeedCollect: false,bindingMode:"OneTime" }), //取消按钮
        columnname: new cb.model.SimpleModel(),//列表名称
        upAction: new cb.model.SimpleModel({ isNeedCollect: false, bindingMode: "OneTime" }),
        topAction: new cb.model.SimpleModel({ isNeedCollect: false, bindingMode: "OneTime" }),// 置顶
        bottomAction: new cb.model.SimpleModel({ isNeedCollect: false, bindingMode: "OneTime" }),// 置底
        //search: new cb.model.SimpleModel({ title: "searBox", length: 50, ctrlType: "SearchBox" }),
        Search: new cb.model.SimpleModel(),
        downAction: new cb.model.SimpleModel({ isNeedCollect: false, bindingMode: "OneTime" }),
        submitAction: new cb.model.SimpleModel({ isNeedCollect: false, bindingMode: "OneTime" }),
        restoreAction: new cb.model.SimpleModel({ isNeedCollect: false, bindingMode: "OneTime" }),
        pk_entitycolumn_b: new cb.model.Model3D({ ReadOnly: false, dsMode: "Local",editable:true,pageSize:-1,showRowNo:true}),
        columnlevel: new cb.model.SimpleModel({ dataSource: { type: "Switch1", name: "columntype", list: [{ value: 1, text: "公共" }, { value: 2, text: "个人", checked: true }] } }),
    };
    this.setData(fields);
    this.setDirty(false);

    this.getupAction().on("click", function (args) { ColumnViewModel_Extend.upAction(this.getParent()); });
    this.getdownAction().on("click", function () { ColumnViewModel_Extend.downAction(this.getParent()); });
    this.gettopAction().on("click", function (args) { ColumnViewModel_Extend.topAction(this.getParent()); });
    this.getbottomAction().on("click", function () { ColumnViewModel_Extend.bottomAction(this.getParent()); });
    this.getcloseAction().on("click", function (args) { ColumnViewModel_Extend.closeAction(this.getParent()); });
    this.getrestoreAction().on("click", function (args) { ColumnViewModel_Extend.restoreAction(this.getParent()); });
    this.getSearch().on("search", function (data) { ColumnViewModel_Extend.searchClick(this.getParent(), data) });
    this.getpk_entitycolumn_b().on("afterCellChange", function (args) { ColumnViewModel_Extend.bCellValueChange(this.getParent(), args); });
    this.getpk_entitycolumn_b().on("beforeCellChange", function (args) { ColumnViewModel_Extend.beforeCellValueChange(this.getParent(), args); });
    this.getSearch().on("beforeCellChange", function (args) { ColumnViewModel_Extend.beforeSearch(this.getParent(), args); });
    

    this.getcancelAction().on("click", function (args) { ColumnViewModel_Extend.cancelAction(this.getParent()); });

    this.getsubmitAction().on("click", function (args) { ColumnViewModel_Extend.submitAction(this.getParent()); });
    var proxyConfig = {
        getColumn: { url: "classes/General/u8column/QueryColumnByCode", method: "Get" },
        saveColumn: { url: "classes/General/u8column/ColumnSave", method: "Post" },
        restoreColumn: { url: "classes/General/u8column/QuerySysInitColByCode", method: "Get" },        
    };
    this.setProxy(proxyConfig);

    this.initData();
}

ColumnViewModel.prototype.initData = function () {
    ColumnViewModel_Extend.doAction("init_Extend", this);
};

