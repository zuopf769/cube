cb.binding.DataGridBinding = function (mapping, parent) {
    cb.binding.BaseBinding.call(this, mapping, parent);

    //监听状态改变
    this._set_state = function (control, data) {
        var property = data.propertyName;
        switch (property) {
            case 'readOnly': control.setEditable(!data.value); break;
            case 'fullScreen':
                var $prev = control.getElement().closest("[class='row']").prev();
                if (!$prev.length) return;
                data.value ? $prev.hide() : $prev.show();
                break;
            case 'visible':
                control.setVisible(data.value);
                break;
            case 'autoWrap':
                control.setAutoWrap(data.value);
                break;
            case 'fontSize':
                control.setFontSize(data.value);
                break;
            //case 'detailInit':
            //    this.getModel().refreshColumns();
            //    break;
            case 'checks':
                this.getModel().set('checks', $.extend(true, data.oldValue, data.value));
                break;

            default:
                if (['showAggregates', 'detailInit'].indexOf(property) > -1) {
                    this.getModel().refreshColumns();
                }
                break;
        }
    };
    this._set_rowState = function (control, data) {
        //var property = data.propertyName;
        //switch (property) {
        //    case 'readOnly': control.setEditable(!data.value); break;
            
        //    default:
        //        break;
        //}
    };
    this._set_columnState = function (control, data) {
        var property = data.propertyName;
        var field = data.field;
        var value = data.value;
        switch (property) {
            case 'isVisible': control[!!value ? 'showColumn' : 'hideColumn'](field); break;
            case 'align': control.setTextAlign(field, value); break;
            case 'width': control.setColWidth(field, value); break;
            default:
                //control.setData(this.getModel()._data);
                this.getModel().refreshColumns();
                break;
        }
    };
    this._set_cellState = function (control, data) {
        //var property = data.propertyName;
        //var index = data.index;
        //var field = data.fields;
        //switch (property) {
        //    default:
        //        break;
        //}
    };
    //
    this._set_visible = function (control, data) {
        var fields = data.fields,
            visible = data.visible;
        var fn = visible ? 'showColumn' : 'hideColumn';
        $.each(fields, function (i, field) {
            control[fn](field);
        });
    };
    this._set_displayRows = function (control, obj) {
        ///模型传过来参数为全部显示列
        control.setDataSource(obj);
        var selectedIndexs = this.getModel().getPageSelectedIndexs();
        control.select(selectedIndexs);
    };
    this._set_columns = function (control, data) {
        control.setData(data);
    };

    //选中状态是否已经同步（内部辅组方法）
    this._isSelectedSyc = function () {
        this._updateSelectedCount();
        return cb.isEqual(this.getControl().getSelectedRows(), this.getModel().getPageSelectedIndexs());
    };
    //处理model的行选择事件,焦点管理
    this._set_select = function (control, rowIndexs) {
        if (this._isSelectedSyc()) return;

        control.select(rowIndexs);
    };
    this._set_unselect = function (control, rowIndexs) {
        if (this._isSelectedSyc()) return;

        control.unselect(rowIndexs);
    };
    this._set_selectAll = function (control) {
        if (this._isSelectedSyc()) return;

        control.selectAll();
    };

    this._set_unselectAll = function (control) {
        if (this._isSelectedSyc()) return;

        control.unselectAll();
    };
    //更新选中的数量
    this._updateSelectedCount = function () {
        if (this._pager) {
            var count = this.getModel().getSelectedRows().length;
            this._pager.updateSelectedCount(count);
        }
    };
    //
    this._set_pageInfo = function (control, pageInfo) {
        //更新视图
        if (this._pager) {
            this._pager.update(pageInfo);
        }
    },

    this._onSelect = function (rowIndex) {
        var model = this.getModel();
        if (!model) return;
        var control = this.getControl();

        model.select(rowIndex);
    };
    this._onUnselect = function (rowIndex) {
        var model = this.getModel();
        if (!model) return;

        model.unselect(rowIndex);
    };
    this._onSelectAll = function () {
        if (this._isSelectedSyc()) return;

        var model = this.getModel();
        model.selectAll();
    };
    this._onUnselectAll = function () {
        if (this._isSelectedSyc()) return;

        var model = this.getModel();
        model.unselectAll();
    };
    this._onCellChange = function (args) {
        var model = this.getModel();
        if (!model) return;
        model.setCellValue(args.rowIndex, args.field, args.value);
    };
    this._set_cellValue = function (control, data) {
        var rowData = this.getModel().getRow(data.index);
        control.updateCell(data.index, data.field, data.value, rowData);
    };
    this._onRowChange = function (args) {
        var model = this.getModel();
        if (!model) return;
        var data = args.rowData;
        if (cb.isArray(data)) {//参照修改值为一个数组
            model.updateRow(args.rowIndex, data[0]);
            for (var i = 1; i < data.length; i++) {
                model.insertRow(++args.rowIndex, data[i]);
            }
        } else {
            model.updateRow(args.rowIndex, args.rowData);
        }
        
    };

    //支持监听clickRow dblClickRow事件
    this._onClickRow = function (index) {
        var model = this.getModel();
        var rowData = model.getRow(index);
        model.execute('clickRow', { row: rowData, index: index });
    };
    this._onDblClickRow = function (index) {
        var model = this.getModel();
        var rowData = model.getRow(index);
        model.execute('dblClickRow', { row: rowData, index: index });
    };
    this._onClickCmd = function (cmdName,index) {
        var model = this.getModel();
        model._exeCommand(cmdName, index);
    };
    this._onClickCell = function (data) {//index,field,value
        this.getModel().execute('clickCell',data);
    };
    //编辑前处理
    this._onBeforeEditCell = function (data) {//index,field,value
        return this.getModel().checkBeforeEditCell(data.index,data.field);
    };
    this._onResizeColumn = function (data) {//field,oldValue,value
        var model=this.getModel();
        model.setColumnState(data.field, 'width', data.value);
        model.setState('columnResized',true);
    };
    this._onEditCheckboxCell = function (data) {
        var model = this.getModel();
        var rowIndex = data.index,
            field = data.field;
        var editable = (model.getState('checks') || {}).editable;
        if (!model.isReadOnly(rowIndex, field) && (!editable || editable && editable.call(model, rowIndex, field) !== false)) {
            model.setCellValue(rowIndex, field, data.value)
        }
    };
    //打开参照页面，或input输入后直接查询时触发
    this._onBeforeRefer = function (data) {
        var model = this.getModel();
        model.execute('beforeRefer',data);
    };
    //选中参照数据后触发
    this._onAfterRefer = function (data) {
        var model = this.getModel();
        model.execute('afterRefer', data);
    };
    this.applyBindings = function () {
        var model = this.getModel();
        var control = this.getControl();
        if (!model || !control) return;
        if (this._mapping.bindingMode == cb.binding.BindingMode.TwoWay) {

            control.un("select", this._onSelect);
            control.on("select", this._onSelect, this);
            control.un("unselect", this._onUnselect);
            control.on("unselect", this._onUnselect, this);
            control.un("selectAll", this._onSelectAll);
            control.on("selectAll", this._onSelectAll, this);
            control.un("unselectAll", this._onUnselectAll);
            control.on("unselectAll", this._onUnselectAll, this);

            control.un("cellChange", this._onCellChange);
            control.on("cellChange", this._onCellChange, this);

            control.un("rowChange", this._onRowChange);
            control.on("rowChange", this._onRowChange, this);
            control.un("clickRow", this._onClickRow);
            control.on("clickRow", this._onClickRow, this);
            control.un("dblClickRow", this._onDblClickRow);
            control.on("dblClickRow", this._onDblClickRow, this);

            control.un("clickCell", this._onClickCell);
            control.on("clickCell", this._onClickCell, this);

            control.un("command", this._onClickCmd);
            control.on("command", this._onClickCmd, this);

            control.un("beforeEditCell", this._onBeforeEditCell);
            control.on("beforeEditCell", this._onBeforeEditCell, this);

            control.un("resizeColumn", this._onResizeColumn);
            control.on("resizeColumn", this._onResizeColumn, this);
            
            control.un("editCheckboxCell", this._onEditCheckboxCell);
            control.on("editCheckboxCell", this._onEditCheckboxCell, this);

            control.un("beforeRefer", this._onBeforeRefer);
            control.on("beforeRefer", this._onBeforeRefer, this);

            control.un("afterRefer", this._onAfterRefer);
            control.on("afterRefer", this._onAfterRefer, this);
        }
        model.addListener(this);
        // fangqg: 修改pager控件初始化逻辑
        var pagerClass = model._data.pager;
        var $grid = control.getElement();
        var $pager;
        if (!pagerClass) {
            $pager = $grid.parent().next();
        } else {
            var $viewContainer = $grid.closest("[data-viewmodel=" + model.getParent().getModelName() + "]");
            $pager = $viewContainer.find("." + pagerClass);
        }
        if (!$pager.length) return;
        if (model.getPageSize() > 0) {
            var pager = new cb.controls['Pager']($pager, model);
            pager.update(model.getPageInfo());
            this._pager = pager;
        }
    };
}
cb.binding.DataGridBinding.prototype = new cb.binding.BaseBinding();

