'use strict';

var express = require('express');
var controller = require('./hduserhome.controller');

var router = express.Router();

router.get('/getraisedtickets/', controller.getraisedtickets);

module.exports = router;
