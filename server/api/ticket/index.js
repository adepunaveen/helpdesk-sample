'use strict';

var express = require('express');
var controller = require('./ticket.controller');

var router = express.Router();

router.post('/createticket/', controller.createticket);
router.get('/getpriorities/', controller.getpriorities);
router.get('/getcategories/',controller.getcategorytickets);
router.get('/gettickets/',controller.gettickets);
router.post('/updatetickets/:id',controller.updatetickets);
router.get('/sendmail/',controller.sendticketcreationmail);
router.post('/getattachment/',controller.downloadattachment);
router.get('/gethistories/',controller.gettickethistories);
//gettickethistories
//router.post('/sendticketconfmail/');sendTicketcreationmail
module.exports = router;
