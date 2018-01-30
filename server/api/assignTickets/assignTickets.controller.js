'use strict';

import _ from 'lodash';
import tickets from '../ticket/ticket.model';
import mytickethistories from '../ticket/tickethistory.model';

// for storing attached files...
import mongoose from 'mongoose';
import dataFiles from '../ticket/dataFiles.model';
import Grid from 'gridfs-stream';
var app = require("../../app.js");
Grid.mongo = mongoose.mongo;
var db = app.dbhndle;
var gfs = new Grid(mongoose.connection.db);
// end for storing file saving.

var nodemailer = require('nodemailer');
var updatedTicket = {};

function notifyStatusUpdatetoUsers( pTicketHistory ){

        var Mailinfo = getmailDetailsFor('Owner' , pTicketHistory);
        // console.log("Comp Mailbody", Mailinfo[0]);
    //    console.log("Mail Options", Mailinfo[1]);

        sendMail(Mailinfo[0] ,Mailinfo[1])

       if (Mailinfo[1].to !== undefined ) {
  //      console.log('to address is undefined, could not send Mail');
        Mailinfo = getmailDetailsFor('Head' , pTicketHistory);
        // console.log("Comp Mailbody", Mailinfo[0]);
    //    console.log("Mail Options", Mailinfo[1]);

        sendMail(Mailinfo[0] ,Mailinfo[1])
        };

        if (updatedTicket.status == "Cancel" ) {
          Mailinfo = getmailDetailsFor('Individual' , pTicketHistory);
        // console.log("Comp Mailbody", Mailinfo[0]);
      //  console.log("Mail Options", Mailinfo[1]);

        sendMail(Mailinfo[0] ,Mailinfo[1])
        }

}


