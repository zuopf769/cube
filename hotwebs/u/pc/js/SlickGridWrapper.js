// #region Slick.Editors

(function ($) {
    $.extend(true, window, {
        "Slick": {
            "Editors": {
                "TextBox": TextBoxEditor,
                "NumberBox": NumberBoxEditor,
                "DateTimeBox": DateTimeBoxEditor,
                "TextArea": TextAreaEditor,
                "CheckBox": CheckBoxEditor,
                "ComboBox": ComboBoxEditor,
                "Refer": ReferEditor
            }
        }
    });

    function TextBoxEditor(args) {
        var $input;
        var defaultValue;
        var scope = this;

        this.init = function () {
            $input = $("<INPUT type=text class='textBox editor-textbox' />")
            .css("width", args.column.width)
          .appendTo(args.container)
          .bind("keydown.nav", function (e) {
              if (e.keyCode === $.ui.keyCode.LEFT || e.keyCode === $.ui.keyCode.RIGHT) {
                  e.stopImmediatePropagation();
              }
          })
          .focus()
          .select();
        };

        this.destroy = function () {
            $input.remove();
        };

        this.focus = function () {
            $input.focus();
        };

        this.getValue = function () {
            return $input.val();
        };

        this.setValue = function (val) {
            $input.val(val);
        };

        this.loadValue = function (item) {
            defaultValue = item[args.column.field] || "";
            $input.val(defaultValue);
            $input[0].defaultValue = defaultValue;
            $input.select();
        };

        this.serializeValue = function () {
            return $input.val();
        };

        this.applyValue = function (item, state) {
            item[args.column.field] = state;
        };

        this.isValueChanged = function () {
            return (!($input.val() == "" && defaultValue == null)) && ($input.val() != defaultValue);
        };

        this.validate = function () {
            if (args.column.validator) {
                var validationResults = args.column.validator($input.val());
                if (!validationResults.valid) {
                    return validationResults;
                }
            }

            return {
                valid: true,
                msg: null
            };
        };

        this.init();
    }

    function NumberBoxEditor(args) {
        var $input;
        var defaultValue;
        //var scope = this;
        var numberBox;

        this.init = function () {
            var id = args.column.field;
            var index = 0;
            while (true) {
                var length = $("#" + id).length;
                if (length == 0) break;
                id = args.column.field + index++;
            }
            $input = $("<INPUT id = '" + id + "' type=text class='numberBox editor-numberbox' />")
            .css("width", args.column.width)
            .appendTo(args.container)
            .bind("keydown.nav", function (e) {
                if (e.keyCode === $.ui.keyCode.LEFT || e.keyCode === $.ui.keyCode.RIGHT) {
                    e.stopImmediatePropagation();
                }
            })
            .focus()
            .select();
            numberBox = new cb.controls.NumberBox(id, { precision: args.column.precision, scale: args.column.scale });
        };

        this.destroy = function () {
            $input.remove();
        };

        this.focus = function () {
            $input.focus();
        };

        this.loadValue = function (item) {
            defaultValue = item[args.column.field];
            //$input.val(defaultValue);
            //$input[0].defaultValue = defaultValue;
            //$input.select();
            numberBox.setValue(defaultValue);
        };

        this.serializeValue = function () {
            //return parseInt($input.val(), 10) || 0;
            return numberBox.getValue();
        };

        this.applyValue = function (item, state) {
            item[args.column.field] = state;
        };

        this.isValueChanged = function () {
            //return (!($input.val() == "" && defaultValue == null)) && ($input.val() != defaultValue);
            return !isNaN(numberBox.getValue()) && (numberBox.getValue() != defaultValue);
        };

        this.validate = function () {
            if (args.column.validator) {
                var validationResults = args.column.validator($input.val());
                if (!validationResults.valid) {
                    return validationResults;
                }
            }

            //if (isNaN($input.val())) {
            //return {
            //valid: false,
            //msg: "Please enter a valid num"
            //};
            //}

            return {
                valid: true,
                msg: null
            };
        };

        this.init();
    }

    function DateTimeBoxEditor(args) {
        var $input;
        var defaultValue;
        var scope = this;
        var dateTimeBox;

        this.init = function () {
            var id = args.column.field;
            var index = 0;
            while (true) {
                var length = $("#" + id).length;
                if (!length) break;
                id = args.column.field + index++;
            }
            $input = $("<INPUT id='" + id + "' type='text' class='datetimebox editor-datetimebox' />")
            .css("width", args.column.width)
            .appendTo(args.container)
            .focus()
            .select();
            dateTimeBox = new cb.controls.DateTimeBox(id);
        };

        this.destroy = function () {
            $input.remove();
        };

        this.focus = function () {
            $input.focus();
        };

        this.loadValue = function (item) {
            defaultValue = item[args.column.field];
            //$input.val(defaultValue);
            //$input[0].defaultValue = defaultValue;
            //$input.select();
            dateTimeBox.setValue(defaultValue);
        };

        this.serializeValue = function () {
            return this.toDate($input.val());
        };

        this.applyValue = function (item, state) {
            item[args.column.field] = state;
        };

        this.isValueChanged = function () {
            return (!($input.val() == "" && defaultValue == null)) && ($input.val() != defaultValue);
        };

        this.validate = function () {
            if (args.column.validator) {
                var validationResults = args.column.validator($input.val());
                if (!validationResults.valid) {
                    return validationResults;
                }
            }

            if (this.toDate($input.val()) == false) {
                return {
                    valid: false,
                    msg: "Please enter a valid date"
                };
            }

            return {
                valid: true,
                msg: null
            };
        };

        //日期格式：YYYY-MM-DD
        this.toDate = function (strDate) {
            var strSeparator = "-"; //日期分隔符
            var strDateArray;
            var intYear;
            var intMonth;
            var intDay;
            var boolLeapYear;

            strDateArray = strDate.split(strSeparator);

            if (strDateArray.length != 3) return false;

            intYear = parseInt(strDateArray[0], 10);
            intMonth = parseInt(strDateArray[1], 10);
            intDay = parseInt(strDateArray[2], 10);

            if (isNaN(intYear) || isNaN(intMonth) || isNaN(intDay)) return false;

            if (intMonth > 12 || intMonth < 1) return false;

            if ((intMonth == 1 || intMonth == 3 || intMonth == 5 || intMonth == 7 || intMonth == 8 || intMonth == 10 || intMonth == 12) && (intDay > 31 || intDay < 1)) return false;

            if ((intMonth == 4 || intMonth == 6 || intMonth == 9 || intMonth == 11) && (intDay > 30 || intDay < 1)) return false;

            if (intMonth == 2) {
                if (intDay < 1) return false;

                boolLeapYear = false;
                if ((intYear % 100) == 0) {
                    if ((intYear % 400) == 0) boolLeapYear = true;
                }
                else {
                    if ((intYear % 4) == 0) boolLeapYear = true;
                }

                if (boolLeapYear) {
                    if (intDay > 29) return false;
                }
                else {
                    if (intDay > 28) return false;
                }
            }
            return new Date(intYear, intMonth - 1, intDay).format("yyyy-MM-dd");
        }

        this.init();
    }

    function TextAreaEditor(args) {
        var $input;
        var defaultValue;
        var scope = this;

        this.init = function () {
            $input = $("<INPUT type=text class='textArea editor-textarea' />")
            .css("width", args.column.width)
          .appendTo(args.container)
          .bind("keydown.nav", function (e) {
              if (e.keyCode === $.ui.keyCode.LEFT || e.keyCode === $.ui.keyCode.RIGHT) {
                  e.stopImmediatePropagation();
              }
          })
          .focus()
          .select();
        };

        this.destroy = function () {
            $input.remove();
        };

        this.focus = function () {
            $input.focus();
        };

        this.loadValue = function (item) {
            defaultValue = item[args.column.field];
            $input.val(defaultValue);
            $input[0].defaultValue = defaultValue;
            $input.select();
        };

        this.serializeValue = function () {
            return $input.val();
        };

        this.applyValue = function (item, state) {
            item[args.column.field] = state;
        };

        this.isValueChanged = function () {
            return (!($input.val() == "" && defaultValue == null)) && ($input.val() != defaultValue);
        };

        this.validate = function () {
            if (args.column.validator) {
                var validationResults = args.column.validator($input.val());
                if (!validationResults.valid) {
                    return validationResults;
                }
            }

            return {
                valid: true,
                msg: null
            };
        };

        this.init();
    }

    function CheckBoxEditor(args) {
        var $select;
        var defaultValue;
        var scope = this;

        this.init = function () {
            $select = $("<INPUT type=checkbox class='editor-checkbox' />")
            .css("width", args.column.width)
          .appendTo(args.container)
          .focus();
        };

        this.destroy = function () {
            $select.remove();
        };

        this.focus = function () {
            $select.focus();
        };

        this.loadValue = function (item) {
            defaultValue = !!item[args.column.field];
            if (defaultValue) {
                $select.prop('checked', true);
            } else {
                $select.prop('checked', false);
            }
        };

        this.serializeValue = function () {
            return $select.prop('checked');
        };

        this.applyValue = function (item, state) {
            item[args.column.field] = state;
        };

        this.isValueChanged = function () {
            return (this.serializeValue() !== defaultValue);
        };

        this.validate = function () {
            if (args.column.validator) {
                var validationResults = args.column.validator($input.val());
                if (!validationResults.valid) {
                    return validationResults;
                }
            }

            return {
                valid: true,
                msg: null
            };
        };

        this.init();
    }

    function ComboBoxEditor(args) {
        var $div;
        //var $input;
        var defaultValue;
        //var scope = this;
        var comboBox;

        this.init = function () {
            var id = args.column.field;
            var index = 0;
            while (true) {
                var length = $("#" + id).length;
                if (length == 0) break;
                id = args.column.field + index++;
            }
            $div = $("<DIV id = '" + id + "' class='ComboBox editor-combobox'><input type='text'/></div>")
            .css("width", args.column.width)
            .appendTo(args.container)
            .focus()
            .select();
            //$input = $div.find("input");
            comboBox = new cb.controls.ComboBox(id, { data: args.column.dataSource });
        };

        this.destroy = function () {
            $div.remove();
        };

        this.focus = function () {
            $div.focus();
        };

        this.loadValue = function (item) {
            defaultValue = item[args.column.field];
            //$input.val(defaultValue);
            //$input[0].defaultValue = defaultValue;
            //$input.select();
            comboBox.setValue(defaultValue);
        };

        this.serializeValue = function () {
            //return $input.val();
            return comboBox.getValue();
        };

        this.applyValue = function (item, state) {
            item[args.column.field] = state;
        };

        this.isValueChanged = function () {
            //return (!($input.val() == "" && defaultValue == null)) && ($input.val() != defaultValue);
            return comboBox.getValue() != defaultValue;
        };

        this.validate = function () {
            if (args.column.validator) {
                var validationResults = args.column.validator($input.val());
                if (!validationResults.valid) {
                    return validationResults;
                }
            }

            return {
                valid: true,
                msg: null
            };
        };

        this.init();
    }

    function ReferEditor(args) {
        var $div;
        //var $input;
        var defaultValue;
        var scope = this;
        var refer;

        this.init = function () {
            var id = args.column.field;
            var index = 0;
            while (true) {
                var length = $("#" + id).length;
                if (length == 0) break;
                id = args.column.field + index++;
            }
            $div = $("<DIV id = '" + id + "' class='Refer editor-refer'><input type='text' style='float:left;width:84%;'/><div style='width:8%;float:right;cursor:pointer;margin:5px 5px 0 0;'><img src='pc/images/Ref.png'/></div></div>")
            .css("width", args.column.width)
            .appendTo(args.container)
            .focus()
            .select();
            $input = $div.find("input");
            //var ref = new cb.controls.Refer(args.column.field);
            //ref.refWin = args.column.ref;
            refer = cb.controls.create("Refer", id);
            var e = new Slick.EventData();
            args["controlId"] = id;
            args.grid.onCellEditorLoad.notify(args, e, scope);
        };

        this.destroy = function () {
            var e = new Slick.EventData();
            args.grid.onCellEditorDestroy.notify(args, e, scope);
            $div.remove();
            cb.cache.controls.set($div.attr("id"), null);
        };

        this.focus = function () {
            $div.focus();
        };

        this.loadValue = function (item) {
            //defaultValue = item[args.column.field];
            //$input.val(defaultValue);
            //$input[0].defaultValue = defaultValue;
            //$input.select();
            if ($input.val()) return;
            $input.val(item[args.column.field + "_" + args.column.refCode]);
        };

        this.serializeValue = function () {
            //return $input.val();
            //var val = {};
            //var field = args.column.field;
            //var refColumn = args.column.refColumn;
            //if (refer && refer.getValue) {
            //    val[field + "_" + refColumn["keyFld"]] = refer.getValue();
            //    val[field + "_" + refColumn["nameFld"]] = refer.getText();
            //}
            //return val;
        };

        this.applyValue = function (item, state) {
            //item[args.column.field] = state;
            //var field = args.column.field;
            //var refColumn = args.column.refColumn;
            //item[field + "_" + refColumn["keyFld"]] = state[field + "_" + refColumn["keyFld"]];
            //item[field + "_" + refColumn["nameFld"]] = state[field + "_" + refColumn["nameFld"]];
        };

        this.isValueChanged = function () {
            //return (!($input.val() == "" && defaultValue == null)) && ($input.val() != defaultValue);
            //return refer.getValue() != defaultValue;
        };

        this.validate = function () {
            if (args.column.validator) {
                var validationResults = args.column.validator($input.val());
                if (!validationResults.valid) {
                    return validationResults;
                }
            }

            return {
                valid: true,
                msg: null
            };
        };

        this.init();
    }
})(jQuery);

