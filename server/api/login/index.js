'use strict';

var express = require('express');
var controller = require('./login.controller');

var router = express.Router();
// var app = express();
// app.use(function(req, res, next){
// 	console.log("coming here... first ",req.originalUrl)
//  	//	if(req.headers['authorization'] == "naveen"){
//  			next();
// // 		}else{
// // 			res.status = 401;
// // 			res.send('unauthorized access');
 		// }
//  });

router.get('/', controller.user);
router.get('/forgotPassword', controller.forgotPassword);
router.post('/:id', controller.updateUser);
router.post('/updateuserpassword/:id', controller.updateuserpassword);

module.exports = router;
