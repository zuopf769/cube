(function ($) {

    $.extend(true, window, {
        "cb": {
            "controls": {
                "DropDown": Dropdown
            }
        }
    });

    // DROPDOWN CLASS DEFINITION
    // =========================

    var backdrop = '.dropdown-backdrop';
    var toggle = '[data-toggle="dropdown"]';

    var defaultOptions = {
        dataSource: [],
        dataType: "json",
        onItemClick: null,
        showSelected: true,
        fields: null,
        title: ""
    };

    function Dropdown(element, options) {
        var $elem = null;
        if (typeof (element) == "string") {
            $elem = $("#" + element);
        }
        else {
            $elem = element;
        }

        var title = $elem.attr("title") ? $elem.attr("title") : (options.title ? options.title : "");

        var a = "<a class='dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>" + title + "<span class='caret'></span></a>";

        var $a = $(a);

        $elem.append($a);

        $a.on('click.bs.dropdown', this.toggle);

        this.$dom = $elem;

        var opts = $.extend({}, defaultOptions, options);

        this.$options = opts;

        this.events = {};
    };

    Dropdown.prototype.setData = function (data) {
        for (var attr in data) {
            var attrUpper = attr.substring(0, 1).toUpperCase() + attr.substring(1);
            if (this["set" + attrUpper]) this["set" + attrUpper](data[attr]);
        }
    };

    Dropdown.prototype.setFields = function (fields) {
        this.$options.fields = fields;
    };

    Dropdown.prototype.on = function (eventName, func, context) {
        var event = function (e, args) {
            func.call(context, args);
        };
        this.events[func] = event;
        if (eventName === "itemClick") this.$options.onItemClick = event;
    };

    Dropdown.prototype.un = function (eventName, func) {
        var event = this.events[func];
        if (!event) return;
        if (eventName === "itemClick") this.$options.onItemClick = null;
    };

    Dropdown.prototype.toggle = function (e) {
        var $this = $(this);

        if ($this.is('.disabled, :disabled')) return;

        var $parent = getParent($this);
        var isActive = $parent.hasClass('open');

        clearMenus();

        if (!isActive) {
            if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
                // if mobile we use a backdrop because click events don't delegate
                $('<div class="dropdown-backdrop"/>')
                    .insertAfter($(this))
                    .on('click', clearMenus);
            }

            var relatedTarget = { relatedTarget: this };
            $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget));

            if (e.isDefaultPrevented()) return;

            $this
              .trigger('focus')
              .attr('aria-expanded', 'true');

            $parent
              .toggleClass('open')
              .trigger('shown.bs.dropdown', relatedTarget);
        }

        return false;
    }

    Dropdown.prototype.keydown = function (e) {
        if (!/(38|40|27)/.test(e.keyCode)) return

        var $this = $(this);

        e.preventDefault();
        e.stopPropagation();

        if ($this.is('.disabled, :disabled')) return;

        var $parent = getParent($this);
        var isActive = $parent.hasClass('open');

        if (!isActive || (isActive && e.keyCode == 27)) {
            if (e.which == 27) $parent.find(toggle).trigger('focus');
            return $this.trigger('click');
        }

        var desc = ' li:not(.divider):visible a';
        var $items = $parent.find('[role="menu"]' + desc + ', [role="listbox"]' + desc);

        if (!$items.length) return;

        var index = $items.index($items.filter(':focus'));

        if (e.keyCode == 38 && index > 0) index--;                      // up
        if (e.keyCode == 40 && index < $items.length - 1) index++;                      // down
        if (! ~index) index = 0;

        $items.eq(index).trigger('focus');
    }

    Dropdown.prototype.setDataSource = function (data) {
        if ($.isArray(data)) {
            this.$options.dataSource = data;
            var textField = this.$options.fields && this.$options.fields.textField;
            if (!textField) textField = "text";
            var $ul = $("<ul class='dropdown-menu'></ul>");

            for (var i = 0; i < data.length; i++) {
                var li = createElement(data[i], textField);
                if (li) {
                    $ul.append(li);
                    itemClick(this, li, data[i]);
                }
            }

            var data = this.$dom.data('bs.dropdown');
            if (data) {
                data.remove();
            }
            else {
                data = $ul;
                $ul.appendTo(this.$dom);
            }
        }
    }

    function itemClick(context, $li, data) {
        var self = context;
        $li.click(function (event) {

            if ($.isFunction(self.$options.onItemClick)) {
                self.$options.onItemClick(event, data);
            }
            for (var i = 0; i < self.$options.dataSource.length; i++) {
                var item = self.$options.dataSource[i];
                item.selected = false;
            };
            data.selected = true;
            $li.siblings().removeAttr("select");
            $li.attr("select", "true");
        });
    }

    function createElement(dataItem, textField) {
        var li = "";
        if (!dataItem[textField]) return;
        if (dataItem[textField] == "") {
            li = "<li class='divider'><li>";
        }
        else {
            li = "<li><a>" + dataItem[textField] + "</a></li>";
        }

        var $li = $(li);

        $li.data(dataItem);

        return $li;
    }

    function clearMenus(e) {
        if (e && e.which === 3) return;
        $(backdrop).remove();
        $(toggle).each(function () {
            var $this = $(this);
            var $parent = getParent($this);
            var relatedTarget = { relatedTarget: this };

            if (!$parent.hasClass('open')) return;

            $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget));

            if (e.isDefaultPrevented()) return;

            $this.attr('aria-expanded', 'false');
            $parent.removeClass('open').trigger('hidden.bs.dropdown', relatedTarget);
        })
    }

    function getParent($this) {
        var selector = $this.attr('data-target');

        if (!selector) {
            selector = $this.attr('href');
            selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, ''); // strip for ie7
        }

        var $parent = selector && $(selector);

        return $parent && $parent.length ? $parent : $this.parent();
    }

    // APPLY TO STANDARD DROPDOWN ELEMENTS
    // ===================================

    $(document)
      .on('click.bs.dropdown.data-api', clearMenus)
      .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
      .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle);

})(jQuery);


