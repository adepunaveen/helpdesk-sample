 'use strict';

import mongoose from 'mongoose';

var helpdeskuserSchema = new mongoose.Schema({
 name : String,
 email : String
});

export default mongoose.model('helpdeskusers', helpdeskuserSchema);