// #endregion

// #region Slick.Formatters

(function ($) {
    $.extend(true, window, {
        "Slick": {
            "Formatters": {
                "NumberBox": NumberBoxFormatter,
                "ComboBox": ComboBoxFormatter,
                "Refer": ReferFormatter,
                "Color": ColorFormatter
            }
        }
    });

    function NumberBoxFormatter(row, cell, value, columnDef, dataContext) {
        return value;
    }

    function ComboBoxFormatter(row, cell, value, columnDef, dataContext) {
        for (var i = 0; i < columnDef.dataSource.length; i++) {
            var item = columnDef.dataSource[i];
            if (item.value == value) {
                return item.text;
            }
        }
        return null;
    }

    function ReferFormatter(row, cell, value, columnDef, dataContext) {
        if (dataContext && value != null) {
            var showMode = columnDef.refShowMode || "Name";
            var keyValue, codeValue, nameValue;
            var refReturnData = dataContext[columnDef.field] && dataContext[columnDef.field].refReturnData;
            if (!refReturnData || !refReturnData.data) {
                var defaultName, defaultKey;
                var items = value.split(",");
                if (items.length == 2) {
                    defaultName = items[0];
                    defaultKey = items[1];
                }
                keyValue = dataContext[columnDef.field + "_" + columnDef.refKey] || defaultKey || "";
                codeValue = dataContext[columnDef.field + "_" + columnDef.refCode] || "";
                nameValue = dataContext[columnDef.field + "_" + columnDef.refName] || defaultName || "";
            }
            else {
                keyValue = refReturnData.data.data[refReturnData.keyField] || "";
                codeValue = refReturnData.data.data[refReturnData.codeField] || "";
                nameValue = refReturnData.data.data[refReturnData.nameField] || "";
            }
            return (showMode === "Code" ? codeValue : (showMode === "CodeName" ? ("(" + codeValue + ")" + nameValue) : nameValue));
        }
        return "";
    }

    function ColorFormatter(row, cell, value, columnDef, dataContext) {
        return "<span class='percent-complete-bar' style='background:" + value + ";width:100%;height:20px;'></span>";
    }
})(jQuery);

// #endregion

// #region Slick.Controls.Header

