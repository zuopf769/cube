/// <reference path="Cube.js" />

cb.binding.CheckBoxBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);

    this._onclick = function (val) {
        var model = this.getModel();
        if (!model) return;
        model.setValue(val);
        model.fireEvent("click", model);
    };
};
cb.binding.CheckBoxBinding.prototype = new cb.binding.BaseBinding();
cb.binding.CheckBoxBinding.prototype._set_value = function (control, value) {
    if (value === control.getValue()) return;
    if (value == null) {
        value = null;
        this.getModel()._data.value = null;
    }
    control.setValue(value);
};

cb.binding.SliderBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);

    this._onclick = function (val) {
        var model = this.getModel();
        if (!model) return;
        model.setValue(val);
        model.fireEvent("click", model);
    };
};
cb.binding.SliderBinding.prototype = new cb.binding.BaseBinding();


cb.binding.ButtonBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);
};
cb.binding.ButtonBinding.prototype = new cb.binding.BaseBinding();

cb.binding.KendoButtonBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);
}
cb.binding.KendoButtonBinding.prototype = new cb.binding.BaseBinding();

cb.binding.ImageButtonBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);
};
cb.binding.ImageButtonBinding.prototype = new cb.binding.BaseBinding();

cb.binding.TitleBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);
};
cb.binding.TitleBinding.prototype = new cb.binding.BaseBinding();


cb.binding.RadioBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);
    this._onclick = function (val) {
        var model = this.getModel();
        if (!model) return;
        model.setValue(val);
        model.fireEvent("click", model);
    };

    this.applyBindings = function () {
        var model = this.getModel();
        var control = this.getControl();
        if (!model || !control) return;
        if (this._mapping.bindingMode == cb.binding.BindingMode.TwoWay) {
            control.un("click", this._onclick);
            control.on("click", this._onclick, this);
        }
        model.addListener(this);
    };
};
cb.binding.RadioBinding.prototype = new cb.binding.BaseBinding();

cb.binding.ImageBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);
};
cb.binding.ImageBinding.prototype = new cb.binding.BaseBinding();


cb.binding.ImageListBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);
};
cb.binding.ImageListBinding.prototype = new cb.binding.BaseBinding();


cb.binding.ScheduleBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);
    this._onclick = function (val) {
        var model = this.getModel();
        if (!model) return;
        model.setValue(val);
        model.fireEvent("click", model);
    };
    this._onpraise = function (val) {
        var model = this.getModel();
        if (!model) return;
        model.setValue(val);
        model.fireEvent("praise", model);
    };//deleteSchedule
	this._ondeleteSchedule = function (val) {
        var model = this.getModel();
        if (!model) return;
        model.setValue(val);
        model.fireEvent("deleteschedule", model);
    };
    this.applyBindings = function () {
        var model = this.getModel();
        var control = this.getControl();
        if (!model || !control) return;
        if (this._mapping.bindingMode == cb.binding.BindingMode.TwoWay) {
            control.un("click", this._onclick);
            control.on("click", this._onclick, this);
            control.un("praise", this._onpraise);
            control.on("praise", this._onpraise, this);
            control.un("deleteschedule", this._ondeleteSchedule);
            control.on("deleteschedule", this._ondeleteSchedule, this);
        }
        model.addListener(this);
    };
};
cb.binding.ScheduleBinding.prototype = new cb.binding.BaseBinding();


cb.binding.IndividualCenterBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);
    this._onexitAction = function (args) {
        var model = this.getModel();
        if (!model) return;
        model.fireEvent("exitAction", args);
    };
    this.applyBindings = function () {
        var model = this.getModel();
        var control = this.getControl();
        if (!model || !control) return;
        if (this._mapping.bindingMode == cb.binding.BindingMode.TwoWay) {
            control.un("exitaction", this._onexitAction);
            control.on("exitaction", this._onexitAction, this);
        }
        model.addListener(this);
    };
};
cb.binding.IndividualCenterBinding.prototype = new cb.binding.BaseBinding();


cb.binding.CenterInformationBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);
};
cb.binding.CenterInformationBinding.prototype = new cb.binding.BaseBinding();

cb.binding.AttachmentListBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);

    this._collectData = function (dataSource) {
        var model = this.getModel();
        if (!model) return;
        model.set("source", dataSource);
    };
    this._onclick = function (val) {
        var model = this.getModel();
        if (!model) return;
        model.fireEvent("click", val);
    };
    this.applyBindings = function () {
        var model = this.getModel();
        var control = this.getControl();
        if (!model || !control) return;
        if (this._mapping.bindingMode == cb.binding.BindingMode.TwoWay) {
            control.un("collect", this._collectData);
            control.on("collect", this._collectData, this);
            control.un("click", this._onclick);
            control.on("click", this._onclick, this);
        }
        model.addListener(this);
    };
};
cb.binding.AttachmentListBinding.prototype = new cb.binding.BaseBinding();

cb.binding.ImageSlideBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);
};
cb.binding.ImageSlideBinding.prototype = new cb.binding.BaseBinding();

cb.binding.LoadPageBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);
    this._onclick = function (val) {
        var model = this.getModel();
        if (!model) return;
        model.setValue(val);
        model.fireEvent("click", model);
    };

    this.applyBindings = function () {
        var model = this.getModel();
        var control = this.getControl();
        if (!model || !control) return;
        if (this._mapping.bindingMode == cb.binding.BindingMode.TwoWay) {
            control.un("click", this._onclick);
            control.on("click", this._onclick, this);
        }
        model.addListener(this);
    };
};
cb.binding.LoadPageBinding.prototype = new cb.binding.BaseBinding();


