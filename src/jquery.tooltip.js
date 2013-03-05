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
        timer = null,
        $doc = $(document),
        $win = $(window);

    var active = false; 
    var dataPool = []; 
    var posList = {
        n:  ['s'],
        s:  ['n'],
        w:  ['e'],
        e:  ['w'],
        nw: ['sw','ne'],
        ne: ['se','nw'],
        sw: ['se','nw'],
        se: ['ne','sw']
    }; 

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
        var metas = {};

        this.$elem = $elem;
        this._name = 'Tooltip';
        

        $.each($elem.data(), function(k, v) {
            if (/^tooltip/i.test(k)) {
                metas[k.toLowerCase().replace(/^tooltip/i, '')] = v;
            }
        }); 

        //options is a static properity
        this.options = $.extend( {}, Tooltip.defaults, options, metas );   

        this.content = this.options.content;   
        
        this.isOpen = null;
        this.enabled = true;
        
        this.init();

    };

    Tooltip.prototype = {
        constructor: Tooltip, 
        init: function() {
            var opts = this.options;
            
            if (opts.trigger === 'hover') {
                this.$elem.on('mouseenter.tooltip',$.proxy(this.show,this));
                if (opts.interactive === true) {
                    
                } else {
                    this.$elem.on('mouseleave',$.proxy(this.hide,this));
                }

                if (this.options.mouseTrace === true) {
                    this.$elem.on('mousemove.tooltip',function(event) {
                        var x = event.top,
                            y = event.left;

                        self.$container.css({
                            top: 
                        })
                    })
                }

            }
            if (opts.trigger === 'click') {
                this.$elem.on('click.tooltip',function() {

                });
            }

            //store all instance in dataPool
            dataPool.push(this);
        },
        show: function() {
            var this.$container = $(opts.container),
                this.$arrow = $(opts.arrow),
                this.$close = $(opts.close),
                self = this;

            if (this.enabled !== true) { 
                return ;
            }

            //close other tooltip before open a new one
            if (active === true) {
                $.each(dataPool,function(i,v) {
                    if (v.isOpen === true) {
                        v.hide();
                    }
                });
            }


            if (opts.closeBtn === true) {
                this.$container.append(this.$close);
            }

            this.$container.append(this.$arrow);
           
            if (opts.autoPosition === true) {
                var rez;
                rez = this._position();
                this.$container.css( rez );
            } else {

            }
            
                       
            //callback
            this.options.onShow(elem);

            //support event
            this.$container.trigger('show');

            active = true;

            this.isOpen = true;

            //open effect
            transitions[opts.effect]['openEffect'](this);

            this._load();
        },

        _load: function() {
            var self = this;
                opts = this.options;
            if (opts.title) {
                this.content = opts.title;
                this.afterLoad();
            } else if (opts.inline === true) {
                this.content = $(opts.content).html();
                this.afterLoad();
            } else if (opts.ajax === true) {
                $.ajax($.extend({},opts.ajaxSettings,{
                    url: opts.content,
                    error: function() {},
                    succes: function(data,status) {
                        if (status === 'success') {
                            self.content = data;
                            self.afterLoad();
                        }
                    }
                }));
            } 
        },

        afterLoad: function() {
            this.$container.append(this.content);
        }

        hide: function() {

            //unbinded all custom event
            this.$container.off('.tooltip');

            //open effect
            transitions[opts.effect]['closeEffect'](this);

            //callback
            this.options.onHide(elem);

            //support event
            this.$container.trigger('hide');

            this.isOpen = false;
            active = false;
        },
        setContent: function(content) {
            this.content = content;
        },
        update: function() {
            this.options.onUpdate(elem);

            //some change here

            this.show();
        },
        enable: function() {
            this.enabled = true;
        },
        disable: function() {
            this.enabled = false;
        },
        _showLoading: function() {},
        _hideLoading: function() {},
        _compute: function() {
            var winWidth = $win.width(),
                winHeight = $win.height(),
                containerWidth = this.$container.outerWidth(),
                containerHeight = this.$container.outerHeight();

            var list = posList[this.optins.position];
            if (this.options.autoPosition === true) {
                $.each(list,function(i,v) {

                }) ;
            }   
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

        inline: false,
        ajax: false,

        position: 'nw',
        autoPosition: true,


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