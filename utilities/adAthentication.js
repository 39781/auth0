var ActiveDirectory = require('activedirectory');
var request			= require('request');	
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
	}
}
