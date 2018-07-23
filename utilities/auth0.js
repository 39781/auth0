var ActiveDirectory = require('activedirectory');
var request			= require('request');	
var jwksClient 		= require('jwks-rsa');
var jwt 			= require('jsonwebtoken');
const jwtExp 		= require('express-jwt');
module.exports = {
	authenticateAD : function(config){
		return new Promise(function(resolve, reject){
			console.log(config);
			var ad = new ActiveDirectory(config);			
			var username = config.user.username;
			var password = config.user.password;			
			ad.authenticate(username, password, function(err, auth) {
			  if (err) {
				console.log('ERROR: '+JSON.stringify(err));
				resolve(false);
			  }		  
			  if(auth) {
				  console.log('auth',auth);
				resolve(true);
			  }
			  else {
				resolve(false);
			  }
			});
		});		
	},
	authenticateAuth0AD : function(config,uri){
		return new Promise(function(resolve, reject){
			console.log(config);									
			request.post(uri,{'json': true,'body':config},function(error,response,body){
				if(error){
					console.log('error',error);
					reject(false);
				}else{
					if(body.code == 'invalid_user_password'){
						resolve(false);
					}else{
						resolve(true);
					}
				}
			})
			/*ad.authenticate(username, password, function(err, auth) {
			  if (err) {
				console.log('ERROR: '+JSON.stringify(err));
				resolve(false);
			  }		  
			  if(auth) {
				  console.log('auth',auth);
				resolve(true);
			  }
			  else {
				resolve(false);
			  }
			});*/
		});		
	},
	generateToken:function(config,url){		
		return new Promise(function(resolve, reject){
			var options = {
				json:true,
				body: config
			};			
			request.post(url, options,function (error, response, body) {
				if (error){					
					reject(false);
				}else{
					resolve(body);					
				}		  			
			});	
		});
	},
	isRevokedCallback:function(req, payload, done){
	  var issuer = payload.iss;
	  var tokenId = payload.jti;
	  console.log(tokenId);
	  data.getRevokedToken(issuer, tokenId, function(err, token){
		if (err) { return done(err); }
		return done(null, !!token);
	  });
	},
	checkJwt :function(params){
		return jwtExp({		  
		  secret: jwksClient.expressJwtSecret({
			cache: true,
			rateLimit: true,
			jwksRequestsPerMinute: 5,
			jwksUri: params.jwksUri
		  }),		  
		  audience: params.audience,
		  issuer: params.issuer,
		  algorithms: params.alg
		});
	},
	tokenVerifier:function (params){
		console.log(params);
		var client = jwksClient({
			jwksUri: params.jwksUri
		});
		function getKey(header, callback){
		  client.getSigningKey(header.kid, function(err, key) {
			var signingKey = key.publicKey || key.rsaPublicKey;
			callback(null, signingKey);
		  });
		}
		jwt.verify(params.idToken, getKey, {algorithms:params.alg,issuer:params.issuer,audience:params.audience}, function(err, decoded) {
			if(err){
				console.log(err);
				return false;
			}else{
				console.log(decoded);
				return true;
			}			
		});
	}
}
