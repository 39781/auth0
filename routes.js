var express 		= require('express');
var router			= express.Router();	 
var fs 				= require("fs");	
var request			= require('request');
var config			= require('./config.js');
var path			= require("path");	
var url 			= require('url');	
const {google}		= require('googleapis');
const key			= require('./testBot.json');
const { WebhookClient, Text, Card, Payload, Suggestion } = require('dialogflow-fulfillment');
var sessID ;

router.post('/botHandler',function(req, res){		
	var responseObj = JSON.parse(JSON.stringify(config.responseObj));
	//console.log(JSON.stringify(req.body));
	var actionName = req.body.queryResult.action;	
	console.log(actionName);	
	const agent = new WebhookClient({request: req, response: res});	
	let intentMap = new Map();	
	intentMap.set('Default Welcome Intent',userCheck);			
	intentMap.set('peopleSoft', userCheck);
	intentMap.set('workDay', userCheck);			
	agent.handleRequest(intentMap);
	sessID = req.body.originalDetectIntentRequest.payload.conversation.conversationId;
	/*if(actionName == 'input.loginSucess'){				
			
		console.log('loginSuccess');		
	}else{
		agent = new WebhookClient({request: req, response: res});		
		let intentMap = new Map();
		intentMap.set('Default Welcome Intent', welcome);		
		intentMap.set('loginSuccess', loginSucess);		
		agent.handleRequest(intentMap);
		sessID = req.body.originalDetectIntentRequest.payload.conversation.conversationId;
		switch(actionName){		
			case 'input.welcome':func = welcome;break;	
		}
		func(req.body,responseObj)
		.then(function(result){
			console.log(result);
			console.log(JSON.stringify(result));
			res.json(result).end();
		})
	}*/

});	

router.post('/validateUser',function(req, res){
	var accDet = {};
	if(typeof(config.employees[req.body.username])=='undefined'){
		res.status(400);
		res.json({status:'invalid user'}).end();		
	}else{
		accDet['domainName'] = config.appDet.domainName;
		accDet['clientID'] = config.appDet.clientID,
		accDet['phoneNumber'] = config.employees[req.body.username].ph;
		accDet['redirectUri'] = config.appDet.redirectUri;
		console.log({status:'valid user','accDet':accDet});
		res.status(200);
		res.json({status:'valid user','accDet':accDet}).end();
	}
})

router.get('/redirectUri',function(req,res){	
	res.redirect('https://logintests.herokuapp.com/redirectPage.html?empid='+req.query.empId+'&userId='+req.query.userId);	
});

router.post('/accessToken',function(req, res){
	console.log(req.body.url);
	var params = url.parse(req.body.url, true).query;	
	loggedUsers[params.userId] = {
		'empId':params.empId,
		'token':params.access_token
	};			
	res.status(200);
	res.json(params).end();
})

var userCheck = function(agent){		
	console.log(JSON.stringify(agent.request_.body));
	var uid = agent.request_.body.originalDetectIntentRequest.payload.user.userId;
	if(typeof(loggedUsers[uid])=='undefined'){
		agent.add(new Text({'text': `Welcome to Hexa Hema!`, 'ssml': `<speak>Hi<break time='5s'/>Welcome to Hexa Hema</speak>` }));
		agent.add(new Card({
			title: 'Login ',		
			text: 'Please click login to get access me',
			buttonText: 'Login', 
			buttonUrl: 'https://logintests.herokuapp.com/login.html?userId='+agent.request_.body.originalDetectIntentRequest.payload.user.userId
		}));
		agent.add(new Suggestion('People Soft'));
		agent.add(new Suggestion('Work Day'));
	}else{		
		agent.add(new Text({'text': `people Soft/workday`, 'ssml': `<speak>Hi<break time='5s'/>people Soft/workday</speak>` }));		
		agent.add(new Suggestion('People Soft'));
		agent.add(new Suggestion('Work Day'));
	}	
	//agent.setFollowupEvent({name:'welcomeEvent',parameters:{userId :agent.request_.body.originalDetectIntentRequest.payload.user.userId}});
}

var triggerLoginSucess = function(agent){
	console.log('trigger loginSuccess');
	agent.setFollowupEvent('loginSuccessEvent');
}
/*var welcome = function(req, responseObj){
	return new Promise(function(resolve,reject){
		responseObj= {
				"fulfillmentText": '',
				"followupEventInput":{
					"name":"welcomeEvent",
					"parameters":{ 						
						userId :req.originalDetectIntentRequest.payload.user.userId,						
					}
				}
			}
			resolve(responseObj);		
	});
}
*/

function loginSucess(agent) {  
	console.log('login success');
	let conv = agent.conv();
    conv.ask('Please choose an item:');
	agent.add(conv);
	
	//*	  console.log('login sucess',agent);	  
	//agent.add(new Text({'text': `Login Success!`, 'ssml': `<speak>Hi<break time='5s'/>Login Success</speak>` }));	  
}

function sendConfirmation(session){
	let jwtClient = new google.auth.JWT(
	  key.client_email, null, key.private_key,
	  ['https://www.googleapis.com/auth/cloud-platform'],
	  null
	);	
	//https://actions.googleapis.com/v2/conversations:send
	jwtClient.authorize((err, tokens) => {	 
	  request.post(config.dialogFlowAPI.replace('sessions', session), {
		'auth': {
		  'bearer': tokens.access_token,
		 },
		'json': true,
		'body':{"queryInput":{"event":{"name":"loginSuccessEvent","languageCode":"en"}}}
	  }, (err, httpResponse, body) => {
		  console.log(err,body);
		 console.log(httpResponse.statusCode + ': ' + httpResponse.statusMessage);
	  });
	});
}

  
module.exports = router;



			