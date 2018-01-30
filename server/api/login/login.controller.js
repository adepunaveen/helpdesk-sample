'use strict';

import _ from 'lodash';
import Users from './login.model';

var nodemailer = require('nodemailer');
var sjcl = require('sjcl');


function respondWithResult(res, req , statusCode  ) {
  statusCode = statusCode || 200;
//  console.log("In respond iwth result", req.session)
  var reqSession = req.session;
  // reqSession.emailid = req.query.Username;
  
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
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

// Verify User Login credentials from database
export function user(req, res) {
  var encryptedInfo = sjcl.encrypt("password", req.query.Password);
  console.log(" password in sjcl ",encryptedInfo);
  var values = {
      emailid: req.query.Username,
    //  password: req.query.Password
      password : encryptedInfo
    };
  Users.find({emailid: req.query.Username},function(err,docs){
    if (docs.length = 1) {
      var storedpwd = sjcl.decrypt("password",docs[0].password)
      if (storedpwd == req.query.Password) {
        res.send({status : 200,data : docs[0]})
      }
      else{
       res.send({status : 201}); 
      }
    }
    else{
       res.send({status : 201}); 
      }
    

  })

/*	return Users.create(values)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));*/
 	// return Users.find(values).exec()
  //   .then(respondWithResult(res , req))
  //   .catch(handleError(res));
  	
};

export function forgotPassword(req, res) {
  var values = {
    emailid: req.query.Username
  };
  Users.find({emailid : req.query.Username},function(err,docs){
    if(err){
      res.send({status : 201})
    }
    else if(docs.length >=1){
      sendEmail(docs[0]);
      res.send({status : 200}) 
    }
    else{
     res.send({status : 202}) 
    }
  })


  // return Users.find(values).exec()
  //   .then(sendEmail(res))
  //   .catch(handleError(res));
};

export function updateUser(req, res) {

  Users.update({ emailid : req.body.emailid} , req.body.setclause )
  .then(respondWithResult(res, 200))
  .catch(handleError(res));

};

export function updateuserpassword(req, res) {
  console.log("chaning password ",req.body)
  //res.send({"status" : 200});

  Users.update({emailid : req.body.emailid},{$set : {password : sjcl.encrypt("password", req.body.newPassword)}})
  .then(respondWithResult(res, 200))
  .catch(handleError(res));


  // Users.update({ emailid : req.body.emailid} , req.body )
  // .then(respondWithResult(res, 200))
  // .catch(handleError(res));

};


function sendEmail(puser) {
//  console.log(" starting mail password")
//  return function(entity) {
 //   if (entity) {
  console.log(" sending mail password")

      var user = puser;

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
                   'Username: ' + user.emailid + '\n' + 'Password: ' + sjcl.decrypt("password",user.password);
        var message = salutation + '\n\n' + body + '\n\n' + signature;

        var mailOptions = { from: 'mmconnectemail@gmail.com', // sender address
                            to: user.emailid, // list of receivers
                            subject: 'MMHelpDesk Notification', // Subject line
                            text: message //, // plaintext body
                            // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead 
        };

        transporter.sendMail(mailOptions, function(error, info){
            if(error){
  //              return 500;           
            } else {            
//                return 200;;
            };
            transporter.close();
        });
      
   // }
  //};
};