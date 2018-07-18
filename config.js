module.exports = {
	adCred:{ 
		url: 'ldap://172.25.180.135:389',
		baseDN: 'dc=pwtest1,dc=com',
		username: 'HRADM@pwtest1.com',
		password: 'Isghelp123'  
	},
	'intents':['Default Welcome Intent','peopleSoft','workDay'],
	accessToken:"fb28796ec675402a99b7a97dd04002a1",	
	dialogFlowAPI:"https://dialogflow.googleapis.com/v2/sessions:detectIntent",
	//dialogFlowAPI:"https://api.api.ai/v1/query?v=20150910",
	appDet:{
		"domainName":"exeter.auth0.com",
		"audience":'http://localhost:3000/auth0/callAPI',
		"authorize":"https://exeter.auth0.com/authorize",
		"responseType":'token id_token',
		"scope":"profile",
		"clientID":"hCg4mx_Cakni2wtASJnKpGcRntBH3ZjN",
		"clientSecret":"BHKd9RjFpywi67W_5LeX9hslKGlpnBh3zOhXE-CowRgIFQXB-ifgIQtnRlEBazlM",
		"redirectUri":'http://localhost:3000/redirectUri',
		'issuer':'https://exeter.auth0.com/',
		'jwksUri':'https://exeter.auth0.com/.well-known/jwks.json',
		'alg':['RS256']
	},
	responseObj: {
	  "payload": {
		"google": {
		  "expectUserResponse": true,
		  "richResponse": {
			"items": []
		  }
		}
	  }
	},
	employees:{
		"39781":{ph:"+917200050085",name:"B+Hari+Prasad%2c"},
		"39754":{ph:"9626649195",name:"V+Hari+Krishna%2c"},
		"37086":{ph:"+917200050085",name:"B+Hari+Prasad%2c"},
	},
	apis:["http://ps92dmo.hexaware.com:8080/PSIGW/RESTListeningConnector/PSFT_HR/HX_LMS_BOT_ABS_DTLS_RST.v1/KU0097"],
	"smsApi":"http://smsapi.24x7sms.com/api_2.0/SendSMS.aspx?APIKEY=ZY2nHm2RiIC&MobileNo=phonenumber&SenderID=TESTIN&Message=Dear+name+the+OTP+to+reset+your+password+is+Otpnumber%2c+valid+only+for+the+next+30++minutes.&ServiceName=TEMPLATE_BASED" 
}



