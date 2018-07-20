var fs = require('fs');

fs.readdir('C:\\Users\\39781\\Downloads\\ESBot\\intents',function(err, files){
	var l = files.length;
	for(i=0;i<l;i++)
	{
		files[i] = files[i].replace('.json','');
	}
	console.log(JSON.stringify(files));
});