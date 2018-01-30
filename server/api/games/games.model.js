'use strict';

import mongoose from 'mongoose';

var GamesSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

export default mongoose.model('Games', GamesSchema);
