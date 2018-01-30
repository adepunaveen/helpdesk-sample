'use strict';

var express = require('express');
var controller = require('./schedule.controller');

var router = express.Router();

router.post('/donothing/', controller.donothing);
router.post('/updatescheduletime/:id', controller.updatescheduletime);
router.get('/getscheduledays/',controller.getscheduledays);
router.get('/intialisevalues/',controller.intialisevalues);
//router.get('/reintialise/',controller.reintialise);
//router.post('/sendticketconfmail/');sendTicketcreationmail
module.exports = router;
