/*! jQuery tooltip - v0.1.0 - 2013-10-10
* https://github.com/amazingSurge/jquery-tooltip
* Copyright (c) 2013 amazingSurge; Licensed GPL */
(function($) {
    "use strict";

    var v,$win = $(window);

    var active = false;
    var dataPool = [];
    var posList = {
        n: ['s'],
        s: ['n'],
        w: ['e'],
        e: ['w'],
        nw: ['sw', 'ne'],
        ne: ['se', 'nw'],
        sw: ['se', 'nw'],
        se: ['ne', 'sw']
    };

    // we'll use this to detect for mobile devices
    function is_touch_device() {
        return !!('ontouchstart' in window);
    }

    // this is the core function to compute the position to show depended on the given placement argument 

    function computePlacementCoords(element, placement, popWidth, popHeight, popSpace, onCursor) {
        // grab measurements
        var objectOffset, objectWidth, objectHeight,
        x = 0,
            y = 0;

        if (onCursor) {
            objectOffset = element;
            objectWidth = 0;
            objectHeight = 0;
        } else {
            objectOffset = element.offset();
            objectWidth = element.outerWidth();
            objectHeight = element.outerHeight();

        }


        // calculate the appropriate x and y position in the document
        switch (placement) {
            case 'n':
                x = (objectOffset.left + (objectWidth / 2)) - (popWidth / 2);
                y = objectOffset.top - popHeight - popSpace;
                break;
            case 'e':
                x = objectOffset.left + objectWidth + popSpace;
                y = (objectOffset.top + (objectHeight / 2)) - (popHeight / 2);
                break;
            case 's':
                x = (objectOffset.left + (objectWidth / 2)) - (popWidth / 2);
                y = objectOffset.top + objectHeight + popSpace;
                break;
            case 'w':
                x = objectOffset.left - popWidth - popSpace;
                y = (objectOffset.top + (objectHeight / 2)) - (popHeight / 2);
                break;
            case 'nw':
                x = (objectOffset.left - popWidth) + 20;
                y = objectOffset.top - popHeight - popSpace;
                break;
            case 'ne':
                x = (objectOffset.left + objectWidth) - 20;
                y = objectOffset.top - popHeight - popSpace;
                break;
            case 'sw':
                x = (objectOffset.left - popWidth) + 20;
                y = objectOffset.top + objectHeight + popSpace;
                break;
            case 'se':
                x = (objectOffset.left + objectWidth) - 20;
                y = objectOffset.top + objectHeight + popSpace;
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
            popWidth, popHeight;

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
        if (typeof s[p] === 'string') {
            return true;
        }

        v = ['Moz', 'Webkit', 'Khtml', 'O', 'ms'],
        p = p.charAt(0).toUpperCase() + p.substr(1);
        for (var i = 0; i < v.length; i++) {
            if (typeof s[v[i] + p] === 'string') {
                return true;
            }
        }
        return false;
    }

    var transitionSupport = true;
    if (!supportsTransitions()) {
        transitionSupport = false;
    }

    // Static method.
    var Tooltip = $.tooltip = function(elem, options) {
        var metas = {};

        this.$elem = $(elem);

        $.each(this.$elem.data(), function(k, v) {
            if (/^tooltip/i.test(k)) {
                metas[k.toLowerCase().replace(/^tooltip/i, '')] = v;
            }
        });

        //options is a static properity
        this.options = $.extend({}, Tooltip.defaults, options, metas);
        this.namespace = this.options.namespace;

        if (this.$elem.attr('title')) {
            this.options.title = this.$elem.attr('title');
            this.$elem.removeAttr('title');
        }

        this.content = null;
        this.target = this.options.target || this.$elem;

        this.isOpen = null;
        this.enabled = true;
        this.tolerance = null;

        this.onlyOne = this.options.onlyOne || false;

        this.init();
    };

    Tooltip.prototype = {
        constructor: Tooltip,
        init: function() {
            var opts = this.options,
                self = this;

            // add namespace
            opts.tpl = this.parseTpl(opts.tpl);

            this.$container = $(opts.tpl.container);
            this.$loading = $(opts.tpl.loading);
            this.$arrow = $(opts.tpl.arrow);
            this.$close = $(opts.tpl.close);
            this.$content = $(opts.tpl.content);

            if (opts.trigger === 'hover') {
                this.target.on('mouseenter.tooltip', function() {
                    if (self.isOpen === true) {
                        clearTimeout(this.tolerance);
                        return;
                    } else {
                        $.proxy(self.show, self)();
                    }
                });

                if (opts.interactive === true) {
                    this.target.on('mouseleave.tooltip', function() {
                        var keepShow = false;

                        self.$container.on('mouseenter', function() {
                            keepShow = true;
                        });
                        self.$container.on('mouseleave', function() {
                            keepShow = false;
                        });

                        clearTimeout(this.tolerance);

                        this.tolerance = setTimeout(function() {
                            if (keepShow === true) {
                                self.$container.on('mouseleave.tooltip', $.proxy(self.hide, self));
                            } else {
                                $.proxy(self.hide, self)();
                            }
                        }, self.options.interactiveDelay);
                    });

                } else {
                    this.target.on('mouseleave.tooltip', $.proxy(self.hide, self));
                }

                if (this.options.mouseTrace === true) {
                    this.target.on('mousemove.tooltip', function(event) {
                        var pos, cursor = {},
                        x = event.pageX,
                            y = event.pageY;

                        cursor = {
                            top: y,
                            left: x
                        };

                        pos = computePlacementCoords(cursor, self.options.position, self.width, self.height, self.options.popSpace, true);

                        self.$container.css({
                            display: 'block',
                            top: pos.top,
                            left: pos.left
                        });
                    });
                }
            }
            if (opts.trigger === 'click') {
                this.target.on('click.tooltip', function() {
                    if (self.isOpen === true) {
                        $.proxy(self.hide, self)();
                    } else {
                        $.proxy(self.show, self)();
                    }
                });
            }

            //store all instance in dataPool
            dataPool.push(this);
        },
        load: function() {
            var self = this,
                opts = this.options;

            // when ajax content add to container , recompulate the position again
            if (opts.ajax === true) {
                $.ajax($.extend({}, opts.ajaxSettings, {
                    url: opts.title,
                    error: function() {
                        throw new Error('ajax error');
                    },
                    success: function(data, status) {
                        if (status === 'success') {

                            self.content = data;

                            self.$container.css({
                                display: 'none'
                            });
                            self.$content.empty().append(self.content);

                            var pos = computePlacementCoords(self.target, opts.position, self.$container.outerWidth(), self.$container.outerHeight(), opts.popSpace);

                            self.$container.css({
                                display: 'block',
                                top: pos.top,
                                left: pos.left
                            });

                        }
                    }
                }));
            } else if (opts.inline === true) {
                if (opts.title.indexOf('+') !== -1) {
                    this.content = this.$elem.next().css({display:'block'});
                } else {
                    this.content = $(opts.title).css({display:'block'});
                }
                
            } else {
                this.content = opts.title;
            }

            // if (this.content === null) {
            //     throw new Error('no content');
            // }
        },
        parseTpl: function(obj) {
            var tpl = {},
                self = this;
            $.each(obj, function(key,value) {
                tpl[key] = value.replace('{{namespace}}', self.namespace);
            });

            return tpl;
        },
        showLoading: function() {
            this.$content.empty();
            this.$loading.css({
                display: 'block'
            });
        },
        hideLoading: function() {
            this.$loading.css({
                display: 'none'
            });
        },

        /*
            Public Method
         */
        
        show: function() {
            var opts = this.options,
                pos,
                posCss = this.namespace + '-' + opts.position,
                self = this;

            if (this.enabled === false) {
                return;
            }
            if (this.onlyOne === true) {
                $.each(dataPool, function(i, v) {
                    if (v === self) {
                        return;
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

            this.$elem.addClass(this.namespace + '_active');

            // here judge the position first and then insert into body
            // if content has loaded , never load again
            this.content === null && this.load();

            if (this.content === null) {
                this.$content.append(this.$loading);
            } else {
                this.$content.empty().append(this.content);
            }

            if (opts.skin !== null) {
                this.$container.addClass(this.namespace + '_' + opts.skin);
            }

            this.$container.css({
                display: 'none',
                top: 0,
                left: 0,
                position: 'absolute',
                zIndex: 99990
            }).appendTo($('body'));

            this.width = this.$container.outerWidth();
            this.height = this.$container.outerHeight();

            if (opts.mouseTrace === false) {
                //compute position
                if (opts.autoPosition === true) {
                    var calPos = [],
                        newPos,
                        collisions = [];

                    if (opts.ajax === true) {
                        // use default value to judge collisions
                        collisions = getViewportCollisions($(this.target));
                    } else {
                        // change opts.postion
                        collisions = getViewportCollisions($(this.target), this.$container);
                    }

                    if (collisions.length > 0) {
                        $.each(opts.position.split(''), function(i, v) {

                            if ($.inArray(v, collisions) !== -1) {
                                calPos.push(posList[v]);
                            } else {
                                calPos.push(v);
                            }
                        });
                        newPos = calPos.join('');
                    } else {
                        newPos = opts.position;
                    }
                    posCss = this.namespace + '-' + newPos;
                    pos = computePlacementCoords(this.target, newPos, this.width, this.height, this.options.popSpace);
                } else {
                    pos = computePlacementCoords(this.target, opts.position, this.width, this.height, this.options.popSpace);
                }

                //show container
                this.$container.css({
                    display: 'block',
                    top: pos.top,
                    left: pos.left
                });
            } else {
                this.$container.addClass('pointer-events-none');
            }

            this.$container.addClass(posCss);

            //callback
            if (opts.onShow === 'function') {
                opts.onShow(this.$elem);
            }

            //support event
            this.$container.trigger('show');
            this.isOpen = true;

            return this;
        },
        hide: function() {

            //unbinded all custom event
            this.$container.off('.tooltip');
            //support event
            this.$container.trigger('hide');

            this.$elem.removeClass(this.namespace + '_active');

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
        enable: function() {
            this.enabled = true;
            this.container.addClass(this.namespace + '-enabled');
            return this;
        },
        disable: function() {
            this.enabled = false;
            this.container.removeClass(this.namespace + '-enabled');
            return this;
        },
        destroy: function() {
            this.target.off('.tooltip');
        }
    };

    // Static method default options.
    Tooltip.defaults = {
        namespace: 'tooltip',
        skin: null,

        target: null, // mouse element

        trigger: 'hover', // hover click
        interactive: false,
        interactiveDelay: 500,
        mouseTrace: false,
        closeBtn: false,

        popSpace: 10, //set the distance between tooltip and element

        position: 'n',
        autoPosition: true,

        delay: 0,
        effect: 'fade', // fade none zoom
        duration: 200,

        inline: false,
        content: null,

        ajax: false,
        ajaxSettings: {
            dataType: 'html',
            headers: {
                'tooltip': true
            }
        },

        onShow: null,
        onHide: null,
        onUpdate: null,

        tpl: {
            container: '<div class="{{namespace}}-container"></div>',
            loading: '<span class="{{namespace}}-loading"></span>',
            content: '<div class="{{namespace}}-content"></div>',
            arrow: '<span class="{{namespace}}-arrow"></span>',
            close: '<a class="{{namespace}}-close"></a>'
        }
    };


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

}(jQuery));