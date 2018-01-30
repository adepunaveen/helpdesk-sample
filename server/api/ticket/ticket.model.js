 'use strict';

import mongoose from 'mongoose';

var TicketSchema = new mongoose.Schema({
  ticketNo : Number,
  owner : String,
  owneremail : String,
  category: String,
  subcategory: String,
  status : String,
  status_cycle : [],
  priority : String,
  Assigned_to : String,
  description : String,
  spoc: String,
  creationdate: Date,
  type: String,
  categoryheademail : String,
  categoryhead : String

});

export default mongoose.model('Ticket', TicketSchema);