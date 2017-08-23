cb.controls.widget("DateBoxFx", function (controlType) {

	
    var control = function (id, options) {
        cb.controls.DateBox.call(this, id, options);
    };

	control.expressionArr = [{"text":"昨天","value":"#day(-1)#"},{"text":"今天","value":"#day(0)#"},{"text":"明天","value":"#day(1)#"},
							 {"text":"上周","value":"#week(-1)#"},{"text":"本周","value":"#week(0)#"},{"text":"下周","value":"#week(1)#"},
							 {"text":"上月","value":"#month(-1)#"},{"text":"本月","value":"#month(0)#"},{"text":"下月","value":"#month(1)#"},
							 {"text":"上季","value":"#quarter(-1)#"},{"text":"本季","value":"#quarter(0)#"},{"text":"下季","value":"#quarter(1)#"},
							 {"text":"去年","value":"#year(-1)#"},{"text":"今年","value":"#year(0)#"},{"text":"明年","value":"#year(1)#"},
						];
    control.prototype = new cb.controls.DateBox();
    control.prototype.controlType = controlType;
    
    // 设置数据
    control.prototype.setData = function (data) {
    	
        var defaultOptions = { "cubeControl": this,
            // 设置是否只读属性
            "cubeReadOnly": false,
            culture: "zh-CN"
        };

        var myOptions = $.extend(defaultOptions, data);
        this.getElement().kendoDatePicker(myOptions);
        var numberic = this.getElement().data("kendoDatePicker");
        numberic.bind("change", function (e, args) {
        	var cubeControl = this.options.cubeControl;
        	if(cubeControl._get_data("isFunc") == "Y" && !(this.value() instanceof Date)){
        		args = this.options.cubeControl.getValueByText($(cubeControl.getElement()).val());
        		cubeControl.execute("change", args);
        	}
        	else{
	            if (this.value() == null)
	                this.value(null);
	            cubeControl.execute("change", this.value());
        	}
        });
        // 点击日期按钮事件
        numberic._dateIcon.on("click",numberic,function(e, args){
        	e.data.options.cubeControl._set_data("isFunc","N");
        });
        // 输入框失去焦点
        this.getElement().bind("focusout", numberic, function (e, args) {
        	if($(this).data("isFunc") == "Y"){
        		args = e.data.options.cubeControl.getValueByText($(this).val());
        		e.data.options.cubeControl.execute("change", args);
        	}else{
	            if (e.data.value() == null)
	                e.data.value(null);
	            if(e.data.value() != null){
		            e.data.options.cubeControl.execute("change", e.data.value());
	            } 
        	}
        });

        for (var attr in data) {
            var attrUpper = attr.substring(0, 1).toUpperCase() + attr.substring(1);
            if (this["set" + attrUpper]) this["set" + attrUpper](data[attr]);
        }
		// 创建fx图标
    	this.createFxSpan();
    };
    
    /*
     * 创建FxSpan
     */
    control.prototype.createFxSpan = function () {
    	var wrapSpan = this.getElement().parent(".k-picker-wrap").addClass("m-date-wrap-padding-r");
    	this.getElement().next(".k-select").addClass("m-date-select-position");
    	var fxSpan = $("<span class=\"k-select m-date-fx-outer\"><span class=\"m-date-fx\">Fx</span></span>")
    	var oThis = this;
    	fxSpan.bind("click",function(e){
    		oThis.showFxDataPanel();
	    	e.stopPropagation();
    	});
    	this.getElement().parent(".m-date-wrap-padding-r").append(fxSpan);
    	// 创建弹出选择面板
    	oThis.createFxDataPanel();
    };
    
    /*
     * 创建FxDataPanel
     */
    control.prototype.createFxDataPanel = function () {
    	var oThis = this;
    	var $fxDatePanelPick = $("<div id='fx_datapanelpick_"+this.getId()+"' class='fx-datapanelpick'></div>");
    	this._set_data("$fxDatePanelPick", $fxDatePanelPick);
    	var $fxDateArr = $("<div class='fxdate-arr'></div>").appendTo($fxDatePanelPick);
    	var $fxDateSele = $("<div class='fxdate-select'></div>").appendTo($fxDatePanelPick);
    	var $fxDateDl = $("<dl class='fxdate-dl'></dl>").appendTo($fxDateSele);
    	for(var i=0; i<control.expressionArr.length; i++) {
    		var $fxDateDd = $("<dd data-value='"+control.expressionArr[i].value +"'></dd>'").data("expression",control.expressionArr[i]);
    		$("<em>"+control.expressionArr[i].text+"</em>").appendTo($fxDateDd);
    		// click事件
    		$fxDateDd.on("click",function(e){
    			oThis.setValue($(this).attr("data-value"));
    			e.stopPropagation();
    			oThis.hiddenFxDataPanel();
    		});
    		// hover事件
    		$fxDateDd.hover(function(){
                $(this).addClass('over');
            },function(){
                $(this).removeClass('over');
            });
    		$fxDateDd.appendTo($fxDateDl);
    	}
    	
    	$(document.body).append($fxDatePanelPick);
    	
    	$(document).on("click",function(e){
            if(oThis.getFxDatePanelPick()){
               oThis.hiddenFxDataPanel();
            }
        });
    	
    };
    
	 /*
	 * 显示FxDataPanel
	 */
    control.prototype.showFxDataPanel = function () {
    	this.getFxDatePanelPick().css("display","block");
    	var value = this.getValue();
    	if(value && value.startsWith("#")){
    		this.getFxDatePanelPick().find("dd").removeClass("selected");
    		this.getFxDatePanelPick().find("dd[data-value='"+value+"']").addClass("selected");	
    	}
    	var offset = this.getElement().offset();
    	var left = offset.left - this.getElement().scrollLeft() + "px";
    	var top = offset.top + 33 + 7 - this.getElement().scrollTop() + "px";
    	this.getFxDatePanelPick().css({"left":left,"top":top});
    };
	
    /*
	 * 显示FxDataPanel
	 */
    control.prototype.hiddenFxDataPanel = function () {
    	this.getFxDatePanelPick().css("display","none");
    };
    
     /*
	 * 获得FxDataPanel
	 */
    control.prototype.getFxDatePanelPick = function () {
    	 return this._get_data("$fxDatePanelPick");
    };
    
    
    control.prototype.getValue = function () {
    	if(this._get_data("isFunc") == "Y"){
    		return this.getValueByText(this.getElement().val());
    	} 
    	else {
    		 var datepicker = this.getElement().data("kendoDatePicker");
        	 var val = datepicker.value();
       		 var value = val == null ? null : cb.util.formatDate(val);
        	 return value;
    	}
    };
    
    control.prototype.setValue = function (val) {
       if(val instanceof Date || (/[0-9]{4}-[0-9]{2}-[0-9]{2}/).test(val) || val == "" ){
       		this._set_data("isFunc","N");
       		this.getElement().data("isFunc","N");
       	 	var datepicker = this.getElement().data("kendoDatePicker");
        	var value = val == null ? "" : new Date(val);
        	datepicker.value(value);
       } else {
	       	var datepicker = this.getElement().data("kendoDatePicker");
	       	datepicker.value("");
	       	datepicker.trigger("change");
       		this._set_data("isFunc","Y");
       		this.getElement().data("isFunc","Y");
	       	this.getElement().val(this.getTextByValue(val));
	       	this.getElement().trigger('change',val);
       }

    };
    
    control.prototype.getTextByValue = function (val) {
       for(var i=0; i<control.expressionArr.length; i++){
       		var obj = control.expressionArr[i];
       		if(obj.value == val){
       			return obj.text;
       		}
       }
    };
    
    control.prototype.getValueByText = function (text) {
       for(var i=0; i<control.expressionArr.length; i++){
       		var obj = control.expressionArr[i];
       		if(obj.text == text){
       			return obj.value;
       		}
       }
    };
    
    return control;
   }
);