(function ($) {
    function SlickGridHeader(wrapper, $container) {
        var grid = wrapper._grid;
        var dataView = wrapper._dataView;
        var dataLoader = wrapper._dataLoader;
        var isCollapsed;
        var isHidden;
        var $btnInsertRowBelow;
        var $btnInsertRowAbove;
        var $btnDeleteRows;
        var $btnColumnPicker;
        var $btnFilter;

        function init() {
            constructHeaderUI();
        }

        function constructHeaderUI() {
            $container.empty();

            var $btnSetCollapsed = $("<span style='float:left' class='toolbar-icon toolbar-icon-setcollapsed' title='展开/隐藏'></span>")
            .addClass("ui-state-default ui-corner-all")
            .mouseover(function (e) {
                $(e.target).addClass("toolbar-state-hover")
            })
            .mouseout(function (e) {
                $(e.target).removeClass("toolbar-state-hover")
            })
            .click(function () {
                isCollapsed = !isCollapsed;
                wrapper.triggerSetCollapsed(isCollapsed);
            })
            .appendTo($container);

            $btnInsertRowBelow = $("<span style='float:left' class='toolbar-icon toolbar-icon-addrow' title='增行'></span>")
            .addClass("ui-state-default ui-corner-all")
            .mouseover(function (e) {
                $(e.target).addClass("toolbar-state-hover")
            })
            .mouseout(function (e) {
                $(e.target).removeClass("toolbar-state-hover")
            })
            .click(function () {
                var selectedIndex = grid.getSelectedRows()[0];
                if (selectedIndex == undefined) {
                    wrapper.triggerAddNewRow();
                }
                else {
                    wrapper.triggerAddNewRow(selectedIndex + 1);
                }
            })
            .appendTo($container);

            $btnInsertRowAbove = $("<span style='float:left' class='toolbar-icon toolbar-icon-insertrow' title='插行'></span>")
            .addClass("ui-state-default ui-corner-all")
            .mouseover(function (e) {
                $(e.target).addClass("toolbar-state-hover")
            })
            .mouseout(function (e) {
                $(e.target).removeClass("toolbar-state-hover")
            })
            .click(function () {
                var selectedIndex = grid.getSelectedRows()[0];
                if (selectedIndex == undefined) {
                    wrapper.triggerAddNewRow();
                }
                else {
                    wrapper.triggerAddNewRow(selectedIndex);
                }
            })
            .appendTo($container);

            $btnDeleteRows = $("<span style='float:left' class='toolbar-icon toolbar-icon-deleterow' title='删行'></span>")
            .addClass("ui-state-default ui-corner-all")
            .mouseover(function (e) {
                $(e.target).addClass("toolbar-state-hover")
            })
            .mouseout(function (e) {
                $(e.target).removeClass("toolbar-state-hover")
            })
            .click(function () {
                var selectedIndexes = grid.getSelectedRows();
                if (selectedIndexes == undefined) {
                    wrapper.triggerDeleteRows();
                }
                else {
                    wrapper.triggerDeleteRows(selectedIndexes);
                }
            })
            .appendTo($container);

            var $btnCardView = $("<span style='float:left' class='toolbar-icon toolbar-icon-cardview' title='CardView'></span>")
            .addClass("ui-state-default ui-corner-all")
            .mouseover(function (e) {
                $(e.target).addClass("toolbar-state-hover")
            })
            .mouseout(function (e) {
                $(e.target).removeClass("toolbar-state-hover")
            })
            .click(function () {
                wrapper.triggerShowCardView();
            })
            .appendTo($container);

            $btnColumnPicker = $("<span style='float:right' class='toolbar-icon toolbar-icon-columnpicker' title='列设置'></span>")
            .addClass("ui-state-default ui-corner-all")
            .mouseover(function (e) {
                $(e.target).addClass("toolbar-state-hover")
            })
            .mouseout(function (e) {
                $(e.target).removeClass("toolbar-state-hover")
            })
            .click(function (e) {
                grid.onHeaderContextMenu.notify(undefined, e, grid);
            })
            .appendTo($container);

            $btnFilter = $("<span style='float:right' class='ui-icon ui-icon-search' title='搜索'></span>")
            .addClass("ui-state-default ui-corner-all")
            .mouseover(function (e) {
                $(e.target).addClass("ui-state-hover")
            })
            .mouseout(function (e) {
                $(e.target).removeClass("ui-state-hover")
            })
            .click(function (e) {
                grid.onHeaderFilter.notify(undefined, e, grid);
            })
            .appendTo($container);

            $container.children().wrapAll("<div class='grid-header' style='width:100%' />");
        }

        function setDisabled(val) {
            $btnInsertRowBelow.attr("disabled", val);
            $btnInsertRowAbove.attr("disabled", val);
            $btnDeleteRows.attr("disabled", val);
        }

        function setCollapsed(collapsed) {
            isCollapsed = collapsed;
            if (isHidden == true) return;
            if (collapsed == true) {
                $btnInsertRowBelow.addClass("grid-display-none");
                $btnInsertRowAbove.addClass("grid-display-none");
                $btnDeleteRows.addClass("grid-display-none");
                $btnColumnPicker.addClass("grid-display-none");
                $btnFilter.addClass("grid-display-none");
            }
            else {
                $btnInsertRowBelow.removeClass("grid-display-none");
                $btnInsertRowAbove.removeClass("grid-display-none");
                $btnDeleteRows.removeClass("grid-display-none");
                $btnColumnPicker.removeClass("grid-display-none");
                $btnFilter.removeClass("grid-display-none");
            }
        }

        function setHidden() {
            isHidden = true;
            $btnInsertRowBelow.addClass("grid-display-none");
            $btnInsertRowAbove.addClass("grid-display-none");
            if (wrapper._mode != "remote") {
                $btnDeleteRows.addClass("grid-display-none");
            }
            $btnColumnPicker.addClass("grid-display-none");
            $btnFilter.addClass("grid-display-none");
        }

        init();

        return {
            "setDisabled": setDisabled,
            "setCollapsed": setCollapsed,
            "setHidden": setHidden
        };
    }

    // Slick.Controls.Header
    $.extend(true, window, { Slick: { Controls: { Header: SlickGridHeader}} });
})(jQuery);

// #endregion

// #region Slick.Controls.Pager

