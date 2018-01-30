/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import bodyParser from 'body-parser';
import path from 'path';
import express from 'express';
export default function(app) {

app.use(bodyParser.json({limit: '50mb'}));

// app.use(function(req, res, next){
//  console.log("coming here... first ",req.originalUrl)
//      if(req.headers['authorization'] == "naveen"){
//        next();
//      }else{
//        res.status = 401;
//        res.send('unauthorized access');
//      }
//  });



  // Insert routes below
  app.use('/api/ticket', require('./api/ticket'));
  app.use('/api/managecategory', require('./api/category'));
  app.use('/api/assignTickets', require('./api/assignTickets'));
  app.use('/api/myTickets', require('./api/myTickets'));
  app.use('/api/users', require('./api/login'));
  app.use('/api/hduserhome', require('./api/hduserhome'));
  app.use('/api/manageusers',require('./api/manageusers'));
  app.use('/api/hduserroles',require('./api/hduserroles'));
  app.use('/api/schedule',require('./api/schedule'));
//  app.use('/api/createcategories', require('./api/category'));
//  app.use('/api/gethelpdeskusers', require('./api/category'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/')
    .get((req, res) => {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
}
