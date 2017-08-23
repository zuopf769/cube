(function ($) {
    $.extend(true, window, {
        "cb": {
            "controls": {
                "Panorama": Panorama
            }
        }
    });

    function Panorama(element, options) {
        var defaultOptions = {
            itemClick: null,
            dataSource: [],
            dataType: "json",
        }

        this.options = $.extend(defaultOptions, options);

        /** 
        * 兼容传入的是界面对象的ID，或者传入的直接是一个对象
        */
        var $elem = null;
        if (typeof (element) == "string") {
            $elem = $("#" + element);
        }
        else {
            $elem = element;
        }

        this.$elem = $elem;

        var self = this;

        this.$elem.click(function (event) {
        	var $target = $(event.originalEvent.target);
        	var data = $target.data("data");
            if($target.attr("data-tag")=="li"){        	
            	if (data && $.isFunction(self.options.onItemClick)) {
                	self.options.onItemClick($target, data);
            	}
            }
            else if($target.attr("data-tag")=="span" && !($target.attr("data-isExist")=="2"||$target.attr("data-isExist")=="1")){
            	data = $target.parent().data("data");
            	if (data && $.isFunction(self.options.onImgClick)) {
                	self.options.onImgClick($target, data);
            	}
            }else if($target.attr("data-tag")=="span" && ($target.attr("data-isExist")=="2"||$target.attr("data-isExist")=="1")){
            	return;
            }
        });
    }

    Panorama.prototype.setDataSource = function (data) {
        if (data.children && data.children.length > 0) {
            //var height = this.$elem.height();
            var height = 600;

            this.$elem.empty();        

            var liList = new Array();
            var level = 0;
            var self = this;

            var getLiList = function (data,level) {       

                for (var i = 0; i < data.children.length; i++) {
                    var child = data.children[i];
                    $li = self.getLiItem(child, level, child.isLeaf ? "1":"0");
                    liList.push($li);
                    if (child.children && child.children.length > 0) {
                         getLiList(child,level+1);
                    }
                }                
            }
            //获取所有菜单li
            getLiList(data, 0);

            
            //循环liList集合，逐个加入ul中，当高度将要超过时，新生成一个ul并列显示
            var appendChild = function (ul, begin) {
                var heightSum = 0;
                var i ;
                for ( i=begin; i < liList.length; i++) {
                    var $li = liList[i];                    
                    heightSum += 30;// $li.height();
                    if (heightSum > height) {
                        break;
                    }
                    else {
                        ul.append($li);
                    }
                }
                return i;
            }

            var containerWidth = this.$elem.width();
            var contentWidth = 0;
            var index = 0;
            var count = liList.length;
            var delta = false;
            do{
                var $ul = $("<ul/>");
                index = appendChild($ul, index);
                this.$elem.append($ul);

                if (contentWidth >= containerWidth) {
                    if (delta == false) {
                        delta = true;
                        this.$elem.width(this.$elem.width() + (contentWidth - containerWidth));
                    }
                    this.$elem.width(this.$elem.width() + 250);
                } else {
                    contentWidth += 250;
                }
                
            } while (index < count);
        }
    }  

    Panorama.prototype.setData = function (data) {
        for (var attr in data) {
            var attrUpper = attr.substring(0, 1).toUpperCase() + attr.substring(1);
            if (this["set" + attrUpper]) this["set" + attrUpper](data[attr]);
        }
    }

    Panorama.prototype.getLiItem = function (data,level,leaf) {    	    	        	
        var $li = $("<li data-tag='li' leaf='" + leaf + "' level='" + level + "' title='"+data.name+"' code='"+data.code+"'>" + data.name +"</li>");
        var $span = $("<span data-tag='span' data-isExist='"+data.isExist+"'></span>").appendTo($li);
        $li.data("data", data);        
        return $li;
    }

    Panorama.prototype.on = function (eventName, func, context) {
        if (eventName.indexOf("on") == 0) {
            eventName = eventName.substr(2);
        }
        var self = this;
        if (eventName == "click" || eventName == "itemClick") {
            this.options.onItemClick = function (element, data) {
                func.call(context, data);
            };
        }
        if (eventName == "imgClick") {
            this.options.onImgClick = function (element, data) {
                func.call(context, data);
            };
        }
    };

    Panorama.prototype.un = function (eventName) {
        if (eventName == "click" || eventName == "itemClick") {
            this.options.onItemClick = null;
        }      
    };

	Panorama.prototype.setIconsDisplay = function (args){
		if(args.isExist == '4'){
			$("li[title='"+ args.displayName+ "']").children().attr("data-isExist","2");

		}
		if(args.isExist == '3'){
			$("li[title='"+ args.displayName+ "']").children().attr("data-isExist","1");

		}
		
	}


})(jQuery);