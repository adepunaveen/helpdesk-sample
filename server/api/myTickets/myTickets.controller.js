'use strict';

import _ from 'lodash';

import mytickethistories from '../ticket/tickethistory.model';
import tickets from '../ticket/ticket.model'
//import mongoose from 'mongoose';
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
var createdticket = {};
var createdtickethistory = {};

//var ObjectId = require('mongodb').ObjectId;
function notifyStatusUpdatetoUsers( pTicketHistory ){

        var Mailinfo = getmailDetailsFor('Owner' , pTicketHistory);
        sendMail(Mailinfo[0] ,Mailinfo[1])

        var Mailinfo = getmailDetailsFor('Head' , pTicketHistory);
        sendMail(Mailinfo[0] ,Mailinfo[1])

        var Mailinfo = getmailDetailsFor('Individual' , pTicketHistory);
        sendMail(Mailinfo[0] ,Mailinfo[1])


}


function getmailDetailsFor( pTowhom , pTicketHistory){

        var userticket =  createdticket;
        var mailtitle = {};
        var mailBody = {};
        var mailfromString = {};
        var mailHeader = {};
        var MailOptions = {};
        var mailSubjectStr = {};
        var mailtoWhom = {};

        if (pTowhom == 'Individual') {
          mailHeader = "<p style='color:blue;font-weight:bold;font-size:150%;'> A Message From MM HelpDesk <br> </p> ";
          mailtitle = mailHeader + '\n\n' + 'Hi '  + '\n\n';

          mailSubjectStr =  'The ' + userticket.type + ' ' + userticket.type[0] + '-' + userticket.ticketNo + ' has been updated with new comments.';
          mailtoWhom =  userticket.Assigned_to;

          mailBody = 'The ticket owner ' + userticket.owner + ' has updated the ticket listed below with additional Information.' +
          ' Please see below and respond accordingly. ' ;

          mailBody = mailBody + "<pre> <p style='font-weight:bold;'>" + pTicketHistory.description.toString() + "</p> </pre>" ;



           }
        else if (pTowhom == 'Head') {
          mailHeader = "<p style='color:blue;font-weight:bold;font-size:150%;'> A Message From MM HelpDesk <br> </p> ";
          mailtitle = mailHeader + '\n\n' + 'Hi '  + '\n\n';

          mailBody = 'The ticket owner ' + userticket.owner + ' has updated the ticket listed below with additional Information.' +
          ' Please see below and respond accordingly. ' ;
          mailBody = mailBody + "<pre> <p style='font-weight:bold;'>" + pTicketHistory.description.toString() + "</p> </pre>" ;


          mailSubjectStr =  'The ' + userticket.type + ' ' + userticket.type[0] + '-' + userticket.ticketNo + ' has new comments';
          mailtoWhom =  userticket.categoryhead;

          }
          else if (pTowhom == 'Owner') {
          mailHeader = "<p style='color:blue;font-weight:bold;font-size:150%;'> A Message From MM HelpDesk <br> </p> ";
          mailtitle = mailHeader + '\n\n' + 'Hi '  + '\n\n';

          mailBody = 'Your ' + userticket.type + ' ' + userticket.type[0] + '-' + userticket.ticketNo +
          ' listed below has been updated with new additional comments. ' + '\n\n' +
           ' Please see below. ' ;
          mailBody = mailBody + "<pre> <p style='font-weight:bold;'>" + pTicketHistory.description.toString() + "</p> </pre>" ;

          mailSubjectStr =  'The ' + userticket.type + ' ' + userticket.type[0] + '-' + userticket.ticketNo + ' has new comments';
          mailtoWhom =  userticket.owneremail;

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
      //    console.log('Message sent: ' + info.response);
      };
      transporter.close();
  });

};

export function getmyTickets(req,res){

  //console.log('Server:--> in getmyTickets methodddddd', req.query.useremail);
  // { owneremail: req.query.pUser.useremail }
  return tickets.find( { owneremail: req.query.useremail} ).sort({ticketNo :-1}).exec()
                .then(respondWithResult(res, 200))
            .catch(handleError(res));

};

export function getmyTickethistories(req,res){
  //console.log('Server:--> in getmyTickethistories methodddddd');

  return mytickethistories.find( {ticketId: Number( req.query.pvalue) }    ).exec()
                .then(respondWithResult(res, 200))
            .catch(handleError(res));

};

export function createTickethistory(req,res){
//   console.log("in create ticket.......",req.body.pmessage);
  createdticket = req.body.pmessage.ticketinfo;
  var fileName;
  var historydata={
    ticketId : Number(req.body.pmessage.curTicketSel),
    Action : ["Commented"],
    performed_by :req.body.pmessage.userflname,
    description : req.body.pmessage.message,
    creationdate: new Date(),
  }
  if (req.body.pmessage.filedata != undefined) {
      var ext = req.body.pmessage.filedata.name.split(".")[1];
      var fileSize = req.body.pmessage.filedata.size;
      var origString = req.body.pmessage.filedata.content;
      var dd = new Date();
      fileName = dd.toDateString()+ dd.getHours() + dd.getMinutes() + dd.getSeconds()+ dd.getMilliseconds()+'_'+historydata.ticketId+'.'+ext;
      var formatString = new Buffer(origString, 'base64');
      var writeStream = gfs.createWriteStream({
          filename: fileName,
          mode: 'w',
          metadata: {
              owner: historydata.userflname,
              type: 'file',
              email: req.body.pmessage.useremail,
              ticketnumber : historydata.ticketId
          }
      });
    historydata.attachment = fileName;
  //  console.log(" showing history data..",historydata);
    writeStream.on('close', function() {     console.log("closing here......");   });
    writeStream.write(formatString);
    writeStream.end();
    }
    if (req.body.pmessage.selectedticket.status == 'Query' ) {
        req.body.pmessage.selectedticket.status = "In-Progress"; 
        var tickettoupdate = req.body.pmessage.selectedticket;
        tickets.update({ ticketNo: tickettoupdate.ticketNo }, {$set: tickettoupdate}, function(err,numba,rawres){
          mytickethistories.create(historydata).then(respondWithCreateResult(res, 200)).catch(handleError(res));
        });
    }
    else{
      mytickethistories.create(historydata).then(respondWithCreateResult(res, 200)).catch(handleError(res));
    }
};

function respondWithCreateResult(res, statusCode) {
   statusCode = statusCode || 200;
   //console.log('in respokindwith result of CreateTicketHistory' , statusCode)
  return function(entity) {
    if (entity) {
      //console.log('In entity of create ticket history')
      notifyStatusUpdatetoUsers( entity );
      return res.send({"statuscode": 200 , "data": entity}); // status(200).json({]"200");
    }
  };
};

function respondWithResult(res, statusCode) {
   statusCode = statusCode || 200;
   //console.log('in respokindwith result of CreateTicketHistory' , statusCode)
  return function(entity) {
    if (entity) {
      //console.log('In entity of create ticket history')
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
