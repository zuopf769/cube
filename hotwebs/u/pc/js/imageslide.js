/// <reference path="../Control.js" />

/// <reference path="../Control.js" />
cb.controls.widget("ImageSlide", function (controlType) {
    var control = function (id, options) {
        cb.controls.Control.call(this, id, options);
    };
    control.prototype = new cb.controls.Control();
    control.prototype.controlType = controlType;

    control.prototype.getValue = function () {

    };
    control.prototype.setValue = function (val) {

    };

    control.prototype.setData = function (data) {
        for (var attr in data) {
            var attrUpper = attr.substring(0, 1).toUpperCase() + attr.substring(1);
            if (this["set" + attrUpper]) {
                    this["set" + attrUpper](data[attr]);
            }
        }
    };
    control.prototype.setDataSource = function (dataSource) {
        var $ulBig = $('<ul class="big"></ul>');
        var $ulSmail = $('<ul class="smail"></ul>');
        for (var i = 0, len = dataSource.length; i < len; i++) {
            var $liBig = $('<li class="big_' + i + '"></li>').data("itemData", dataSource[i]).on('mouseenter', mousehandle).on('mouseleave', mousehandle).appendTo($ulBig);
            if (dataSource[i].url)
                $('<img src="' + dataSource[i].url + '" />').appendTo($liBig);
            var $div = $('<div style="display:none;"><a class="delete"></a><a class="down-load"></a>').appendTo($liBig);
         
            $(this.getElement()).append($ulBig);

            var $liSmail = $('<li class="smail_' + i + '"></li>').data("itemData", dataSource[i]).on('click', clickhandle).appendTo($ulSmail);
            if (dataSource[i].url)
                $('<img src="' + dataSource[i].url + '" />').appendTo($liSmail);
            if (dataSource[i].selected) {
                $liBig.css("display", "block");
                $liSmail.children("img").css({ "display": "block", "border": "2px solid #157EFB" });
            } else {
                $liBig.css("display", "none");
                $liSmail.children("img").css({ "display": "block", "border": "1px solid #cccccc" });
            }
            $(this.getElement()).append($ulSmail);
        }
        $(this.getElement()).append('<div style="">+</div>');

    };
    control.prototype.setReadOnly = function (val) {
    };
    control.prototype.setVisible = function (val) {
    };
    control.prototype.setdefaultValue = function (val) {
    };
    function mousehandle(e, args) {
        if ($(this).children("div").css("display") == "block") {
            $(this).children("div").css("display", "none");
        } else {
            $(this).children("div").css("display", "block");
        }
    }
    function clickhandle(e, args) {
        var bigClsss = "big_" + $(this).attr("class").substr(6, 1);
        var $ulBig = $($(this).parent().parent().children()[0]);
        if ($(this).children("img").css("border-width") == "2px") {
        } else {
            $ulBig.children("li").css("display", "none");
            $ulBig.children("li." + bigClsss).css("display", "block");
            $(this).parent().children("li").children("img").css({ "display": "block", "border": "1px solid #cccccc" });
            $(this).children("img").css({ "display": "block", "border": "2px solid #157EFB" });

        }
    }
    return control;
});