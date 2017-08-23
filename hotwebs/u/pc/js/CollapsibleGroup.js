cb.controls.widget("CollapsibleGroup", function (controlType) {
    var control = function (id, options) {
        cb.controls.Control.call(this, id, options);
        var $groupTitle = this.getElement().children().first();
        if ($groupTitle.length && $groupTitle.hasClass("border-l-blue")) {
            $groupTitle.attr("mode", "show");
            $groupTitle.click(function (e, args) {
                var $content = $(this).next();
                if (!$content.length) return;
                if ($content.is(":hidden")) {
                    $content.show();
                    $(this).attr("mode", "show");
                } else {
                    $content.hide();
                    $(this).attr("mode", "hide");
                }
            });
            this._set_data("$groupTitle", $groupTitle);
        }
    };
    control.prototype = new cb.controls.Control();
    control.prototype.controlType = controlType;

    control.prototype.setData = function (data) {
        if (data.visible != null)
            this.setVisible(data.visible);
    };

    control.prototype.setVisible = function (visible) {
        var $groupTitle = this._get_data("$groupTitle");
        if ($groupTitle)
            visible === false ? $groupTitle.next().hide() : $groupTitle.next().show();
        else
            visible === false ? this.getElement().hide() : this.getElement().show();
    };

    return control;
});