(function ($) {
    function SlickGridPager(wrapper, $container) {
        var dataView = wrapper._dataView;
        var grid = wrapper._grid;
        var $status;

        function init() {
            dataView.onPagingInfoChanged.subscribe(function (e, pagingInfo) {
                updatePager(pagingInfo);
            });

            constructPagerUI();
            updatePager(dataView.getPagingInfo());
        }

        function getNavState() {
            var cannotLeaveEditMode = !Slick.GlobalEditorLock.commitCurrentEdit();
            var pagingInfo = dataView.getPagingInfo();
            var lastPage = pagingInfo.totalPages - 1;

            return {
                canGotoFirst: !cannotLeaveEditMode && pagingInfo.pageSize != 0 && pagingInfo.pageNum > 0,
                canGotoLast: !cannotLeaveEditMode && pagingInfo.pageSize != 0 && pagingInfo.pageNum != lastPage,
                canGotoPrev: !cannotLeaveEditMode && pagingInfo.pageSize != 0 && pagingInfo.pageNum > 0,
                canGotoNext: !cannotLeaveEditMode && pagingInfo.pageSize != 0 && pagingInfo.pageNum < lastPage,
                pagingInfo: pagingInfo
            }
        }

        function setPageSize(n) {
            dataView.setRefreshHints({
                isFilterUnchanged: true
            });
            dataView.setPagingOptions({ pageSize: n });
        }

        function gotoFirst() {
            if (getNavState().canGotoFirst) {
                dataView.setPagingOptions({ pageNum: 0 });
            }
        }

        function gotoLast() {
            var state = getNavState();
            if (state.canGotoLast) {
                dataView.setPagingOptions({ pageNum: state.pagingInfo.totalPages - 1 });
            }
        }

        function gotoPrev() {
            var state = getNavState();
            if (state.canGotoPrev) {
                dataView.setPagingOptions({ pageNum: state.pagingInfo.pageNum - 1 });
            }
        }

        function gotoNext() {
            var state = getNavState();
            if (state.canGotoNext) {
                dataView.setPagingOptions({ pageNum: state.pagingInfo.pageNum + 1 });
            }
        }

        function constructPagerUI() {
            $container.empty();

            var $nav = $("<span class='slick-pager-nav' />").appendTo($container);
            var $settings = $("<span class='slick-pager-settings' />").appendTo($container);
            $status = $("<span class='slick-pager-status' />").appendTo($container);

            $settings
          .append("<span class='slick-pager-settings-expanded' style='display:none'>显示: <a data=0>全部</a><a data='-1'>自动</a><a data=25>25</a><a data=50>50</a><a data=100>100</a></span>");

            $settings.find("a[data]").click(function (e) {
                var pagesize = $(e.target).attr("data");
                if (pagesize != undefined) {
                    if (pagesize == -1) {
                        var vp = grid.getViewport();
                        setPageSize(vp.bottom - vp.top);
                    } else {
                        setPageSize(parseInt(pagesize));
                    }
                }
            });

            var icon_prefix = "<span class='ui-state-default ui-corner-all ui-icon-container'><span class='ui-icon ";
            var icon_suffix = "' /></span>";

            $(icon_prefix + "ui-icon-lightbulb" + icon_suffix)
          .click(function () {
              $(".slick-pager-settings-expanded").toggle()
          })
          .appendTo($settings);

            $(icon_prefix + "ui-icon-seek-first" + icon_suffix)
          .click(gotoFirst)
          .appendTo($nav);

            $(icon_prefix + "ui-icon-seek-prev" + icon_suffix)
          .click(gotoPrev)
          .appendTo($nav);

            $(icon_prefix + "ui-icon-seek-next" + icon_suffix)
          .click(gotoNext)
          .appendTo($nav);

            $(icon_prefix + "ui-icon-seek-end" + icon_suffix)
          .click(gotoLast)
          .appendTo($nav);

            $container.find(".ui-icon-container")
          .hover(function () {
              $(this).toggleClass("ui-state-hover");
          });

            $container.children().wrapAll("<div class='slick-pager' />");
        }


        function updatePager(pagingInfo) {
            var state = getNavState();

            $container.find(".slick-pager-nav span").removeClass("ui-state-disabled");
            if (!state.canGotoFirst) {
                $container.find(".ui-icon-seek-first").addClass("ui-state-disabled");
            }
            if (!state.canGotoLast) {
                $container.find(".ui-icon-seek-end").addClass("ui-state-disabled");
            }
            if (!state.canGotoNext) {
                $container.find(".ui-icon-seek-next").addClass("ui-state-disabled");
            }
            if (!state.canGotoPrev) {
                $container.find(".ui-icon-seek-prev").addClass("ui-state-disabled");
            }

            if (pagingInfo.pageSize == 0) {
                $status.text("显示全部 " + pagingInfo.totalRows + " 行");
            } else {
                $status.text("显示页 " + (pagingInfo.pageNum + 1) + " / " + pagingInfo.totalPages);
            }
        }

        init();
    }

    // Slick.Controls.Pager
    $.extend(true, window, { Slick: { Controls: { Pager: SlickGridPager}} });
})(jQuery);

// #endregion

// #region Slick.Controls.PagerRemote

(function ($) {
    function SlickGridPager(wrapper, $container) {
        var dataLoader = wrapper._dataLoader;
        var grid = wrapper._grid;
        var $status;

        function init() {
            dataLoader.onPagingInfoChanged.subscribe(function (e, pagingInfo) {
                updatePager(pagingInfo);
            });

            constructPagerUI();
            updatePager(dataLoader.getPagingInfo());
        }

        function getNavState() {
            var cannotLeaveEditMode = !Slick.GlobalEditorLock.commitCurrentEdit();
            var pagingInfo = dataLoader.getPagingInfo();
            var lastPage = pagingInfo.pageCount;

            return {
                canGotoFirst: !cannotLeaveEditMode && pagingInfo.pageSize != 0 && pagingInfo.pageIndex > 1,
                canGotoLast: !cannotLeaveEditMode && pagingInfo.pageSize != 0 && pagingInfo.pageIndex != lastPage,
                canGotoPrev: !cannotLeaveEditMode && pagingInfo.pageSize != 0 && pagingInfo.pageIndex > 1,
                canGotoNext: !cannotLeaveEditMode && pagingInfo.pageSize != 0 && pagingInfo.pageIndex < lastPage,
                pagingInfo: pagingInfo
            }
        }

        function triggerChangePage() {
            var pagingInfo = dataLoader.getPagingInfo();
            wrapper.triggerChangePage({ pageSize: pagingInfo.pageSize, pageIndex: pagingInfo.pageIndex });
        }

        function setPageSize(n) {
            dataLoader.setPagingOptions({ pageSize: n, pageIndex: 1 });
            triggerChangePage();
        }

        function gotoFirst() {
            if (getNavState().canGotoFirst) {
                dataLoader.setPagingOptions({ pageIndex: 1 });
                triggerChangePage();
            }
        }

        function gotoLast() {
            var state = getNavState();
            if (state.canGotoLast) {
                dataLoader.setPagingOptions({ pageIndex: state.pagingInfo.pageCount });
                triggerChangePage();
            }
        }

        function gotoPrev() {
            var state = getNavState();
            if (state.canGotoPrev) {
                dataLoader.setPagingOptions({ pageIndex: state.pagingInfo.pageIndex - 1 });
                triggerChangePage();
            }
        }

        function gotoNext() {
            var state = getNavState();
            if (state.canGotoNext) {
                dataLoader.setPagingOptions({ pageIndex: state.pagingInfo.pageIndex + 1 });
                triggerChangePage();
            }
        }

        function constructPagerUI() {
            $container.empty();

            var $nav = $("<span class='slick-pager-nav' />").appendTo($container);
            var $settings = $("<span class='slick-pager-settings' />").appendTo($container);
            $status = $("<span class='slick-pager-status' />").appendTo($container);

            $settings
          .append("<span class='slick-pager-settings-expanded' style='display:none'>显示: <a data=0>全部</a><a data='-1'>自动</a><a data=25>25</a><a data=50>50</a><a data=100>100</a></span>");

            $settings.find("a[data]").click(function (e) {
                var pagesize = $(e.target).attr("data");
                if (pagesize != undefined) {
                    if (pagesize == -1) {
                        var vp = grid.getViewport();
                        setPageSize(vp.bottom - vp.top);
                    } else {
                        setPageSize(parseInt(pagesize));
                    }
                }
            });

            var icon_prefix = "<span class='ui-state-default ui-corner-all ui-icon-container'><span class='ui-icon ";
            var icon_suffix = "' /></span>";

            $(icon_prefix + "ui-icon-lightbulb" + icon_suffix)
          .click(function () {
              $(".slick-pager-settings-expanded").toggle()
          })
          .appendTo($settings);

            $(icon_prefix + "ui-icon-seek-first" + icon_suffix)
          .click(gotoFirst)
          .appendTo($nav);

            $(icon_prefix + "ui-icon-seek-prev" + icon_suffix)
          .click(gotoPrev)
          .appendTo($nav);

            $(icon_prefix + "ui-icon-seek-next" + icon_suffix)
          .click(gotoNext)
          .appendTo($nav);

            $(icon_prefix + "ui-icon-seek-end" + icon_suffix)
          .click(gotoLast)
          .appendTo($nav);

            $container.find(".ui-icon-container")
          .hover(function () {
              $(this).toggleClass("ui-state-hover");
          });

            $container.children().wrapAll("<div class='slick-pager' />");
        }


        function updatePager(pagingInfo) {
            var state = getNavState();

            $container.find(".slick-pager-nav span").removeClass("ui-state-disabled");
            if (!state.canGotoFirst) {
                $container.find(".ui-icon-seek-first").addClass("ui-state-disabled");
            }
            if (!state.canGotoLast) {
                $container.find(".ui-icon-seek-end").addClass("ui-state-disabled");
            }
            if (!state.canGotoNext) {
                $container.find(".ui-icon-seek-next").addClass("ui-state-disabled");
            }
            if (!state.canGotoPrev) {
                $container.find(".ui-icon-seek-prev").addClass("ui-state-disabled");
            }

            if (pagingInfo.pageSize == 0) {
                $status.text("显示全部 " + pagingInfo.totalCount + " 行");
            } else {
                $status.text("当前页大小 " + pagingInfo.pageSize + " 显示页 " + pagingInfo.pageIndex + " / " + pagingInfo.pageCount + " 全部 " + pagingInfo.totalCount + " 行");
            }
        }

        init();
    }

    // Slick.Controls.PagerRemote
    $.extend(true, window, { Slick: { Controls: { PagerRemote: SlickGridPager}} });
})(jQuery);

