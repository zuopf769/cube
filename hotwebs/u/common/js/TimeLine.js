(function ($) {
    $.extend(true, window, {
        "cb": {
            "controls": {
                "TimeLine": TimeLine
            }
        }
    });

    function TimeLine(element, options) {
        var $container;
        var _events = {};
        var _lastClickItem;

        function init() {
            if (typeof element == "object") $container = element;
            else $container = $("#" + element);
        }

        this.on = function (eventName, func, context) {
            var event = function (e, args) {
                func.call(context, args);
            };
            _events[func] = event;
            $container.bind(eventName, event);
        };

        this.un = function (eventName, func) {
            var event = _events[func];
            if (!event) return;
            $container.unbind(eventName, event);
        };

        this.setData = function (data) {
            if (data["dataSource"]) this.setDataSource(data["dataSource"]);
        };

        this.setDataSource = function (dataSource) {
            if (!cb.isArray(dataSource)) return;
            $container.empty();
            $container.addClass("timeline-container");
            var len = dataSource.length;
            var percent = Math.floor(100 / (len + 1));
            $("<div class='start-point'><div class='start-point-heart'></div></div>").appendTo($container);
            for (var i = 0; i < len; i++) {
                constructListItem(dataSource[i], percent * (i + 1));
            }
            $("<div class='end-point'></div>").appendTo($container);
        };

        function constructListItem(itemData, topPercent) {
            var $div = $("<div class='middle-point' style='top:" + topPercent + "%;'></div>").data("itemData", itemData).click(handleClick).appendTo($container);
            var $img = $("<span class='" + (itemData.css || "img-common") + "'></span><span class='text'>" + itemData.title + "</span>").appendTo($div);
        }

        function handleClick(e, args) {
            var $target = $(e.target);
            $target = $target.closest(".middle-point");
            if ($target.get(0) !== _lastClickItem) {
                _lastClickItem = $target.get(0);
                $container.trigger("itemClick", $target.data("itemData"));
            }
        }

        init();
    }
})(jQuery);

var TimeLineData = [
    { title: "今天", css: "img-today" },
    { title: "昨天", css: "img-yesterday" },
    { title: "上周" },
    { title: "两周" },
    { title: "三周" },
    { title: "本月" },
    { title: "上月" },
    { title: "更早" }
];