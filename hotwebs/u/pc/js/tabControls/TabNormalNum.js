cb.controls.widget("TabNormal", function (controlType) {
    var control = function (id, options) {
        cb.controls.TabControl.call(this, id, options);
        this._set_data("relatedTags", new Array());
        this._set_data("chArr", new Array());
    };
    control.prototype = new cb.controls.TabControl();
    control.prototype.controlType = 'TabControl';

    control.prototype.setDataSource = function (dataSource) {
        var $container = this.getElement();
        var $containerContent = this.tabContain();

        if (!dataSource || dataSource.length == 0) return;
        var selectedItem = null;
        for (var i = 0, len = dataSource.length; i < len; i++) {
            var itemData = dataSource[i];
            if (this.getMenuObject(itemData.dataContent).length == 0) {
                var text = itemData["textField"];
                var icon = itemData["img_icon"] ? '<img src="' + itemData["img_icon"] + '" />' : '';
                var number = itemData["number"] ? '<span>' + itemData["number"] + '</span>' : '';
                var $li = $('<li data-content="' + itemData.dataContent + '"><span>' + icon + '</span><span>' + text + '</span>' + number + '</li>').data("itemData", itemData)
                    .appendTo($container);
                if (itemData.isSelected) {
                    $li.addClass('active')
                }
            } else {
				this.getMenuObject(itemData.dataContent).data("itemData", itemData);
                if (itemData.isSelected) {
                    this.getMenuObject(itemData.dataContent).addClass('active').siblings().removeClass('active')
                }
                if(!isNaN(itemData.number)) {
                    var tabmenuNum = this.getMenuObject(itemData.dataContent).children('span:nth-child(3)');
                    if (tabmenuNum.length > 0) {
                        tabmenuNum.text(itemData.number);
                    } else {
                        $('<span>' + itemData["number"] + '</span>').appendTo(this.getMenuObject(itemData.dataContent))
                    }
                }
               if(itemData.textField) {
                    var tabmenuTextField = this.getMenuObject(itemData.dataContent).children('span:nth-child(2)');
                    tabmenuTextField.text(itemData.textField);
                }
            }
            if (this.getContentObject(itemData.dataContent).length == 0) {
                var content = $('<div class="row clearfix" data-content="' + itemData.dataContent + '"></div>').appendTo($containerContent);
                if (itemData.isSelected) {
                    content.show();
                } else {
                    content.hide();
                }
            } else {
                if (itemData.isSelected) {
                    selectedItem = itemData;
                  //this.getContentObject(itemData.dataContent).show();
                } 
            }
        }
        //this.getElement().append($ul);
        self = this;
        this.getElement().children('li').on('click', {control:self}, function (e, args) {
	        //e.data.setActive($(this).attr('data-content'));
	        e.data.control.handleItemClick($(this).data('itemData')?$(this).data('itemData'):$(this).attr('data-content'));
        });
        if(selectedItem){
        	//this.getElement().children('[data-content="'+type+'"]')
        	//this.setAction(selectedItem);
        	this.getMenuObject(selectedItem).trigger('click');
        }
        selectedItem
    };

    return control;
});