(function ($) {
    $.extend(true, window, {
        "cb": {
            "controls": {
                "ListCard": ListCard
            }
        }
    });

    function ListCard(element, options) {
        var $list;
        var $defaultSelectedListItem;
        var _events = {};
        var _lastClickItem;
        var _myScroll;
        var $pullDown;
        var $pullUp;
        var _loadingStep = 0; // 加载状态：0默认，1显示加载状态，2执行加载数据，只有当为0时才能再次加载，这是防止过快拉动刷新。
        var _hasSetFields = false;
        var _positionMap = { "0": "leftTop", "1": "rightTop", "2": "leftBottom", "3": "rightBottom" };

        var config = {
            mode: null,
            fields: null,
            pageInfo: null
        };

        var rowsCache;

        function init() {       	
        	
            if (typeof element == "object") $list = element;
            else $list = $("#" + element);
            config = $.extend(true, {}, config, options);
            var $template = $list.children().first();
            if ($template.length && $template.children().length) {
                var fields = {};
                var hasSet = false;
                for (var i = 0, len = $template.children().length; i < len; i++) {
                    var $child = $($template.children()[i]);
                    var position = $child.attr("data-position");
                    if (!position) continue;
                    var field = $child.attr("data-field");
                    if (!field) continue;
                    fields[position + "Field"] = field;
                    hasSet = true;
                }
                if (hasSet) {
                    config.fields = fields;
                    _hasSetFields = true;
                }
            }

            $pullDown = $list.prev();
            $pullDown.attr("class", "").hide();

            $pullUp = $list.next();
            $pullUp.attr("class", "").hide();

            var $wrapper = $list.closest(".list-card-wrapper");
            if ($wrapper.length && IScroll) {
                _myScroll = new IScroll($wrapper[0], {
                    probeType: 2,
                    mouseWheel: true, // 允许滑轮滚动
                    preventDefault: false
                });
                _myScroll.on("scroll", function () {
                    if (_loadingStep == 0 && !$pullDown.attr("class").match("flip|loading") && !$pullUp.attr("class").match("flip|loading")) {
                        if (this.y > 5) {
                            // 下拉刷新效果
                            handleScroll($pullDown);
                        }
                        else if (this.y < (this.maxScrollY - 5)) {
                            // 上拉刷新效果
                            handleScroll($pullUp);
                        }
                    }
                });
                _myScroll.on("scrollEnd", function () {
                    if (_loadingStep == 1) {
                        if ($pullDown.attr("class").match("flip|loading")) {
                            handleScrollEnd($pullDown);
                            handlePullDown();
                        }
                        else if ($pullUp.attr("class").match("flip|loading")) {
                            handleScrollEnd($pullUp);
                            handlePullUp();
                        }
                    }
                });
            }
        }

        function handleScroll($pullAction) {
            $pullAction.show();
            _myScroll.refresh();
            $pullAction.addClass("flip");
            $pullAction.find(".pull-label").html("准备刷新...");
            _loadingStep = 1;
        }

        function handleScrollEnd($pullAction) {
            $pullAction.removeClass("flip").addClass("loading");
            $pullAction.find(".pull-label").html("加载中...");
            _loadingStep = 2;
        }

        function handlePullDown() {
            setTimeout(function () {
                $pullDown.find(".pull-label").html("下拉显示更多...");
                handlePull($pullDown);
            }, 1000);
        }

        function handlePullUp() {
            setTimeout(function () {
                if (getNavState().canGotoNext) $list.trigger("changePage", { pageSize: config.pageInfo.pageSize, pageIndex: config.pageInfo.pageIndex + 1 });
                $pullUp.find(".pull-label").html("上拉显示更多...");
                handlePull($pullUp);
            }, 1000);
        }

        function handlePull($pullAction) {
            $pullAction.removeClass("loading");
            $pullAction.attr("class", "").hide();
            _myScroll.refresh();
            _loadingStep = 0;
        }

        this.on = function (eventName, func, context) {
            var event = function (e, args) {
                func.call(context, args);
            };
            _events[func] = event;
            $list.bind(eventName, event);
        };

        this.un = function (eventName, func) {
            var event = _events[func];
            if (!event) return;
            $list.unbind(eventName, event);
        };

        this.setData = function (data) {
            for (var attr in data) {
                var attrUpper = attr.substring(0, 1).toUpperCase() + attr.substring(1);
                if (attr == "Rows") continue;
                if (this["set" + attrUpper]) this["set" + attrUpper](data[attr]);
            }
            if (data["Rows"]) this.setDataSource(data["Rows"]);
        };

        this.setMode = function (mode) {
            config.mode = mode;
        };

        this.setColumns = function (columns) {
            var fields = {};
            var hasSet = false;
            var iterator = 0;
            for (var index in columns) {
                var column = columns[index];
                column.position = _positionMap[iterator++];
                if (!column.position) continue;
                fields[column.position + "Field"] = index;
                hasSet = true;
            }
            if (hasSet && !_hasSetFields)
                this.setFields(fields);
        };

        this.setStateChange = function (data) {
            if (data.PropertyName === "fields")
                this.setFields(data.Value);
        };

        this.setFields = function (fields) {
            _hasSetFields = true;
            config.fields = $.extend(true, {}, config.fields, fields);
        };

        this.setPageInfo = function (pageInfo) {
            config.pageInfo = pageInfo;
        };

        this.setRows = this.setDataSource = function (dataSource, needEmpty) {
            if (!cb.isArray(dataSource)) return;
            if (needEmpty == null || needEmpty === true) {
                $list.empty();
                rowsCache = {};
            }
            switch (config.mode) {
                case "archives":
                    constructArchives(dataSource);
                    break;
                case "vouchers":
                    constructVouchers(dataSource);
                    break;
                case "menus":
                    constructMenus(dataSource);
                    break;
                case "contacts":
                    constructContacts(dataSource);
                    break;
                case "tiles":
                    constructTiles(dataSource);
                    break;
            }
            if (_myScroll) _myScroll.refresh();
        };

        this.setPageRows = function (data) {
            switch (data.mode) {
                case "override":
                    this.setDataSource(data.currentPageData, true);
                    break;
                case "append":
                    this.setDataSource(data.currentPageData, false);
                    break;
                default:
                    this.setDataSource(data.currentPageData, true);
                    break;
            }
        };

        this.setInsert = function (data) {
            // .Row .Value
            if (!data) return;
            switch (config.mode) {
                case "archives":
                    constructArchiveListItem(data.Row, data.Value);
                    break;
            }
        };

        this.setCellValueChange = function (data) {
            // .Row .CellName .Value
            if (!data || !rowsCache[data.Row]) return;
            switch (data.CellName) {
                case config.fields.leftTopField:
                    rowsCache[data.Row].leftTop.html(data.Value);
                    break;
                case config.fields.rightTopField:
                    rowsCache[data.Row].rightTop.html(data.Value);
                    break;
                case config.fields.leftBottomField:
                    rowsCache[data.Row].leftBottom.html(data.Value);
                    break;
                case config.fields.rightBottomField:
                    rowsCache[data.Row].rightBottom.html(data.Value);
                    break;
            }
        };

        this.setSelectedItem = function (itemData) {
            var $children = $list.children();
            for (var i = 0, len = $children.length; i < len; i++) {
                var $li = $($children[i]);
                if ($li.data("itemData") === itemData)
                    $li.addClass("selected");
                else
                    $li.removeClass("selected");
            }
        };

        function getNavState() {
            var pageInfo = config.pageInfo;
            return {
                canGotoPrev: pageInfo.pageSize != 0 && pageInfo.pageIndex > 1,
                canGotoNext: pageInfo.pageSize != 0 && pageInfo.pageIndex < pageInfo.pageCount
            };
        }

        function constructArchives(dataSource) {
            $list.addClass("cube-list-card-outer-container-archives");
            for (var i = 0, len = dataSource.length; i < len; i++) {
                constructArchiveListItem(i, dataSource[i]);
            }
        }

        function constructArchiveListItem(index, itemData) {       	
            var $li = $("<li></li>").data("itemData", itemData).click(handleClick).appendTo($list); //在dom对象上记录ViewModel中对象数据会造成缓存泄露？？？
            var $firstRow = $("<div class='first-row'></div>").appendTo($li);
            var $leftTop = $("<span class='left-top'></span>").appendTo($firstRow);
            var $rightTop = $("<span class='right-top'></span>").appendTo($firstRow);
            var $leftBottom = $("<span class='left-bottom'></span>").appendTo($firstRow);
            var $rightBottom = $("<span class='right-bottom'></span>").appendTo($firstRow);
            $leftTop.html(getTextData(itemData, config.fields.leftTopField));
            $rightTop.html(getTextData(itemData, config.fields.rightTopField));
            $leftBottom.html(getTextData(itemData, config.fields.leftBottomField));
            $rightBottom.html(getTextData(itemData, config.fields.rightBottomField));

            rowsCache[index] = { data: itemData, leftTop: $leftTop, rightTop: $rightTop, leftBottom: $leftBottom, rightBottom: $rightBottom }; //行缓存有可能内存泄漏


            //后期考虑优化用简洁方式--可以引入模版编译等
            //var innerHtml = "<li><div class='first-row'><span class='left-top'>{0}</span><span class='right-top'>{1}</span><span class='left-bottom'>{2}</span><span class='right-bottom'>{3}</span></div></li>";
            //innerHtml = innerHtml.replace("{0}", getTextData(itemData, config.fields.leftTopField));
            //innerHtml = innerHtml.replace("{1}", getTextData(itemData, config.fields.rightTopField));
            //innerHtml = innerHtml.replace("{2}", getTextData(itemData, config.fields.leftBottomField));
            //innerHtml = innerHtml.replace("{3}", getTextData(itemData, config.fields.rightBottomField));
        }

        function getTextData(itemData, field) {
            return (field && itemData[field] != null) ? itemData[field] : "&nbsp;";
        }

        function constructVouchers(dataSource) {
            $list.addClass("cube-list-card-outer-container-vouchers");
            for (var i = 0, len = dataSource.length; i < len; i++) {
                constructVoucherListItem(dataSource[i]);
            }
        }

        function constructVoucherListItem(itemData) {
            var $li = $("<li></li>").data("itemData", itemData).click(handleClick).appendTo($list); //在dom对象上记录ViewModel中对象数据会造成缓存泄露？？？
            var $firstRow = $("<div class='first-row'></div>").appendTo($li);
            var $leftTop = $("<span class='left-top'></span>").appendTo($firstRow);
            var $rightTop = $("<span class='right-top'></span>").appendTo($firstRow);
            var $leftBottom = $("<span class='left-bottom'></span>").appendTo($firstRow);
            var $rightBottom = $("<span class='right-bottom'></span>").appendTo($firstRow);
            $leftTop.html(getTextData(itemData, config.fields.leftTopField));
            $rightTop.html(getTextData(itemData, config.fields.rightTopField));
            $leftBottom.html(getTextData(itemData, config.fields.leftBottomField));
            $rightBottom.html(getTextData(itemData, config.fields.rightBottomField));

            $("<span class='ui-bar-off'></span>").click(handleVouchersSecondRowSwitch).appendTo($firstRow);

            var $secondRow = $("<div class='second-row'></div>").appendTo($li);
            var $leftStatus = $("<div class='left-status'></div>").appendTo($secondRow);
            var statusField = config.fields.statusField;
            if (statusField && itemData[statusField] != null) constructStatusField(itemData[statusField], $leftStatus);
            var $rightAction = $("<div class='right-action'></div>").appendTo($secondRow);
            $("<div><span class='img-submit'></span></div>").click(function (e) { handleListItemClick(e, "submit"); }).appendTo($rightAction);
            $("<div><span class='img-interest'></span></div>").click(function (e) { handleListItemClick(e, "interest"); }).appendTo($rightAction);

            $secondRow.hide();

            var $floatToolbar = $("<span class='three-row'></span>").appendTo($li);


            var $copyButton = $("<span class='copy-Button'></span>").click(function (e) { handleListItemClick(e, "copy"); }).appendTo($floatToolbar);
            var $copyButton = $("<span class='edit-Button'></span>").click(function (e) { handleListItemClick(e, "edit"); }).appendTo($floatToolbar);
            var $copyButton = $("<span class='delete-Button'></span>").click(function (e) { handleListItemClick(e, "delete"); }).appendTo($floatToolbar);

            $floatToolbar.hide();
            //event.preventDefault(); 
            var sx = 0, sy = 0, cx = 0, cy = 0;
            $li[0].addEventListener('touchstart', function (evt) {
                //当前位于屏幕上的所有手指列表中的第一个的坐标
                sx = evt.touches[0].screenX;
                sy = evt.touches[0].screenY;
            }, false);
            $li[0].addEventListener('touchmove', function (evt) {
                cx = evt.touches[0].screenX;
                cy = evt.touches[0].screenY;
                //console.log(evt.changedTouches[0].pageY)
            }, false);
            $li[0].addEventListener('touchend', function (evt) {
                //手指滑动距离横向超过屏幕三分之一且纵向小于屏幕三分之一时才执行，防止误操作
                //alert();
                //if((cx < sx) && (sx - cx > flag.w) && (Math.abs(cy - sy) < flag.h)) {
                if (cx - sx < -20) {
                    $li.children("span").show();
                }
                if (cx - sx > 20) {
                    $li.children("span").hide();
                }
                //$li.children("span").taggle();
                //} else if((sx < cx) && (cx - sx > flag.w) && (Math.abs(cy - sy) < flag.h)) {
                //$li[0].children("span").hide()
                //}
            }, false);
        }

        function constructMenus(dataSource) {
            $list.addClass("cube-list-card-outer-container-menus");
            for (var i = 0, len = dataSource.length; i < len; i++) {
                constructMenuListItem2(dataSource[i]);
            }
            handleClick();
        }

        function constructMenuListItem(itemData) {
            var $li = $("<li></li>").data("itemData", itemData).click(handleClick).appendTo($list);
            var styles = $(itemData.content).attr("class");
            var style = styles.split(" ")[1];
            $("<span class='img-" + style + "'></span>").appendTo($li);
            if (itemData.title) {
                $("<span class='text'>" + itemData.title + "</span>").appendTo($li);
            }
            if (itemData.isSelected) $defaultSelectedListItem = $li;
        }

        function constructMenuListItem2(itemData) {
            var $li = $("<li></li>").data("itemData", itemData).click(handleClick).appendTo($list);
            if (itemData.appId === "homepage") {
                $("<span class='img-homepage'></span>").appendTo($li);
                return;
            }
            if (itemData.image)
                $("<span class='img-' style='content:url(\"./pad/images/menu/" + itemData.image + "\");'></span>").appendTo($li);
            if(!itemData.image)
                $("<span class='img-' style='content:url(\"./pad/images/menu/u8report.png\");'></span>").appendTo($li);
            if (itemData.displayName)
                $("<span class='text'>" + itemData.displayName + "</span>").appendTo($li);
            if (itemData.isSelected) $defaultSelectedListItem = $li;
        }

        function constructTiles(dataSource) {
            $list.addClass("scroller");
            var itemHorizontalNum = 4, itemVertocalNum = 2;
            for (var i = 0, len = dataSource.length; i < len; i++) {
                if (cb.rest.ApplicationContext.Size === "L") {
                    constructTileListItem3(dataSource[i]);
                } else {
                    constructTileListItem2(dataSource[i], i, len, itemHorizontalNum, itemVertocalNum);
                }

            }
            if ($.fn.crlPosition) {
                $list.crlPosition({ master: $list.attr("id"), itemHorizontalNum: itemHorizontalNum, itemVertocalNum: itemVertocalNum });
                //$list.parent().parent().siblings(".indicator").css("width",Math.ceil((dataSource.length-1)/9)*30)
                //$(".indicator").css("width",Math.ceil((dataSource.length-1)/9)*30);
            }
            //alert(cb.broswerJudge.getBroswerSize());

        }

        function constructTileListItem(itemData, i, len, itemHorizontalNum, itemVertocalNum) {
            var styles = $(itemData.content).attr("class");
            var style = styles.split(" ")[1];
            var resStyle = style.substr(4, style.length - 1)
            if (i % 3 == 0) {
                var $li = $("<li></li>").addClass("background-blank").appendTo($list);
                //$("<a>"+itemData.title+"</a>").appendTo($li);
            }
            var $li = $("<li></li>").data("itemData", itemData).addClass("background-" + itemData.style).click(handleClick).appendTo($list);
            $("<a>" + itemData.title + "</a>").appendTo($li);
        }

        function constructTileListItem3(itemData) {
            var $li = $("<li></li>").data("itemData", itemData).click(handleClick).appendTo($list);
            if (itemData.image)
                $li.css("background", "url('pc/images/menu/" + itemData.image + "') no-repeat center 16px");
            if(!itemData.image)
            	$li.css("background", "url('pc/images/menu/u8report.png') no-repeat center 16px");
            var $a = $("<a>" + itemData.displayName + "</a>").appendTo($li);
        }

        function constructTileListItem2(itemData, i, len, itemHorizontalNum, itemVertocalNum) {
            if (i % 3 == 0)
                $("<li class='background-blank'></li>").appendTo($list);
            var $li = $("<li></li>").data("itemData", itemData).click(handleClick).appendTo($list);
            if (itemData.bgcolor)
                $li.css("background-color", "#" + itemData.bgcolor);
            var $a = $("<a>" + itemData.displayName + "</a>").appendTo($li);
            if (itemData.image)
                $a.css("background-image", "url(pad/images/menu/" + itemData.image + ")");
            if(!itemData.image)
            	$a.css("background-image", "url(pad/images/menu/u8report.png)");

            if ((i == (len - 1))) {
                var sum = Math.ceil(len / ((itemHorizontalNum - 1) * itemVertocalNum)) * itemHorizontalNum * itemVertocalNum
                var overplus = itemHorizontalNum * itemVertocalNum - Math.ceil(len % ((itemHorizontalNum - 1) * itemVertocalNum) / itemHorizontalNum) - (len % ((itemHorizontalNum - 1) * itemVertocalNum));
                for (var j = 0; j < overplus; j++) {
                    $("<li class='background-blank'></li>").appendTo($list);
                }
                //alert("sum:" + sum + ",overplus:" + overplus + "(Math.ceil(len % ((itemHorizontalNum - 1) * itemVertocalNum)) / itemHorizontalNum):" + Math.ceil((len % ((itemHorizontalNum - 1) * itemVertocalNum)) / itemHorizontalNum));
                //$("<li class='background-blank'></li>").appendTo($list);
            }

        }

        function constructContacts(dataSource) {
            $list.addClass("cube-list-card-outer-container-contacts");
            for (var i = 0, len = dataSource.length; i < len; i++) {
                constructContactListItem(dataSource[i]);
            }
        }

        function constructContactListItem(itemData) {
            var $li = $("<li></li>").data("itemData", itemData).click(handleClick).appendTo($list);
            var statusField = config.fields.statusField;
            if (statusField && itemData[statusField] === true) $("<div class='ui-list-sign'></div>").appendTo($li);

            var $content = $("<div class='ui-list-content'></div>").appendTo($li);
            var $leftContent = $("<div class='ui-content-left'></div>").appendTo($content);
            var $leftTop = $("<span></span>").appendTo($leftContent);
            var leftTopField = config.fields.leftTopField;
            if (leftTopField && itemData[leftTopField] != null) $leftTop.html(itemData[leftTopField]);
            var $leftBottom = $("<span></span>").appendTo($leftContent);
            var leftBottomField = config.fields.leftBottomField;
            if (leftBottomField && itemData[leftBottomField] != null) $leftBottom.html(itemData[leftBottomField]);
            var $rightContent = $("<div class='ui-content-right'></div>").appendTo($content);
            var $rightTopText = $("<span class='sp-left-top'></span>").appendTo($rightContent);
            var rightTopField = config.fields.rightTopField;
            if (rightTopField && typeof rightTopField == "object") {
                var code = rightTopField["code"];
                var name = rightTopField["name"];
                if (code && name && itemData[code] != null) $rightTopText.html(name + ": " + itemData[code]);
            }
            $("<span class='sp-right-top'></span>").click(function (e) { handleListItemClick(e, "tel"); }).appendTo($rightContent);
            var $rightBottomText = $("<span class='sp-left-bottom'></span").appendTo($rightContent);
            var rightBottomField = config.fields.rightBottomField;
            if (rightBottomField && typeof rightBottomField == "object") {
                var code = rightBottomField["code"];
                var name = rightBottomField["name"];
                if (code && name && itemData[code] != null) $rightBottomText.html(name + ": " + itemData[code]);
            }
            $("<span class='sp-right-bottom'></span>").click(function (e) { handleListItemClick(e, "addr"); }).appendTo($rightContent);
            $("<span class='ui-bar-off'></span>").click(handleContactsToolbarSwitch).appendTo($rightContent);

            var $toolbar = $("<div class='ui-list-toolbar'></div>").appendTo($li);
            var $toolbarItem = $("<div class='ui-toolbar-item'></div").appendTo($toolbar);
            $("<div class='ui-item-msg'></div>").click(function (e) { handleListItemClick(e, "msg"); }).appendTo($toolbarItem);
            $("<div class='ui-item-uu'></div>").click(function (e) { handleListItemClick(e, "uu"); }).appendTo($toolbarItem);
            $("<div class='ui-item-weixin'></div>").click(function (e) { handleListItemClick(e, "weixin"); }).appendTo($toolbarItem);
            $("<div class='ui-item-weibo'></div>").click(function (e) { handleListItemClick(e, "weibo"); }).appendTo($toolbarItem);

            $toolbar.hide();
            $li.addClass("toolbar-hide");
        }

        function handleListItemClick(event, type) {      	
            var $li = $(event.target).closest("li");
            $li.parent().trigger("itemClick", { type: type, data: $li.data("itemData") });
            event.stopPropagation();
        }

        function handleVouchersSecondRowSwitch(e, args) {
            var $target = $(e.target);
            var $toolbar = $target.closest("li").children(".second-row");
            if ($toolbar.is(":hidden")) {
                $toolbar.show();
                $target.removeClass("ui-bar-off");
                $target.addClass("ui-bar-on");
            }
            else {
                $toolbar.hide();
                $target.removeClass("ui-bar-on");
                $target.addClass("ui-bar-off");
            }
            e.stopPropagation();
        }

        function handleContactsToolbarSwitch(e, args) {
            var $target = $(e.target);
            var $li = $target.closest("li");
            var $toolbar = $li.children(".ui-list-toolbar");
            if ($toolbar.is(":hidden")) {
                $toolbar.show();
                $li.removeClass("toolbar-hide");
                $li.addClass("toolbar-show");
                $target.removeClass("ui-bar-off");
                $target.addClass("ui-bar-on");
            }
            else {
                $toolbar.hide();
                $li.removeClass("toolbar-show");
                $li.addClass("toolbar-hide");
                $target.removeClass("ui-bar-on");
                $target.addClass("ui-bar-off");
            }
            e.stopPropagation();
        }

        function constructStatusField(fieldData, $status) {
            switch (fieldData) {
                case -1:
                    $("<span class='img-free'></span><span>自由</span>").appendTo($status);
                    break;
                case 0:
                    $("<span class='img-obsolete'></span><span>审批未通过</span>").appendTo($status);
                    break;
                case 1:
                    $("<span class='img-reviewed'></span><span>审批通过</span>").appendTo($status);
                    break;
                case 2:
                    $("<span class='img-reviewing'></span><span>审批中</span>").appendTo($status);
                    break;
                case 3:
                    $("<span class='img-commit'></span><span>已提交</span>").appendTo($status);
                    break;
            }
        }

        function handleClick(e, args) {
            var $li;           
            if (!e) $li = $defaultSelectedListItem;            
            else $li = $(e.target).closest("li");
            if (!$li || !$li.length) return;
            //if ($li.get(0) === _lastClickItem) return;
            _lastClickItem = $li.get(0);
            if (e) $li.parent().trigger("itemClick", { type: "common", data: $li.data("itemData") });
            $li.addClass("selected");
            $li.siblings().removeClass("selected");  
        }
        init();
    }
})(jQuery);