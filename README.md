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

<table>
    <thead>
        <tr>
            <th>Property</th>
            <th>Default</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>namespace</td>
            <td>'tooltip'</td>
            <td>Optional property, Set a namespace for css class, for example, we have <code>.tooltip_active</code> class for active effect, if namespace set to 'as-tooltip', then it will be <code>.as-tooltip_active</code></td>
        </tr>
        <tr>
            <td>target</td>
            <td>null</td>
            <td>Optional property, set target that show tooltip</td>
        </tr>
        <tr>
            <td>trigger</td>
            <td>'hover'</td>
            <td>Compulsory property， the way to active tooltip,optional 'click'</td>
        </tr>
        <tr>
            <td>interactive</td>
            <td>false</td>
            <td>Optional property, if true, tooltip will keepshow some time</td>
        </tr>
        <tr>
            <td>interactiveDelay</td>
            <td>500</td>
            <td>Optional property,it works only when interactive set to true, it sets the delay when tooltip keepshow</td>
        </tr>
        <tr>
            <td>mouseTrace</td>
            <td>false</td>
            <td>Optional property, if true tooltip will trace mouse</td>
        </tr>
        <tr>
            <td>closeBtn</td>
            <td>false</td>
            <td>Optional property, </td>
        </tr>
        <tr>
            <td>popSpace</td>
            <td>10</td>
            <td>Optional property, set the space between target and tooltip</td>
        </tr>
        <tr>
            <td>skin</td>
            <td>'skin-dream'</td>
            <td>Optional property,set transtion effect, it works after you load specified skin file</td>
        </tr>
        <tr>
            <td>position</td>
            <td>'n'</td>
            <td>Optional property,set the position of tooltip relative target</td>
        </tr>
        <tr>
            <td>autoPosition</td>
            <td>true</td>
            <td>Optional property, if true, it will adjust tooltip's position when viewport occur collisions</td>
        </tr>
        <tr>
            <td>effect</td>
            <td>'fade'</td>
            <td>Optional property, set transition effect, more effects are coming/td>
        </tr>
        <tr>
            <td>duration</td>
            <td>200</td>
            <td>Optional property, define how long animation will run</td>
        </tr>
        <tr>
            <td>inline</td>
            <td>false</td>
            <td>Optional property, set inline element as tooltip content</td>
        </tr>
        <tr>
            <td>ajax</td>
            <td>false</td>
            <td>Optional property, if true, it will load content with ajax, the url attached in element's   <code>title</code> </td>
        </tr>
        <tr>
            <td>ajaxSettings</td>
            <td><code>{
                dataType:'html',
                headers:{'tooltiop':true}
            } </code></td>
            <td>Optional property, it works only when ajax is set to true, if true, tooltip will cach loaded content</td>
        </tr>
        <tr>
            <td>onShow</td>
            <td>null</td>
            <td>Optional property, callback for event <code>show()</code></td>
        </tr>
        <tr>
            <td>onHide</td>
            <td>null</td>
            <td>Optional property, callback for event <code>hide()</code> </td>
        </tr>
        <tr>
            <td>onUpdate</td>
            <td>null</td>
            <td>Optional property, callback , call when tooltip content update</td>
        </tr>       
        <tr>
            <td>tpl</td>
            <td><code>{
                container: '< div class="{{namespace}}-container" >< /div >',
                loading: '< span class="{{namespace}}-loading" >< /span >',
                content: '< div class="{{namespace}}-content" >< /div >',
                arrow: ' < span class="{{namespace}}-arrow" > < /span >'
                close: '< a class="{{namespace}}-close" >< /a >'
            }
               
            </code></td>
            <td>optional property, tooltip template</td>
        </tr>                
    </tbody>
</table>

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
