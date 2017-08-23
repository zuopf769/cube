/// <reference path="../Control.js" />

cb.controls.widget("NumberBox", function (controlType) {
    if (!$.browser) {
        $.browser = {};
        $.browser.mozilla = /mozilla/.test(navigator.userAgent.toLowerCase()) && !/webkit/.test(navigator.userAgent.toLowerCase());
        $.browser.webkit = /webkit/.test(navigator.userAgent.toLowerCase());
        $.browser.opera = /opera/.test(navigator.userAgent.toLowerCase());
        $.browser.msie = /msie/.test(navigator.userAgent.toLowerCase());
    }
    if (!$.os) {
        $.os = {};
        $.os.macintosh = /macintosh/.test(navigator.userAgent.toLowerCase());
    }
    var self;


    function innerInit($input,settings) {
            // event.stopPropagation()
            // event.preventDefault()
            // return false = event.stopPropagation() + event.preventDefault()
            function handleKeyPress(e, args) {
                var key = e.which || e.charCode || e.keyCode;
                if (key == null) {
                    return false;
                }
                if (key < 48 || key > 57) {
                    e.preventDefault();
                    return true;
                }
                else if (hasReachedMaxLength($input)) {
                    return false;
                }
                else {
                    e.preventDefault();
                    var currentKey = String.fromCharCode(key);
                    var input = $input.get(0);
                    var selection = getInputSelection(input);
                    var startPos = selection.start;
                    var endPos = selection.end;
                    var inputString = input.value.substring(0, startPos) + currentKey + input.value.substring(endPos, input.value.length);
                    var originalLength = inputString.length;
                    inputString = maskValue(inputString);
                    var newLength = inputString.length;
                    if (checkValue(inputString) && checkValid(inputString)) {
                        input.value = inputString;
                        var cursorPos = startPos + 1 - (originalLength - newLength);
                        setCursorPosition(cursorPos);
                        return false;
                    }
                }
            }

            var timer;
            var imeKey = $.browser.opera ? 197 : 229;

            function handleKeyDown(e, args) {
                var key = e.which || e.charCode || e.keyCode;
                if (key == null) {
                    return false;
                }
                clearInterval(timer);
                if (key == imeKey || $.browser.mozilla && $.os.macintosh) {
                    timer = setInterval(checkTextValue, 50);
                }
            }

            function checkTextValue() {
                var input = $input.get(0);
                var selection = getInputSelection(input);
                var startPos = selection.start;
                var endPos = selection.end;
                var inputString = input.value.substring(0, startPos) + input.value.substring(endPos, input.value.length);
                var originalLength = inputString.length;
                inputString = maskValue(inputString);
                var newLength = inputString.length;
                if (checkValue(inputString) && checkValid(inputString)) {
                    input.value = inputString;
                    var cursorPos = startPos + 1 - (originalLength - newLength);
                    setCursorPosition(cursorPos);
                }
            }

            function checkValue(inputString) {
                var precision = (settings.scale == 0) ? settings.precision : settings.precision + 1;
                if (inputString.length <= precision) {
                    var lMin = false;
                    if (settings.minValue != null) {
                        lMin = parseFloat(inputString) < settings.minValue;
                    }
                    var gMax = false;
                    if (settings.maxValue != null) {
                        gMax = parseFloat(inputString) > settings.maxValue;
                    }
                    return (lMin || gMax) ? false : true;
                }
                else {
                    return false;
                }
            }

            function checkValid(inputString) {
                if (settings.validNumbers != null) {
                    var numbers = settings.validNumbers;
                    if (numbers.length) {
                        var currentNumber = parseFloat(inputString);
                        for (var i = 0; i < numbers.length; i++) {
                            if (numbers[i] == currentNumber) return true;
                        }
                        return false;
                    }
                }
                return true;
            }

            function hasReachedMaxLength(element) {
                var reachedMaxLength = (element.val().length >= settings.maxLength && settings.maxLength >= 0);
                var selection = getInputSelection(element.get(0));
                var start = selection.start;
                var end = selection.end;
                var hasNumberSelected = (selection.start != selection.end && element.val().substring(start, end).match(/\d/)) ? true : false;
                return reachedMaxLength && !hasNumberSelected;
            }

            function handleBlur(e, args) {
                if ($input.val() == "" || $input.val() == getDefaultMask()) {
                    $input.val(getDefaultMask());
                }
                if ($input.change) {
                    $input.change();
                }
            }

            function maskValue(v) {
                var strCheck = "0123456789";
                var len = v.length;
                var a = "", t = "";
                for (var i = 0; i < len; i++) {
                    if ((v.charAt(i) != "0") && (v.charAt(i) != settings.decimal)) break;
                }
                for (; i < len; i++) {
                    if (strCheck.indexOf(v.charAt(i)) != -1) a += v.charAt(i);
                }
                var n = parseFloat(a);
                n = isNaN(n) ? 0 : n / Math.pow(10, settings.scale);
                t = n.toFixed(settings.scale);
                return t;
            }

            function getDefaultMask() {
                var n = parseFloat("0") / Math.pow(10, settings.scale);
                return n.toFixed(settings.scale);
            }

            function setCursorPosition(pos) {
                $input.each(function (index, elem) {
                    if (elem.setSelectionRange) {
                        elem.focus();
                        elem.setSelectionRange(pos, pos);
                    }
                });
            };

            function getInputSelection(element) {
                var start = 0, end = 0;
                if (typeof element.selectionStart == "number" && typeof element.selectionEnd == "number") {
                    start = element.selectionStart;
                    end = element.selectionEnd;
                }
                return { start: start, end: end };
            }

            function getValueInner() {
                var tempVal = $input.val();
                tempVal = parseFloat(tempVal);
                return tempVal;
            }

            $input.bind("keypress", handleKeyPress);
            $input.bind("keydown", handleKeyDown);
            $input.bind("blur", handleBlur);
            $input.bind("paste", function () { return false; });

            this.getValue = function () {
                return getValueInner();
            }

            this.setValue = function (val) {
                if (val == null || val == "" || isNaN(val)) val = 0;
                var result = val.toString();
                var temp = result;
                if (temp.indexOf(settings.decimal) != -1) {
                    var array = temp.split(settings.decimal);
                    if (array.length > 1) {
                        var subString = array[1];
                        var len = subString.length;
                        if (len < settings.scale) {
                            for (var i = 0; i < settings.scale - len; i++) {
                                subString += "0";
                            }
                            result = array[0] + settings.decimal + subString;
                        }
                    }
                }
                else {
                    for (var i = 0; i < settings.scale; i++) {
                        result += "0";
                    }
                }
                $input.val(maskValue(result));
            }

            this.on = function (eventName, func, context) {
                if (eventName != "onchange" && eventName != "change")
                    return;
                $input.bind("change", function () {
                    func.call(context);
                });
            }

            this.un = function (eventName) {
                if (eventName != "onchange" && eventName != "change") return;
                $input.unbind("change");
            }
        }

    var _innerInput;

    var control = function (id, options) {
        self = this;
        var settings = $.extend({
            decimal: ".",
            scale: 0,
            precision: 10
        }, options);
        
        cb.controls.Control.call(this, id, options);
        this._set_data("settings", settings);
        if (this.getElement().length)
            _innerInput = new innerInit(this.getElement(),settings);
    };
    control.prototype = new cb.controls.Control();
    control.prototype.controlType = controlType;

    control.prototype.getValue = function () {
        return _innerInput.getValue();
    };
    control.prototype.setValue = function (val) {
        _innerInput.setValue(val);
    };
    control.prototype.setData = function (data) {
        if (data["precision"] != null && !isNaN(data["precision"])) this._get_data("settings").precision = data["precision"];
        if (data["scale"] != null && !isNaN(data["scale"])) this._get_data("settings").scale = data["scale"];
        if (data["minValue"] != null && !isNaN(data["minValue"])) this._get_data("settings").minValue = data["minValue"];
        if (data["maxValue"] != null && !isNaN(data["maxValue"])) this._get_data("settings").maxValue = data["maxValue"];
        for (var attr in data) {
            var attrValue = data[attr];
            if (attr === "value" || attr === "defaultValue") {
                this.setValue(attrValue);
            }
            else if (attr === "readOnly") {
                this.setReadOnly(attrValue);
            }
            else if (attr === "nullable") {
                this.setNullable(attrValue);
            }
        }
    };

    control.prototype.on = function (eventName, func, context) {
        _innerInput.on(eventName,func,context);
    };
    control.prototype.un = function (eventName) { _innerInput.un(eventName); };

    return control;
});