cb.binding.NumberBoxBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);
};
cb.binding.NumberBoxBinding.prototype = new cb.binding.BaseBinding();

cb.binding.NumberBoxBinding.prototype._set_value = function (control, value) {
    if (value === control.getValue()) return;
    if (value == null) {
        value = null;
        this.getModel()._data.value = null;
    }
    control.setValue(value);
};

cb.binding.NumberBoxBinding.prototype._set_iScale = function (control, value) {
    if (value === control.getDecimals()) return;
    control.setDecimals(value);
}

cb.binding.NumberBoxBinding.prototype._set_minValue = function (control, value) {
    if (value === control.getMinValue()) return;
    control.setMinValue(value);
}

cb.binding.NumberBoxBinding.prototype._set_maxValue = function (control, value) {
    if (value === control.getMaxValue()) return;
    control.setMaxValue(value);
}

cb.binding.CheckTextBoxBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);

    this._onchange = function (val) {
        var model = this.getModel();
        if (!model) return;
        model.setValue(val);
        model.fireEvent("change", val);
    };
    
    this._validate = function (isValid) {
        var model = this.getModel();
        if (!model) return;
        model._data.isValid = isValid;
    };

    this.applyBindings = function () {
        var model = this.getModel();
        var control = this.getControl();
        if (!model || !control) return;
        if (this._mapping.bindingMode == cb.binding.BindingMode.TwoWay) {
            control.un("change", this._onchange);
            control.on("change", this._onchange, this);
            control.un("validate", this._validate);
            control.on("validate", this._validate, this);
        }
        model.addListener(this);
    };
};
cb.binding.CheckTextBoxBinding.prototype = new cb.binding.BaseBinding();

cb.binding.TextBoxBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);
};
cb.binding.TextBoxBinding.prototype = new cb.binding.BaseBinding();
cb.binding.ReferBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);

    this.applyBindings = function () {
        var model = this.getModel();
        var control = this.getControl();
        if (!model || !control) return;

        var that = this;

        this._onchange = function (datas) {//data为空或为非空数组
            cb.console.log("_onchange", this);
            var model = this.getModel();
            if (!model) return;
            if (model.getReadOnly() || model.getDisabled()) return;

            model.execute('afterRefer',datas);
            var refKey = model.get('refKey'),
                refCode = model.get('refCode'),
                refName = model.get('refName'),
                refRelation = model.get('refRelation');
            //目前表单中的参照只支持单选，后续需支持多选
            var data;
            if (datas) data = datas[0];
            //model.set('refKeyValue', data[refKey]);
            //model.set('refCodeValue', data[refCode]);
            //model.setData('refData', cb.clone(data));
            model.setValue(data && data['key'], null, null, data, true);
            //this._set_value(control,data[refKey]);

        };

        this._onclicklink = function (data) {
            var model=this.getModel();
            data.field = model.getModelName();
            model.execute('clicklink',data);
        };
        this._onBeforeRefer = function () {
            var model = this.getModel();
            model.execute('beforeRefer');
        };

        if (this._mapping.bindingMode == cb.binding.BindingMode.TwoWay) {
            if (this._onchange && (model.change || model.hasEvent("beforechange") || model.hasEvent("afterchange"))) {
                if (control.un) control.un("change", this._onchange);
                if (control.on) control.on("change", this._onchange, this);
            }
            control.un("clicklink", this._onclicklink);
            control.on("clicklink", this._onclicklink, this);

            control.un("beforeRefer", this._onBeforeRefer);
            control.on("beforeRefer", this._onBeforeRefer, this);
        }

        model.addListener(this);
    };
};
cb.binding.ReferBinding.prototype = new cb.binding.BaseBinding();

cb.binding.ReferBinding.prototype._set_data = function (data) {
    var control = this.getControl();
    var value = data.value;
    delete data.value;
    control.setData(data);
    //this._set_value(control, data.value);
    this.getModel().setValue(value, true, true);//强制执行，更新到视图
};

cb.binding.ReferBinding.prototype._set_value = function (control, data) {
    if (data == null)
        data = { value: null, code:'',name:'' };
    control.setValue(data);
};

cb.binding.DateTimeBoxBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);

    this._onChange = function (valDate) {
        var model = this.getModel();
        if (!model) return;
        var valStr;
        if (valDate == null) {
            valStr = null;
        } else {
            valStr = this.formatString(valDate);
        }
        model.setValue(valStr, false);
    };

    this.applyBindings = function () {
        var model = this.getModel();
        var control = this.getControl();
        if (!model || !control) return;
        if (this._mapping.bindingMode == cb.binding.BindingMode.TwoWay) {
            control.un("change", this._onChange);
            control.on("change", this._onChange, this);
        }
        model.addListener(this);
    };
};
cb.binding.DateTimeBoxBinding.prototype = new cb.binding.BaseBinding();
cb.binding.DateTimeBoxBinding.prototype.formatString = function (valDate) {
    return cb.util.formatDateTime(valDate);
};
cb.binding.DateTimeBoxBinding.prototype.initData = function () {
    var model = this.getModel();
    var control = this.getControl();
    if (!model || !control) return;
    var data = model._data;
    if (data["alwaysReadOnly"] && data["readOnly"] == null)
        data["readOnly"] = data["alwaysReadOnly"];
    if (control.setData) control.setData(data);
    this._set_value(control, data.value);
};
cb.binding.DateTimeBoxBinding.prototype._set_value = function (control, value) {
    var controlValue = control.getValue();
    var ctrlValStr;
    if (controlValue == null) {
        ctrlValStr = null;
    } else {
        ctrlValStr = this.formatString(controlValue);
    }
    if (value === ctrlValStr) return;
    var valDate;
    if (value == null) {
        valDate = "";
    } else {
        valDate = new Date(value);
    }
    control.setValue(valDate);
};

