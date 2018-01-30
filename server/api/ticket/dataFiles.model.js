'use strict';

import mongoose from 'mongoose';
import fs from 'fs';

var Schema = mongoose.Schema;

var filesSchema = new Schema({},{ strict: false });

export default mongoose.model("dataFiles", filesSchema, "fs.files" );
