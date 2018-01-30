'use strict';

import _ from 'lodash';
import Users from '../login/login.model';
import hduserroles from '../hduserroles/hduserroles.model';
import tickets from '../ticket/ticket.model';
import category from '../category/category.model';
var nodemailer = require('nodemailer');
var sjcl = require('sjcl');

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
    //  res.status(statusCode).json(entity);
      res.send({"statusCode":200,"data":entity});
    }
  };
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

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
   // res.status(statusCode).send(err);
    res.send({"statusCode":500,"data":err});

  };
};

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

export function manageuser(req, res) {
  var encryptedInfo = sjcl.encrypt("password", "MagikMinds");
 var userdata ={
  firstname:req.body.firstName,
  lastname:req.body.lastName,
  employeeid:req.body.employeeid,
  emailid:req.body.emailid,
  active:req.body.active,
  usertype:req.body.userType,
  designation:req.body.role,
  hdroles : req.body.hdroles,
  //-->Siva Changes Start
  password: encryptedInfo,
  profilefilename : "undefined.jpg"
  //<--End
}


  Users.find({ $or: [ {employeeid:req.body.employeeid},
    {emailid:req.body.emailid} ] },
    function (err, recs) {
      if(recs!=''){

      var response={
        message:"already exists",
        statusCode:400
      }
      res.send(response);
    }
      else{
            return Users.create(userdata)
            .then(respondWithResult(res, 200))
          .catch(handleError(res));
        }
    });
};

function saveUpdates(updates) {
  console.log("showing updat", updates)
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.save()
      .then(updated => {
        return updated;
      });
  };
}

export function getusers(req, res) {
 	return Users.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));

};

export function deleteuser(req,res){
  tickets.find({$and :[{Assigned_to : req.body.emailid}, {status : {$not : {$in : ['Cancel','Closed']}}  }  ] }
    ,function(err,docus){
      if (docus.length > 0) {
        return res.status(203).json(("203"));
      } else {

        category.find({$or : [{'executives' : req.body.emailid},{'categoryhead' : req.body.emailid}]},function(exeerr,cate_recs){
            if (cate_recs.length > 0) {
              return res.status(202).json(("202"));
            } else {
                hduserroles.find({'useremailid':req.body.emailid},function(err,docs){
                docs[0].remove();
                return Users.findById(req.body._id).exec()
                  .then(handleEntityNotFound(res))
                  .then(removeEntity(res))
                  .catch(handleError(res));
                });
            }
        });
    }

  });




  // hduserroles.find({'useremailid':req.body.emailid},function(err,docs){
  //   docs[0].remove();
  //   return Users.findById(req.body._id).exec()
  //     .then(handleEntityNotFound(res))
  //     .then(removeEntity(res))
  //     .catch(handleError(res));
  //   });



};

export function modifyuser(req,res){
  var userdata ={
 // _id : req.body._id,
  firstname:req.body.firstName,
  lastname:req.body.lastName,
  employeeid:req.body.employeeid,
  emailid:req.body.emailid,
  active:req.body.active,
  usertype:req.body.userType,
  designation:req.body.role,
  hdroles : req.body.hdroles
}
     return Users.update({_id: req.body._id},userdata)
        .then(function(data){return updatedrecord(req,res)})
        //.then(respondWithResult(res))
        .catch(handleError(res));
};

function updatedrecord(req,res){
  return Users.findById(req.body._id).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));

}




export function sendloginmail( req,res){
        var user = req.body;
        console.log("sending mail to....", req.body)
        var transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'mmconnectemail@gmail.com',
                pass: 'mm@12345'
            },
            secure: true
        });

        var salutation = 'Dear ' + 'User' + ',';
        var signature = 'Regards,' + '\n' + 'MMConnect Team';
        var body = "Your MM Resume Builder account credentials are:" + '\n\n' + 
                   'Username: ' + user.emailid + '\n' + 'Password: ' + user.password;
        var message = salutation + '\n\n' + body + '\n\n' + signature;

        var mailOptions = { from: 'mmconnectemail@gmail.com', // sender address
                            to: user.emailid, // list of receivers
                            subject: 'MMConnect Notification', // Subject line
                            text: message //, // plaintext body
                            // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead 
        };

        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                console.log(error)
                res.status(500).json(error);           
            } else {            
                res.status(200).json("200");
            };

            transporter.close();
        });
  
        // var Mailinfo = getmailDetailsFor('Owner' , createdtickethistory);
        // sendMail(Mailinfo[0] ,Mailinfo[1])
        // // sendMail(ownermailBody,ownermailOptions)
        // sendMail(headmailBody,headmailOptions)
}

