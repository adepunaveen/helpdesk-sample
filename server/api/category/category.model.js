 'use strict';

import mongoose from 'mongoose';

var categorySchema = new mongoose.Schema({
 name : String,
 subcategory : [],
 categoryhead : String,
 executives : [],
 comments : String,
 subcategories : [],
 autoassign : Boolean
});

export default mongoose.model('categories', categorySchema);