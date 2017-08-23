cb.controls.Modal = Modal = function (element, options) {
    // MODAL CLASS DEFINITION
    // ======================

    var modal = function (element, options) {
        this.options = options;
        this.$element = $(element);
        this.$backdrop = this.isShown = null;

        if (this.options.remote) this.$element.load(this.options.remote);
    }

    modal.DEFAULTS = {
        backdrop: true,
        keyboard: true,
        show: true
    };

    modal.prototype.toggle = function (_relatedTarget) {
        return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
    }

    modal.prototype.show = function (_relatedTarget) {

        var that = this

        var e = $.Event('show.bs.modal', { relatedTarget: _relatedTarget });

        this.$element.trigger(e);

        if (this.isShown || e.isDefaultPrevented()) return;

        this.isShown = true;

       // this.escape();

        this.$element.on('click.dismiss.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this));

        this.$element.on('click.ok.modal', '[data-ok="modal"]', $.proxy(this.ok, this));

        this.backdrop(function () {
            var transition = $.support.transition && that.$element.hasClass('fade');

            if (!that.$element.parent().length) {
                that.$element.appendTo(document.body);  // don't move modals dom position
            }

            that.$element.show();

            if (transition) {
                that.$element[0].offsetWidth; // force reflow
            }

            that.$element.addClass('in').attr('aria-hidden', false);
            that.enforceFocus();
            var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget });
            transition ? that.$element.find('.modal-dialog')
                                      .one($.support.transition.end, function () { that.$element.focus().trigger(e) })
                                       .emulateTransitionEnd(300) :
            that.$element.focus().trigger(e);
        })
    }

    modal.prototype.ok = function (e) {

        if (e) e.preventDefault();

        e = $.Event('ok.bs.modal');

        //        var text = this.$element.find("input:first").get(0).value;
        //        var value = this.$element.find("input:last").get(0).value;

        //this.$element.trigger(e, { text: text, value: value });

        this.$element.trigger(e);

        this.hide(e);
    }

    modal.prototype.hide = function (e) {
        if (e) e.preventDefault();

        e = $.Event('hide.bs.modal');

        this.$element.trigger(e);

        if (!this.isShown || e.isDefaultPrevented()) return;

        this.isShown = false;

        //this.escape();

        $(document).off('focusin.bs.modal');

        this.$element.removeClass('in')
                     .attr('aria-hidden', true)
                     .off('click.dismiss.modal')
                     .off('click.ok.modal');
        if ($.support.transition && this.$element.hasClass('fade')) {
            this.$element
        .one($.support.transition.end, $.proxy(this.hideModal, this))
        .emulateTransitionEnd(300)
        }
        else {
            this.hideModal();
        }
    }

    modal.prototype.enforceFocus = function () {
        $(document).off('focusin.bs.modal') // guard against infinite focus loop
                   .on('focusin.bs.modal', $.proxy(function (e) {
                       if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
                           this.$element.focus()
                       }
                   }, this));
    };

    modal.prototype.escape = function () {
        if (this.isShown && this.options.keyboard) {
            this.$element.on('keyup.dismiss.bs.modal',
                 $.proxy(function (e) { e.which == 27 && this.hide() }, this));
        } else if (!this.isShown) {
            this.$element.off('keyup.dismiss.bs.modal');
        }
    }

    modal.prototype.hideModal = function () {
        var that = this;
        this.$element.hide();
        this.backdrop(function () {
            that.removeBackdrop();
            that.$element.trigger('hidden.bs.modal');
        })
    }

    modal.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove();
        this.$backdrop = null;
    }

    modal.prototype.backdrop = function (callback) {
        var that = this;
        var animate = this.$element.hasClass('fade') ? 'fade' : '';

        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate;

            this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />').appendTo(document.body);

            //this.$element.on('click.dismiss.modal', $.proxy(function (e) {
            //    if (e.target !== e.currentTarget) return;
            //    if (this.options.backdrop == 'static') {
            //        this.$element[0].focus.call(this.$element[0])
            //    }
            //    else {
            //        this.hide.call(this)
            //    }
            //}, this));

            if (doAnimate) this.$backdrop[0].offsetWidth; // force reflow

            this.$backdrop.addClass('in');

            if (!callback) return;

            doAnimate ? this.$backdrop.one($.support.transition.end, callback).emulateTransitionEnd(150) : callback();

        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass('in');
            if ($.support.transition && this.$element.hasClass('fade')) {
                this.$backdrop.one($.support.transition.end, callback).emulateTransitionEnd(150);
            }
            else {
                callback();
            }

        } else if (callback) {
            callback();
        }
    }

    this.showModal = function (_relatedTarget) {

        var $this = $(this);

        var data = $this.data('bs.modal');

        var opts = $.extend({}, modal.DEFAULTS, $this.data(), typeof options == 'object' && options)

        if (!data) $this.data('bs.modal', (data = new modal(element, opts)))

        if (typeof option == 'string') {
            data[option](_relatedTarget);
        }
        else if (opts.show) {
            data.show(_relatedTarget);
        }
    }

    this.hideModal = function () {
        
        var $this = $(this);

        var data = $this.data('bs.modal');

        data.hide();
    };

    // MODAL DATA-API
    // ==============

    $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
        var $this = $(this);
        var href = $this.attr('href');
        var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, '')));  //strip for ie7
        var option = $target.data('modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data());

        e.preventDefault();

        $target.modal(option, this).one('hide', function () {
            $this.is(':visible') && $this.focus()
        });
    });

    $(document)
    .on('show.bs.modal', '.modal', function () { $(document.body).addClass('modal-open') })
    .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

};
