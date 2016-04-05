var http = require('http');
var url = require('url');

var fileserver_options = {
    host: 'localhost',
    port: 8083
};

var port = process.argv[2] || 8082;

var proxy_server = http.createServer(function(req, res) {

    var path = url.parse(req.url).pathname;

    logger(req);

    var req_opt = {
        hostname: fileserver_options.host,
        port: fileserver_options.port,
        path: path,
        method: 'GET'
    };

    var fileserver_request = http.request(req_opt, function(response) {
        response.pipe(res, {end: true});
    });

    req.pipe(fileserver_request, {end: true});
});

proxy_server.listen(port);
console.log('Proxy server running on port: ', port);

function logger(request) {
    var dt = new Date().toString();
    console.log('[' + dt + '] Request: ' + request.url);
}