// #endregion

// #region Slick.Controls.ColumnPicker

(function ($) {
    function SlickColumnPicker(columns, dataView, grid, options) {
        var $menu;
        var columnCheckboxes;

        var defaults = {
            fadeSpeed: 250
        };

        function init() {
            grid.onHeaderContextMenu.subscribe(handleHeaderContextMenu);
            grid.onColumnsReordered.subscribe(updateColumnOrder);
            options = $.extend({}, defaults, options);

            $menu = $("<span class='slick-columnpicker' style='display:none;position:absolute;z-index:20;' />").appendTo(document.body);

            $menu.bind("mouseleave", function (e) {
                $(this).fadeOut(options.fadeSpeed)
            });
            $menu.bind("click", updateColumn);

        }

        function handleHeaderContextMenu(e, args) {
            e.preventDefault();
            $menu.empty();
            updateColumnOrder();
            columnCheckboxes = [];

            var $li, $input;
            for (var i = 0; i < columns.length; i++) {
                $li = $("<li />").appendTo($menu);
                $input = $("<input type='checkbox' />").data("column-id", columns[i].id);
                columnCheckboxes.push($input);

                if (grid.getColumnIndex(columns[i].id) != null) {
                    $input.attr("checked", "checked");
                }

                $("<label />")
            .text(columns[i].name)
            .prepend($input)
            .appendTo($li);
            }

            /* $("<hr/>").appendTo($menu);
            $li = $("<li />").appendTo($menu);
            $input = $("<input type='checkbox' />").data("option", "autoresize");
            $("<label />")
            .text("Force fit columns")
            .prepend($input)
            .appendTo($li);
            if (grid.getOptions().forceFitColumns) {
            $input.attr("checked", "checked");
            }

            $li = $("<li />").appendTo($menu);
            $input = $("<input type='checkbox' />").data("option", "syncresize");
            $("<label />")
            .text("Synchronous resize")
            .prepend($input)
            .appendTo($li);
            if (grid.getOptions().syncColumnCellResize) {
            $input.attr("checked", "checked");
            } */

            $menu
          .css("top", e.pageY + 10)
          .css("left", e.pageX - 100)
          .fadeIn(options.fadeSpeed);
        }

        function updateColumnOrder() {
            // Because columns can be reordered, we have to update the `columns`
            // to reflect the new order, however we can't just take `grid.getColumns()`,
            // as it does not include columns currently hidden by the picker.
            // We create a new `columns` structure by leaving currently-hidden
            // columns in their original ordinal position and interleaving the results
            // of the current column sort.
            var current = grid.getColumns().slice(0);
            var ordered = new Array(columns.length);
            for (var i = 0; i < ordered.length; i++) {
                if (grid.getColumnIndex(columns[i].id) === undefined) {
                    // If the column doesn't return a value from getColumnIndex,
                    // it is hidden. Leave it in this position.
                    ordered[i] = columns[i];
                } else {
                    // Otherwise, grab the next visible column.
                    ordered[i] = current.shift();
                }
            }
            columns = ordered;
        }

        function updateColumn(e) {
            /* if ($(e.target).data("option") == "autoresize") {
            if (e.target.checked) {
            grid.setOptions({forceFitColumns:true});
            grid.autosizeColumns();
            } else {
            grid.setOptions({forceFitColumns:false});
            }
            return;
            }

            if ($(e.target).data("option") == "syncresize") {
            if (e.target.checked) {
            grid.setOptions({syncColumnCellResize:true});
            } else {
            grid.setOptions({syncColumnCellResize:false});
            }
            return;
            } */

            if ($(e.target).is(":checkbox")) {
                var visibleColumns = [];
                $.each(columnCheckboxes, function (i, e) {
                    if ($(this).is(":checked")) {
                        visibleColumns.push(columns[i]);
                    }
                });

                if (!visibleColumns.length) {
                    $(e.target).attr("checked", "checked");
                    return;
                }

                grid.setColumns(visibleColumns);
            }
        }

        function getAllColumns() {
            return columns;
        }

        init();

        return {
            "getAllColumns": getAllColumns
        };
    }

    // Slick.Controls.ColumnPicker
    $.extend(true, window, { Slick: { Controls: { ColumnPicker: SlickColumnPicker}} });
})(jQuery);

// #endregion

// #region Slick.Controls.Filter

(function ($) {
    function SlickGridFilter(columns, dataView, grid, options) {
        var $menu;
        var filterArgs = {};

        var defaults = {
            fadeSpeed: 250
        };

        function init() {
            grid.onHeaderFilter.subscribe(handleHeaderFilter);
            grid.onColumnsReordered.subscribe(updateColumnOrder);
            options = $.extend({}, defaults, options);

            $menu = $("<span class='slick-columnpicker' style='display:none;position:absolute;z-index:20;' />").appendTo(document.body);

            $menu.bind("mouseleave", function (e) {
                $(this).fadeOut(options.fadeSpeed)
            });

            dataView.setFilter(function (item, args) {
                for (var attr in args) {
                    if (args[attr] != "" && item[attr].toString().indexOf(args[attr]) == -1) {
                        return false;
                    }
                }
                return true;
            });
        }

        function handleHeaderFilter(e, args) {
            e.preventDefault();
            $menu.empty();
            updateColumnOrder();

            var $li, $input;
            for (var i = 0; i < columns.length; i++) {
                var columnId = columns[i].id;
                if (columnId == "_checkbox_selector") continue;
                $li = $("<li />").appendTo($menu);
                $("<label />").text(columns[i].name).appendTo($li);
                $input = $("<input type='text' />").data("column-id", columnId);
                $input.val(filterArgs[columnId])
                .keyup($input, updateFilterArgs)
                .appendTo($li);
            }

            $menu
          .css("top", e.pageY + 10)
          .css("left", e.pageX - 100)
          .fadeIn(defaults.fadeSpeed);
        }

        function updateColumnOrder() {
            var current = grid.getColumns().slice(0);
            var ordered = new Array(columns.length);
            for (var i = 0; i < ordered.length; i++) {
                if (grid.getColumnIndex(columns[i].id) == undefined) {
                    ordered[i] = columns[i];
                } else {
                    ordered[i] = current.shift();
                }
            }
            columns = ordered;
        }

        function updateFilterArgs(e) {
            Slick.GlobalEditorLock.cancelCurrentEdit();

            // clear on Esc
            if (e.which == 27) {
                this.value = "";
            }

            filterArgs[e.data.data("column-id")] = $(this).val();
            dataView.setFilterArgs(filterArgs);
            dataView.refresh();
        }

        init();
    }

    // Slick.Controls.Filter
    $.extend(true, window, { Slick: { Controls: { Filter: SlickGridFilter}} });
})(jQuery);

// #endregion

// #region Slick.Plugins.HeaderButtons

