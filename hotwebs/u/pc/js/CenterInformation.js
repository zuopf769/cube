/// <reference path="../Control.js" />

/// <reference path="../Control.js" />
cb.controls.widget("CenterInformation", function (controlType) {
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
		
		var userImg = $('<img src="'+dataSource.imgUrl+'" />');
		var $ul = $('<ul></ul>');
		var $li0 = $('<li><span title="'+dataSource.userName+'">'+dataSource.userName+'</span><span>'+dataSource.integrate+'</span></li>');
		var $li1 = $('<li><span>用户等级：</span><span>高级用户</span></li>');
		var $li2 = $('<li><span>上次登录：</span><span>2014-12-12</span></li>');
		
		$ul.append($li0);
		$ul.append($li1);
		$ul.append($li2);
	
        $(this.getElement()).append(userImg);
		$(this.getElement()).append($ul);
		
    };
    control.prototype.setReadOnly = function (val) {
    };
    control.prototype.setVisible = function (val) {
    };
    control.prototype.setdefaultValue = function (val) {
    };
    return control;
});