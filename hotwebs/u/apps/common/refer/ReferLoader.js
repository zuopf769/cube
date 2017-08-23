var ReferLoader = {
    config: {
        load: { url: "classes/Ref/UAP/GetInputReferData", method: "Post" },
        loadCarrier: { url: "classes/Ref/UAP/GetRefCarry", method: "POST" }
    },
    

    getProxy: function () {
        if(!this._proxy){
            this._proxy = cb.rest.DynamicProxy.create(this.config);
        }

        return this._proxy;
    },

    loadRefer: function (refCode, filters, callBack, queryData) {//filters为字符串或字符串数组

        var options = { "refCode": refCode, filters: filters };
        if (queryData && typeof queryData==='object') {//可选的参数
            $.extend(true, options, queryData);
        }
        this.getProxy().load(options, callBack);
    },

    loadCarrier:function(refCode,primaryKey,relation,callBack){
        var options = { "refCode": refCode, primaryKey: primaryKey, refRelation: relation };
        this.getProxy().loadCarrier(options, callBack);
    }
}