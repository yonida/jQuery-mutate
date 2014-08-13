/**
 * @license jQuery-mutate
 * Licensed under the MIT license
 * http://www.opensource.org/licenses/mit-license.php
 * Date: 2014-02-04
 */
 
;
(function ($) {
    mutate = {
        active: false,
        speed: 30,
        event_stack: mutate_event_stack,
        stack: [],
        events: {},

        add_event: function (evt) {
            mutate.events[evt.name] = evt.handler;
        },

        add: function (event_name, selector, callback, false_callback) {
            mutate.stack[mutate.stack.length] = {
                event_name: event_name,
                selector: selector,
                callback: callback,
                false_callback: false_callback
            }
        },

        // Start tracking
        doWork: function() {
            if (mutate.event_stack != 'undefined' && mutate.event_stack.length) {
                $.each(mutate.event_stack, function (j, k) {
                    mutate.add_event(k);
                });
            }
            mutate.event_stack = [];
            $.each(mutate.stack, function (i, n) {
                $(n.selector).each(function (a, b) {
                    if (mutate.events[n.event_name](b) === true) {
                        if (n['callback']) n.callback(b, n);
                    } else {
                        if (n['false_callback']) n.false_callback(b, n)
                    }
                })
            });
            if (mutate.active) {
                setTimeout(mutate.doWork, mutate.speed);
            }
        },

        // Remove all events
        reset: function() {
            mutate.stack = [];
            mutate.events = {};
            mutate.event_stack = mutate_event_stack;
            return mutate;
        },

        stop: function() {
            mutate.active = false;
            return mutate;
        },

        start: function() {
            mutate.active = true;
            mutate.doWork();
        }
    };

    $.fn.extend({
        mutate: function () {
            var event_name = false,
                callback = arguments[1],
                selector = this,
                false_callback = arguments[2] ? arguments[2] : function () {};
            if (arguments[0].toLowerCase() == 'extend') {
                mutate.add_event(callback);
                return this;
            }
            $.each($.trim(arguments[0]).split(' '), function (i, n) {
                event_name = n;
                mutate.add(event_name, selector, callback, false_callback);
            });
            if (!mutate.active) {
                mutate.start();
            }
            return this;
        }
    });
})(jQuery);