module.exports = {
	microServicesApis:{
		psMicroService:{
			  "client_id":"6Wj4uUq00IpauFR02kyY9fehZIzzlKwL",
			  "client_secret":"YL4Zezuum3Bo_E-5okTDAkRS0mAqGluDwqYIJNkN2IgdIIXcuuU2iu727RugFgc4",
			  "audience":"https://logintests.herokuapp.com/auth0/psMicroService/",
			  "grant_type":"client_credentials"
		},
		common:{
			"client_id":"hCg4mx_Cakni2wtASJnKpGcRntBH3ZjN",
			"client_secret":"BHKd9RjFpywi67W_5LeX9hslKGlpnBh3zOhXE-CowRgIFQXB-ifgIQtnRlEBazlM",
			"audience":"https://exeter.auth0.com/api/v2/",
			"grant_type":"client_credentials"
		}
	},
	auth0ADlogin:"https://exeter.auth0.com/usernamepassword/login",
	adAuthObj:{
		"client_id":"jH-1grnSlMloFGvd8-6l-oF9r0FQtdXZ",
		"redirect_uri":"",
		"tenant":"exeter",
		"response_type":"code",
		"connection":"Test",
		"username":"Deb",
		"password":"test",
		"login_hint":"Deb",
		"sso":true,
		"state":"FoKiDZ0dsB7b5wnH2HWd_dPHzC74va6g",
		"protocol":"oauth2",
		"prompt":"none","scope":"openid profile",
		"_csrf":"feyUGgXX-wo3Q_FJ2Glj_roRxNznWpw-dYhs",
		"_intstate":"deprecated"
		},
	adCred:{ 
		url: 'ldap://172.25.180.135:389',
		baseDN: 'dc=pwtest1,dc=com',
		username: 'HRADM@pwtest1.com',
		password: 'Isghelp123'  
	},
	'intents':["ABOUT ME","ABOUT ME_usersays_en","ApplyLeave - custom - custom - no","ApplyLeave - custom - custom - no_usersays_en","ApplyLeave - custom - custom - yes","ApplyLeave - custom - custom - yes_usersays_en","ApplyLeave - custom - custom","ApplyLeave - custom - custom_usersays_en","ApplyLeave - custom","ApplyLeave - custom_usersays_en","ApplyLeave","ApplyLeave_usersays_en","ART_Welcome_intent","ART_Welcome_intent_usersays_en","cancelMeeting - custom - custom","cancelMeeting - custom - custom_usersays_en","cancelMeeting - custom","cancelMeeting - custom_usersays_en","cancelMeeting","cancelMeeting_usersays_en","CANCEL_EXIT","CANCEL_EXIT_usersays_en","CHECK INCIDENT Status_Menu","CHECK INCIDENT Status_Menu_usersays_en","CHECK SERVICE REQUEST STATUS BY ID","CHECK SERVICE REQUEST STATUS BY ID_usersays_en","Check_Incident_Status_ByID","Check_Incident_Status_ByID_usersays_en","COMMON STATUS QUERY","COMMON STATUS QUERY_usersays_en","Contact Us - Call","Contact Us - Call_usersays_en","Contact Us - Email","Contact Us - Email_usersays_en","Contact_Us_List","Contact_Us_List_usersays_en","CREATE_INCIDENT","CREATE_INCIDENT_usersays_en","Default Fallback Intent","Default Welcome Intent","employee search","employee search_usersays_en","Enroll user","Enroll user_usersays_en","fallback","getHoliday","getHoliday_usersays_en","goToMenu","goToMenu_usersays_en","Help Desk","Help Desk_usersays_en","HR self service menu","HR self service menu_usersays_en","INCIDENT CREATION WEBHOOK","INCIDENT CREATION WEBHOOK_usersays_en","INCIDENT DESCRIPTION","INCIDENT DESCRIPTION_usersays_en","INCIDENT","INCIDENT_usersays_en","IT self service menu","IT self service menu_usersays_en","LeaveBalance","LeaveBalance_usersays_en","leaveStatus","leaveStatus_usersays_en","loginSuccess","loginSuccess_usersays_en","mainMenu","mainMenu_usersays_en","Meeting_main_menu","Meeting_main_menu_usersays_en","Order - custom","Order - custom_usersays_en","Order","Order_usersays_en","other user queries - ip address","other user queries - ip address_usersays_en","other user queries - New Software","other user queries - New Software_usersays_en","other user queries - Outlook on mobile - Android","other user queries - Outlook on mobile - Android_usersays_en","other user queries - Outlook on mobile - iphone","other user queries - Outlook on mobile - iphone_usersays_en","other user queries - Outlook on mobile - other","other user queries - Outlook on mobile - other_usersays_en","other user queries - Outlook on mobile","other user queries - Outlook on mobile_usersays_en","other user queries - Random Question","other user queries - Random Question_usersays_en","other user queries","other user queries_usersays_en","Password change","Password change_usersays_en","password","password_usersays_en","rescheduleMeeting - custom - custom - custom","rescheduleMeeting - custom - custom - custom_usersays_en","rescheduleMeeting - custom - custom","rescheduleMeeting - custom - custom_usersays_en","rescheduleMeeting - custom","rescheduleMeeting - custom_usersays_en","rescheduleMeeting","rescheduleMeeting_usersays_en","Reset the password","Reset the password_usersays_en","scheduleMeeting - custom - custom - custom - custom - custom","scheduleMeeting - custom - custom - custom - custom - custom_usersays_en","scheduleMeeting - custom - custom - custom - custom","scheduleMeeting - custom - custom - custom - custom_usersays_en","scheduleMeeting - custom - custom - custom","scheduleMeeting - custom - custom - custom_usersays_en","scheduleMeeting - custom - custom","scheduleMeeting - custom - custom_usersays_en","scheduleMeeting - custom","scheduleMeeting - custom_usersays_en","scheduleMeeting","scheduleMeeting_usersays_en","SERVICE STATUS MENU","SERVICE STATUS MENU_usersays_en","SERVICE","SERVICE_usersays_en","SHOW ALL OPEN INCIDENTS","SHOW ALL OPEN INCIDENTS_usersays_en","SHOW ALL OPEN SERVICE REQUESTS","SHOW ALL OPEN SERVICE REQUESTS_usersays_en","test","tester","tester_usersays_en","test_usersays_en","Under Development - VPN O365","Under Development - VPN O365_usersays_en","Unlockaccount","Unlockaccount_usersays_en","user account unlock","user account unlock_usersays_en","User enrollment","User enrollment_usersays_en","USER PROBLEM","USER PROBLEM_usersays_en","verify-OTP","verify-OTP_usersays_en","verifyOtp","verifyOtp_usersays_en","viewMeeting - custom","viewMeeting - custom_usersays_en","viewMeeting","viewMeeting_usersays_en","welcome_outh","welcome_outh_usersays_en"],
	//accessToken:"fb28796ec675402a99b7a97dd04002a1",	
	accessToken:"77c91266c3f8472d90a51c1ad9d5af70",
	dialogFlowAPI:"https://dialogflow.googleapis.com/v2/sessions:detectIntent",
	//dialogFlowAPI:"https://api.api.ai/v1/query?v=20150910",
	appDet:{
		"domainName":"exeter.auth0.com",
		"audience":'https://exeter.auth0.com/api/v2/',
		"authorize":"https://exeter.auth0.com/authorize",
		"tokenEndPoint":"https://exeter.auth0.com/oauth/token",
		"responseType":'token id_token',
		"scope":"profile",
		"clientID":"hCg4mx_Cakni2wtASJnKpGcRntBH3ZjN",
		"clientSecret":"BHKd9RjFpywi67W_5LeX9hslKGlpnBh3zOhXE-CowRgIFQXB-ifgIQtnRlEBazlM",
		"redirectUri":'https://logintests.herokuapp.com/redirectUri',
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
		"deb":{ph:"+917200050085",name:"B+Hari+Prasad%2c"}
	},
	apis:["http://ps92dmo.hexaware.com:8080/PSIGW/RESTListeningConnector/PSFT_HR/HX_LMS_BOT_ABS_DTLS_RST.v1/KU0097"],
	"smsApi":"http://smsapi.24x7sms.com/api_2.0/SendSMS.aspx?APIKEY=ZY2nHm2RiIC&MobileNo=phonenumber&SenderID=TESTIN&Message=Dear+name+the+OTP+to+reset+your+password+is+Otpnumber%2c+valid+only+for+the+next+30++minutes.&ServiceName=TEMPLATE_BASED" 
}



