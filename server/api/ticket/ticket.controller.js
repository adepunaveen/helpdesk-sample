'use strict';

import _ from 'lodash';
import mongoose from 'mongoose';
import ticket from '../ticket/ticket.model';
import ticketHistory from '../ticket/tickethistory.model';
import priority from '../priority/priority.model';
import category from '../category/category.model';
import dataFiles from '../ticket/dataFiles.model';
import Grid from 'gridfs-stream';

var nodemailer = require('nodemailer');

var app = require("../../app.js");
Grid.mongo = mongoose.mongo;
var db = app.dbhndle;
var gfs = new Grid(mongoose.connection.db);

var createdticket = {};
var createdtickethistory = {};


function getmailDetailsFor( pTowhom , pTicketHistory){
        var userticket =  createdticket;
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

          mailSubjectStr =  'Your ' + userticket.type + ' ' + userticket.type[0] + '-' + userticket.ticketNo + ' has been created';
          mailtoWhom =  userticket.owneremail;

          mailBody = 'Your ' + userticket.type + ' ' + userticket.type[0] + '-' + userticket.ticketNo +
          ' has been created. ' + '\n\n' + 'The ' + userticket.type + ' below has been opened at your request.' +
          ' Please review the information for aacuracy and completeness. As your ticket is being investigated, ' +
          'you will receive further updates by email.' ;

          mailBody = mailBody + "<pre> <p style='font-weight:bold;'>" + pTicketHistory.description + "</p> </pre>" ;

         }
        else if (pTowhom == 'Head') {
          var userfullname = userticket.categoryhead.split("@")[0].toUpperCase().charAt(0) + userticket.categoryhead.split("@")[0].split(".")[0].substring(1);
          mailHeader = "<p style='color:blue;font-weight:bold;font-size:150%;'> A Message From MM HelpDesk <br> </p> ";
          mailtitle = mailHeader + '\n\n' + 'Hi ' +  userfullname + ',\n\n';

          mailBody = 'The ' + userticket.type + ' ' + userticket.type[0] + '-' + userticket.ticketNo +
          ' has been created by ' + userticket.owner +' and assigned to you as you are the head of this ' +
          userticket.category + ' BU Group. Currently it is pending with your action. Please assign to your ' +
          ' support team member for resolution. Please check below ticket details.' ;

          mailBody = mailBody + "<pre> <p style='font-weight:bold;'>" + pTicketHistory.description.toString() + "</p> </pre>" ;

          mailSubjectStr =  'New ' + userticket.type + ' ' + userticket.type[0] + '-' + userticket.ticketNo + ' has been created and pending with your action';
          mailtoWhom =  userticket.categoryhead;

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


export function sendticketcreationmail( req,res){
        console.log(" createdtickethistory", createdtickethistory )
        var Mailinfo = getmailDetailsFor('Owner' , createdtickethistory);

        sendMail(Mailinfo[0] ,Mailinfo[1])

       if (Mailinfo[1].to == undefined ) {
        var Mailinfo = getmailDetailsFor('Head' , createdtickethistory);
        // console.log("Comp Mailbody", Mailinfo[0]);

        sendMail(Mailinfo[0] ,Mailinfo[1])
        };
        // sendMail(ownermailBody,ownermailOptions)
        // sendMail(headmailBody,headmailOptions)
      return res.status(200).json(("200"));
}

function notifyticketcreationmail( ){
        // console.log(req.query.ticketinfo)
        // createdticket =  JSON.parse(req.query.ticketinfo.data);
        // createdtickethistory =  JSON.parse(req.query.ticketinfo.ticketHist);


        //console.log("Created Ticket--> ", createdticket);
        //console.log("Created ticket History", createdtickethistory);
        var Mailinfo = getmailDetailsFor('Owner' , createdtickethistory);
        // console.log("Comp Mailbody", Mailinfo[0]);
        //console.log("Mail Options", Mailinfo[1]);

        sendMail(Mailinfo[0] ,Mailinfo[1])

       if (Mailinfo[1].to !== undefined ) {
        var Mailinfo = getmailDetailsFor('Head' , createdtickethistory);
        // console.log("Comp Mailbody", Mailinfo[0]);
        //console.log("Mail Options", Mailinfo[1]);

        sendMail(Mailinfo[0] ,Mailinfo[1])
        };
        // sendMail(ownermailBody,ownermailOptions)
        // sendMail(headmailBody,headmailOptions)
      //return res.status(200).json(("200"));
}

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

}

