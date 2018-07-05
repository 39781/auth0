var express 		= require('express');
var router			= express.Router();	 
var fs 				= require("fs");	
var request			= require('request');
var config			= require('./config.js');
var path			= require("path");	
var url 			= require('url');	
const {google}		= require('googleapis');
const key			= require('./testBot.json');
const { WebhookClient, Text } = require('dialogflow-fulfillment');
var sessID ;

router.post('/botHandler',function(req, res){		
	var responseObj = JSON.parse(JSON.stringify(config.responseObj));
	//console.log(JSON.stringify(req.body));
	var actionName = req.body.queryResult.action;	
	console.log(actionName);	
	const agent = new WebhookClient({request: req, response: res});	
	loggedUsers[req.body.originalDetectIntentRequest.payload.user.userId]={'agent':agent}	
	let intentMap = new Map();
	intentMap.set('Default Welcome Intent', welcome);		
	intentMap.set('loginSuccess', loginSucess);		
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
	console.log(params);	
	loggedUsers[params.userId]['empId']=params.empId;
	loggedUsers[params.userId]['token']=params.access_token;

	triggerLoginSucess(loggedUsers[params.userId].agent);
	res.status(200);
	res.json(params).end();
})

var welcome = function(agent){	
	agent.setFollowupEvent({name:'welcomeEvent',parameters:{userId :agent.request_.body.originalDetectIntentRequest.payload.user.userId}});
}

var triggerLoginSucess = function(agent){
	console.log('trigger loginSuccess');
	agent.setFollowupEvent('loginSuccess');
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
	let conv = agent.conv();
    conv.ask('Please choose an item:');
	agent.add(conv);
	console.log('login success');
	//*	  console.log('login sucess',agent);	  
	//agent.add(new Text({'text': `Login Success!`, 'ssml': `<speak>Hi<break time='5s'/>Login Success</speak>` }));	  
}

function sendConfirmation(userId){
	let jwtClient = new google.auth.JWT(
	  key.client_email, null, key.private_key,
	  ['https://www.googleapis.com/auth/actions.fulfillment.conversation'],
	  null
	);
	
	jwtClient.authorize((err, tokens) => {
	  // code to retrieve target userId and intent	  
	  let notif = { 
		userNotification: {
			title: 'AoG tips latest tip',
		},	  
		target: {
		  userId: userId,
		  intent: 'loginSuccess',
		},
	  };	  	  

	  request.post('https://actions.googleapis.com/v2/conversations:send', {
		'auth': {
		  'bearer': tokens.access_token,
		 },
		'json': true,
		'body':{
  "user": {
    "user_id": "ABwppHHN6aTGBrqMEdP7ELuHBpHmQNsDmAvKLgo8MUo-DGXOwFRx3rccPhIDxedp_qLFx_cZScuscWHjUQ",
    "profile": {
      "given_name": "John",
      "family_name": "Doe",
      "display_name": "John Doe"
    }
  },
  "conversation": {
    "conversation_id": "1530684885243",
    "type": "NEW"
  },
  "inputs": [
    {
      "intent": "actions.intent.MAIN",
      "rawInputs": [
        {
          "inputType": "VOICE",
          "query": "login Success"
        }
      ]
    }
  ],
  "surface": {
    "capabilities": [
      {
        "name": "actions.capability.SCREEN_OUTPUT"
      },
      {
        "name": "actions.capability.AUDIO_OUTPUT"
      },
      {
        "name": "actions.capability.WEB_BROWSER"
      },
      {
        "name": "actions.capability.MEDIA_RESPONSE_AUDIO"
      }
    ]
  },
  "isInSandbox": true,
  "availableSurfaces": [
    {
      "capabilities": [
        {
          "name": "actions.capability.SCREEN_OUTPUT"
        },
        {
          "name": "actions.capability.AUDIO_OUTPUT"
        }
      ]
    }
  ]
}
	  }, (err, httpResponse, body) => {
		  console.log(err,body);
		 console.log(httpResponse.statusCode + ': ' + httpResponse.statusMessage);
	  });
	});
}

  
module.exports = router;



			