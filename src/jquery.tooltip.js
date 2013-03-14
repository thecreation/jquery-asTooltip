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
            y = objectOffset.top - popHeight;
            break;
        case 'e':
            x = objectOffset.left + objectWidth;
            y = (objectOffset.top + (objectHeight / 2)) - (popHeight / 2);
            break;
        case 's':
            x = (objectOffset.left + (objectWidth / 2)) - (popWidth / 2);
            y = objectOffset.top + objectHeight;
            break;
        case 'w':
            x = objectOffset.left - popWidth;
            y = (objectOffset.top + (objectHeight / 2)) - (popHeight / 2);
            break;
        case 'nw':
            x = (objectOffset.left - popWidth) + 20;
            y = objectOffset.top - popHeight;
            break;
        case 'ne':
            x = (objectOffset.left + objectWidth) - 20;
            y = objectOffset.top - popHeight;
            break;
        case 'sw':
            x = (objectOffset.left - popWidth) + 20;
            y = objectOffset.top + objectHeight;
            break;
        case 'se':
            x = (objectOffset.left + objectWidth) - 20;
            y = objectOffset.top + objectHeight;
            break;
        }

        return {
            left: Math.round(x),
            top: Math.round(y)
        };
    }

    function getViewportCollisions(target, popElem) {
        var scrollLeft = $win.scrollLeft(),
            scrollTop = $win.scrollTop(),
            offset = target.offset(),
            elementWidth = target.outerWidth(),
            elementHeight = target.outerHeight(),
            windowWidth = $win.width(),
            windowHeight = $win.height(),
            collisions = [],
            popWidth,popHeight;

        if (popElem) {
            popWidth = popElem.outerWidth();
            popHeight = popElem.outerHeight();
        } else {
            popWidth = 100;
            popHeight = 50;
        }

        if (offset.top < scrollTop + popHeight) {
            collisions.push('n');
        }
        if (offset.top + elementHeight + popHeight > scrollTop + windowHeight) {
            collisions.push('s');
        }
        if (offset.left < scrollLeft + popWidth) {
            collisions.push('w');
        }
        if (offset.left + elementWidth + popWidth > scrollLeft + windowWidth) {
            collisions.push('e');
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
    var Tooltip = $.tooltip = function(elem,options) {
        var metas = {};

        this.$elem = $(elem);
        this._name = 'Tooltip';       

        $.each(this.$elem.data(), function(k, v) {
            if (/^tooltip/i.test(k)) {
                metas[k.toLowerCase().replace(/^tooltip/i, '')] = v;
            }
        }); 



        //options is a static properity
        this.options = $.extend( {}, Tooltip.defaults, options, metas );   

        if (this.$elem.attr('title')) {
            this.options.title = this.$elem.attr('title');
            this.$elem.removeAttr('title');
        }

        this.content = this.options.content;   
        this.target = this.options.target || this.$elem;
        
        this.isOpen = null;
        this.enabled = true;

        this.onlyOne = this.options.onlyOne || false;

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
                             
                        });
                    });
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
            var opts = this.options,
                pos,               
                self = this;

            this.$container = $(opts.tpl.container);
            this.$arrow = $(opts.tpl.arrow);
            this.$close = $(opts.tpl.close);
            this.$content = $(opts.tpl.content);

            if (this.enabled !== true) { 
                return ;
            }

            if (this.onlyOne === true) {
                $.each(dataPool,function(i,v) {
                    if (v === self) {
                        return ;
                    } else {
                        if (v.isOpen === true) {
                            v.hide();
                        }
                    }
                });
            }


            if (opts.closeBtn === true) {
                this.$container.append(this.$close);
            }

            this.$container.append(this.$arrow).append(this.$content);
           
            if (opts.ajax === true) {
                
                this._load();
                this._showLoading();
                this.ajax();

                



            } else {
                this._load();

                this.$content.empty().append(this.content);
                this.$container.appendTo($('body')).css({display:'none'});

                if ( opts.autoPosition === true ) {
                    var calPos = [],
                        newPos,
                        collisions = [];    

                    // change opts.postion
                    collisions = getViewportCollisions($(this.target), this.$container);

                    if ( collisions.length > 0 ) {
                        
                        $.each(opts.position.split(''),function(i,v) {
                            
                            if ($.inArray(v,collisions) !== -1) {
                                calPos.push(posList[v]);
                            } else {
                                calPos.push(v);
                                
                            }
                        });

                        newPos = calPos.join('');

                    } else {
                        newPos = opts.position;
                    }

                    pos = computePlacementCoords(this.target,newPos,this.$container.outerWidth(),this.$container.outerHeight());

                } else {

                    pos = computePlacementCoords(this.target,opts.position,this.$container.outerWidth(),this.$container.outerHeight());
                   
                }
                
                this.$container.addClass(opts.skin).css({
                    display: 'block',
                    position: 'absolute',
                    zIndex: 99990,
                    top: pos.top,
                    left: pos.left 
                });
            }
            
                       
            //callback
            if (opts.onShow === 'function') {
                opts.onShow(this.$elem);
            }
            
            //support event
            this.$container.trigger('show');

            this.isOpen = true;

        },

        _load: function() {
            var self = this,
                opts = this.options;
            if (opts.title) {
                this.content = opts.title;
                
            } else if (opts.inline === true) {
                this.content = $(opts.content).html();
                
            } 
        },

        ajax: function() {
            if (opts.ajax === true) {
                $.ajax($.extend({},opts.ajaxSettings,{
                    url: opts.content,
                    error: function() {},
                    succes: function(data,status) {
                        if (status === 'success') {
                            self.content = data;
                            self.$content.empty().append(self.content);
                        }
                    }
                }));
            } 
        },

 
        hide: function() {

            //unbinded all custom event
            this.$container.off('.tooltip');
            //support event
            this.$container.trigger('hide');

            this.$container.remove();

            //callback
            if (this.options.onHide === 'function') {
               this.options.onHide(this.$elem); 
            }
            
            

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

        },
        _position: function() {
            var collisions = getViewportCollisions();


        }

    }

    // Static method default options.
    Tooltip.defaults = {

        target: null, // mouse element
 
        trigger: 'hover', // hover click
        interactive: false,
        mouseTrace: false,
        closeBtn: false,

        skin: 'simple',

        position: 'n',
        autoPosition: true,

        delay: 0,
        effect: 'fade', // fade none zoom
        duration: 200,

        inline: false,
        ajax: false,   
        ajaxSettings: {},    


        onShow: null,
        onHide: null,
        onUpdate: null,

        tpl: {
            container: '<div class="tooltip-container"></div>',
            content: '<div class="tooltip-content"></div>',
            arrow: '<span class="tooltip-arrow"></span>',
            close: '<a class="tooltip-close"></a>'
        }
    };



    //open effect
    var transition = {};
    transition.fade = {
        openEffect: function(instance) {
            //if support css3 transtions use css transitions
            if (transitionSupport === true) {
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

        if (typeof options === 'string') {
            var method = options;
            var method_arguments = arguments.length > 1 ? Array.prototype.slice.call(arguments, 1) : undefined;

            return this.each(function() {
                var api = $.data(this, 'tooltip');
                if (typeof api[method] === 'function') {
                    api[method].apply(api, method_arguments);
                }
            });
        } else {
            return this.each(function() {
                if (!$.data(this, 'tooltip')) {
                    $.data(this, 'tooltip', new Tooltip(this, options));
                }
            });
        }
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