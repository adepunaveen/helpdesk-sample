 'use strict';

import mongoose from 'mongoose';

var hduserrolesSchema = new mongoose.Schema({
 username : String,
 useremailid : String,
 role : [],
 user_id : String
 
});

export default mongoose.model('hduserroles', hduserrolesSchema);