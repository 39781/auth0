const { WebhookClient, Text, Card, Payload, Suggestion } = require('dialogflow-fulfillment');
var auth0 = require('./../utilities/auth0.js');
var config = require('./../config.js');
module.exports = {
	welcome:function(agent){
		agent.setFollowupEvent("gotoMenu");
	},
	verifyOtp:function(agent){
		//console.log(req.originalDetectIntentRequest.payload.conversation.conversationId);
		//console.log(JSON.stringify(Otps));
		console.log(agent.request_.body.queryResult.parameters.otp);
		if(loggedUsers[agent.request_.body.originalDetectIntentRequest.payload.user.userId].otp == agent.request_.body.queryResult.parameters.otp){					
			return auth0.generateToken(config.microServicesApis.common, config.appDet.tokenEndPoint)
			.then(function(result){
				console.log('result',result);
				loggedUsers[agent.request_.body.originalDetectIntentRequest.payload.user.userId]['access_token'] = result.access_token;
				agent.setFollowupEvent("gotoMenu");							
			})
			.catch(function(err){
				agent.add(new Text({'text': `Authentication failed due to some technical issue. Try again later`, 'ssml': `<speak>Hi<break time='5s'/>Authentication failed due to some technical issue. Try again later</speak>` }));				
			});			
		}else{
			agent.add(new Text({'text': `you entered invalid OTP/format, please enter valid OTP in correct format(Ex: OTP xxxxxx) `, 'ssml': `<speak>Hi<break time='5s'/>you entered invalid OTP/format, please enter valid OTP in correct format(Ex: OTP xxxxxx)</speak>` }));
		}
	}
	
}