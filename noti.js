const {google} = require('googleapis');
const key = require('./testBot.json');
var request = require('request');
let jwtClient = new google.auth.JWT(
  key.client_email, null, key.private_key,
  ['https://www.googleapis.com/auth/actions.fulfillment.conversation'],
  null
);

jwtClient.authorize((err, tokens) => {
  // code to retrieve target userId and intent
  console.log(tokens);
  let notif = {   
    target: {
      userId: 'ABwppHHUz6ouuMtf5SSaIFaSffwkOVPPO4_FV_146Yz5wyGfCE03jubmYfdUMbXThrZpjvHDClxvd0U',
      intent: 'loginSuccess',
    },
  };

  request.post('https://actions.googleapis.com/v2/conversations:send', {
    'auth': {
      'bearer': tokens.access_token,
     },
    'json': true,
    'body': {'customPushMessage': notif},
  }, (err, httpResponse, body) => {
	  console.log(err,body);
     console.log(httpResponse.statusCode + ': ' + httpResponse.statusMessage);
  });
});