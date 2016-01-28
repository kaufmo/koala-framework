/**
 * Ermöglicht Kwf.Event.on(el, 'mouseEnter') oder auch 'mouseLeave'.
 * Problem: Wenn man mit mouseOver und mouseOut arbeitet bei verschachtelten dom-elementen
 * dann passiert es, dass die mouseOver und mouseOut events ein paar mal bekommt, wenn man
 * die verschachtelten nodes wechselt.
 *
 * MouseEnter und mouseLeave wird immer nur einmal gefeuert.
 */
Ext.define('Kwf.Event', {
    singleton: true,
    addListener: function(el, eventName, handler, scope, options) {
        var eventName = eventName.toLowerCase();
        if (!el.kwfEvent) el.kwfEvent = {};

        if (eventName == 'mouseenter' || eventName == 'mouseleave') {

            if (eventName == 'mouseenter') {
                var firstEvent = 'mouseover';
                var secondEvent = 'mouseout';
            } else if (eventName == 'mouseleave') {
                var firstEvent = 'mouseout';
                var secondEvent = 'mouseover';
            }

            el.on(firstEvent, function() {
                el.kwfEvent[eventName] = true;
                (function(handler, scope, el) {
                    if (el.kwfEvent[eventName] && !el.kwfEvent[eventName+'_current']) {
                        el.kwfEvent[eventName+'_current'] = true;
                        handler.call(scope);
                    }
                }).defer(1, scope, [ handler, scope, el ]);
            }, scope, options);

            el.on(secondEvent, function() {
                el.kwfEvent[eventName] = false;
                (function(el) {
                    if (!el.kwfEvent[eventName]) {
                        el.kwfEvent[eventName+'_current'] = false;
                    }
                }).defer(1, scope, [ el ]);
            }, scope, options);

        } else {
            throw "Kwf.Event: eventName '"+eventName+"' is not yet implemented.";
        }
    },

    // shortcut
    on: Kwf.Event.addListener
});