cb.binding.DateBoxBinding = function (mapping, parent) {
    cb.binding.DateTimeBoxBinding.call(this, mapping, parent);
};
cb.binding.DateBoxBinding.prototype = new cb.binding.DateTimeBoxBinding();
cb.binding.DateBoxBinding.prototype.formatString = function (valDate) {
    return cb.util.formatDate(valDate);
};

cb.binding.DateBoxFxBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);

    this._onChange = function (valDate) {
        var model = this.getModel();
        var control = this.getControl();
        if (!model) return;
        var valStr;
        if (valDate == null) {
            valStr = null;
        } else {
        	if(control._get_data("isFunc") == "Y"){
				valStr = valDate;        	
        	} else {
	            valStr = this.formatString(valDate);
        	}
        }
        model.setValue(valStr, false);
    };

    this.applyBindings = function () {
        var model = this.getModel();
        var control = this.getControl();
        if (!model || !control) return;
        if (this._mapping.bindingMode == cb.binding.BindingMode.TwoWay) {
            control.un("change", this._onChange);
            control.on("change", this._onChange, this);
        }
        model.addListener(this);
    };
};
cb.binding.DateBoxFxBinding.prototype = new cb.binding.BaseBinding();
cb.binding.DateBoxFxBinding.prototype.formatString = function (valDate) {
    return cb.util.formatDate(valDate);
};
cb.binding.DateBoxFxBinding.prototype.initData = function () {
    var model = this.getModel();
    var control = this.getControl();
    if (!model || !control) return;
    var data = model._data;
    if (data["alwaysReadOnly"] && data["readOnly"] == null)
        data["readOnly"] = data["alwaysReadOnly"];
    if (control.setData) control.setData(data);
    this._set_value(control, data.value);
};
cb.binding.DateBoxFxBinding.prototype._set_value = function (control, value) {
	if(control._get_data("isFunc") == "Y"){
		valDate = value;
	} else {
	    var controlValue = control.getValue();
	    var ctrlValStr;
	    if (controlValue == null) {
	        ctrlValStr = null;
	    } else {
	        ctrlValStr = this.formatString(controlValue);
	    }
	    if (value === ctrlValStr) return;
	    var valDate;
	    if (value == null) {
	        valDate = "";
	    } else {
	        valDate = new Date(value);
	    }
	}
    control.setValue(valDate);
};

cb.binding.ComboBoxBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);
};
cb.binding.ComboBoxBinding.prototype = new cb.binding.BaseBinding();

cb.binding.TreeBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);

    this._select = function (row, previousRow) {
        model.setFocusedRow(row);
    };

    this._click = function (row) {
        if (row != null) model.click(row);
    };

    this._doubleclick = function (row) {
        if (row != null) model.doubleClick(row);
    };

    this.applyBindings = function () {
        var model = this.getModel();
        var control = this.getControl();
        if (!model || !control) return;
        if (this._mapping.bindingMode == cb.binding.BindingMode.TwoWay) {
            control.un("select", this._select);
            control.on("select", this._select, this);
            control.un("click", this._click);
            control.on("click", this._click, this);
            control.un("doubleclick", this._doubleclick);
            control.on("doubleClick", this._doubleclick, this);
        }
        model.addListener(this);
    };

    this._set_rows = function (control, propertyValue) {
        if (propertyValue instanceof Array) {
            var model = this.getModel();
            if (model._data.KeyColumn != "" && model._data.DisplayColumn != "") {
                control.setOption({ keyField: model._data.KeyColumn, displayField: model._data.DisplayColumn });
                control.loadData(propertyValue);
            }
        }
    };

    this._set_selected = function (control, propertyValue) {
        for (var attr in propertyValue) {
            control.selectNodeById(attr);
        }
    };

    this._set_expand = function (control, propertyValue) {
        if (propertyValue.Expanded) control.openNode(propertyValue);
        else control.closeNode(propertyValue);
    };

    this._get_focusedrow = function (control) {
        return control.getSelectedRow();
    };

    this._set_focusedrow = function (control, propertyValue) {
        if (propertyValue == -1) return;
        control.selectNode(propertyValue);
    };

    this._set_addbefore = function (control, propertyValue) {
        control.addNodeBefore(propertyValue.row, propertyValue.row_exist);
    };

    this._set_addafter = function (control, propertyValue) {
        control.addNodeAfter(propertyValue.row, propertyValue.row_exist);
    };

    this._set_remove = function (control, propertyValue) {
        control.removeNode(propertyValue);
    };

    this._set_add = function (control, propertyValue) {
        control.appendNode(propertyValue.row, propertyValue.parent);
    };
};
cb.binding.TreeBinding.prototype = new cb.binding.BaseBinding();

cb.binding.SearchBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);

    this._onInput = function (val) {
        var model = this.getModel();
        if (!model) return;
        model.setValue(val);
        model.fireEvent("input", model);
    };

    this.applyBindings = function () {
        var model = this.getModel();
        var control = this.getControl();
        if (!model || !control) return;
        if (this._mapping.bindingMode == cb.binding.BindingMode.TwoWay) {
            control.un("input", this._onInput);
            control.on("input", this._onInput, this);
        }
        model.addListener(this);
    };
}
cb.binding.SearchBinding.prototype = new cb.binding.BaseBinding();

