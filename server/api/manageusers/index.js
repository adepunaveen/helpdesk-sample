'use strict';

var express = require('express');
var controller = require('./manageusers.controller');

var router = express.Router();

router.post('/',controller.manageuser);
router.get('/getusers/',controller.getusers);
router.post('/deleteuser/:id',controller.deleteuser);
router.post('/modifyuser/:id', controller.modifyuser);
router.post('/sendloginmail/',controller.sendloginmail);

module.exports = router;
