'use strict';

import _ from 'lodash';
import ticket from '../ticket/ticket.model';
import schedulemodel from '../schedule/schedule.model';
import tickethistory from '../ticket/tickethistory.model';
var nodemailer = require('nodemailer');
var schedule = require('node-schedule');

var rule = new schedule.RecurrenceRule();
var closerule = new schedule.RecurrenceRule();
var looprule = new schedule.RecurrenceRule();
var autocloserule = new schedule.RecurrenceRule();
var querystaterule = new schedule.RecurrenceRule();


var highpriorityopendays = 2;
var mediumprorityopendays = 3;
var lowpriorityopendays  = 4;
var querynotificationdays = 2;
var highclosedays=4;
var mediumclosedays=5;
var lowclosedays=6;
var autoclosedays  = 2;

rule.minute = new schedule.Range(0, 59, 24*60);
closerule.minute = new schedule.Range(0, 59, 24*60);
looprule.minute = new schedule.Range(0, 59, 10);
// for 2 days
autocloserule.minute = new schedule.Range(0,59,24*60);

querystaterule.minute = new schedule.Range(0,59,1);

export function updatescheduletime(req,res){
  intialisevalues(req,res);
  return res.status(200).json(("200"));
}

export function intialisevalues(req,res){
 	var tabledata = [];
	tabledata .push({  	"name" : "highpriorityopendays",
									"days" : req.body.opendaysforhigh
								});
	tabledata .push({  	"name" : "mediumpriorityopendays",
									"days" : req.body.opendaysformedium
								});
	tabledata .push({  	"name" : "lowpriorityopendays",
									"days" : req.body.opendaysforlow
								});
	tabledata .push({  	"name" : "highclosedays",
									"days" : req.body.daysforhigh
								});
	tabledata .push({  	"name" : "mediumclosedays",
									"days" : req.body.daysformedium
								});
	tabledata .push({  	"name" : "lowclosedays",
									"days" : req.body.daysforlow
								});
  tabledata .push({   "name" : "querynotificationdays",
                  "days" : req.body.querynotificationdays
                });
  tabledata .push({   "name" : "autoclosedays",
                  "days" : req.body.autoclosedays
                });

schedulemodel.find({ },function(key,value){
			if (value.length == 0) {
				 schedulemodel.create(tabledata)
         //reintialise();
//                      .then(reintialise(res))
//                      .then(respondForCreation(res, 200))
//			                    .catch(handleError(res));
					}
		 else {
						 schedulemodel.remove({},function(){
								schedulemodel.create(tabledata);
               // reintialise();
						})
			}
///	

	});
}

// Schduler for auto closing tickets which are in completed state.
schedule.scheduleJob(autocloserule, function(){

  var current_day = new Date();
  console.log("auto close rule is running")
  var ticketrec;
  var autoclosedayss=2;
  schedulemodel.find({"name" : "autoclosedays"},function(schedule_key,schedule_rec){
    autoclosedayss = schedule_rec[0].days;
    ticket.find({ status : 'Completed'},function(key,value){
      ticketrec = value[0];
      for(var i=0 ; i < value.length;i++){
            tickethistory.find({ "ticketId" : value[i].ticketNo},function(historykey,historyvalues){
              var diff = date_diff_indays (historyvalues[0].creationdate,current_day);
              if(diff >= autoclosedayss){
                  var historydata={
                    ticketId : historyvalues[0].ticketId,
                    Action : "Closed",
                    performed_by : "Auto-Close",
                    description : "Ticket has been auto-closed",
                    creationdate: new Date(),
                  }
                  ticketrec.status = "Closed";
                  ticket.find({'ticketNo': ticketrec.ticketNo },function(ticketkey,ticketvalue){
                    ticketvalue[0].status = "Closed";
                    ticketvalue[0].save();
                    var Mailinfo = getmailDetailsForAutoclosing(ticketvalue[0]);
                    sendMail(Mailinfo[0] ,Mailinfo[1]);
                  });
            //      tickethistory.create(historydata);
              }
          }).sort({_id:-1}).limit(1);
        }
   });
  });
});


