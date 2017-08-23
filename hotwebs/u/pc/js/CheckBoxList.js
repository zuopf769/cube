cb.controls.widget("CheckBoxList", function (controlType) {
    var control = function (id, options) {
        cb.controls.ListControl.call(this, id, options);
    };
    control.prototype = new cb.controls.ListControl();
    control.prototype.controlType = "ListControl";

    control.prototype.setDataSource = function (dataSource) {
        if (!dataSource || !cb.isArray(dataSource)) return;
        this.getElement().children().remove();
        this._set_data("oldSelect",null);
        var self = this;
        var $ul = $("<ul class='sortable'></ul>").appendTo(this.getElement());
        for (var i = 0; i < dataSource.length; i++) {
            var $li = $("<li><span></span><label title=\"" + dataSource[i].filterMeta.fieldName + "\">" + dataSource[i].filterMeta.fieldName + "</label></li>")
                .data('itemData', dataSource[i]);
            $li.data('itemData').index = i + 1;
            if (dataSource[i].filterMeta.hasOwnProperty('isSelected') && dataSource[i].filterMeta.isSelected == true)
                $li.children('span').addClass('checked');
            else
                $li.children('span').addClass('unchecked');
            $li.on('click', this, function (e, args) {
                var oldSelect = e.data._get_data("oldSelect");
                var data = $(this).data("itemData");
                e.data.handleItemClick({ prev: oldSelect, data: data });
                oldSelect = data;
                e.data._set_data("oldSelect", oldSelect);
            });
            
            $li.children('span').on('click', this, function (e, args) {
                var li = $(e.target).closest("li");
                var itemdata = li.data('itemData');
                var re = self.setSelected($(this));
                itemdata.filterMeta.isSelected = re;
            });
            $li.appendTo($ul);
        };
        // 触发点击第一个item的事件
        $ul.children('li:first-child').click();
        
        // 拖放排序
        $("ul.sortable").sortable().bind('sortupdate', function(e,ui) { 
        	$(ui.item[0]).click();
			$("ul.sortable li").each(function(){
        		var indexNum = $("ul.sortable li").index(this);
        		$(this).data('itemData').index = indexNum + 1;
        	});
        
        });
        
    };

    control.prototype.setSelected = function (val) {
        if (val.hasClass('checked')) {
            val.removeClass('checked');
            val.addClass('unchecked');
            return false;
        }
        else {
            val.removeClass('unchecked');
            val.addClass('checked');
            return true;
        }
        
    };

    //control.prototype.getValue = function () {
    //    var result = new Array();
    //    this.getElement().find('li').each(function () {
    //        var ischecked = $(this).data('isSelected');
    //        if (ischecked) {
    //            var initdata = $(this).data('itemData');
    //            result.push({ text: initdata.filterMeta.fieldName, value: initdata.filterMeta.fieldCode });
    //        }
    //    });
    //    return result;
    //};
    return control;
});