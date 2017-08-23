var CatalogViewModel = function (name) {
    cb.model.ContainerModel.call(this, null, name || "CatalogViewModel");
    this.init();
};
CatalogViewModel.prototype = new cb.model.ContainerModel();
CatalogViewModel.prototype.constructor = CatalogViewModel;

CatalogViewModel.prototype.init = function () {
    var fields = {
        ViewModelName: "CatalogViewModel",
        Catalog: new cb.model.SimpleModel(),
        Symbol: "UAP",
        PageSize :10
    };
    this.setData(fields);
    this.setDirty(false);


    var proxyConfig = {
        GetList: { url: "service/u8services?actionID=5EBA3DA0-70DB-466B-9A38-8B6FAD93C86E", method: "Post" }
    };
    this.setProxy(proxyConfig);


    

    this.getCatalog().on("beforeExpand", function (data) { CatalogViewModel_Extend.beforeExpand(this.getParent(), data) });
    this.getCatalog().on("click", function (data) { CatalogViewModel_Extend.catalogClick(this.getParent(), data) });
    this.getCatalog().on("moreClick", function (data) { CatalogViewModel_Extend.catalogMoreClick(this.getParent(), data) });

    
    CatalogViewModel_Extend.doAction("init_Extend", this);
   
}

CatalogViewModel.prototype.onClick = function (func) {
    this.getCatalog().on("click", func);
}