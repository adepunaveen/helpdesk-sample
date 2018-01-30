'use strict';

var express = require('express');
var controller = require('./category.controller');

var router = express.Router();

//router.post('/', controller.createcategories);
//router.get('/', controller.gethelpdeskusers);
router.get('/getcategories/', controller.getCategories);
router.get('/gethelpdeskusers/', controller.gethelpdeskusers);
router.post('/createcategories/', controller.createcategories);
router.post('/updatecategory/:id', controller.updatecategory);
//router.post('/updatecategory/:id', controller.updatecategorydetails);

router.post('/deletecategory/:id', controller.deletecategory);
router.post('/updatepriority/:id', controller.updatepriority);
router.get('/gethelpdeskexecutives/', controller.gethelpdeskexecutives);
router.get('/getownedcategories/', controller.getownedcategories);


module.exports = router;
