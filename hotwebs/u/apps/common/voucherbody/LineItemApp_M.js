/// <reference path="../../common/js/Cube.js" />
/// <reference path="LineItemApp_Extend.js" />
var LineItemViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "LineItemViewModel");
    this.init();
};
LineItemViewModel.prototype = new cb.model.ContainerModel();
LineItemViewModel.prototype.constructor = LineItemViewModel;

LineItemViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "LineItemViewModel",
        returnAction: new cb.model.SimpleModel({ model: "no-text" }),
        editAction: new cb.model.SimpleModel({ model: "no-text" }),
        cancelAction: new cb.model.SimpleModel(),
        saveAction: new cb.model.SimpleModel()
    };
    this.setData(fields);
    this.setDirty(false);

    //事件注册---需要整理，框架需要变动
    this.getreturnAction().on("click", function () { LineItemViewModel_Extend.returnAction(this.getParent()); });
    this.geteditAction().on("click", function () { LineItemViewModel_Extend.editAction(this.getParent()); });
    this.getcancelAction().on("click", function () { LineItemViewModel_Extend.cancelAction(this.getParent()); });
    this.getsaveAction().on("click", function () { LineItemViewModel_Extend.saveAction(this.getParent()); });

    this.initParams();
    this.initData();
};

LineItemViewModel.prototype.initParams = function () {
    var params = cb.route.getViewPartParams(this);
    var model3d = params.model3d;
    var $container = $("div[data-viewmodel='" + this.getName() + "'] .ui-form-page");
    if (!$container.length) return;
    var containerId = "lineitem_" + Math.round(1000000 * Math.random());
    $container.attr("id", containerId);
    $container.empty();
    $container.append("<div></div>");
    var columns = model3d.getColumns();
    var $div;
    for (var index in columns) {
        var column = columns[index];
        if (!column.ctrlType || column.visible === false) continue;
        $div = $("<div class='ui-field-contain' />").appendTo($container.children());
        $div.append("<label>" + column.title + "</label>");
        switch (column.ctrlType) {
            case "TextBox":
                $("<div><input type='text' data-propertyname='" + index + "' data-controltype='TextBox' /></div>").appendTo($div);
                break;
            case "NumberBox":
                $("<div><input type='number' data-propertyname='" + index + "' data-controltype='NumberBox' /></div>").appendTo($div);
                break;
            case "DateTimeBox":
                $("<div><input type='date' data-propertyname='" + index + "' data-controltype='DateTimeBox' /></div>").appendTo($div);
                break;
            case "CheckBox":
                $("<div><input type='checkbox' data-propertyname='" + index + "' data-controltype='CheckBox' /></div>").appendTo($div);
                break;
            case "ComboBox":
                $("<select data-propertyname='" + index + "' data-controltype='ComboBox'></select>").appendTo($div);
                break;
            case "Refer":
                $("<div data-propertyname='" + index + "' data-controltype='Refer'><input type='text' style='float:left;width:90%;' /><div style='width:8%;float:right;cursor:pointer;'><img src='common/images/u161.png' /></div></div>").appendTo($div);
                break;
        }
    }
    cb.viewbinding.create(containerId, model3d.getEditRowModel());
    new IScroll($container.get(0), {
        probeType: 2,
        mouseWheel: true, // 允许滑轮滚动
        preventDefault: false
    });
};

LineItemViewModel.prototype.initData = function () {
    LineItemViewModel_Extend.doAction("init_Extend", this);
};