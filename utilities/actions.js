const { WebhookClient, Text, Card, Payload, Suggestion } = require('dialogflow-fulfillment');
var auth0 = require('./../utilities/auth0.js');
var config = require('./../config.js');

module.exports = {
	welcome:function(agent){
		return {
			"fulfillmentText": '',
			"followupEventInput":{
				"name": "gotoMenu", 
				"parameters" : {},					
			}
		}
	},
	verifyOtp:function(requ){
		//console.log(req.originalDetectIntentRequest.payload.conversation.conversationId);
		//console.log(JSON.stringify(Otps));
		var payload = JSON.parse(JSON.stringify(config.responseObj.payload));
		console.log(requ.body.queryResult.parameters.otp);
		if(loggedUsers[requ.originalDetectIntentRequest.payload.user.userId].otp == requ.queryResult.parameters.otp){					
			return auth0.generateToken(config.microServicesApis.common, config.appDet.tokenEndPoint)
			.then(function(result){
				console.log('result',result);
				console.log('uid',requ.originalDetectIntentRequest.payload.user.userId);
				loggedUsers[requ.originalDetectIntentRequest.payload.user.userId]['access_token'] = result.access_token;
				agent.setFollowupEvent("gotoMenu");							
				console.log(loggedUsers[requ.originalDetectIntentRequest.payload.user.userId]);
			})
			.catch(function(err){
				payload.google.richResponse.items.push({
					simpleResponse:{
						textToSpeach:`Authentication failed due to some technical issue. Try again later`,
						displayText:`Authentication failed due to some technical issue. Try again later`
					}
				});
				return payload;
			});			
		}else{
			payload.google.richResponse.items.push({
				simpleResponse:{
					textToSpeach:`you entered invalid OTP/format, please enter valid OTP in correct format(Ex: OTP xxxxxx) `,
					displayText:`you entered invalid OTP/format, please enter valid OTP in correct format(Ex: OTP xxxxxx)`
				}
			});
			return payload;			
		}
	},
	sendResponses:function(messages){
		var payload = JSON.parse(JSON.stringify(config.responseObj.payload));
		messages.forEach(function(message){
			if(message.simpleResponses){
				simpleResponses(message.simpleResponses.simpleResponses,payload);
			}
			if(message.suggestions){
				suggestions(message.suggestions.suggestions, payload);
			}
			if(message.listSelect){
				listSelect(message.listSelect, payload);
			}
			if(message.basicCard){
				basicCard(message.basicCard, payload);
			}
			if(message.Carousel){
			}
			if(message.BrowseCarousel){
			}
		});
		return payload;		
	}	
}

var simpleResponses = function(simpleResponse, payload){
	simpleResponse.forEach(function(simpleRes){
		payload.google.richResponse.items.push({simpleResponse:simpleRes});
	});	
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
var listSelect = function(listSel, payload){
	var lists = {
		title : listSel.title,
		items:[],
	}
	console.log('list',JSON.stringify(list));
	listSel.items.forEach(function(list){		
		lists.items.push({
			optionInfo:{
				synonyms: list.info.synonyms,
				title:list.info.title,
				description:list.info.description,
				//image:new Image(list.into.image)
			}
		})
	})
	payload.google.systemIntent = {
		"intent": "actions.intent.OPTION",
		"data": {
			"@type": "type.googleapis.com/google.actions.v2.OptionValueSpec",
			"listSelect": list
		}
	}	
}
var suggestions = function(sugges, payload){
	payload.google.richResponse.suggestions = sugges;
}
var carouselSelect = function(listSel, payload){
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
	payload.google.systemIntent = {
		"intent": "actions.intent.OPTION",
		"data": {
			"@type": "type.googleapis.com/google.actions.v2.OptionValueSpec",
			"carouselSelect": {
			  "title": text,
			  "items": items
			}
		}
	}	
}

var basicCard = function(response,text, buttons){
	return new Promise(function(resolve,reject){		
		response.payload.google.richResponse.items.push(
			{"basicCard": {
			  "formattedText": text,			 
			  "buttons": buttons,
			   "image": {},
			}		
		});		
	resolve(response);
	});
}
var basicCard = function(basicCd, payload){
	console.log(basicCd);
//	payload.google.richResponse.items.push()
}
 
