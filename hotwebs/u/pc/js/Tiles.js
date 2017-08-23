/// <reference path="../Control.js" />

/// <reference path="../Control.js" />
cb.controls.widget("Tiles", function (controlType) {
    var control = function (id, options) {
        cb.controls.Control.call(this, id, options);
    };
    control.prototype = new cb.controls.Control();
    control.prototype.controlType = "Tiles";

    control.prototype.setData = function (data) {
        for (var attr in data) {
            var attrUpper = attr.substring(0, 1).toUpperCase() + attr.substring(1);
            if (this["set" + attrUpper]) {
                this["set" + attrUpper](data[attr]);
            }
        }
    };
    
    control.prototype.setDataItem = function (data) {
    	var $span= this.getElement().find("span[data-menuCode='" + data.menuCode +"']");
    	$span.html(data.displayName);
    };
    control.prototype.setDeleteData = function (data) {
    	var deletemenuCode = data.args.data.menuCode;
    	var $li= this.getElement().find("li[data-menuCode='" + deletemenuCode +"']");
    	$li.remove();
    };
    control.prototype.setOperators = function (args){
		if(args == 'operator'){
			$('div[data-controltype="Tiles"] >li img[type="0"]').css({
			"display":"none"
	    	});
	    	$('div[data-controltype="Tiles"] >li img[type="1"]').css({
	    		"display":"inline-block"
	    	});
	    	$('#goback').show();
			$('#additem').hide();
			$('#editeitem').hide();
		}else if(args == 'goback'){
			$('div[data-controltype="Tiles"] >li>img').css({
	    		"display":"none"
	    	});
	    	$('#goback').hide();
			$('#additem').show();
			$('#editeitem').show();
		}  		
    };

    control.prototype.setDataSource = function (dataSource) {
        //var $ul = $("<ul></ul>");        
        for (var i = 0, len = dataSource.length; i < len; i++) {
            var itemData = dataSource[i];
            var $li = $("<li></li>").data("itemData", itemData).click(this, handleClick); 
           		$li.attr("data-menuCode",itemData.menuCode);
              if (itemData.image)
                  $li.css("background", "url('pc/images/listMenu/" + itemData.image + "') no-repeat center 20px");
              if (!itemData.image)
                  $li.css("background", "url('pc/images/listMenu/u81.png') no-repeat center 20px");
            var num = '';
            if (!isNaN(itemData.number)) {
                var num = '<span>' + itemData.number + '</span>';
            }
            var $a = $("<a>"  + num + "</a>").appendTo($li);
              var editSpan = $("<img  data-tag='img1'></img>").attr("type",itemData.type).click(this, handleClick).appendTo($li);
              var deleteSpan = $("<img  data-tag='img2'></img>").attr("type",itemData.type).click(this, handleClick).appendTo($li);
            // $li.append(content);
            var $span =$('<span>' + itemData.displayName + '</span>');
            $span.attr("data-menuCode",itemData.menuCode);
            $span.appendTo($li);             
            this.getElement().append($li);
        }

        function handleClick(e, args) {
            var $li;
            var target = $(e.currentTarget);
            var type = 'ItemClick';
            if (target.attr("data-tag") == "img1") {
                type = 'DeleteClick';
                 e.stopPropagation();
            }
            else if (target.attr("data-tag") == "img2") {
                type = 'EditClick';
                e.stopPropagation();
            }
            if (!e) $li = $defaultSelectedListItem;
            else $li = $(e.target).closest("li");
            
            if (!$li || !$li.length) return;
            //if ($li.get(0) === _lastClickItem) return;
            //_lastClickItem = $li.get(0);
            //if (e) $li.parent().trigger("itemClick", { type: "common", data: $li.data("itemData") });
            e.data.execute(type, { data: $li.data('itemData'),type:"common" });
            $li.addClass("selected");
            $li.siblings().removeClass("selected");
        }
    };


    return control;
});