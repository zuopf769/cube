// #region animation

$.fn.slideLeft = function (duration, timingFunction, delay, iterationCount) {
    duration = duration || 0;
    timingFunction = timingFunction || "ease";
    delay = delay || 0;
    iterationCount = iterationCount || 1;
    var self = $(this);
    if (self.is(":hidden")) self.show();
    var animation = "slideLeft " + duration + "ms " + timingFunction + " " + delay + "ms " + iterationCount;
    self.css({ "animation": animation, "-moz-animation": animation, "-webkit-animation": animation, "-o-animation": animation });
};

$.fn.slideRight = function (duration, timingFunction, delay, iterationCount) {
    duration = duration || 0;
    timingFunction = timingFunction || "ease";
    delay = delay || 0;
    iterationCount = iterationCount || 1;
    var self = $(this);
    setTimeout(function () {
        if (!self.is(":hidden")) self.hide();
    }, duration);
    var animation = "slideRight " + duration + "ms " + timingFunction + " " + delay + "ms " + iterationCount;
    self.css({ "animation": animation, "-moz-animation": animation, "-webkit-animation": animation, "-o-animation": animation });
};

$.fn.showHorizontal = function (params, direction) {
    var self = this;
    var name = params && params.name;
    if (!name) {
        var className = self.get(0).className;
        if (className === "" || className.split(" ").length > 1) return;
        name = className + "-show-" + direction;
    }
    var duration = (params && params.duration) || 500;
    var timingFunction = (params && params.timingFunction) || "ease";
    var delay = (params && params.delay) || 0;
    var iterationCount = (params && params.iterationCount) || 1;
    var animation = name + " " + duration + "ms " + timingFunction + " " + delay + "ms " + iterationCount + " both";
    if (self.is(":hidden")) self.show();
    self.css({ "animation": animation, "-moz-animation": animation, "-webkit-animation": animation, "-o-animation": animation });
};

$.fn.hideHorizontal = function (params, direction) {
    var self = this;
    var name = params && params.name;
    if (!name) {
        var className = self.get(0).className;
        if (className === "" || className.split(" ").length > 1) return;
        name = className + "-hide-" + direction;
    }
    var duration = (params && params.duration) || 500;
    var timingFunction = (params && params.timingFunction) || "ease";
    var delay = (params && params.delay) || 0;
    var iterationCount = (params && params.iterationCount) || 1;
    var animation = name + " " + duration + "ms " + timingFunction + " " + delay + "ms " + iterationCount + " both";
    setTimeout(function () {
        self.hide();
    }, duration);
    self.css({ "animation": animation, "-moz-animation": animation, "-webkit-animation": animation, "-o-animation": animation });
};

$.fn.showFromLeft2 = function (params) {
    this.showHorizontal(params, "from-left");
};

$.fn.hideToLeft2 = function (params) {
    this.hideHorizontal(params, "to-left");
};

$.fn.showFromRight2 = function (params) {
    this.showHorizontal(params, "from-right");
};

$.fn.hideToRight2 = function (params) {
    this.hideHorizontal(params, "to-right");
};

$.fn.toggleLeft2 = function (params) {
    if (this.is(":hidden"))
        this.showFromLeft2(params);
    else
        this.hideToLeft2(params);
};

$.fn.toggleRight2 = function (params) {
    if (this.is(":hidden"))
        this.showFromRight2(params);
    else
        this.hideToRight2(params);
};

$.fn.directLeft2 = function (params) {
    if (this.is(":hidden"))
        this.showFromLeft2(params);
    else
        this.hideToRight2(params);
};

$.fn.directRight2 = function (params) {
    if (this.is(":hidden"))
        this.showFromRight2(params);
    else
        this.hideToLeft2(params);
};

$.fn.showToLeft2 = function (params) {
    this.showHorizontal(params, "to-left");
};

$.fn.showToRight2 = function (params) {
    this.showHorizontal(params, "to-right");
};

// #endregion

// #region transition

$.fn.showFromLeft1 = function (duration) {
    var self = $(this);
    if (!self.is(":hidden")) return;
    duration = duration || 0;
    var propertyValue = self.width() || 500;
    self.css("left", -propertyValue);
    self.show();
    setTimeout(function () {
        var transition = "left " + duration + "ms";
        self.css({ "left": 0, "transition": transition, "-moz-transition": transition, "-webkit-transition": transition, "-o-transition": transition });
    }, 1);
};

