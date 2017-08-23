/// <reference path="../../../jquery/jquery-1.11.1.js" />
/// <reference path="../../../common/js/Cube.js" />
/// <reference path="../../../common/js/Control.js" />

cb.controls.widget('SumList', function (id, controltype) {

    var control = function (id, options) {
        this._id = id;
        this.$this = $("#" + id);
        cb.controls.Control.call(this, id, options);
    }
    control.prototype = new cb.controls.Control();
    control.prototype.controlType = controltype;
    control.prototype.setData = function (data) {
        for (var attr in data) {
            var attrUpper = attr.substring(0, 1).toUpperCase() + attr.substring(1);
            if (this['set' + attrUpper]) this['set' + attrUpper](data[attr]);
        }
    }
    control.prototype.setDataSource = function (data) {
        if (data) {
            if (this.$this && this.$this.length > 0) {
                this.$this.empty();
                for (var attr in data) {
                    var $div = $("<div>");
                    var $nlab = $("<label>");
                    $nlab.text(data[attr].columnVO.fieldname);
                    var $vlab = $("<label>");
                    $vlab.attr('data-col', attr);
                    $vlab.text(data[attr].value);
                    $div.append($nlab);
                    $div.append($vlab);
                    this.$this.append($div);
                }
            }
        }
    }
    control.prototype.setItemData = function (data) {
        if (data) {
            if ($("[data-col=" + data.columnVO.fieldcode + "]").length > 0) {
                $("[data-col=" + data.columnVO.fieldcode + "]").text(data.value);
            }
        }
    }
    return control;
});