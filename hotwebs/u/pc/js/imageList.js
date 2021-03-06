﻿/// <reference path="../Control.js" />

/// <reference path="../Control.js" />
cb.controls.widget("ImageList", function (controlType) {
    var control = function (id, options) {
        cb.controls.Control.call(this, id, options);
    };
    control.prototype = new cb.controls.Control();
    control.prototype.controlType = controlType;

    control.prototype.setData = function (data) {
        for (var attr in data) {
            var attrUpper = attr.substring(0, 1).toUpperCase() + attr.substring(1);
            if (this["set" + attrUpper]) {
                this["set" + attrUpper](data[attr]);
            }
        }
    };
 
    control.prototype.setDataSource = function (dataSource) {

        for (var i = 0, len = dataSource.length; i < len; i++) {
            var $li = $("<li></li>").data("itemData", dataSource[i]).on('mouseenter', mousehandle).on('mouseleave', mousehandle).appendTo(this.getElement());
            if (dataSource[i].url)
                $('<img src="' + dataSource[i].url + '" />').appendTo($li);
            var $div = $('<div style="display:none;"><span style="color:#ffffff;">' + dataSource[i].displayName + '</span><span style="padding-left:20px;">' + dataSource[i].owner + '</span><span  style="padding-left:14px;">' + dataSource[i].uploadType + '</span><span  style="padding-left:14px;">' + dataSource[i].uploadTime + '</span><div><img src="./pc/images/ImageSlide/u166.png" /><img src="./pc/images/ImageSlide/u168.png" /></div>').appendTo($li);

            $(this.getElement()).append($li);
        }

    };
    function mousehandle(e, args) {
        if ($(this).children("div").css("display") == "block") {
            $(this).children("div").css("display", "none");
        } else {
            $(this).children("div").css("display", "block");
        }
    }


    return control;
});  