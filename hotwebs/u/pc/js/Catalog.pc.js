(function ($) {

    cb.controls.Catalog.prototype.getMaxLevel = function () {
        return Number.MAX_VALUE;
    }

    cb.controls.Catalog.prototype.setChildren = function (result) {
        this.helper.appendChildren(result);
    }    

})(jQuery);