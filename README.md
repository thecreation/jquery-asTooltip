# [jQuery asTooltip](https://github.com/amazingSurge/jquery-asTooltip) ![bower][bower-image] [![NPM version][npm-image]][npm-url] [![Dependency Status][daviddm-image]][daviddm-url] [![prs-welcome]](#contributing)

> A jQuery plugin for showing tooltip text when hover on a element.

## Table of contents
- [Main files](#main-files)
- [Quick start](#quick-start)
- [Requirements](#requirements)
- [Usage](#usage)
- [Examples](#examples)
- [Options](#options)
- [Methods](#methods)
- [Events](#events)
- [No conflict](#no-conflict)
- [Browser support](#browser-support)
- [Contributing](#contributing)
- [Development](#development)
- [Changelog](#changelog)
- [Copyright and license](#copyright-and-license)

## Main files
```
dist/
├── jquery-asTooltip.js
├── jquery-asTooltip.es.js
├── jquery-asTooltip.min.js
└── css/
    ├── asTooltip.css
    └── asTooltip.min.css
```

## Quick start
Several quick start options are available:
#### Download the latest build

 * [Development](https://raw.githubusercontent.com/amazingSurge/jquery-asTooltip/master/dist/jquery-asTooltip.js) - unminified
 * [Production](https://raw.githubusercontent.com/amazingSurge/jquery-asTooltip/master/dist/jquery-asTooltip.min.js) - minified

#### Install From Bower
```sh
bower install jquery-asTooltip --save
```

#### Install From Npm
```sh
npm install jquery-asTooltip --save
```

#### Build From Source
If you want build from source:

```sh
git clone git@github.com:amazingSurge/jquery-asTooltip.git
cd jquery-asTooltip
npm install
npm install -g gulp-cli babel-cli
gulp build
```

Done!

## Requirements
`jquery-asTooltip` requires the latest version of [`jQuery`](https://jquery.com/download/).

## Usage
#### Including files:

```html
<link rel="stylesheet" href="/path/to/asTooltip.css">
<script src="/path/to/jquery.js"></script>
<script src="/path/to/jquery-asTooltip.js"></script>
```

#### Required HTML structure

```html
<span class="example" data-asTooltip-position="n" title="This is tip content">trigger</span>
```

#### Initialization
All you need to do is call the plugin on the element:

```javascript
jQuery(function($) {
  $('.example').asTooltip(); 
});
```

## Examples
There are some example usages that you can look at to get started. They can be found in the
[examples folder](https://github.com/amazingSurge/jquery-asTooltip/tree/master/examples).

## Options
`jquery-asTooltip` can accept an options object to alter the way it behaves. You can see the default options by call `$.asTooltip.setDefaults()`. The structure of an options object is as follows:

```
{
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
}
```

## Methods
Methods are called on asTooltip instances through the asTooltip method itself.
You can also save the instances to variable for further use.

```javascript
// call directly
$().asTooltip('destory');

// or
var api = $().data('asTooltip');
api.destory();
```

#### show()
Show the tooltip.
```javascript
$().asTooltip('show');
```

#### hide()
Hide the tooltip.
```javascript
$().asTooltip('enable');
```

#### enable()
Enable the tooltip function.
```javascript
$().asTooltip('enable');
```

#### disable()
Disable the tooltip functions.
```javascript
$().asTooltip('disable');
```

#### destroy()
Destroy the tooltip instance.
```javascript
$().asTooltip('destroy');
```

## Events
`jquery-asTooltip` provides custom events for the plugin’s unique actions. 

```javascript
$('.the-element').on('asTooltip::ready', function (e) {
  // on instance ready
});

```

Event   | Description
------- | -----------
init    | Fires when the instance is setup for the first time.
ready   | Fires when the instance is ready for API use.
show    | Fired when the `show` instance method has been called.
hide    | Fired when the `hide` instance method has been called.
enable  | Fired when the `enable` instance method has been called.
disable | Fired when the `enable` instance method has been called.
destroy | Fires when an instance is destroyed. 

## No conflict
If you have to use other plugin with the same namespace, just call the `$.asTooltip.noConflict` method to revert to it.

```html
<script src="other-plugin.js"></script>
<script src="jquery-asTooltip.js"></script>
<script>
  $.asTooltip.noConflict();
  // Code that uses other plugin's "$().asTooltip" can follow here.
</script>
```

## Browser support

Tested on all major browsers.

| <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/safari/safari_32x32.png" alt="Safari"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/chrome/chrome_32x32.png" alt="Chrome"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/firefox/firefox_32x32.png" alt="Firefox"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/edge/edge_32x32.png" alt="Edge"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/internet-explorer/internet-explorer_32x32.png" alt="IE"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/opera/opera_32x32.png" alt="Opera"> |
|:--:|:--:|:--:|:--:|:--:|:--:|
| Latest ✓ | Latest ✓ | Latest ✓ | Latest ✓ | 9-11 ✓ | Latest ✓ |

As a jQuery plugin, you also need to see the [jQuery Browser Support](http://jquery.com/browser-support/).

## Contributing
Anyone and everyone is welcome to contribute. Please take a moment to
review the [guidelines for contributing](CONTRIBUTING.md). Make sure you're using the latest version of `jquery-asTooltip` before submitting an issue. There are several ways to help out:

* [Bug reports](CONTRIBUTING.md#bug-reports)
* [Feature requests](CONTRIBUTING.md#feature-requests)
* [Pull requests](CONTRIBUTING.md#pull-requests)
* Write test cases for open bug issues
* Contribute to the documentation

## Development
`jquery-asTooltip` is built modularly and uses Gulp as a build system to build its distributable files. To install the necessary dependencies for the build system, please run:

```sh
npm install -g gulp
npm install -g babel-cli
npm install
```

Then you can generate new distributable files from the sources, using:
```
gulp build
```

More gulp tasks can be found [here](CONTRIBUTING.md#available-tasks).

## Changelog
To see the list of recent changes, see [Releases section](https://github.com/amazingSurge/jquery-asTooltip/releases).

## Copyright and license
Copyright (C) 2016 amazingSurge.

Licensed under [the LGPL license](LICENSE).

[⬆ back to top](#table-of-contents)

[bower-image]: https://img.shields.io/bower/v/jquery-asTooltip.svg?style=flat
[bower-link]: https://david-dm.org/amazingSurge/jquery-asTooltip/dev-status.svg
[npm-image]: https://badge.fury.io/js/jquery-asTooltip.svg?style=flat
[npm-url]: https://npmjs.org/package/jquery-asTooltip
[license]: https://img.shields.io/npm/l/jquery-asTooltip.svg?style=flat
[prs-welcome]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg
[daviddm-image]: https://david-dm.org/amazingSurge/jquery-asTooltip.svg?style=flat
[daviddm-url]: https://david-dm.org/amazingSurge/jquery-asTooltip