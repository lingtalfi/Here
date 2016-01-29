(function ($) {


    var pluginName = "here";


    $[pluginName] = function (element, options) {

        var defaults = {
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
        };

        var plugin = this;

        plugin.settings = {};
        var $el = $(element);

        /**
         * some first class citizens vars inside this plugin
         */
        var ratio, jEvents, jOuterContainer, currentOffset;
        var timePlotter = null;


        plugin.init = function () {


            plugin.settings = $.extend({}, defaults, options);
            ratio = plugin.settings.ratio;
            jEvents = plugin.settings.jEvents;


            // resolving some default values
            if (null === plugin.settings.jOuterContainer) {
                plugin.settings.jOuterContainer = $el.parent();
            }
            jOuterContainer = plugin.settings.jOuterContainer;

            if (null !== plugin.settings.timePlotPlugin) {
                timePlotter = plugin.settings.timePlotPlugin;
                timePlotter.init(plugin);
            }

            currentOffset = plugin.settings.startAt;
            refresh();
        };


        /**
         * Scrolls the timeline to another point in time.
         * 
         * Offset is the number of seconds since the
         * origin of the timeline.
         */
        plugin.moveTo = function (offset) {
            currentOffset = offset;
            $el.animate({
                left: '-' + secondsToPixels(offset) + 'px'
            }, plugin.settings.moveToAnimationDuration);
        };

        /**
         * Changes the zoom level of the timeline.
         * 
         * This method basically just assign a new ratio.
         * The ratio is the number of pixels that you use to represent a second.
         */
        plugin.zoom = function (newRatio) {
            ratio = newRatio;
            refresh();
        };


        /**
         * Set the ratio.
         * 
         * This is low level method (used by plugins).
         */
        plugin.setRatio = function (newRatio) {
            ratio = newRatio;
        };

        /**
         * Get the current ratio.
         * 
         * This is low level method (used by plugins).
         */
        plugin.getRatio = function () {
            return ratio;
        };

        /**
         * Return the current offset: the current position of the timeline, 
         * in seconds, and relatively to the timeline origin.
         */
        plugin.getCurrentOffset = function(){
            return currentOffset;
        };
        
        /**
         * Return the whole timeline duration, in seconds.
         */
        plugin.getTimelineDuration = function(){
            return plugin.settings.timelineDuration;
        };


        function secondsToPixels(nbSeconds) {
            return parseInt(nbSeconds) * ratio;
        }


        function refresh() {
            
            reposition(currentOffset);
            
            
            var jParent = null;
            var z = 0;
            // refresh events
            jEvents.each(function () {
                var data = $(this).data();
                var duration = data['duration'];
                var offset = data['offset'];
                var theWidth = parseInt(parseInt(duration) * ratio);
                $(this).width(theWidth);
                $(this).css({
                    left: secondsToPixels(offset) + 'px',
                    "z-index": z++
                });
                plugin.settings.onEventRefreshedAfter($(this), theWidth, data);
                if (null === jParent) {
                    jParent = $(this).parent(); // assuming there is only one parent for all events
                }
            });


            // resize the inner container's width
            var innerContainerWidth = secondsToPixels(plugin.settings.timelineDuration);
            jParent.width(innerContainerWidth);


            // refresh plots
            if (null !== timePlotter) {
                timePlotter.refresh(ratio);
            }
        }
        
        function reposition(offset){
            $el.css({left: '-' + secondsToPixels(offset) + 'px'});
        }
        

        plugin.init();

    };


    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (undefined == $(this).data(pluginName)) {
                var plugin = new $[pluginName](this, options);
                $(this).data(pluginName, plugin);
            }
        });

    };

})(jQuery);