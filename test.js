var jwt 			= require('jsonwebtoken');

 
// get the decoded payload and header
var decoded = jwt.decode('GmSNvhxf4EIsB3Makfvy49ScVz0icVgJ', {complete: true});
//console.log(decoded.header);
console.log(decoded)