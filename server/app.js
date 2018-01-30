/**
 * Main application file
 */

'use strict';

import express from 'express';
import mongoose from 'mongoose';
mongoose.Promise = require('bluebird');
import config from './config/environment';
import http from 'http';
import bodyParser from 'body-parser';
// Connect to MongoDB
var dbhandle = mongoose.connect(config.mongo.uri, config.mongo.options);
exports.dbhndle = dbhandle;
mongoose.connection.on('error', function(err) {
  console.error('MongoDB connection error: ' + err);
  process.exit(-1);
});

// Populate databases with sample data
//if (config.seedDB) { require('./config/seed'); }

// Setup server
var logincontroller = require('./api/login/login.controller');
var app = express();
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
  //app.use(bodyParser.urlencoded({limit: '50mb'}));
  app.use(bodyParser.json({limit: '50mb'}))


 // sample middlewre for user authorization


//  	app.use(function(req, res, next){
 		
//  	 	console.log("coming here... first ",req.originalUrl)
//  	//	if(req.headers['authorization'] == "naveen"){
//  			next();
// // 		}else{
// // 			res.status = 401;
// // 			res.send('unauthorized access');
//  		//}
//  	});

// end



var server = http.createServer(app);
var socketio = require('socket.io')(server, {
  serveClient: config.env !== 'production',
  path: '/socket.io-client'
});
require('./config/socketio')(socketio);
require('./config/express')(app);
require('./routes')(app);

// Start server
function startServer() {
  app.angularFullstack = server.listen(config.port, config.ip, function() {
//  	app.use(express.bodyParser({limit: '50mb'}));
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
  });
}

setImmediate(startServer);

// Expose app
exports = module.exports = app;
