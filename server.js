var http = require('http');
var url = require('url');
var fs = require('fs');
var mysql = require('mysql');

http.createServer(function (req, res) {
  if(req.url.match("\.html$")){
    var htmlPath = "./" + req.url;
    fs.readFile(htmlPath, "UTF-8", function(err, data){
      if(err){
        throw err;
      }
      res.writeHead(200, {"Content-Type": "text/html"});
      res.end(data);
    });
  }else if(req.url.match("\.css$")){
      var cssPath = "./" + req.url;
      var fileStream = fs.createReadStream(cssPath, "UTF-8");
      res.writeHead(200, {"Content-Type": "text/css"});
      fileStream.pipe(res);
  }else if(req.url.match("\.js$")){
      var jsPath = "./" + req.url;
      var fileStream = fs.createReadStream(jsPath);
      res.writeHead(200, {"Content-Type": "text/javascript"});
      fileStream.pipe(res);
  }
  
}).listen(8080);