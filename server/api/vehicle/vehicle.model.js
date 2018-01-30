'use strict';

import mongoose from 'mongoose';

var VehicleSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

export default mongoose.model('Vehicle', VehicleSchema);
