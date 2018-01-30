'use strict';

import mongoose from 'mongoose';

var scheduledayschema = new mongoose.Schema({
name : String,
days : {type:Number,default: 1}
});

export default mongoose.model('scheduleday', scheduledayschema);
