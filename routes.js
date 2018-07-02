var express 		= require('express');
var router			= express.Router();	 
var fs 				= require("fs");	
var request			= require('request');
var config			= require('./config.js');
var path			= require("path");	
var url 			= require('url');	
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
	res.redirect('redirect.html?empid='+req.query.empId);	
});

router.post('/accessToken',function(req, res){
	console.log(req.body.url);
	var params = url.parse(req.body.url, true).query;	
	console.log(params);
	res.status(200);
	res.end();
})

module.exports = router;



			