cb.route.menuMappings = {
    "u8.closebillListApp": "apps/u8/closebill?mode=List",
    "u8.closebillApp": "apps/u8/closebill?mode=Card"
};

cb.route.getPageUrl = function (pageRoute, queryString) {
    if (!queryString)
        queryString = {};
    var queryStringParent = new cb.util.queryString(location.search);
    if (queryStringParent) {
        queryString.token = queryString.token || queryStringParent.get("token");
        queryString.size = queryString.size || queryStringParent.get("size");
    }
    var pageUrl = pageRoute;
    if (cb.route.menuMappings[pageRoute])
        pageUrl = cb.route.menuMappings[pageRoute];
    cb.eachIn(queryString, function (index, attr, val) {
        if (index == 0 && pageUrl.indexOf("?") == -1)
            pageUrl += "?" + attr + "=" + val;
        else
            pageUrl += "&" + attr + "=" + val;
    });
    return pageUrl;
};