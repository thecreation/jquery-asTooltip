#jquery-asTooltip

The powerful jQuery plugin that creates asTooltip.<a href="https://github.com/amazingSurge/jquery-asTooltip">project page and dems</a>

Download:<a href="https://github.com/amazingSurge/jquery-asTooltip/archive/master.zip">jquery-asTooltip-master.zip.</a>

***

##features

* **different positions** — asTooltip provides 9 position for tips to display
* **AJAXed asTooltip spport** — ajax load content support
* **Auto position** — auto reposition to avoid being covered
* **Lightweight size** — 1 kb gzipped

![image][]
 [image]: https://raw.github.com/amazingSurge/jquery-asTooltip/master/demo/img/asTooltip.png


## Dependencies
*<a href="http://jquery.com/" target="_blank">jQuery 1.83+</a>


## Usage

Import this libraries:
* jQuery
* jquery-asTooltip.js

And CSS:
* jquery-asTooltip.css - desirable if you have not yet connected one


Create base input element:
```html
<span class="position_asTooltip" data-asTooltip-position="n" title="North">North</span>                   
<span class="position_asTooltip" data-asTooltip-position="w" title="West">West</span>
<span class="position_asTooltip" data-asTooltip-position="e" title="East">East</span>                  
<span class="position_asTooltip" data-asTooltip-position="s" title="South">South</span>
```

Initialize asTooltip:
```javascript
 $(".position_asTooltip").asTooltip();
```

Or initialize asTooltip with custom settings:
```javascript
$(".position_asTooltip").asTooltip({
     namespace: 'asTooltip',
     trigger: 'hover'    // hover click
});
```

## Settings

```javascript
{   
    // Optional property, Set a namespace for css class
    namespace: 'asTooltip',

    // Optional property, set target that show asTooltip 
    // it works when title property was not set
    target: null, 

    // Optional property, the way to trigger asTooltip content
    // 'hover'/'click' to choose
    trigger: 'hover', // hover click

    // Optional property, if true, asTooltip will allow you interact with it 
    // so you can some stuff, for example, copy the asTooltip content
    interactive: false,

     // Optional property, set how long the asTooltip will stay  
    interactiveDelay: 500,

    // Optional property, if true, tip will trace with mouse inside selected element
    mouseTrace: false,

    // Optional property, if true, it will bind close function to a element
    closeBtn: false,

    // Optional property, set the distance between tip and element 
    popSpace: 10, 

    // Optional property, choose asTooltip skin, more skins is coming soon
    skin: null,

    // Optional property, set tip display position according to element
    position: 'n',

    // Optional property,  if true, it will adjust asTooltip's position when asTooltip occur collisions with viewport
    autoPosition: true,

    // Optional property, set transition effect, 'fade'/'zoom'/'none' to choose, more effects are coming soon
    effect: 'fade', // fade none zoom

    // Optional property, define how long animation effect will last
    duration: 200,

    // Optional property, set inline element as asTooltip content
    inline: false,

    // set asTooltip content
    // by defaults, you can set your content as strings
    // if ajax is true, you can use resource reference, for example:'ajax.txt'
    // if inline is true, you can use inline DOm selector, for example: '#id', or '+', means select current element's next sibling element
    title: content or resource reference or '+'

    // Optional property, if true, it will load content with ajax, the url attached in element's title property
    ajax: false,

    // Optional property, set ajax config
    ajaxSettings: {
        dataType: 'html',
        headers: {
            'asTooltip': true
        }
    },

    // callback
    onShow: null,
    onHide: null,
    onUpdate: null,

    // asTooltip template
    tpl: {
        container: '<div class="{{namespace}}-container"></div>',
        loading: '<span class="{{namespace}}-loading"></span>',
        content: '<div class="{{namespace}}-content"></div>',
        arrow: '<span class="{{namespace}}-arrow"></span>',
        close: '<a class="{{namespace}}-close"></a>'
    }

}
```

## Public metheds

jquery asTooltip has different medthod , we can use it as below :
```javascript

// show asTooltip 
$("#api_asTooltip").asTooltip('show');

// hide asTooltip 
$("#api_asTooltip").asTooltip('hide');

// add a disable class to asTooltip elment
$("#api_asTooltip").asTooltip('disable');

// remove the disable class
$("#api_asTooltip").asTooltip('enable');

// remove asTooltip Dom emement and unbound all events 
$("#api_asTooltip").asTooltip('destroy');
```


## Event

* <code>toooltip::show</code>: trigger when show called
* <code>asTooltip::hide</code>: trigger when hide called
* <code>asTooltip::update</code>: trigger when hide called

how to use event:
```javascript
$(document).on('asTooltip::show', function(event,instance) {
    // instance means current asTooltip instance 
    // some stuff
});
```


## Browser support
jquery-asTooltip is verified to work in Internet Explorer 7+, Firefox 2+, Opera 9+, Google Chrome and Safari browsers. Should also work in many others.

Mobile browsers (like Opera mini, Chrome mobile, Safari mobile, Android browser and others) is coming soon.

## Changes

| Version | Notes                                                            |
|---------|------------------------------------------------------------------|
|   0.1.2 | add next siblings selector shortcut                              |
|   0.1.1 | ([compare][compare-1.1]) add auto position function              |
|     ... | ...                                                              |

[compare-1.2]: https://github.com/amazingSurge/jquery-asTooltip/compare/v1.2.0...v1.3.0
[compare-1.1]: https://github.com/amazingSurge/jquery-asTooltip/compare/v1.1.0...v1.2.0

## Author
[amazingSurge](http://amazingSurge.com)

## License
jquery-asTooltip plugin is released under the <a href="https://github.com/amazingSurge/jquery-asTooltip/blob/master/LICENCE.GPL" target="_blank">GPL licence</a>.
