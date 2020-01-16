var http = require('http');
var url = require('url');
var fs = require('fs');

http.createServer(function (req, res) {
  if(req.url === "/"){
    fs.readFile("./views/index.html", "UTF-8", function(err, data){
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(data);
    });
  }else if(req.url === "/registration"){
    fs.readFile("./views/registration.html", "UTF-8", function(err, data){
      res.writeHead(200, {"Content-Type": "text/html"});
      res.end(data);
  });

  }else if(req.url.match("\.css$")){
      var cssPath = "./views/" + req.url;
      var fileStream = fs.createReadStream(cssPath, "UTF-8");
      res.writeHead(200, {"Content-Type": "text/css"});
      fileStream.pipe(res);

  }else if(req.url.match("\.js$")){
      var jsPath = "./views/" + req.url;
      var fileStream = fs.createReadStream(jsPath);
      res.writeHead(200, {"Content-Type": "text/javascript"});
      fileStream.pipe(res);
  }else{
    var filename = "views/" + req.url;
    fs.readFile(filename, function(err, data) {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);
      res.end();
    });
  }
  
}).listen(8080);