export function createticket(req,res){
//console.log("in create ticket...");
  var latest_tic;
  var ticketnumber;
  var fileName;// = req.body.filedata.name;
  var email = req.body.useremail;
  var user = req.body.userflname;
return ticket.find({},function(key,value){
          if  (value.length== 0)
            {
              ticketnumber = 1;
          }
          else
          {
            ticketnumber = value[0].ticketNo+1;
          }
          var userdata ={
              ticketNo : ticketnumber,
              owner   : req.body.userflname,
              owneremail: req.body.useremail,
              category:req.body.category,
              subcategory:req.body.subcategory,
              type:req.body.type,
              description:req.body.message.description,
              Assigned_to: "",
              creationdate: new Date(),
              status : "Open",
              status_cycle : ["Created" ,"Assigned to Group"],
              categoryhead : req.body.categoryhead,
              priority : req.body.priority
          }
        //fileName =  ticketnumber.toString() + new Date(year, month, day, hours, minutes, seconds, milliseconds).toString();
      if (req.body.filedata != undefined) {
          var ext = req.body.filedata.name.split(".")[1];
          var fileSize = req.body.filedata.size;
          var origString = req.body.filedata.content;
          var dd = new Date();
          fileName = dd.toDateString()+ dd.getHours() + dd.getMinutes() + dd.getSeconds()+ dd.getMilliseconds()+"_"+userdata.ticketNo+'.'+ext;
        }

      category.find({name : userdata.category},function(key,recs){
          if(recs[0].autoassign==true){
              var execus = recs[0].executives;
              var free_exec;
              var free_exec_ticket_count;
              var countlist = [];
              var ticketcount = [];

              ticket.aggregate([ {$match : { $or  : [{status : "In-Progress"}, {status : "Assigned"}]}},{$group:{ _id : "$Assigned_to", total: {$sum: 1}}}]).then(function(ticket_counts){
                for(var j=0;j<execus.length;j++){
                    var present=-1;
                  /*for(var k=0; k< ticket_counts.length; k++){*/
                    for(var k=0; k< ticket_counts.length; k++){
                      if(ticket_counts[k]._id==execus[j]){
                        present =k;
                      }
                    }
                    if(j==0 && present!=-1){
                    	free_exec = ticket_counts[present]._id;
	                    free_exec_ticket_count = ticket_counts[present].total;
                    }
                    if(present != -1 && ticket_counts[present].total <= free_exec_ticket_count){
                      free_exec = ticket_counts[present]._id;
                      free_exec_ticket_count = ticket_counts[present].total;
                    }
                    else if(present==-1 && ticket_counts[k]!=""){
                       free_exec = execus[j];
                      free_exec_ticket_count = 0;
                    }
                  //}
                }
                  userdata.Assigned_to = free_exec;
                if(userdata.Assigned_to == "" && execus.length > 0){
                  userdata.Assigned_to = execus[0];
                }
                userdata.status = "Assigned";
                userdata.status_cycle = "Assigned to individual";
                  var Mailinfo =  getmailDetailsForAssign (userdata.Assigned_to, userdata )
                  sendMail(Mailinfo[0] ,Mailinfo[1])
                ticket.create(userdata).then(function(data){return createDocument(data,fileName,res, req);}).catch(handleError(res));
              });
            }
            else{
                ticket.create(userdata).then(function(data){return createDocument(data,fileName,res, req);}).catch(handleError(res));
            }
            if (req.body.filedata != undefined) {
                var formatString = new Buffer(origString, 'base64');
                var writeStream = gfs.createWriteStream({
                    filename: fileName,
                    mode: 'w',
                    metadata: {
                        owner: user,
                        type: 'file',
                        email: email,
                        ticketnumber : ticketnumber
                    }
                });
              writeStream.on('close', function() {
                console.log("closing here......");
              });
              writeStream.write(formatString);
              writeStream.end();
          }
        });

}).sort({_id:-1}).limit(1)
};


export function getcategorytickets(req,res){
  return category.find({'categoryhead': req.query.useremail}).exec()
                .then(respondWithRecords(res, 200))
            .catch(handleError(res));

};

export function gettickets(req,res){
  console.log("getting ticket ", req.query.category )
  return ticket.find({'category': {$in : req.query.category}, 'status': { $ne: "Closed"}}).exec()
                .then(respondWithRecords(res, 200))
            .catch(handleError(res));

};

export function getpriorities(req,res){
  return priority.find().exec()
                .then(respondWithRecords(res, 200))
            .catch(handleError(res));
};


function respondWithRecords(res, statusCode) {
   statusCode = statusCode || 200;
  return function(entity) {
  //  console.log(entity)
    if (entity) {
      return res.status(200).json(entity);
    }
  };
};


function createDocument(data,filename,res , req) {
     var historydata={
    ticketId : data.ticketNo,
    Action : ["Created"],
    performed_by : req.body.userflname,
    description : req.body.message.description,
    creationdate: new Date(),
    attachment : filename
  }
  // if (filename != undefined) {
  //   historydata.attachment = filename;
  // }
  createdticket = data;
  ticketHistory.create(historydata). then(function(data){
                        createdtickethistory = data;
                        notifyticketcreationmail();
                        return res.send({"statuscode": 200 , "data": createdticket , "ticketHist": data});
                       })
                     };

