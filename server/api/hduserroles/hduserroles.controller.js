'use strict';

import _ from 'lodash';
import hduserroles from './hduserroles.model';
import Users from '../login/login.model';

var nodemailer = require('nodemailer');
var fs = require('fs');

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(200).json(entity);
    }
  };
};

function respondWithUpdateResult(res, statusCode) {
   statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      return res.status(200).json("200");
    }
  };
};


function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
};

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.save()
      .then(updated => {
        return updated;
      });
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

export function gethdusers(req, res) {

  console.log("Server: In getUserrole ......",req.query);
  return hduserroles.find( {useremailid: { $ne: req.query.pUser }   } ).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));

};

export function updateUserrole(req, res) {
  console.log(" updating user role...---->",req.body);
  if (req.body.usertype == 'Admin') {
    req.body.hdroles.push("Admin");
  }
  hduserroles.find({user_id : req.body._id},function(err,recs){
    if (recs.length > 0) {
      recs[0].username = req.body.firstname + ' ' + req.body.lastname;
      recs[0].role = req.body.hdroles;
      recs[0].useremailid = req.body.emailid;
      recs[0].save();
    } 
   
    return res.status(200).json(("200"));

  });


  // hduserroles.update({ useremailid : req.body.emailid} , req.body.setclause )
  // .then(respondWithUpdateResult(res, 200))
  // .catch(handleError(res));

};


export function modifyhduserrole(req, res) {
      hduserroles.find({useremailid : req.body.emailid},function(err,recs){
    if (recs.length > 0) {
      recs[0].role = req.body.setclause.role;
      recs[0].save();
    }    
    return res.status(200).json(("200"));

  });


  // hduserroles.update({ useremailid : req.body.emailid} , req.body.setclause )
  // .then(respondWithUpdateResult(res, 200))
  // .catch(handleError(res));

};


export function createUserrole(req, res) {
  
  if (req.body.usertype == 'Admin') {
    req.body.hdroles.push("Admin");
  }
  var userdata ={
  username :  req.body.firstname + ' ' + req.body.lastname,
  useremailid :  req.body.emailid,
  role  : req.body.hdroles,
  user_id    : req.body._id
  }
  hduserroles.find({ $or: [ {useremailid : req.body.emailid} ] },
    function (err, recs) {
      if(recs!=''){
      var response={
        message:"already exists",
        statusCode:400,
        data: recs[0]
      }
      return res.send(response);

  //};

    }
      else{
            return hduserroles.create(userdata)
            .then(respondWithResult(res, 200))
          .catch(handleError(res));
        }
    });



};

exports.uploadempimage = function(req, res) {
    console.log("In upload emp pic");
    var origString = req.body.content;
    var type = req.body.type;
    var empid = req.body.empid;
    console.log("file upload body...",req.body);
    var fileName = empid + new Date().getTime().toString() + ".jpg";
    var userinfo = req.body.userinfo;
    console.log(fileName);

    var path = './client/images/empidpics/' + fileName;
    console.log('folder location--> ' , path);

    var formatString = new Buffer(origString, 'base64');
    var data = formatString;

    fs.writeFile(path, data, function(error) {
        if (error) {
        console.error("write error:  " + error.message);
        } else {
          userinfo.profilefilename = fileName;
          Users.update({ emailid: userinfo.emailid }, {$set: userinfo}, function(err,numba,rawres){
            if(err){
              res.json("failure");            
            }
            else{
              console.log("sending response")
              res.send({"statusCode":200,"filename":fileName});
//              res.json('{statuscode : "success", filename :'+ fileName+'  }');
            }
          });
          
        }
    });
};

function sendEmail(res) {
  return function(entity) {
    if (entity) {

      var user = entity[0];

        var transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'mmconnectemail@gmail.com',
                pass: 'mm@12345'
            },
            secure: true
        });

        var salutation = 'Dear ' + 'User' + ',';
        var signature = 'Regards,' + '\n' + 'MMHelpDesk Team';
        var body = "Your MM HelpDesk account credentials are:" + '\n\n' +
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
                res.status(500).json(error);
            } else {
                res.status(200).json(entity);
            };

            transporter.close();
        });

    }
  };
};
