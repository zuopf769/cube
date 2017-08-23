(function ($) {
    $.extend(true, window, {
        "cb": {
            "controls": {
                "Catalog": Catalog
            }
        }
    });

    function Catalog(element, options) {


        function HomeView($dom) {
            this.dropdown = null;

            if ($dom.find(".title .dropdown").length > 0) {
                this.dropdown = new cb.controls.DropDown($dom.find(".title .dropdown"), opts.dropdown);
            }

            accopts.pageSize = self.options.pageSize;

            this.accondion = new cb.controls.Accondion($dom.find(".accondion"), accopts);

            this.$dom = $dom;
        }

        HomeView.prototype.setDropDownDataSource =function (data) {
            this.dropdown.setDataSource(data);
        }

        HomeView.prototype.initData  =function (data)  {
            this.accondion.initData(data);
        }

        function OtherView($dom) {
            this.button = new cb.controls.ImageButton($dom.find(".title .button"));
            this.button.on("click", returnClick);
            this.button.setModel("image-text");            
            this.accondion = new cb.controls.Accondion($dom.find(".accondion"), accopts);

            this.$dom = $dom;
        }

        OtherView.prototype.initData =function (data) {
            this.accondion.initData(data);
        }

        OtherView.prototype.setOptions = function (options) {
            this.accondion.setOptions(options);
        }

        var helper = function() {            
            //保存当前操作堆栈中的视图模型
            var viewLink = new Array();
            //缓存所有视图模型
            var catalogDic = {};
            if ($("#CustomerCatalogViewModelTemplate").length>0){
                var template = $("#CustomerCatalogViewModelTemplate").get(0).innerHTML;
            }

			var hasinit =false;
            /**
            * public 初始化  
            * 参数 ：this.$dom.children("div")
            */
            function init(view) {
                //var homeView = new HomeView(this.$dom.children("div"));
				if(hasinit) return;
                var homeView = new HomeView(view);
                //入口视图
                catalogDic["home"] = homeView;

                viewLink.push(homeView);
				
				hasinit =true;
            }

            function initData(data) {

                catalogDic["home"].initData(data);
            }

            function _getItemById(code) {
                var len = catalogDic.length, i;
                for (i = 0; i < len; i++) {
                    var view = catalogDic[i]
                }
            }

            /**
            * public 触发点击事件
             */
            function onItemClick (element, data) {
                var result = data;
                //如果已经加载过子页面
                if ($.isFunction(self.options.onItemClick)) {
                    self.options.onItemClick(element, data);
                }
            }

            /**
            * public 触发加载更多事件
            */

            function onMoreClick (element, data) {
                self.options.onMoreClick(element, data);
            }


            /**
            * public 触发点击事件
            */
            function onBeforeExpand (element, data) {
                //没有加载过的
                var result = data;
                //如果已经加载过子页面
                if (isLoadedOtherView(result)) {
                    directLoadOtherView(result);
                }
                else {
                    self.options.onBeforeExpand(element, data);
                }
            }

            /**
            * public 增加子
            */
            function appendCatalog(result) {
                if ($.isArray(result.children) && result.children.length > 0) {
                    var target = viewLink[viewLink.length - 1].accondion.getItem(result);
                    if (target) {
                        if (target.data("level") < self.getMaxLevel()) {
                            appendChildren(result);
                        }
                        else {
                            loadOtherView(result);
                        }
                    }
                }
            }

            /**
            * public 增加更多
            */
            function appendMore (result) {
                try {
                    if ($.isArray(result.children) && result.children.length > 0) {                       
                        if (viewLink[viewLink.length - 1] != null) {
                            viewLink[viewLink.length - 1].accondion.appendMore(result);
                        }
                    }
                }
                catch (e) {
                    alert(e.toString());                   
                }                
            }

            /**
            * private 是否加载过子视图
            */
            function isLoadedOtherView (result) {
                if (catalogDic[result.code] != null) {
                    return true;
                }
                return false;
            }

            /**
            * private 直接加载子视图
            */
            function directLoadOtherView (result) {
                var otherView = catalogDic[result.code];
                if (otherView != null) {
                    moveLeft(otherView);
                }               
            }

            /**
            * private 左移，翻页查看下级菜单
            */
            function moveLeft(otherView) {
                //先设置前一个状态                
                viewLink.push(otherView);                
                otherView.$dom.showFromRight(1000);
            };

            /**
            * private 右移，翻页查看上级菜单
            */
            function moveRight () {
                var view = viewLink.pop();
                view.$dom.hideToRight(1000);
            }

            /**
            * private 增加子分类菜单
            */
            function appendChildren(result) {
                try {
                    if (viewLink[viewLink.length - 1] != null) {
                        viewLink[viewLink.length - 1].accondion.appendChild(result);
                    }
                }
                catch (e) {
                   
                }               
            }

            /**
            * private 加载子视图
            */
            function loadOtherView(result) {
                try{
                    var otherView = null;
                    if (catalogDic[result.code] == null) {
                        otherView = createOtherView(result);
                        catalogDic[result.code] = otherView;
                        otherView.$dom.appendTo(self.$dom);                        

                    } else {
                        otherView = catalogDic[result.code];
                    }

                    moveLeft(otherView);

                }
                catch(ex){
                   
                }                
            }

            /**
            * private 创建子分类视图
            */
            function createOtherView (result) {
                var otherView = new OtherView($(template));
                otherView.accondion.initData(result);
                return otherView;
            }

            function setDropDownDataSource (data) {
                catalogDic["home"].setDropDownDataSource(data);
            }

            function getSelectedItem() {
                return viewLink[viewLink.length - 1].accondion.getSelectedItem();
            }

            return {
                onItemClick :   onItemClick,
                onMoreClick :   onMoreClick,               
                onBeforeExpand: onBeforeExpand,

                moveRight:      moveRight,
                initData: initData,
                init: init,
                appendCatalog: appendCatalog,
                appendChildren: appendChildren,
                trunScreen:loadOtherView,
                appendMore:     appendMore,

                setDropDownDataSource: setDropDownDataSource,
                getSelectedItem: getSelectedItem

            }
        }       
        
        /**
       * Default settings for options
       */
        var defaultOptions = {
            accondion: null,
            dropdown: null,
            onButtonClick: null,                        
        }

        /**
         * Init options
         */
        var opts = $.extend({}, defaultOptions, options);

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


        this.options = opts;

        this.$dom = $elem;

        var self = this;

        function itemClick(element,data) {
            self.helper.onItemClick(element, data);
        }

        function moreClick(element, data) {
            self.helper.onMoreClick(element, data);
        }

        function returnClick(element, data) {
            self.helper.moveRight();
        }

        function beforeExpand(element, data) {
            self.helper.onBeforeExpand(element, data);
        }

        this.helper = helper();
        var accopts = { onItemClick: itemClick, onMoreClick: moreClick, onBeforeExpand: beforeExpand };
        //this.helper.init(this.$dom.children("div"));

        /*层级数据选项*/

        /*if (this.options.accondion != null) {
            accopts = { dataSource: this.options.accondion.dataSource, onItemClick: this.options.accondion.itemClick };
        }*/
    }

    Catalog.prototype.getMaxLevel = function () {
        return 2;
    }

    Catalog.prototype.setDropDownDataSource =function (data) {
		this.helper.init(this.$dom.children("div"));
        this.helper.setDropDownDataSource(data);
    };

    Catalog.prototype.setRows =function(data) {
        var result = data;
        this.helper.init(this.$dom.children("div"));
        this.helper.initData(result);
    };   


    Catalog.prototype.setOptions =function(options) {
        this.options = $.extend({}, this.options, options);
    }

    Catalog.prototype.setChildren = function (result) {       
        this.helper.appendCatalog(result);
    }

    Catalog.prototype.setMore =function(result) {
        this.helper.appendMore(result);
    }

    Catalog.prototype.getSelectedItem = function () {
        return this.helper.getSelectedItem();
    }

    Catalog.prototype.getData = function (data) {

        for (var attr in data) {
            var attrUpper = attr.substring(0, 1).toUpperCase() + attr.substring(1);
            if (this["get" + attrUpper]) return this["get" + attrUpper](data[attr]);
        }
    };

    Catalog.prototype.setVisible = function (visible) {
        visible ? this.$dom.show() : this.$dom.hide();
    }


    Catalog.prototype.setData =function(data) {

        for (var attr in data) {
            var attrUpper = attr.substring(0, 1).toUpperCase() + attr.substring(1);
            if (this["set" + attrUpper]) this["set" + attrUpper](data[attr]);
        }
    };

    Catalog.prototype.on =function(eventName, func, context) {
        if (eventName.indexOf("on") == 0) {
            eventName = eventName.substr(2);
        }
        var self = this;
        if (eventName == "click" || eventName == "itemClick") {
            this.options.onItemClick =function(element,data) {
                func.call(context, data);
            };
        }

        if (eventName == "beforeExpand") {
            this.options.onBeforeExpand =function(element,data) {
                func.call(context, data);
            };
        }

        if (eventName == "moreClick") {
            this.options.onMoreClick =function(element,data) {
                func.call(context, data);
            }
        }
    };

    Catalog.prototype.un =function(eventName) {
        if (eventName == "click" || eventName == "itemClick") {
            this.options.onItemClick = null;
        }

        if (eventName == "moreClick") {
            this.options.onMoreClick = null;
        };

        if (eventName == "beforeExpand") {
            this.options.onItemBeforeExpand = null;
        }
    };

})(jQuery);