﻿
(function ($) {
var DataGrid=cb.controls['DataGrid'];

var Editor={
	init: function(container, options){
		if(!this.el){
			this.el=$('<div class="cellEdtior"><input type="text" /></div>').appendTo(container)[0];
			this.target=this.el.firstChild;
		}else{
			container.appendChild(this.el);
		}
		//根据配置信息初始化editor
	},
	getValue: function(){
		return $(this.target).val();
	},
	setValue: function(value){
		$(this.target).val(value);
	},
	resize: function(width){
		$(this.el)._outerWidth(width);
	},
	destroy: function(){
		$(this.el).remove();
	}
	
};

var CheckboxEditor=$.extend({},Editor,{
	init: function(container, options){
		if(!this.el){
			this.el=$('<div class="cellEdtior CheckboxEditor"><input type="checkbox" /></div>').appendTo(container)[0];
			this.target=this.el.firstChild;
		}else{
			container.appendChild(this.el);
		}
		//
	},
	getValue: function(){
		return this.target.checked;
	},
	setValue: function(value){
		this.target.checked=!!value;
	}
});
var TextBoxEditor=$.extend({},Editor,{
	init: function(container, options){
		if(!this.el){
			this.el=$('<div class="cellEdtior TextBoxEditor"><input  type="text" data-controltype="TextBox" /></div>').appendTo(container)[0];
			this.target=$(this.el).find('input')[0];
			//时间处理
		}else{
			container.appendChild(this.el);
		}
		options=options||{};
		if(options.length){
			$(this.target).attr('size',options.length);
		}
		this.target.focus();
		//根据配置信息初始化editor
	}
	
});
var DefaultEditor=TextBoxEditor;

var ComboxEditor=$.extend({},Editor,{
	init: function(container, options){
		if(!this.el){
			this.el=$('<div class="cellEdtior ComboBoxEditor"><div class="ui-field-contain"><div  data-controltype="ComboBox" ><input type="text" /></div></div></div>').appendTo(container)[0];
			this.target=new cb.controls['ComboBox']($(this.el).find('[data-controltype=ComboBox]'));
			this.target.setDataSource(options.dataSource);
			//时间处理
		}else{
			container.appendChild(this.el);
		}
		options=options||{};
		if(options.length){
			
		}
		this.target.getElement().children('div').trigger('click');
		//根据配置信息初始化editor
	},
	getValue: function(){
		return this.target.getValue();
	},
	setValue: function(value){
		this.target.setValue(value);
	}
});

var NumberBoxEditor=$.extend({},Editor,{
	init: function(container, options){
		if(!this.el){
			this.el=$('<div class="cellEdtior NumberBoxEditor"><div class="ui-field-contain"><div><input  data-controltype="NumberBox" type="text" /></div></div></div>').appendTo(container)[0];
			this.target=new cb.controls['NumberBox']($(this.el).find('[data-controltype=NumberBox]'));
			//时间处理
		}else{
			container.appendChild(this.el);
		}
		
		if(options){
			this.target.setData(options);
		}
		this.target.getElement().children('div').trigger('click');
		//根据配置信息初始化editor
	},
	getValue: function(){
		return this.target.getValue();
	},
	setValue: function(value){
		this.target.setValue(value);
	}
});
var DateTimeEditor=$.extend({},Editor,{
	init: function(container, options){
		if(!this.el){
			this.el=$('<div class="cellEdtior DateTimeEditor"><div><input data-controltype="DateTimeBox" /></div></div>').appendTo(container)[0];
			this.target=new cb.controls['DateTimeBox']($(this.el).find('input'));
			//时间处理
		}else{
			container.appendChild(this.el);
		}
		options=options||{};
		if(options.length){
			
		}
		this.target.getElement().trigger('focus');
		//根据配置信息初始化editor
	},
	getValue: function(){
		return this.target.getValue();
	},
	setValue: function(value){
		this.target.setValue(value);
	}
});
var ReferEditor=$.extend({},Editor,{
    init: function (container, options) {
        if (!this.el) {
            this.el = $('<div class="col-lg-8 p-0  cellEdtior  ReferEditor" data-propertyname="" data-controltype="Refer"><input type="text"  /><div><img src="pc/images/Ref-close.png"/><img src="pc/images/Ref.png" /></div></div>').appendTo(container)[0];
            this.target = new cb.controls['Refer']($(this.el));
            var editor = this;
            this.target.on('change', function (data) {
                var o = {};
                o.refers = data;
                o.column = editor.target._opts[DataGrid.FIELDNAME_PROP];
                //o.rowIndex = editor.rowIndex;//当前行
                cb.getControl(editor.grid).execute('referChange',o);
            })
            //时间处理
        } else {
            container.appendChild(this.el);
        }
        options = options || {};
        if (options) {
            this.target._opts = $.extend(true,{},options);
        }
        this.target.getElement().trigger('focus');
        //根据配置信息初始化editor
    },
    getValue: function () {
        return this.target.getValue();
    },
    setValue: function (data) {
        var key, name;
        var field = this.target._opts[DataGrid.FIELDNAME_PROP];
        key = field + '_' + this.target._opts['refCode'];
        name = field + '_' + this.target._opts['refName'];
        this.target.setValue(data[key], data[name]);
    }
});
/*所有grid都能用的编辑器；可编辑的grid，在实例化时会初始化自己的编辑器（没中公共的编辑器都会创建一个编辑器实例，grid注册编辑器时，会实例化一个对应的编辑器实例）
*/
DataGrid.cellEditors={
	'DefaultEditor':Editor,
	'CheckboxEditor':CheckboxEditor,
	'TextBoxEditor':TextBoxEditor,
	'NumberBoxEditor':NumberBoxEditor,
	'DateTimeEditor':DateTimeEditor,
	'ComboxEditor':ComboxEditor,
	'ReferEditor':ReferEditor
};
})(jQuery);