(function ($) {
    // register namespace
    $.extend(true, window, {
        "Slick": {
            "Plugins": {
                "HeaderButtons": HeaderButtons
            }
        }
    });


    /***
    * A plugin to add custom buttons to column headers.
    *
    * USAGE:
    *
    * Add the plugin .js & .css files and register it with the grid.
    *
    * To specify a custom button in a column header, extend the column definition like so:
    *
    *   var columns = [
    *     {
    *       id: 'myColumn',
    *       name: 'My column',
    *
    *       // This is the relevant part
    *       header: {
    *          buttons: [
    *              {
    *                // button options
    *              },
    *              {
    *                // button options
    *              }
    *          ]
    *       }
    *     }
    *   ];
    *
    * Available button options:
    *    cssClass:     CSS class to add to the button.
    *    image:        Relative button image path.
    *    tooltip:      Button tooltip.
    *    showOnHover:  Only show the button on hover.
    *    handler:      Button click handler.
    *    command:      A command identifier to be passed to the onCommand event handlers.
    *
    * The plugin exposes the following events:
    *    onCommand:    Fired on button click for buttons with 'command' specified.
    *        Event args:
    *            grid:     Reference to the grid.
    *            column:   Column definition.
    *            command:  Button command identified.
    *            button:   Button options.  Note that you can change the button options in your
    *                      event handler, and the column header will be automatically updated to
    *                      reflect them.  This is useful if you want to implement something like a
    *                      toggle button.
    *
    *
    * @param options {Object} Options:
    *    buttonCssClass:   a CSS class to use for buttons (default 'slick-header-button')
    * @class Slick.Plugins.HeaderButtons
    * @constructor
    */
    function HeaderButtons(options) {
        var _grid;
        var _self = this;
        var _handler = new Slick.EventHandler();
        var _defaults = {
            buttonCssClass: "slick-header-button"
        };


        function init(grid) {
            options = $.extend(true, {}, _defaults, options);
            _grid = grid;
            _handler
        .subscribe(_grid.onHeaderCellRendered, handleHeaderCellRendered)
        .subscribe(_grid.onBeforeHeaderCellDestroy, handleBeforeHeaderCellDestroy);

            // Force the grid to re-render the header now that the events are hooked up.
            _grid.setColumns(_grid.getColumns());
        }


        function destroy() {
            _handler.unsubscribeAll();
        }


        function handleHeaderCellRendered(e, args) {
            var column = args.column;

            if (column.header && column.header.buttons) {
                // Append buttons in reverse order since they are floated to the right.
                var i = column.header.buttons.length;
                while (i--) {
                    var button = column.header.buttons[i];
                    var btn = $("<div></div>")
            .addClass(options.buttonCssClass)
            .data("column", column)
            .data("button", button);

                    if (button.showOnHover) {
                        btn.addClass("slick-header-button-hidden");
                    }

                    if (button.image) {
                        btn.css("backgroundImage", "url(" + button.image + ")");
                    }

                    if (button.cssClass) {
                        btn.addClass(button.cssClass);
                    }

                    if (button.tooltip) {
                        btn.attr("title", button.tooltip);
                    }

                    if (button.command) {
                        btn.data("command", button.command);
                    }

                    if (button.handler) {
                        btn.bind("click", button.handler);
                    }

                    btn
            .bind("click", handleButtonClick)
            .appendTo(args.node);
                }
            }
        }


        function handleBeforeHeaderCellDestroy(e, args) {
            var column = args.column;

            if (column.header && column.header.buttons) {
                // Removing buttons via jQuery will also clean up any event handlers and data.
                // NOTE: If you attach event handlers directly or using a different framework,
                //       you must also clean them up here to avoid memory leaks.
                $(args.node).find("." + options.buttonCssClass).remove();
            }
        }


        function handleButtonClick(e) {
            var command = $(this).data("command");
            var columnDef = $(this).data("column");
            var button = $(this).data("button");

            if (command != null) {
                _self.onCommand.notify({
                    "grid": _grid,
                    "column": columnDef,
                    "command": command,
                    "button": button
                }, e, _self);

                // Update the header in case the user updated the button definition in the handler.
                _grid.updateColumnHeader(columnDef.id);
            }

            // Stop propagation so that it doesn't register as a header click event.
            e.preventDefault();
            e.stopPropagation();
        }

        $.extend(this, {
            "init": init,
            "destroy": destroy,

            "onCommand": new Slick.Event()
        });
    }
})(jQuery);

// #endregion

// #region Slick.Data.RemoteModelSelf

(function ($) {
    function RemoteModel() {
        // private
        var data = { length: 0 };
        var pageSize = 0;
        var pageIndex = 0;
        var pageCount = 0;
        var totalCount = 0;

        // events
        var onPagingInfoChanged = new Slick.Event();

        function clear() {
            for (var key in data) {
                delete data[key];
            }
            data.length = 0;
        }

        function dataLoaded(val) {
            clear();
            data.length = val.currentPageData.length;
            for (var i = 0; i < val.currentPageData.length; i++) {
                data[i] = val.currentPageData[i];
            }
            this.setPagingOptions({ pageSize: val.pageSize, pageIndex: val.pageIndex, pageCount: val.pageCount, totalCount: val.totalCount });
        }

        function setPagingOptions(args) {
            if (args.pageSize != undefined) {
                pageSize = args.pageSize;
            }
            if (args.pageIndex != undefined) {
                pageIndex = args.pageIndex;
            }
            if (args.pageCount != undefined) {
                pageCount = args.pageCount;
            }
            if (args.totalCount != undefined) {
                totalCount = args.totalCount;
            }
            onPagingInfoChanged.notify(getPagingInfo(), null, self);
        }

        function getPagingInfo() {
            return { pageSize: pageSize, pageIndex: pageIndex, pageCount: pageCount, totalCount: totalCount };
        }

        return {
            // properties
            "data": data,

            // methods
            "clear": clear,
            "dataLoaded": dataLoaded,
            "setPagingOptions": setPagingOptions,
            "getPagingInfo": getPagingInfo,

            // events
            "onPagingInfoChanged": onPagingInfoChanged
        };
    }

    // Slick.Data.RemoteModelSelf
    $.extend(true, window, { Slick: { Data: { RemoteModelSelf: RemoteModel}} });
})(jQuery);

// #endregion

// #region cb.controls.SlickGrid

