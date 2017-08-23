/// <reference path="../../../jquery/jquery-1.11.1.js" />
/// <reference path="../../../common/js/Cube.js" />
/// <reference path="../../../common/js/Control.js" />

cb.controls.widget('RoleUserList', function (controltype) {

    var control = function (id, options) {
        cb.controls.Control.call(this, id, options);
        this.$div = $("#" + id);
    }
    control.prototype = new cb.controls.Control();
    control.prototype.controlType = controltype;
    control.prototype.on = function (eventName, func, context) {
        this.getElement().on(eventName, function (e, args) {
            func.call(context, args);
        });
    }
    control.prototype.setData = function (data) {
        for (var attr in data) {
            var attrUpper = attr.substring(0, 1).toUpperCase() + attr.substring(1);
            if (this['set' + attrUpper]) this['set' + attrUpper](data[attr]);
        }
    }
    control.prototype.setDataSource = function (data) {
        if (this.$div.length > 0)
            this.$div.empty();

        for (var attr in data) {
            var $headdiv = $("<div>");
            $headdiv.addClass('userdiv');
            $headdiv.attr('data-related', attr);
            $headdiv.on('click', function (e, args) {
                var key = $(this).attr('data-related');
                var target = $("ul[data-related=" + key + "]");
                if (target.length > 0) {
                    $(target[0]).slideToggle();
                }
            });

            var $headspan = $("<span>");
            $headspan.text(attr);
            $headdiv.append($headspan);
            this.$div.append($headdiv);

            var $ul = $("<ul>");
            $ul.css('display', 'none');
            $ul.attr('data-related', attr);
            if (data[attr] && data[attr].length > 0) {
                data[attr].forEach(function (data, dataIndex, datas) {
                    var $li = $("<li>");
                    $li.data('obj', data);
                    $li.text(data['name']);
                    $li.addClass('userli');
                    $li.on('click', function (e, args) {
                        alert(e);
                    });
                    $ul.append($li);
                });
            }
            this.$div.append($ul);
        }
    }

    control.prototype.getValue = function () { };
    control.prototype.setValue = function (val) { };

    return control;
});