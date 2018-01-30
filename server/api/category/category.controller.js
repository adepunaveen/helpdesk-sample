'use strict';

import _ from 'lodash';
import category from '../category/category.model';
//import helpdeskusers from '../helpdeskusers/helpdeskusers.model'
import helpdeskusers from '../hduserroles/hduserroles.model';
import tickets from '../ticket/ticket.model';

export function gethelpdeskusers(req,res){
  console.log("new code...")
  return helpdeskusers.find({'role':"BUGroupHead"}).sort({'username': 1}).exec()
                .then(respondWithResult(res, 200))
            .catch(handleError(res));

};

export function gethelpdeskexecutives(req,res){
  return helpdeskusers.find({'role':"BUGroupIndividual"}).sort({'username': 1}).exec()
                .then(respondWithResult(res, 200))
            .catch(handleError(res));

};

export function updatecategorydetails(req,res){
  var userdata ={
   name : req.body.actualcatname,
   subcategory : req.body.editsubcategory,
   categoryhead : req.body.edithead,
   executives : req.body.editexecutive,
   autoassign : req.body.editautoassign,
   subcategories  : req.body.editsubcategorywithprirority
  }

  tickets.find({$and :[{category : req.body.name}, {status : {$not : {$in : ['Cancel','Closed']}}  }  ] }
    ,function(err,docs){
      if (docs.length > 0) {
        return res.status(203).json(("203"));
//        return respondForExistence(res,203)
      } else {
          category.find({'name':userdata.name},function(err,docs){
            console.log("showing category");
            docs[0]. name = userdata.name;
            docs[0].subcategory = userdata.subcategory;
            docs[0].categoryhead = userdata.categoryhead;
            docs[0].executives = userdata.executives;
            docs[0].autoassign = userdata.autoassign;
            docs[0].subcategories = userdata.subcategories;
            return docs[0].save(). then(respondForCreation(res, 200))
                          .catch(handleError(res));
          });
      }
  });

}

export function updatecategory(req,res){
  var userdata ={
   name : req.body.actualcatname,
   subcategory : req.body.editsubcategory,
   categoryhead : req.body.edithead,
   executives : req.body.editexecutive,
   autoassign : req.body.editautoassign,
   subcategories  : req.body.editsubcategorywithprirority
  }
  category.find({'name':userdata.name},function(err,docs){
    console.log("showing category");
    docs[0]. name = userdata.name;
    docs[0].subcategory = userdata.subcategory;
    docs[0].categoryhead = userdata.categoryhead;
    docs[0].executives = userdata.executives;
    docs[0].autoassign = userdata.autoassign;
    docs[0].subcategories = userdata.subcategories;
    return docs[0].save(). then(respondForCreation(res, 200))
                  .catch(handleError(res));
  });

}

export function updatepriority(req,res){
  var editcategory = req.body.changedcategory;
  category.update({'name': editcategory.name},editcategory).then(respondForCreation(res, 200))
                  .catch(handleError(res));

}


export function createcategories(req,res){

var userdata ={
 name : req.body.message.name,
 subcategory : req.body.subcategory,
 categoryhead : req.body.message.head,
 executives : req.body.executives,
 comments : req.body.comments,
 subcategories  : req.body.subcategorywithprirority,
 executives : req.body.message.individual,
 autoassign : req.body.autoassign
}

  category.find({'name':userdata.name},function(err,docs){

    if (docs.length > 0) {
       return res.status(202).json(("202"));
    }
    else{
        return category.create(userdata).
                  then(respondForCreation(res, 200))
                  .catch(handleError(res));
        }
  });


};

export function getCategories(req,res){
  return category.find().exec()
                .then(respondWithResult(res, 200))
            .catch(handleError(res));
};
export function getownedcategories(req,res){
  var headmailId = req.query.parameters;
  return category.find({categoryhead : headmailId}).exec()
                .then(respondWithResult(res, 200))
            .catch(handleError(res));
};

export function deletecategory(req,res){
  tickets.find({$and :[{category : req.body.name}, {status : {$not : {$in : ['Cancel','Closed']}}  }  ] }
    ,function(err,docs){
      if (docs.length > 0) {
        return res.status(203).json(("203"));
//        return respondForExistence(res,203)
      } else {
          return category.findById(req.body._id).exec()
            .then(handleEntityNotFound(res))
            .then(removeEntity(res))
            .catch(handleError(res));            
      }
  });
};

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(200).json("200").end();
        });
    }
  };
};

function respondForCreation(res, statusCode) {
   statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      return res.status(200).json(("200"));
    }
  };
};
function respondForExistence(res, statusCode) {
   statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      console.log("sending 203......")
      return res.status(203).json(("203"));
    }
  };
};

function respondWithResult(res, statusCode) {
   statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
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


function handleEntityNotFound(res) {
 // console.log("handling in not found.....")
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}
