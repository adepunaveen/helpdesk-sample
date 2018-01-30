'use strict';

import mongoose from 'mongoose';

var TicketHistorySchema = new mongoose.Schema({
  ticketId : Object,
  Action : String,
  performed_by : String,
  description : String,
  creationdate: Date,
  attachment : String
});

export default mongoose.model('TicketHistory', TicketHistorySchema);
