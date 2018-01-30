/**
 * Passenger model events
 */

'use strict';

import {EventEmitter} from 'events';
var Passenger = require('./passenger.model');
var PassengerEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
PassengerEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Passenger.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    PassengerEvents.emit(event + ':' + doc._id, doc);
    PassengerEvents.emit(event, doc);
  }
}

export default PassengerEvents;
