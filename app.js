const express = require('express')();
const router = require('express').Router();
const bodyParser = require('body-parser');
const {WebhookClient, Card, Suggestion} = require('dialogflow-fulfillment');
const {Permission} = require('actions-on-google');


express.use(bodyParser.json({type: 'application/json'}));

// In aip.ai console, under Fulfillment set webhook url to
// https://[YOUR DOMAIN]/example/location
// don't forget to select "Enable webhook for all domains" for the DOMAIN field
router.post('/botHandler', (req, res) => {
	const agent = new WebhookClient({request: req, response: res});
	
	function intentHandler(agent) {
		let conv = agent.conv();
		conv.ask(new Permission({
		  context: 'To give results in your area',
		  permissions: 'DEVICE_PRECISE_LOCATION',
		}))
		agent.add(conv);
	}	

  agent.handleRequest(intentHandler);
	
	/*switch(intent){
		case 'input.welcome':
			// you are able to request for multiple permissions at once
			const permissions = [
				app.SupportedPermissions.NAME,
				app.SupportedPermissions.DEVICE_PRECISE_LOCATION
			];
			app.askForPermissions('Your own reason', permissions);
		break;
		case 'DefaultWelcomeIntent.DefaultWelcomeIntent-fallback':
			if (app.isPermissionGranted()) {
				// permissions granted.
				let displayName = app.getUserName().displayName;
				
				//NOTE: app.getDeviceLocation().address always return undefined for me. not sure if it is a bug.
				// 			app.getDeviceLocation().coordinates seems to return a correct values
				//			so i have to use node-geocoder to get the address out of the coordinates
				let coordinates = app.getDeviceLocation().address;
				
				app.tell('Hi ' + app.getUserName().givenName + '! Your address is ' + address);
			}else{
				// permissions are not granted. ask them one by one manually
				app.ask('Alright. Can you tell me you address please?');
			}
		break;
	}*/
});

express.use(router);
var port = process.env.PORT || 3000;
express.listen(port, function () {
  console.log('Example app is running')
})