function getmailDetailsFor( pTowhom , pTicketHistory){

        var userticket =  updatedTicket;
        var mailtitle = {};
        var mailBody = {};
        var mailfromString = {};
        var mailHeader = {};
        var MailOptions = {};
        var mailSubjectStr = {};
        var mailtoWhom = {};

        if (pTowhom == 'Owner') {
          mailHeader = "<p style='color:blue;font-weight:bold;font-size:150%;'> A Message From MM HelpDesk <br> </p> ";
          mailtitle = mailHeader + '\n\n' + 'Hi ' + userticket.owner + '\n\n';

          mailSubjectStr =  'Your ' + userticket.type + ' ' + userticket.type[0] + '-' + userticket.ticketNo + ' has new status';
          mailtoWhom =  userticket.owneremail;

          if (userticket.status == "Query") {

               mailBody = 'Your ' + userticket.type + ' ' + userticket.type[0] + '-' + userticket.ticketNo +
               ' is pending your action. ' + '\n\n' + 'The support team member working on your ' + userticket.type  +
               ' listed below has put your ' + userticket.type  +
               ' into Query status. This means that the support team member is awaiting your reply for further details. ' +
               'Please check the below query and simply update the ticket notes with additional comments.' ;

              mailBody = mailBody + "<pre> <p style='font-weight:bold;'>" + pTicketHistory.description.toString() + "</p> </pre>" ;

              mailSubjectStr =  'Your ' + userticket.type + ' ' + userticket.type[0] + '-' + userticket.ticketNo + ' is pending your action';

              }
          else if ( userticket.status == "Pending Vendor" ) {
                mailBody = 'Your ' + userticket.type + ' ' + userticket.type[0] + '-' + userticket.ticketNo +
               ' is updated with new status Pending with Vendor. ' + '\n\n' + 'The support team member working on your' + userticket.type  +
               ' listed below has put your ' + userticket.type  +
               ' into Pending with Vendor status. This means that the support team member is awaiting for information or equipment/supplies from a vendor.' ;
              }
          else if ( userticket.status == "Pending BU Other" ) {
                mailBody = 'Your ' + userticket.type + ' ' + userticket.type[0] + '-' + userticket.ticketNo +
               ' is updated with new status Pending with BU Other. ' + '\n\n' + 'The support team member working on your' + userticket.type  +
               ' listed below has put your ' + userticket.type  +
               ' into Pending with BU Other status. This means that the support team member is awaiting for information or work to be performed by another BU group.' ;
              }
          else if ( userticket.status == "In-Progress" ) {
                mailBody = 'Your ' + userticket.type + ' ' + userticket.type[0] + '-' + userticket.ticketNo +
               ' is updated with new status In-Progress. ' + '\n\n' + 'The support team member volunteered on your ' + userticket.type  +
               ' listed below has been started the resolution.' + 'You can update ticket notes with additional comments.' ;
              }
          else if ( userticket.status == "Completed" ) {
                mailBody = 'Your ' + userticket.type + ' ' + userticket.type[0] + '-' + userticket.ticketNo +
               ' has been resolved. ' + '\n\n' + 'The support team member volunteered on your' + userticket.type  +
               ' listed below has resolved and update the ticket notes as below.' + 'Please update your comments on closing the issue' ;

               mailBody = mailBody + "<p style='font-weight:italic;'>" + pTicketHistory.description + "</p>" ;

              }
          else if ( userticket.status == "Closed" ) {
                mailBody = 'Your ' + userticket.type + ' ' + userticket.type[0] + '-' + userticket.ticketNo +
               ' listed below has been Closed successfully. ';
              }
          else if ( userticket.status == "Cancel" ) {
                mailSubjectStr =  'Your ' + userticket.type + ' ' + userticket.type[0] + '-' + userticket.ticketNo + ' has been cancelled';

                mailBody = 'Your ' + userticket.type + ' ' + userticket.type[0] + '-' + userticket.ticketNo +
          ' has been Cancelled. ' + '\n\n' + 'The ' + userticket.type + ' below has been Cancelled at your request.' +
          ' Please review the information for aacuracy and completeness. As your ticket is cancelled by yourself ' +
          'no further investigations will be performed by support team member.' ;

          mailBody = mailBody + "<pre> <p style='font-weight:bold;'>" + pTicketHistory.description.toString() + "</p> </pre>" ;

              }

           }
        else if (pTowhom == 'Head') {
          if ( userticket.status == "Cancel" ) {
                mailHeader = "<p style='color:blue;font-weight:bold;font-size:150%;'> A Message From MM HelpDesk <br> </p> ";
                mailtitle = mailHeader + '\n\n' + 'Hi ' + userticket.categoryhead + '\n\n';

                mailSubjectStr =  'Your ' + userticket.type + ' ' + userticket.type[0] + '-' + userticket.ticketNo + ' has been cancelled';

                mailBody = 'Your ' + userticket.type + ' ' + userticket.type[0] + '-' + userticket.ticketNo +
          ' has been Cancelled. ' + '\n\n' + 'The ' + userticket.type + ' below has been Cancelled at your request.' +
          ' Please review the information for aacuracy and completeness. As your ticket is cancelled by yourself ' +
          'no further investigations will be performed by support team member.' ;

          mailBody = mailBody + "<pre> <p style='font-weight:bold;'>" + pTicketHistory.description.toString() + "</p> </pre>" ;
                mailtoWhom =  userticket.categoryhead;

              }
          else {
               mailHeader = "<p style='color:blue;font-weight:bold;font-size:150%;'> A Message From MM HelpDesk <br> </p> ";
               mailtitle = mailHeader + '\n\n' + 'Hi ' + userticket.categoryhead + '\n\n';

               mailBody = 'The ' + userticket.type + ' ' + userticket.type[0] + '-' + userticket.ticketNo +
               ' assigned to your support team member has updated the status to ' + userticket.status + '.';

              mailSubjectStr =  'Assigned ' + userticket.type + ' ' + userticket.type[0] + '-' + userticket.ticketNo + ' has new status';
              mailtoWhom =  userticket.categoryhead;
               }
          }

        else if (pTowhom == 'Individual') {
          mailHeader = "<p style='color:blue;font-weight:bold;font-size:150%;'> A Message From MM HelpDesk <br> </p> ";
          mailtitle = mailHeader + '\n\n' + 'Hi ' +  '\n\n';

          mailBody = 'The ' + userticket.type + ' ' + userticket.type[0] + '-' + userticket.ticketNo +
          ' assigned to you has been cancelled by owner ' + userticket.owner  + '. Please check the below details and plan accordingly.';

          mailBody = mailBody + "<p style='font-weight:italic;'>" + pTicketHistory.description + "</p>" ;

          mailSubjectStr =  'The ' + userticket.type + ' ' + userticket.type[0] + '-' + userticket.ticketNo + ' has been cancelled';
          mailtoWhom =  userticket.Assigned_to;

          };

        mailfromString = "<p> Sincerely, <br> MagikMinds HELP desk </p>";

        var ticketinfor = "<pre style='font-weight:bold;'>" + 'Ticket ID  : '+ userticket.type + ' '  + userticket.type[0] + '-' + userticket.ticketNo + "<br>" + "</pre>" +
                          "<pre style='font-weight:bold;'>" + 'Request    : '+ userticket.subcategory + "<br>" + "</pre>" +
                          "<pre style='font-weight:bold;'>" + 'Department : '+ userticket.category    + "<br>" + "</pre>" +
                          "<pre style='font-weight:bold;'>" + 'Status     : '+ userticket.status      + "<br>" + "</pre>" +
                          "<br>"
                          "<pre style='font-weight:bold;'>" + 'Assignment BU Group : '+ userticket.categoryhead + "<br>" + "</pre>" +
                          "<pre style='font-weight:bold;'>" + 'Assigned to         : '+ userticket.Assigned_to  + "<br>" + "</pre>";

        var compMailBody = mailtitle + "<br>" + "<br>" +  mailBody + "<br>" + "<br>" + ticketinfor  + mailfromString;

        MailOptions = {     from: 'mmconnectemail@gmail.com',
                            to: mailtoWhom,
                            subject: 'MMConnect Notification : ' + mailSubjectStr,
                            html: compMailBody
                          };

       return [compMailBody, MailOptions ]


};

