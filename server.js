var http = require('http');
var url = require('url');
var fs = require('fs');

http.createServer(function (req, res) {
  var q = url.parse(req.url, true);
  var filename;
  if(q.pathname == '/'){
    filename = "views/index.html";
  }else{
    filename = "views/" + q.pathname + ".html";
  }
  fs.readFile(filename, function(err, data) {
    if(err){
      res.writeHead(404, {'Content-Type': 'text/html'});
      return res.end("404 NOT FOUND");
    }
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();
  });
}).listen(8080);