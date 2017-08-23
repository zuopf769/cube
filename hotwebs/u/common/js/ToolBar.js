/// <reference path="../Control.js" />

cb.controls.widget("ToolBar", function (controlType) {
    var control = function (id, options) {
        cb.controls.Control.call(this, id, options);
        var $elem = this.getElement();
        var $openContainer = $(".cube-bar-open-container", $elem);
        var $closeContainer = $(".cube-bar-close-container", $elem);
        if (!$openContainer.length || !$closeContainer.length) return;
        this._set_data("$openContainer", $openContainer);
        this._set_data("$closeContainer", $closeContainer);
        $(document).on("click.bs.toolbar.data-api", function (e) {
            $closeContainer.hide();
        });
        var totalWidth = $elem.outerWidth();
        var currentWidth = 0;
        var val = 0;
        var childrenCount = $openContainer.children().length;
        for (var i = 0; i < childrenCount; i++) {
            currentWidth += $($openContainer.children()[i]).outerWidth();
            if (currentWidth + 40 >= totalWidth) {
                val = i;
                break;
            }
        }
        if (val)
            this.setToolBar(val);
    };

    control.prototype = new cb.controls.Control();
    control.prototype.controlType = controlType;

    control.prototype.setToolBar = function (val) {
        var $openContainer = this._get_data("$openContainer");
        var $closeContainer = this._get_data("$closeContainer");
        if (!$openContainer || !$closeContainer) return;
        var openChildrenCount = $openContainer.children().length;
        var closeChildrenCount = $closeContainer.children().length;
        if (openChildrenCount > val) {
            if ($("li:last-child div", $openContainer).length != 0) {
                //创建else btn 并加入DOM
                var $op_btn = $("<li><div><span class=\"else-icon\"></span><span></span></li></div>");

                $op_btn.on("click", function (e) {
//                  $closeContainer.css("top", e.pageY + 10);
//                  $closeContainer.css("left", e.pageX - 20);
                    $closeContainer.css("top", $(this).offset().top+$(this).height());
                    $closeContainer.css("left", $(this).offset().left);
                    $closeContainer.toggle();
                    e.stopPropagation();
                });
                $("li:eq(" + (val - 1) + ")", $openContainer).before($op_btn);

                for (var i = openChildrenCount; i >= val; i--) {
                    $($openContainer.children()[i]).prependTo($closeContainer);
                }
            }
            else {
                while (openChildrenCount > val) {
                    $("li:last-child", $openContainer).prev().prependTo($closeContainer);
                }
            }
        }
        else if (openChildrenCount < val) {
            if (val >= (closeChildrenCount + openChildrenCount - 1)) {
                $closeContainer.hide();
                if ($("li:last-child>span", $openContainer).length != 0) {
                    $("li:last-child", $openContainer).remove();
                }
                while ($closeContainer.children().length > 0) {
                    $("li:first-child", $closeContainer).appendTo($openContainer);
                }
            }
            else {
                $closeContainer.children().each(function () {
                    $("li:last-child", $openContainer).before($(this));
                    if ($openContainer.children().length >= val) return false;
                });
            }
        }
    };

    control.prototype.Init = function () {

        if (this.getElement().hasClass('cube-bar-modeltxt') || this.getElement().hasClass('cube-bar-modelicon')) {

            var list = this.getElement().children();
            for (var i = 0; i < list.length; i++) {
                var _name = $(list[i]).children().attr('data-name');
                var _childlist = list.find('[data-name=' + _name + ']');
                if (_childlist.length > 0) {
                    if (i != 0) {
                        this.getElement().hasClass('cube-bar-modeltxt') ? $(list[i]).css("margin-left", "3px") : $(list[i]).css("border-left", "1px solid #999");
                    }

                    i += _childlist.length - 1;
                }
            }
        }
    };

    return control;
});