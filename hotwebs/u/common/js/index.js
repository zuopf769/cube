
$(document).ready(function(){

	/* 初始化首页页签 */
	
	TabInit();	
	
	 //InitList();
	// InitTouchChangePage()
});

/*  首页页签 初始化函数 */
function TabInit(){
	$(".indexTab").children().children().bind("click",function(){
		var positionMapping =[
			{top:"0",left:"0"},
			{top:"74px",left:"104px"},
			{top:"92px",left:"238px"},
			{top:"74px",left:"392px"},
			{top:"0",left:"516px"},
		];
		var tabContentMap = {
			TabDecisionAnalysis:"DecisionAnalysis",
			TabMessageTask:"MessageTask",
			TabMyWork:"MyWork",
			TabMyMessage:"MyMessage",
			TabMySchedule:"MySchedule"
		};
		var curentNar = $(this).parent();
		//console.log(curentNar);
		var narBar = curentNar.parent();
		var tab_num = parseInt(curentNar.attr("class").substr(4,1));
		var narBarLength =$(narBar).children("li").length;
		narBar.children("li").each(function(i){
			var $thisTab=parseInt($(this).attr("class").substr(4,1));
			var target_data=myindex(narBarLength,$thisTab,3-tab_num,3);
			
			$(this).removeClass("tab_"+target_data.current_num+" size"+target_data.current_size+" status"+target_data.current_status)
			       .addClass("tab_"+target_data.target_num+" size"+target_data.target_size+" status"+target_data.target_status)
				    // .css("left",positionMapping[target_data.target_num-1].left)
					// .css("top",positionMapping[target_data.target_num-1].top)
				   .css("transform","translate("+positionMapping[target_data.target_num-1].left+","+positionMapping[target_data.target_num-1].top+")")
                   .css("-webkit-transform","translate("+positionMapping[target_data.target_num-1].left+","+positionMapping[target_data.target_num-1].top+")")
                   .css("-moz-transform","translate("+positionMapping[target_data.target_num-1].left+","+positionMapping[target_data.target_num-1].top+")")
                   .css("-o-transform","translate("+positionMapping[target_data.target_num-1].left+","+positionMapping[target_data.target_num-1].top+")");
		    $("#"+tabContentMap[$(this).attr("id")]).css("display","none");
			
			if($(curentNar).attr("id")==$(this).attr("id")){
			/* 	$("#"+tabContentMap[$(curentNar).attr("id")])
					//.animate( { width: 600px}, 1000 );
					.animate({
						width:'toggle',
					  }); */
				$("#"+tabContentMap[$(this).attr("id")]).css("display","block");
				if($(curentNar).attr("id")!="TabMyWork"){
					currentPage=1;
					controlCurrentPage(1,0);
				}
			}
		});
	});
		
	/*  首页页签 移动位置计算函数 */
	function myindex(total,currentNum,changeNum,targetNum){
		var result = currentNum+changeNum;

		if(result>total){
			result-=total;
		}else if(result<1){
			result+=5;
		}
		return {"current_num":currentNum,"current_status":currentNum==3?2:1,"current_size":currentNum>3?(5+1-currentNum):currentNum,"target_num":result,"target_size":result>3?(5+1-result):result,"target_status":result==3?2:1};
	}

	
}
/*  首页列表 初始化函数 */

	/* 初始化首页列表 显示第一页 */
	function InitList(){
	controlCurrentPage(1,60);
	}

	/*首页列表 翻页定位 */
	function controlCurrentPage(targetPage,change){
		var total = $(".scroller>li").length;
			var pageNum = Math.ceil(total/12);
			//var pageNum = Math.ceil(total/9);
			var itemWidth = 160;
			var itemHeight = 150;
			if(targetPage<pageNum+1){
				$(".scroller>li").each(function(i){
					var myPosition = getPosition(targetPage,i+1,total,change);
					$(this).css("transform","translate("+myPosition.left+"px,"+myPosition.top+"px)");
					$(this).css("transition","transform 2s ease")
					//getPosition
				});
			}

	}

	/* 首页列表  获取某一个item相对于父容器的位置 */
	function getPosition(currentPage,index,total,change){
		var MyPageNum = Math.ceil(index/12);
		var indexInPage = getPagePosition(index%12);
		return {"left":change+(MyPageNum-1)*4*160-(currentPage-1)*4*160+indexInPage.left,"top":indexInPage.top}
	}

	/* 首页列表  获取某一个item相对于所在页的位置 */
	function getPagePosition(index){
		//var result = {"top":0,"left":0};
		var row = index==0?3:Math.ceil(index/4);
		var col = index%4;
		return {"top":(row-1)*150,"left":col==0?3*160:(col-1)*160}
	}
	
	/* 首页列表  初始化手指滑动翻页事件 */
	function InitTouchChangePage(){
		//初始坐标
		var sx = 0;
		var sy = 0;
		//当前坐标
		var cx = 0;
		var cy = 0;
		//定义有效区域标准
		var flag = {};
		flag.w = parseInt(screen.width / 3);
		flag.h = parseInt(screen.height / 3);
		$(".MyWork>ul")[0].addEventListener('touchstart', function(evt) {
			//当前位于屏幕上的所有手指列表中的第一个的坐标
			sx = evt.touches[0].screenX; 
			sy = evt.touches[0].screenY;
		}, false);
		$(".MyWork>ul")[0].addEventListener('touchmove', function(evt) {
			cx = evt.touches[0].screenX;
			cy = evt.touches[0].screenY;
			console.log($(this)+"left:"+$(this).css("left")+"sx - cx:"+(sx - cx))
			//$(this).css("left",cx - sx);
			controlCurrentPage(currentPage>1?currentPage:1,cx - sx);
		}, false);
		$(".MyWork>ul")[0].addEventListener('touchend', function(evt) {
			//手指滑动距离横向超过屏幕三分之一且纵向小于屏幕三分之一时才执行，防止误操作
			if((cx < sx) && (sx - cx > flag.w) && (Math.abs(cy - sy) < flag.h)) {
				controlCurrentPage(currentPage<Math.ceil($(".MyWork>ul>li").length/9)?++currentPage:currentPage,0);
			} else if((sx < cx) && (cx - sx > flag.w) && (Math.abs(cy - sy) < flag.h)) {
				controlCurrentPage(currentPage>1?--currentPage:1,0);
			}
			$(this).css("left",0);
		}, false);
	}
