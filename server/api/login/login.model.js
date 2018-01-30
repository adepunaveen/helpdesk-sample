'use strict';

import mongoose from 'mongoose';

var UsersSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  emailid: String,
  employeeid : Number,
  password: String,
  active: String,
  usertype: String,
  lastlogin: Date,
  dob: Date,
  bloodgroup: String,
  phone: Number,
  experience: Number,
  address: String,
  officelocation: String,
  description: String,
  lastmodified: Date,
  designation: String,
  companies: Array,
  hdroles : Array,
  profilefilename : {type : String,default : "undefined"}
});

export default mongoose.model('Users', UsersSchema);