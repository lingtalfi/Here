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
            eventsSelector: null,
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
             */
            timePlotPlugin: null,
            /**
             * How many pixels to represent 1 second.
             * This is a number (it can be decimal, or just int), it can be bigger,
             * equals to or lower than 1,
             * but it must be strictly bigger than 0.
             *
             * Note that this number might be overridden by some plugins.
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
             * An event is refreshed when its size or position needs to be updated.
             * Typically, this occur when the user zooms in/out the timeline, in other words, when the ratio is updated.
             * Scrolling the timeline does not require events refreshing.
             *
             *
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
             * - onMoveBefore ( jElements )
             *          callback fired just before the time line is moved horizontally.
             *          It returns the set of elements to be moved.
             *
             *          The jElements parameter is a set of the jquery element(s) that are being
             *          moved.
             *          You can for instance add a new jquery element to this set, so that its movement
             *          is synchronized with the timeline's movement.
             *          To do so, you might be interested by the jquery.add method.
             */
            onMoveBefore: function (jElements) {
                return jElements;
            },
            /**
             * Use this number to move the timeline to an arbitrary position before it is displayed.
             * This is an int representing a number of seconds from the timeline's origin (time line left most point)
             */
            startAt: 0
        };

        var plugin = this;

        plugin.settings = {};
        var $el = $(element);

        /**
         * some first class citizens vars inside this plugin
         */
        var ratio, eventsSelector, jOuterContainer, currentOffset;
        var timePlotter = null;


        plugin.init = function () {


            plugin.settings = $.extend({}, defaults, options);
            ratio = plugin.settings.ratio;
            eventsSelector = plugin.settings.eventsSelector;


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
            refresh(true);
        };


        /**
         * Scrolls the timeline to another point in time.
         *
         * Offset is the number of seconds since the
         * origin of the timeline.
         */
        plugin.moveTo = function (offset) {
            currentOffset = offset;
            var sel = $el;
            sel = plugin.settings.onMoveBefore(sel);
            sel.animate({
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
        plugin.getCurrentOffset = function () {
            return currentOffset;
        };

        /**
         * Return the whole timeline duration, in seconds.
         */
        plugin.getTimelineDuration = function () {
            return plugin.settings.timelineDuration;
        };

        /**
         * Refresh the timeline.
         *
         * You might want to use this method after injecting events to the timeline with an ajax call for instance.
         *
         * You shouldn't use the force parameter, but if you need it to:
         * the force parameter will refresh every events targeted by the eventsSelector.
         * By default, this plugin marks the events that it builds, so that it can avoid re-building them every time.
         *
         * This behaviour is only used in cases where the ratio doesn't change, and you have already built events
         * in the timeline.
         * A concrete case for this is when you use an infinite scroll plugin, every time the user scrolls down,
         * the new page of events should be rebuilt, but the existing events don't need to.
         *
         */
        plugin.refresh = function (force) {
            refresh(force);
        };


        function secondsToPixels(nbSeconds) {
            return parseInt(nbSeconds) * ratio;
        }


        function refresh(force) {

            repositionTimeline(currentOffset);


            var jParent = null;
            var innerContainerWidth = secondsToPixels(plugin.settings.timelineDuration);


            var jEvents = $(eventsSelector);
            if ('undefined' === typeof force) {
                jEvents = jEvents.not(".built");
            }

            // refresh events
            jEvents.each(function () {
                var data = $(this).data();
                var duration = data['duration'];
                var offset = data['offset'];
                var theWidth = parseInt(parseInt(duration) * ratio);
                $(this).width(theWidth);
                $(this).css({
                    left: secondsToPixels(offset) + 'px'
                });
                plugin.settings.onEventRefreshedAfter($(this), theWidth, data);

                jParent = $(this).parent(); // there might be multiple timelines (stacked timelines for a tv program for instance)
                // resize the inner container's width
                jParent.width(innerContainerWidth);

                $(this).addClass('built'); // mark event to optimize further "light" (non forced) renderings
            });


            // refresh plots
            if (null !== timePlotter) {
                timePlotter.refresh(ratio);
            }
        }

        function repositionTimeline(offset) {
            var sel = $el;
            sel = plugin.settings.onMoveBefore(sel);
            sel.css({left: '-' + secondsToPixels(offset) + 'px'});
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