cb.binding.ListViewBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);

    this._onSort = function (data) {
        var model = this.getModel();
        if (!model) return;
        if (model.sort) {
            if (!data) model.sort();
            else model.sort(data["field"], data["direction"]);
        }
    };

    this.applyBindings = function () {
        var model = this.getModel();
        var control = this.getControl();
        if (!model || !control) return;
        if (this._mapping.bindingMode == cb.binding.BindingMode.TwoWay) {
            control.un("sort", this._onSort);
            control.on("sort", this._onSort, this);
        }
        model.addListener(this);
    };
};
cb.binding.ListViewBinding.prototype = new cb.binding.BaseBinding();

cb.binding.FooterToolbarBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);
}
cb.binding.FooterToolbarBinding.prototype = new cb.binding.BaseBinding();

cb.binding.ToolBarBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);
}
cb.binding.ToolBarBinding.prototype = new cb.binding.BaseBinding();

cb.binding.SimpleListViewBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);
    this._onClick = function (data) {
        var model = this.getModel();
        if (!model) return;
        model.fireEvent("click", data);
    };

    this.applyBindings = function () {
        var model = this.getModel();
        var control = this.getControl();
        if (!model || !control) return;
        if (this._mapping.bindingMode == cb.binding.BindingMode.TwoWay) {
            control.un("click", this._onClick);
            control.on("click", this._onClick, this);
        }
        model.addListener(this);
    };
};
cb.binding.SimpleListViewBinding.prototype = new cb.binding.BaseBinding();

cb.binding.TabContentBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);

    this._onClick = function (args) {
        var model = this.getModel();
        if (!model) return;
        model.setValue(args);
        model.fireEvent("click", args);
    };

    this._onBeforeClose = function (args) {
        var model = this.getModel();
        if (!model) return;
        return model.execute("beforeClose", args);
    };

    this.applyBindings = function () {
        var model = this.getModel();
        var control = this.getControl();
        if (!model || !control) return;
        if (this._mapping.bindingMode == cb.binding.BindingMode.TwoWay) {
            control.un("click", this._onClick);
            control.on("click", this._onClick, this);
            control.un("beforeClose", this._onBeforeClose);
            control.on("beforeClose", this._onBeforeClose, this);
        }
        model.addListener(this);
    };
};
cb.binding.TabContentBinding.prototype = new cb.binding.BaseBinding();
cb.binding.TabContentBinding.prototype.initData = function () {
    var model = this.getModel();
    var control = this.getControl();
    if (!model || !control) return;
    if (control.setData) control.setData(model._data);
    var dataSource = model._data.dataSource;
    if (!dataSource || dataSource.length == null) return;
    for (var i = 0; i < dataSource.length; i++) {
        if (dataSource[i].isSelected) {
            model.setValue(dataSource[i].content);
            model.click(dataSource[i].content);
        }
    }
};

cb.binding.ImageBoxBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);
};
cb.binding.ImageBoxBinding.prototype = new cb.binding.BaseBinding();

cb.binding.ProcessBarBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);
};
cb.binding.ProcessBarBinding.prototype = new cb.binding.BaseBinding();


cb.binding.ListCardBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);

    this._onItemClick = function (args) {
        var model = this.getModel();
        if (!model) return;
        if (model.onSelect && args && args.type && args.data) {
            var selectedIndex = model.getRows().indexOf(args.data);
            model.onSelect(selectedIndex);
        }
        model.fireEvent("click", args);
    };

    this._onChangePage = function (args) {
        var model = this.getModel();
        if (!model) return;
        if (model.onChangePage) model.onChangePage(args.pageSize, args.pageIndex);
    };

    this.applyBindings = function () {
        var model = this.getModel();
        var control = this.getControl();
        if (!model || !control) return;
        if (this._mapping.bindingMode == cb.binding.BindingMode.TwoWay) {
            control.un("itemClick", this._onItemClick);
            control.on("itemClick", this._onItemClick, this);
            control.un("changePage", this._onChangePage);
            control.on("changePage", this._onChangePage, this);
        }
        model.addListener(this);
    };
};
cb.binding.ListCardBinding.prototype = new cb.binding.BaseBinding();

cb.binding.TimeLineBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);

    this._onItemClick = function (args) {
        var model = this.getModel();
        if (!model) return;
        model.fireEvent("click", args);
    };

    this.applyBindings = function () {
        var model = this.getModel();
        var control = this.getControl();
        if (!model || !control) return;
        if (this._mapping.bindingMode == cb.binding.BindingMode.TwoWay) {
            control.un("itemClick", this._onItemClick);
            control.on("itemClick", this._onItemClick, this);
        }
        model.addListener(this);
    };
};
cb.binding.TimeLineBinding.prototype = new cb.binding.BaseBinding();

cb.binding.TextAreaBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);
};
cb.binding.TextAreaBinding.prototype = new cb.binding.BaseBinding();

cb.binding.PassWordBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);
};
cb.binding.PassWordBinding.prototype = new cb.binding.BaseBinding();

