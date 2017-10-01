var fs = require('fs');
var https = require('https');
var url = require('url');
var PeerServer = require('./lib').PeerServer;

var server = PeerServer({
  port: 9000,
  ssl: {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem'),
    passphrase: 'divyank99'
  }
});

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
  passphrase: 'divyank99'
};

https.createServer(options,function(req,res){
	var q = url.parse(req.url, true);
  	var filename = "." + q.pathname;
  	fs.readFile(filename, function(err, data) {
	    if (err) {
	    	res.writeHead(404, {'Content-Type': 'text/html'});
	      	return res.end("404 Not Found");
	    }  
      //'Content-Type': 'text/html'
	    res.writeHead(200, {});
	    res.write(data);
	    return res.end();
  	});
}).listen(8000);