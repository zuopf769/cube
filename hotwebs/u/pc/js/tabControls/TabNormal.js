cb.controls.widget("TabNormal", function (controlType) {
    var control = function (id, options) {
        cb.controls.TabControl.call(this, id, options);
        this._set_data("relatedTags", new Array());
    };
    control.prototype = new cb.controls.TabControl();
    control.prototype.controlType = 'TabControl';

    control.prototype.setDataSource = function (dataSource) {
        var $container = this.getElement();
        if (!dataSource || dataSource.length == 0) return;
        for (var i = 0, len = dataSource.length; i < len; i++) {
            var itemData = dataSource[i];
            var text = itemData["textField"];
            var icon = itemData["img_icon"] ? '<img src="' + itemData["img_icon"] + '" />' : '';
            var number = itemData["number"] ? '<span>' + itemData["number"] + '</span>' : '';
            var $li = $('<li data-content="' + itemData.appId + '"><span>' + icon + '</span><span>' + text + '</span>' + number + '</li>').data("itemData", itemData).on('click', this, function (e, args) {
                e.data.getElement().children().removeClass('active');
                $(this).addClass('active');
                e.data.setActive($(this).attr('data-content'));
                
                e.data.handleItemClick($(this).data("itemData"));
            });

            $li.appendTo($container);
        }
        //this.getElement().append($ul);
    };
    control.prototype.getValue = function (val) {
        return this.getElement().children(".active").attr('data-content');
    };

    control.prototype.getMenuObject = function (val) {
        return this.getElement().children("[data-content=\"" + val + "\"]");
    };

    control.prototype.getContentObject = function (val) {
        return this.tabContain().children("[data-content=\"" + val + "\"]");
    };

    control.prototype.setActive = function (val) {
        var tabMenu = this.getMenuObject(val);
        var ContentObject = this.getContentObject(val);
        if(ContentObject.length==0){
        
        }else if(ContentObject.length>0 && ContentObject.children().length>0){
            ContentObject.addClass('active').siblings().removeClass('active');
        }else{
            var content = $('<div data-content ="'+val+'"></div>').appendTo(this.tabContain());
            if(tabMenu.attr('data-remote') == 'true'){
                cb.loader.loadView(content, cb.route.getPageUrl(val), function () {
                    if (args && args.callback) args.callback.call(this, tabMenu);
                });
            }
            ContentObject.addClass('active').siblings().removeClass('active');
        }
        //if()
        tab.addClass('active').siblings().removeClass('active');
    };

    control.prototype.tabContain = function () {
        return this.getElement().parent().siblings("div[data-related='" + this._get_data("propertyName") + "']");
    };

    return control;
});