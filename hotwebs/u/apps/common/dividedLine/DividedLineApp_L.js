var DividedLineViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "DividedLineViewModel");
    this.init();
};
DividedLineViewModel.prototype = new cb.model.ContainerModel();
DividedLineViewModel.prototype.constructor = DividedLineViewModel;

DividedLineViewModel.prototype.init = function () {

   
    var fields = {
        ViewModelName: "DividedLineViewModel",
        AppId: "dividedLine.DivededLineAPP",
        closeAction: new cb.model.SimpleModel({ isNeedCollect: false, bindingMode: "OneTime" }), //关闭按钮
        cancelAction: new cb.model.SimpleModel({ isNeedCollect: false,bindingMode:"OneTime" }), //取消按钮
        submitAction: new cb.model.SimpleModel({ isNeedCollect: false, bindingMode: "OneTime" }),
      
        divideCol: new cb.model.SimpleModel({ title: "拆分规则", length: 50, ctrlType: "ComboBox", defaultValue: "-1"}),
        numberDivdieType: new cb.model.SimpleModel({ dataSource: { type: "divideType1", name: "numberDivdieType", list: [{ value: 1, text: "", checked: false }] } }),
        lineDivdieType: new cb.model.SimpleModel({ dataSource: { type: "divideType2", name: "lineDivdieType", list: [{ value: 0, text: "", checked: false }] } }),
        lineDivide: new cb.model.SimpleModel({ title: "行数拆分",readOnly : true, length: 50, ctrlType: "TextBox" }),
        numberDivide: new cb.model.SimpleModel({ title: "数值拆分",readOnly:true, length: 50, ctrlType: "TextBox"})

    };
    this.setData(fields);
    this.setDirty(false);

    this.getcloseAction().on("click", function (args) { DividedLineViewModel_Extend.closeAction(this.getParent()); });
    this.getcancelAction().on("click", function (args) { DividedLineViewModel_Extend.cancelAction(this.getParent()); });
    this.getsubmitAction().on("click", function (args) { DividedLineViewModel_Extend.submitAction(this.getParent()); });
    this.getnumberDivdieType().on("click", function (args) { DividedLineViewModel_Extend.numberDivdieType(this.getParent(), args); })
    this.getlineDivdieType().on("click", function (args) { DividedLineViewModel_Extend.lineDivdieType(this.getParent(),args); })
    var proxyConfig = {
              
    };
    this.setProxy(proxyConfig);

    this.initData();
}

DividedLineViewModel.prototype.initData = function () {
    DividedLineViewModel_Extend.doAction("init_Extend", this);
};

