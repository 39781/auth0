var express 		= require('express');
var router			= express.Router();	 
var fs 				= require("fs");	
var request			= require('request');
var config			= require('./config.js');
var path			= require("path");	
var url 			= require('url');	
const {google}		= require('googleapis');
const key			= require('./testBot.json');
var jwksClient 		= require('jwks-rsa');
var jwt = require('jsonwebtoken');

const { WebhookClient, Text, Card, Payload, Suggestion } = require('dialogflow-fulfillment');
var sessID;

router.post('/botHandler',function(req, res){		
	var responseObj = JSON.parse(JSON.stringify(config.responseObj));
	//console.log(JSON.stringify(req.body));
	var actionName = req.body.queryResult.action;	
	console.log(actionName);	
	const agent = new WebhookClient({request: req, response: res});	
	let intentMap = new Map();	
	var intentsLen = config.intents.length;
	for(i=0;i<intentsLen;i++){
		intentMap.set(config.intents[i],userCheck);
	}
	agent.handleRequest(intentMap);
	sessID = req.body.originalDetectIntentRequest.payload.conversation.conversationId;	
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
	loggedUsers[params.userId] = params	
	tokenVerifier(params.id_token);
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
		agent.add(agent.consoleMessages); 
		//agent.add(new Payload(agent.request_.body.queryResult.fulfillmentMessages));
		/*agent.add(new Text({'text': `people Soft/workday`, 'ssml': `<speak>Hi<break time='5s'/>people Soft/workday</speak>` }));		
		agent.add(new Suggestion('People Soft'));
		agent.add(new Suggestion('Work Day'));*/
	}	
	//agent.setFollowupEvent({name:'welcomeEvent',parameters:{userId :agent.request_.body.originalDetectIntentRequest.payload.user.userId}});
}


function tokenVerifier(idToken){
	var client = jwksClient({
		jwksUri: 'https://exeter.auth0.com/.well-known/jwks.json'
	});
	function getKey(header, callback){
	  client.getSigningKey(header.kid, function(err, key) {
		var signingKey = key.publicKey || key.rsaPublicKey;
		callback(null, signingKey);
	  });
	}
	jwt.verify(idToken, getKey, {algorithms:'RS256',issuer:'https://exeter.auth0.com'}, function(err, decoded) {
		console.log(err);
	  console.log(decoded) // bar
	});
}

/*function sendConfirmation(session){
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
}*/

  
module.exports = router;



			