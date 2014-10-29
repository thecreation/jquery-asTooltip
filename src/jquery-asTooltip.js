/*
 * asTooltip
 * https://github.com/amazingSurge/jquery-asTooltip
 *
 * Copyright (c) 2014 amazingSurge
 * Licensed under the MIT license.
 */
(function($, document, window, undefined) {
    "use strict";

    var pluginName = 'asTooltip';

    var $win = $(window);
    var instances = [];

    var POSITION = 'nswe';
    var resovolution = {
        n: {
            n: 's',
            w: 'ne',
            e: 'nw'
        },
        s: {
            s: 'n',
            w: 'se',
            e: 'sw'
        },
        w: {
            w: 'e',
            n: 'sw',
            s: 'nw'
        },
        e: {
            e: 'w',
            n: 'se',
            s: 'ne'
        },
        nw: {
            n: 'sw',
            w: 'ne'
        },
        ne: {
            n: 'se',
            e: 'nw'
        },
        sw: {
            s: 'nw',
            w: 'se'
        },
        se: {
            s: 'ne',
            e: 'sw'
        }
    };

    // this is the core function to compute the position to show depended on the given placement argument 
    function computePlacementOffset(element, placement, tipWidth, tipHeight, distance, withCursor) {
        // grab measurements
        var objectOffset, objectWidth, objectHeight,
            x = 0,
            y = 0;

        if (withCursor) {
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
                x = (objectOffset.left + (objectWidth / 2)) - (tipWidth / 2);
                y = objectOffset.top - tipHeight - distance;
                break;
            case 'e':
                x = objectOffset.left + objectWidth + distance;
                y = (objectOffset.top + (objectHeight / 2)) - (tipHeight / 2);
                break;
            case 's':
                x = (objectOffset.left + (objectWidth / 2)) - (tipWidth / 2);
                y = objectOffset.top + objectHeight + distance;
                break;
            case 'w':
                x = objectOffset.left - tipWidth - distance;
                y = (objectOffset.top + (objectHeight / 2)) - (tipHeight / 2);
                break;
            case 'nw':
            case 'wn':
                x = (objectOffset.left - tipWidth) + 20;
                y = objectOffset.top - tipHeight - distance;
                break;
            case 'ne':
            case 'en':
                x = (objectOffset.left + objectWidth) - 20;
                y = objectOffset.top - tipHeight - distance;
                break;
            case 'sw':
            case 'ws':
                x = (objectOffset.left - tipWidth) + 20;
                y = objectOffset.top + objectHeight + distance;
                break;
            case 'se':
            case 'es':
                x = (objectOffset.left + objectWidth) - 20;
                y = objectOffset.top + objectHeight + distance;
                break;
        }

        return {
            left: Math.round(x),
            top: Math.round(y)
        };
    }

    function getViewportCollisions($target, $tip) {
        var scrollLeft = $win.scrollLeft(),
            scrollTop = $win.scrollTop(),
            offset = $target.offset(),
            elementWidth = $target.outerWidth(),
            elementHeight = $target.outerHeight(),
            windowWidth = $win.width(),
            windowHeight = $win.height(),
            collisions = [],
            tipWidth, tipHeight;

        if ($tip) {
            tipWidth = $tip.outerWidth(true);
            tipHeight = $tip.outerHeight(true);
        } else {
            // for loading animation icon placeholder
            tipWidth = 100;
            tipHeight = 50;
        }

        if (offset.top < scrollTop + tipHeight) {
            collisions.push('n');
        }
        if (offset.top + elementHeight + tipHeight > scrollTop + windowHeight) {
            collisions.push('s');
        }
        if (offset.left < scrollLeft + tipWidth) {
            collisions.push('w');
        }
        if (offset.left + elementWidth + tipWidth > scrollLeft + windowWidth) {
            collisions.push('e');
        }

        return collisions;
    }

    // Static method.
    var Plugin = $[pluginName] = function(element, options) {
        this.$element = $(element);

        this.options = $.extend({}, Plugin.defaults, options, this.$element.data());
        this.namespace = this.options.namespace;

        this.content = null;
        this.$target = this.$element;

        this.isOpen = false;
        this.enabled = true;
        this.tolerance = null;

        this.classes = {
            active: this.namespace + '-active',
            enabled: this.namespace + '-enabled',
        }

        this.onlyOne = this.options.onlyOne;
        this._trigger('init');
        this.init();
    };

    Plugin.prototype = {
        constructor: Plugin,
        init: function() {
            // add namespace
            var tpl = this.parseTpl(this.options.tpl);

            this.$tip = $(tpl.tip);
            this.$loading = $(tpl.loading);
            this.$arrow = $(tpl.arrow);
            this.$close = $(tpl.close);
            this.$content = $(tpl.content);

            if (this.options.trigger === 'hover') {
                this.$target.on('mouseenter.' + pluginName, this.options.selector, $.proxy(this.enter, this));
                this.$target.on('mouseleave.' + pluginName, this.options.selector, $.proxy(this.leave, this));

                if (this.options.mouseTrace === true) {
                    this.$target.on('mousemove.' + pluginName, this.options.selector, $.proxy(this.move, this));
                }
            }
            if (this.options.trigger === 'click') {
                this.$target.on('click.' + pluginName, this.options.selector, $.proxy(this.toggle, this));
            }

            if (this.options.selector) {
                this._options = $.extend({}, this.options, {
                    trigger: 'manual',
                    selector: ''
                });
            } else {
                this.fixContent();
            }

            //store all instance in instances
            instances.push(this);
            this._trigger('ready');
        },
        getDelegateOptions: function() {
            var options = {}

            this._options && $.each(this._options, function(key, value) {
                if (Plugin.defaults[key] !== value) {
                    options[key] = value;
                }
            });

            return options;
        },
        fixContent: function() {
            var $e = this.$element;
            var attr = this.options.contentAttr;
            if ($e.attr(attr) || typeof($e.attr('data-original-content')) != 'string') {
                $e.attr('data-original-content', $e.attr(attr) || '').attr(attr, '')
            }
        },
        getContent: function() {
            var content = this.$element.attr('data-original-content') || (typeof this.options.content == 'function' ? this.options.content.call(this.$element[0]) : this.options.content)

            return content;
        },
        enter: function(obj) {
            var self = obj instanceof this.constructor ?
                obj : $(obj.currentTarget).data(pluginName);

            if (!self) {
                self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
                $(obj.currentTarget).data(pluginName, self);
            }

            if (self.isOpen === true) {
                clearTimeout(self.tolerance);
                return;
            } else {
                $.proxy(self.show, self)();
            }
        },
        leave: function(obj) {
            var self = obj instanceof this.constructor ?
                obj : $(obj.currentTarget).data(pluginName);

            if (!self) {
                self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
                $(obj.currentTarget).data(pluginName, self);
            }


            if (self.options.interactive === true) {
                var keepShow = false;

                self.$tip.on('mouseenter.' + pluginName, function() {
                    keepShow = true;
                });
                self.$tip.on('mouseleave.' + pluginName, function() {
                    keepShow = false;
                });

                clearTimeout(self.tolerance);

                self.tolerance = setTimeout(function() {
                    if (keepShow === true) {
                        self.$tip.on('mouseleave.' + pluginName, $.proxy(self.hide, self));
                    } else {
                        $.proxy(self.hide, self)();
                    }
                }, self.options.interactiveDelay);
            } else {
                $.proxy(self.hide, self)();
            }
        },
        toggle: function(obj) {
            var self = obj instanceof this.constructor ?
                obj : $(obj.currentTarget).data(pluginName);

            if (!self) {
                self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
                $(obj.currentTarget).data(pluginName, self);
            }

            if (self.isOpen === true) {
                $.proxy(self.hide, self)();
            } else {
                $.proxy(self.show, self)();
            }
        },
        move: function(obj) {
            var offset, cursor = {},
                x = obj.pageX,
                y = obj.pageY;

            var self = obj instanceof this.constructor ?
                obj : $(obj.currentTarget).data(pluginName);

            if (!self) {
                self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
                $(obj.currentTarget).data(pluginName, self);
            }

            cursor = {
                top: y,
                left: x
            };

            offset = computePlacementOffset(cursor, self.options.position, self.width, self.height, self.options.distance, true);

            self.$tip.css({
                display: 'block',
                top: offset.top,
                left: offset.left
            });
        },
        load: function() {
            var self = this,
                opts = this.options,
                content = this.getContent();


            // when ajax content add to container , recompulate the position again
            if (opts.ajax === true) {
                $.ajax($.extend({}, opts.ajaxSettings, {
                    url: content,
                    error: function() {
                        throw new Error('ajax error');
                    },
                    success: function(data, status) {
                        if (status === 'success') {
                            self.content = data;
                            self.$tip.css({
                                display: 'none'
                            });
                            self.$content.empty().append(self.content);
                            self.$tip.removeClass(self.positionClass);
                            self.setPosition();
                        }
                    }
                }));
            } else if (opts.inline === true) {
                if (content && content.indexOf('+') !== -1) {
                    this.content = this.$element.next().css({
                        display: 'block'
                    });
                } else {
                    this.content = $(content).css({
                        display: 'block'
                    });
                }
            } else {
                this.content = content;
            }
        },
        parseTpl: function(obj) {
            var tpl = {},
                self = this;
            $.each(obj, function(key, value) {
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
        setPosition: function() {
            var opts = this.options,
                Offset,
                positionClass = this.namespace + '-' + opts.position;

            this.width = this.$tip.outerWidth();
            this.height = this.$tip.outerHeight();

            if (opts.mouseTrace !== true) {
                //compute position
                if (opts.autoPosition === true) {
                    var position,
                        collisions = [];

                    if (opts.ajax === true && this.content === null) {
                        // use default value to judge collisions
                        collisions = getViewportCollisions(this.$target);
                    } else {
                        // change opts.postion
                        collisions = getViewportCollisions(this.$target, this.$tip);
                    }

                    if (collisions.length === 0) {
                        position = opts.position;
                    } else if (collisions.length === 1) {
                        var res = resovolution[opts.position][collisions[0]];
                        if (res === undefined) {
                            position = opts.position;
                        } else {
                            position = res;
                        }
                    } else {
                        var cachString = POSITION;
                        $.each(collisions, function(i, v) {
                            cachString.replace(v, '');
                        });
                        position = cachString;
                    }

                    positionClass = this.namespace + '-' + position;
                    Offset = computePlacementOffset(this.$target, position, this.width, this.height, this.options.distance);
                } else {
                    Offset = computePlacementOffset(this.$target, opts.position, this.width, this.height, this.options.distance);
                }

                //show tip
                this.$tip.css({
                    display: 'block',
                    top: Offset.top,
                    left: Offset.left
                });
            }

            this.positionClass = positionClass;
            this.$tip.addClass(positionClass);
        },
        _trigger: function(eventType) {
            var method_arguments = Array.prototype.slice.call(arguments, 1),
                data = [this].concat(method_arguments);

            // event
            this.$element.trigger(pluginName + '::' + eventType, data);

            // callback
            eventType = eventType.replace(/\b\w+\b/g, function(word) {
                return word.substring(0, 1).toUpperCase() + word.substring(1);
            });
            var onFunction = 'on' + eventType;
            if (typeof this.options[onFunction] === 'function') {
                this.options[onFunction].apply(this, method_arguments);
            }
        },

        /*
         *  Public Method
         */
        show: function() {
            var opts = this.options,
                self = this;

            if (!this.enabled) {
                return;
            }
            if (this.onlyOne) {
                $.each(instances, function(i, v) {
                    if (v === self) {
                        return;
                    } else {
                        if (v.isOpen) {
                            v.hide();
                        }
                    }
                });
            }
            this.$tip = $(this.options.tpl.tip.replace('{{namespace}}', this.namespace));

            if (opts.closeBtn) {
                this.$tip.append(this.$close);
            }
            this.$tip.append(this.$arrow).append(this.$content);

            this.$element.addClass(this.classes.active);

            // here judge the position first and then insert into body
            // if content has loaded , never load again
            this.content === null && this.load();

            if (this.content === null) {
                this.$content.append(this.$loading);
            } else {
                this.$content.empty().append(this.content);
            }

            if (opts.skin) {
                this.$tip.addClass(opts.skin);
            }


            this.$tip.css({
                display: 'none'
            });

            this.options.container ? this.$tip.appendTo(this.options.container) : this.$tip.insertAfter(this.$element);

            this.setPosition();

            this._trigger('show');
            this.isOpen = true;

            return this;
        },
        hide: function() {
            this.$tip.off('.' + pluginName);
            this._trigger('hide');

            this.$element.removeClass(this.classes.active);

            this.$tip.remove();
            this.isOpen = false;
        },
        setContent: function(content) {
            this.content = content;
        },
        enable: function() {
            this.enabled = true;
            this.$element.addClass(this.classes.enabled);
            return this;
        },
        disable: function() {
            this.enabled = false;
            this.$element.removeClass(this.classes.enabled);
            return this;
        },
        destroy: function() {
            this.$target.off('.' + pluginName);
        }
    };

    Plugin.closeAll = function() {
        instances.map(function(instance) {
            if (instance.isOpen) {
                instance.hide();
            }
        });
    };

    // Static method default options.
    Plugin.defaults = {
        namespace: pluginName,
        skin: null,

        onlyOne: false,
        trigger: 'hover', // hover click
        interactive: false,
        interactiveDelay: 500,
        mouseTrace: false,
        closeBtn: false,

        selector: false,
        container: 'body',

        distance: 10, //set the distance between tooltip and element

        position: 'n',
        autoPosition: true,

        delay: 0,
        effect: 'fade', // fade none zoom
        duration: 200,

        inline: false,
        content: null,
        contentAttr: 'title',

        ajax: false,
        ajaxSettings: {
            dataType: 'html',
            headers: {
                'tooltip': true
            }
        },

        tpl: {
            tip: '<div class="{{namespace}}"></div>',
            loading: '<span class="{{namespace}}-loading"></span>',
            content: '<div class="{{namespace}}-content"></div>',
            arrow: '<span class="{{namespace}}-arrow"></span>',
            close: '<a class="{{namespace}}-close"></a>'
        }
    };

    $.fn[pluginName] = function(options) {
        if (typeof options === 'string') {
            var method = options;
            var method_arguments = Array.prototype.slice.call(arguments, 1);

            if (/^\_/.test(method)) {
                return false;
            } else if ((/^(get)/.test(method))) {
                var api = this.first().data(pluginName);
                if (api && typeof api[method] === 'function') {
                    return api[method].apply(api, method_arguments);
                }
            } else {
                return this.each(function() {
                    var api = $.data(this, pluginName);
                    if (api && typeof api[method] === 'function') {
                        api[method].apply(api, method_arguments);
                    }
                });
            }
        } else {
            return this.each(function() {
                if (!$.data(this, pluginName)) {
                    $.data(this, pluginName, new Plugin(this, options));
                }
            });
        }
    };
}(jQuery, document, window));
