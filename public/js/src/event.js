/**
 * Event layer to communicate between components
 *
 * Usage:
 * Event.on('event:name', function(args) {})
 * Event.emit('event:name', args)
 */

!function() {

  'use strict';

  var events = {}

  var Event = {
    on: function(handler, cb) {
      console
      if (typeof events[handler] !== 'undefined') {
        events[handler].push(cb)
      }
      else {
        events[handler] = [cb]
      }
    },

    unbind: function(handler, cb) {
      if (typeof events[handler] !== 'undefined') {
        var newEvents = []
        events[handler].forEach(function(e) {
          if (e.toString() !== cb.toString()) {
            newEvents.push(e)
          }
        })
        events[handler] = newEvents
      }
    },

    emit: function(handler, args) {
      if (typeof events[handler] !== 'undefined') {
        events[handler].forEach(function(cb) {
          cb(args)
        })
      }
    }
  }

  if (typeof module !== 'undefined') {
    module.exports = Event
  }
  else {
    window.Event = Event
  }

}();