cb.binding.AccondionBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);

    this._onItemClick = function (args) {
        var model = this.getModel();
        if (!model) return;
        var control = this.getControl();
        if (control) cb.cache.set("clickElement", control.$elem.get(0).id);

        model.set("selectedItem", args);
        model.fireEvent("click", args);
    };

    this._onBeforeExpand = function (args) {
        var model = this.getModel();
        if (!model) return;

        var control = this.getControl();
        model.fireEvent("beforeExpand", args)
    };
    this.applyBindings = function () {
        var model = this.getModel();
        var control = this.getControl();
        if (!model || !control) return;
        if (this._mapping.bindingMode == cb.binding.BindingMode.TwoWay) {
            control.un("itemClick", this._onItemClick);
            control.on("itemClick", this._onItemClick, this);
            control.un("beforeExpand", this._onBeforeExpand);
            control.on("beforeExpand", this._onBeforeExpand, this);
        }
        model.addListener(this);
    };
};
cb.binding.AccondionBinding.prototype = new cb.binding.BaseBinding();


cb.binding.SearchBoxBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);

    this._onSearch = function (val) {
        var model = this.getModel();
        if (!model) return;
        model.setValue(val);
        model.fireEvent("search", val);
    };

    this.applyBindings = function () {
        var model = this.getModel();
        var control = this.getControl();
        if (!model || !control) return;
        if (this._mapping.bindingMode == cb.binding.BindingMode.TwoWay) {
            control.un("search", this._onSearch);
            control.on("search", this._onSearch, this);
            control.un("change", this._onchange);
            control.on("change", this._onchange, this);
        }
        model.addListener(this);
    };
};
cb.binding.SearchBoxBinding.prototype = new cb.binding.BaseBinding();

cb.binding.DropDownBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);

    this._onItemClick = function (args) {
        var model = this.getModel();
        if (!model) return;
        model.fireEvent("click", args);
    };

    this.applyBindings = function () {
        var model = this.getModel();
        var control = this.getControl();
        if (!model || !control) return;
        if (this._mapping.bindingMode == cb.binding.BindingMode.TwoWay) {
            control.un("itemClick", this._onItemClick);
            control.on("itemClick", this._onItemClick, this);
        }
        model.addListener(this);
    };
};
cb.binding.DropDownBinding.prototype = new cb.binding.BaseBinding();

cb.binding.LabelBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);
};
cb.binding.LabelBinding.prototype = new cb.binding.BaseBinding();

cb.binding.DropDownButtonBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);
};
cb.binding.DropDownButtonBinding.prototype = new cb.binding.BaseBinding();

cb.binding.CustomListBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);
    this._onConfigSet = function (args) {
        //alert(args);
        var model = this.getModel();
        var control = this.getControl();
        if (!model || !control) return;
        model.fireEvent('customSet', args);

    };
    this.applyBindings = function () {
        var model = this.getModel();
        var control = this.getControl();
        if (!model || !control) return;
        if (this._mapping.bindingMode == cb.binding.BindingMode.TwoWay) {
            control.un("configSet", this._onConfigSet);
            control.on("configSet", this._onConfigSet, this);
        }
        model.addListener(this);
    }
};
cb.binding.CustomListBinding.prototype = new cb.binding.BaseBinding();

cb.binding.TimeLineControlBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);
}
cb.binding.TimeLineControlBinding.prototype = new cb.binding.BaseBinding();

cb.binding.RoleUserListBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);
}
cb.binding.RoleUserListBinding.prototype = new cb.binding.BaseBinding();

cb.binding.SumListBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);
}
cb.binding.SumListBinding.prototype = new cb.binding.BaseBinding();

cb.binding.RejectListBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);

    this._selectedIndexChanged = function (args) {
        var model = this.getModel();
        if (!model) return;
        model.setValue(args);
    };
    this.applyBindings = function () {
        var model = this.getModel();
        var control = this.getControl();
        if (!model || !control) return;
        if (this._mapping.bindingMode == cb.binding.BindingMode.TwoWay) {
            //control.un("selectedIndexChanged", this._itemChecked);
            control.on("selectedIndexChanged", this._selectedIndexChanged, this);
        }
        model.addListener(this);
    };
}
cb.binding.RejectListBinding.prototype = new cb.binding.BaseBinding();

cb.binding.CheckListBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);

    this._itemChecked = function (args) {
        var model = this.getModel();
        if (!model) return;
        if (model.get('checkedrows') == undefined)
            model.set('checkedrows', []);
        var checkedrows = model.get('checkedrows');
        if (args) {
            if (args['mode'] == 'single') {
                checkedrows.removeAll();
                if (args['target'].checked) {
                    checkedrows.push(args['changedata']);
                }
            }
            else {
                if (args['target'].checked)
                    checkedrows.push(args['changedata']);
                else {
                    //checkedrows.removeData(args['changedata']);
                    var targetrows = checkedrows.filter(function (row, rowIndex, rows) {
                        if (row['id'] == args['changedata']['id'])
                            return true;
                        else
                            return false;
                    }, args);
                    targetrows.forEach(function (row, rowIndex, rows) {
                        checkedrows.removeData(row);
                    });
                }
            }
            model.set('checkedrows', checkedrows);
            model.fireEvent('checkChange', args['target']);
        }
    }

    this.applyBindings = function () {
        var model = this.getModel();
        var control = this.getControl();
        if (!model || !control) return;
        if (this._mapping.bindingMode == cb.binding.BindingMode.TwoWay) {
            control.on("itemChecked", this._itemChecked, this);
        }
        model.addListener(this);
    }
}
cb.binding.CheckListBinding.prototype = new cb.binding.BaseBinding();

