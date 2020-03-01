var express = require('express');
var app = express();

const jsonInput = {
  "numGroups": 2,
  "groups":[
      {
          "name" : "운영체제",
          "firstIdx": [0,0],
          "numCrs": [1,1,0],
          "courses": [
              [
                  {
                      "id": "F028",
                      "lecTime": "수B 금B"
                  }
              ],
              [
                  {
                      "id": "F058",
                      "lecTime": "월C 수C"
                  }
              ],
              [

              ]
          ]
      },
      {
          "name" : "도분설",
          "firstIdx": [0,0],
          "numCrs": [1,1,0],
          "courses": [
              [
                  {
                      "id": "F001",
                      "lecTime": "월B 수B"
                  }
              ],
              [
                  {
                      "id": "F002",
                      "lecTime": "월C 수B"
                  }
              ],
              [

              ]
          ]
      }
  ]
}

app.use(express.static('dist'));

app.get('/registration',(req,res)=>{
  res.send(JSON.stringify(jsonInput));
})


app.listen(3000,()=>{
  console.log("3000번 port에 http server를 띄웠습니다.");
})