function sendMail(mailBody,mailOptions){
 var transporter = nodemailer.createTransport({
                           service: 'Gmail',
            // host: 'smtp.office365.com',
            // port: 587,
                           auth: {
                             user: 'mmconnectemail@gmail.com',
                             pass: 'mm@12345'
                          },
                          secure: true
                  });

  transporter.sendMail(mailOptions, function(error, info){
      if(error){
          console.log(error);
      } else {
          console.log('Message sent: ' + info.response);
      };
      transporter.close();
  });

};




export function getassignedtickets(req,res){
//  console.log('Server:--> in getassignedtickets methodddddd', req.query);
  return tickets.find({Assigned_to: req.query.pUser , status: { $ne: "Closed"} }).sort({ticketNo :-1}).exec()
                .then(respondWithResult(res, 200))
            .catch(handleError(res));

};

export function updateticketStatus(req,res){
//  console.log("Server:--> In updateticketStatus method.." , req.body.pmessage.message , "ticketId", req.body.pmessage.curTicketSel);
  var fileName;
  var reqdata ={
  newstatus : req.body.pmessage.newstatus,
  message   : req.body.pmessage.message,
  ticketNo  : req.body.pmessage.curTicketSel,
  userflname: req.body.pmessage.userflname
  }

  if (req.body.pmessage.filedata != undefined) {
      var ext = req.body.pmessage.filedata.name.split(".")[1];
      var fileSize = req.body.pmessage.filedata.size;
      var origString = req.body.pmessage.filedata.content;
      var dd = new Date();
      fileName = dd.toDateString()+ dd.getHours() + dd.getMinutes() + dd.getSeconds()+ dd.getMilliseconds()+'_'+reqdata.ticketNo+'.'+ext;
      var formatString = new Buffer(origString, 'base64');
      var writeStream = gfs.createWriteStream({
          filename: fileName,
          mode: 'w',
          metadata: {
              owner: reqdata.userflname,
              type: 'file',
              email: req.body.pmessage.userflname,
              ticketnumber : reqdata.ticketNo
          }
      });
    writeStream.on('close', function() {     console.log("closing here......");   });
    writeStream.write(formatString);
    writeStream.end();
    }
    reqdata.attachment = fileName;
    tickets.find({'ticketNo': reqdata.ticketNo },function(err,docs){
    docs[0]. status = reqdata.newstatus;
    docs[0].status_cycle.push(reqdata.newstatus);
    return docs[0].save(). then(function(data){
                        //console.log("Updated ticket details-->", data)
                        updatedTicket = data;
                        return createTicketHistory(data,res , reqdata);}
                        )
                  .catch(handleError(res));
});

};

function createTicketHistory(data,res , reqdata) {
//console.log("In Ticket History creation..........", updatedTicket);
     var historydata={
    ticketId : reqdata.ticketNo,
    Action : reqdata.newstatus,
    performed_by : reqdata.userflname,
    description : reqdata.message,
    creationdate: new Date(),
    attachment : reqdata.attachment
  }
  mytickethistories.create(historydata ).then(function(data ){
    notifyStatusUpdatetoUsers( data );
    return res.send({"statuscode": 200 , "data": data});
  })



};

function respondWithUpdateResult(res, statusCode) {
   statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      return res.status(200).json(entity);
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




export function updateticketpriority(req,res){
  console.log("updating tiket priority",req.body);
  var ticketNo = req.body.curTicketSel;
  tickets.find({'ticketNo': ticketNo },function(err,docs){
    docs[0].priority = req.body.p_priority;
    return docs[0].save(). then(respondForCreation(res, 200))
                  .catch(handleError(res));
  });
}

function respondForCreation(res, statusCode) {
   statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      return res.status(200).json(("200"));
    }
  };
};