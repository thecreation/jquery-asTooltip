/**
* jQuery asTooltip v0.4.3
* https://github.com/amazingSurge/jquery-asTooltip
*
* Copyright (c) amazingSurge
* Released under the LGPL-3.0 license
*/
(function(global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports !== 'undefined') {
    factory(require('jquery'));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.jQuery);
    global.jqueryAsTooltipEs = mod.exports;
  }
})(this, function(_jquery) {
  'use strict';

  var _jquery2 = _interopRequireDefault(_jquery);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule
      ? obj
      : {
          default: obj
        };
  }

  var _typeof =
    typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol'
      ? function(obj) {
          return typeof obj;
        }
      : function(obj) {
          return obj &&
          typeof Symbol === 'function' &&
          obj.constructor === Symbol &&
          obj !== Symbol.prototype
            ? 'symbol'
            : typeof obj;
        };

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  }

  var _createClass = (function() {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ('value' in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function(Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  })();

  var DEFAULTS = {
    namespace: 'asTooltip',

    skin: '',

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
    tpl:
      '<div class="{{namespace}}">' +
      '<div class="{{namespace}}-inner">' +
      '<div class="{{namespace}}-loading"></div>' +
      '<div class="{{namespace}}-content"></div>' +
      '</div>' +
      '</div>',

    onInit: null,
    onShow: null,
    onHide: null,
    onFocus: null,
    onBlur: null
  };

  var NAMESPACE$1 = 'asTooltip';

  var $win = (0, _jquery2.default)(window);
  var instances = [];

  // this is the core function to compute the position to show depended on the given placement argument
  var computePlacementOffset = function computePlacementOffset(
    element,
    $tip,
    position,
    isMove
  ) {
    // grab measurements
    var elOffset = void 0;

    var elWidth = void 0;
    var elHeight = void 0;
    var tipWidth = void 0;
    var tipHeight = void 0;
    var $element = (0, _jquery2.default)(element);
    var x = 0;
    var y = 0;

    elOffset = isMove ? element : $element.offset();
    elWidth = isMove ? 0 : $element.outerWidth();
    elHeight = isMove ? 0 : $element.outerHeight();

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
            default:
              break;
          }
          break;
        case 'right':
          x =
            i === 0
              ? elOffset.left + elWidth
              : elOffset.left + elWidth - tipWidth;
          break;
        case 'top':
          y = i === 0 ? elOffset.top - tipHeight : elOffset.top;
          break;
        case 'bottom':
          y =
            i === 0
              ? elOffset.top + elHeight
              : elOffset.top + elHeight - tipHeight;
          break;
        default:
          break;
      }
    }

    return {
      left: Math.round(x),
      top: Math.round(y)
    };
  };

  var getViewportCollisions = function getViewportCollisions(
    el,
    $tip,
    $container
  ) {
    var $element = (0, _jquery2.default)(el);
    var eOffset = $element.offset();
    var cOffset = $container.offset();
    var scrollLeft =
      $container[0].tagName === 'BODY'
        ? $win.scrollLeft()
        : $container.scrollLeft();
    var scrollTop =
      $container[0].tagName === 'BODY'
        ? $win.scrollTop()
        : $container.scrollTop();

    var offset =
      $container[0].tagName === 'BODY'
        ? eOffset
        : {
            top: eOffset.top - cOffset.top,
            left: eOffset.left - cOffset.left
          };

    var eWidth = $element.outerWidth();
    var eHeight = $element.outerHeight();
    var tWidth = $tip.outerWidth();
    var tHeight = $tip.outerHeight();
    var cWidth =
      $container[0].tagName === 'BODY'
        ? $win.innerWidth()
        : $container.outerWidth();
    var cHeight =
      $container[0].tagName === 'BODY'
        ? $win.innerHeight()
        : $container.outerHeight();
    var collisions = [];

    if (tHeight > offset.top - scrollTop) {
      collisions.push('top');
    }
    if (tHeight + eHeight + offset.top > scrollTop + cHeight) {
      collisions.push('bottom');
    }
    if (tWidth > offset.left - scrollLeft) {
      collisions.push('left');
    }
    if (tWidth + eWidth + offset.left > scrollLeft + cWidth) {
      collisions.push('right');
    }

    return collisions;
  };

  /**
   * Plugin constructor
   **/

  var asTooltip = (function() {
    function asTooltip(element, options) {
      _classCallCheck(this, asTooltip);

      var body = (0, _jquery2.default)(document.body);
      var newTarget = element[0] === document ? body : element;
      var opts = void 0;
      var targetData = void 0;
      targetData = this.parseTargetData(
        (0, _jquery2.default)(newTarget).data()
      );
      opts = this.options = _jquery2.default.extend(
        true,
        {},
        DEFAULTS,
        options,
        targetData
      );

      opts.position.container = !opts.position.container
        ? body
        : (0, _jquery2.default)(opts.position.container);
      if (!opts.position.target) {
        opts.position.target = newTarget;
      }
      if (!opts.show.target) {
        opts.show.target = newTarget;
      }
      if (!opts.hide.target) {
        opts.hide.target = newTarget;
      }

      this.$element = (0, _jquery2.default)(newTarget);

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
        enabled: this.namespace + '_enabled'
      };

      this.trigger('init');
      this.init();
    }

    _createClass(
      asTooltip,
      [
        {
          key: 'init',
          value: function init() {
            var _this = this;

            var opts = this.options;
            var showTarget = opts.show.target;
            var hideTarget = opts.hide.target;
            var showEvent = opts.show.event;
            var hideEvent = opts.hide.event;

            // add namepace
            this.$tip = (0, _jquery2.default)(
              opts.tpl.replace(/{{namespace}}/g, this.namespace)
            );

            this.$loading = (0, _jquery2.default)(
              '.' + this.namespace + '-loading',
              this.$tip
            );
            this.$content = (0, _jquery2.default)(
              '.' + this.namespace + '-content',
              this.$tip
            );

            if (showTarget === hideTarget && showEvent === hideEvent) {
              this._bind(showTarget, showEvent, function(e) {
                if (_this.isOpen) {
                  _this.hideMethod(e);
                } else {
                  _this.showMethod(e);
                }
              });
            } else {
              this._bind(showTarget, showEvent, function(e) {
                _this.showMethod(e);
              });
              this._bind(hideTarget, hideEvent, function(e) {
                _this.hideMethod(e);
              });
            }
            if (opts.position.container[0].tagName === 'BODY') {
              if (opts.position.adjust.resize) {
                this._bind($win, 'resize', function() {
                  if (_this.isOpen) {
                    _this.setPosition();
                  }
                });
              }
              if (opts.position.adjust.scroll) {
                this._bind($win, 'scroll', function() {
                  if (_this.isOpen) {
                    _this.setPosition();
                  }
                });
              }
            }
          }
        },
        {
          key: 'trigger',
          value: function trigger(eventType) {
            for (
              var _len = arguments.length,
                params = Array(_len > 1 ? _len - 1 : 0),
                _key = 1;
              _key < _len;
              _key++
            ) {
              params[_key - 1] = arguments[_key];
            }

            var data = [this].concat(params);

            // event
            this.$element.trigger(NAMESPACE$1 + '::' + eventType, data);

            // callback
            eventType = eventType.replace(/\b\w+\b/g, function(word) {
              return word.substring(0, 1).toUpperCase() + word.substring(1);
            });
            var onFunction = 'on' + eventType;

            if (typeof this.options[onFunction] === 'function') {
              this.options[onFunction].apply(this, params);
            }
          }
        },
        {
          key: '_bind',
          value: function _bind(targets, events, method, suffix) {
            if (!targets || !method || !events.length) {
              return;
            }
            var name = suffix ? events : events + '.' + suffix;
            (0, _jquery2.default)(targets).on(
              name,
              _jquery2.default.proxy(method, this)
            );
            return this;
          }
        },
        {
          key: '_unbind',
          value: function _unbind(targets, events, suffix) {
            if (targets) {
              (0, _jquery2.default)(targets).unbind(
                suffix ? events : events + '.' + suffix
              );
            }
            return this;
          }
        },
        {
          key: 'parseTargetData',
          value: function parseTargetData(data) {
            var targetData = {};
            _jquery2.default.each(data, function(n, v) {
              var names = n.split('_');
              var len = names.length;
              var path = targetData;
              if (len === 1) {
                targetData[names[0]] = v;
              } else {
                for (var i = 0; i < len; i++) {
                  if (i === 0) {
                    if (targetData[names[i]] === undefined) {
                      targetData[names[i]] = {};
                    }
                  } else if (i === len - 1) {
                    path[names[i]] = v;
                  } else {
                    if (path[names[i]] === undefined) {
                      path[names[i]] = {};
                    }
                  }
                  path = targetData[names[i]];
                }
              }
            });
            return targetData;
          }
        },
        {
          key: 'parseTpl',
          value: function parseTpl(string) {
            return string.replace('{{namespace}}', self.namespace);
          }
        },
        {
          key: 'getDelegateOptions',
          value: function getDelegateOptions() {
            var options = {};

            if (this._options) {
              _jquery2.default.each(this._options, function(key, value) {
                if (DEFAULTS[key] !== value) {
                  options[key] = value;
                }
              });
            }

            return options;
          }
        },
        {
          key: 'showMethod',
          value: function showMethod(obj) {
            var self =
              obj instanceof this.constructor
                ? obj
                : (0, _jquery2.default)(obj.currentTarget).data(NAMESPACE$1);
            var opts = this.options;

            if (!self) {
              self = new this.constructor(
                obj.currentTarget,
                this.getDelegateOptions()
              );
              (0, _jquery2.default)(obj.currentTarget).data(NAMESPACE$1, self);
            }

            if (!opts.ajax && !self.options.content) {
              return;
            }

            if (self.isOpen) {
              clearTimeout(self.hideTimer);
            } else {
              clearTimeout(self.showTimer);
              self.showTimer = setTimeout(function() {
                _jquery2.default.proxy(self.show, self)();
              }, opts.show.delay);
            }

            if (opts.position.target === 'mouse') {
              if (this.moveFlag) {
                return;
              }
              this.isFirst = true;
              (0, _jquery2.default)(document).on(
                'mousemove.' + NAMESPACE$1,
                _jquery2.default.proxy(this.move, self)
              );
              this.moveFlag = true;
            }

            if (opts.hide.event === 'click') {
              if (opts.hide.container) {
                this._bind(opts.hide.container, opts.hide.event, function(e) {
                  var $target = (0, _jquery2.default)(e.target);

                  if (
                    $target.closest(self.$el).length === 0 &&
                    $target.closest(self.$tip).length === 0
                  ) {
                    if (self.isOpen) {
                      _jquery2.default.proxy(self.hide, self)();
                    }
                  }
                });
              }
            }
          }
        },
        {
          key: 'hideMethod',
          value: function hideMethod(obj) {
            var self =
              obj instanceof this.constructor
                ? obj
                : (0, _jquery2.default)(obj.currentTarget).data(NAMESPACE$1);
            var opts = this.options;
            var show = false;

            if (!self) {
              self = new this.constructor(
                obj.currentTarget,
                this.getDelegateOptions()
              );
              (0, _jquery2.default)(obj.currentTarget).data(NAMESPACE$1, self);
            }

            if (!opts.ajax && !self.options.content) {
              return;
            }

            if (!self.isOpen) {
              clearTimeout(self.showTimer);
              return;
            }

            if (opts.position.target === 'mouse') {
              if (this.moveFlag) {
                return;
              }
            }

            if (opts.hide.event === 'click') {
              if (opts.hide.container) {
                this._unbind(opts.hide.container, opts.hide.event);
              }
            }

            if (opts.hide.inactive) {
              this._bind(self.$tip, 'mouseenter.' + NAMESPACE$1, function() {
                show = true;
              });
              this._bind(self.$tip, 'mouseleave.' + NAMESPACE$1, function() {
                show = false;
                clearTimeout(self.hideTimer);
                self.hideTimer = setTimeout(function() {
                  _jquery2.default.proxy(self.hide, self)();
                }, self.options.hide.delay);

                self._unbind(
                  self.$tip,
                  'mouseenter.' + NAMESPACE$1 + ' mouseleave.' + NAMESPACE$1
                );
              });
            }

            clearTimeout(self.hideTimer);

            self.hideTimer = setTimeout(function() {
              if (!show) {
                _jquery2.default.proxy(self.hide, self)();
              }
            }, opts.hide.delay);
          }
        },
        {
          key: 'move',
          value: function move(e) {
            var x = Math.round(e.pageX);
            var y = Math.round(e.pageY);
            var t = this.$element.offset().top;
            var l = this.$element.offset().left;
            var w = this.$element.outerWidth();
            var h = this.$element.outerHeight();

            if (x >= l && x <= l + w && y >= t && y <= t + h) {
              if (this.options.position.adjust.mouse) {
                this.setPosition(e);
              } else if (this.isFirst) {
                this.setPosition(e);
                this.isFirst = false;
              }
            } else {
              (0, _jquery2.default)(document).off('mousemove.' + NAMESPACE$1);
              this.moveFlag = false;
              this.hideMethod(this.$element.data(NAMESPACE$1));
            }
          }
        },
        {
          key: 'getContent',
          value: function getContent() {
            return (
              this.$element.attr(this.options.contentAttr) ||
              (typeof this.options.content === 'function'
                ? this.options.content()
                : this.options.content)
            );
          }
        },
        {
          key: 'setPosition',
          value: function setPosition(e) {
            var offset = void 0;
            var _offset = void 0;
            var positionAttr = void 0;
            var opts = this.options;
            var target = this.$el;
            var $container = opts.position.container;
            var flag = false;
            var isMove = false;

            positionAttr = $container.css('position');

            var position = opts.position.value.split(' ');

            if (opts.position.target === 'mouse' && e) {
              target = {
                top: Math.round(e.pageY),
                left: Math.round(e.pageX)
              };
              isMove = true;
            } else {
              if (_typeof(opts.position.target) === 'object') {
                target = opts.position.target;
              }
            }

            if (opts.position.auto) {
              if (opts.position.target !== 'mouse') {
                var collisions = getViewportCollisions(
                  target,
                  this.$tip,
                  $container
                );
                var posArr = ['top', 'right', 'bottom', 'left'];
                _jquery2.default.each(collisions, function(i, v) {
                  posArr = _jquery2.default.map(posArr, function(n) {
                    return n !== v ? n : null;
                  });
                });
                if (posArr.length > 0) {
                  position[0] = posArr[0];
                }
              }
            }

            this.$tip
              .addClass(this.namespace + '-element-' + position[0])
              .addClass(this.namespace + '-arrow-' + position[1]);

            offset = computePlacementOffset(
              target,
              this.$tip,
              position,
              isMove
            );

            if (positionAttr !== 'static') {
              _offset = $container.offset();
              flag = true;
            }

            this.$tip.css({
              top: offset.top + (flag ? -_offset.top : 0),
              left: offset.left + (flag ? -_offset.left : 0)
            });
          }
        },
        {
          key: 'loadToggle',
          value: function loadToggle() {
            var flag = this.loadFlag;
            if (flag) {
              this.$tip.removeClass(this.namespace + '_isLoading');
              this.loadFlag = false;
            } else {
              this.$tip.addClass(this.namespace + '_isLoading');
              this.loadFlag = true;
            }
          }
        },
        {
          key: 'statusToggle',
          value: function statusToggle(isOpen) {
            if (isOpen) {
              this.$element.removeClass(this.classes.active);
            } else {
              this.$element.addClass(this.classes.active);
            }
          }
        },
        {
          key: 'rePosition',
          value: function rePosition(e) {
            this.setPosition(e);
            return this;
          }
        },
        {
          key: 'setContent',
          value: function setContent() {
            var opts = this.options;

            if (opts.ajax) {
              this.loadToggle();
            }

            this.$content.html(opts.content);
            this.$tip.appendTo(opts.position.container);

            if (opts.position.target !== 'mouse') {
              this.setPosition();
            }
          }
        },
        {
          key: 'show',
          value: function show() {
            var opts = this.options;

            if (!this.enabled) {
              return;
            }

            // if (opts.closeBtn) this.$tip.addClass(this.classes.hasClose);

            if (opts.skin) {
              this.$tip.addClass(this.namespace + '_' + opts.skin);
            }

            if (opts.ajax) {
              opts.ajax(this);
            }

            this.setContent(this.isOpen);
            this.statusToggle(this.isOpen);

            this.isOpen = true;
            this.trigger('show');
            return this;
          }
        },
        {
          key: 'hide',
          value: function hide() {
            if (this.options.ajax) {
              this.$tip.removeClass(this.namespace + '_isLoading');
              this.loadFlag = false;
            }
            this.$tip.off('.' + NAMESPACE$1);
            this.statusToggle(this.isOpen);
            this.$tip.remove();
            this.isOpen = false;
            this.trigger('hide');
            return this;
          }
        },
        {
          key: 'enable',
          value: function enable() {
            this.enabled = true;
            this.$element.addClass(this.classes.enabled);
            this.trigger('enable');
            return this;
          }
        },
        {
          key: 'disable',
          value: function disable() {
            this.enabled = false;
            this.$element.removeClass(this.classes.enabled);
            this.trigger('disable');
            return this;
          }
        },
        {
          key: 'destroy',
          value: function destroy() {
            this.$element.off('.' + NAMESPACE$1);
            this.trigger('destroy');
            return this;
          }
        }
      ],
      [
        {
          key: 'closeAll',
          value: function closeAll() {
            instances.map(function(instance) {
              if (instance.isOpen) {
                instance.hide();
              }
            });
          }
        },
        {
          key: 'setDefaults',
          value: function setDefaults(options) {
            if (_jquery2.default.isPlainObject(options)) {
              _jquery2.default.extend(true, DEFAULTS, options);
            }
          }
        }
      ]
    );

    return asTooltip;
  })();

  var info = {
    version: '0.4.3'
  };

  var NAMESPACE = 'asTooltip';
  var OtherAsTooltip = _jquery2.default.fn.asTooltip;

  var jQueryAsTooltip = function jQueryAsTooltip(options) {
    for (
      var _len2 = arguments.length,
        args = Array(_len2 > 1 ? _len2 - 1 : 0),
        _key2 = 1;
      _key2 < _len2;
      _key2++
    ) {
      args[_key2 - 1] = arguments[_key2];
    }

    if (typeof options === 'string') {
      var method = options;

      if (/^_/.test(method)) {
        return false;
      } else if (/^(get)/.test(method)) {
        var instance = this.first().data(NAMESPACE);
        if (instance && typeof instance[method] === 'function') {
          return instance[method].apply(instance, args);
        }
      } else {
        return this.each(function() {
          var instance = _jquery2.default.data(this, NAMESPACE);
          if (instance && typeof instance[method] === 'function') {
            instance[method].apply(instance, args);
          }
        });
      }
    }

    return this.each(function() {
      if (!(0, _jquery2.default)(this).data(NAMESPACE)) {
        (0, _jquery2.default)(this).data(
          NAMESPACE,
          new asTooltip(this, options)
        );
      }
    });
  };

  _jquery2.default.fn.asTooltip = jQueryAsTooltip;

  _jquery2.default.asTooltip = _jquery2.default.extend(
    {
      setDefaults: asTooltip.setDefaults,
      closeAll: asTooltip.closeAll,
      noConflict: function noConflict() {
        _jquery2.default.fn.asTooltip = OtherAsTooltip;
        return jQueryAsTooltip;
      }
    },
    info
  );
});
