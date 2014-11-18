/*! jQuery asTooltip - v0.3.0 - 2014-11-18
* https://github.com/amazingSurge/jquery-asTooltip
* Copyright (c) 2014 amazingSurge; Licensed GPL */
(function($, document, window, undefined) {
    "use strict";

    var pluginName = 'asTooltip';

    var $win = $(window);
    var instances = [];

    // this is the core function to compute the position to show depended on the given placement argument 
    var computePlacementOffset = function(element, $tip, position, isMove) {
        // grab measurements
        var elOffset, elWidth, elHeight, tipWidth, tipHeight,
            $el = $(element),
            x = 0,
            y = 0;

        elOffset = isMove ? element : $el.offset();
        elWidth = isMove ? 0 : $el.outerWidth();
        elHeight = isMove ? 0 : $el.outerHeight();

        tipWidth = $tip.outerWidth();
        tipHeight = $tip.outerHeight();

        for (var i = 0; i < position.length; i++) {
            switch (position[i]) {
                case 'left':
                    x = i === 0 ? elOffset.left - tipWidth : elOffset.left;
                    break;
                case 'middle':
                    switch (position[0]) {
                        case 'left':
                        case 'right':
                            y = elOffset.top + (elHeight - tipHeight) / 2;
                            break;
                        case 'top':
                        case 'bottom':
                            x = elOffset.left + (elWidth - tipWidth) / 2;
                            break;
                    }
                    break;
                case 'right':
                    x = i === 0 ? elOffset.left + elWidth : elOffset.left + elWidth - tipWidth;
                    break;
                case 'top':
                    y = i === 0 ? elOffset.top - tipHeight : elOffset.top;
                    break;
                case 'bottom':
                    y = i === 0 ? elOffset.top + elHeight : elOffset.top + elHeight - tipHeight;
                    break;
            }
        }

        return {
            left: Math.round(x),
            top: Math.round(y)
        };
    };

    var getViewportCollisions = function(el, $tip, $container) {
        var $el = $(el),
            eOffset = $el.offset(),
            cOffset = $container.offset(),
            scrollLeft = $container[0].tagName === 'BODY' ? $win.scrollLeft() : $container.scrollLeft(),
            scrollTop = $container[0].tagName === 'BODY' ? $win.scrollTop() : $container.scrollTop(),
            offset = $container[0].tagName === 'BODY' ? eOffset : {
                top: eOffset.top - cOffset.top,
                left: eOffset.left - cOffset.left
            },
            eWidth = $el.outerWidth(),
            eHeight = $el.outerHeight(),
            tWidth = $tip.outerWidth(),
            tHeight = $tip.outerHeight(),
            cWidth = $container[0].tagName === 'BODY' ? $win.innerWidth() : $container.outerWidth(),
            cHeight = $container[0].tagName === 'BODY' ? $win.innerHeight() : $container.outerHeight(),
            collisions = [];

        if (tHeight > offset.top - scrollTop) collisions.push('top');
        if (tHeight + eHeight + offset.top > scrollTop + cHeight) collisions.push('bottom');
        if (tWidth > offset.left - scrollLeft) collisions.push('left');
        if (tWidth + eWidth + offset.left > scrollLeft + cWidth) collisions.push('right');

        return collisions;
    };

    // Static method.
    var Plugin = $[pluginName] = function(element, options) {
        var body = $(document.body),
            newTarget = element[0] === document ? body : element,
            opts, targetData;
        targetData = this.parseTargetData($(newTarget).data());
        opts = this.options = $.extend(true, {}, Plugin.defaults, options, targetData);

        opts.position.container = !opts.position.container ? body : $(opts.position.container);
        if (!opts.position.target) {
            opts.position.target = newTarget;
        }
        if (!opts.show.target) {
            opts.show.target = newTarget;
        }
        if (!opts.hide.target) {
            opts.hide.target = newTarget;
        }

        this.$el = $(newTarget);

        this.namespace = this.options.namespace;
        opts.content = this.getContent();

        this.enabled = true;
        this.isOpen = false;
        this.loadFlag = false;
        this.moveFlag = false;
        this.showTimer = null;
        this.hideTimer = null;

        this.classes = {
            show: this.namespace + '_isShow',
            isLoading: this.namespace + '_isLoading',
            active: this.namespace + '_active',
            enabled: this.namespace + '_enabled',
        };

        this.trigger('init');
        this.init();
    };

    Plugin.prototype = {
        constructor: Plugin,
        init: function() {
            var self = this,
                opts = this.options,
                showTarget = opts.show.target,
                hideTarget = opts.hide.target,
                showEvent = opts.show.event,
                hideEvent = opts.hide.event;

            // add namepace    
            this.$tip = $(opts.tpl.replace(/{{namespace}}/g, this.namespace));

            this.$loading = $('.' + this.namespace + '-loading', this.$tip);
            this.$content = $('.' + this.namespace + '-content', this.$tip);

            if (showTarget === hideTarget && showEvent === hideEvent) {
                this._bind(showTarget, showEvent, function(e) {
                    (this.isOpen ? this.hideMethod : this.showMethod).call(this, e);
                });
            } else {
                this._bind(showTarget, showEvent, function(e) {
                    this.showMethod.call(this, e);
                });
                this._bind(hideTarget, hideEvent, function(e) {
                    this.hideMethod.call(this, e);
                });
            }
            if (opts.position.container[0].tagName === 'BODY') {
                if (opts.position.adjust.resize) {
                    this._bind($win, 'resize', function() {
                        if (self.isOpen) self.setPosition();
                    });
                }
                if (opts.position.adjust.scroll) {
                    this._bind($win, 'scroll', function() {
                        if (self.isOpen) self.setPosition();
                    });
                }
            }
        },
        _bind: function(targets, events, method, suffix) {
            if (!targets || !method || !events.length) return;
            var name = suffix ? events : events + '.' + suffix;
            $(targets).on(name, $.proxy(method, this));
            return this;
        },
        _unbind: function(targets, events, suffix) {
            targets && $(targets).unbind(suffix ? events : events + '.' + suffix);
            return this;
        },
        parseTargetData: function(data) {
            var targetData = {};
            $.each(data, function(n, v) {
                var names = n.split('_'),
                    len = names.length,
                    path = targetData;
                if (len === 1) {
                    targetData[names[0]] = v;
                } else {
                    for (var i = 0; i < len; i++) {
                        if (i === 0) {
                            if (targetData[names[i]] === undefined) targetData[names[i]] = {};
                        } else if (i === len - 1) {
                            path[names[i]] = v;
                        } else {
                            if (path[names[i]] === undefined) path[names[i]] = {};
                        }
                        path = targetData[names[i]];
                    }
                }
            });
            return targetData;
        },
        parseTpl: function(string) {
            return string.replace('{{namespace}}', self.namespace);
        },
        getDelegateOptions: function() {
            var options = {};

            this._options && $.each(this._options, function(key, value) {
                if (Plugin.defaults[key] !== value) {
                    options[key] = value;
                }
            });
            return options
        },
        showMethod: function(obj) {
            var self = obj instanceof this.constructor ? obj : $(obj.currentTarget).data(pluginName),
                opts = this.options;

            if (!self) {
                self = new this.constructor(obj.currentTarget, this.getDelegateOptions());
                $(obj.currentTarget).data(pluginName, self);
            }

            if (!opts.ajax && !self.options.content) return;

            if (self.isOpen) {
                clearTimeout(self.hideTimer);
            } else {
                clearTimeout(self.showTimer);
                self.showTimer = setTimeout(function() {
                    $.proxy(self.show, self)();
                }, opts.show.delay);
            }

            if (opts.position.target === 'mouse') {
                if (this.moveFlag) return;
                this.isFirst = true;
                $(document).on('mousemove.' + pluginName, $.proxy(this.move, self));
                this.moveFlag = true;
            }

            if (opts.hide.event === 'click') {
                if (opts.hide.container) {
                    this._bind(opts.hide.container, opts.hide.event, function(e) {
                        var $target = $(e.target);
                        if ($target.closest(self.$el).length === 0 && $target.closest(self.$tip).length === 0) {
                            if (self.isOpen) $.proxy(self.hide, self)();
                        }
                    });
                }
            }
        },
        hideMethod: function(obj) {
            var self = obj instanceof this.constructor ? obj : $(obj.currentTarget).data(pluginName),
                opts = this.options,
                show = false;

            if (!self) {
                self = new this.constructor(obj.currentTarget, this.getDelegateOptions());
                $(obj.currentTarget).data(pluginName, self);
            }

            if (!opts.ajax && !self.options.content) return;

            if (!self.isOpen) {
                clearTimeout(self.showTimer);
                return;
            }

            if (opts.position.target === 'mouse') {
                if (this.moveFlag) return;
            }

            if (opts.hide.event === 'click') {
                if (opts.hide.container) {
                    this._unbind(opts.hide.container, opts.hide.event);
                }
            }

            if (opts.hide.inactive) {
                this._bind(self.$tip, 'mouseenter.' + pluginName, function() {
                    show = true;
                });
                this._bind(self.$tip, 'mouseleave.' + pluginName, function() {
                    show = false;
                    clearTimeout(self.hideTimer);
                    self.hideTimer = setTimeout(function() {
                        $.proxy(self.hide, self)();
                    }, self.options.hide.delay);

                    self._unbind(self.$tip, 'mouseenter.' + pluginName + ' mouseleave.' + pluginName);
                });


            }
            clearTimeout(self.hideTimer);

            self.hideTimer = setTimeout(function() {
                if (!show) $.proxy(self.hide, self)();
            }, opts.hide.delay);
        },
        move: function(e) {
            var x = Math.round(e.pageX),
                y = Math.round(e.pageY),
                t = this.$el.offset().top,
                l = this.$el.offset().left,
                w = this.$el.outerWidth(),
                h = this.$el.outerHeight();

            if (x >= l && x <= l + w && y >= t && y <= t + h) {
                if (this.options.position.adjust.mouse) {
                    this.setPosition(e);
                } else if (this.isFirst) {
                    this.setPosition(e);
                    this.isFirst = false;
                }
            } else {
                $(document).off('mousemove.' + pluginName);
                this.moveFlag = false;
                this.hideMethod(this.$el.data(pluginName));
            }
        },
        trigger: function(eventType) {
            var method_arguments = Array.prototype.slice.call(arguments, 1),
                data = [this].concat(method_arguments);

            // event
            this.$el.trigger(pluginName + '::' + eventType, data);

            // callback
            eventType = eventType.replace(/\b\w+\b/g, function(word) {
                return word.substring(0, 1).toUpperCase() + word.substring(1);
            });
            var onFunction = 'on' + eventType;
            if (typeof this.options[onFunction] === 'function') {
                this.options[onFunction].apply(this, method_arguments);
            }
        },
        getContent: function() {
            return this.$el.attr(this.options.contentAttr) ||
                (typeof this.options.content === 'function' ? this.options.content() : this.options.content);
        },
        setPosition: function(e) {
            var offset, _offset, positionAttr,
                opts = this.options,
                target = this.$el,
                $container = opts.position.container,
                flag = false,
                isMove = false;

            positionAttr = $container.css('position');

            var position = opts.position.value.split(' ');

            if (opts.position.target === 'mouse' && e) {
                target = {
                    top: Math.round(e.pageY),
                    left: Math.round(e.pageX)
                };
                isMove = true;
            } else {
                if (typeof opts.position.target === 'object') target = opts.position.target;
            }

            if (opts.position.auto) {
                if (opts.position.target !== 'mouse') {
                    var collisions = getViewportCollisions(target, this.$tip, $container),
                        posArr = ['top', 'right', 'bottom', 'left'];
                    $.each(collisions, function(i, v) {
                        posArr = $.map(posArr, function(n) {
                            return n !== v ? n : null;
                        });
                    });
                    if (posArr.length > 0) position[0] = posArr[0];
                }
            }

            this.$tip.addClass(this.namespace + '-element-' + position[0])
                .addClass(this.namespace + '-arrow-' + position[1]);

            offset = computePlacementOffset(target, this.$tip, position, isMove);

            if (positionAttr !== 'static') {
                _offset = $container.offset();
                flag = true;
            }

            this.$tip.css({
                top: offset.top + (flag ? -_offset.top : 0),
                left: offset.left + (flag ? -_offset.left : 0)
            });
        },
        loadToggle: function() {
            var flag = this.loadFlag;
            if (flag) {
                this.$tip.removeClass(this.namespace + '_isLoading');
                this.loadFlag = false;
            } else {
                this.$tip.addClass(this.namespace + '_isLoading');
                this.loadFlag = true;
            }
        },
        statusToggle: function(isOpen) {
            if (isOpen) {
                this.$el.removeClass(this.classes.active);
            } else {
                this.$el.addClass(this.classes.active);
            }
        },

        /*
         *  Public Method
         */

        rePosition: function(e) {
            this.setPosition(e);
            return this;
        },

        setContent: function() {
            var opts = this.options;

            if (opts.ajax) {
                this.loadToggle();
            }

            this.$content.html(opts.content);
            this.$tip.appendTo(opts.position.container);

            if (opts.position.target !== 'mouse') this.setPosition();
        },
        show: function() {
            var opts = this.options;

            if (!this.enabled) return;

            // if (opts.closeBtn) this.$tip.addClass(this.classes.hasClose);

            if (opts.skin) this.$tip.addClass(this.namespace + '_' + opts.skin);

            if (opts.ajax) {
                opts.ajax(this);
            }

            this.setContent(this.isOpen);
            this.statusToggle(this.isOpen);

            this.isOpen = true;
            this.trigger('show');
            return this;
        },
        hide: function() {
            if (this.options.ajax) {
                this.$tip.removeClass(this.namespace + '_isLoading');
                this.loadFlag = false;
            }
            this.$tip.off('.' + pluginName);
            this.statusToggle(this.isOpen);
            this.$tip.remove();
            this.isOpen = false;
            this.trigger('hide');
            return this;
        },
        enable: function() {
            this.enabled = true;
            this.$el.addClass(this.classes.enabled);
            return this;
        },
        disable: function() {
            this.enabled = false;
            this.$el.removeClass(this.classes.enabled);
            return this;
        },
        destroy: function() {
            this.$el.off('.' + pluginName);
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
        skin: 'dream',

        closeBtn: false,

        position: {
            value: 'right middle',
            target: false, //mouse || jqueryObj
            container: false,
            auto: false, //if true, judge by positionContainer
            adjust: {
                mouse: true, //Work when positionTarget is mouse
                resize: true,
                scroll: true
            }
        },

        show: {
            target: false,
            event: 'mouseenter',
            delay: 0
        },

        hide: {
            target: false,
            event: 'mouseleave',
            delay: 0,
            container: false, // only hideEvent is click, it can be body or obj
            inactive: false //if true, it is always show when tip hovering
        },

        content: null,
        contentAttr: 'title',

        ajax: false,
        tpl: '<div class="{{namespace}}">' +
            '<div class="{{namespace}}-inner">' +
            '<div class="{{namespace}}-loading"></div>' +
            '<div class="{{namespace}}-content"></div>' +
            '</div>' +
            '</div>',

        // width: false,
        // height: false,

        onInit: null,
        onShow: null,
        onHide: null,
        onFocus: null,
        onBlur: null
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
