UOrderApp.ns('UOrderApp.pages');
UOrderApp.pages.ListProductController = function () {
    this.productInfo = Template7.compile($$('#productInfoTpl').html());
};
UOrderApp.pages.ListProductController.prototype.preprocess = function (content, url, next) {
    var self = this;
    var context = $$.parseUrlQuery(url) || {};
    self.context = context;
    cb.rest.getJSON('ma/ShoppingCarts/getCartList', function (data) {
        if (data.code == 200) {
            self.productsdata = data.data;
            next(content);
        }
        else {
            myApp.toast(data.message, 'error').show(true);
        }
    });

};
UOrderApp.pages.ListProductController.prototype.pageInit = function (page) {
    var self = this;
    if (page.query.cartId && page.query.cartId instanceof Array) {
        $$('#listQuantity').html(page.query.cartId.length);
        var cartId = page.query.cartId;
        var data = self.productsdata;
        var productList = [];
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < cartId.length; j++) {
                if (data[i].id == cartId[j]) {
                    var json = {};
                    json.title = data[i].oSKU.oProduct.cName;
                    json.code = data[i].oSKU.oProduct.cCode;
                    json.price = data[i].fSalePrice;
                    json.quantity = data[i].iQuantity;
                    json.imageUrl = data[i].oSKU.oProduct.oDefaultAlbum.cFolder +'s_'+ data[i].oSKU.oProduct.oDefaultAlbum.cImgName;
                    //遍历数组中所有属性值
                    json.property ='';
                    for (var o = 0; o < data[i].oSKU.lsSkuSpecItems.length; o++) {
                        json.property = json.property + data[i].oSKU.lsSkuSpecItems[o].oSpec.cMemo +":"+ data[i].oSKU.lsSkuSpecItems[o].oSpec.cName+" ";
                    }
                    productList.push(json);
                }
            }
        }
        self.context.data = productList;
        self.context.serverhost = cb.rest.appContext.serviceUrl;
        $$('.productList_ul').html(self.productInfo(self.context));
        $$('#listQuantity').html(page.query.cartId.length);
        myApp.initImagesLazyLoad(myApp.mainView.activePage.container);
    } else {
    	page.query.serverhost = cb.rest.appContext.serviceUrl;
    	$$('.productList_ul').html(self.productInfo(page.query));
    	$$('#listQuantity').html(page.query.data.length);
        myApp.initImagesLazyLoad(myApp.mainView.activePage.container);
    }

};
