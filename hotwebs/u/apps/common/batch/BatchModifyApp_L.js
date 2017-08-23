var BatchModifyViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "BatchModifyViewModel");
    this.init();
};
BatchModifyViewModel.prototype = new cb.model.ContainerModel();
BatchModifyViewModel.prototype.constructor = BatchModifyViewModel;

BatchModifyViewModel.prototype.init = function () {


    var fields = {
        ViewModelName: "BatchModifyViewModel",
        AppId: "batch.BatchModifyApp",
        isCondition:new cb.model.SimpleModel(),
        closeAction: new cb.model.SimpleModel({ isNeedCollect: false, bindingMode: "OneTime" }), //关闭按钮
        cancelAction: new cb.model.SimpleModel({ isNeedCollect: false, bindingMode: "OneTime" }), //取消按钮
        submitAction: new cb.model.SimpleModel({ isNeedCollect: false, bindingMode: "OneTime" }),
    };
    this.setData(fields);
    this.setDirty(false);

    this.getcloseAction().on("click", function (args) { BatchModifyViewModel_Extend.closeAction(this.getParent()); });
    this.getcancelAction().on("click", function (args) { BatchModifyViewModel_Extend.cancelAction(this.getParent()); });
    this.getsubmitAction().on("click", function (args) { BatchModifyViewModel_Extend.submitAction(this.getParent()); });
    var proxyConfig = {

    };
    this.setProxy(proxyConfig);
    this.initParams();
    this.initData();
}
BatchModifyViewModel.prototype.initParams = function () {
    var reqData = cb.route.getViewPartParams(this);
    var modifyCols = reqData.data.modifyColumns;
    var fields = this.generateFields(modifyCols);//返回一个field对象
    this.clear();
    this.add(fields);
    var viewId = 'BatchModifyViewModel';
    var updateViewID = "BatchUpdateView";
    this.generateHtml(modifyCols, updateViewID);//返回一个jquery对象
    cb.viewbinding.update('BatchModifyViewModel');
}
BatchModifyViewModel.prototype.generateFields = function (modifyCols) {
    debugger;
    var fields = new Object();
    for (var i = 0, j = modifyCols.length; i < j; i++) {
        //对参照类型需特殊处理，添加参照承载参照携带过来的数据
        var fieldName = modifyCols[i].fieldName;
        //var ctrlType = modifyCols[i].ctrlType;
        //if (ctrlType && "Refer" == ctrlType)
        //{
        //    this.generateReferField(fields,modifyCols[i]);
        //}
        fields[fieldName] = new cb.model.SimpleModel(modifyCols[i]);
    }
    return fields;
};
BatchModifyViewModel.prototype.generateReferField = function (fields, field) {
    debugger;
    var refCode = field.refCode;
    var refName = field.refName;
    var refRelation = field.refRelation;
    var fieldName = field.fieldName;
    fields[fieldName + "_" + refCode] = new cb.model.SimpleModel();
    fields[fieldName + "_" + refName] = new cb.model.SimpleModel();
    if(refRelation && refRelation != "")    //生成参照携带字段
    {
        var key_val_arr = refRelation.split(',');
        for (var i = 0, j = key_val_arr.length; i < j; i++)
        {
            var key_val = key_val_arr[i].split('=');
            fields[key_val[0]] = new cb.model.SimpleModel(key_val[1]);
        }
    }
};
BatchModifyViewModel.prototype.generateHtml = function (modifyCols, updateViewID) {
    var $updateView = $('#' + updateViewID);
    $updateView.empty();
    for (var i = 0, j = modifyCols.length; i < j; i++)
    {
        var $rowDiv = $("<div class='row'></div>");
        var $label = $("<label class='col-lg-4'  title=" + modifyCols[i].title + ">" + modifyCols[i].title + "</label>");
        var $ctlDiv = $("<div class='col-lg-6 p-0' ></div>");
        switch(modifyCols[i].ctrlType){
            case "TextBox" :
                $("<input type='text'  data-propertyname=" + modifyCols[i].fieldName + " data-controltype='TextBox' />").appendTo($ctlDiv);
                break;
            case "ComboBox":
                var $div = $("<div data-propertyname=" + modifyCols[i].fieldName + " data-controltype='ComboBox'></div>").appendTo($ctlDiv);
                $("<input type='text' />").appendTo($div);
                break;
            case "Slider":
                var $div = $("<div data-propertyname=" + modifyCols[i].fieldName + " data-controltype='Slider' class='CheckBox onoff'></div>").appendTo($ctlDiv);
                $("<input type='checkbox' />").appendTo($div);
                $("<span class='icon'></span>").appendTo($div);
                $("<span>是</span>").appendTo($div);
                break;
            case "CheckBox":
                $ctlDiv.attr("data-propertyname", modifyCols[i].fieldName);
                $ctlDiv.attr("data-controltype", "CheckBox");
                $("<input type='checkbox'/>").appendTo($ctlDiv);
                break;
            case "NumberBox":
                $("<input data-propertyname=" + modifyCols[i].fieldName + " data-controltype='NumberBox' style='width:100%' />").appendTo($ctlDiv);
                break;
            case "Refer":
                $ctlDiv.attr("data-propertyname",modifyCols[i].fieldName);
                $ctlDiv.attr("data-controltype", "Refer");
                $("<input type='text' />").appendTo($ctlDiv);
                $("<div><img src='pc/images/Ref-close.png'/><img src='pc/images/Ref.png'/></div>").appendTo($ctlDiv);
                break;
            case "DateTimeBox":
                $("<input data-propertyname=" + modifyCols[i].fieldName + " data-controltype='DateTimeBox' style='width:100%' />").appendTo($ctlDiv);
                break;
        }//end switch
        $rowDiv.append($label);
        $rowDiv.append($ctlDiv);
        $updateView.append($rowDiv);
    }//end for
};

BatchModifyViewModel.prototype.initData = function () {
    BatchModifyViewModel_Extend.doAction("init_Extend", this);
};

