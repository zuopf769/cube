
(function ($) {
    $.extend(true, window, {
        "cb": {
            "controls": {
                "SearchBox": SearchBox
            }
        }
    });

    function SearchBox(element, options) {

        var $input = null;
        var $div = null;

        if (typeof element == "object") $div = element;
        else $div = $("#" + element);

        $input = $div.find("input");

        if ($input == null) {
            return null;
        }
      

        this.$input = $input;
        this.$div = $div;

        this.options = options || {};
        for (var option in this._options) {
            if (option == "defaultValue") {
                this.setValue(this.options[option]);
            }
        }

        this.$searchBtn = $div.find("span");

        this.events = {};

        var control = this;
        this.$input.on('focus', function (evt) {
            var that = this;
            setTimeout(function () { $(that).select(); }, 0);
        });
        this.$input.on('keydown', function (e) {
            var key = e.which || e.charCode || e.keyCode;
            if (key == null) {
                return false;
            }
            if (key == 13) {
                control.$searchBtn.click();
                e.preventDefault();
                e.stopPropagation();
            }
        });
    }

    SearchBox.prototype.getValue = function () {
        return this.$input.val();
    }

    SearchBox.prototype.setValue = function (value) {
        return this.$input.val(value);
    }

    SearchBox.prototype.on = function (eventName, func, context) {
        if (eventName == "change") {
            this.$input[0].onchange = $.proxy(func,context||this);
        }
        else if (eventName == "click") {
            this.$div.click(func);
        }
        else if (eventName == "search") {
            var self = this;
            var event = function () {
                var searchString = self.getValue();
                //if (!searchString) return;                
                func.call(context, searchString);
            };
            this.events[func] = event;
            //this.$div.bind("click", event);
            this.$searchBtn.bind("click", event);
        }
    }

    SearchBox.prototype.un = function (eventName, func) {
        if (eventName == "search") {
            var event = this.events[func];
            if (!event) return;
            this.$div.unbind("click", event);
        }
    }

    SearchBox.prototype.setReadOnly = function (val) {
        this.$input.attr("readonly", "true");
    };

    SearchBox.prototype.setEnabled = function (val) {
        if (val == true) {
            this.$input.removeAttr("disabled");
            this.$div.removeAttr("disabled");
        }
        else {
            this.$input.attr("disabled", "true");
            this.$div.attr("disabled", "true");
        }
    };

    SearchBox.prototype.setDisabled = function (val) {
        this.setEnabled(val);
    };


    SearchBox.prototype.resetValue = function () {
        this.$input.value(this.options.defaultValue);
    };
    SearchBox.prototype.setPlaceholder = function (value) {
        this.$input.attr('placeholder', value);
    };

})(jQuery);