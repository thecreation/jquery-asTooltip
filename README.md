#jquery-tooltip

The powerful jQuery plugin that creates tooltip.<a href="https://github.com/amazingSurge/jquery-tooltip">project page and dems</a>

Download:<a href="https://github.com/amazingSurge/jquery-tooltip/archive/master.zip">jquery-tooltip-master.zip.</a>

***

##features

* **different positions** — tooltip provides 9 position for tips to display
* **AJAXed tooltip spport** — ajax load content support
* **Auto position** — auto reposition to avoid being covered
* **Lightweight size** — 1 kb gzipped


##Description

jquery-tooltip was designed to make implementation as easy as possible. Before implementing, make sure you meet the minimum requirements.
![image][]
 [image]: https://raw.github.com/amazingSurge/jquery-tooltip/master/demo/img/tooltip.png


## Dependencies
*<a href="http://jquery.com/" target="_blank">jQuery 1.83+</a>


## Usage

Import this libraries:
* jQuery
* jquery-tooltip.js

And CSS:
* jquery-tooltip.css - desirable if you have not yet connected one


Create base input element:
```html
<span class="position_tooltip" data-tooltip-position="n" title="North">North</span>                   
<span class="position_tooltip" data-tooltip-position="w" title="West">West</span>
<span class="position_tooltip" data-tooltip-position="e" title="East">East</span>                  
<span class="position_tooltip" data-tooltip-position="s" title="South">South</span>
```

Initialize tooltip:
```javascript
 $(".position_tooltip").tooltip();
```

Or initialize tooltip with custom settings:
```javascript
$(".position_tooltip").tooltip({
     namespace: 'tooltip',
     trigger: 'hover'    // hover click
});
```

## Settings

```javascript
{   
    // Optional property, Set a namespace for css class
    namespace: 'tooltip',

    // Optional property, set target that show tooltip 
    // it works when title property was not set
    target: null, 

    // Optional property, the way to trigger tooltip content
    // 'hover'/'click' to choose
    trigger: 'hover', // hover click

    // Optional property, if true, tooltip will allow you interact with it 
    // so you can some stuff, for example, copy the tooltip content
    interactive: false,

     // Optional property, set how long the tooltip will stay  
    interactiveDelay: 500,

    // Optional property, if true, tip will trace with mouse inside selected element
    mouseTrace: false,

    // Optional property, if true, it will bind close function to a element
    closeBtn: false,

    // Optional property, set the distance between tip and element 
    popSpace: 10, 

    // Optional property, choose tooltip skin, more skins is coming soon
    skin: null,

    // Optional property, set tip display position according to element
    position: 'n',

    // Optional property,  if true, it will adjust tooltip's position when tooltip occur collisions with viewport
    autoPosition: true,

    // Optional property, set transition effect, 'fade'/'zoom'/'none' to choose, more effects are coming soon
    effect: 'fade', // fade none zoom

    // Optional property, define how long animation effect will last
    duration: 200,

    // Optional property, set inline element as tooltip content
    inline: false,

    // Optional property, if true, it will load content with ajax, the url attached in element's title property
    ajax: false,

    // Optional property, set ajax config
    ajaxSettings: {
        dataType: 'html',
        headers: {
            'tooltip': true
        }
    },

    // callback

    onShow: null,
    onHide: null,
    onUpdate: null,

    // tooltip template
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

jquery tooltip has different medthod , we can use it as below :
```javascript

// show tooltip 
$("#api_tooltip").tooltip('show');

// hide tooltip 
$("#api_tooltip").tooltip('hide');

// add a disable class to tooltip elment
$("#api_tooltip").tooltip('disable');

// remove the disable class
$("#api_tooltip").tooltip('enable');

// remove tooltip Dom emement and unbound all events 
$("#api_tooltip").tooltip('destroy');
```


## Event / Callback

* <code>show</code>: trigger when show called
* <code>hide</code>: trigger when hide called

how to use event:
```javascript
$(document).on('tooltip::show', function(event,instance) {
    // instance means current tooltip instance 
    // some stuff
});
```


## Browser support
jquery-tooltip is verified to work in Internet Explorer 7+, Firefox 2+, Opera 9+, Google Chrome and Safari browsers. Should also work in many others.

Mobile browsers (like Opera mini, Chrome mobile, Safari mobile, Android browser and others) is coming soon.

## Changes

| Version | Notes                                                            |
|---------|------------------------------------------------------------------|
|   0.2.x | ([compare][compare-1.2]) add interactive function                    |
|   0.1.x | ([compare][compare-1.1]) add auto position function                   |
|     ... | ...                                                              |

[compare-1.2]: https://github.com/amazingSurge/jquery-tooltip/compare/v1.2.0...v1.3.0
[compare-1.1]: https://github.com/amazingSurge/jquery-tooltip/compare/v1.1.0...v1.2.0

## Author
[amazingSurge](http://amazingSurge.com)

## License
jquery-tooltip plugin is released under the <a href="https://github.com/amazingSurge/jquery-tooltip/blob/master/LICENCE.GPL" target="_blank">GPL licence</a>.
