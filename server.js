var express = require('express');
var app = express();

app.use(express.static('dist'));


app.listen(3000,()=>{
  console.log("3000번 port에 http server를 띄웠습니다.");
})