Here
==========
2016-01-28



Helper to represent events on an horizontal timeline.



Here can be installed as a [planet](https://github.com/lingtalfi/Observer/blob/master/article/article.planetReference.eng.md).



HERE: Horizontal Events Representation Engine.



It depends of jquery (I'm a big fan).


![here demo](http://postimg.org/image/c1382hdr3/)


This is a very basic tool that help you represent events on an horizontal timeline.


It handles things like zooming in and out the timeline, moving horizontally along the timeline.
Although not too difficult to implement by hand, it can take a few time to figure out
how zoom works, especially if you are not good at maths (and I'm not good at it).






How to?
-----------

Here is the content of the demo file (demo/here.demo.html). 


```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8"/>
    <script src="http://code.jquery.com/jquery-2.1.4.min.js"></script>
    <script src="/libs/here/js/here.js"></script>
    <script src="/libs/here/js/timeplotter/constant-distance.timeplotter.js"></script>
    <link rel="stylesheet" href="/libs/here/css/here.demo.css">
    <title>Here demo page</title>
</head>

<body>


<div id="here_container">
    <div class="tool_bar">
        <div class="hours">
            <div>
                <span data-offset="0">00:00</span>
                <span data-offset="180">03:00</span>
                <span data-offset="360">06:00</span>
                <span data-offset="540">09:00</span>
            </div>
            <div>
                <span data-offset="720">12:00</span>
                <span data-offset="900">15:00</span>
                <span data-offset="1080">18:00</span>
                <span data-offset="1260">21:00</span>
            </div>
        </div>
        <div class="zoom_tools">
            <button class="zoom_in">+</button>
            <button class="zoom_out">-</button>
        </div>
    </div>

    <div class="timeline_outer">
        <div class="timeline_inner">
            <div class="timeline_plots"></div>
            <div class="timeline_events">
                <div data-offset="100"
                     data-duration="3600">
                    <img src="http://vkontakte.ru/images/gifts/256/78.jpg">
                    <span class="title">Duck</span>
                </div>
                <div data-offset="3750"
                     data-duration="5500">
                    <img src="http://vkontakte.ru/images/gifts/256/83.jpg">
                    <span class="title">Toucan</span>
                </div>
                <div data-offset="10000"
                     data-duration="1600">
                    <img src="http://vkontakte.ru/images/gifts/256/44.jpg">
                    <span class="title">Mammoth</span>
                </div>
                <div data-offset="12000"
                     data-duration="5040">
                    <img src="http://vkontakte.ru/images/gifts/256/70.jpg">
                    <span class="title">Fat cat</span>
                </div>
                <div data-offset="18000"
                     data-duration="7200">
                    <img src="http://www.irisa.fr/vista/Themes/Demos/Debruitage/images/Peppers.png">
                    <span class="title">Peppers</span>
                </div>
                <div data-offset="26000"
                     data-duration="6000">
                    <img
                        src="http://cdn.theatlantic.com/assets/media/img/photo/2015/11/images-from-the-2016-sony-world-pho/s01_130921474920553591/main_900.jpg?1448476701">
                    <span class="title">Running hamster</span>
                </div>
                <div data-offset="32000"
                     data-duration="7100">
                    <img src="http://all4desktop.com/data_images/original/4237641-images.jpg">
                    <span class="title">Universe</span>
                </div>
                <div data-offset="40000"
                     data-duration="7100">
                    <img src="http://www.francetvinfo.fr/image/759f7nqe0-e652/908/624/7593841.jpg">
                    <span class="title">2016</span>
                </div>
                <div data-offset="50000"
                     data-duration="5200">
                    <img src="http://ichef-1.bbci.co.uk/news/640/cpsprodpb/EED6/production/_87524116_87524107.jpg">
                    <span class="title">Glass ball</span>
                </div>
                <div data-offset="56000"
                     data-duration="7300">
                    <img src="http://www.hindustantimes.com/Images/popup/2015/6/kungfu2.jpg">
                    <span class="title">Kung fu pandas</span>
                </div>
                <div data-offset="65000"
                     data-duration="4000">
                    <img src="http://www.thehindu.com/multimedia/dynamic/02184/VBK-03-SOLAR_FLARE_2184508f.jpg">
                    <span class="title">Sun</span>
                </div>
                <div data-offset="70000"
                     data-duration="2600">
                    <img src="http://www.thinkstockphotos.com/CMS/StaticContent/Hero/TS_AnonHP_462882495_01.jpg">
                    <span class="title">Turtle</span>
                </div>
                <div data-offset="73000"
                     data-duration="9000">
                    <img src="http://www.gettyimages.co.uk/gi-resources/images/frontdoor/creative/Embed/hero_dog_482206371.jpg">
                    <span class="title">Super dog</span>
                </div>
            </div>
        </div>
    </div>
</div>
<script>
    (function ($) {
        $(document).ready(function () {


            var jHereContainer = $('#here_container');
            var jToolbar = $('.tool_bar', jHereContainer);
            var jPlotContainer = $('.timeline_plots', jHereContainer);
            var jTimeLineInner = $('.timeline_inner', jHereContainer);
            var jHours = $('.hours', jToolbar);


            var jHere = jTimeLineInner.here({
                jEvents: $(".timeline_events > div", jHereContainer),
                timePlotPlugin: new constantDistance({
                    jPlotContainer: jPlotContainer,
                    minimumDistance: 200
                })
            });


            //------------------------------------------------------------------------------/
            // ADDING ZOOM FUNCTIONALITY
            //------------------------------------------------------------------------------/
            var oHere = jHere.data('here');
            $('.zoom_in', jToolbar).on('click', function () {
                oHere.zoomIn();
                return false;
            });
            $('.zoom_out', jToolbar).on('click', function () {
                oHere.zoomOut();
                return false;
            });


            //------------------------------------------------------------------------------/
            // ADDING NAVIGATION BY BUTTON FUNCTIONALITY
            //------------------------------------------------------------------------------/
            jHours.on('click', 'span', function () {
                var offset = parseInt($(this).attr('data-offset')) * 60;
                oHere.moveTo(offset);
                return false;
            });
        });
    })(jQuery);
</script>
</body>
</html>
```

Basically, you need an outer container and an inner container.
The inner container should be absolutely positioned inside the outer container, 
and that would allow us to slide along the timeline horizontally already.


In the demos, I added some zoom buttons.
The zooming system used in this demo is a system designed to keep the same distance between two
consecutive time plots. Time plots indicates the time above the timeline.

You can implement your own zooming system, read the conception notes below to get started.


This version of the plugin read data on your events html.
You use the data-offset and data-duration attributes to indicate to the plugin when your event starts,
and how long it last. More info in the options.





Here options
---------------
```js
{
   //------------------------------------------------------------------------------/
    // REQUIRED
    //------------------------------------------------------------------------------/
    /**
     * The jquery selector for your events.
     * This is required.
     *
     * Note that you are responsible for creating the html of the events.
     * The target events must have the following attributes set:
     *
     * - data-duration: the duration of the events in second
     * - data-offset: when does the event start ?
     *                              relatively from the timeline's origin, in seconds.
     *
     *
     */
    jEvents: null,
    //------------------------------------------------------------------------------/
    // OPTIONAL
    //------------------------------------------------------------------------------/
    /**
     * jquery handle to the outer container.
     * The outer container is the html element that contains the inner container.
     * The inner container is the html elements that contains the events.
     * The inner container is moved inside of the outer container, and the outer container
     * acts as a window to the inner container, that's how the timeline "moves" upon certain
     * user actions.
     * See docs for more details.
     *
     * Defaults to the direct parent of the html element to which the plugin was applied.
     *
     */
    jOuterContainer: null,
    /**
     * The object responsible to handle the rendering of the time plots.
     * A time plot plugin must have the following methods:
     *
     * - init ( hereInstance )
     *          prepare the plugin if needed.
     *          The here instance is passed so that one can attach methods to its prototype.
     * - refresh ( ratio )
     *          render the time plots according to the given ratio
     *
     *
     */
    timePlotPlugin: null,
    /**
     * How many pixels to represent 1 second.
     * This is a number (it can be decimal, or just int), it can be bigger,
     * equals to or lower than 1,
     * but it must be strictly bigjPlotContainerger than 0.
     */
    ratio: 1,
    /**
     * The number of milliseconds to execute the moveTo animation.
     * Default is 1000
     */
    moveToAnimationDuration: 1000,
    /**
     * The number of seconds that the whole timeline lasts.
     * Default is 86400 (one day)
     */
    timelineDuration: 86400,
    /**
     * Callback fired after that an event is refreshed.
     * Use this to set a background color dynamically, using a custom data-color attribute for instance,
     * or to hide/show some elements depending on the new width, or...
     *
     * - jHandle: the jquery object representing the event
     * - newWidth: int
     * - data: the result of the jquery's data method, so you basically get any data- attribute's value.
     *                  See jquery docs for more info.
     *
     *
     */
    onEventRefreshedAfter: function (jHandle, newWidth, data) {
    },
    /**
     * Where do you want to start with, in seconds, and from the timeline's origin
     */
    startAt: 0    
}
```


ConstantDistance Timeplotter options 
---------------------

The ConstantDistance timeplotter is a plugin that handles the rendering of the time plots on the behalf 
of the here plugin. For more info, see the "conception notes" section below.

The ConstantDistance plugin makes sure that you always have the same (constant) distance between two plots,
thus avoiding time plots potential overlapping issues.


The options for this plugin are the following.




```js
{
    //------------------------------------------------------------------------------/
    // REQUIRED
    //------------------------------------------------------------------------------/
    /**
     * jquery handle to the plot container, which is the html element containing all
     * the time plots.
     * Time plots will be dynamically placed by using their left property's value.
     * Time plots are absolute positioned, make sure your css does that.
     *
     */
    jPlotContainer: null,
    //------------------------------------------------------------------------------/
    // OPTIONAL
    //------------------------------------------------------------------------------/
    /**
     * The minimum distance between two plots in pixels.
     * This distance will remain constant throughout zooming
     */
    minimumDistance: 100,
    /**
     * An array of minimum durations between two plots, in seconds.
     * This plugin works with a zooming system which has a "zoom in" and "zoom out" buttons.
     * Those buttons switch the plot units.
     * plotUnit is involved in the ratio formulae: we have
     *
     *          ratio = minimumDistance / plotUnit
     *
     *
     * The ratio is that magic number used to convert the duration to a a length.
     *
     * So, basically the zooming system of this plugin is manually triggered.
     *
     */
    plotUnits: [3600, 1800, 600, 300, 120, 60],
    /**
     * The plot unit to start with
     */
    defaultPlotUnit: 3600,
    /**
     * Render the html of a plot.
     * Use this to style your plots.
     */
    getPlotHtml: function (text) {
        return '<span>' + text + ' </span>';
    }
}
```




 



Conception notes
--------------------

It all starts with events.
An event starts at a given point in time, and has a finite duration.

Then you want to represent the events, horizontally.

In order to do that, you need to find a relationship between the duration of an event 
and its width (how much space it takes on your screen).

If this relationship is constant, then all you have to do is basically provide 
a system that allows you to scroll the timeline horizontally, to swipe it to the left or to the right.

That's easy to do, just put the timeline inside a container, and change the left property's value 
of the timeline to make it happen. 
The plugin handles that for you, at least partially, but that's not what it is best at.


When the user can change the relationship between the duration and the width, THEN,
the plugin might help you with that.

In plain english, if you can zoom in or out the timeline, then the plugin might help you with that.


In this conception, I use the following strategy.

First, I use a timelineDuration, which means that I know the duration of the whole timeline.
The timeline could last 1 day, or 10 years, or 38 seconds, it'a a precise duration that I can convert in seconds.
Knowing the whole timeline makes it easy to then move horizontally from one point to the other:
I don't depend on an extra call to display a part of the timeline, because the whole timeline 
is displayed at once.

I'm not saying that this has only advantages, but anyway that's the system I used here.
Also, I use a ratio as the magic number that defines the relationship between the distance and the width
of an event.

For instance, 1 second might be represented by 1pixel, or maybe 10 pixels, or 100 pixels,
or maybe 1pixels represents 12 seconds; whatever this is, it's a simple ratio.



Building with those two characteristics, zooming the timeline, as its lowest level,
is nothing more than changing the ratio and refresh the display of the timeline accordingly.

In the rest of this document, I will refer to this strategy as the microsystem (ratio/timelineDuration).


Ok, that kind of theoretically works on the paper, but so far we only discussed one part of the equation.
The other part is the time plots (aka time scale) that's on top of our timeline and that helps the user to navigate
the timeline.

Well, my friends, this is a totally different problem.
Zooming the time plots is more than just readjusting the length of the plots with the new ratio:
you actually have to DECIDE which scale you are going to use.

For instance, you could decide to display the plots evenly every hour, but if the user keeps zooming and zooming,
she will come to a point where the hour scale means nothing to her, she whould need minute plots, or maybe even seconds plots,
depending on how far she zoomed in.

So this is a totally different problem than event resizing.
Therefore, I encapsulated it in a plugin: the time plot plugin.

So to recap, my "here plugin" can handle the timeline on its own, using the microsystem (ratio/timelineDuration),
but it uses a time plot plugin to handle the rendering of the time plots, according to the current ratio.


So far, I'm using only one time plot plugin, but it fits my needs.
I called it the ConstantDistance time plot plugin.


constant distance time plot plugin
-------------------------------------
 
This plugin's idea was to have a constant distance between two consecutive plots. 
I did some trial and errors before I get to that conception.
As it turned out, I can get my way out of theoretical problems, but in this particular there is something 
visual that I ironically didn't see coming, maybe you would have seen it right away:
if two plots are too close to each other, they overlap themselves. 
Why this is technically possible, you won't implement a system like this if you are serious about providing
your customers with good looking widgets.

So basically, if your system is going to ignore this parameter, it's not going to work (...).

Therefore, starting with that minimum distance between two plots and building around it is, I believe, 
the good approach to this problem, or at least one that works.

So this plugin requires the following:

- the timelineDuration    
- the ratio 
- the minimum distance between two plots  (delta distance)
- the minimum duration between two plots (delta duration), referred to as plot unit in the rest of this document

Remember that the timelineDuration is already part of the microsystem.
So does the ratio.

An interesting thing that I found about the ratio is that it could be defined at least with two approaches:

- the number of pixels needed to represent one second (that was my first approach, which led me to ignore the visual constraint...)
- delta distance / delta duration (that's the way to see it that takes the visual constraint into account)


For the rest of this discussion, we will just ignore the first conception (number of pixels per second) and stick 
with the second one: delta distance / delta duration.

An interesting note about this division is that when we zoom in, you just need to change the delta duration, 
the delta distance remains the same (which visually corresponds to the fact that two plots are always separated 
by the same physical distance).


### So how does it work, concretely?

Enough theory.
So you set the minimum distance between two plots, for instance 100px.
Then you define different plot units.

A plot unit is, again, just the minimum duration between two plots.
So for instance if I say that my plot unit is 3600 seconds, this mean that each plot represents one hour.
If a plot unit is 600, it means that each plot represents 10 minutes.
 
So when you define different plot units, you basically just define an array of plot units, like this for instance:

[3600, 1800, 600, 300, 120, 60]
 
 
Basically, the constant distance plugin comes with the nextZoom and previousZoom methods, that take care of 
switching from one plot unit to the other.

I believe it's interesting to note that under the hood it's the same ratio magic number (used by the here plugin) 
that is used, but we've simply wrapped it with some business logic.
 





History Log
------------------
    
- 1.0.0 -- 2016-01-28

    - initial commit
    
    



 
 
 



















