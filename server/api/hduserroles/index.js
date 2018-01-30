'use strict';

var express = require('express');
var controller = require('./hduserroles.controller');

var router = express.Router();

router.get('/gethdusers/', controller.gethdusers);
router.post('/createUserrole/', controller.createUserrole);
router.post('/uploadempimage/', controller.uploadempimage);
//router.post('/:id', controller.updateUserrole);
router.post('/modifyuserrole/:id',controller.updateUserrole);

router.post('/modifyhduserrole/:id',controller.modifyhduserrole);
module.exports = router;