function getNextSequence( name ) {
//  console.log('In Next sequence.........', name);
  var ret = ticket.findAndModify(
          {
            query: { _id: name },
            update: { $inc: { seq: 1 } },
            new: true
          }
   );

   return ret.seq;

};

function respondWithResult(res, statusCode) {
  //console.log(res.collection);
  //console.log(res);
   statusCode = statusCode || 200;

  return function(entity) {
    if (entity) {
      return res.status(200).json(("200"));
    }
  };
};

function handleError(res, statusCode) {

  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
};


function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
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


export function updatetickets(req,res){
  console.log("req body ",req.body)
  var tickets = req.body.selectedtickets;
  if ( tickets[0].Assigned_to != "" && tickets[0].status == "Open")
  {
    tickets[0].status = "Assigned";
    tickets[0].status_cycle.push("Assigned to individual");
  }
  ticket.update({ ticketNo: tickets[0].ticketNo }, {$set: tickets[0]}, function(err,numba,rawres){
    var data = tickets[0];
    var Mailinfo =  getmailDetailsForAssign (tickets[0].Assigned_to, tickets[0] )
    sendMail(Mailinfo[0] ,Mailinfo[1])
    var historydata={
      ticketId : data.ticketNo,
      Action : ["Assigned"],
      performed_by : req.body.userflname,
      description : req.body.comments,
      creationdate: new Date(),
    }
//    createdticket = data;
    ticketHistory.create(historydata). then(function(data){
                          //createdtickethistory = data;
  //                        notifyticketcreationmail();
                         /// res.send({"statuscode": 200 , "data": createdticket , "ticketHist": data});
                            return res.status(200).json(("200"));
                         })
//    return createDocument(tickets[0],undefined,res, req); 
  });
  //ticket.create(userdata).then(function(data){return createDocument(data,fileName,res, req);}).catch(handleError(res));

  // var tickets = req.body.mytickets;
  // var counter;
  // for(var i=0 ; i<req.body.mytickets.length;i++)
  //   {
  //     counter = i;
  //     if( tickets[i].Assigned_to != "" && tickets[i].status == "Open"){
  //       tickets[i].status = "Assigned";
  //       tickets[i].status_cycle.push("Assigned to individual");
  //       ticket.update({ ticketNo: tickets[i].ticketNo }, {$set: tickets[i]}, function(err,numba,rawres){
  //         var Mailinfo =  getmailDetailsForAssign (tickets[counter].Assigned_to, tickets[counter] )
  //         sendMail(Mailinfo[0] ,Mailinfo[1])
  //       });
  //     }
  //   }
//   return res.status(200).json(("200"));

}
function getmailDetailsForAssign( pTowhom , pTicket){

        var userticket =  pTicket;
        var userticket = pTicket
        var mailtitle = {};
        var mailBody = {};
        var mailfromString = {};
        var mailHeader = {};
        var MailOptions = {};
        var mailSubjectStr = {};
       // var mailtoWhom = {};
        var userfullname = pTowhom.split("@")[0].toUpperCase().charAt(0) + pTowhom.split("@")[0].split(".")[0].substring(1);

        mailHeader = "<p style='color:blue;font-weight:bold;font-size:150%;'> A Message From MM HelpDesk <br> </p> ";
        mailtitle = mailHeader + '\n\n' + 'Hi ' + userfullname + '\n\n';

        mailSubjectStr =  'Assigning Ticket ' + userticket.type + ' ' + userticket.type[0] + '-' + userticket.ticketNo + ' has been assigned to you';
        //mailtoWhom =  pTowhom;

        mailBody = 'Ticket ' + userticket.type + ' ' + userticket.type[0] + '-' + userticket.ticketNo +
        ' has been created. ' + '\n\n' + 'The ' + userticket.type + ' below has been assigned to you.' +
        ' Please review the information for acuracy and completeness.' + "<br>"+
        'Please take necessary actions to close the ticket.' ;

        mailBody = mailBody + "<pre> <p style='font-weight:bold;'>" + pTicket.description.toString() + "</p> </pre>" ;

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
                            to: pTowhom,
                            subject: 'MMConnect Notification : ' + mailSubjectStr,
                            html: compMailBody
                          };
       return [compMailBody, MailOptions ]
};

export function downloadattachment(req,res){

    var filename = req.body.filename;
    var filenamewithext = "Attachment" +'.'+ filename.split(".")[1];
    var readstream = gfs.createReadStream({
          filename : filename
        });
    const bufs = [];

    readstream.on('data', function (chunk) {
        bufs.push(chunk);
    });

    readstream.on('end', function () {

        const fbuf = Buffer.concat(bufs);
        const base64 = fbuf.toString('base64');

        var data = JSON.stringify ({
            data: base64,
            name: filenamewithext
        });
           res.send(200,data);
    });
};


export function gettickethistories(req,res){
//  console.log(parseInt(req.query.ticketid));
  return ticketHistory.find({'ticketId': parseInt(req.query.ticketid)}).exec()
                .then(respondWithRecords(res, 200))
            .catch(handleError(res));


};
