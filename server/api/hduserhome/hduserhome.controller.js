'use strict';

import _ from 'lodash';
import userTickets from '../ticket/ticket.model';

export function getraisedtickets(req,res){
  console.log("in raised tickets controller");
  console.log('req -- ', req.query.parameter);
  var userrole = req.query.parameter[1];
  var findString = {};

  if (userrole == "User") {
  findString = {owneremail: req.query.parameter[0]}; }
  else { findString = {$or:[{owneremail: req.query.parameter[0]} , { Assigned_to: req.query.parameter[0] }, { categoryhead: req.query.parameter[0] }]} };

  console.log("findString-->", findString)
  return userTickets.find( findString ).exec()
                .then(respondWithResult(res, 200))
            .catch(handleError(res));

};

function respondWithResult(res, statusCode) {
   statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      //console.log("entity", entity)
      return res.status(200).json(entity);
    }
  };
};

function handleError(res, statusCode) {
 
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
};