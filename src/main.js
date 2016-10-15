import $ from 'jquery';
import asTooltip from './asTooltip';
import info from './info';

const NAMESPACE = 'asTooltip';
const OtherAsScrollbar = $.fn.asTooltip;

const jQueryasTooltip = function(options, ...args) {
  if (typeof options === 'string') {
    const method = options;

    if (/^_/.test(method)) {
      return false;
    } else if ((/^(get)/.test(method))) {
      const instance = this.first().data(NAMESPACE);
      if (instance && typeof instance[method] === 'function') {
        return instance[method](...args);
      }
    } else {
      return this.each(function() {
        const instance = $.data(this, NAMESPACE);
        if (instance && typeof instance[method] === 'function') {
          instance[method](...args);
        }
      });
    }
  }

  return this.each(function() {
    if (!$(this).data(NAMESPACE)) {
      $(this).data(NAMESPACE, new asTooltip(this, options));
    }
  });
};

$.fn.asTooltip = jQueryasTooltip;

$.asTooltip = $.extend({
  setDefaults: asTooltip.setDefaults,
  noConflict: function() {
    $.fn.asTooltip = OtherAsScrollbar;
    return jQueryasTooltip;
  }
}, info);