schedule.scheduleJob(querystaterule, function(){
  
	var current_day = new Date()
	var current_ticket;
  var querynotificationdayss;

  schedulemodel.find({name : "autoclosedays"},function(schedule_key,schedule_rec){
    querynotificationdayss = schedule_rec[0].days;
  	 ticket.find({ status : 'Query'},function(ticketskey,tickets){
  	 	for (var i =0 ; i < tickets.length; i++) {		 	
  		 	if (tickets[i].status == 'Query') {
  		 		current_ticket = tickets[i];
  		 		tickethistory.find({ticketId : tickets[i].ticketNo},function(tickethistorykey,tickethistories){
  	 			 	if(tickethistories.length > 0 && tickethistories[0].Action == "Query" && 
  	 			 		date_diff_indays( tickethistories[0].creationdate,current_day) >= querynotificationdayss ){
  	 				 	var Mailinfo = getmailDetailsForQuery (current_ticket)
  		 			 	sendMail(Mailinfo[0] ,Mailinfo[1]);
  		 			}
  		 		}).sort({_id:-1}).limit(1);
  		 	}	
  	 	}
  	 });
  });




});

	// Initial notifications......
schedule.scheduleJob(rule, function(){
 schedulemodel.find({},function(schedule_key,schedule_rec){
    for (var i = 0; i < schedule_rec.length; i++) {
        if (schedule_rec[i].name == "highpriorityopendays") {
          highpriorityopendays = schedule_rec[i].days;
        }else if (schedule_rec[i].name == "mediumprorityopendays") {
          mediumprorityopendays = schedule_rec[i].days;
        }else if (schedule_rec[i].name == "lowpriorityopendays") {
          lowpriorityopendays = schedule_rec[i].days;
        }
    }

	  ticket.find({ status : 'Open'},function(key,value){
      // Sending mails to Heads for ticket assignment.
      for(var i=0 ; i < value.length;i++){
      	var current_day = new Date()
        var diff = date_diff_indays (value[i].creationdate,current_day);
    		if( (value[i].priority == 'High') & (diff >= highpriorityopendays )){
    			// sending mail of high priority ticket to make status as assign.
    			var Mailinfo = getmailDetailsFor('Head',value[i]);
    	        sendMail(Mailinfo[0] ,Mailinfo[1]);
    		}
    		else if((value[i].priority == 'Medium') & (diff >= mediumprorityopendays )){
    			// sending mail of medium priority ticket to make status as assign.
    	        var Mailinfo =	getmailDetailsFor('Head',value[i])
    	        sendMail(Mailinfo[0] ,Mailinfo[1])
    		}
    		else if((value[i].priority == 'Low') & (diff >= lowpriorityopendays )){
    			// sending mail of low priority ticket to make status as assign.
    		    var Mailinfo =	getmailDetailsFor('Head',value[i])
    	        sendMail(Mailinfo[0] ,Mailinfo[1])
    		}
      }
	  });
  });
});

	//  Complete notifications......
schedule.scheduleJob(closerule, function(){
  schedulemodel.find({},function(schedule_key,schedule_rec){
     for (var i = 0; i < schedule_rec.length; i++) {
        if (schedule_rec[i].name == "highclosedays") {
          highclosedays = schedule_rec[i].days;
        }else if (schedule_rec[i].name == "mediumclosedays") {
          mediumclosedays = schedule_rec[i].days;
        }else if (schedule_rec[i].name == "lowclosedays") {
          lowclosedays = schedule_rec[i].days;
        }
      }
  	ticket.find({ status : 'In Progress'},function(key,value){
        var current_day = new Date()
   	    for(var i=0 ; i < value.length;i++){
  			/*sending mail notifications for closing tickets.*/
          var diff = date_diff_indays (value[i].creationdate,current_day);
  			if( (value[i].status == 'High') & (diff >= highclosedays )){
  				// sending mail of high priority ticket to close ticket.
  		        var Mailinfo =	getmailDetailsForclosing('executive',value[i])
  		        sendMail(Mailinfo[0] ,Mailinfo[1])
  			}
  			else if((value[i].status == 'Medium') & (diff >= mediumclosedays )){
  				// sending mail of medium priority ticket to close ticket.
  		        var Mailinfo =	getmailDetailsForclosing('executive',value[i])
  		        sendMail(Mailinfo[0] ,Mailinfo[1])
  			}
  			else if((value[i].status == 'Low') & (diff >= lowclosedays )){
  				// sending mail of low priority ticket to close ticket.
  				console.log("sending mail for low priority.....")
  			}
  		}
  	});
  });



});


	//  Continous notifications......