cb.controls.SlickGrid = SlickGrid = function (element, opts) {
    var options;
    var screenSize = opts && opts["screenSize"];
    if (screenSize == "S") {
        options = {
            rowHeight: 100,
            editable: false,
            enableAddRow: false,
            enableCellNavigation: true,
            enableColumnReorder: false
        };
    }
    else {
        options = {
            editable: true,
            enableAddRow: false,
            enableCellNavigation: true,
            forceFitColumns: false,
            topPanelHeight: 25,
            asyncEditorLoading: true,
            
        };
    }

    // Simple JavaScript Templating
    // John Resig - http://ejohn.org/ - MIT Licensed
    (function () {
        var cache = {};

        this.tmpl = function tmpl(str, data) {
            // Figure out if we're getting a template, or if we need to
            // load the template - and be sure to cache the result.
            var fn = !/\W/.test(str) ?
          cache[str] = cache[str] ||
          tmpl(document.getElementById(str).innerHTML) :

            // Generate a reusable function that will serve as a template
            // generator (and which will be cached).
        new Function("obj",
            "var p=[],print=function(){p.push.apply(p,arguments);};" +

            // Introduce the data as local variables using with(){}
            "with(obj){p.push('" +

            // Convert the template into pure JavaScript
              str
                  .replace(/[\r\t\n]/g, " ")
                  .split("<%").join("\t")
                  .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                  .replace(/\t=(.*?)%>/g, "',$1,'")
                  .split("\t").join("');")
                  .split("%>").join("p.push('")
                  .split("\r").join("\\'") + "');}return p.join('');");

            // Provide some basic currying to the user
            return data ? fn(data) : fn;
        };
    })();

    this.setData = function (data) {
        if (!data) return;
        for (var attr in data) {
            if (attr != "Mode") continue;
            this.setGridDataMode(data[attr]);
        }
        if (!this._mode) {
            throw "需要设置Grid的数据模式：本地/远程";
        }
        for (var attr in data) {
            if (attr == "Mode") continue;
            var method = "set" + attr;
            if (this[method]) this[method](data[attr]);
        }
    };

    this.setFixed = function (args) {
        if (typeof args == "boolean") {
            this._grid.resizeCanvas();
            return;
        }
        var tab = $("#" + element).closest("[data-content='" + args + "']");
        if (!tab.length) return;
        this._grid.resizeCanvas();
    };

    this.setGridDataMode = function (mode) {
        this._mode = mode.toLowerCase();
        if (this._mode == "remote") {
            $("#" + element).addClass("grid-remote");
            this._dataLoader = new Slick.Data.RemoteModelSelf(this);
            this._grid = new Slick.Grid("#" + element, this._dataLoader.data, [], options);
            this._header = new Slick.Controls.Header(this, $("#" + element + "_header"));
            var $pager = $("#" + element + "_pager");
            if (!$pager.length) $pager = $("#" + element).parent().find(".grid-pager");
            if ($pager.length) this._pager = new Slick.Controls.PagerRemote(this, $pager);

            /*var grid = this._grid;
            this._dataLoader.onPagingInfoChanged.subscribe(function (e, pagingInfo) {
            var isLastPage = pagingInfo.pageNum == pagingInfo.totalPages - 1;
            var enableAddRow = isLastPage || pagingInfo.pageSize == 0;
            var options = grid.getOptions();

            if (options.enableAddRow != enableAddRow) {
            grid.setOptions({ enableAddRow: enableAddRow });
            }
            });*/

            this.setHidden();
        }
        else {
            var groupItemMetadataProvider = new Slick.Data.GroupItemMetadataProvider();
            this._dataView = new Slick.Data.DataView(this, {
                groupItemMetadataProvider: groupItemMetadataProvider,
                inlineFilters: true
            });
            this._grid = new Slick.Grid("#" + element, this._dataView, [], options);
            this._grid.registerPlugin(groupItemMetadataProvider);
            this._header = new Slick.Controls.Header(this, $("#" + element + "_header"));
            var $pager = $("#" + element + "_pager");
            if (!$pager.length) $pager = $("#" + element).parent().find(".grid-pager");
            if ($pager.length) this._pager = new Slick.Controls.Pager(this, $pager);

            var grid = this._grid;

            // wire up model events to drive the grid
            this._dataView.onRowCountChanged.subscribe(function (e, args) {
                grid.updateRowCount();
                grid.render();
            });

            this._dataView.onRowsChanged.subscribe(function (e, args) {
                grid.invalidateRows(args.rows);
                grid.render();
            });

            /*this._dataView.onPagingInfoChanged.subscribe(function (e, pagingInfo) {
            var isLastPage = pagingInfo.pageNum == pagingInfo.totalPages - 1;
            var enableAddRow = isLastPage || pagingInfo.pageSize == 0;
            var options = grid.getOptions();

            if (options.enableAddRow != enableAddRow) {
            grid.setOptions({ enableAddRow: enableAddRow });
            }
            });*/

            var dataView = this._dataView;
            var headerButtonsPlugin = new Slick.Plugins.HeaderButtons(this);
            headerButtonsPlugin.onCommand.subscribe(function (e, args) {
                var column = args.column;
                var button = args.button;
                var command = args.command;

                if (command == "toggle-grouping") {
                    if (button.cssClass == "icon-grouping-on") {
                        button.cssClass = "icon-grouping-off";
                        button.tooltip = "设置分组";
                        dataView.setGrouping([]);
                    } else {
                        button.cssClass = "icon-grouping-on";
                        button.tooltip = "取消分组";
                        dataView.setGrouping({
                            getter: column.id,
                            formatter: function (g) {
                                var val;
                                if (column.columnType == "Refer") {
                                    if (g.rows.length == 0) throw "合计行数必须大于0";
                                    val = g.rows[0][column["refColumn"]["nameFld"]];
                                }
                                else {
                                    val = g.value;
                                }
                                return column.name + ":  " + val + "  <span style='color:green'>(" + g.count + " 行)</span>";
                            }
                        });
                    }
                }
            });
            this._grid.registerPlugin(headerButtonsPlugin);

            if (screenSize == "S") {
                this.setHidden();
            }
        }
        this._grid.setSelectionModel(new Slick.RowSelectionModel());
        this._grid.onKeyDown.subscribe(function (e) {
            // select all rows on ctrl-a
            if (e.which != 65 || !e.ctrlKey) {
                return false;
            }

            var rows = [];
            for (var i = 0; i < dataView.getLength(); i++) {
                rows.push(i);
            }

            grid.setSelectedRows(rows);
            e.preventDefault();
        });
    }

    this.setColumns = function (val) {
        if (screenSize == "S") {
            var column = {};
            column["id"] = element;
            column["name"] = element;
            var count = 0;
            for (var index in val) {
                var visible = val[index]["visible"] == undefined ? true : val[index]["visible"];
                if (visible != true) {
                    continue;
                }
                count++;
            }
            var height = count * 25;
            this._grid.setOptions({ rowHeight: height + 20 });
            var cellTemplate = "<div class=\"cell-inner\" style=\"height: " + height + "px;\"><div class=\"cell-left\"></div><div class=\"cell-main\">";
            var iter = 0;
            for (var index in val) {
                var visible = val[index]["visible"] == undefined ? true : val[index]["visible"];
                if (visible != true) {
                    continue;
                }
                var title = val[index]["header"];
                var columnIndex = index;
                if (val[index]["columnType"] == "Refer") {
                    columnIndex = val[index]["refColumn"]["nameFld"];
                }
                if (iter == 0) {
                    cellTemplate += "<b>" + title + ": <%=" + columnIndex + "%></b><br/>";
                }
                else if (iter == count - 1) {
                    cellTemplate += title + ": <%=" + columnIndex + "%>";
                }
                else {
                    cellTemplate += title + ": <%=" + columnIndex + "%><br/>";
                }
                iter++;
            }
            cellTemplate += "</div></div>";
            column["formatter"] = function (row, cell, value, columnDef, dataContext) {
                return tmpl(cellTemplate)(dataContext);
            };
            column["width"] = 500;
            column["cssClass"] = "contact-card-cell";
            this._grid.setColumns([column]);
            return;
        }
        var checkboxSelector = new Slick.CheckboxSelectColumn({
            cssClass: "slick-cell-checkboxsel"
        });
        this._grid.registerPlugin(checkboxSelector);
        var columns = [];
        var visibleColumns = [];
        columns.push(checkboxSelector.getColumnDefinition());
        visibleColumns.push(checkboxSelector.getColumnDefinition());
        for (var index in val) {
            var column = val[index];
            var newColumn = {};
            newColumn["id"] = index;
            newColumn["name"] = column["title"] || "#";
            newColumn["field"] = index;
            newColumn["cssClass"] = column["cssClass"];
            newColumn["width"] = column["width"] || 150;
            newColumn["minWidth"] = column["minWidth"];
            newColumn["maxWidth"] = column["maxWidth"];
            newColumn["resizable"] = column["resizable"] || true;
            newColumn["selectable"] = column["selectable"] || true;

            if (this._mode == "remote") {
                newColumn["sortable"] = column["sortable"] || false;
            }
            else {
                newColumn["sortable"] = column["sortable"] || true;
            }

            newColumn["validator"] = column["validator"];

            newColumn["columnType"] = column["ctrlType"];

            var editor = Slick.Editors[column["ctrlType"]];
            if (!editor) {
                newColumn["editor"] = Slick.Editors.TextBox;
            }
            else {
                newColumn["editor"] = editor;
            }

            if (column["format"]) {
                var formatter;
                if (column["format"].toLowerCase() == "color") {
                    formatter = Slick.Formatters.Color;
                }
                if (formatter) {
                    newColumn["formatter"] = formatter;
                }
            }
            else {
                var formatter = Slick.Formatters[column["ctrlType"]];
                if (formatter) {
                    newColumn["formatter"] = formatter;
                }
            }

            if (column["ctrlType"] == "ComboBox") {
                newColumn["dataSource"] = column["dataSource"];
            }
            else if (column["ctrlType"] == "Refer") {
                newColumn["refKey"] = column["refKey"];
                newColumn["refCode"] = column["refCode"];
                newColumn["refName"] = column["refName"];
                newColumn["refId"] = column["refId"];
                newColumn["refShowMode"] = column["refShowMode"];
            }
            else if (column["ctrlType"] == "NumberBox") {
                newColumn["precision"] = column["precision"];
                newColumn["scale"] = column["scale"];
            }

            newColumn["visible"] = column["visible"] == undefined ? true : column["visible"];
            if (this._mode != "remote") {
                newColumn["header"] = {
                    buttons: [
                    {
                        cssClass: "icon-grouping-off",
                        command: "toggle-grouping",
                        tooltip: "设置分组/取消分组"
                    }
                ]
                };
            }

            columns.push(newColumn);
            if (newColumn["visible"] == true) {
                visibleColumns.push(newColumn);
            }
        }
        if (this._mode != "remote") {
            new Slick.Controls.ColumnPicker(columns, this._dataView, this._grid, options);
            new Slick.Controls.Filter(columns, this._dataView, this._grid, options);
        }
        this._grid.setColumns(visibleColumns);
    };
    //设置grid全屏
    this.setFullScreen = function (args) {
        debugger;
        var el = $("#" + element);
        var bodyToolBar = el.parent().prev();
        var fullButtonLi = bodyToolBar.children("li").last();
        var span = fullButtonLi.children().children("span").last();

        var headDiv = el.parent().parent().prev();
        if (args)
        {
            headDiv.hide();
            span.text("退出全屏");
        } else {
            headDiv.show();
            span.text("全屏");
        }
    };

    this.setRows = function (val) {
        if (this._mode != "remote") {
            this._dataView.beginUpdate();
            this._dataView.setItems(val);
            this._dataView.endUpdate();
            this._dataView.syncGridSelection(this._grid, true);
        }
        this._grid.setSelectedRows([]);
        this._grid.invalidate();
    };

    this.setCellValueChange = this.setSort = this.setInsert = this.setRemove = function () {
        if (this._mode != "remote") {
            this._dataView.refresh();
        }
        this._grid.invalidate();
    };

    this.setStateChange = function (data) {
        if (!data.PropertyName) {
            return;
        }
        if (this["set" + data.PropertyName]) {
            this["set" + data.PropertyName](data.Value);
        }
    };

    this.setReadOnly = function (readonly) {
        this._grid.setOptions({ editable: !readonly });
        if (this._mode != "remote") {
            this._header.setDisabled(readonly);
        }
    }

    this.getReadOnly = function () {
        var editable = this._grid.getOptions().editable;
        return !editable;
    }

    this.setSelect = function (rows) {
        var modelSelectStr = rows.join(",");
        var controlSelectStr = this.getSelectedRows().join(",");
        if (modelSelectStr == controlSelectStr) return;
        this.setSelectedRows(rows);
    }

    this.setSelectedRows = function (rows) {
        this._grid.setSelectedRows(rows);
    }

    this.getSelectedRows = function () {
        return this._grid.getSelectedRows();
    }

    this.triggerSetCollapsed = function (collapsed) {
        this._header.setCollapsed(collapsed);
        if (collapsed) {
            $("#" + element).addClass("grid-display-none");
            $("#" + element + "_pager").addClass("grid-display-none");
        }
        else {
            $("#" + element).removeClass("grid-display-none");
            $("#" + element + "_pager").removeClass("grid-display-none");
        }
    }

    this.setHidden = function () {
        this._header.setHidden();
    }

    this.triggerAddNewRow = function (rowIndex) {
        var addNewRowEvents = this._events["onAddNewRow"];
        if (!addNewRowEvents || addNewRowEvents.length == 0) return;
        for (var i = 0; i < addNewRowEvents.length; i++) {
            var e = new Slick.EventData();
            var args = {
                rowIndex: rowIndex
            };
            addNewRowEvents[i](e, args);
        }
    }

    this.triggerDeleteRows = function (rowIndexes) {
        var deleteRowsEvents = this._events["onDeleteRows"];
        if (!deleteRowsEvents || deleteRowsEvents.length == 0) return;
        for (var i = 0; i < deleteRowsEvents.length; i++) {
            var e = new Slick.EventData();
            var args = {
                rowIndexes: rowIndexes
            };
            deleteRowsEvents[i](e, args);
        }
    }

    this.triggerShowCardView = function () {
        var showCardViewEvents = this._events["onShowCardView"];
        if (!showCardViewEvents || showCardViewEvents.length == 0) return;
        for (var i = 0; i < showCardViewEvents.length; i++) {
            var e = new Slick.EventData();
            var args = {};
            showCardViewEvents[i](e, args);
        }
    }

    this.showCardView = function (model3d) {
        cb.biz.bill.showEditRowApp(model3d.getParent(), "open");
    }

    var loadingIndicator = null;

    this.triggerChangePage = function (obj) {
        this._dataLoader.clear();
        this._grid.invalidate();
        if (!loadingIndicator) {
            loadingIndicator = $("<span class='loading-indicator'><label>加载中...</label></span>").appendTo(document.body);
            var $g = $("#" + element);

            loadingIndicator
                .css("position", "absolute")
                .css("top", $g.position().top + $g.height() / 2 - loadingIndicator.height() / 2)
                .css("left", $g.position().left + $g.width() / 2 - loadingIndicator.width() / 2);
        }

        loadingIndicator.show();
        var changePageEvents = this._events["onChangePage"];
        if (!changePageEvents || changePageEvents.length == 0) return;
        for (var i = 0; i < changePageEvents.length; i++) {
            var e = new Slick.EventData();
            var args = { pageSize: obj.pageSize, pageIndex: obj.pageIndex };
            changePageEvents[i](e, args);
        }
    }

    this.setPageRows = function (val) {
        this.setFixed(true);
        this._dataLoader.dataLoaded(val);
        this._grid.setSelectedRows([]);
        this._grid.invalidate();
        if (loadingIndicator) {
            loadingIndicator.fadeOut();
        }
    }

    this._events = {};

    this.on = function (eventName, func, context) {
        var newFunc;
        switch (eventName) {
            case "onCellChange":
                newFunc = function (e, args) {
                    func.call(context, args.rowIndex, args.cellName, args.cellValue);
                };
                break;
            case "onSort":
                newFunc = function (e, args) {
                    var newArgs = {};
                    newArgs["field"] = args.sortCol.field;
                    newArgs["direction"] = args.sortAsc ? "up" : "down";
                    func.call(context, newArgs);
                };
                break;
            case "onSelectedRowsChanged":
                newFunc = function (e, args) {
                    func.call(context, args.rows);
                };
                break;
            case "onAddNewRow":
                newFunc = function (e, args) {
                    func.call(context, args.rowIndex);
                };
                break;
            case "onDeleteRows":
                newFunc = function (e, args) {
                    func.call(context, args.rowIndexes);
                };
                break;
            case "onShowCardView":
                newFunc = function (e, args) {
                    func.call(context);
                };
                break;
            case "onCellEditorLoad":
                newFunc = function (e, args) {
                    func.call(context, args.column, args.controlId);
                };
                break;
            case "onCellEditorDestroy":
                newFunc = function (e, args) {
                    func.call(context, args.controlId);
                };
                break;
            case "onChangePage":
                newFunc = function (e, args) {
                    func.call(context, args.pageSize, args.pageIndex);
                };
                break;
            case "onActiveRowClick":
                eventName = "onDblClick";
                newFunc = function (e, args) {
                    func.call(context, args);
                };
                break;
        }
        if (!newFunc) return;
        this._events[eventName] = this._events[eventName] || [];
        this._events[eventName].push(newFunc);
        var nativeEvent = this._grid[eventName];
        if (!nativeEvent) return;
        nativeEvent.subscribe(newFunc);
    };

    this.un = function (eventName) {
        var wrapperEvent = this._events[eventName];
        if (!wrapperEvent) return;
        this._events[eventName] = null;
        var nativeEvent = this._grid[eventName];
        if (!nativeEvent) return;
        for (var i = 0; i < wrapperEvent.length; i++) {
            nativeEvent.unsubscribe(wrapperEvent[i]);
        }
    };
};
//cb.controls.DataGrid = cb.controls.SlickGrid;

// #endregion