cb.controls.widget("SearchButton", function (controlType) {
    var control = function (id, options) {
        cb.controls.Control.call(this, id, options);
        this.$container = this.getElement().children();
        this.$searchBtn = this.$container.last().find("span");
        this.$input = this.getElement().find("input");
        var that = this;
        this.$searchBtn.click(function (e, args) {
            that.fireSearch(e,args);
        });

    };
    control.prototype = new cb.controls.Control();
    control.prototype.controlType = controlType;
        

    control.prototype.setData = function (data) {            
        if (data) {
            this.Init(1);
            if(data.value)
                this.setDataSource(data.value);
        }
    };

    control.prototype.setDataSource = function (data) {
        if(data){
            this.$input.val(data);
        }
    }

    control.prototype.Init = function (val) {
        var me = this;
        var toggle = function (e, args) {
            var disabled = e.data._get_data("disabled");
            if (disabled) return;
            var e = e || window.event;
            var $container = me.getElement().children().last();
            $container.css("top", e.pageY + 10);
            $container.css("left", e.pageX - 20);
            $container.toggle();
            e.stopPropagation();
        }

        this.$input.bind("keydown", function (e, args) {
            var key = e.which;
            if (key == 13) {
                me.fireSearch(e, args);
            }
        });

        this.getElement().children().first().click(this, toggle);       
        if (val > 0)
            this.getElement().children().last().css("height", val * 35);
    };

    control.prototype.fireSearch = function (e, args) {
        var value = this.$input.val();
        if (value && value.length > 0) {
            this.execute("click", value);
        }           
    };

    control.prototype.setDisabled = function (val) {
        this.getElement().attr("disabled", val);
        this._set_data("disabled", val);
    };

    control.prototype.getDisabled = function (val) {
        return this._get_data("disabled");
    };

    return control;
});