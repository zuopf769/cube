/// <reference path="../../../common/js/Cube.js" />
var CustomerDetailViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "CustomerDetailViewModel");
    this.init();
};
CustomerDetailViewModel.prototype = new cb.model.ContainerModel();
CustomerDetailViewModel.prototype.constructor = CustomerDetailViewModel;

CustomerDetailViewModel.prototype.init = function () {

    var columns = {
       
        fieldname: { title: "机会名称", ReadOnly: false, editable: true, ctrlType: "TextBox", visible: true, width: 138, priority: 0, align: 1 },
        fieldshowname: { title: "机会负责人", ReadOnly: false, editable: true, ctrlType: "TextBox", visible: true, width: 138, priority: 0, align: 1 },
        showorder: { title: "机会类型", ReadOnly: false, editable: true, ctrlType: "TextBox", visible: true, width: 110, priority: 100, align: 1 },
        pk_entitycolumn_b: { title: "销售金额", ReadOnly: false, editable: true, ctrlType: "TextBox", visible: true, width: 138, priority: 0, align: 1 },
        fieldtype: { title: "结单日期", ReadOnly: false, editable: true, ctrlType: "TextBox", visible: true, width: 138, priority: 0, align: 1 },
        fielddigit: { title: "销售阶段", ReadOnly: false, editable: true, ctrlType: "TextBox", visible: true, width: 110, priority: 100, align: 1 },
        totalflag: { title: "创建日期", ReadOnly: false, editable: true, ctrlType: "TextBox", visible: true, width: 138, priority: 0, align: 1 },
        
    };

    var voucherColumn = ["fieldname", "fieldshowname", "showorder", "pk_entitycolumn_b", "fieldtype", "fielddigit", "totalflag"];

    this.getColumns = function () {
        var filterColumn = function (filter) {
            var result = {};
            for (var i = 0, len = filter.length; i < len; i++) {
                var columnName = filter[i];
                result[columnName] = columns[columnName];
            }
            return result;
        }
        return filterColumn(voucherColumn);
       
    };
    var fields = {
        ViewModelName: "CustomerDetailViewModel",
        Symbol: "u8.customer",
        closeAction: new cb.model.SimpleModel({ isNeedCollect: false, bindingMode: "OneTime" }), // 关闭按钮
        customerName: new cb.model.SimpleModel(),
        customerCode: new cb.model.SimpleModel(),
        customerAddress: new cb.model.SimpleModel(),                                             // 客户地址
        contact: new cb.model.SimpleModel(),                                                     // 客户联系人
        salesman: new cb.model.SimpleModel(),                                                    // 主管业务员
        customerLevel: new cb.model.SimpleModel(),                                               // 客户级别
        industry: new cb.model.SimpleModel(),                                                    // 所属行业
        totalSales: new cb.model.SimpleModel(),                                                  // 累计销售额
        receivableSales: new cb.model.SimpleModel(),                                             // 应收销售额
        creditSales: new cb.model.SimpleModel(),                                                 // 信用销售额
        customerSwitch: new cb.model.SimpleModel({                                               // 导航选项卡
            isNeedCollect: false, dataSource: [
						{ content: "basicInformation", isSelected: true },
						{ content: "dynamic" },
                        { content: "saleOpp" },
                        { content: "order" },
                        { content: "sendOrder" },
            ]
        }),

        saleOppDataGrid: new cb.model.Model3D({ ReadOnly: false, dsMode: "Local", editable: true }),

    };
    debugger;
    this.setData(fields);
    this.setDirty(false);
    //事件注册---需要整理，框架需要变动
    this.getcloseAction().on("click", function (args) { CustomerDetailViewModel_Extend.closeAction(this.getParent()); });
    this.getcustomerSwitch().on("click", function (args) { CustomerDetailViewModel_Extend.customerSwitch(this.getParent(), args); });
    var proxyConfig = {
    
    };
    this.setProxy(proxyConfig);
    this.initData();
}

CustomerDetailViewModel.prototype.initData = function () {
    CustomerDetailViewModel_Extend.doAction("init_Extend", this);
};

