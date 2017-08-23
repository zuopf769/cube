var CustomerCatalogViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "CustomerCatalogViewModel");
    this.init();
};
CustomerCatalogViewModel.prototype = new cb.model.ContainerModel();
CustomerCatalogViewModel.prototype.constructor = CustomerCatalogViewModel;

CustomerCatalogViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "CustomerCatalogViewModel",
        CustomerCatalog: new cb.model.SimpleModel(),
        Symbol: "UAP",
        PageSize :10
    };
    this.setData(fields);
    this.setDirty(false);


    var proxyConfig = {
        GetList: { url: "service/u8services?actionID=5EBA3DA0-70DB-466B-9A38-8B6FAD93C86E", method: "Post" }
    };
    this.setProxy(proxyConfig);


    

    this.getCustomerCatalog().on("beforeExpand", function (data) { CustomerCatalogViewModel_Extend.beforeExpand(this.getParent(), data) });
    this.getCustomerCatalog().on("click", function (data) { CustomerCatalogViewModel_Extend.catalogClick(this.getParent(), data) });
    this.getCustomerCatalog().on("moreClick", function (data) { CustomerCatalogViewModel_Extend.catalogMoreClick(this.getParent(), data) });

    
    CustomerCatalogViewModel_Extend.doAction("init_Extend", this);
   
}

CustomerCatalogViewModel.prototype.onClick = function (func) {
    this.getCustomerCatalog().on("click", func);
}