$.fn.hideToLeft1 = function (duration) {
    var self = $(this);
    if (self.is(":hidden")) return;
    duration = duration || 0;
    var propertyValue = self.width() || 500;
    self.css("left", 0);
    setTimeout(function () {
        self.hide();
    }, duration);
    var transition = "left " + duration + "ms";
    self.css({ "left": -propertyValue, "transition": transition, "-moz-transition": transition, "-webkit-transition": transition, "-o-transition": transition });
};

$.fn.showFromRight1 = function (duration) {
    var self = $(this);
    if (!self.is(":hidden")) return;
    duration = duration || 0;
    var propertyValue = self.width() || 500;
    self.css("left", propertyValue);
    self.show();
    setTimeout(function () {
        var transition = "left " + duration + "ms";
        self.css({ "left": 0, "transition": transition, "-moz-transition": transition, "-webkit-transition": transition, "-o-transition": transition });
    }, 1);
};

$.fn.hideToRight1 = function (duration) {
    var self = $(this);
    if (self.is(":hidden")) return;
    duration = duration || 0;
    var propertyValue = self.width() || 500;
    self.css("left", 0);
    setTimeout(function () {
        self.hide();
    }, duration);
    var transition = "left " + duration + "ms";
    self.css({ "left": propertyValue, "transition": transition, "-moz-transition": transition, "-webkit-transition": transition, "-o-transition": transition });
};

// #endregion

$.fn.showFromLeft = function (duration, params) {
    var self = $(this);
    //if (!self.is(":hidden")) return;
    var width = self.width();
    if (!self.is(":hidden")) self.hide();
    duration = duration || 0;
    var leftFrom = -((params && params["maxLeft"]) || width || 500) + ((params && params["absoluteLeft"]) || 0);
    var leftTo = -((params && params["minLeft"]) || 0) + ((params && params["absoluteLeft"]) || 0);
    self.css("left", leftFrom);
    self.show();
    var props = { left: leftTo };
    this.animate(props, duration);
};

$.fn.hideToLeft = function (duration, params) {
    var self = $(this);
    if (self.is(":hidden")) return;
    duration = duration || 0;
    var leftFrom = -((params && params["minLeft"]) || 0);
    var leftTo = -((params && params["maxLeft"]) || self.width() || 500);
    self.css("left", leftFrom);
    setTimeout(function () {
        self.hide();
    }, duration);
    var props = { left: leftTo };
    this.animate(props, duration);
};

$.fn.showFromRight = function (duration, params) {
    var self = $(this);
    //if (!self.is(":hidden")) return;
    var width = self.width();
    if (!self.is(":hidden")) self.hide();
    duration = duration || 500;
    var leftFrom = (params && params["maxLeft"]) || self.data("maxLeft") || width || 500;
    var leftTo = (params && params["minLeft"]) || self.data("minLeft") || 0;
    self.css("left", leftFrom);
    self.show();
    var props = { left: leftTo };
    this.animate(props, duration);
};

$.fn.hideToRight = function (duration, params) {
    var self = $(this);
    if (self.is(":hidden")) return;
    duration = duration || 500;
    var leftFrom = (params && params["minLeft"]) || self.data("minLeft") || 0;
    var leftTo = (params && params["maxLeft"]) || self.data("maxLeft") || self.width() || 500;
    self.css("left", leftFrom);
    setTimeout(function () {
        self.hide();
    }, duration);
    var props = { left: leftTo };
    this.animate(props, duration);
};

$.fn.toggleLeft = function (duration, params) {
    if ($(this).is(":hidden"))
        this.showFromLeft(duration, params);
    else
        this.hideToLeft(duration, params);
};

$.fn.toggleRight = function (duration, params) {
    if ($(this).is(":hidden"))
        this.showFromRight(duration, params);
    else
        this.hideToRight(duration, params);
};

$.fn.directLeft = function (duration, params) {
    if ($(this).is(":hidden"))
        this.showFromLeft(duration, params);
    else
        this.hideToRight(duration, params);
};

$.fn.directRight = function (duration, params) {
    if ($(this).is(":hidden"))
        this.showFromRight(duration, params);
    else
        this.hideToLeft(duration, params);
};