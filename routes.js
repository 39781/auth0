var express 		= require('express');
var router			= express.Router();	 
var fs 				= require("fs");	
var request			= require('request');
var config			= require('./config.js');
var path			= require("path");	
var url 			= require('url');	
const {google}		= require('googleapis');
const key			= require('./testBot.json');
const auth0		 = require('./utilities/auth0.js');
const jwtMiddleware = require('express-jwt')
var jwksClient 		= require('jwks-rsa');
const {dialogflow,Suggestions,SimpleResponse} = require('actions-on-google');
const { WebhookClient, Text, Card, Payload, Suggestion } = require('dialogflow-fulfillment');
var sessID;

const apps = dialogflow({debug:true});

router.use('/auth0', jwtMiddleware({
  secret: jwksClient.expressJwtSecret({
			cache: true,
			rateLimit: true,
			jwksRequestsPerMinute: 5,
			jwksUri: config.appDet.jwksUri
		  }), 
  getToken: function (req) {
	  console.log('headers',req.headers)
    if (req.headers.authorization){
		var auth = req.headers.authorization.split(' ');
		if(auth[0] === 'Bearer'){
			return auth[1];
		}else{
			return null;
		}			
    } else if (req.query && req.query.token) {
		return req.query.token;
      return req.query.token;
    } else if (req.cookies && req.cookies.token) {      
      return req.cookies.token;
    }    
    return null; 
  }
}));

router.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('your are not authorized person to get information. please login to get authorization');
  }
});

router.post('/auth0/psMicroService', function(req,res){
	console.log(req.body);
	request.get(req.body.api, {'json': true}, (err, httpResponse, body) => {
		 if(err){
			 console.log('err',err);
			 res.json(err).end();
		 }else{
			 res.json(body).end();
		 }		 
	});
});
router.post('/auth0/wdMicroService', function(req,res){
	console.log(req.body);
	request.get(req.body.api, {'json': true}, (err, httpResponse, body) => {
		 if(err){
			 console.log('err',err);
			 res.json(err).end();
		 }else{
			 res.json(body).end();
		 }		 
	});
});
router.post('/auth0/artMicroService', function(req,res){
	console.log(req.body);
	request.get(req.body.api, {'json': true}, (err, httpResponse, body) => {
		 if(err){
			 console.log('err',err);
			 res.json(err).end();
		 }else{
			 res.json(body).end();
		 }		 
	});
});
router.post('/auth0/snowMicroService', function(req,res){
	console.log(req.body);
	request.get(req.body.api, {'json': true}, (err, httpResponse, body) => {
		 if(err){
			 console.log('err',err);
			 res.json(err).end();
		 }else{
			 res.json(body).end();
		 }		 
	});
});


router.post('/botHandler',function(req, res){		
	var responseObj = JSON.parse(JSON.stringify(config.responseObj));
	//console.log(JSON.stringify(req.body));
	var actionName = req.body.queryResult.action;	
	console.log(actionName);	
	const agent = new WebhookClient({request: req, response: res});		
	var intentMap = new Map();	
	var intentsLen = config.intents.length;
	for(i=0;i<intentsLen;i++){	
		intentMap.set(config.intents[i],userCheck);
	}
	//console.log(intentMap);
	agent.handleRequest(intentMap);	
	apps.intent('Default Welcome Intent',(conv)=>{
		conv.ask(new SimpleResponse({
			speech: 'test',
			text: 'test',
	  }));
	})
});	


router.post('/validateUser',function(req, res){
	var accDet = {};
	/*var adConfig = JSON.parse(JSON.stringify(config.adCred));
		adConfig['user'] ={
			username : req.body.username,
			password : req.body.passwd
		};			
	auth0.authenticateAD(adConfig)*/
	var adConfig = JSON.parse(JSON.stringify(config.adAuthObj));
		adConfig['username'] = req.body.username;
		adConfig['password'] = req.body.passwd;		
	auth0.authenticateAuth0AD(adConfig,config.auth0ADlogin)
	.then(function(result){
		console.log('result',result);
		if(!result){
			res.status(400);
			res.json({status:'invalid user'}).end();
		}else{
			accDet['domainName'] = config.appDet.domainName;
			accDet['clientID'] = config.appDet.clientID,
			accDet['phoneNumber'] = config.employees[req.body.username.toLowerCase()].ph;
			accDet['redirectUri'] = config.appDet.redirectUri;
			console.log({status:'valid user','accDet':accDet});
			res.status(200);
			res.json({status:'valid user','accDet':accDet}).end();
		}
	})
	.catch(function(err){
		console.log('err',err);
		res.status(400);
		res.json({status:'Technical Issue'}).end();
	});	
})

