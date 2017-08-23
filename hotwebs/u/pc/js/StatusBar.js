(function ($) {
    $.extend(true, window, {
        "cb": {
            "controls": {
                "StatusBar": StatusBar
            }
        }
    });
    /*
    options={
        data:[
            ｛
                name:'point1',
                content:'节点相关的描述信息'//例如所在节点上的备注信息（时间，审批意见等）
            ｝,
            ｛
                name:'point1',
                content:'节点相关的描述信息'
            ｝
        ],
        dir:'h'//默认水平展示，可选值为 h/v,v表示垂直显示
    }
    */
    
    var barTmpl = '<li><div class="innerBar"></div><div class="node"><div></div></div></li>';
    var descriptionTmpl = '<li><div class="contentWrapper"><div class="name">{{name}}</div><div class="content">{{content}}</div></div></li>';
    var barList = 'barList',
        nodeDetailList = 'descriptionList',
        //wrapperSel = '.wrapper',
        arrived = 'arrived',
        current = 'current',
        controlCls = 'statusBar';
    var optionClsMap = {
        'HT': '',
        'HD': '',
        'VL': 'v',
        'VR': ' v right',

        'TH': '',
        'DH': '',
        'LV': 'v',
        'RV': ' v right'
    };

    function StatusBar(el, options) {
        if (typeof el === 'string') {
            el = document.getElementById(el);
        }
		var $el=$(el).first();
        

        this.init = function (options) {
            var dir = (options.dir || '').toUpperCase();
			//默认水平显示，内容显示在状态条下面
			dir = !optionClsMap[dir] ? 'HD' : dir;

			var attr = dir.indexOf('V')==-1? 'width' : 'height';
			
			
			$el.addClass(controlCls);
			if (optionClsMap[dir]) {
				$el.addClass(optionClsMap[dir]);
			}
			

			this._data=options.datasource||[];
            var bars = [],
                details = [];
            var control = this;
            for (var i = 0, len = this._data.length; i < len; i++) {
                bars.push(barTmpl);
                details.push(descriptionTmpl.replace(/\{\{(\w+)\}\}/g, function ($0,$1) {
                    return control._data[i][$1]||'';
                }));
            }
            var html = [].concat('<div class="wrapper"><ul class="' + barList + '">', bars, '</ul><ul class="' + nodeDetailList +'">', details,'</ul></div>');
            //console.log('html:', html, html.join(''));

            var lists = $(html.join(''));

            //处理第一个状态节点以及列表的样式                        
            
            lists.find('>ul>li').css(attr, 1 / len * 100 + '%');
            //lists.find('li:eq(0)').first().addClass('first').css(attr, dir == 'h'?(1 / len * 50 + '%'):0);            
            lists.find('li:eq(0)').first().addClass('first').css(attr, 1 / len * 50 + '%');
            lists.css('left', 0 - 1 / len * 50 + '%');
            $el.append(lists);

            //this.setValue(index?index:0 , data); 
			this.setValue(options.value);
        }

        
		/*
			val={
				index:@Number,//状态节点索引
				content:'asdfasdf'//节点备注内容
			}
		*/
        this.setValue = function (val) {
			val=val||{};			
			var index=val.index||0,
				content=val.content;
            //0=<index<length
            if (!this._data.length) return;

            index = Math.min(Math.max(index, 0),this._data.length-1);

            var li = $('>li:eq('+index+')', $el.find('.' + barList + ',.' + nodeDetailList));
            li.nextAll('li').removeClass(arrived, current);
            li.prevAll('li').add(li).addClass(arrived);//不能用addSelf,当li没元素时addSelf方法有bug。
            li.addClass(current);
            
            if (content) {
                $('.' + nodeDetailList + '>li .content', $el).eq(index).html(content);
            }
            
        };

		this.setData=function(options){
			this.init(options);
		}

    }
})(jQuery);

