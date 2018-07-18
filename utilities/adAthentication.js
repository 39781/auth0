var ActiveDirectory = require('activedirectory');

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
	}
}
