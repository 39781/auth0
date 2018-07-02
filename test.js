var request = require("request");

var options = { method: 'POST',
  url: 'https://exeter.auth0.com/co/authenticate',
  headers: 
   { 'postman-token': '1de7f9da-b1ff-6cc9-03f7-901aa5627165',
     'cache-control': 'no-cache',
     'content-type': 'application/json',
	'Access-Control-Allow-Origin': '*'	 },
  body: '{"client_id":"hCg4mx_Cakni2wtASJnKpGcRntBH3ZjN", "connection":"sms",  "phoneNumber":"+917200050085", "verificationCode":"329961"}' };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