schedule.scheduleJob(looprule, function(){

  schedulemodel.find({},function(schedule_key,schedule_rec){
    for (var i = 0; i < schedule_rec.length; i++) {
        if (schedule_rec[i].name == "highclosedays") {
          highclosedays = schedule_rec[i].days;
        }else if (schedule_rec[i].name == "mediumclosedays") {
          mediumclosedays = schedule_rec[i].days;
        }
    }
    ticket.find({ status : 'In Progress'},function(key,value){
      var current_day = new Date()
 	    for(var i=0 ; i < value.length;i++){
			/*sending mail notifications for closing tickets.*/
          var diff = date_diff_indays (value[i].creationdate,current_day);
  			if( (value[i].status == 'High') & (diff > highclosedays )){
  				// sending mail of high priority ticket to close ticket.
  			 	var Mailinfo =	getmailDetailsFor('executive',value[i])
  		        sendMail(Mailinfo[0] ,Mailinfo[1])
  				//sendNotificationMail()
  			}
  			else if((value[i].status == 'Medium') & (diff > mediumclosedays )){
  				// sending mail of medium priority ticket to close ticket.
  			 	var Mailinfo =	getmailDetailsFor('executive',value[i])
  		        sendMail(Mailinfo[0] ,Mailinfo[1])
  				console.log("sending mail for medium priority.....")
  			 }
  		}
	 });
  });
});




