/// <reference path="../Control.js" />
cb.controls.widget("CustomList", function (controlType) {
    var control = function (id, options) {
        cb.controls.Control.call(this, id, options);
        this._id =id;
        this._ulId=id+"ul";
        this._showConfig =true;
    };
    control.prototype = new cb.controls.Control();
    control.prototype.controlType = controlType;
    // 设置数据
    control.prototype.setData = function (data) {
        if(data.showConfig!=undefined)
            this.setConfigVisible(data.showConfig);
        for (var attr in data) {
            var attrUpper = attr.substring(0, 1).toUpperCase() + attr.substring(1);
            if (this["set" + attrUpper]) this["set" + attrUpper](data[attr]);
        }
    };
    control.prototype.setDataSource =function(datas){
        var $ul = $('<ul class="deliveryList" id="'+this._ulId+'">');
//        $ul.attr('id',this._ulId);
        var that =this;
        datas.forEach(function(data,dataIndex,datas){
            var $li =$('<li></li>');
            $li.data('data',data);
            var $tldiv =$('<div class="icon-default topLeft">默</div>');
            $li.append($tldiv);
            var $trm=$('<span class="icon-default-right">默</span>');
            $trm.bind('click',function(){
               $(this).parents('li').find('.topLeft').show();
               $(this).hide();
                $(this).parents('li').siblings().find('.topLeft').hide();
                $(this).parents('li').siblings().find('.icon-default-right').show();
            });

            if(that._showConfig){
            var $txt = $('<em>参数设置</em>');
            $txt.bind('click', function () {
                //cb.route.loadPageViewPart(this,'common.sysmanager.ParameterSettingApp',{width:"610px",height:"100%"})
                var args={};
                that.execute('configSet',args);
            });}

            var $mrdiv=$('<div class="parameterSet"></div>');
            $mrdiv.append($trm);
            $mrdiv.append($txt);
            $li.append($mrdiv);

            var $p =$('<p>'+data.text+'</p>');
            $li.append($p);
            var $trfiv = $('<div class="icon-close topRight"></div>');
            $li.append($trfiv);
            $ul.append($li);

        });
     $("#"+this._id).append($ul);
     $("#"+this._id+' .topLeft').eq(0).show();
     $("#"+this._id+' .icon-default-right').eq(0).hide();
    };
    control.prototype.setValue = function (val) {

        var masked = this.getElement().data("CustomList");
        masked.value(val);
    };
    control.prototype.setConfigVisible =function(val){
            this._showConfig =val;
    },
    /*
     *	得到输入框的值
     */
    control.prototype.getValue = function () {
        var masked = this.getElement().data("CustomList");
        var val = masked.value();
        return val;
    };



    /*
     *	设置 只读属性
     */
    control.prototype.setReadOnly = function (val) {

    };

    /*
     *	获取 只读属性
     */
    control.prototype.getReadOnly = function () {

    };




    return control;
});