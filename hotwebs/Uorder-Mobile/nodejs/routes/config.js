var cb = {};
cb.web = {};
cb.webserver = {};
//cb.webserver.UapServiceBaseUrl = "http://udh.yonyouup.com:90";
cb.webserver.UapServiceBaseUrl = "http://42.159.96.193:80";
//cb.webserver.UapServiceBaseUrl = "http:/10.1.202.162:90";
//cb.webserver.UapServiceBaseUrl = "http://10.1.214.59:90";

cb.webserver.headerConfig = {
    ".htm": { "Content-Type": "text/html" },
    ".html": { "Content-Type": "text/html" },
    ".jsp": { "Content-Type": "text/html" },
    ".js": { "Content-Type": "text/javascript" },
    ".css": { "Content-Type": "text/css" },
    ".gif": { "Content-Type": "image/gif" },
    ".jpg": { "Content-Type": "image/jpg" },
    ".png": { "Content-Type": "image/png" },
    ".json": { "Content-Type": "application/json" },
    ".txt": { "Content-Type": "text/html" },
    ".stream": { "Content-Type": "application/octet-stream" },
    ".xml": { "Content-Type": "text/xml" },
    ".xsl": { "Content-Type": "text/xml" },
    ".ppt": { "Content-Type": "application/octet-stream" },
    ".pptx": { "Content-Type": "application/octet-stream" },
    ".doc": { "Content-Type": "application/octet-stream" },
    ".docx": { "Content-Type": "application/octet-stream" },
    ".pdf": { "Content-Type": "application/octet-stream" },
    ".xlsx": { "Content-Type": "application/octet-stream" },
    ".xls": { "Content-Type": "application/octet-stream" },
    "default": { "Content-Type": "application/octet-stream" }
};

cb.queryString = function (qs) {
    this.p = {};
    //if (!qs)
    //    url = location.search;
    if (qs) {
        var b = qs.indexOf('?');
        var e = qs.indexOf('#');
        if (b >= 0) {
            qs = e < 0 ? qs.substr(b + 1) : qs.substring(b + 1, e);
            if (qs.length > 0) {
                qs = qs.replace(/\+/g, ' ');
                var a = qs.split('&');
                for (var i = 0; i < a.length; i++) {
                    var t = a[i].split('=');
                    var n = decodeURIComponent(t[0]);
                    var v = (t.length == 2) ? decodeURIComponent(t[1]) : n;
                    this.p[n] = v;
                }
            }
        }
    }
    this.set = function (name, value) {
        this.p[name] = value;
        return this;
    };
    this.get = function (name, def) {
        var v = this.p[name];
        return (v != null) ? v : def;
    };
    this.has = function (name) {
        return this.p[name] != null;
    };
    this.toStr = function () {
        var r = '?';
        for (var k in this.p) {
            r += encodeURIComponent(k) + '=' + encodeURIComponent(this.p[k]) + '&';
        }
        return r;
    };
};


module.exports = cb;