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

    function computePlacementCoords(element, placement, popWidth, popHeight) {
        // grab measurements
        var objectOffset = element.offset(),
            objectWidth = element.outerWidth(),
            objectHeight = element.outerHeight(),
            x = 0,
            y = 0;

        // calculate the appropriate x and y position in the document
        switch (placement) {
        case 'n':
            x = (objectOffset.left + (objectWidth / 2)) - (popWidth / 2);
            y = objectOffset.top - popHeight - options.offset;
            break;
        case 'e':
            x = objectOffset.left + objectWidth + options.offset;
            y = (objectOffset.top + (objectHeight / 2)) - (popHeight / 2);
            break;
        case 's':
            x = (objectOffset.left + (objectWidth / 2)) - (popWidth / 2);
            y = objectOffset.top + objectHeight + options.offset;
            break;
        case 'w':
            x = objectOffset.left - popWidth - options.offset;
            y = (objectOffset.top + (objectHeight / 2)) - (popHeight / 2);
            break;
        case 'nw':
            x = (objectOffset.left - popWidth) + 20;
            y = objectOffset.top - popHeight - options.offset;
            break;
        case 'ne':
            x = (objectOffset.left + objectWidth) - 20;
            y = objectOffset.top - popHeight - options.offset;
            break;
        case 'sw':
            x = (objectOffset.left - popWidth) + 20;
            y = objectOffset.top + objectHeight + options.offset;
            break;
        case 'se':
            x = (objectOffset.left + objectWidth) - 20;
            y = objectOffset.top + objectHeight + options.offset;
            break;
        }

        return {
            x: Math.round(x),
            y: Math.round(y)
        };
    }

    function getViewportCollisions(coords, elementWidth, elementHeight) {
        var scrollLeft = $window.scrollLeft(),
            scrollTop = $window.scrollTop(),
            windowWidth = $window.width(),
            windowHeight = $window.height(),
            collisions = [];

        if (coords.y < scrollTop) {
            collisions.push('top');
        }
        if (coords.y + elementHeight > scrollTop + windowHeight) {
            collisions.push('bottom');
        }
        if (coords.x < scrollLeft) {
            collisions.push('left');
        }
        if (coords.x + elementWidth > scrollLeft + windowWidth) {
            collisions.push('right');
        }

        return collisions;
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
        this.target = this.options.target || $elem;
        
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
            var this.$container = $(opts.tpl.container),
                this.$arrow = $(opts.tpl.arrow),
                this.$close = $(opts.tpl.close),
                this.$content = $(opts.tpl.content),
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

            this.$content.empty().append(this.content);
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

        positionOnElem: function() {
            if (this.autoPosition === true) {
                getViewportCollisions();
            }
        },
        positionOnMouse: function() {

        }

        
    }

    // Static method default options.
    Tooltip.default = {

        target: null, // mouse element
 
        trigger: 'hover', // hover click
        interactive: false,
        mouseTrace: false,
        closeBtn: false,
        position: 'nw',
        autoPosition: true,

        delay: 0,
        effect: 'fade', // fade none zoom
        duration: 200,

        inline: false,
        ajax: false,       


        onShow: null,
        onHide: null,
        onUpdate: null,

        tpl: {
            container: '',
            content: '',
            arrow: '',
            close: ''
        }
    };

    //open effect
    var transition = {};
    transition.fade = {
        openEffect: function(instance) {
            //if support css3 transtions use css transitions
            if (supportsTransitions()) {
                tooltipster.css({
                    'width': '',
                    '-webkit-transition': 'all ' + object.options.speed + 'ms, width 0ms, height 0ms, left 0ms, top 0ms',
                    '-moz-transition': 'all ' + object.options.speed + 'ms, width 0ms, height 0ms, left 0ms, top 0ms',
                    '-o-transition': 'all ' + object.options.speed + 'ms, width 0ms, height 0ms, left 0ms, top 0ms',
                    '-ms-transition': 'all ' + object.options.speed + 'ms, width 0ms, height 0ms, left 0ms, top 0ms',
                    'transition': 'all ' + object.options.speed + 'ms, width 0ms, height 0ms, left 0ms, top 0ms'
                }).addClass('tooltipster-content-changing');
                
                // reset the CSS transitions and finish the change animation
                setTimeout(function() {
                    tooltipster.removeClass('tooltipster-content-changing');
                    // after the changing animation has completed, reset the CSS transitions
                    setTimeout(function() {
                        tooltipster.css({
                            '-webkit-transition': object.options.speed + 'ms',
                            '-moz-transition': object.options.speed + 'ms',
                            '-o-transition': object.options.speed + 'ms',
                            '-ms-transition': object.options.speed + 'ms',
                            'transition': object.options.speed + 'ms'
                        });
                    }, object.options.speed);
                }, object.options.speed);
            }
            else {
                tooltipster.fadeTo(object.options.speed, 0.5, function() {
                    tooltipster.fadeTo(object.options.speed, 1);
                });
            }
        },
        closeEffect: function(instance) {}
    };
    transition.zoom = {
        openEffect: function(instance) {},
        closeEffect: function(instance) {}
    };


    // Collection method
    $.fn.tooltip = function(options) {



        return this.each(function(i) {

            if (!$.data(this, Tooltip)) {
                $.data(this, Tooltip, new Tooltip( this, options ));
            }
        });
    };

    // Custom selector
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