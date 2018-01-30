'use strict';

import mongoose from 'mongoose';

var TicketSchema = new mongoose.Schema({
  ticketNo : Number,
  owner : String,
  category: String,
  subcategory: String,
  status : String,
  status_cycle : [],
  priority : String,
  Assigned_to : String,
  description : String,
  spoc: String,
  creationdate: Date,
  type: String
});

export default mongoose.model('userTickets', TicketSchema);