/// <reference path="../Control.js" />

/// <reference path="../Control.js" />
cb.controls.widget("Image", function (controlType) {
    var control = function (id, options) {
        cb.controls.Control.call(this, id, options);
    };
    control.prototype = new cb.controls.Control();
    control.prototype.controlType = "Image";

    control.prototype.setData = function (data) {
        for (var attr in data) {
            var attrUpper = attr.substring(0, 1).toUpperCase() + attr.substring(1);
            if (this["set" + attrUpper]) {
                this["set" + attrUpper](data[attr]);
            }
        }
    };
    control.prototype.setDataSource = function (dataSource) {     
        if(dataSource.url){
        	var img = $('<img src="'+dataSource.url+'" />')
        	this.getElement().append(img);
        };
    };
	control.prototype.getValue = function(){
		return this.getElement().children('img').attr('src');
	};
	control.prototype.setValue = function(val){
		return this.getElement().children('img').attr('src',val);
	};

    return control;
});