cb.binding.PermissionPersonListBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);

    this._addSensitiveObj = function (args) {
        var model = this.getModel();
        if (!model) return;
        model.fireEvent('sensitiveObjAdded', args);
    }
    this._loadBusField = function (args) {
        var model = this.getModel();
        if (!model) return;
        model.setValue(args);
        model.fireEvent('loadBusField', args);
    }
    this._setAuthority = function (args) {
        var model = this.getModel();
        if (!model) return;
        //model.setValue(args);
        model.fireEvent('setAuthority', args);
    }

    this._deleteSensitiveObj = function (args) {
        var model = this.getModel();
        if (!model) return;
        model.fireEvent('deleteSensObj', args);
    }

    this.applyBindings = function () {
        var model = this.getModel();
        var control = this.getControl();
        if (!model || !control) return;
        if (this._mapping.bindingMode == cb.binding.BindingMode.TwoWay) {
            control.on("loadBusField", this._loadBusField, this);
            control.on("sensitiveObjAdded", this._addSensitiveObj, this);
            control.on("setAuthority", this._setAuthority, this);
            control.on("deleteSensitiveObj", this._deleteSensitiveObj, this);
        }
        model.addListener(this);
    }
}
cb.binding.PermissionPersonListBinding.prototype = new cb.binding.BaseBinding();

cb.binding.OrgBoxBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);

    this._change = function (args) {
        var model = this.getModel();
        if (!model) return;
        //model.fireEvent('change', args);
        model.setValue(args);
    }

    this.applyBindings = function () {
        var model = this.getModel();
        var control = this.getControl();
        if (!model || !control) return;
        if (this._mapping.bindingMode == cb.binding.BindingMode.TwoWay) {
            control.on("change", this._change, this);
            control.on("change", this._change, this);
           
        }
        model.addListener(this);
    }
}
cb.binding.OrgBoxBinding.prototype = new cb.binding.BaseBinding();

cb.binding.BatchModifyBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);

    this._btnClicked = function (args) {
        var model = this.getModel();
        if (!model) return;
        model.setValue(args);
        //model._parent.updateData(args);
        model.fireEvent('updateData', args);
    }

    this.applyBindings = function () {
        var model = this.getModel();
        var control = this.getControl();
        if (!model || !control) return;
        if (this._mapping.bindingMode == cb.binding.BindingMode.TwoWay) {
            control.on("btnClicked", this._btnClicked, this);
        }
        model.addListener(this);
    }
}
cb.binding.BatchModifyBinding.prototype = new cb.binding.BaseBinding();

cb.binding.SimpleListBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);

    this._itemChecked = function (args) {
        var model = this.getModel();
        if (!model) return;
        model.fireEvent("itemChecked", args);
    };

    this._itemUnChecked = function (args) {
        var model = this.getModel();
        if (!model) return;
        model.fireEvent("itemUnChecked", args);
    };

    this.applyBindings = function () {
        var model = this.getModel();
        var control = this.getControl();
        if (!model || !control) return;
        if (this._mapping.bindingMode == cb.binding.BindingMode.TwoWay) {
            control.un("itemChecked", this._itemChecked);
            control.on("itemChecked", this._itemChecked, this);
            control.un("itemUnChecked", this._itemUnChecked);
            control.on("itemUnChecked", this._itemUnChecked, this);
        }
        model.addListener(this);
    };
}
cb.binding.SimpleListBinding.prototype = new cb.binding.BaseBinding();

cb.binding.CatalogBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);

    this._onItemClick = function (args) {
        var model = this.getModel();
        if (!model) return;
        model.fireEvent("click", args);
        var control = this.getControl();

        var item = control.getSelectedItem();
        if (item && item.length > 0) {
            model.setData("selectedItem", item.data("data"));
        }
    };


    this._onMoreClick = function (args) {
        var model = this.getModel();
        if (!model) return;
        model.fireEvent("moreClick", args);
    };

    this._onBeforeExpand = function (args) {
        var model = this.getModel();
        if (!model) return;
        model.fireEvent("beforeExpand", args);
    };

    this.applyBindings = function () {
        var model = this.getModel();
        var control = this.getControl();
        if (!model || !control) return;
        if (this._mapping.bindingMode == cb.binding.BindingMode.TwoWay) {
            control.un("itemClick", this._onItemClick);
            control.on("itemClick", this._onItemClick, this);

            control.un("moreClick", this._onMoreClick);
            control.on("moreClick", this._onMoreClick, this);
            control.un("beforeExpand", this._onBeforeExpand);
            control.on("beforeExpand", this._onBeforeExpand, this);
        }
        model.addListener(this);
    };
};
cb.binding.CatalogBinding.prototype = new cb.binding.BaseBinding();

cb.binding.PanoramaBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);

    this._onItemClick = function (args) {
        var model = this.getModel();
        if (!model) return;
        model.fireEvent("itemClick", args);
    };

    this._onImgClick = function (args) {
        var model = this.getModel();
        if (!model) return;
        model.fireEvent("imgClick", args);
    };


    this.applyBindings = function () {
        var model = this.getModel();
        var control = this.getControl();
        if (!model || !control) return;
        if (this._mapping.bindingMode == cb.binding.BindingMode.TwoWay) {
            control.un("itemClick", this._onItemClick);
            control.on("itemClick", this._onItemClick, this);
            control.un("imgClick", this._onImgClick);
            control.on("imgClick", this._onImgClick, this);
        }
        model.addListener(this);
    };
};

cb.binding.PanoramaBinding.prototype = new cb.binding.BaseBinding();

cb.binding.StatusBarBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);
};
cb.binding.StatusBarBinding.prototype = new cb.binding.BaseBinding();

cb.binding.ScaleBarBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);
};
cb.binding.ScaleBarBinding.prototype = new cb.binding.BaseBinding();

