 'use strict';

import mongoose from 'mongoose';

var ticketsSchema = new mongoose.Schema({
 owner : String,
 category : Number,
 type : String,
 status : String,
 
});

export default mongoose.model('myticketss', ticketsSchema);