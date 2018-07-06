var jwksClient 		= require('jwks-rsa');
var jwt 			= require('jsonwebtoken');

module.exports	=	{
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
	}
}