cb.binding.StatusBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);
};
cb.binding.StatusBinding.prototype = new cb.binding.BaseBinding();
cb.binding.StatusBinding.prototype.initData = function () {
    var model = this.getModel();
    var control = this.getControl();
    if (!model || !control) return;
    var val;
    var defaultValue = model._data["defaultValue"];
    if (defaultValue != null) {
        if (typeof defaultValue === "number") {
            val = defaultValue;
        }
        else if (typeof defaultValue === "string") {
            val = parseInt(defaultValue);
        }
    }
    if (val != null) model.set("defaultValue", val);
    var value = model._data["value"];
    if (value != null) {
        if (typeof value === "number") {
            val = value;
        }
        else if (typeof value === "string") {
            val = parseInt(value);
        }
    }
    if (val != null) model.setValue(val);
    if (control.setData) control.setData(model._data);
};

cb.binding.ListControlBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);

    this._onItemClick = function (args) {
        var model = this.getModel();
        if (!model) return;
        model.fireEvent("click", args);
    };

    this._onValueChange = function (args) {
        var model = this.getModel();
        if (!model) return;
        model.setValue(args);
    };
    this.applyBindings = function () {
        var model = this.getModel();
        var control = this.getControl();
        if (!model || !control) return;
        if (this._mapping.bindingMode == cb.binding.BindingMode.TwoWay) {
            control.un("itemClick", this._onItemClick);
            control.on("itemClick", this._onItemClick, this);
            control.un("valueChange", this._onValueChange);
            control.on("valueChange", this._onValueChange, this);
        }
        model.addListener(this);
    };
};
cb.binding.ListControlBinding.prototype = new cb.binding.BaseBinding();


cb.binding.TilesBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);

    this._onItemClick = function (args) {
        var model = this.getModel();
        if (!model) return;
        model.fireEvent("ItemClick", args);
    };
    this._onEditClick = function (args) {
        var model = this.getModel();
        if (!model) return;
        model.fireEvent("EditClick", args);
    };

    this._onDeleteClick = function (args) {
        var model = this.getModel();
        if (!model) return;
        model.fireEvent("DeleteClick", args);
    };
    this.applyBindings = function () {
        var model = this.getModel();
        var control = this.getControl();
        if (!model || !control) return;
        if (this._mapping.bindingMode == cb.binding.BindingMode.TwoWay) {
            control.un("itemClick", this._onItemClick);
            control.on("itemClick", this._onItemClick, this);
            control.un("EditClick", this._onEditClick);
            control.on("EditClick", this._onEditClick, this);
            control.un("DeleteClick", this._onDeleteClick);
            control.on("DeleteClick", this._onDeleteClick, this);
        }
        model.addListener(this);
    };
};

cb.binding.TilesBinding.prototype = new cb.binding.BaseBinding();

cb.binding.TabControlBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);

    this._onItemClick = function (args) {
        var model = this.getModel();
        if (!model) return;
        model.fireEvent("click", args);
    };

    this._onValueChange = function (args) {
        var model = this.getModel();
        if (!model) return;
        model.setValue(args);
    };
    this.applyBindings = function () {
        var model = this.getModel();
        var control = this.getControl();
        if (!model || !control) return;
        if (this._mapping.bindingMode == cb.binding.BindingMode.TwoWay) {
            control.un("itemClick", this._onItemClick);
            control.on("itemClick", this._onItemClick, this);
            control.un("valueChange", this._onValueChange);
            control.on("valueChange", this._onValueChange, this);
        }
        model.addListener(this);
    };
};
cb.binding.TabControlBinding.prototype = new cb.binding.BaseBinding();

cb.binding.TreeViewBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);
    this._onClick = function (data) {
        var model = this.getModel();
        var control = this.getControl();
        if (!model || !control) return;
        var selectedData = null;
        function getDataByCode(source) {
            if (source.code && source.code == data.code)
                selectedData = source;
            else {
                if (source.children && source.children.length > 0) {
                    cb.each(source.children, function (attr) {
                        getDataByCode(attr);
                    }, this);
                } else {
                    cb.each(source, function (attr) {
                        getDataByCode(attr);
                    }, this);
                }
            }
        }
        getDataByCode(model._data.dataSource);
        selectedData.uid = data.uid;
        model.setSelectedNode(selectedData);
        model.fireEvent("click", selectedData);
    };
    this._onExpand = function (data) {
        var model = this.getModel();
        var control = this.getControl();
        if (!model || !control) return;
        var selectedData = null;
        function getDataByCode(source) {
            if (source.code && source.code == data.code)
                selectedData = source;
            else {
                if (source.children && source.children.length > 0) {
                    cb.each(source.children, function (attr) {
                        getDataByCode(attr);
                    }, this);
                } else {
                    cb.each(source, function (attr) {
                        getDataByCode(attr);
                    }, this);
                }
            }
        }
        getDataByCode(model._data.dataSource);
        model.set("selected", selectedData);
        model.fireEvent("expand", selectedData);
    };

    this._onCheck = function (data) {
        var model = this.getModel();
        var control = this.getControl();
        if (!model || !control) return;
        if (data.checked) {
            if (data.childsCode && cb.isArray(data.childsCode)) {
                cb.each(data.childsCode, function (code) {
                    model._data.selectedValues[code] = true;
                }, this);

            } else {
                model._data.selectedValues[data.code] = true;
            }

        } else {
            if (data.childsCode && cb.isArray(data.childsCode)) {
                cb.each(data.childsCode, function (code) {
                    delete model._data.selectedValues[code];
                }, this);

            } else {
                delete model._data.selectedValues[data.code];
            }
        }
        var selectedData = null;
        function getDataByCode(source) {
            if (source.code && source.code == data.code) {
                selectedData = source;
                selectedData.checked = data.checked;
            }
            else {
                if (source.children && source.children.length > 0) {
                    cb.each(source.children, function (attr) {
                        getDataByCode(attr);
                    }, this);
                } else {
                    cb.each(source, function (attr) {
                        getDataByCode(attr);
                    }, this);
                }
            }
        }
        getDataByCode(model._data.dataSource);

        model.fireEvent("check", selectedData);
    };

    this.applyBindings = function () {
        var model = this.getModel();
        var control = this.getControl();
        if (!model || !control) return;
        if (this._mapping.bindingMode == cb.binding.BindingMode.TwoWay) {
            control.un("click", this._onClick);
            control.on("click", this._onClick, this);
            control.un("check", this._onCheck);
            control.on("check", this._onCheck, this);
            control.un("expand", this._onExpand);
            control.on("expand", this._onExpand, this);
        }
        model.addListener(this);
    };
};
cb.binding.TreeViewBinding.prototype = new cb.binding.BaseBinding();

