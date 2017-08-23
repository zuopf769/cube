/// <reference path="../../../jquery/jquery-1.11.1.js" />
/// <reference path="../../../common/js/Cube.js" />
/// <reference path="../../../common/js/Control.js" />

cb.controls.widget('PermissionPersonList', function (controltype) {

    var control = function (id, options) {
        cb.controls.Control.call(this, id, options);
        //$ul = this.getElement();
        this.existSensiObj = [];
        this.$ul = $("#" + id);
        this._addSensitiveid = 'addSensitiveId';
    }
    control.prototype = new cb.controls.Control();
    control.prototype.controlType = controltype;

    control.prototype.on = function (eventNanme, func, context) {
        this.getElement().on(eventNanme, function (e, args) {
            func.call(context, args);
        });
    }
    control.prototype.setData = function (data) {

        for (var attr in data) {
            var attrUpper = attr.substring(0, 1).toUpperCase() + attr.substring(1);
            if (this['set' + attrUpper]) this['set' + attrUpper](data[attr]);
        }
    }
    control.prototype.setDataSource = function (datas) {
        ///<param name='datas' type='Array'>datas</param>
        if (this.$ul)
            this.$ul.empty();
        var self = this;
        if (datas && datas.length > 0) {
            datas.forEach(function (data, dataindex, datas) {
                self.addSensitiveObj(data, true);
            });
        }
        this.setAddPlus();
    }
    control.prototype.setAddPlus = function () {
        if (this.$ul) {
            var self = this;
            var $addLi = $("<li>");
            $addLi.attr('id', this._addSensitiveid);

            var $div = $('<div>');
            $div.attr('id', 'adddiv');
            $div.addClass('permissiondiv');
            $addLi.append($div);

            var $input = $('<input>');
            $input.addClass('permissioninput');
            $input.css('display', 'none');
            $input.css('border', 'none');
            $input.attr('id', 'addinput');
            $input.on("keydown", function (e, args) {

                if (e.keyCode == '13') {
                    //alert('enter');
                    var $addinput = $("#addinput");
                    var value = $addinput.val();
                    if (self.existSensiObj.indexOf(value) >= 0) {
                        cb.util.tipMessage("敏感对象已存在,请重新输入");
                        return;
                    }
                    self.getElement().trigger('sensitiveObjAdded', value);
                }
                if (e.keyCode == '27') {
                    //alert('cancel');
                    var $addinput = $("#addinput");
                    $addinput.val('');
                    $addinput.attr('readonly', 'readonly');
                    $addinput.css('display', 'none');
                    var $adddiv = $("#adddiv");
                    $adddiv.css('border', 'none');
                    $addSpan.show();
                }
            });
            $input.on("blur", function (e, args) {
                //alert('blur');
                var $addinput = $("#addinput");
                $addinput.val('');
                $addinput.attr('readonly', 'readonly');
                $addinput.css('display', 'none');
                var $adddiv = $("#adddiv");
                $adddiv.css('border', 'none');
                $addSpan.show();
            });
            $div.append($input);

            var $adddiv = $('<div>');
            $adddiv.addClass('permissionicondiv');
            $adddiv.css('margin-left', '25px');
            var $addSpan = $('<span>');
            $addSpan.attr('id', 'plusid');
            var self = this;
            $addLi.on('click', function (e, args) {
                var $addinput = $("#addinput");
                $addinput.css('display', 'block');
                $addinput.removeAttr('readonly');
                $addinput.focus();
                var $adddiv = $("#adddiv");
                $adddiv.css('border', '1px solid blue');
                $addSpan.hide();
            });
            //$addSpan.on("click", function (e, args) {
            //    var $addinput = $("#addinput");
            //    $addinput.css('display', 'block');
            //    $addinput.removeAttr('readonly');
            //    $addinput.focus();
            //    var $adddiv = $("#adddiv");
            //    $adddiv.css('border', '1px solid blue');
            //    $addSpan.hide();
            //});

            $addSpan.addClass('permissionaddicon');
            $adddiv.append($addSpan);
            $div.append($adddiv);
            this.$ul.append($addLi);
        }
    }
    control.prototype.addSensitiveObj = function (data, init) {
        var self = this;
        if (this.$ul) {
            var $li = $('<li>');
            var $div = $('<div>');
            $div.addClass('permissiondiv');
            $li.append($div);
            $li.data('id', data['id']);
            $li.attr('id', data['id']);
            $li.on('click', function (e, args) {
                self.getElement().trigger('loadBusField', $(this).data('id'));
                for (var i = 0; i < $('.permissiondiv').length; i++) {
                    if (e.target.parentElement == $('.permissiondiv')[i]) {
                        $($('.permissiondiv')[i]).addClass('permissiondivselected');
                    }
                    else {
                        $($('.permissiondiv')[i]).removeClass('permissiondivselected');
                    }
                }
            });
            if (!init)
                $li.trigger('click');

            var $input = $('<input>');
            $input.attr('type', 'text');
            $input.attr('readonly', 'readonly');
            $input.addClass('permissioninput');
            $input.val(data['name']);
            this.existSensiObj.push(data['name']);
            $div.append($input);

            var $mandiv = $('<div>');
            $mandiv.addClass('permissionicondiv');
            var $manspan = $('<span>');
            $manspan.val(data['id']);
            $manspan.addClass('permissionmanicon');
            $manspan.on('click', function (e, args) {
                self.getElement().trigger('setAuthority', this.value);
                e.stopPropagation();
            });
            $mandiv.append($manspan);
            $div.append($mandiv);

            var $deldiv = $("<div>");
            $deldiv.addClass('permissionicondiv');
            var $delspan = $("<span>");
            $delspan.val(data['id']);
            $delspan.addClass('permissiondeleteicon');
            $delspan.on('click', function (e, args) {
                self.getElement().trigger('deleteSensitiveObj', $(this).val());
                e.stopPropagation();
            });
            $deldiv.append($delspan);
            $div.append($deldiv);

            var $addPlus = $("#addSensitiveId");
            if ($addPlus.length > 0) {
                $li.insertBefore($("#addSensitiveId"));
            }
            else
                this.$ul.append($li);
        }
    }
    control.prototype.setInsertRow = function (data) {
        ///<param name='data' type='Object'></param>
        this.addSensitiveObj(data, false);

        //添加之后显示加号
        var $addinput = $("#addinput");
        $addinput.val('');
        $addinput.attr('readonly', 'readonly');
        $addinput.css('display', 'none');
        var $adddiv = $("#adddiv");
        $adddiv.css('border', 'none');
        var $addspan = $("#plusid");
        $addspan.show();
    }
    control.prototype.setDeleteRow = function (data) {
        if (data) {
            var $li = $("#" + data);
            if ($li.length > 0) {
                $li.remove();
            }
        }
    }
    control.prototype.setValue = function (val) {

    }
    control.prototype.getValue = function (val) {

    }
    return control;
});