//重写PropertyChangeEvent、get_method方法
cb.binding.DataGridBinding.prototype.Model2UI = cb.binding.DataGridBinding.prototype.PropertyChangeEvent = function (evt) {
    cb.console.log("PropertyChangeEvent", evt);
    if (!evt) return;
    var control = this.getControl();
    if (!control) return;
    if (cb.isEqual(this.getProperty(control, evt.PropertyName), evt.PropertyValue))//如果属性值相等，则不触发刷新
        return;
    this.setProperty(control, evt.PropertyName, evt.PropertyValue);

    cb.console.log("PropertyChangeEvent", evt);
};
cb.binding.DataGridBinding.prototype.get_method = function (prefix, control, propertyName) {
    if (!control || !propertyName || !prefix) return;

    if (propertyName.indexOf(prefix) == 0) {
        propertyName = propertyName.substring(3);
    }

    propertyName = propertyName.substring(0, 1).toLowerCase() + propertyName.substring(1, propertyName.length);
    var method = this["_" + prefix + "_" + propertyName];
    if (method) return method;

    var controlMethodName = prefix + propertyName.substring(0, 1).toUpperCase() + propertyName.substring(1, propertyName.length);
    if (!control[controlMethodName]) return;

    //动态创建方法
    method = this["_" + prefix + "_" + propertyName] = function (ctrl, propertyValue) {
        if (ctrl[controlMethodName])
            ctrl[controlMethodName].call(ctrl, propertyValue);
    };
    return method;
};