// jQuery Tiles Manager v0.0.1
// Author : weijz
// Date :   2014.4.14

(function($) {
	$.fn.crlPosition = function(options) {
		if (options == "destroy") {
			//$(this.selector).trigger("dragsort-uninit");
			$(this.selector).trigger("tiles-uninit");
			return;
		}
		var opts = $.extend({}, $.fn.crlPosition.defaults, options);
		var $master = $("#"+opts.master);
	    //********************************************/
	    // 初始化
        //*********************************************/
		function init() {
			//$(this.selector).addClass("ddddddd");
			//alert(opts.master);
			//alert($master.attr("id"))
			//controlCurrentPage(1,60);
			//alert(opts.indicator)
			setPosition();
			$master.parent().attr("id",opts.master+"parent");
			//alert($master.children().length)
			if($master.children().length){
				$master.css("width",Math.ceil($master.children().length/(opts.itemHorizontalNum*opts.itemVertocalNum) * opts.itemWidth * opts.itemHorizontalNum))
				//$master.css("width",1000)
			}
			IscrollInit("#"+$master.parent().attr("id"),$master.parent().parent().parent().children(".indicator")[0]);
		}
		function setPosition(){
			var total = $master.children("li").length;
			var pageNum = Math.ceil(total/(opts.itemHorizontalNum * opts.itemVertocalNum));
			$master.children().each(function(i){
				var myPosition = getPosition(i);
				$(this).css("transform","translate("+myPosition.left+"px,"+myPosition.top+"px)");
				$(this).css("transition","transform 2s ease")
			});
		}
				
		function IscrollInit(content,indicator){
		//debugger;
				var myScroll;
				myScroll = new IScroll(content, {
					scrollX: true,
					scrollY: false,
					momentum: false,
					snap: true,
					snapSpeed: 400,
					keyBindings: true,
					//indicators: {
						//el: indicator,
						//resize: false
					//},
                    preventDefault: false
				});
			

			document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
		}
			/*首页列表 翻页定位 */
		function controlCurrentPage(targetPage,change){
			var total = $master.children("li").length;
				var pageNum = Math.ceil(total/12);
				//var pageNum = Math.ceil(total/9);
				var itemWidth = opts.itemWidth;
				var itemHeight = opts.itemHeight;
				if(targetPage<pageNum+1){
					$master.children().each(function(i){
						var myPosition = getPosition(targetPage,i+1,total,change);
						$(this).css("transform","translate("+myPosition.left+"px,"+myPosition.top+"px)");
						$(this).css("transition","transform 2s ease")
						//getPosition
					});
				}
		}

		/* 首页列表  获取某一个item相对于父容器的位置 */
		function getPosition(index){
		
			var MyPageNum = Math.floor(index/(opts.itemHorizontalNum * opts.itemVertocalNum));
			var indexInPage = getPagePosition(index%(opts.itemHorizontalNum*opts.itemVertocalNum));
			return {"left":MyPageNum*opts.itemHorizontalNum*opts.itemWidth+indexInPage.left,"top":indexInPage.top}
		}

		/* 首页列表  获取某一个item相对于所在页的位置 */
		function getPagePosition(index){
			//var result = {"top":0,"left":0};
			var row = index%opts.itemHorizontalNum;
			var col = Math.floor(index/opts.itemHorizontalNum);
			return {"left":row*opts.itemWidth + opts.PageHorizontalSpace + opts.HorizontalOffset,"top":col*opts.itemHeight+opts.itemVertocalSpace}
		}
		init();
		return this;		
	};

	$.fn.crlPosition.defaults = {
		master:"master",
		itemWidth:160,
		itemHeight:150,
		portWidth:560,
		portHeight:450,
		itemHorizontalSpace:0,
		itemVertocalSpace:0,
		PageHorizontalSpace:0,
		PageVertocalSpace:0,
		itemHorizontalNum:3,
		itemVertocalNum:3,
		HorizontalOffset:0
	};
})(jQuery);
