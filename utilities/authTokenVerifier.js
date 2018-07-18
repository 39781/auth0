var jwksClient 		= require('jwks-rsa');
var jwt 			= require('jsonwebtoken');
const jwtExp 		= require('express-jwt');
module.exports	=	{
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
		var client = jwksClient({
			jwksUri: params.jwksUri
		});
		function getKey(header, callback){
		  client.getSigningKey(header.kid, function(err, key) {
			var signingKey = key.publicKey || key.rsaPublicKey;
			callback(null, signingKey);
		  });
		}
		jwt.verify(idToken, getKey, {algorithms:params.alg,issuer:params.issuer,audience:params.audience}, function(err, decoded) {
			if(err){
				console.log(err);
				return false;
			}else{
				console.log(decoded);
				return true;
			}			
		});
	},
}