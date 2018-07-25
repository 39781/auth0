var express 		= require('express');
var router			= express.Router();	 
var fs 				= require("fs");	
var request			= require('request');
var config			= require('./config.js');
var path			= require("path");	
var url 			= require('url');	
const {google}		= require('googleapis');
const key			= require('./testBot.json');
const auth0			= require('./utilities/auth0.js');
const actions		= require('./utilities/actions.js');
const jwtMiddleware = require('express-jwt')
var jwt 			= require('jsonwebtoken');
var jwksClient 		= require('jwks-rsa');
//const {dialogflow,Suggestions,SimpleResponse} = require('actions-on-google');
const {WebhookClient, Text, Card, Image, Suggestion, Payload, List} = require('dialogflow-fulfillment');
var sessID;



router.use('/auth0', jwtMiddleware({
  secret: jwksClient.expressJwtSecret({
			cache: true,
			rateLimit: true,
			jwksRequestsPerMinute: 5,
			jwksUri: config.appDet.jwksUri
		  }),   
  audience:config.appDet.audience,
  issuer:config.appDet.issuer,
  algorithms:config.alg
}));

router.use(function (err, req, res, next) {
	console.log(err);
  if (err.name === 'UnauthorizedError'||err) {
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
	res.json({
  "google": {
    "expectUserResponse": true,
    "richResponse": {
      "items": [
        {
          "simpleResponse": {
            "textToSpeech": "Kindly select an option below to continue",
            "displayText": "Kindly select an option below to continue"
          }
        }
      ],
      "suggestions": [
        {
          "title": "test1"
        },
        {
          "title": "test2"
        }
      ]
    },
    "systemIntent": {
      "intent": "actions.intent.OPTION",
      "data": {
        "@type": "type.googleapis.com/google.actions.v2.OptionValueSpec",
        "listSelect": {
          "title": "Main Menu",
          "items": [
            {
              "optioninfo": {
                "key": "HR",
                "synonyms": [
                  "HR Services"
                ]
              },
              "title": "HR Services",
              "description": "for Leave management, Employee Search",
              "image": {}
            },
            {
              "optioninfo": {
                "key": "IT",
                "synonyms": [
                  "IT Help Desk"
                ]
              },
              "title": "IT Help Desk",
              "description": "For :  Help desk",
              "image": {}
            },
            {
              "optioninfo": {
                "key": "Meeting",
                "synonyms": [
                  "Meeting scheduler"
                ]
              },
              "title": "Meeting scheduler",
              "description": "For : create meeting, cancel and reschedule meeting",
              "image": {}
            }
          ]
        }
      }
    }
  }
});	
	/*userCheck(req.body)
	.then(function(resp){
		console.log(resp);
		res.status(200);
		res.json(resp).end();
	})
	.catch(function(err){
		res.status(400);
		res.json(err).end();
	})*/
		
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

var userCheck = function(requ){	
	return new Promise(function(resolve, reject){
		console.log(JSON.stringify(requ));
		var uid = requ.originalDetectIntentRequest.payload.user.userId;
		try{
			var userLogged = require('./userLog/'+uid+'.json');
			var options = {
				idToken:loggedUsers[uid].access_token,
				issuer:config.appDet.issuer,
				audience:config.appDet.audience,
				jwksUri:config.appDet.jwksUri
			};
			return auth0.tokenVerifier(options)
			.then(function(result){
				console.log(result);
				console.log(requ.queryResult.action);
				console.log(JSON.stringify(requ.queryResult.fulfillmentMessages));
				switch(requ.queryResult.action){
					case 'input.welcome':resolve(actions.gotoMenu());break;					
					default : resolve(actions.sendResponses(requ.queryResult.fulfillmentMessages));break;
					//default:agent.add(agent.consoleMessages);
				}
			})
			.catch(function(err){
				console.log(err);								
				reject({
					"fulfillmentText": '',
					"followupEventInput":{
						"name": "mainMenu", 
						"parameters" : { 
							text:"You are not a authorized user, please login, Hi I'm Hema !. I can help you to manage your leave, search an employee, account recovery and create or track your service tickets. Kindly select an option below to continue.",
							session:requ.originalDetectIntentRequest.payload.user.userId
						},					
					}
				});
			})
		}catch(err){
			var actionName = requ.queryResult.action;	
			console.log(actionName);	
			respText = "Hi I'm Hema !. I can help you to manage your leave, search an employee, account recovery and create or track your service tickets. Kindly select an option below to continue.";
			if(actionName != 'input.welcome'){
				respText = "Please login!.So I can help you to manage your leave, search an employee, account recovery and create or track your service tickets. Kindly select an option below to continue.";
			}			
			resolve({
				"fulfillmentText": '',
				"followupEventInput":{
					"name": "mainMenu", 
					"parameters" : { 
						text:respText,
						session:requ.originalDetectIntentRequest.payload.user.userId
					}
				}
			});
		}		
	})
}





router.get('/redirectUri',function(req,res){	
	res.redirect('http://ec2-54-172-70-40.compute-1.amazonaws.com:3000/redirectPage.html?sno='+req.query.sno+'&empId='+req.query.empId+'&userId='+req.query.userId);	
});


router.post('/generateAccessToken',function(req, res){
	console.log(req.body.url);
	var params = url.parse(req.body.url, true).query;
	loggedUsers[params.userId] = params		
	console.log('params1',params);
	return auth0.generateToken(config.microServicesApis.common, config.appDet.tokenEndPoint)
	.then(function(result){
		console.log(result);
		loggedUsers[params.userId]['access_token'] = result.access_token;
		fs.writeFile('./userLog/'+params.userId+'.json', JSON.stringify(loggedUsers[params.userId]), 'utf8', function(err){
			if(err){
				res.status(200);
				res.send('close');
				res.end();
			}else{
				res.status(400);
				res.send("Authentication failed due to some technical issue. Try again later");
				res.end();
			}
		});				
	})
	.catch(function(err){
		res.status(400);
		res.send("Authentication failed due to some technical issue. Try again later");
		res.end();
	});
})
//https://github.com/actions-on-google/dialogflow-facts-about-google-nodejs/blob/master/functions/index.js
var testAccessTokenValidation = function(token, peopleSoftAPI){
	request.post('http://ec2-54-172-70-40.compute-1.amazonaws.com:3000/auth0/psMicroService', {
		'auth': {
		  'bearer': token
		 },
		'json': true,
		'body':{api:peopleSoftAPI,type:0}
		}, (err, httpResponse, body) => {
		  console.log(err,body);
		 console.log(httpResponse.statusCode + ': ' + httpResponse.statusMessage);
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



			