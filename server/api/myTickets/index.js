'use strict';

var express = require('express');
var controller = require('./myTickets.controller');

var router = express.Router();

var app = express();
// app.use(function(req, res, next){
// 	console.log("coming here... first ",req.originalUrl)
//  		if(req.headers['authorization'] == "naveen"){
//  			next();
//  		}else{
//  			res.status = 401;
//  			res.send('unauthorized access');
//  		}
//  });

//router.post('/', controller.createcategories);
//router.get('/', controller.gethelpdeskusers);
router.get('/getmyTickets/', controller.getmyTickets);
router.get('/getmyTickethistories/', controller.getmyTickethistories);
router.post('/createTickethistory/', controller.createTickethistory);
// router.get('/gethelpdeskusers/', controller.gethelpdeskusers);
// router.post('/createcategories/', controller.createcategories);
// router.post('/updatecategory/:id', controller.updatecategory);
// router.post('/deletecategory/:id', controller.deletecategory);


module.exports = router;