// jQuery Tiles Manager v0.0.1
// Author : weijz
// Date :   2014.4.14

(function($) {

	$.fn.Carousel = function(options) {
		if (options == "destroy") {
			//$(this.selector).trigger("dragsort-uninit");
			$(this.selector).trigger("tiles-uninit");
			return;
		}

	

		var opts = $.extend({}, $.fn.Carousel.defaults, options);
	
	    //**********************************************************/
	    // 全局变量
	    // currentPage 当前页
	    // totalPageCount 总页面数
	    // pageWidth 页宽度
	    //*********************************************************/
		//var currentPage = 0, totalPageCount = 0, pageWidth = 0;

		var carouselPageInfo = new carouselPageInfo();
        
		function carouselPageInfo() {
		    //totalPageCount 总页面数
		    this.totalPageCount = 0;
            //当前是第几页
		    this.currentPage = 0;
            //页宽
		    this.pageWidth = 0;
		    //页高
		    this.pageHeight = 0;
            //每页有多少行
		    this.row = 0;
            //每页有多少列
		    this.col = 0;

		    this.realContentWidth = 0;
		    this.realContentHeight = 0;
		}

		carouselPageInfo.prototype.setPageInfo = function (totalPageCount, currentPage, pageWidth, pageHeight, row, col) {
		    this.totalPageCount = totalPageCount;
		    this.currentPage = currentPage;
		    this.pageWidth = pageWidth;
		    this.pageHeight = pageHeight;
		    
		    this.row = row;
		    this.col = col;
		};

		carouselPageInfo.prototype.setPageRealInfo = function (realContentWidth, realContentHeight) {
		    this.realContentWidth = realContentWidth;
		    this.realContentHeight = realContentHeight;
		   
		};

		

	    //**********************************************************/
	    // 获取视口
	    //*********************************************************/
		function getViewPort() {
		    //计算视口大小
		    var viewHeight = $(window).height() - opts.pageSwitcherWidth * 2;  //100简单表示上边和底边占据高度
		    var viewWidth = $(window).width() - opts.pageSwitcherWidth * 2;    //100简单表示左边和右边占据宽度

		    var viewPort = $("#yonyouTilesContainerViewPort");
		    viewPort.css("left", opts.tileContainerMargin);
		    //tilesContainer.css("top", tileContainerMargin);

		    viewPort.width(viewWidth);
		    viewPort.height(viewHeight);

		    return viewPort;		    
		}

		function initPageInfo(viewWidth,viewHeight,tileCount) {
		    var pageContainerW = viewWidth - opts.pageSwitcherWidth;// (去除左右翻页占据的空间)

		    var hspace = opts.tileHSpace, vspace = opts.tileVSpace;

		    var tileWidth = opts.tileWidth, tileHeight = opts.tileHeight;
		    //计算行
		    var row = parseInt(viewHeight / (tileHeight + vspace));
		    //计算列
		    var col = parseInt(pageContainerW / (tileWidth + hspace));

		    var page = cacaulatePageCount(tileCount, row, col);

		    tilePageInfo.setPageInfo(page, 0, viewWidth, viewHeight, row, col);

		    var realContentWidth = (col * (tileWidth + hspace) - hspace);
		    var realContentHeight = (row * (tileHeight + vspace) - vspace);
		
		    tilePageInfo.setPageRealInfo(realContentWidth, realContentHeight);		    
		}


	    //**********************************************************/
	    // 计算分多少页
	    // 参数 tileCount 表示磁贴总数
	    // 参数 row 每页多上行
	    // 参数 col 每页多上列
	    //*********************************************************/
		function cacaulatePageCount(tileCount, row, col) {

		    var pageCount = parseInt(tileCount / (row * col));        //计算页                

		    if (tileCount % (row * col) != 0) { pageCount += 1 };  // 如果不够整除，则页数加1

		    return pageCount;
		}
        
	    //**********************************************************/
	    // 获取磁贴位置
        // 参数 i 表示磁贴所在dom数的index值
	    //*********************************************************/

		function getTileLocation(i) {
		    //计算 当前 widget属于哪一页
		    var pageIndex = parseInt(i / (tilePageInfo.row * tilePageInfo.col));

		    //计算当前widget在当前页的索引值
		    var innerPage = parseInt((i - (tilePageInfo.row * tilePageInfo.col * pageIndex)));
		    //修正，如果页小于0，则
		    //if ((pageIndex - 1) < 0) { innerPage = i; }

		    // 计算 属于哪一行
		    var rowIndex = parseInt(innerPage / tilePageInfo.col);
		    // 计算 属于哪一列
		    var colIndex = innerPage - rowIndex * tilePageInfo.col;


		    //根据页，行，列 计算widget的位置
		    //var left = (pageWidth) * pageIndex + (colIndex * (tileWidth + hspace) - hspace) + 154;

		    var startDelatX = (tilePageInfo.pageWidth - tilePageInfo.realContentWidth) / 2;
		    var startDeltaY = (tilePageInfo.pageHeight - tilePageInfo.realContentHeight) / 2;

		    var left = (tilePageInfo.pageWidth) * pageIndex + (colIndex * (opts.tileWidth + opts.tileHSpace) - opts.tileHSpace) + startDelatX;
		    var top = rowIndex * (opts.tileHeight + opts.tileVSpace) - opts.tileVSpace + startDeltaY;//表示距顶部的偏移

		    return new Location(left, top);
		}


	    //**********************************************************/
	    // 设置磁贴位置
	    //*********************************************************/
		function setTileLocation(i,tiles) {		    
		    for (var i = 0; i < tiles.length ; i++) {
		        var loc = getTileLocation(i);
		        $(tiles[i]).css({ "left": loc.left, "top": loc.top });		        
		    }
		}

	    //**********************************************************/
	    // 布局磁贴
	    //*********************************************************/
		function tilesRelayout() {
		    //计算视口大小			
		    var viewPort = getViewPort();
		    var viewHeight = viewPort.height(), viewWidth = viewPort.width();

		    var tiles = $("#yonyouGuilinGridly").children();

		    initPageInfo(viewWidth, viewHeight, tiles.length);
		 
		    setTileLocation(0,tiles);
		    
		    indicatorRelayout(tilePageInfo.totalPageCount, tilePageInfo.currentPage);

		    switcherButtonShow();
		}

	    //**********************************************************/
	    // 布局磁贴,备份，面条代码 2014,4.17
	    //*********************************************************/
		function tilesRelayout2() {
		    //计算视口大小			
		    var viewPort = getViewPort();
		    var viewHeight = viewPort.height(), viewWidth = viewPort.width();            

			var tiles = $("#yonyouGuilinGridly").children();

			var pageContainerW = viewWidth - opts.pageSwitcherWidth;// (去除左右翻页占据的空间)

			var hspace = opts.tileHSpace, vspace = opts.tileVSpace;

			var tileWidth = opts.tileWidth, tileHeight = opts.tileHeight;
			//计算行
			var row = parseInt(viewHeight / (tileHeight + vspace));
			//计算列
			var col = parseInt(pageContainerW / (tileWidth + hspace));

			var page = parseInt(tiles.length / (row * col));        //计算页                

			if (tiles.length % (row * col) != 0) { page += 1 };  // 如果不够整除，则页数加1

			totalPageCount = page;

			// 页宽设置为视口宽度
			pageWidth = viewWidth;	    		

			var realContentWidth = (col * (tileWidth + hspace) - hspace);
			var realContentHeight = (row * (tileHeight + vspace) - vspace);

			var rowIndex = 0, colIndex = 0;
			for (var i = 0; i < tiles.length ; i++) {
				//计算 当前 widget属于哪一页
				var pageIndex = parseInt(i / (row * col));
				/// if(i%(row*col)!=0) { pageIndex +=1; }

				//计算当前widget在当前页的索引值
				var innerPage = parseInt((i - (row * col * pageIndex)));
				//修正，如果页小于0，则
				//if ((pageIndex - 1) < 0) { innerPage = i; }

				// 计算 属于哪一行
				var rowIndex = parseInt(innerPage / col);
				// 计算 属于哪一列
				var colIndex = innerPage - rowIndex * col;


				//根据页，行，列 计算widget的位置
				//var left = (pageWidth) * pageIndex + (colIndex * (tileWidth + hspace) - hspace) + 154;
                   
				var startDelatX = (pageWidth - realContentWidth) / 2;
				var startDeltaY = (viewHeight - realContentHeight) / 2;

				var left = (pageWidth) * pageIndex + (colIndex * (tileWidth + hspace) - hspace) + startDelatX;
				var top = rowIndex * (tileHeight + vspace) - vspace + startDeltaY;//表示距顶部的偏移

				var widget = $(tiles[i]);
				widget.css({ "left": left, "top": top });
				//alert(widget.attr("uuid") + "left=" + widget.attr("left") + "; top=" + widget.attr("top") );                        
			}

			indicatorRelayout(tilePageInfo.totalPageCount, tilePageInfo.currentPage);
		}		

	    //**********************************************************/
	    // 控制左翻页按钮显示隐藏
	    // paras
	    // page 总过多少页
	    // currentPage 当前是第几页
	    //*********************************************************/			
		function indicatorRelayout (page,currentPage){
			var pager = $("#yonyouTilesContainerPager");

			var temp = "";
			for (var i = 0; i < page; i++) {
				if (i == currentPage)
					temp += "<span class='yonyouGuilinActive'></span>";
				else
					temp += "<span></span>"
			}

			pager.empty();
			pager.append(temp);
		}

	    //**********************************************************/
	    // 控制当前页面指示标志
	    //*********************************************************/
		function indicatorPage (currentPage) {
			var pager = $("#yonyouTilesContainerPager");
			pager.children().removeClass("yonyouGuilinActive");

			var index = 0;
			var temp = "span:eq(" + currentPage.toString() + ")";
			//pager.find(temp).addClass("yonyouGuilinActive");               
			pager.children(temp).addClass("yonyouGuilinActive");
		}

        
	    //**********************************************************/
	    // 点翻页面动画后事件
	    //*********************************************************/	   
		function moveCallBack() {
		    
		    indicatorPage(tilePageInfo.currentPage);		    
		}

	    //**********************************************************/
	    // 控制翻页按钮显示隐藏
	    //*********************************************************/
		function switcherButtonShow() {
		    var switchLeft = $("#yonyouTilesSwitcherLeft");
		    var switchRight = $("#yonyouTilesSwitcherRight");
		    if (tilePageInfo.currentPage == 0) {
		        switchLeft.hide();
		        if (tilePageInfo.totalPageCount > 1) {
		            switchRight.show();
		        }
		        else {
		            switchRight.hide();
		        }
		    }
		    else if (tilePageInfo.currentPage == tilePageInfo.totalPageCount - 1) {
		        switchLeft.show();
		        switchRight.hide();
		    }
		    else {
		        switchLeft.show();
		        switchRight.show();
		    }
		}

		function moveTo(pageIndex) {
		    if (pageIndex < 0 || pageIndex > tilePageInfo.totalPageCount) return;

		    
		    var delta = pageIndex - tilePageInfo.currentPage;

		    if (delta != 0) {
		        if (delta < 0) {
		            $("#yonyouGuilinGridly").animate({ left: "+=" + tilePageInfo.pageWidth * Math.abs(delta) }, opts.speed, null, moveCallBack);
		        }
		        else {
		            //左移
		            $("#yonyouGuilinGridly").animate({ left: "-=" + tilePageInfo.pageWidth * Math.abs(delta) }, opts.speed, null, moveCallBack);
		        }

		        //右移
		        //Math.abs(
		        tilePageInfo.currentPage += delta;

		        switcherButtonShow();

		        indicatorPage(tilePageInfo.currentPage);
		    }		    
		}

               
        
	    //**********************************************************/
	    // 向左移动，翻页
	    //*********************************************************/
		function moveLeft(){
		    if (tilePageInfo.currentPage <= 0) return;
		    tilePageInfo.currentPage -= 1;
			//在3000毫秒内，以动画的形式向右移动1000px个像素                    
		    $("#yonyouGuilinGridly").animate({ left: "+=" + tilePageInfo.pageWidth }, opts.speed, null, moveCallBack);
		    switcherButtonShow();
	    }

        
	    //**********************************************************/
	    // 向右移动，翻页
	    //*********************************************************/
		function moveRight() {
				//左移按钮点击事件
				//在3000毫秒内，以动画的形式向左移动1000px个像素
		    if (tilePageInfo.currentPage >= tilePageInfo.totalPageCount - 1) return;

		    tilePageInfo.currentPage += 1;

		    $("#yonyouGuilinGridly").animate({ left: "-=" + tilePageInfo.pageWidth }, opts.speed, null, moveCallBack);
		    switcherButtonShow();
		}

		function StringBuilder() {
			this._strings = new Array();
		}

		//append方法定义
		StringBuilder.prototype.append = function (str) {
			this._strings.push(str);
		}

		//toString方法定义
		StringBuilder.prototype.toString = function () {
			return this._strings.join('');
		}

		
        
	    //**********************************************************/
	    // 创建桌面磁贴html模板 "url":"Order/PurchaseOrderList.htm",
	    //*********************************************************/
		var tileTemplate = new StringBuilder();
		tileTemplate.append('<div class="yonyouGuilinTile small yonyouGuilinBreatheDiv" uuid="{0}">');
		tileTemplate.append('  <div class="yonyouGuilinTileRemove tile-container-view" data-touchable="true"></div>');
		tileTemplate.append('  <div class="yonyouGuilinTileContent" data-touchable="true">');
		tileTemplate.append('     <div style="height: 100%; opacity: 1;" data-yonyou-widget="yonyou.u8.layout.TileView" data-yonyou-domid="gdom152">');
		tileTemplate.append('     <div class="u8-bo-tile u8-bo-tile-0" data-yonyou-domid="gdom168" data-yonyou-template="ViewContent">');
		tileTemplate.append('           <div class="title" data-yonyou-domid="gdom169">');
	    //tileTemplate.append('           <a href="{5}" data-ajax=false>{1}</a>');
		tileTemplate.append('           {1}');
		tileTemplate.append('           </div>');
		tileTemplate.append('           <div class="sub-title" data-yonyou-domid="gdom170">{2}</div>');
		tileTemplate.append('               <div class="number"><div class="value" data-yonyou-domid="gdom171">{3}</div></div>');
		tileTemplate.append('			{4}');
		tileTemplate.append('      </div>');
		tileTemplate.append('   </div>');
		tileTemplate.append(' </div>');
		tileTemplate.append(' <div class="yonyouGuilinTileMask"></div>');
		tileTemplate.append('</div>');

        
	    //**********************************************************/
	    // 创建桌面单个磁贴
	    //*********************************************************/

		function createTile(uuid,title, subTitle, num, content,url,type) {
			var temp = tileTemplate.toString();
			temp = temp.replace("{0}", uuid);
			var link = "<a href={5} data-ajax=false>"+title+"</a>";
			if (type == 0) {
			    temp = temp.replace("{1}", link);
			}
			else if (type == 1) {
                link ='<a href="{5}" data-role="button" data-inline="true" data-ajax=false data-rel="dialog" data-transition="flip">'+title+'</a>'
			    temp = temp.replace("{1}", link);
			}

			//temp = temp.replace("{1}", title);
			temp = temp.replace("{2}", subTitle);
			temp = temp.replace("{3}", num);
			temp = temp.replace("{4}", content);
			temp = temp.replace("{5}", url.indexOf("page.jsp?")>=0?(url+ location.search.replace("?","&")):(url+ location.search));
			
			return temp.toString();
		}

	    //**********************************************************/
	    // 创建桌面磁贴
        //*********************************************************/

		function createTiles() {
			var sb = new StringBuilder();
			var data = opts.data;
			if (data != null) {
				for(var i=0;i<data.length;i++){
				    var tile = data[i];				 
				    sb.append(createTile(tile.uuid, tile.title, tile.subTitle, tile.num, tile.content, tile.url,tile.type));
				}

				$(".gridlyTransition").append(sb.toString());
			}
		}

		var popupDialog = new StringBuilder();
		popupDialog.append('<li data-touchable="true">');
		popupDialog.append('    <div uuid="{0}" data-yonyouup-widget="yonyouup.ui.widget.Checkbox"  class="yonyouup-ui-checkbox yonyouup-ui-checkbox-checked" >');
		popupDialog.append('        <div {1}></div>');
		popupDialog.append('        <label title="{2}">{3}</label>');
		popupDialog.append('    </div>');
		popupDialog.append('</li>');


	    //**********************************************************/
	    // 创建桌面磁贴控制菜单
	    //*********************************************************/
		function createTileMenuItem(uuid,checked,title)
		{
		    var temp = popupDialog.toString();
		    temp = temp.replace("{0}",uuid);
		    if(checked==true){
		        temp = temp.replace("{1}",'class="icon-accept"');
		    }
		    else{
		        temp = temp.replace("{1}","");
		    }
		    temp = temp.replace("{2}", title);
		    temp = temp.replace("{3}", title);
		    
		    return temp;
		}

	    //**********************************************************/
	    // 创建桌面磁贴控制卡片内容
	    //*********************************************************/
		function createTileMenu(){
		    var sb = new StringBuilder();
		    if (opts.data != null) {
		        for (var i = 0; i < opts.data.length; i++) {
		            var menu = opts.data[i];
		            sb.append(createTileMenuItem(menu.uuid,menu.checked,menu.title));
		        }
		        return sb.toString();
		    }
		}

	    //**********************************************************/
	    // 初始化桌面磁贴控制卡片内容
	    //*********************************************************/
		var initialed = false;
		function initTileMenu() {
		    if (initialed == false) {
		        initialed = true;

		        var data = createTileMenu();
		        $(".yonyouup-guilin-checkBox-container").append(data);

		        $(".yonyouup-guilin-checkBox-container li").each(
                    function () {
                        $(this).click(tileMenuItemClick);
                    });
		    }            
		    //tileMenuItem.click(tileMenuItemClick(tileMenuItem));
		}

	    //**********************************************************/
	    // 直接操作磁贴删除后，更新磁贴控制卡片菜单项选中状态
	    //*********************************************************/
		function updateTileMenu(uuid) {
		    var target = $(".yonyouup-guilin-checkBox-container li").children("[uuid='" + uuid + "']");
		    if (target != null) {
		        target.children(":first").removeClass("icon-accept");
		    }
		}

	    //**********************************************************/
	    // 桌面磁贴控制卡片菜单项点击
	    //*********************************************************/
		function tileMenuItemClick() {
		    var temp = $(this).children(":first").children(":first");
		    if (temp.hasClass("icon-accept")) {
		        temp.removeClass("icon-accept");

		        removeTile($(this).children(":first").attr("uuid"));
		    }
		    else {
		        temp.addClass("icon-accept");

		        appendTile($(this).children(":first").attr("uuid"));
		    }		    
		    //		    
		}


        function manageAdd() {

        }

		function manageCancel() {
		    manageOver();
            //并恢复之前的操作
		}

		function setEditState(editState) {
		    
		    if (editState == true) {
		        $(".yonyouTilesContainer").addClass("yonyouGuilinEditable");
		        $(".yonyouGuilinTileRemove.tile-container-view").click(function () {
		            var uuid = $(this).parent().attr("uuid");
		            removeTile(uuid);
		            updateTileMenu(uuid);
		        });
		    }
		    else {
		        $(".yonyouTilesContainer").removeClass("yonyouGuilinEditable");
		        //$(".yonyouGuilinTileRemove.tile-container-view").click(function () { });
		    }   
		}

		function manageOver() {
		    $(".Content").show();
		    $(".yonyouTilesCustomize").show();
		    $(".yonyouTilesAddBtn").hide();
		    $(".yonyouTilesCancelBtn").hide();
		    $(".yonyouTilesOKBtn").hide();

		    setEditState(false);
		}

		function manageOk() {
		    manageOver();
		    //将现在的状态保存到数据库
		    
		}

		function manageEdit() {
			$(".yonyouTilesCustomize").hide();
			$(".Content").hide();
			$(".ui-btn.ui-btn-inline.yonyouTilesAddBtn").show();
			$(".yonyouTilesCancelBtn").show();
			$(".yonyouTilesOKBtn").show();

			setEditState(true);

		    //延迟加载控制菜单
			initTileMenu();
		}

        

	    //********************************************/
	    // 初始化
        //*********************************************/
		function init() {

		    loadData();
		
	    	$(window).resize(tilesRelayout);	    			

	    	$("#switcherLeft").click(moveLeft);
	    	$("#switcherRight").click(moveRight);

	    	$(".yonyouTilesAddBtn").click(manageAdd);
	    	$(".yonyouTilesCancelBtn").click(manageCancel);
	    	$(".yonyouTilesOKBtn").click(manageOk);
	    	$(".yonyouTilesCustomize").click(manageEdit);	    	
		}

		function loadData() {
		    if (opts.data == null) {
		        if (opts.url != null) {
		            $.ajax({
		                url: opts.url,//要访问的后台地址
		                data: "pageIndex=1",//要发送的数据
		                type: "get",//使用get方法访问后台
		                dataType: "json",//返回json格式的数据               
		                complete: function () { }, //alert("complete"); },                       // $("#load").hide(); },//AJAX请求完成时隐藏loading提示
		                success: function (msg) {//msg为返回的数据，在这里做数据绑定		                    
		                    opts.data = msg;
		                    initTiles();
		                }
		            });
		        }
		    }
		    else {
		        initTiles();
		    }
		}

		function initTiles() {
		    createTiles();
		    tilesRelayout();		  
		}	



	    /*管理tiles*/

		function getTileData(uuid) {
		    var tile;
		    var data = opts.data;
		    if (data != null) {
		        for (var i = 0; i < data.length; i++) {
		            if (uuid == data[i].uuid) {
		                tile = data[i];
		            }
		        }
		    }
		    return tile;
		}

		function setTileDataCheckState(tile, state) {
		    if (tile != null) {
		        tile.checked = state;
		    }
		}

	    //**********************************************************/
	    // 移除tile，并重新设置位置
	    //*********************************************************/

		function removeTile(uuid) {	    

		    var  target = $(".yonyouGuilinTile.small.yonyouGuilinBreatheDiv[uuid='" + uuid + "']")		    
		    var origin = target;
		    var left = target.css("left"), top = target.css("top");		    
		    var current =target.next();		    
		    while (current.length != 0)
		    {
		        var tempLeft = current.css("left");
		        var temptop = current.css("top");

		        current.css("left", left);
		        current.css("top", top);
                              
		        left = tempLeft;
		        top = temptop;		        

		        current = current.next();
		    }
		    var len = origin.parent().children().length;
		    origin.remove();		    
            //更新其是否显示的状态
		    setTileDataCheckState(getTileData(uuid), false);
		    //移除某个需要考虑总数的变动导致的，分页变动，以及设置当前页的问题；
		    changePageInfoAfterTileCountChange(len - 1,false);		   
		}		

	    //**********************************************************/
	    // 追加 tile到最后页中，并设置其位置
	    //*********************************************************/

		function appendTile(uuid) {
		    var tile = getTileData(uuid);

		    if (tile != null) {
		        //var tileHtml = createTile(tile.uuid, tile.title, tile.subTitle, tile.num, tile.content, tile.url, type);
		        var tileHtml = createTile(tile.uuid, tile.title, tile.subTitle, tile.num, tile.content, tile.url, tile.type);
		        var tileContainer = $(".gridlyTransition");
		        tileContainer.append(tileHtml);

		        var len = tileContainer.children().length;
                		        
		        ////设置其位置
		        var loc = getTileLocation(len - 1);
		        tileContainer.children(":last").css({ "left": loc.left, "top": loc.top });		        

		        setTileDataCheckState(tile, true);
		        //增加某个需要考虑总数的变动导致的，分页变动，以及设置当前页的问题；		        
		        changePageInfoAfterTileCountChange(len,true);
               
            }
		}

	    //**********************************************************/
	    // 增加或者移除磁贴后更新磁贴总数,页面数，及页指示器数量
	    // 参数 tileCount 表示磁贴总数	 
	    //*********************************************************/
		function changePageInfoAfterTileCountChange(tileCount,isAdd) {
		    var oldPageCount  = tilePageInfo.totalPageCount;
		    var newPageCount =  cacaulatePageCount(tileCount, tilePageInfo.row, tilePageInfo.col);
		    if(oldPageCount !=newPageCount){
		        tilePageInfo.totalPageCount = newPageCount;
                //页数发生变化后，需要更新页指示器
		        indicatorRelayout(newPageCount,tilePageInfo.currentPage);
		    }

		    if (isAdd==true) {
		        if (tilePageInfo.currentPage != tilePageInfo.totalPageCount - 1) {
		            //增加一个磁贴后，翻转到最后一个页面
		            moveTo(tilePageInfo.totalPageCount - 1);
		        }
		    }
		    else {
                //减少磁贴时，如果导致页总数也减少了，则移动到最有一页
		        if (oldPageCount > newPageCount) {
		            moveTo(newPageCount - 1);
		        }
		    }

		    switcherButtonShow();
		}		

		init();

		

		return this;		
	};

	$.fn.Carousel.defaults = {
		tileHSpace: 10,
		tileVSpace: 20,
		tileWidth: 220,
		tileHeight: 220,
		pageSwitcherWidth: 50,
		tileContainerMargin:20,
		speed: 1000,  //毫秒	
		data: null,
        url:null,
	};


	function Location(left,top) {
	    this.left = left;
	    this.top = top;
	}




})(jQuery);

//http://localhost:8886/u8services/classes/UAP/com.yonyou.u8.framework.server.service.base.MenuService?token=78eea58cbebc43d789d7c5d07a187829&size=L&method=GetMenu&pageIndex=1



























