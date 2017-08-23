/// <reference path="../Control.js" />
cb.controls.widget("CheckTextBox", function (controlType) {
    var control = function (id, options) {
        cb.controls.Control.call(this, id, options);
        this.getElement().on("change", this, function (e, args) {
            e.data.execute("change", e.data.getValue());
            // change时非空校验
            e.data.execute("validate",e.data.validate(e.data.getValue()));
        });
    };
    control.prototype = new cb.controls.Control();
    control.prototype.controlType = controlType;

    control.prototype.setInit = function (data) {
        var self = this;
        this.getElement().empty();

        var $span = $("<span></span>");
        if (data.hasOwnProperty('hasCheck')) {
            $span = $("<span class=\"col-lg-1 "+(data.filterMeta.isSelected ? 'checked' : 'unchecked') +"\"></span>");
        }

        $span.data("isRequired", data.filterMeta.isRequired).on('click', function (e) {
            if ($(this).data('isRequired') == true)
                return;
            self.setActive($(this));
        });
        var operator = data.operator;
        // 把原始数据缓存起来
        $span.data("original_data",data);  
        $span.data("ctrl_data", { fieldCode: data.filterMeta.fieldCode, fieldName: data.filterMeta.fieldName, ctrl: data.filterMeta.fieldType, operator: operator }).appendTo(this.getElement());
        var $label = $("<label class=\"col-lg-3\" title=\"" + data.filterMeta.fieldName + "\">"+ data.filterMeta.fieldName + "</label>");
        if (data.filterMeta.hasOwnProperty('isTitle') && data.filterMeta.isTitle == true) {
            $label.addClass("ui-title");
        }
        $label.appendTo(this.getElement());
        var defauleValue = this.setControlData(data);
        this.setInput(data.filterMeta.fieldCode, operator, data.filterMeta.fieldType, defauleValue, data.filterMeta.isTitle, data.hasOwnProperty('hasCheck'));
    };

    control.prototype.setControlData = function (val) {
        var defaultValue = {};
        switch (val.filterMeta.fieldType) {
            case "Refer":
                defaultValue.refId = val.filterMeta.fieldMDValue;
                defaultValue.refKey = val.filterMeta.refPkField;
                defaultValue.refCode = val.filterMeta.refCodeField;
                defaultValue.refName = val.filterMeta.refNameField;
                if (val.fieldValue && val.fieldValue.length) {
                    defaultValue.value = val.fieldValue[0].sqlString;
                    defaultValue.name = val.fieldValue[0].showString;
                }
                break;
            case "ComboBox":
                var dataSource = val.filterMeta.fieldMDValue.split(',');
                var arrdatasource = new Array();
                for (var i = 0; i < dataSource.length; i++) {
                    var attrValue = dataSource[i].split(':');
                    arrdatasource.push({ text: attrValue[1], value: attrValue[0] });
                }
                defaultValue.dataSource = arrdatasource;
                if (val.fieldValue && val.fieldValue.length) {
                    defaultValue.value = val.fieldValue[0].sqlString;
                }
                break;
            case "DateTimeBox":
                if (val.operator == 'between')
                    defaultValue = val.fieldValue && val.fieldValue.length ? { start: val.fieldValue[0].sqlString, end: val.fieldValue[1].sqlString} : null;
                else
                    defaultValue = val.fieldValue && val.fieldValue.length ? val.fieldValue[0].sqlString : null;
                break;
            case "DateBox":
                if (val.operator == 'between')
                    defaultValue = val.fieldValue && val.fieldValue.length ? { start: (val.fieldValue[0].expression==""||val.fieldValue[0].expression==null)?val.fieldValue[0].sqlString:val.fieldValue[0].expression, end: (val.fieldValue[1].expression==""||val.fieldValue[1].expression==null)?val.fieldValue[1].sqlString:val.fieldValue[1].expression} : null;
                else
                    defaultValue = val.fieldValue && val.fieldValue.length ? ((val.fieldValue[0].expression==""||val.fieldValue[0].expression==null)?val.fieldValue[0].sqlString:val.fieldValue[0].expression) : null;
                break;
            default:
                if (val.operator == 'between')
                    defaultValue = val.fieldValue && val.fieldValue.length ? { start: val.fieldValue[0].sqlString, end: val.fieldValue[1].sqlString} : null;
                else
                    defaultValue = val.fieldValue && val.fieldValue.length ? { start: val.fieldValue[0].sqlString} : null;
                break;
        }
        return defaultValue;
    };

    control.prototype.setInput = function (fieldName, operator, ctrltype, defaultValue, isTitle, hasCheck) {
        var ctrlArray = new Array();
        this._set_data("ctrlArray", ctrlArray);
        var ctrlStr = "";
        var id = this._get_data("id");
        var ctrlBaseId =(id + "_" + fieldName + "_" + ctrltype).replace(/\./g,'_');
        switch (ctrltype) {
            case "TextBox":
                if (operator == 'between') {
                    ctrlStr = "<div class=\"" + (hasCheck ? "col-lg-3" : "col-lg-4") + " p-0\"><input  id=\"" + ctrlBaseId + "_Start\" class='TextBox' type=\"text\" /></div>" +
                        "<span class=\"col-lg-1  p-0\">到</span><div class=\"" + (hasCheck ? "col-lg-3" : "col-lg-4") + " p-0\"><input id=\"" + ctrlBaseId + "_End\" class='TextBox' type=\"text\" /></div>";

                } else {
                    if (isTitle == true)
                        ctrlStr = "<div class=\"" + (hasCheck ? "col-lg-3" : "col-lg-4") + " p-0\"><input id=\"" + ctrlBaseId + "_Start\" class='TextBox' type=\"text\" style=\"width:100%;\" /></div>";
                    else
                        ctrlStr = "<div class=\"" + (hasCheck ? "col-lg-3" : "col-lg-4") + " p-0\"><input id=\"" + ctrlBaseId + "_Start\" class='TextBox' type=\"text\" /></div>";
                }
                $(ctrlStr).appendTo(this.getElement());
                if (operator == 'between') ctrlArray.push({
                    key: ctrlBaseId + "_End",
                    value: new cb.controls.TextBox(ctrlBaseId + "_End", defaultValue == null ? { value: ""} : { value: defaultValue.end })
                });
                ctrlArray.push({
                    key: ctrlBaseId + "_Start",
                    value: new cb.controls.TextBox(ctrlBaseId + "_Start", defaultValue == null ? { value: ""} : { value: defaultValue.start })
                });
                break;
            case "Refer":
                if (operator == 'between') {
                    ctrlStr = "<div class=\"" + (hasCheck ? "col-lg-3" : "col-lg-4") + " p-0\"><div class=\"col-lg-12 p-0 Refer\" data-controltype=\"Refer\" id=\"" + ctrlBaseId + "_Start\"><input type=\"text\" /><div><img src=\"pc/images/Ref-close.png\" /><img src=\"pc/images/Ref.png\" /></div></div></div>" +
                        "<span class=\"col-lg-1  p-0\">到</span><div class=\"" + (hasCheck ? "col-lg-3" : "col-lg-4") + " p-0\"><div class=\"col-lg-12 p-0 Refer\" id=\"" + ctrlBaseId + "_Start\"><input type=\"text\" /><div><img src=\"pc/images/Ref-close.png\" /><img src=\"pc/images/Ref.png\" /></div></div></div>";
                } else {
                    ctrlStr = "<div class=\"" + (hasCheck ? "col-lg-3" : "col-lg-4") + " p-0\"><div class=\"col-lg-12 p-0 Refer\" data-controltype=\"Refer\" id=\"" + ctrlBaseId + "_Start\"><input type=\"text\" /><div><img src=\"pc/images/Ref-close.png\" /><img src=\"pc/images/Ref.png\" /></div></div></div>";
                }
                $(ctrlStr).appendTo(this.getElement());
                if (operator == 'between') {
                    var refer_end = new cb.controls.Refer(ctrlBaseId + "_End", defaultValue);
                    refer_end.on("change", function (e, args) {
                        this.execute("change", this.getValue());
                    }, this);
                    ctrlArray.push({
                        key: ctrlBaseId + "_End",
                        value: refer_end
                    });
                }
                var refer_start = new cb.controls.Refer(ctrlBaseId + "_Start", defaultValue);
                refer_start.on("change", function (e, args) {
                    this.execute("change", this.getValue());
                }, this);
                ctrlArray.push({
                    key: ctrlBaseId + "_Start",
                    value: refer_start
                });
                break;
            case "DateTimeBox":
                if (operator == 'between') {
                    ctrlStr = "<div class=\"" + (hasCheck ? "col-lg-3" : "col-lg-4") + " p-0\"><input  id=\"" + ctrlBaseId + "_Start\" /></div>" +
                        "<span class=\"col-lg-1  p-0\">到</span><div class=\"" + (hasCheck ? "col-lg-3" : "col-lg-4") + " p-0\"><input id=\"" + ctrlBaseId + "_End\" /></div>";

                } else {
                    ctrlStr = "<div class=\"" + (hasCheck ? "col-lg-3" : "col-lg-4") + " p-0\"><input id=\"" + ctrlBaseId + "_Start\" /></div>";
                }
                $(ctrlStr).appendTo(this.getElement());
                if (operator == 'between')
                    ctrlArray.push({
                        key: ctrlBaseId + "_End",
                        value: new cb.controls.DateTimeBox(ctrlBaseId + "_End", defaultValue == null ? { value: "@SYSDATE"} : { value: defaultValue.end })
                    });
                ctrlArray.push({
                    key: ctrlBaseId + "_Start",
                    value: new cb.controls.DateTimeBox(ctrlBaseId + "_Start", defaultValue == null ? { value: "@SYSDATE"} : { value: defaultValue.start })
                });
                break;
            case "DateBox":
                if (operator == 'between') {
                    ctrlStr = "<div class=\"" + (hasCheck ? "col-lg-3" : "col-lg-4") + " p-0\"><input  id=\"" + ctrlBaseId + "_Start\" /></div>" +
                        "<span class=\"col-lg-1  p-0\">到</span><div class=\"" + (hasCheck ? "col-lg-3" : "col-lg-4") + " p-0\"><input id=\"" + ctrlBaseId + "_End\" /></div>";

                } else {
                    ctrlStr = "<div class=\"" + (hasCheck ? "col-lg-3" : "col-lg-4") + " p-0\"><input id=\"" + ctrlBaseId + "_Start\" /></div>";
                }
                $(ctrlStr).appendTo(this.getElement());
                if (operator == 'between')
                    ctrlArray.push({
                        key: ctrlBaseId + "_End",
                        value: new cb.controls.DateBoxFx(ctrlBaseId + "_End", defaultValue == null ? { value: "@SYSDATE"} : { value: defaultValue.end })
                    });
                ctrlArray.push({
                    key: ctrlBaseId + "_Start",
                    value: new cb.controls.DateBoxFx(ctrlBaseId + "_Start", defaultValue == null ? { value: "@SYSDATE"} : { value: defaultValue.start })
                });
                break;
            case "MoneyBox":
                if (operator == 'between') {
                    ctrlStr = "<div class=\"" + (hasCheck ? "col-lg-3" : "col-lg-4") + " p-0\"><input  id=\"" + ctrlBaseId + "_Start\" type=\"text\" /></div>" +
                        "<span class=\"col-lg-1  p-0\">到</span><div class=\"" + (hasCheck ? "col-lg-3" : "col-lg-4") + " p-0\"><input id=\"" + ctrlBaseId + "_End\" type=\"text\" /></div>";
                } else {
                    ctrlStr = "<div class=\"" + (hasCheck ? "col-lg-3" : "col-lg-4") + " p-0\"><input id=\"" + ctrlBaseId + "_Start\" type=\"text\" /></div>";
                }
                $(ctrlStr).appendTo(this.getElement());
                if (operator == 'between')
                    ctrlArray.push({
                        key: ctrlBaseId + "_End",
                        value: new cb.controls.NumberBox(ctrlBaseId + "_End", defaultValue == null ? {value: ""} : { value: defaultValue.end })
                    });
                ctrlArray.push({
                    key: ctrlBaseId + "_Start",
                    value: new cb.controls.NumberBox(ctrlBaseId + "_Start", defaultValue == null ? {value: ""} : { value: defaultValue.start })
                });
                break;
            case "NumberBox":
                if (operator == 'between') {
                    ctrlStr = "<div class=\"" + (hasCheck ? "col-lg-3" : "col-lg-4") + " p-0\"><div class =\"col-lg-12 p-0\"  id=\"" + ctrlBaseId + "_Start\"><input type=\"text\" /></div></div>" +
                        "<span class=\"col-lg-1  p-0\">到</span><div class=\"" + (hasCheck ? "col-lg-3" : "col-lg-4") + " p-0\"><div class =\"col-lg-12 p-0\"  id=\"" + ctrlBaseId + "_End\"><input type=\"text\" /></div></div>";

                } else {
                    ctrlStr = "<div class=\"" + (hasCheck ? "col-lg-3" : "col-lg-4") + " p-0\"><div class =\"col-lg-12 p-0\"  id=\"" + ctrlBaseId + "_Start\"><input type=\"text\" /></div></div>";
                }
                $(ctrlStr).appendTo(this.getElement());
                if (operator == 'between')
                    ctrlArray.push({
                        key: ctrlBaseId + "_End",
                        value: new cb.controls.NumberBox(ctrlBaseId + "_End", defaultValue)
                    });
                ctrlArray.push({
                    key: ctrlBaseId + "_Start",
                    value: new cb.controls.NumberBox(ctrlBaseId + "_Start", defaultValue)
                });
                break;
            case "ComboBox":
                if (operator == 'between') {
                    ctrlStr = "<div class=\"" + (hasCheck ? "col-lg-3" : "col-lg-4") + " p-0\"><div id=\"" + ctrlBaseId + "_Start\"><input type=\"text\" /></div></div>" +
                        "<span class=\"col-lg-1  p-0\">到</span><div class=\"" + (hasCheck ? "col-lg-3" : "col-lg-4") + " p-0\"><div id=\"" + ctrlBaseId + "_End\"><input type=\"text\" /></div></div>";
                } else {
                    ctrlStr = "<div class=\"" + (hasCheck ? "col-lg-3" : "col-lg-4") + " p-0\"><div id=\"" + ctrlBaseId + "_Start\"><input type=\"text\" /></div></div>";
                }
                $(ctrlStr).appendTo(this.getElement());
                if (operator == 'between')
                    ctrlArray.push({
                        key: ctrlBaseId + "_End",
                        value: new cb.controls.ComboBox(ctrlBaseId + "_Start", defaultValue)
                    });
                ctrlArray.push({
                    key: ctrlBaseId + "_Start",
                    value: new cb.controls.ComboBox(ctrlBaseId + "_Start", defaultValue)
                });
                break;
             case "CheckBox":
             	if (operator == 'between') {
                    ctrlStr = "<div class=\"" + (hasCheck ? "col-lg-3" : "col-lg-4") + " p-0\"><div id=\"" + ctrlBaseId + "_Start\"><input type=\"checkbox\" /></div></div>" +
                        "<span class=\"col-lg-1\">到</span><div class=\"" + (hasCheck ? "col-lg-3" : "col-lg-4") + " p-0 m-t-10\"><div id=\"" + ctrlBaseId + "_End\"><input type=\"checkbox\" /></div></div>";
                } else {
                    ctrlStr = "<div class=\"" + (hasCheck ? "col-lg-3" : "col-lg-4") + " p-0 m-t-10\"><div id=\"" + ctrlBaseId + "_Start\"><input type=\"checkbox\" /></div></div>";
                }
                $(ctrlStr).appendTo(this.getElement());
                if (operator == 'between')
                    ctrlArray.push({
                        key: ctrlBaseId + "_End",
                        value: new cb.controls.CheckBox(ctrlBaseId + "_Start", defaultValue == null ? { value: false} : { value: defaultValue.end })
                    });
                ctrlArray.push({
                    key: ctrlBaseId + "_Start",
                    value: new cb.controls.CheckBox(ctrlBaseId + "_Start", defaultValue == null ? { value: false} : { value: defaultValue.start })
                });
                break;
            default:
                if (operator == 'between') {
                    ctrlStr = "<div class=\"" + (hasCheck ? "col-lg-3" : "col-lg-4") + " p-0\"><input  id=\"" + ctrlBaseId + +"_Start\" type=\"text\" /></div>" +
                        "<span class=\"col-lg-1\">到</span><div class=\"" + (hasCheck ? "col-lg-3" : "col-lg-4") + " p-0\"><input id=\"" + ctrlBaseId + "_End\" type=\"text\" /></div>";
                } else {
                    ctrlStr = "<div class=\"" + (hasCheck ? "col-lg-3" : "col-lg-4") + " p-0\"><input id=\"" + ctrlBaseId + "_Start\" type=\"text\" /></div>";
                }
                $(ctrlStr).appendTo(this.getElement());
                if (operator == 'between') ctrlArray.push({
                    key: ctrlBaseId + "_End",
                    value: new cb.controls.TextBox(ctrlBaseId + "_End", defaultValue == null ? { value: ""} : { value: defaultValue.end })
                });
                ctrlArray.push({
                    key: ctrlBaseId + "_Start",
                    value: new cb.controls.TextBox(ctrlBaseId + "_Start", defaultValue == null ? { value: ""} : { value: defaultValue.start })
                });
                break;
        }
        return ctrlStr;
    };
         
    control.prototype.getValue = function () {   
        var val = {};
        var ctrlms = this.getElement().children("span:first").data('ctrl_data');
        if (ctrlms) {
            var id = this._get_data("id");
            var ctrlBaseId = (id + "_" + ctrlms.fieldCode + "_" + ctrlms.ctrl).replace(/\./g,'_');
            var originalData = this.getElement().children("span:first").data('original_data');
            val.filterMeta = originalData.filterMeta;
            val.filterMeta.isSelected = this.getChecked() ? true : false;
            val.operator = originalData.operator;
            if (ctrlms.operator == 'between') {
                val.fieldValue = [
                    {
                        sqlString: this.valueHandle(ctrlBaseId + "_Start"),
                        showString: this.showValueHandle(ctrlBaseId + "_Start"),
                        expression: this.expressionHandle(ctrlBaseId + "_Start")
                    },
                	{
                   		sqlString: this.valueHandle(ctrlBaseId + "_End"),
                    	showString: this.showValueHandle(ctrlBaseId + "_End"),
                    	expression: this.expressionHandle(ctrlBaseId + "_End")
                	}];
            }
            else {
                   val.fieldValue = [
                   { 
                   	    sqlString: this.valueHandle(ctrlBaseId + "_Start"),
                        showString: this.showValueHandle(ctrlBaseId + "_Start"),
                        expression: this.expressionHandle(ctrlBaseId + "_Start")
                   	
                   	}];
            }
        }
        else {
            return null;
        }
        return val;
    };

    control.prototype.valueHandle = function (val, type, data) {
        var ctrlArray = this._get_data("ctrlArray");
        var re = null;
        for (var i = 0; i < ctrlArray.length; i++) {
            if (ctrlArray[i].key == val) {
            	var ctrl = ctrlArray[i].value;
            	var ctrlType = ctrl.getControlType();
                if (type && type == 'set')
                    ctrl.setValue(data);
                else{
                	if(ctrlType == "DateBoxFx"){
                		if(ctrl._get_data("isFunc") == "N")
                			re = ctrl.getValue();
                		else 
                			re = "";
                	}else{
	                 	re = ctrl.getValue();	  
                	}
                }
                break;
            }
        }
        return re;
    };
    
    /**
     * 获取控件显示值
     * @param {Object} val 控件id
     */
     control.prototype.showValueHandle = function (val) {
        var ctrlArray = this._get_data("ctrlArray");
        var showValue = null;
        for (var i = 0; i < ctrlArray.length; i++) {
            if (ctrlArray[i].key == val) {
            	var ctrl = ctrlArray[i].value;
            	var ctrlType = ctrl.getControlType();
            	if(ctrlType == "ComboBox" || ctrlType == "Refer"){//显示值
        	 		showValue = ctrl.getText();
        	    }
            	else if(ctrlType == "DateBoxFx"){
            		if(ctrl._get_data("isFunc") == "N")
                		showValue = ctrl.getValue();
                	else 
                		showValue = "";
            	}
                else {// 真实值 
             		showValue = ctrl.getValue();	
                } 
                break;
             }
        }
        return showValue;
    };
    
    /**
     * 获取控件表达式值
     * @param {Object} val 控件id
     */
     control.prototype.expressionHandle = function (val) {
        var ctrlArray = this._get_data("ctrlArray");
        var expression = null;
        for (var i = 0; i < ctrlArray.length; i++) {
            if (ctrlArray[i].key == val) {
            	var ctrl = ctrlArray[i].value;
            	var ctrlType = ctrl.getControlType();
            	if(ctrlType == "DateBoxFx"){
            		if(ctrl._get_data("isFunc") == "N")
                		expression = "";
                	else 
                		expression = ctrl.getValue();
        	    }
                else {
             		expression = null;	
                } 
                break;
             }
        }
        return expression;
    };
      
    //设置是否勾选
    control.prototype.setActive = function (val) {
        if (val.hasClass('checked')) {
            val.removeClass('checked');
            val.addClass('unchecked');
            val.parents('div').removeClass('active')
        }
        else {
            val.removeClass('unchecked');
            val.addClass('checked');
            val.parents('div').addClass('active')
        }
        // 勾选后同步数据
        this.execute("change", this.getValue());
    };
    
    //获取当前项是否被选中
    control.prototype.getChecked = function () {
        if (this.getElement().children('span:first-child').hasClass('checked') == true)
            return true;
        else
            return false;
    };
    
    /*
     * 校验值是否为空 
     */
    control.prototype.validate = function (val) {
    	var result = true;
     	var fieldValue = val.fieldValue;
     	if(!fieldValue || fieldValue.length == 0) {
     		result = false;
     	}
		else {
			for(var i = 0; i < fieldValue.length; i++) {
				if(fieldValue[i].sqlString == null || fieldValue[i].sqlString == "") {
					 result = false;
					 break;
				}
			}
		}
		return result;
    };
    
    control.prototype.getLabel = function () {
        return this.getElement().children("label");
    };
    
    /**
     * 调基础控件setNoinput
     * @param {Object} val
     */
    control.prototype.setNoinput = function (val) {
       var ctrlArray = this._get_data("ctrlArray");
        for (var i = 0; i < ctrlArray.length; i++) {
        	var ctrl = ctrlArray[i].value;
        	if(ctrl.getValue() == null || ctrl.getValue() == "") {
        		ctrl.setNoinput(val);
        	}
        }
    };
    
    /**
     * 设置必输项标示
     * @param {Object} val
     */
     control.prototype.setIsNullable = function (val) {
        var $label = this.getElement().children("label");
        if (!$label.length) return;
        $label.toggleClass("mustinput", !val);
    };
    
    return control;
});