cb.binding.TreeViewBinding.prototype._set_datasource = function (control, dataSource) {
    control.setDataSource(dataSource);
};

cb.binding.TreeViewBinding.prototype._set_selectedvalues = function (control, selectedValues) {
    control.setCheckedItems(selectedValues);
};

cb.binding.TreeViewBinding.prototype._set_unselectedvalues = function (control, unselectedvalues) {
    control.setUnCheckedItems(unselectedvalues);
};
cb.binding.TreeViewBinding.prototype._set_appendnodes = function (control, dataSource) {
    control.appendNodes(dataSource);
};
cb.binding.TreeViewBinding.prototype._set_allnodesenable = function (control, val) {
    control.setAllNodesEnable(val);
};
cb.binding.TreeViewBinding.prototype._set_expandbyid = function (control, id) {
    control.expandByID(id);
};
cb.binding.TreeViewBinding.prototype._set_removenode = function (control, node) {
    control.removeNode(node);
};
cb.binding.TreeViewBinding.prototype._set_selectnode = function (control, node) {
    control.setSelectNode(node);
};
cb.binding.TreeViewBinding.prototype._set_updatenode = function (control, node) {
    control.updateNode(node.oldNode,node.newNode);
};
cb.binding.TreeViewBinding.prototype._set_reloadchildnode = function (control, node) {
    control.reloadChildNode(node);
};

cb.binding.PaginationBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);
};
cb.binding.PaginationBinding.prototype = new cb.binding.BaseBinding();


cb.binding.SearchButtonBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);

    this._onclick = function (val) {
        var model = this.getModel();
        if (!model) return;
        model.setValue(val);
        model.fireEvent("click", val);
    };

    this.applyBindings = function () {
        var model = this.getModel();
        var control = this.getControl();
        if (!model || !control) return;
        if (this._mapping.bindingMode == cb.binding.BindingMode.TwoWay) {
            control.un("click", this._onclick);
            control.on("click", this._onclick, this);
        }
        model.addListener(this);
    };
};
cb.binding.SearchButtonBinding.prototype = new cb.binding.BaseBinding();

cb.binding.ScheduleBoxBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);
    this._onsave = function (val) {
        var model = this.getModel();
        if (!model) return;
        model.setValue(val);
        model.fireEvent("save");
    };
       this._ondeleteSchedule = function (val) {
        var model = this.getModel();
        if (!model) return;
        model.setValue(val);
        model.fireEvent("deleteSchedule");
    };
    this._onchange = function (val) {
        var model = this.getModel();
        if (!model) return;
        var oldDateRange = model.get("dateRange");
        if(!oldDateRange.isOpen){
        	if (oldDateRange  && oldDateRange.beginDate == val.beginDate && oldDateRange.endDate == val.endDate) return;        	
        } 
        model.set("dateRange", val);
        model.fireEvent("change", val);
    };
    this.applyBindings = function () {
        var model = this.getModel();
        var control = this.getControl();
        if (!model || !control) return;
        if (this._mapping.bindingMode == cb.binding.BindingMode.TwoWay) {
            control.un("save", this._onsave);
            control.on("save", this._onsave, this);
            control.un("delete", this._ondeleteSchedule);
            control.on("delete", this._ondeleteSchedule, this);
            control.un("change", this._onchange);
            control.on("change", this._onchange, this);
        }
        model.addListener(this);
    };
};
cb.binding.ScheduleBoxBinding.prototype = new cb.binding.BaseBinding();

cb.binding.RadioBoxBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);
};
cb.binding.RadioBoxBinding.prototype = new cb.binding.BaseBinding();
cb.binding.RadioBoxBinding.prototype.initData = function () {
    var model = this.getModel();
    var control = this.getControl();
    if (!model || !control) return;
    var data = model._data;
    if (data["alwaysReadOnly"] && data["readOnly"] == null)
        data["readOnly"] = data["alwaysReadOnly"];
    data["dataValueField"] = data["dataValueField"] || "value";
    if (data.dataSource && cb.isArray(data.dataSource)) {
        var index = data.dataSource.findIndex(function (item) {
            return item.isSelected === true;
        });
        if (index !== -1) {
            var val = data.dataSource[index][data["dataValueField"]];
            model.setValue(val);
        }
    }
    control.setData(data);
};

cb.binding.CollapsibleGroupBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);
};
cb.binding.CollapsibleGroupBinding.prototype = new cb.binding.BaseBinding();