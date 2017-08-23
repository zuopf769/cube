cb.controls.widget("TabControl", function (controlType) {
    var control = function (id, options) {
        cb.controls.Control.call(this, id, options);
        this._set_data("chArr", new Array());
        this._set_data("historyState",new Array());
    };
    control.prototype = new cb.controls.Control();
    control.prototype.controlType = 'TabControl';

  control.prototype.getValue = function () {
        return this.getElement().children(".active").attr('data-content');
    };

    control.prototype.getMenuObject = function (val) {
    	if(typeof val =='string'){
        	return this.getElement().children("[data-content=\"" + val + "\"]");    		
    	}else{
    		return this.getElement().children("[data-content=\"" + val.dataContent + "\"]")
    	}

    };

    control.prototype.getContentObject = function (val) {
    	if(typeof val =='string'){
        	return this.tabContain().children("[data-content=\"" + val + "\"]");    		
    	}else{
    		return this.tabContain().children("[data-content=\"" + val.dataContent + "\"]")
    	}
    };

    control.prototype.setActive = function (val) {
        var tab = this.getMenuObject(val);
        tab.addClass('active').siblings().removeClass('active');
       
        this.tabContain().children("[data-content]").hide();
        this.getContentObject(val).show();
    };

    control.prototype.tabContain = function () {
        return this.getElement().parent().siblings("div[data-related='" + this._get_data("propertyName") + "']");
    };

    control.prototype.handleItemClick = function (itemData) {
    	var me = this;
        this.setActive(itemData);
        var tabMenu = me.getMenuObject(itemData);
        var datacontent = tabMenu.attr("data-content");
        var tabContent = me.getContentObject(datacontent);
      
        var isLoaded = me.setchHash(datacontent); 
        me.setHistoryState(datacontent);
        if (!isLoaded) {
            if (tabMenu.attr('data-remote') == 'true') {
                cb.loader.loadView(tabContent, cb.route.getPageUrl(datacontent), function () {
                   // if (args && args.callback) args.callback.call(this, tabMenu);
                    me.execute("itemClick", itemData);
                });
            }
        }
        if (!datacontent) {
            var itemData = me.getElement().find(".active").data("itemData");
            if (itemData)
                this.execute("itemClick", itemData);
        }
        else if (datacontent.indexOf('.') < 0)
            //func.call(context, me.getValue());
            me.execute("itemClick", me.getValue());
    };
    
    control.prototype.setchHash = function (val) {
        var index = -1;
        var chArr = this._get_data("chArr");
        for (var i = 0; i < chArr.length; i++) {
            if (chArr[i] == val)
                index = i;
        }
        if (index < 0) {
            chArr.push(val);
            return false;
        }
        else
            return true;
    };
    control.prototype.deleteCash = function (val) {
        var index = -1;
        var chArr = this._get_data("chArr");
        for (var i = 0; i < chArr.length; i++) {
            if (chArr[i] == val)
                index = i;
        }
        if (index < 0) {
            // chArr.push(val);
            return false;
        }
        else {
            chArr.splice($.inArray(val, chArr), 1)
            return true;
        }
    };

    control.prototype.setHistoryState = function (val) {
        var historyState = this._get_data("historyState");
        if (!historyState) {
            historyState = {};
            this._set_data("historyState", historyState);
        }
        historyState[val] = historyState["lastSelected"] || "baseinfo";
        historyState["lastSelected"] = val;
    };

    return control;
});