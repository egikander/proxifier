var http = require('http');
var fs = require('fs');
var url = require('url');

var port = process.argv[2] || 8081;
var template = 'index.html';

var proxyserver_options = {
    host: 'localhost',
    port: 8082
};

var server = http.createServer(function(req, res) {
    var path = url.parse(req.url).pathname;
    if(req.method === 'POST' && path === '/getfile') {
        var body = '';

        req.on('data', function(chunk) {
            body += chunk.toString();
        });

        req.on('end', function() {
            var filename = JSON.parse(body).filename;

            res.writeHead(200, {'Content-type': 'text/plain'});

            var req_opt = {
                hostname: proxyserver_options.host,
                port: proxyserver_options.port,
                path: '/' + filename,
                method: 'GET'
            };

            var request = http.request(req_opt, function(response) {
                var content = '';

                response.on('data', function(chunk) {
                    content += chunk.toString();
                });

                response.on('end', function() {
                    res.end(content);
                });
            });

            request.on('error', function(err) {
                console.log(err);
            });

            request.end();
        });
    } else {
        fs.createReadStream(template).pipe(res);
    }
});

server.listen(port);
console.log('Server running on port: ', port);