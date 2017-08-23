cb.controls.widget("Pagination", function (controlType) {
    var control = function (id, options) {
        cb.controls.Control.call(this, id, options);
        var $container = this.getElement().children().last();

        $container.on("click", this, function (e) {
            var disabled = e.data._get_data("disabled");
            if (disabled) return;
            e.data.execute("click", e.data.getValue(e));
        });

        this.first = $container.find(".pager-first");
        this.previous = $container.find(".pager-previous");
        this.next = $container.find(".pager-next");
        this.last = $container.find(".pager-last");
        this.billIndex = this.getElement().children().first();
        this.billCount = this.billIndex.next();
    };

    control.prototype = new cb.controls.Control();
    control.prototype.controlType = controlType;

    control.prototype.setValue = function (args) {
        if (args) {
            var data = args;
            if (data && data.billIndex && data.billCount) {
                this.data = data;
                this.billIndex.text(data.billIndex);
                this.billCount.text(data.billCount);
                this.updateStatus(data);
            }
        }
    };

    control.prototype.getValue = function (e) {
        var e = e || window.event;
        if (!e) return;
        var $a = $(e.target).closest("a");
        if ($a) {
            if ($a.attr("disabled")) return null;
            if (this.data && this.data.billIndex && this.data.billCount) {
                var toPage = this.data.billIndex;
                var flag = $a.attr("data-flag");
                switch (flag) {
                    case "first":
                        toPage = 1;
                        break;
                    case "previous":
                        toPage -= 1;
                        if (toPage <= 0) {
                            toPage = 1;
                        }
                        break;
                    case "next":
                        toPage += 1;
                        if (toPage > this.data.billCount) {
                            toPage = this.data.billCount;
                        }
                        break;
                    case "last":
                        toPage = this.data.billCount;
                        break;
                }
                return { "data-flag": flag, "data-value": toPage };
            }

        }
        else
            return null;
    };

    control.prototype.updateStatus = function (data) {
        if (data && data.billIndex && data.billCount) {
            if (data.billIndex == 1) {
                this.first.attr("disabled", true);
                this.previous.attr("disabled", true);
                this.next.attr("disabled", false);
                this.last.attr("disabled", false);
            } else if (data.billIndex == data.billCount) {
                this.next.attr("disabled", true);
                this.last.attr("disabled", true);
                this.first.attr("disabled", false);
                this.previous.attr("disabled", false);
            } else {
                this.next.attr("disabled", false);
                this.last.attr("disabled", false);
                this.first.attr("disabled", false);
                this.previous.attr("disabled", false);
            }

        }
    };

    return control;
});