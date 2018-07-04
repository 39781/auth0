var express 		= require('express');
var router			= express.Router();	 
var fs 				= require("fs");	
var request			= require('request');
var config			= require('./config.js');
var path			= require("path");	
var url 			= require('url');	
const {google}		= require('googleapis');
const key			= require('./testBot.json');


router.post('/botHandler',function(req, res){		
	var responseObj = JSON.parse(JSON.stringify(config.responseObj));
	console.log(JSON.stringify(req.body));
	var actionName = req.body.queryResult.action;	
	console.log(actionName);
	switch(actionName){		
		case 'input.welcome':func = welcome;break;		
	}
	func(req.body,responseObj)
	.then(function(result){
		console.log(result);
		console.log(JSON.stringify(result));
		res.json(result).end();
	})

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
	res.redirect('https://logintests.herokuapp.com/redirectPage.html?empid='+req.query.empId+'userId='+req.query.userId);	
});

router.post('/accessToken',function(req, res){
	console.log(req.body.url);
	var params = url.parse(req.body.url, true).query;	
	console.log(params);	
	loggedUsers[params.empid] = params.access_token;
	sendConfirmation(params.userId);
	res.status(200);
	res.json(params).end();
})

function sendConfirmation(userId){
	let jwtClient = new google.auth.JWT(
	  key.client_email, null, key.private_key,
	  ['https://www.googleapis.com/auth/actions.fulfillment.conversation'],
	  null
	);
	
	jwtClient.authorize((err, tokens) => {
	  // code to retrieve target userId and intent	  
	  let notif = {  
		title:'loginSuccess'
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
		'body': {'customPushMessage': notif, 'isInSandbox': true},
	  }, (err, httpResponse, body) => {
		  console.log(err,body);
		 console.log(httpResponse.statusCode + ': ' + httpResponse.statusMessage);
	  });
	});
}

var welcome = function(req, responseObj){
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

/*var dialogflowAPI = function(input, sessId){	
	return new Promise(function(resolve, reject){
		var options = { 
			method: 'POST',
			url: config.dialogflowAPI.replace('sessions',sessId),
			headers: {
				"Authorization": "Bearer " + config.accessToken
			},
			body:{			  
			  queryInput: {
				text: {
				  text: input,
				  languageCode: languageCode,
				},
			  },
			};		
			json: true 
		}; 					
		request(options, function (error, response, body) {
			if(error){
				res.json({error:"error in chat server api call"}).end();
			}else{						
				resolve(body);
			}		
		});			
	});
}*/
module.exports = router;



			