'use strict';

var express = require('express');
var controller = require('./assignTickets.controller');

var router = express.Router();


router.get('/getassignedtickets/', controller.getassignedtickets);
router.post('/updateticketStatus/', controller.updateticketStatus);
router.post('/updateticketpriority/:id', controller.updateticketpriority);

module.exports = router;