router.get('/redirectUri',function(req,res){	
	res.redirect('https://logintests.herokuapp.com/redirectPage.html?sno='+req.query.sno+'&empId='+req.query.empId+'&userId='+req.query.userId);	
});


router.post('/generateAccessToken',function(req, res){
	console.log(req.body.url);
	var params = url.parse(req.body.url, true).query;
	loggedUsers[params.userId] = params		
	auth0.generateToken(config.microServicesApis.common, config.appDet.tokenEndPoint)
	.then(function(result){
		console.log(result);
		loggedUsers[params.userId]['access_token'] = result.access_token;
		res.status(200);
		res.send('close');
		res.end();
	})
	.catch(function(err){
		res.status(400);
		res.send("Authentication failed due to some technical issue. Try again later");
		res.end();
	});
	/*if(params.sno==2){
		loggedUsers[params.userId]['access_token'] = params.access_token;		
		console.log(loggedUsers[params.userId]);
		console.log('redirecurl',redirectUrl);
		testAccessTokenValidation(params.access_token,config.apis[0]);
		res.header('content-type','text/plain');
		res.status(200);
		res.json(redirectUrl).end();
	}else{
		loggedUsers[params.userId] = params	
		
		
		redirectUrl = config.appDet.authorize+'?scope='+config.appDet.scope+'&audience='+config.appDet.audience+'&response_type='+config.appDet.responseType+'&client_id='+config.appDet.clientID+'&redirect_uri='+encodeURIComponent("https://logintests.herokuapp.com/redirectUri?sno=2&empId="+params.empId+"&userId="+params.userId)+'&nonce='+params.access_token+'&prompt=none';
		
		console.log(redirectUrl);		
		res.header('content-type','text/plain');
		res.status(200);
		res.send(redirectUrl);
		res.end();
	}
	console.log(params);		
			
	//tokenVerifier(params.id_token,);
	*/	
})
//https://github.com/actions-on-google/dialogflow-facts-about-google-nodejs/blob/master/functions/index.js
var testAccessTokenValidation = function(token, peopleSoftAPI){
	request.post('https://logintests.herokuapp.com/auth0/callAPI', {
		'auth': {
		  'bearer': token
		 },
		'json': true,
		'body':{api:peopleSoftAPI}
		}, (err, httpResponse, body) => {
		  console.log(err,body);
		 console.log(httpResponse.statusCode + ': ' + httpResponse.statusMessage);
	});
}

var userCheck = function(agent){		
	console.log(JSON.stringify(agent.request_.body));
	var uid = agent.request_.body.originalDetectIntentRequest.payload.user.userId;
	if(typeof(loggedUsers[uid])!='undefined'){
		var options = {
			idToken:loggedUsers[uid].id_token,
			issuer:config.appDet.issuer,
			audience:config.appDet.audience			
		};
		if(auth0.tokenVerifier(options)){
			if(agent.request_.body.queryResult.action == 'input.welcome'){
				agent.setFollowupEvent("gotoMenu");
			}else{
				agent.add(agent.consoleMessages); 
			}							
			return;
		}
		textResp = 'You are not a authorized user, please login'
	}else{
		agent.setFollowupEvent({ "name": "mainMenu", "parameters" : { 
			text:"Hi I'm Hema !. I can help you to manage your leave, search an employee, account recovery and create or track your service tickets. Kindly select an option below to continue.",
			session:agent.request_.body.originalDetectIntentRequest.payload.user.userId
		}});				
	}
		
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



			