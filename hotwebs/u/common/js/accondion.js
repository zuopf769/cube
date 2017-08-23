
(function ($) {
    $.extend(true, window, {
        "cb": {
            "controls": {
                "Accondion": Accondion
            }
        }
    });

    function Accondion(element, options) {

        /**
        * Default settings for options
        */
        var defaultOptions = {
            useCache: false,
            dataSource: [],
            dataType: "json",
            firstItemClass: "firstChild",
            lastItemClass: "lastChild",
            onItemClick: null,
            onBeforeExpand: null,
            afterExpand: null,
            maxLevel: 3,
            onMoreClick: null,
            pageSize: 20,
            indent: 20
        };

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

        this.itemSelected = null;
        this.isBusy = false;

        $elem.bind("click", function (event) {
            var $li = (event.target.nodeName != "li") ? $(event.target).closest("li") : $(event.target);
            self.onClick($li);
        });

        /**
        * Init options
        */
        this.options = opts;

        this.$elem = $elem;
        this.$elem.addClass("accondion");

        this.events = {};

        var self = this;

        var $pullDown, $pullUp, _loadingStep = 0;

        var $myScroll = null;

        var initScroller = function () {

            document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

            var $wrapper = self.$elem.closest(".accondion-wrapper");

            if ($wrapper.length && window.IScroll) {
                $myScroll = new IScroll($wrapper[0], {
                    preventDefault: false,
                    mouseWheel: true // 允许滑轮滚动
                });
            }
        };

        initScroller();
        this.$scroller = $myScroll;
    }

    Accondion.prototype.fireClick = function (data) {
        var $li = tihs.getItem(data);
        if ($li) {
            this.onClick($li);
        }
    }

    Accondion.prototype.onClick = function ($li) {
        var result = $li.data("data");

        if ($li.hasClass("more")) {
            //more click
            if (this.options.onMoreClick != null && $.isFunction(this.options.onMoreClick))
                this.options.onMoreClick($li, result);
        }
        else {
            if (result) {
                if (this.itemSelected) {
                    this.itemSelected.children("div").removeClass("selected");
                }
                this.itemSelected = $li;

                $li.children("div").addClass("selected");

                if ($li.find("li").length > 0) {
                    this.afterItemClick($li);
                }
                else {
                    if (this.options.onBeforeExpand != null && $.isFunction(this.options.onBeforeExpand)) {
                        this.options.onBeforeExpand($li, result);
                    }
                }
                if (this.options.onItemClick != null && $.isFunction(this.options.onItemClick)) {
                    this.options.onItemClick($li, result);
                }
            }
        }
    }

    Accondion.prototype.getSelectedItem = function () {
        return this.itemSelected;
    }

    Accondion.prototype.setOptions = function (opts) {
        this.options = $.extend({}, opts, this.options);
    }


    Accondion.prototype.setData = function (data) {
        for (var attr in data) {
            var attrUpper = attr.substring(0, 1).toUpperCase() + attr.substring(1);
            if (this["set" + attrUpper]) this["set" + attrUpper](data[attr]);
        }
    };

    Accondion.prototype.getItem = function (data) {
        var item = this.$elem.find("li[code='" + data.code + "']");

        return (item && item.length > 0) ? item : null;
    }

    Accondion.prototype.setChildren = function (data, element) {
        if (!element) {
            element = this.getItem(data);
        }
        if (!element) return;


        this.appendChild(data, element);
    }

    Accondion.prototype.setRows = function (dataSource) {
        this.options.dataSource = dataSource;
        if (dataSource != null) {
            this.fetchData();
        }
    }

    Accondion.prototype.initData = function (data) {
        this.init(data)
    }

    Accondion.prototype.setDataSource = function (dataSource) {

        this.options.dataSource = dataSource;
        if (dataSource != null) {
            this.fetchData();
        }
    }

    Accondion.prototype.on = function (eventName, func, context) {
        var event = function (e, args) {
            func.call(context, args);
        };
        this.events[func] = event;
        if (eventName === "itemClick") this.options.onItemClick = event;
        if (eventName === "moreClick") this.options.onMoreClick = event;

        if (eventName == "beforeExpand") {
            this.options.onBeforeExpand = function (element, data) {
                func.call(context, data);
            };
        }
    };

    Accondion.prototype.un = function (eventName, func) {
        var event = this.events[func];
        if (!event) return;
        if (eventName === "itemClick") this.options.onItemClick = null;
        if (eventName === "moreClick") this.options.onMoreClick = null;
        if (eventName === "beforeExpand") this.options.onBeforeExpand = null;

    };

    /**
    * Get autocomplete data for a given value
    */
    Accondion.prototype.fetchData = function () {
        if (this.options.dataSource) {
            this.init(this.options.dataSource);
        } else {
            var self = this;
            this.fetchRemoteData(function (remoteData) {
                self.init(remoteData);
            });
        }
    };


    Accondion.prototype.init = function (data) {

        this.$elem.children().remove();

        var $ul = $('<ul></ul>');
        var results = data.children;


        var numResults = results.length;
        if (numResults === 0) {
            return;
        }
        var level = 0;

        var list = this.getFromResults(results, level);

        for (var i = 0; i < list.length; i++) {
            $ul.append(list[i]);
        }

        if (this.isShowMore(numResults)) {
            var $li = this.getMoreLi(data, level);
            $li.appendTo($ul);
        }

        this.$elem.append($ul);
        this.$elem.data("data", data);
        this.$elem.data("level", 0);
        if (this.$scroller)
            this.$scroller.refresh();
    }

    /**
    * Show all results
    * @param results
    * @param filter
    */
    Accondion.prototype.getFromResults = function (results, level) {

        var numResults = results.length;
        var list = new Array();
        var self = this;

        var i, result, $li, first = false, $first = false;
        for (i = 0; i < numResults; i++) {
            result = results[i];
            $li = this.getLiItemFromResult(result, level);
            list.push($li);

            if (first === false) {
                first = String(result.code);
                $first = $li;
                $li.addClass(this.options.firstItemClass);
            }
            if (i === numResults - 1) {
                $li.addClass(this.options.lastItemClass);
            }
        }
        return list;
    };


    /**
    * Create a results item (LI element) from a result
    * @param result
    */
    Accondion.prototype.getLiItemFromResult = function (result, level) {
        var self = this;
        var $li = null;

        $li = this.getLiItemFromResultWithChild(result, level);

        $li.data("data", result);
        $li.data("level", level);

        // this.setIndent($li, level);



        return $li;
    };

    Accondion.prototype._getIndent = function (level) {
        level = parseInt(level);
        return (level - 1) * this.options.indent + "px";
    }

    Accondion.prototype.setIndent = function (element, level) {
        var indent = this._getIndent(level + 1);
        //element.css("text-indent", indent);
        element.css("margin-left", indent);
    }

    Accondion.prototype.getLiItemFromResultWithChild = function (result, level) {
        var self = this;

        var $div = $('<div class="header"><span class="arrow"></span><span class="txt">' + result.name + '</span></div>');
        $div.attr("level", level);

        this.setIndent($div, level);

        var $ul = $('<ul></ul>');
        if ($.isArray(result.children)) {
            for (var i = 0; i < result.children.length; i++) {
                var child = result.children[i];

                var $li = this.getLiItemFromResult(child, level + 1);
                $li.appendTo($ul);
            }
        }

        var $li = $("<li leaf='0' code=" + result.code + "></li>");
        $li.append($div);
        $li.append($ul);
        $li.data("data", result);
        return $li;
    }

    Accondion.prototype.getMoreLi = function (result, level) {
        var $li = $('<li class="more" pcode="' + result.code + '"><span>更多</span></li>');
        $li.data("data", result);
        $li.data("level", level);
        var self = this;
        return $li;
    }

    Accondion.prototype.isShowMore = function (length) {
        if (length < this.options.pageSize) {
            return false;
        }
        return true;
    }


    Accondion.prototype._append = function (element, result, level) {
        var $ul = element;
        if ($.isArray(result.children)) {
            for (var i = 0; i < result.children.length; i++) {
                var child = result.children[i];

                var $li = this.getLiItemFromResult(child, level);
                $li.appendTo($ul);
            }

            //在此处增加判断，如果分类下数据小于页大小了，说明没有数据了，就不需要增加更多按钮了
            if (this.isShowMore(result.children.length)) {
                //假设页大小是100
                var $li = this.getMoreLi(result, level);
                $li.appendTo($ul);
            }
            if (this.$scroller)
                this.$scroller.refresh();
        }
    }


    Accondion.prototype.getMoreItem = function (data) {
        var item = this.$elem.find("li[pcode='" + data.code + "']");

        return (item && item.length > 0) ? item : null;
    }

    /**
    * element 代表的是 更多按钮
    */
    Accondion.prototype.appendMore = function (result, element) {

        if (!element) {
            element = this.getMoreItem(result);
        }
        if (!element) return;

        var level = element.data("level") != null ? element.data("level") : 0;
        var $ul = element.parent();
        element.remove();
        this._append($ul, result, level);
        if (this.$scroller)
            this.$scroller.refresh();
    }

    /**
    *  动态增加子数据
    *  element 是div
    */
    Accondion.prototype.appendChild = function (result, element) {
        if (!element) {
            element = this.getItem(result);
        }
        if (!element) return;

        var level = element.data("level") != null ? element.data("level") : 0;
        var $ul = element.children("ul");
        this._append($ul, result, level + 1);
        this.afterItemClick(element);
        //element.data("loaded", true);
        if (this.$scroller)
            this.$scroller.refresh();

    }

    Accondion.prototype.afterItemClick = function (element) {
        if (element.children("ul").css("display") == "block") {
            element.children("ul").slideUp(300);
            element.children("div").removeClass("menu-show");
        }
        else {
            element.children("ul").slideDown(300);
            element.children("div").addClass("menu-show");
        }
        if (this.$scroller)
            this.$scroller.refresh();

    }






    /**
    * Sort results
    * @param results
    * @param filter
    */
    Accondion.prototype.sortResults = function (results, filter) {
        var self = this;
        var sortFunction = this.options.sortFunction;
        if (!$.isFunction(sortFunction)) {
            sortFunction = function (a, b, f) {
                return self.sortValueAlpha(a, b, f);
            };
        }
        results.sort(function (a, b) {
            return sortFunction(a, b, filter);
        });
        return results;
    };

    /**
    * Default sort filter
    * @param a
    * @param b
    */
    Accondion.prototype.sortValueAlpha = function (a, b) {
        a = String(a.value);
        b = String(b.value);
        if (!this.options.matchCase) {
            a = a.toLowerCase();
            b = b.toLowerCase();
        }
        if (a > b) {
            return 1;
        }
        if (a < b) {
            return -1;
        }
        return 0;
    };

    /**
    * Get remote autocomplete data for a given value
    */
    Accondion.prototype.fetchRemoteData = function (callback) {
        var data = this.cacheRead(filter);
        if (data) {
            callback(data);
        } else {
            var self = this;
            //this.dom.$elem.addClass(this.options.loadingClass);
            var ajaxCallback = function (data) {
                var parsed = false;
                if (data !== false) {
                    parsed = self.parseRemoteData(data);
                    self.cacheWrite(filter, parsed);
                }
                self.dom.$elem.removeClass(self.options.loadingClass);
                callback(parsed);
            };
            $.ajax({
                url: this.makeUrl(filter),
                success: ajaxCallback,
                error: function () {
                    ajaxCallback(false);
                },
                dataType: 'text'
            });
        }
    };


    /**
    * Parse data received from server
    */
    Accondion.prototype.parseRemoteData = function (remoteData) {
        var remoteDataType = this.options.remoteDataType;
        if (remoteDataType === 'json') {
            return this.parseRemoteJSON(remoteData);
        }
        return this.parseRemoteText(remoteData);
    };

    /**
    * Parse data received in text format
    */
    Accondion.prototype.parseRemoteText = function (remoteData) {
        var results = [];
        var text = String(remoteData).replace('\r\n', this.options.lineSeparator);
        var i, j, data, line, lines = text.split(this.options.lineSeparator);
        var value;
        for (i = 0; i < lines.length; i++) {
            line = lines[i].split(this.options.cellSeparator);
            data = [];
            for (j = 0; j < line.length; j++) {
                data.push(decodeURIComponent(line[j]));
            }
            value = data.shift();
            results.push({ value: value, text: data.shift() });
        }
        return results;
    };

    /**
    * Parse data received in JSON format
    */
    Accondion.prototype.parseRemoteJSON = function (remoteData) {
        var aData = $.parseJSON(remoteData);
        var result = new Array();
        for (var i = 0; i < aData.length; i++) {
            result.push({ value: aData[i].value, text: aData[i].data });
        }
        return result;
    };

    /**
    * Read from cache
    */
    Accondion.prototype.cacheRead = function (filter) {
        var filterLength, searchLength, search, maxPos, pos;
        if (this.options.useCache) {
            filter = String(filter);
            filterLength = filter.length;
            if (this.options.matchSubset) {
                searchLength = 1;
            } else {
                searchLength = filterLength;
            }
            while (searchLength <= filterLength) {
                if (this.options.matchInside) {
                    maxPos = filterLength - searchLength;
                } else {
                    maxPos = 0;
                }
                pos = 0;
                while (pos <= maxPos) {
                    search = filter.substr(0, searchLength);
                    if (this.cacheData_[search] !== undefined) {
                        return this.cacheData_[search];
                    }
                    pos++;
                }
                searchLength++;
            }
        }
        return false;
    };

    /**
    * Write to cache
    */
    Accondion.prototype.cacheWrite = function (filter, data) {
        if (this.options.useCache) {
            if (this.cacheLength_ >= this.options.maxCacheLength) {
                this.cacheFlush();
            }
            filter = String(filter);
            if (this.cacheData_[filter] !== undefined) {
                this.cacheLength_++;
            }
            this.cacheData_[filter] = data;
            return this.cacheData_[filter];
        }
        return false;
    };

    /**
    * Flush cache
    */
    Accondion.prototype.cacheFlush = function () {
        this.cacheData_ = {};
        this.cacheLength_ = 0;
    };

    /**
    * Call hook
    * Note that all called hooks are passed the Accondion object
    */
    Accondion.prototype.callHook = function (hook, data) {
        var f = this.options[hook];
        if (f && $.isFunction(f)) {
            return f(data, this);
        }
        return false;
    };
})(jQuery);