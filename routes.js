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
	//console.log(req.params, req.query, req.url, req);
	res.redirect('https://logintests.herokuapp.com/redirect.html?empid='+req.query.empId);	
});

router.post('/accessToken',function(req, res){
	console.log(req.body.url);
	var params = url.parse(req.body.url, true).query;	
	console.log(params);
	sendNotification('ABwppHHUz6ouuMtf5SSaIFaSffwkOVPPO4_FV_146Yz5wyGfCE03jubmYfdUMbXThrZpjvHDClxvd0U');
	res.status(200);
	console.log('<script language="javascript">parentwin = window.self;parentwin.opener = window.self;parentwin.close();</script>');
	res.send('<script language="javascript">function closeWin(){parentwin = window.self;parentwin.opener = window.self;parentwin.close();}closeWin();</script>');
	res.end();
})

function sendNotification(userId){
	let jwtClient = new google.auth.JWT(
	  key.client_email, null, key.private_key,
	  ['https://www.googleapis.com/auth/actions.fulfillment.conversation'],
	  null
	);
	jwtClient.authorize((err, tokens) => {
	  // code to retrieve target userId and intent
	  console.log(tokens);
	  let notif = {   
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
		'body': {'customPushMessage': notif},
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
					"name":"welcomeIntent",
					"parameters":{ 						
						userId :'ABwppHHUz6ouuMtf5SSaIFaSffwkOVPPO4_FV_146Yz5wyGfCE03jubmYfdUMbXThrZpjvHDClxvd0U',						
					}
				}
			}
			resolve(responseObj);		
	});
}
module.exports = router;



			