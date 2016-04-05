var http = require('http');
var fs = require('fs');

var port = process.argv[2] || 8083;
var filepath = './files';

var fileserver = http.createServer(function(req, res) {
    var filename = req.url;
    var fullpath = filepath + filename;

    res.writeHead(200, {'Content-type': 'text/plain'});

    if(fs.existsSync(fullpath)) {
        console.log('GET ', filename);
        fs.createReadStream(fullpath).pipe(res);
    } else {
        res.end('File not found');
    }
});

fileserver.listen(port);
console.log('Fileserver running on port: ', port)