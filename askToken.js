var request = require("request");
modules.export = {
	generateToken:function(config){		
		  var options = {
		  json:true,
		  body: config
		  };
		request.post(config.tokenEndPoint, options,function (error, response, body) {
			if (error){
				return error;
			}else{
				return body;
			}		  			
		});	
	}
}
