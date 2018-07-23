const { WebhookClient, Card, Payload, Suggestion } = require('dialogflow-fulfillment');
var auth0 = require('./../utilities/auth0.js');
var config = require('./../config.js');
var {Text,Carousel, List,BrowseCarousel, Suggestions} = require('actions-on-google');
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
				console.log('uid',agent.request_.body.originalDetectIntentRequest.payload.user.userId);
				loggedUsers[agent.request_.body.originalDetectIntentRequest.payload.user.userId]['access_token'] = result.access_token;
				agent.setFollowupEvent("gotoMenu");							
				console.log(loggedUsers[agent.request_.body.originalDetectIntentRequest.payload.user.userId]);
			})
			.catch(function(err){
				agent.add(new Text({'text': `Authentication failed due to some technical issue. Try again later`, 'ssml': `<speak>Hi<break time='5s'/>Authentication failed due to some technical issue. Try again later</speak>` }));				
			});			
		}else{
			agent.add(new Text({'text': `you entered invalid OTP/format, please enter valid OTP in correct format(Ex: OTP xxxxxx) `, 'ssml': `<speak>Hi<break time='5s'/>you entered invalid OTP/format, please enter valid OTP in correct format(Ex: OTP xxxxxx)</speak>` }));
		}
	},
	sendResponses:function(agent, messages){
		messages.forEach(function(message){
			if(message.simpleResponses){
				simpleResponses(message.simpleResponses.simpleResponses,agent);
			}
			if(message.listSelect){
				listSelect(message.listSelect, agent);
			}
			if(message.basicCard){
				basicCard(message.basicCard, agent);
			}
			if(message.Carousel){
			}
			if(message.BrowseCarousel){
			}
		})
	}	
}

var simpleResponses = function(simpleRessponse, agent){
	simpleResponse.forEach(function(simpleRes){
		agent.add(new Text({'ssml':simpleRes.textToSpeach,'text':simpleRes.textToSpeach}));
	})
}
/*{
              "info": {
                "key": "HR",
                "synonyms": [
                  "HR Services"
                ]
              },
              "title": "HR Services",
              "description": "for Leave management, Employee Search",
              "image": {}
            },*/
var listSelect = function(listSel, agent){
	var list = {
		title : listSel.title,
		items:{},
	}
	listSel.forEach(function(list){
		if(typeof items[list.info.key] == 'undefined'){
			items[list.info.key] = {};
		}
		items[list.info.key] = {
			synonyms: list.info.synonyms,
			title:list.info.title,
			description:list.info.description,
			image:new Image(list.into.image)
		}
	})
	agent.add(new List(list));
}
 
