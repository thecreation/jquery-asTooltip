export default {
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
  tpl: '<div class="{{namespace}}">' +
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