function getmailDetailsFor( pTowhom ,ticketinfo){

        var userticket = ticketinfo;
        var mailtitle = {};
        var mailBody = {};
        var mailfromString = {};
        var mailHeader = {};
        var MailOptions = {};
        var mailSubjectStr = {};
        var mailtoWhom = {};
        if (pTowhom == 'executive') {
          mailHeader = "<p style='color:blue;font-weight:bold;font-size:150%;'> A Message From MM HelpDesk <br> </p> ";
          mailtitle = mailHeader + '\n\n' + 'Hi ' + userticket.owner + '\n\n';

          mailSubjectStr =   userticket.type[0] + '-' + userticket.ticketNo + ' Status';
          mailtoWhom =  userticket.Assigned_to;

          mailBody = 'Your Assigned ' + userticket.type + ' ' + userticket.type[0] + '-' + userticket.ticketNo +
          ' has not been updated. ' + '\n\n' + 'The ' + userticket.type + ' below has been assigned at your bucket.' +
          ' Please review the information and close the ticket. ' ;

          mailBody = mailBody + "<pre> <p style='font-weight:bold;'>" + ticketinfo.description.toString() + "</p> </pre>" ;

         }
        else if (pTowhom == 'Head') {
          mailHeader = "<p style='color:blue;font-weight:bold;font-size:150%;'> A Message From MM HelpDesk <br> </p> ";
          mailtitle = mailHeader + '\n\n' + 'Hi ' + userticket.categoryhead.split('.')[0].toUpperCase() + ',\n\n';

          mailBody = 'The ' + userticket.type + ' ' + userticket.type[0] + '-' + userticket.ticketNo +
          ' has been created by ' + userticket.owner +' on '+userticket.creationdate +' and it is assigned to you as you are the head of this ' +
          userticket.category + ' BU Group. Currently it is pending with your action. Please assign to your ' +
          ' support team member for resolution. Please check below ticket details.' ;

          mailBody = mailBody + "<pre> <p style='font-weight:bold;'>" + ticketinfo.description.toString() + "</p> </pre>" ;

          mailSubjectStr =   userticket.type + ' ' + userticket.type[0] + '-' + userticket.ticketNo + ' has been created and pending with your action';
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
function getmailDetailsForQuery(ticketinfo){

        var userticket = ticketinfo;
        var mailtitle = {};
        var mailBody = {};
        var mailfromString = {};
        var mailHeader = {};
        var MailOptions = {};
        var mailSubjectStr = {};
        var mailtoWhom = {};
///        else if (pTowhom == 'Head') {
        mailHeader = "<p style='color:blue;font-weight:bold;font-size:150%;'> A Message From MM HelpDesk <br> </p> ";
        mailtitle = mailHeader + '\n\n' + 'Hi ' + userticket.categoryhead.split('.')[0].toUpperCase() + ',\n\n';

        mailBody = 'The ' + userticket.type + ' ' + userticket.type[0] + '-' + userticket.ticketNo +
        ' has been in Query state. Please respond for further processing';
//        mailBody = mailBody + "<pre> <p style='font-weight:bold;'>" + ticketinfo.description.toString() + "</p> </pre>" ;

        mailSubjectStr =   userticket.type + ' ' + userticket.type[0] + '-' + userticket.ticketNo + ' Auto-Closed';
        mailtoWhom = userticket.Assigned_to +','+ userticket.owneremail;

  //        };

        mailfromString = "<p> Sincerely, <br> MagikMinds HELP desk </p>";

        var compMailBody = mailtitle + "<br>" + "<br>" +  mailBody + "<br>" + "<br>"  + mailfromString;

        MailOptions = {     from: 'mmconnectemail@gmail.com',
                            to: mailtoWhom,
                            subject: 'MMConnect Notification : ' + mailSubjectStr,
                            html: compMailBody
                          };

       return [compMailBody, MailOptions ]


};

function getmailDetailsForAutoclosing(ticketinfo){

        var userticket = ticketinfo;
        var mailtitle = {};
        var mailBody = {};
        var mailfromString = {};
        var mailHeader = {};
        var MailOptions = {};
        var mailSubjectStr = {};
        var mailtoWhom = {};
///        else if (pTowhom == 'Head') {
        mailHeader = "<p style='color:blue;font-weight:bold;font-size:150%;'> A Message From MM HelpDesk <br> </p> ";
        mailtitle = mailHeader + '\n\n' + 'Hi ' + userticket.categoryhead.split('.')[0].toUpperCase() + ',\n\n';

        mailBody = 'The ' + userticket.type + ' ' + userticket.type[0] + '-' + userticket.ticketNo +
        ' has been Auto-Closed.';
//        mailBody = mailBody + "<pre> <p style='font-weight:bold;'>" + ticketinfo.description.toString() + "</p> </pre>" ;

        mailSubjectStr =   userticket.type + ' ' + userticket.type[0] + '-' + userticket.ticketNo + ' Auto-Closed';
        mailtoWhom =  userticket.categoryhead + ',' + userticket.owneremail+','+userticket.Assigned_to;

  //        };

        mailfromString = "<p> Sincerely, <br> MagikMinds HELP desk </p>";

        var compMailBody = mailtitle + "<br>" + "<br>" +  mailBody + "<br>" + "<br>"  + mailfromString;

        MailOptions = {     from: 'mmconnectemail@gmail.com',
                            to: mailtoWhom,
                            subject: 'MMConnect Notification : ' + mailSubjectStr,
                            html: compMailBody
                          };

       return [compMailBody, MailOptions ]


};
function getmailDetailsForclosing( pTowhom ,ticketinfo){

        var userticket = ticketinfo;
        var mailtitle = {};
        var mailBody = {};
        var mailfromString = {};
        var mailHeader = {};
        var MailOptions = {};
        var mailSubjectStr = {};
        var mailtoWhom = {};
        if (pTowhom == 'executive') {
          mailHeader = "<p style='color:blue;font-weight:bold;font-size:150%;'> A Message From MM HelpDesk <br> </p> ";
          mailtitle = mailHeader + '\n\n' + 'Hi ' + userticket.owner + '\n\n';

          mailSubjectStr =   userticket.type[0] + '-' + userticket.ticketNo + ' Status';
          mailtoWhom =  userticket.Assigned_to;

          mailBody = 'Your Assigned ' + userticket.type + ' ' + userticket.type[0] + '-' + userticket.ticketNo +
          ' has not been updated. ' + '\n\n' + 'The ' + userticket.type + ' below has been assigned at your bucket.' +
          '  Since ticket has not been closed. Please review and close. ' ;

          mailBody = mailBody + "<pre> <p style='font-weight:bold;'>" + ticketinfo.description.toString() + "</p> </pre>" ;

         }
        else if (pTowhom == 'Head') {
          mailHeader = "<p style='color:blue;font-weight:bold;font-size:150%;'> A Message From MM HelpDesk <br> </p> ";
          mailtitle = mailHeader + '\n\n' + 'Hi ' + userticket.categoryhead.split('.')[0].toUpperCase() + ',\n\n';

          mailBody = 'The ' + userticket.type + ' ' + userticket.type[0] + '-' + userticket.ticketNo +
          ' has been created by ' + userticket.owner +' on '+userticket.creationdate +' . It has been crossed the Ticket closing date. '+
          +' Please allocate team to close the ticket.' ;
          mailBody = mailBody + "<pre> <p style='font-weight:bold;'>" + ticketinfo.description.toString() + "</p> </pre>" ;

          mailSubjectStr =   userticket.type + ' ' + userticket.type[0] + '-' + userticket.ticketNo + ' has been created and pending with your action';
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








var date_diff_indays = function(date1, date2) {

return Math.floor((Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate()) - Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate()) ) /(1000 * 60 * 60 * 24));

}

export function donothing(req,res){
}



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
function respondForCreation(res, statusCode) {
   statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      return res.status(200).json(("200"));
    }
  };
};

export function getscheduledays(req,res){
  console.log("sending repsnse")
	  return schedulemodel.find({}).exec()
              .then(respondWithResult(res, 200))
	            .catch(handleError(res));

};
