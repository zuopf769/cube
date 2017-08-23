(function ($) {
    $.extend(true, window, {
        "cb": {
            "controls": {
                "ScaleBar": ScaleBar
            }
        }
    });
  

    function ScaleBar(el, options) {
        if (typeof el === 'string') {
            el = document.getElementById(el);
        } 
        var $el=$(el).first();
        $el.addClass('scaleBar');
		

        /*
		data={
			total:5600,//总值
			current:
		}
		*/

        this.setData = function (data) {
            var total=data.total,
				current=data.value;
			var scale=Math.min(1,current/total);
			
			$('.descriptionList span',$el).eq(0).html(total);
			$('.descriptionList span',$el).eq(1).html(current);
			
			$('.part',$el).css('width',scale*100+'%');
        }
		
	}
})(jQuery);



//cb.binding.StatusBarBinding = function (mapping, parent) {
//    cb.binding.BaseBinding.call(this, mapping, parent);
//};
//cb.binding.StatusBarBinding.prototype = new cb.binding.BaseBinding();

//cb.binding.StatusBarBinding.prototype._set_data = function (data) {
//    var model = this.getModel();
//    var control = this.getControl();
//    if (!model || !control) return;
//    control.setData(data);
//}
