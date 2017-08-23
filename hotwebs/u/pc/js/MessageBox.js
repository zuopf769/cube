cb.controls.MessageBox = function (options) {
    this._defaultOptions = {
        width: 366,
        height: 218,
        actions: []
    };
    this.init = function () {
        if (!options) return;
        switch (options.displayMode) {
            case "confirm":
                this.initConfirm();
                break;
            case "warning":
                this.initWarning();
                break;
            case "tip":
                this.initTip();
                break;
        };
    }

    this.initConfirm = function () {
        var $parent = $(document.body);
        var $dialog = $("<div></div>").appendTo($parent);
        var $container = $("<div class='message-box'></div>").appendTo($dialog);
        var $image = $("<img class='img'  src='pc/images/u14.png'/>").appendTo($container);
        var $text = $("<div class='information'></div>").appendTo($container);
        var $hr = $("<hr class='hr'/>").appendTo($container);
        var $hr1 = $("<div class='line'></div>").appendTo($container);
        var $btnOk = $("<button class='btnok' >确认</button>").appendTo($container);
        var $btnCancel = $("<button  class='btncn' >取消</button>").appendTo($container);

        $text.html(options.msg);
        var dialog = new cb.controls.Modal($dialog, cb.extend(this._defaultOptions, { title: "确认" }));
        $btnOk.click(dialog, function (e, args) {
            if (options.okCallback) options.okCallback.call(options.context || this);
            e.data.hideModal();
        });
        $btnCancel.click(dialog, function (e, args) {
            if (options.cancelCallback) options.cancelCallback.call(options.context || this);
            e.data.hideModal();
        });
        dialog.showModal();
    };

    this.initWarning = function () {
        var $parent = $(document.body);
        var $dialog = $("<div></div>").appendTo($parent);
        var $container = $("<div class='message-box'></div>").appendTo($dialog);
        var $image = $("<img class='warning-img' src='pc/images/u23.png' />").appendTo($container);
        var $text1 = $("<div class='warning-infor'></div>").appendTo($container);
        var $text = $("<div class='warning-information'></div>").appendTo($container);
        var $hr = $("<hr class='warning-hr'/>").appendTo($container);
        var $btnOk = $("<div class='warning-btnok'>确认</button>").appendTo($container);
        $text.html(options.title);
        $text1.html(options.msg);
        var dialog = new cb.controls.Modal($dialog, cb.extend(this._defaultOptions, { title: "警告" }));
        $btnOk.click(dialog, function (e, args) {
            if (options.okCallback) options.okCallback.call(options.context || this);
            e.data.hideModal();
        });
        dialog.showModal();
    };


    this.initTip = function () {
        var $parent = $(document.body);
        var $dialog = $("<div></div>").appendTo($parent);
        var $container = $("<div class='message-box'></div>").appendTo($dialog);
        var $image = $("<img class='tip-img' src='pc/images/u29.png' />").appendTo($container);
        var $text = $("<div class='tip-information'></div>").appendTo($container);
        var $hr = $("<hr class='warning-hr'/>").appendTo($container);
        var $btnOk = $("<div class='warning-btnok'>确认</button>").appendTo($container);
        $text.html(options.msg);
        var dialog = new cb.controls.Modal($dialog, cb.extend(this._defaultOptions, { title: "提示" }));
        $btnOk.click(dialog, function (e, args) {
            if (options.okCallback) options.okCallback.call(options.context || this);
            e.data.hideModal();
        });
        dialog.showModal();
        setTimeout(function () {
            if (options.okCallback) options.okCallback.call(options.context || this);
            dialog.hideModal();
        }, 2000);
    };

    this.init();
};