/// <reference path="../Control.js" />

/// <reference path="../Control.js" />
cb.controls.widget("IndividualCenter", function (controlType) {
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
		
		var userImg = $('<img src="/pc/images/menu/u32.png" />');
		var $ul = $('<ul style="display:none;"></ul>');
		var $li0 = $('<li><img src="/pc/images/menu/u32.png" /><span>sunny</span><span>|</span><span>928</span></li>');
		var $li1 = $('<li><img src="/pc/images/u1112.png" />个人中心</li>');
		var $li2 = $('<li><img src="/pc/images/u1421.png" />我的设置</li>');
		var $li3 = $('<li><img src="/pc/images/u1114.png" />退出登陆</li>');
		$ul.append($li0);
		$ul.append($li1);
		$ul.append($li2);
		$ul.append($li3);
		userImg.on("click",function(e){
			debugger;
			$ul.css("display","block");
		});
		$li0.children("img").on("click",function(e){
			debugger;
			$ul.css("display","none");
		});
	
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