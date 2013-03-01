/*
 * toolTip
 * https://github.com/amazingSurge/tooltip
 *
 * Copyright (c) 2013 amazingSurge
 * Licensed under the MIT license.
 */

(function($) {   
    "use strict";

    var doc = window.document,
        $doc = $(document),
        $win = $(window);

    // we'll use this to detect for mobile devices
    function is_touch_device() {
        return !!('ontouchstart' in window);
    }
    
    // detecting support for CSS transitions
    function supportsTransitions() {
        var b = document.body || document.documentElement;
        var s = b.style;
        var p = 'transition';
        if(typeof s[p] == 'string') {return true; }
    
        v = ['Moz', 'Webkit', 'Khtml', 'O', 'ms'],
        p = p.charAt(0).toUpperCase() + p.substr(1);
        for(var i=0; i<v.length; i++) {
          if(typeof s[v[i] + p] == 'string') { return true; }
        }
        return false;
    }

    var transitionSupport = true;
    if (!supportsTransitions()) {
        transitionSupport = false;
    }

    // Static method.
    var Tooltip = $.tooltip = function($elem,options) {

        this.$elem = $elem;
        this._name = 'Tooltip';
        this.options = $.extend( {}, Tooltip.defaults, options );
        
        
        this.isOpen = null;
        this.enabled = true;
        
        this.init();

    };

    Tooltip.prototype = {
        constructor: Tooltip,
        init: function() {
            var opts = this.options,
                this.$container = $(opts.container),
                this.$arrow = $(opts.arrow),
                this.$close = $(opts.close),
                self = this;


            if (opts.closeBtn === true) {
                this.$container.append(this.$close);
            }
            this.$container.append(this.$arrow);
            
            if (opts.trigger === 'hover') {
                this.$elem.on('mouseenter',$.proxy(this.show,this));
                if (opts.interactive === false) {
                    this.$elem.on('mouseleave',$.proxy(this.hide,this));
                } else {

                }

                if (this.options.mouseTrace === true) {
                    this.$elem.on('mousemove',function(event) {
                        var x = event.top,
                            y = event.left;

                        self.$container.css({
                            top: 
                        })
                    })
                }

            }
            if (opts.trigger === 'click') {
                this.$elem.on('click',function() {

                });
            }

        },
        show: function(elem) {
            if (this.enabled !== true) { 
                return ;
            }

            //open effect
            transitions[opts.effect]['openEffect'](this);
            
            this.options.onShow(elem);
            this.$container.trigger('show');
            this.isOpen = true;
        },
        hide: function(elem) {

            this.options.onHide(elem);
            this.$container.trigger('hide');
            this.isOpen = false;
        },
        update: function() {
            this.options.onUpdate(elem);
        },
        enable: function() {
            this.enabled = true;
        },
        disable: function() {
            this.enabled = false;
        },
        _showLoading: function() {},
        _hideLoading: function() {},
        _position: function() {
            var winWidth = $win.width(),
                winHeight = $win.height(),
                containerWidth = this.$container.outerWidth(false),
                containerHeight = this.$container.outerHeight(false);
        }
    }

    // Static method default options.
    Tooltip.default = {

        trigger: 'hover', // hover click
        interactive: false,
        mouseTrace: false,
        closeBtn: false,

        delay: 0,
        effect: 'fade', // fade none zoom
        duration: 200,

        onShow: null,
        onHide: null,
        onUpdate: null,

        tpl: {
            container: '',
            arrow: '',
            close: ''
        }
    };

    //open effect
    var transition = {};
    transition.fade = {
        openEffect: function(instance) {},
        closeEffect: function(instance) {}
    };
    transition.zoom = {
        openEffect: function(instance) {},
        closeEffect: function(instance) {}
    };


    // Collection method.
    $.fn.tooltip = function(options) {




        return this.each(function(i) {

            if (!$.data(this, Tooltip)) {
                $.data(this, Tooltip, new Tooltip( this, options ));
            }
        });
    };

    // Custom selector.
    $.expr[':'].tooltip = function(elem) {
        // Is this element tooltip?
        return $(elem).text().indexOf('awesome') !== -1;
    };

    // hide tooltips on orientation change
    if (is_touch_device()) {
        window.addEventListener("orientationchange", function() {
            if ($('.tooltipster-base').length > 0) {
                $('.tooltipster-base').each(function() {
                    var origin = $(this).data('origin');
                    origin.data('plugin_tooltipster').hideTooltip();
                });
            }
        }, false);
    }

    // on window resize, reposition and open tooltips
    $(window).on('resize.tooltipster', function() {
        var origin = $('.tooltipster-base').data('origin');
                
        if ((origin !== null) && (origin !== undefined)) {
            origin.tooltipster('reposition');
        }
    });

}(jQuery));